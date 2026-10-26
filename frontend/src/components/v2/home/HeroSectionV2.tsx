import { Link } from "react-router-dom";
import { useVersionsStore } from "@/stores/versions-store";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { faArrowRight, faWandSparkles } from "@/lib/icons";
import { AnimatedGroup } from "@/components/motion/AnimatedGroup";
import {
  animatedGroupContainer,
  animatedGroupItem,
} from "@/lib/motion";

function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
          <rect
            x="2"
            y="1"
            width="12"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="5"
            y="5"
            width="6"
            height="1.2"
            rx="0.6"
            fill="currentColor"
            opacity="0.5"
          />
          <rect
            x="5"
            y="8"
            width="4"
            height="1.2"
            rx="0.6"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
        LaTeX quality
      </span>
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
          <path
            d="M8 2l1.5 3.5H13l-3 2.5 1 3.5L8 9l-3 2.5 1-3.5-3-2.5h3.5z"
            fill="currentColor"
            opacity="0.6"
          />
        </svg>
        Instant PDF
      </span>
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
          <rect
            x="3"
            y="7"
            width="10"
            height="8"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M5 7V5a3 3 0 016 0v2"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        100% private
      </span>
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 16 16" className="w-4 h-4" aria-hidden="true">
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M5 8.5l2 2 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        Always free
      </span>
    </div>
  );
}

export function HeroSectionV2() {
  const versions = useVersionsStore((s) => s.versions);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hero-dots-v2"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#hero-dots-v2)"
            className="text-foreground"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedGroup
          triggerOn="mount"
          amount={0.15}
          variants={{
            container: animatedGroupContainer,
            item: animatedGroupItem,
          }}
          className="flex flex-col items-center text-center gap-5 py-16 sm:py-20 lg:py-24"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary">
            <Icon icon={faWandSparkles} className="h-3 w-3" />
            Free · No account · Runs locally
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[2.875rem] xl:text-[3.25rem] font-extrabold tracking-tight leading-[1.1] lg:whitespace-nowrap">
            Build a{" "}
            <span className="animate-gradient gradient-primary inline-block">
              Professional
            </span>{" "}
            resume with{" "}
            <span className="animate-gradient gradient-rose inline-block">
              LaTeX
            </span>
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            ATS-friendly, single-page resumes with publication-quality
            typesetting. Photo support, multiple templates, and instant PDF —
            all in your browser.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/editor">
              <Button
                size="sm"
                className="w-full sm:w-auto gap-2 rounded-full"
              >
                Start Building Free
                <Icon icon={faArrowRight} className="h-4 w-4" />
              </Button>
            </Link>
            {versions.length > 0 && (
              <a href="#your-resumes">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto gap-2 rounded-full px-5 border-dashed"
                >
                  My Resumes ({versions.length})
                </Button>
              </a>
            )}
          </div>

          <TrustBadges />
        </AnimatedGroup>
      </div>
    </section>
  );
}
