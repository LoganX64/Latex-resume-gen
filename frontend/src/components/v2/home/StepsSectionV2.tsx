import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/motion/AnimatedGroup";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  ExportPdfStepVisual,
  FillDetailsStepVisual,
  PickTemplateStepVisual,
} from "@/components/v2/home/StepVisualsV2";
import { faArrowRight } from "@/lib/icons";

const steps: {
  title: string;
  description: string;
  visual: ComponentType;
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

export function StepsSectionV2() {
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

        <AnimatedGroup
          preset="slide"
          amount={0.15}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        >
          {steps.map(({ title, description, visual: Visual }, index) => (
            <div
              key={title}
              className="flex h-full flex-col rounded-2xl bg-muted/80 p-2.5 transition-colors duration-300 hover:bg-muted sm:p-3"
            >
              <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-xl bg-background ring-1 ring-border/50">
                <div className="flex h-full w-full items-center justify-center">
                  <Visual />
                </div>
              </div>

              <div className="px-3 pt-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {title}
                  </h3>
                  <span className="mt-0.5 shrink-0 rounded-full border border-border/60 bg-background/80 px-2 py-0.5 text-[10px] leading-none font-semibold text-muted-foreground">
                    Step 0{index + 1}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </AnimatedGroup>

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
