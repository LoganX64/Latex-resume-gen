import { Link } from "react-router-dom";
import fillDetailsSvg from "@/assets/Fill-details.svg";
import multipleTemplatesSvg from "@/assets/multiple-templates.svg";
import latexDownloadSvg from "@/assets/latex-download.svg";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/motion/AnimatedGroup";
import { FadeIn } from "@/components/motion/FadeIn";
import { HoverCard } from "@/components/motion/HoverCard";
import { faArrowRight } from "@/lib/icons";

const steps = [
  {
    n: "1",
    label: "Fill your details",
    description:
      "Enter experience, education, skills, and projects via the structured editor.",
  },
  {
    n: "2",
    label: "Pick a template",
    description:
      "Choose a professionally designed LaTeX template that matches your style.",
  },
  {
    n: "3",
    label: "Export to PDF",
    description:
      "Compile instantly with Tectonic or download the .tex source.",
  },
];

const stepGraphics = [fillDetailsSvg, multipleTemplatesSvg, latexDownloadSvg];

export function StepsSectionV2() {
  return (
    <section
      aria-labelledby="steps-v2-heading"
      className="relative"
    >
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
          className="grid gap-4 sm:grid-cols-3 sm:gap-6"
        >
          {steps.map(({ n, label, description }, index) => (
            <HoverCard
              key={n}
              lift={3}
              scale={1.005}
              className="group relative flex h-full flex-col items-center overflow-hidden rounded-xl border border-dashed border-border/70 bg-card/40 p-5 text-center transition-colors hover:border-primary/30 hover:bg-card/70 sm:p-6"
            >
              <span className="mb-3 inline-flex items-center rounded-full border border-dashed border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                Step 0{n}
              </span>
              <div className="mb-4 transition-transform duration-300 group-hover:scale-105">
                <img
                  src={stepGraphics[index]}
                  alt=""
                  className="h-28 w-28 drop-shadow-md"
                />
              </div>
              <h3 className="mb-1.5 text-base font-bold text-foreground">
                {label}
              </h3>
              <p className="max-w-55 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {description}
              </p>
            </HoverCard>
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
