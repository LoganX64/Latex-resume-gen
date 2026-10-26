import { Link } from "react-router-dom";
import { useVersionsStore } from "@/stores/versions-store";
import { VersionCard } from "@/components/VersionCard";
import { StorageWarning } from "@/components/StorageWarning";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/motion/AnimatedGroup";
import { FadeIn } from "@/components/motion/FadeIn";
import { faArrowRight, faFileLines, faPlus } from "@/lib/icons";

export function YourResumesSectionV2() {
  const versions = useVersionsStore((s) => s.versions);

  return (
    <section
      id="your-resumes"
      aria-labelledby="your-resumes-v2-heading"
      className="relative"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <FadeIn y={8} className="mb-6 flex items-center justify-between gap-3">
          <h2
            id="your-resumes-v2-heading"
            className="text-xl font-bold tracking-tight sm:text-2xl"
          >
            Your Resumes
          </h2>
          <Link to="/editor">
            <Button size="sm" className="gap-1.5 rounded-full">
              <Icon icon={faPlus} className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Resume</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </FadeIn>

        <FadeIn delay={0.1} className="mb-6">
          <StorageWarning />
        </FadeIn>

        {versions.length === 0 ? (
          <FadeIn
            y={16}
            className="rounded-2xl border-2 border-dashed border-border/70 px-4 py-14 text-center"
          >
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30 text-rose-500">
              <Icon icon={faFileLines} className="h-6 w-6" />
            </div>
            <p className="mb-1 text-base font-semibold">
              No saved resumes yet
            </p>
            <p className="mx-auto mb-5 max-w-xs text-sm text-muted-foreground">
              Build a resume and save it as a version to see it here.
            </p>
            <Link to="/editor">
              <Button variant="outline" size="sm" className="gap-2 border-dashed">
                Build Your First Resume
                <Icon icon={faArrowRight} className="h-4 w-4" />
              </Button>
            </Link>
          </FadeIn>
        ) : (
          <AnimatedGroup
            preset="slide"
            amount={0.1}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          >
            {versions.map((version) => (
              <VersionCard
                key={version.id}
                version={version}
                editorPath="/editor"
                showPreview
              />
            ))}
          </AnimatedGroup>
        )}
      </div>
    </section>
  );
}
