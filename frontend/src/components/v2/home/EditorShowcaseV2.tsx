import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";
import { createStepClock, type StepClock } from "@/lib/step-clock";
import { loadTemplate } from "@/templates";
import { ShowcaseSidebar } from "@/components/v2/home/showcase/ShowcaseSidebar";
import { ShowcaseEditorPane } from "@/components/v2/home/showcase/ShowcaseEditorPane";
import { ShowcasePreview } from "@/components/v2/home/showcase/ShowcasePreview";
import {
  HIDDEN_SHOWCASE_CURSOR,
  ShowcaseCursor,
  type ShowcaseCursorState,
} from "@/components/v2/home/showcase/ShowcaseCursor";
import {
  SHOWCASE_HEIGHT,
  SHOWCASE_SCALE,
  SHOWCASE_WIDTH,
} from "@/components/v2/home/showcase/showcase-data";

const SHOWCASE_TIMING = {
  initialHold: 1400,
  moveToSidebar: 1100,
  moveToPreview: 1200,
  moveToOption: 800,
  press: 150,
  scrollStart: 300,
  scrollSettle: 2400,
  menuOpen: 420,
  menuClose: 300,
  hover: 300,
  templateSettle: 2400,
  dataScienceHold: 2600,
  loopHold: 900,
} as const;

type LoopContext = {
  wait: (ms: number) => Promise<boolean>;
  isCancelled: () => boolean;
};

function useShowcaseLoop({
  enabled,
  paused,
  run,
}: {
  enabled: boolean;
  paused: boolean;
  run: (context: LoopContext) => Promise<void>;
}) {
  const runRef = useRef(run);
  runRef.current = run;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const clockRef = useRef<StepClock | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const clock = createStepClock();
    clock.setPaused(pausedRef.current);
    clockRef.current = clock;
    let cancelled = false;

    void runRef
      .current({
        wait: (ms) => clock.wait(ms),
        isCancelled: () => cancelled,
      })
      .catch((error: unknown) => {
        console.error("Editor showcase loop failed", error);
      });

    return () => {
      cancelled = true;
      clock.dispose();
      if (clockRef.current === clock) clockRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    clockRef.current?.setPaused(paused);
  }, [paused]);
}

type CanvasPoint = { x: number; y: number };

function useDocumentVisible() {
  const [visible, setVisible] = useState(
    () =>
      typeof document === "undefined" || document.visibilityState === "visible",
  );

  useEffect(() => {
    const onChange = () => {
      setVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return visible;
}

export function EditorShowcaseV2() {
  const reduce = useIsMotionDisabled();
  const isDocumentVisible = useDocumentVisible();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(SHOWCASE_SCALE);
  const [activeSection, setActiveSection] = useState("personal");
  const [templateId, setTemplateId] = useState("engineering");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredTemplateId, setHoveredTemplateId] = useState<string | null>(
    null,
  );
  const [cursor, setCursor] = useState<ShowcaseCursorState>({
    ...HIDDEN_SHOWCASE_CURSOR,
    visible: true,
  });
  const [cursorDuration, setCursorDuration] = useState(0);

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

  const getCanvasPoint = (selector: string): CanvasPoint | null => {
    const canvas = canvasRef.current;
    const target = canvas?.querySelector<HTMLElement>(selector);
    if (!canvas || !target) return null;

    const canvasRect = canvas.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    if (canvasRect.width === 0) return null;

    const currentScale = canvasRect.width / SHOWCASE_WIDTH;
    return {
      x:
        (targetRect.left + targetRect.width / 2 - canvasRect.left) /
          currentScale -
        1,
      y:
        (targetRect.top + targetRect.height / 2 - canvasRect.top) /
          currentScale -
        1,
    };
  };

  const run = async ({ wait, isCancelled }: LoopContext) => {
    setActiveSection("personal");
    setTemplateId("engineering");
    setMenuOpen(false);
    setHoveredTemplateId(null);
    setCursor({ ...HIDDEN_SHOWCASE_CURSOR, visible: true });
    setCursorDuration(0);

    if (!(await wait(SHOWCASE_TIMING.initialHold))) return;

    const moveCursor = (point: CanvasPoint | null, duration: number) => {
      if (!point) return wait(0);
      setCursorDuration(duration / 1000);
      setCursor((current) => ({
        ...current,
        x: point.x,
        y: point.y,
      }));
      return wait(duration);
    };

    const press = async () => {
      setCursor((current) => ({
        ...current,
        pressed: true,
        ripple: current.ripple + 1,
      }));
      if (!(await wait(SHOWCASE_TIMING.press))) {
        setCursor((current) => ({ ...current, pressed: false }));
        return false;
      }
      setCursor((current) => ({ ...current, pressed: false }));
      return true;
    };

    const waitForScroll = async () => {
      if (!(await wait(SHOWCASE_TIMING.scrollStart))) return false;

      const scroller = canvasRef.current?.querySelector<HTMLElement>(
        "[data-showcase-scroll]",
      );
      if (!scroller) return wait(SHOWCASE_TIMING.scrollSettle);

      let lastTop = scroller.scrollTop;
      let stableTicks = 0;
      const maxTicks = Math.ceil(SHOWCASE_TIMING.scrollSettle / 50);

      for (let tick = 0; tick < maxTicks; tick += 1) {
        if (!(await wait(50))) return false;
        const currentTop = scroller.scrollTop;
        if (Math.abs(currentTop - lastTop) < 1) {
          stableTicks += 1;
          if (stableTicks >= 3) return true;
        } else {
          stableTicks = 0;
          lastTop = currentTop;
        }
      }

      return true;
    };

    while (!isCancelled()) {
      if (
        !(await moveCursor(
          getCanvasPoint('[data-showcase-target="skills"]'),
          SHOWCASE_TIMING.moveToSidebar,
        ))
      ) {
        return;
      }
      if (!(await press())) return;
      setActiveSection("skills");
      if (!(await waitForScroll())) return;

      if (
        !(await moveCursor(
          getCanvasPoint('[data-showcase-target="certifications"]'),
          SHOWCASE_TIMING.moveToSidebar,
        ))
      ) {
        return;
      }
      if (!(await press())) return;
      setActiveSection("certifications");
      if (!(await waitForScroll())) return;

      if (
        !(await moveCursor(
          getCanvasPoint('[data-showcase-target="template-select"]'),
          SHOWCASE_TIMING.moveToPreview,
        ))
      ) {
        return;
      }
      if (!(await press())) return;
      setMenuOpen(true);
      if (!(await wait(SHOWCASE_TIMING.menuOpen))) return;

      if (
        !(await moveCursor(
          getCanvasPoint('[data-showcase-option="datasci"]'),
          SHOWCASE_TIMING.moveToOption,
        ))
      ) {
        return;
      }
      setHoveredTemplateId("datasci");
      if (!(await wait(SHOWCASE_TIMING.hover))) return;
      if (!(await press())) return;
      setHoveredTemplateId(null);
      setMenuOpen(false);
      if (!(await wait(SHOWCASE_TIMING.menuClose))) return;
      setTemplateId("datasci");
      if (!(await wait(SHOWCASE_TIMING.templateSettle))) return;

      if (!(await wait(SHOWCASE_TIMING.dataScienceHold))) return;

      if (
        !(await moveCursor(
          getCanvasPoint('[data-showcase-target="personal"]'),
          SHOWCASE_TIMING.moveToSidebar,
        ))
      ) {
        return;
      }
      if (!(await press())) return;
      setActiveSection("personal");
      if (!(await waitForScroll())) return;

      if (
        !(await moveCursor(
          getCanvasPoint('[data-showcase-target="template-select"]'),
          SHOWCASE_TIMING.moveToPreview,
        ))
      ) {
        return;
      }
      if (!(await press())) return;
      setMenuOpen(true);
      if (!(await wait(SHOWCASE_TIMING.menuOpen))) return;

      if (
        !(await moveCursor(
          getCanvasPoint('[data-showcase-option="engineering"]'),
          SHOWCASE_TIMING.moveToOption,
        ))
      ) {
        return;
      }
      setHoveredTemplateId("engineering");
      if (!(await wait(SHOWCASE_TIMING.hover))) return;
      if (!(await press())) return;
      setHoveredTemplateId(null);
      setMenuOpen(false);
      if (!(await wait(SHOWCASE_TIMING.menuClose))) return;
      setTemplateId("engineering");
      if (!(await wait(SHOWCASE_TIMING.templateSettle))) return;

      if (!(await wait(SHOWCASE_TIMING.loopHold))) return;
    }
  };

  useEffect(() => {
    if (reduce) return;
    void Promise.allSettled([
      loadTemplate("engineering"),
      loadTemplate("datasci"),
    ]);
  }, [reduce]);

  useShowcaseLoop({
    enabled: !reduce,
    paused: !isDocumentVisible,
    run,
  });

  const displayWidth = SHOWCASE_WIDTH * scale;
  const displayHeight = SHOWCASE_HEIGHT * scale;

  const shownSection = reduce ? "personal" : activeSection;
  const shownTemplate = reduce ? "engineering" : templateId;
  const shownMenuOpen = reduce ? false : menuOpen;
  const shownHoveredTemplateId = reduce ? null : hoveredTemplateId;

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
              aria-label="Animated preview of the CVStack resume editor: browsing the skills and certifications sections, then switching from the Engineering template to the Technical template"
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
                <span className="w-10.5" />
              </div>

              <div
                className="relative overflow-hidden bg-background"
                style={{ width: displayWidth, height: displayHeight }}
              >
                <div
                  ref={canvasRef}
                  aria-hidden="true"
                  inert
                  className="pointer-events-none relative flex select-none bg-background"
                  style={{
                    width: SHOWCASE_WIDTH,
                    height: SHOWCASE_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <ShowcaseSidebar activeSection={shownSection} />
                  <div className="grid min-w-0 flex-1 grid-cols-2">
                    <ShowcaseEditorPane activeSection={shownSection} />
                    <ShowcasePreview
                      templateId={shownTemplate}
                      menuOpen={shownMenuOpen}
                      hoveredTemplateId={shownHoveredTemplateId}
                    />
                  </div>
                  {!reduce && (
                    <ShowcaseCursor cursor={cursor} duration={cursorDuration} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
