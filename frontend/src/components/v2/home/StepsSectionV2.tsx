import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { Link } from "react-router-dom";
import { useInView } from "framer-motion";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/motion/AnimatedGroup";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  ExportPdfStepVisual,
  FillDetailsStepVisual,
  PickTemplateStepVisual,
  STEP_LINE_TIMING,
  type StepVisualPhase,
  type StepVisualProps,
} from "@/components/v2/home/StepVisualsV2";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";
import { faArrowRight } from "@/lib/icons";

const steps: {
  title: string;
  description: string;
  visual: ComponentType<StepVisualProps>;
}[] = [
  {
    title: "Fill your details",
    description:
      "Enter experience, education, skills, and projects via the structured editor.",
    visual: FillDetailsStepVisual,
  },
  {
    title: "Pick a template",
    description:
      "Choose a professionally designed LaTeX template that matches your style.",
    visual: PickTemplateStepVisual,
  },
  {
    title: "Export to PDF",
    description:
      "Compile instantly with Tectonic or download the .tex source.",
    visual: ExportPdfStepVisual,
  },
];

const IDLE_PHASES: StepVisualPhase[] = ["idle", "idle", "idle"];

const LOOP_RESTART_MS = 300;

type LineStatus = "idle" | "running" | "done";

function StepProgressLine({
  status,
  delay,
  duration,
  paused,
}: {
  status: LineStatus;
  delay: number;
  duration: number;
  paused: boolean;
}) {
  return (
    <span className="relative h-px flex-1 overflow-hidden bg-border">
      {status === "running" && (
        <span
          aria-hidden="true"
          className="step-progress-fill absolute inset-0 bg-rose-500"
          style={{
            animationDelay: `${delay}ms`,
            animationDuration: `${duration}ms`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      )}
      {status === "done" && (
        <span aria-hidden="true" className="absolute inset-0 bg-rose-500" />
      )}
    </span>
  );
}

export function StepsSectionV2() {
  const reduce = useIsMotionDisabled();
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { amount: 0.2 });

  const [phases, setPhases] = useState<StepVisualPhase[]>(IDLE_PHASES);
  const [paused, setPaused] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const startedRef = useRef(false);
  const restartRemainingRef = useRef(LOOP_RESTART_MS);
  const restartFiredRef = useRef(false);

  useEffect(() => {
    if (reduce) return;

    if (!isInView) {
      setPaused(true);
      return;
    }

    setPaused(false);

    if (startedRef.current) return;
    startedRef.current = true;

    setPhases((current) => {
      if (current[0] !== "idle") return current;
      return ["running", "idle", "idle"];
    });
  }, [isInView, reduce]);

  useEffect(() => {
    if (!restarting || paused) return;

    const startedAt = performance.now();
    const remaining = restartRemainingRef.current;
    const timer = window.setTimeout(() => {
      restartFiredRef.current = true;
      restartRemainingRef.current = LOOP_RESTART_MS;
      setRestarting(false);
      setPhases(["running", "idle", "idle"]);
    }, remaining);

    return () => {
      window.clearTimeout(timer);
      if (!restartFiredRef.current) {
        restartRemainingRef.current = Math.max(
          0,
          remaining - (performance.now() - startedAt),
        );
      }
    };
  }, [restarting, paused]);

  const handleDone = (index: number) => {
    if (index === 2) {
      restartFiredRef.current = false;
      restartRemainingRef.current = LOOP_RESTART_MS;
      setRestarting(true);
    }

    setPhases((current) => {
      const next = [...current] as StepVisualPhase[];
      next[index] = "done";
      if (index < 2) next[index + 1] = "running";
      return next;
    });
  };

  return (
    <section aria-labelledby="steps-v2-heading" className="relative">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn y={16} className="mx-auto mb-10 max-w-xl text-center sm:mb-12">
          <h2
            id="steps-v2-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Ready in 3 steps
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            No complexity. No learning curve.
          </p>
        </FadeIn>

        <div ref={gridRef}>
          <AnimatedGroup
            preset="slide"
            amount={0.15}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          >
            {steps.map(({ title, description, visual: Visual }, index) => {
              const phase = phases[index];
              const status: LineStatus = reduce
                ? "done"
                : phase === "done"
                  ? "done"
                  : phase === "running"
                    ? "running"
                    : "idle";

              return (
                <div key={title} className="flex h-full flex-col">
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-muted">
                    <div className="flex h-full w-full items-center justify-center">
                      <Visual
                        phase={phase}
                        paused={paused}
                        onDone={() => handleDone(index)}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <span className="text-xs leading-none font-medium text-muted-foreground tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <StepProgressLine
                      status={status}
                      delay={STEP_LINE_TIMING[index].delay}
                      duration={STEP_LINE_TIMING[index].duration}
                      paused={paused}
                    />
                  </div>

                  <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                    {description}
                  </p>
                </div>
              );
            })}
          </AnimatedGroup>
        </div>

        <FadeIn y={12} delay={0.2} className="mt-10 text-center">
          <Link to="/editor-v2">
            <Button size="sm" className="gap-2 rounded-full">
              Get Started — It&apos;s Free
              <Icon icon={faArrowRight} className="h-4 w-4" />
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
