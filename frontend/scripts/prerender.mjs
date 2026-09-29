/**
 * Build-time prerendering for crawlers and link unfurlers.
 *
 * The SPA ships an empty `#root` in index.html, so any client that does not run
 * JavaScript (social scrapers, most AI crawlers, link previews) sees a blank
 * page. This visits each public route in headless Chromium after `vite build`
 * and writes the rendered DOM back into `dist/`, where Vercel serves it as a
 * static file.
 *
 * Routes prerendered here must exist as real files in dist/ so the
 * `handle: filesystem` rule in vercel.json wins before the 404 catch-all.
 */

import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "..", "dist");

/**
 * Viewport must stay above the 768px breakpoint in src/hooks/use-mobile.ts.
 * Below it, `useIsMotionDisabled()` returns true and motion components render
 * plain markup — which would desync the captured DOM from the real page.
 */
const VIEWPORT = { width: 1280, height: 900 };

/**
 * Only routes that should be indexable belong here. `/editor` and `/admin/stats`
 * are disallowed in robots.txt and intentionally left unprerendered — the
 * 404 catch-all would otherwise serve them a not-found page.
 *
 * Each route carries its own assertions, so a failure names the page that broke.
 */
const ROUTES = [
  {
    path: "/",
    out: "index.html",
    assert: [
      { name: "has an <h1>", test: (h) => /<h1[\s>]/i.test(h) },
      {
        name: "contains homepage copy",
        test: (h) => h.includes("Build a") && h.includes("Professional"),
      },
    ],
  },
  {
    path: "/404",
    out: "404.html",
    /**
     * index.html ships static <title>, canonical, and robots tags. React 19
     * hoists its own equivalents for this route but does not remove the static
     * ones, so a naive capture yields two titles, two robots metas, and a
     * canonical pointing at the homepage — telling Google a missing page *is*
     * the homepage. Strip the static originals so only the route's own tags
     * survive.
     */
    stripStaticHead: true,
    assert: [
      { name: "has an <h1>", test: (h) => /<h1[\s>]/i.test(h) },
      {
        name: "contains not-found copy",
        test: (h) => h.includes("Page not found") || h.includes("404"),
      },
      {
        name: "declares noindex",
        test: (h) => /<meta[^>]+name="robots"[^>]+content="noindex/i.test(h),
      },
      {
        name: "has exactly one title",
        test: (h) => (h.match(/<title[\s>]/gi) ?? []).length === 1,
      },
      {
        // Guards the ordering trap: React places its <title> before the static
        // one but its <meta robots> after, so naive "last wins" dedupe keeps
        // the homepage title here.
        name: "title is route-specific",
        test: (h) => /<title[^>]*>[^<]*Page not found/i.test(h),
      },
      {
        name: "has exactly one robots meta",
        test: (h) => (h.match(/<meta[^>]+name="robots"/gi) ?? []).length === 1,
      },
      {
        name: "has no homepage canonical",
        test: (h) => !/rel="canonical"[^>]*latex-resume-gen\.vercel\.app\/"/i.test(h),
      },
    ],
  },
];

/** Applied to every route. */
const COMMON_ASSERTIONS = [
  { name: "contains <title>", test: (h) => /<title[^>]*>.+?<\/title>/is.test(h) },
  {
    name: "no invisible content",
    // Ignore decorative low-opacity layers; only flag content that would never
    // become visible on a real client.
    test: (h) => {
      const stuck = h.match(
        /<(section|main|h1|h2|p)\b[^>]*style="[^"]*opacity:\s*0(?![\d.])[^"]*"[^>]*>/gi
      );
      return !stuck;
    },
  },
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

/**
 * Mirrors the production catch-all: real files win, everything else falls back
 * to the SPA shell so client-side routes resolve.
 */
function serveStatic() {
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const candidate = join(DIST, urlPath);

    // Guard against path traversal outside dist/.
    if (candidate.startsWith(DIST) && statSync(candidate, { throwIfNoEntry: false })?.isFile()) {
      res.writeHead(200, {
        "Content-Type": MIME[extname(candidate)] ?? "application/octet-stream",
      });
      res.end(readFileSync(candidate));
      return;
    }

    res.writeHead(200, { "Content-Type": MIME[".html"] });
    res.end(readFileSync(join(DIST, "index.html")));
  });

  return new Promise((ok) => {
    server.listen(0, "127.0.0.1", () => ok({ server, port: server.address().port }));
  });
}

/**
 * Elements revealed by IntersectionObserver keep `opacity: 0` in the DOM until
 * scrolled into view. Serializing without this pass bakes invisible content
 * into the static HTML, so crawlers index a blank page that looks fine in a
 * browser.
 */
async function revealLazyContent(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    const total = () => document.documentElement.scrollHeight;
    for (let y = 0; y < total(); y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
  });
}

/** Returns the value of `attr` in a raw tag string, or "" when absent. */
function readAttr(tag, attr) {
  const m = tag.match(new RegExp(`\\b${attr}="([^"]*)"`, "i"));
  return m ? m[1] : "";
}

/**
 * Collects the <title> text and robots meta content that ship statically in
 * index.html, so routes declaring their own can drop the inherited versions.
 *
 * Values are compared rather than raw tag strings: a self-closing
 * `<meta ... />` in the file serializes as `<meta ...>` once it round-trips
 * through the DOM, so exact-string matching would silently never match.
 *
 * Matching on values also sidesteps insertion order — React 19 places its
 * hoisted <title> before the static one but its <meta robots> after, so
 * "first wins" and "last wins" are each right for one tag type and wrong for
 * the other.
 */
function readStaticHead() {
  const html = readFileSync(join(DIST, "index.html"), "utf8");
  const titles = new Set();
  const robots = new Set();

  for (const m of html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)) {
    titles.add(m[1]);
  }
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (/name="robots"/i.test(m[0])) robots.add(readAttr(m[0], "content"));
  }
  return { titles, robots };
}

/**
 * Removes the inherited head tags so a route's React-managed equivalents are the
 * only ones in the output.
 *
 * Canonical is always removed: a not-found route emits no canonical of its own,
 * and pointing a missing page at the homepage is the exact error this prevents.
 */
function stripStaticHead(html, staticHead) {
  let out = html.replace(/<link[^>]*rel="canonical"[^>]*\/?>/gi, "");

  out = out.replace(/<title[^>]*>([\s\S]*?)<\/title>/gi, (tag, text) =>
    staticHead.titles.has(text) ? "" : tag
  );
  out = out.replace(/<meta\b[^>]*>/gi, (tag) =>
    /name="robots"/i.test(tag) && staticHead.robots.has(readAttr(tag, "content"))
      ? ""
      : tag
  );
  return out;
}

function assertRendered(route, html) {
  const failures = [...COMMON_ASSERTIONS, ...(route.assert ?? [])]
    .filter((a) => !a.test(html))
    .map((a) => a.name);

  if (failures.length) {
    throw new Error(
      `Prerender assertion failed for ${route.path}: ${failures.join(", ")}.\n` +
        `Captured ${html.length} bytes. Refusing to write a broken page.`
    );
  }
}

async function main() {
  const indexPath = join(DIST, "index.html");
  if (!existsSync(indexPath)) {
    throw new Error(`dist/index.html not found at ${indexPath}. Run \`vite build\` first.`);
  }

  // Prerendering is only valid against a fresh vite build. Re-running against an
  // already-prerendered index.html would re-capture the rendered DOM and grow the
  // file on every pass, so refuse instead of shipping bloated, nested markup.
  if (!/<div id="root"><\/div>/.test(readFileSync(indexPath, "utf8"))) {
    throw new Error(
      "dist/index.html already contains rendered markup — it looks prerendered.\n" +
        "Run a full build (`pnpm run build`) rather than this script alone."
    );
  }

  const { server, port } = await serveStatic();
  const staticHead = readStaticHead();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const captured = [];

  try {
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    for (const route of ROUTES) {
      const url = `http://127.0.0.1:${port}${route.path}`;
      console.log(`[prerender] ${route.path}`);

      await page.goto(url, { waitUntil: "networkidle0", timeout: 60_000 });

      // Wait on a real signal, not a fixed timeout — a slow CI runner would
      // otherwise capture an empty shell.
      await page.waitForFunction(
        () => {
          const el = document.querySelector("#root");
          return el && el.children.length > 0 && document.title.length > 0;
        },
        { timeout: 45_000 }
      );

      await revealLazyContent(page);

      const raw = await page.evaluate(() => document.documentElement.outerHTML);
      const html = route.stripStaticHead ? stripStaticHead(raw, staticHead) : raw;

      assertRendered(route, html);
      captured.push({ out: route.out, html });
    }
  } finally {
    await browser.close();
    server.close();
  }

  for (const { out, html } of captured) {
    const dest = join(DIST, out);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, html, "utf8");
    console.log(`[prerender] wrote ${out} (${html.length} bytes)`);
  }

  console.log(`[prerender] ${captured.length}/${ROUTES.length} routes rendered`);
}

main().catch((err) => {
  console.error(`\n[prerender] FAILED: ${err.message}\n`);
  process.exit(1);
});
