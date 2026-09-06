import { Link } from "react-router-dom";
import { useVersionsStore } from "@/stores/versions-store";
import { VersionCard } from "@/components/VersionCard";
import { StorageWarning } from "@/components/StorageWarning";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import {
  faArrowRight,
  faWandSparkles,
  faPlus,
  faFileLines,
  faImage,
  faFilePdf,
  faCode,
  faLock,
  faTableColumns,
} from "@/lib/icons";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Button } from "@/components/ui/button";
import fillDetailsSvg from "@/assets/Fill-details.svg";
import multipleTemplatesSvg from "@/assets/multiple-templates.svg";
import latexDownloadSvg from "@/assets/latex-download.svg";
import { FadeIn } from "@/components/motion/FadeIn";
import { AnimatedGroup } from "@/components/motion/AnimatedGroup";
import { HoverCard } from "@/components/motion/HoverCard";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { m, useReducedMotion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import {
  DURATION,
  EASE_OUT,
  VIEWPORT,
  animatedGroupContainer,
  animatedGroupItem,
} from "@/lib/motion";

// ─── Inline SVG illustrations ────────────────────────────────────────────────

/** Stylized A4 document with typeset lines */
function DocIllustration() {
  return (
    <svg
      viewBox="0 0 120 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full h-full drop-shadow-2xl"
    >
      {/* Paper shadow */}
      <rect
        x="14"
        y="12"
        width="94"
        height="132"
        rx="6"
        fill="#000000"
        opacity="0.12"
      />
      {/* Paper - crisp white resume sheet */}
      <rect x="10" y="8" width="94" height="132" rx="6" fill="#ffffff" />
      <rect
        x="10"
        y="8"
        width="94"
        height="132"
        rx="6"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      {/* Red header bar */}
      <rect x="10" y="8" width="94" height="28" rx="6" fill="#e11d48" />
      <rect x="10" y="28" width="94" height="8" fill="#e11d48" />
      {/* Avatar circle in header */}
      <circle cx="30" cy="22" r="10" fill="#ffffff" opacity="0.3" />
      <circle cx="30" cy="19" r="5" fill="#ffffff" opacity="0.6" />
      <path
        d="M20 34c0-5.5 4.5-10 10-10s10 4.5 10 10"
        fill="#ffffff"
        opacity="0.3"
      />
      {/* Name & title lines in header */}
      <rect
        x="46"
        y="16"
        width="36"
        height="4"
        rx="2"
        fill="#ffffff"
        opacity="0.95"
      />
      <rect
        x="46"
        y="24"
        width="24"
        height="3"
        rx="1.5"
        fill="#ffffff"
        opacity="0.7"
      />
      {/* Body content */}
      <rect x="20" y="46" width="18" height="2.5" rx="1.25" fill="#e11d48" />
      <rect x="20" y="52" width="72" height="2" rx="1" fill="#64748b" />
      <rect x="20" y="57" width="66" height="2" rx="1" fill="#cbd5e1" />
      <rect x="20" y="62" width="58" height="2" rx="1" fill="#cbd5e1" />
      <rect x="20" y="72" width="18" height="2.5" rx="1.25" fill="#e11d48" />
      <rect x="20" y="78" width="72" height="2" rx="1" fill="#64748b" />
      <rect x="20" y="83" width="60" height="2" rx="1" fill="#cbd5e1" />
      <rect x="20" y="88" width="68" height="2" rx="1" fill="#cbd5e1" />
      <rect x="20" y="98" width="18" height="2.5" rx="1.25" fill="#e11d48" />
      <rect x="20" y="104" width="72" height="2" rx="1" fill="#64748b" />
      <rect x="20" y="109" width="52" height="2" rx="1" fill="#cbd5e1" />
      <rect x="20" y="119" width="18" height="2.5" rx="1.25" fill="#e11d48" />
      <rect x="20" y="125" width="44" height="2" rx="1" fill="#cbd5e1" />
      <rect x="65" y="125" width="26" height="2" rx="1" fill="#cbd5e1" />
      {/* Download badge */}
      <circle cx="92" cy="124" r="14" fill="#e11d48" />
      <path
        d="M92 116v14M86 124l6 6 6-6"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconEmptyDoc() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="w-14 h-14 mx-auto"
      aria-hidden="true"
    >
      <rect
        x="10"
        y="4"
        width="28"
        height="40"
        rx="4"
        stroke="url(#gRose)"
        strokeWidth="2.5"
      />
      <rect
        x="16"
        y="14"
        width="16"
        height="2.5"
        rx="1.25"
        fill="url(#gRose)"
        opacity="0.5"
      />
      <rect
        x="16"
        y="20"
        width="12"
        height="2.5"
        rx="1.25"
        fill="url(#gRose)"
        opacity="0.3"
      />
      <rect
        x="16"
        y="26"
        width="14"
        height="2.5"
        rx="1.25"
        fill="url(#gRose)"
        opacity="0.2"
      />
      <path
        d="M24 32v6m-3-3h6"
        stroke="url(#gRose)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Feature cards data ───────────────────────────────────────────────────────

const features: { icon: IconProp; borderHover: string; title: string; desc: string }[] = [
  {
    icon: faFileLines,
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    title: "Single-Page Design",
    desc: "Smart compression keeps your resume on one professional page automatically.",
  },
  {
    icon: faImage,
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    title: "Photo Support",
    desc: "Upload and crop a profile photo. Works with sidebar and engineering templates.",
  },
  {
    icon: faFilePdf,
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    title: "Instant PDF Export",
    desc: "Compile LaTeX via Tectonic for publication-quality PDF output in seconds.",
  },
  {
    icon: faCode,
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    title: "LaTeX Source",
    desc: "Download the raw .tex file. Edit in any LaTeX editor you prefer.",
  },
  {
    icon: faLock,
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    title: "Fully Private",
    desc: "All data stays in your browser. Nothing is sent to any server, ever.",
  },
  {
    icon: faTableColumns,
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    title: "Multiple Templates",
    desc: "Choose from professional LaTeX templates designed for different industries.",
  },
];

// ─── Trust badge SVG icons (inline) ──────────────────────────────────────────

function TrustBadges() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-muted-foreground">
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

// ─── Steps ────────────────────────────────────────────────────────────────────

const steps = [
  {
    n: "1",
    label: "Fill your details",
    desc: "Enter experience, education, skills, and projects via the structured editor.",
  },
  {
    n: "2",
    label: "Pick a template",
    desc: "Choose a professionally designed LaTeX template that matches your style.",
  },
  {
    n: "3",
    label: "Export to PDF",
    desc: "Compile instantly with Tectonic or download the .tex source.",
  },
];

const stepGraphics = [fillDetailsSvg, multipleTemplatesSvg, latexDownloadSvg];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const versions = useVersionsStore((s) => s.versions);
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-screen bg-background">
      <ScrollProgress />
      <div className="relative z-10">
        <Navbar />

        {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden border-b">
          {/* Hero-specific dot grid accent (sits on top of page gradient) */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.03]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="dots"
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
                fill="url(#dots)"
                className="text-foreground"
              />
            </svg>
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <AnimatedGroup
              triggerOn="mount"
              amount={0.15}
              variants={{ container: animatedGroupContainer, item: animatedGroupItem }}
              className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-16 sm:py-20 lg:py-24"
            >
              {/* Left: text */}
              <div className="flex-1 text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary mb-6">
                  <Icon icon={faWandSparkles} className="h-3 w-3" />
                  Free · No account · Runs locally
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                  Build a{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 text-primary">
                      professional
                    </span>
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/10 rounded-sm z-0" />
                  </span>
                  <br />
                  resume with <span className="text-primary">LaTeX</span>
                </h1>

                <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                  ATS-friendly, single-page resumes with publication-quality
                  typesetting. Photo support, multiple templates, and instant
                  PDF — all in your browser.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                  <Link to="/editor">
                    <Button
                      size="sm"
                      className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all hover:-translate-y-0.5"
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
                        className="w-full sm:w-auto gap-2 border-dashed"
                      >
                        My Resumes ({versions.length})
                      </Button>
                    </a>
                  )}
                </div>

                {/* Trust badges — all SVG */}
                <TrustBadges />
              </div>

              {/* Right: document illustration */}
              <div className="relative w-52 sm:w-64 lg:w-72 shrink-0 overflow-visible">
                {/* Glow ring */}
                <div className="absolute inset-6 rounded-2xl bg-primary/10 blur-2xl" />
                <m.div
                  className="relative will-change-transform"
                  animate={
                    reduce
                      ? undefined
                      : { y: [0, -6, 0] }
                  }
                  transition={
                    reduce
                      ? undefined
                      : { duration: 6, ease: "easeInOut", repeat: Infinity }
                  }
                >
                  <DocIllustration />
                </m.div>
                {/* Floating chips - kept inside container with positive positioning */}
                <div className="absolute top-0 right-0 translate-x-2 -translate-y-3 rounded-xl border bg-background shadow-md px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  PDF Ready
                </div>
                <div className="absolute bottom-0 left-0 -translate-x-2 translate-y-3 rounded-xl border bg-background shadow-md px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
                  <svg
                    viewBox="0 0 14 14"
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 1l1.5 3.5H12l-3 2.5 1 3.5L7 8l-3 2.5 1-3.5-3-2.5h3.5z"
                      fill="currentColor"
                      className="text-rose-500"
                    />
                  </svg>
                  LaTeX quality
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* ══ FEATURES ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <FadeIn className="text-center mb-12" y={16}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Everything you need
              </h2>
              <p className="mt-2 text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
                Powerful tools packed into a clean, fast interface — no account
                needed.
              </p>
            </FadeIn>

            <AnimatedGroup
              variants={{ container: animatedGroupContainer, item: animatedGroupItem }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              amount={0.1}
            >
              {features.map(
                ({ icon: faIcon, borderHover, title, desc }) => (
                  <HoverCard
                    key={title}
                    lift={4}
                    scale={1.01}
                    className={`group relative rounded-2xl border border-border bg-card overflow-hidden p-5 sm:p-6 hover:shadow-lg ${borderHover} h-full`}
                  >
                    {/* Content */}
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 dark:bg-background/40 border border-dashed border-border mb-4 group-hover:scale-105 transition-transform duration-300">
                        <Icon icon={faIcon} className="text-rose-500" style={{ width: "1.5rem", height: "1.5rem" }} />
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base mb-1.5 text-card-foreground">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </HoverCard>
                ),
              )}
            </AnimatedGroup>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══════════════════════════════════════════════════════ */}
        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <FadeIn className="text-center mb-12" y={16}>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ready in 3 steps
              </h2>
              <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                No complexity. No learning curve.
              </p>
            </FadeIn>

            <div className="relative">
              {/* Connector line (desktop) */}
              <m.div
                className="hidden sm:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-linear-to-r from-transparent via-border to-transparent origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.2 }}
              />

              <AnimatedGroup
                variants={{ container: animatedGroupContainer, item: animatedGroupItem }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
                amount={0.15}
              >
                {steps.map(({ n, label, desc }, i) => {
                  const cfg = {
                    hoverBorder:
                      "hover:border-rose-300 dark:hover:border-rose-500 dark:hover:shadow-rose-950/30",
                    pillBg:
                      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                  };

                  return (
                    <HoverCard
                      key={n}
                      lift={4}
                      scale={1.01}
                      className={`group relative overflow-hidden flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-dashed border-border/80 shadow-sm hover:shadow-lg ${cfg.hoverBorder} h-full`}
                    >
                      <div className="relative z-10 flex flex-col items-center">
                        {/* Step pill */}
                        <div
                          className={`inline-flex items-center rounded-full border border-dashed px-2 py-0.5 text-xs font-bold mb-3 ${cfg.pillBg}`}
                        >
                          Step 0{n}
                        </div>
                        {/* SVG Graphic */}
                        <div className="mb-4 group-hover:scale-105 transition-transform duration-300">
                          <img src={stepGraphics[i]} alt="" className="w-32 h-32 drop-shadow-md" />
                        </div>
                        <h3 className="font-bold text-base mb-1.5 text-foreground">
                          {label}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-55">
                          {desc}
                        </p>
                      </div>
                    </HoverCard>
                  );
                })}
              </AnimatedGroup>
            </div>

            <FadeIn className="mt-10 text-center" y={12} delay={0.2}>
              <Link to="/editor">
                <Button
                  size="sm"
                  className="gap-2 shadow-md shadow-primary/20 hover:shadow-primary/35 transition-all hover:-translate-y-0.5"
                >
                  Get Started — It's Free
                  <Icon icon={faArrowRight} className="h-4 w-4" />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* ══ SAVED RESUMES ════════════════════════════════════════════════════ */}
        <section
          id="your-resumes"
          className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 border-t"
        >
          <FadeIn className="flex items-center justify-between mb-6 gap-3" y={8}>
            <h2 className="text-xl sm:text-2xl font-bold">Your Resumes</h2>
            <Link to="/editor">
              <Button size="sm" className="gap-1.5 shrink-0">
                <Icon icon={faPlus} className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">New Resume</span>
                <span className="xs:hidden">New</span>
              </Button>
            </Link>
          </FadeIn>

          <FadeIn delay={0.1}>
            <StorageWarning className="mb-6" />
          </FadeIn>

          {versions.length === 0 ? (
            <FadeIn className="text-center py-16 border-2 border-dashed border-border rounded-2xl" y={16}>
              <IconEmptyDoc />
              <p className="font-semibold text-base mb-1 mt-4">
                No saved resumes yet
              </p>
              <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
                Build a resume and save it as a version to see it here.
              </p>
              <Link to="/editor">
                <Button variant="outline" size="sm" className="gap-2">
                  Build Your First Resume
                  <Icon icon={faArrowRight} className="h-4 w-4" />
                </Button>
              </Link>
            </FadeIn>
          ) : (
            <AnimatePresence mode="popLayout">
              <AnimatedGroup
                variants={{ container: animatedGroupContainer, item: animatedGroupItem }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                amount={0.1}
              >
                {versions.map((v) => (
                  <VersionCard key={v.id} version={v} />
                ))}
              </AnimatedGroup>
            </AnimatePresence>
          )}
        </section>

        <FadeIn y={8}>
          <Footer />
        </FadeIn>
      </div>
    </div>
  );
}
