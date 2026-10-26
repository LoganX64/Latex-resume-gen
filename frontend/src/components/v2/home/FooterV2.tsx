import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { Icon } from "@/components/Icon";
import { SunIcon } from "@/components/SunIcon";
import { MoonIcon } from "@/components/MoonIcon";
import { toggleThemeFromButton } from "@/lib/theme-transition";
import {
  faArrowLeft,
  faEnvelope,
  faGithub,
  faShieldHalved,
  faWandSparkles,
} from "@/lib/icons";

const githubUrl =
  import.meta.env.VITE_GITHUB_URL ||
  "https://github.com/LoganX64/Latex-resume-gen";

const productLinks = [
  { label: "Features", href: "#features-v2-heading" },
  { label: "Templates", href: "/editor" },
  { label: "How it works", href: "#steps-v2-heading" },
  { label: "Your Resumes", href: "#your-resumes" },
];

const resourceLinks = [
  { label: "GitHub", href: githubUrl, external: true },
  {
    label: "Contact",
    href: "mailto:kpjitin@gmail.com?subject=LaTeX%20Resume%20Enquiry",
    external: false,
  },
  {
    label: "Report a bug",
    href: "mailto:kpjitin@gmail.com?subject=LaTeX%20Resume%20Enquiry",
    external: false,
  },
  { label: "Privacy", href: "#features-v2-heading", external: false },
];

export function FooterV2() {
  const { darkMode, toggleDarkMode } = useTheme();
  const reduceMotion = useReducedMotion();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden bg-[#2a0b16] text-white/60">
      <div
        aria-hidden="true"
        className="h-8 rounded-b-[2rem] bg-background sm:h-10 sm:rounded-b-[2.5rem]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-14 sm:grid-cols-2 sm:gap-10 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="max-w-sm sm:col-span-2 lg:col-span-6">
            <Link
              to="/"
              aria-label="CVStack home"
              className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
            >
              <img
                src="/cvstack-logo-dark.svg"
                alt="CVStack"
                className="h-7 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-76 text-[13px] leading-relaxed text-white/50">
              Professional, ATS-friendly resumes with LaTeX-quality typesetting
              — built privately in your browser.
            </p>
            <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-rose-400/25 bg-rose-500/10 px-2.5 py-1 text-[11px] text-rose-100/80">
              <Icon icon={faShieldHalved} className="h-3 w-3 text-rose-400" />
              100% local &amp; private
            </div>
          </div>

          <nav aria-label="Product" className="lg:col-span-2 lg:col-start-7">
            <h2 className="text-xs font-semibold text-white">Product</h2>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      className="inline-flex text-xs text-white/55 transition-colors hover:text-rose-300 focus-visible:outline-none focus-visible:text-rose-300"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="inline-flex text-xs text-white/55 transition-colors hover:text-rose-300 focus-visible:outline-none focus-visible:text-rose-300"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources" className="lg:col-span-2 lg:col-start-9">
            <h2 className="text-xs font-semibold text-white">Resources</h2>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-1.5 text-xs text-white/55 transition-colors hover:text-rose-300 focus-visible:outline-none focus-visible:text-rose-300"
                  >
                    {link.label === "GitHub" && (
                      <Icon icon={faGithub} className="h-3.5 w-3.5" />
                    )}
                    {link.label === "Contact" && (
                      <Icon icon={faEnvelope} className="h-3 w-3" />
                    )}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center gap-6 border-t border-white/10 py-6 sm:grid sm:grid-cols-3 sm:gap-4">
          <p className="order-2 text-center text-[11px] text-white/45 sm:order-1 sm:text-left">
            © {new Date().getFullYear()} CVStack. Built with LaTeX, React &amp;
            Tectonic.
          </p>

          <div className="order-1 flex w-full items-center justify-center sm:order-2 sm:w-auto">
            <div className="flex items-center gap-0.5 rounded-full bg-white p-1 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
              >
                <Icon icon={faArrowLeft} className="h-3 w-3" />
                Back to top
              </button>

              <span aria-hidden="true" className="h-4 w-px bg-neutral-200" />

              <button
                type="button"
                onClick={(event) =>
                  toggleThemeFromButton(event.currentTarget, toggleDarkMode)
                }
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
                className="inline-flex size-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50"
              >
                {darkMode ? (
                  <SunIcon className="h-3.5 w-3.5" />
                ) : (
                  <MoonIcon className="h-3.5 w-3.5" />
                )}
              </button>

              <Link
                to="/editor"
                className="ml-0.5 inline-flex h-8 items-center gap-1.5 rounded-full bg-[#e23d63] px-3.5 text-[11px] font-semibold text-white shadow-sm transition-colors hover:bg-[#ed5a7b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <Icon icon={faWandSparkles} className="h-3 w-3" />
                Build Resume
              </Link>
            </div>
          </div>

          <p className="order-3 flex items-center gap-1.5 text-[11px] text-white/45 sm:justify-self-end">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-rose-400"
            />
            Privacy-first
          </p>
        </div>
      </div>
    </footer>
  );
}
