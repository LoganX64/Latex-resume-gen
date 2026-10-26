import type { ComponentType } from "react";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  LatexSourceVisual,
  MultipleTemplatesVisual,
  PdfExportVisual,
  PhotoSupportVisual,
  PrivacyVisual,
  SinglePageVisual,
} from "@/components/v2/home/FeatureVisualsV2";

const features: {
  title: string;
  description: string;
  visual: ComponentType;
}[] = [
  {
    title: "Single-Page Design",
    description:
      "Smart compression keeps your resume on one professional page automatically.",
    visual: SinglePageVisual,
  },
  {
    title: "Photo Support",
    description:
      "Upload and crop a profile photo. Works with sidebar and engineering templates.",
    visual: PhotoSupportVisual,
  },
  {
    title: "Instant PDF Export",
    description:
      "Compile LaTeX via Tectonic for publication-quality PDF output in seconds.",
    visual: PdfExportVisual,
  },
  {
    title: "LaTeX Source",
    description:
      "Download the raw .tex file. Edit in any LaTeX editor you prefer.",
    visual: LatexSourceVisual,
  },
  {
    title: "Fully Private",
    description:
      "All data stays in your browser. Nothing is sent to any server, ever.",
    visual: PrivacyVisual,
  },
  {
    title: "Multiple Templates",
    description:
      "Choose from professional LaTeX templates designed for different industries.",
    visual: MultipleTemplatesVisual,
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map(({ title, description, visual: Visual }) => (
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
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
