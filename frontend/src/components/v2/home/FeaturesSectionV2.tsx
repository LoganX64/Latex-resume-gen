import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Icon } from "@/components/Icon";
import { AnimatedGroup } from "@/components/motion/AnimatedGroup";
import { FadeIn } from "@/components/motion/FadeIn";
import { HoverCard } from "@/components/motion/HoverCard";
import {
  faCode,
  faFileLines,
  faFilePdf,
  faImage,
  faLock,
  faTableColumns,
} from "@/lib/icons";

const features: { icon: IconProp; title: string; description: string }[] = [
  {
    icon: faFileLines,
    title: "Single-Page Design",
    description:
      "Smart compression keeps your resume on one professional page automatically.",
  },
  {
    icon: faImage,
    title: "Photo Support",
    description:
      "Upload and crop a profile photo. Works with sidebar and engineering templates.",
  },
  {
    icon: faFilePdf,
    title: "Instant PDF Export",
    description:
      "Compile LaTeX via Tectonic for publication-quality PDF output in seconds.",
  },
  {
    icon: faCode,
    title: "LaTeX Source",
    description:
      "Download the raw .tex file. Edit in any LaTeX editor you prefer.",
  },
  {
    icon: faLock,
    title: "Fully Private",
    description:
      "All data stays in your browser. Nothing is sent to any server, ever.",
  },
  {
    icon: faTableColumns,
    title: "Multiple Templates",
    description:
      "Choose from professional LaTeX templates designed for different industries.",
  },
];

export function FeaturesSectionV2() {
  return (
    <section aria-labelledby="features-v2-heading" className="relative">
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <FadeIn y={16} className="mx-auto mb-10 max-w-xl text-center sm:mb-12">
          <h2
            id="features-v2-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Everything you need
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Powerful tools packed into a clean, fast interface — no account
            needed.
          </p>
        </FadeIn>

        <AnimatedGroup
          preset="slide"
          amount={0.1}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map(({ icon, title, description }) => (
            <HoverCard
              key={title}
              lift={3}
              scale={1.005}
              className="group relative overflow-hidden rounded-xl border border-dashed border-border/70 bg-card/40 p-5 transition-colors hover:border-primary/30 hover:bg-card/70 sm:p-6"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-lg border border-dashed border-border/70 bg-background/60 text-rose-500 transition-transform duration-300 group-hover:scale-105">
                <Icon icon={icon} className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-foreground sm:text-base">
                {title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {description}
              </p>
            </HoverCard>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
