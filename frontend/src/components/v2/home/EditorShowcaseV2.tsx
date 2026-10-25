import { useLayoutEffect, useRef, useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { ShowcaseSidebar } from "@/components/v2/home/showcase/ShowcaseSidebar";
import { ShowcaseEditorPane } from "@/components/v2/home/showcase/ShowcaseEditorPane";
import { ShowcasePreview } from "@/components/v2/home/showcase/ShowcasePreview";
import {
  SHOWCASE_HEIGHT,
  SHOWCASE_SCALE,
  SHOWCASE_WIDTH,
} from "@/components/v2/home/showcase/showcase-data";

export function EditorShowcaseV2() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(SHOWCASE_SCALE);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setScale(Math.min(SHOWCASE_SCALE, width / SHOWCASE_WIDTH));
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const displayWidth = SHOWCASE_WIDTH * scale;
  const displayHeight = SHOWCASE_HEIGHT * scale;

  return (
    <section aria-label="Editor preview" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 h-72 w-2/3 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-56 w-1/3 rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <FadeIn y={24}>
          <div ref={containerRef} className="w-full">
            <div
              className="mx-auto overflow-hidden rounded-xl border border-border/60 bg-background shadow-[0_30px_80px_-24px_rgba(0,0,0,0.35),0_0_0_1px_rgba(0,0,0,0.03)]"
              role="img"
              aria-label="Preview of the CVStack resume editor showing the personal information form and an A4 Engineering resume preview"
              style={{ width: displayWidth }}
            >
              <div className="flex h-9 items-center gap-3 bg-muted/50 px-4">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="flex-1 truncate text-center text-[11px] font-medium tracking-wide text-muted-foreground">
                  CVStack — Resume Editor
                </span>
                <span className="w-[42px]" />
              </div>

              <div
                className="relative overflow-hidden bg-background"
                style={{ width: displayWidth, height: displayHeight }}
              >
                <div
                  aria-hidden="true"
                  inert
                  className="pointer-events-none flex select-none bg-background"
                  style={{
                    width: SHOWCASE_WIDTH,
                    height: SHOWCASE_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <ShowcaseSidebar />
                  <div className="grid min-w-0 flex-1 grid-cols-2">
                    <ShowcaseEditorPane />
                    <ShowcasePreview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
