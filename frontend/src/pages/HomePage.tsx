import { Link } from "react-router-dom";
import { useVersionsStore } from "@/stores/versions-store";
import { VersionCard } from "@/components/VersionCard";
import { StorageWarning } from "@/components/StorageWarning";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// ─── Feature SVG icons ────────────────────────────────────────────────────────

function IconSinglePage() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7" aria-hidden="true">
      <defs>
        <linearGradient id="gRose" x1="4" y1="2" x2="24" y2="26">
          <stop stopColor="#f43f5e" />
          <stop offset="1" stopColor="#e11d48" />
        </linearGradient>
      </defs>
      <rect
        x="5"
        y="2"
        width="18"
        height="24"
        rx="3"
        stroke="url(#gRose)"
        strokeWidth="2"
      />
      <rect x="9" y="7" width="10" height="1.8" rx="0.9" fill="url(#gRose)" />
      <rect
        x="9"
        y="11"
        width="7"
        height="1.8"
        rx="0.9"
        fill="url(#gRose)"
        opacity="0.6"
      />
      <rect
        x="9"
        y="15"
        width="10"
        height="1.8"
        rx="0.9"
        fill="url(#gRose)"
        opacity="0.4"
      />
      <rect
        x="9"
        y="19"
        width="5"
        height="1.8"
        rx="0.9"
        fill="url(#gRose)"
        opacity="0.3"
      />
    </svg>
  );
}

function IconPhoto() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="22"
        height="18"
        rx="3"
        stroke="url(#gRose)"
        strokeWidth="2"
      />
      <circle cx="10" cy="12" r="3" fill="url(#gRose)" opacity="0.7" />
      <path d="M3 20l6-5 4 3 5-6 7 8H3z" fill="url(#gRose)" opacity="0.4" />
    </svg>
  );
}

function IconPdf() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7" aria-hidden="true">
      <path
        d="M7 3h10l7 7v15a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
        stroke="url(#gRose)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M17 3v7h7"
        stroke="url(#gRose)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 14v7m-3-3l3 3 3-3"
        stroke="url(#gRose)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLatex() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7" aria-hidden="true">
      <rect
        x="3"
        y="4"
        width="22"
        height="20"
        rx="3"
        stroke="url(#gRose)"
        strokeWidth="2"
      />
      <path
        d="M8 10l4 4-4 4"
        stroke="url(#gRose)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="14"
        y="17"
        width="6"
        height="2"
        rx="1"
        fill="url(#gRose)"
        opacity="0.7"
      />
    </svg>
  );
}

function IconPrivate() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7" aria-hidden="true">
      <rect
        x="5"
        y="12"
        width="18"
        height="14"
        rx="3"
        stroke="url(#gRose)"
        strokeWidth="2"
      />
      <path
        d="M9 12V8a5 5 0 0110 0v4"
        stroke="url(#gRose)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="14" cy="19" r="2" fill="url(#gRose)" />
    </svg>
  );
}

function IconTemplates() {
  return (
    <svg viewBox="0 0 28 28" fill="none" className="w-7 h-7" aria-hidden="true">
      <rect
        x="3"
        y="3"
        width="10"
        height="10"
        rx="2.5"
        fill="url(#gRose)"
        opacity="0.8"
      />
      <rect
        x="15"
        y="3"
        width="10"
        height="10"
        rx="2.5"
        stroke="url(#gRose)"
        strokeWidth="2"
      />
      <rect
        x="3"
        y="15"
        width="10"
        height="10"
        rx="2.5"
        stroke="url(#gRose)"
        strokeWidth="2"
      />
      <rect
        x="15"
        y="15"
        width="10"
        height="10"
        rx="2.5"
        fill="url(#gRose)"
        opacity="0.4"
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

const features = [
  {
    icon: IconSinglePage,
    gradient:
      "from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-500/15 dark:via-rose-500/5",
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    title: "Single-Page Design",
    desc: "Smart compression keeps your resume on one professional page automatically.",
  },
  {
    icon: IconPhoto,
    gradient:
      "from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-500/15 dark:via-rose-500/5",
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    title: "Photo Support",
    desc: "Upload and crop a profile photo. Works with sidebar and engineering templates.",
  },
  {
    icon: IconPdf,
    gradient:
      "from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-500/15 dark:via-rose-500/5",
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    title: "Instant PDF Export",
    desc: "Compile LaTeX via Tectonic for publication-quality PDF output in seconds.",
  },
  {
    icon: IconLatex,
    gradient:
      "from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-500/15 dark:via-rose-500/5",
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    title: "LaTeX Source",
    desc: "Download the raw .tex file. Edit in Overleaf or any LaTeX editor you prefer.",
  },
  {
    icon: IconPrivate,
    gradient:
      "from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-500/15 dark:via-rose-500/5",
    borderHover: "hover:border-rose-300 dark:hover:border-rose-700",
    title: "Fully Private",
    desc: "All data stays in your browser. Nothing is sent to any server, ever.",
  },
  {
    icon: IconTemplates,
    gradient:
      "from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-500/15 dark:via-rose-500/5",
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
    desc: "Compile instantly with Tectonic or download the .tex source for Overleaf.",
  },
];

// ─── Steps SVG graphics ────────────────────────────────────────────────────────

function StepGraphic1() {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      className="w-20 h-20 drop-shadow-md"
      aria-hidden="true"
    >
      <rect
        x="12"
        y="10"
        width="56"
        height="60"
        rx="8"
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth="2"
      />
      {/* Header bar */}
      <rect x="18" y="18" width="24" height="6" rx="3" fill="#e11d48" />
      <rect x="46" y="18" width="16" height="6" rx="3" fill="#cbd5e1" />
      {/* Input lines */}
      <rect
        x="18"
        y="32"
        width="44"
        height="8"
        rx="4"
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      <rect x="22" y="35" width="20" height="2" rx="1" fill="#64748b" />

      <rect
        x="18"
        y="46"
        width="44"
        height="8"
        rx="4"
        fill="#f1f5f9"
        stroke="#cbd5e1"
        strokeWidth="1"
      />
      <rect x="22" y="49" width="28" height="2" rx="1" fill="#64748b" />
      {/* Floating pencil badge */}
      <circle cx="58" cy="56" r="14" fill="#e11d48" />
      <path
        d="M52 60.5l1.5-5.5 8 8-5.5 1.5zM62.5 56.5l3-3a2.12 2.12 0 00-3-3l-3 3 6 6z"
        fill="#ffffff"
      />
    </svg>
  );
}

function StepGraphic2() {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      className="w-20 h-20 drop-shadow-md"
      aria-hidden="true"
    >
      {/* Template card 1 (background) */}
      <rect
        x="10"
        y="18"
        width="38"
        height="50"
        rx="6"
        fill="#f8fafc"
        stroke="#cbd5e1"
        strokeWidth="1.5"
      />
      <rect x="16" y="24" width="26" height="5" rx="2.5" fill="#94a3b8" />
      <rect x="16" y="33" width="20" height="2" fill="#cbd5e1" />
      <rect x="16" y="38" width="24" height="2" fill="#cbd5e1" />

      {/* Template card 2 (selected foreground) */}
      <rect
        x="30"
        y="10"
        width="40"
        height="54"
        rx="6"
        fill="#ffffff"
        stroke="#e11d48"
        strokeWidth="2"
      />
      <rect x="36" y="16" width="28" height="6" rx="3" fill="#e11d48" />
      <rect x="36" y="26" width="22" height="2.5" rx="1.25" fill="#64748b" />
      <rect x="36" y="32" width="28" height="2" rx="1" fill="#cbd5e1" />
      <rect x="36" y="37" width="24" height="2" rx="1" fill="#cbd5e1" />
      <rect x="36" y="42" width="18" height="2" rx="1" fill="#cbd5e1" />

      {/* Selected check badge */}
      <circle cx="64" cy="58" r="12" fill="#10b981" />
      <path
        d="M59 58l3.5 3.5 6-6"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepGraphic3() {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      className="w-20 h-20 drop-shadow-md"
      aria-hidden="true"
    >
      {/* Document */}
      <rect
        x="18"
        y="10"
        width="44"
        height="58"
        rx="6"
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth="2"
      />
      <rect x="24" y="16" width="32" height="6" rx="3" fill="#e11d48" />
      <rect x="24" y="26" width="28" height="2" fill="#94a3b8" />
      <rect x="24" y="31" width="24" height="2" fill="#cbd5e1" />
      <rect x="24" y="36" width="20" height="2" fill="#cbd5e1" />

      {/* Floating Download PDF badge */}
      <circle cx="40" cy="54" r="16" fill="#059669" />
      <path
        d="M40 44v14M33 51l7 7 7-7"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const stepGraphics = [StepGraphic1, StepGraphic2, StepGraphic3];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const versions = useVersionsStore((s) => s.versions);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* ── Full-page gradient background ──────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Main page gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-rose-100/90 via-background via-35% to-rose-50/60 dark:from-rose-950/60 dark:via-background dark:via-35% dark:to-rose-950/40" />

        {/* Rich glowing mesh blobs */}
        <div className="absolute -top-24 -left-20 w-125 h-125 rounded-full bg-rose-400/25 dark:bg-rose-600/20 blur-[100px]" />
        <div className="absolute top-[35%] -right-20 w-112.5 h-112.5 rounded-full bg-pink-400/20 dark:bg-rose-700/15 blur-[100px]" />
        <div className="absolute top-[70%] left-[10%] w-125 h-125 rounded-full bg-rose-300/20 dark:bg-rose-500/15 blur-[110px]" />
      </div>
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
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-16 sm:py-20 lg:py-24">
              {/* Left: text */}
              <div className="flex-1 text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary mb-6">
                  <Sparkles className="h-3 w-3" />
                  Free · No account · Runs locally
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                  Build a{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-linear-to-r from-primary to-rose-400 bg-clip-text text-transparent">
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
                      size="lg"
                      className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all hover:-translate-y-0.5"
                    >
                      Start Building Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  {versions.length > 0 && (
                    <a href="#your-resumes">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto gap-2"
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
                <div className="relative">
                  <DocIllustration />
                </div>
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
            </div>
          </div>
        </section>

        {/* ══ FEATURES ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Everything you need
              </h2>
              <p className="mt-2 text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
                Powerful tools packed into a clean, fast interface — no account
                needed.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map(
                ({ icon: Icon, gradient, borderHover, title, desc }) => (
                  <div
                    key={title}
                    className={`group relative rounded-2xl border border-border bg-card overflow-hidden p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${borderHover}`}
                  >
                    {/* Gradient overlay */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-linear-to-br ${gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    {/* Content */}
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 dark:bg-background/40 border border-border/50 shadow-sm mb-4 group-hover:scale-105 transition-transform duration-300">
                        <Icon />
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base mb-1.5 text-card-foreground">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ══ HOW IT WORKS ══════════════════════════════════════════════════════ */}
        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ready in 3 steps
              </h2>
              <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                No complexity. No learning curve.
              </p>
            </div>

            <div className="relative">
              {/* Connector line (desktop) */}
              <div className="hidden sm:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-linear-to-r from-transparent via-border to-transparent" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                {steps.map(({ n, label, desc }, i) => {
                  const Graphic = stepGraphics[i];
                  const cfg = {
                    gradient:
                      "from-rose-500/12 via-rose-500/4 to-transparent dark:from-rose-500/20 dark:via-rose-950/15 dark:to-transparent",
                    hoverBorder:
                      "hover:border-rose-300 dark:hover:border-rose-500 dark:hover:shadow-rose-950/30",
                    pillBg:
                      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                  };

                  return (
                    <div
                      key={n}
                      className={`group relative overflow-hidden flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${cfg.hoverBorder}`}
                    >
                      {/* Background gradient overlay */}
                      <div
                        className={`pointer-events-none absolute inset-0 bg-linear-to-br ${cfg.gradient} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                      />

                      <div className="relative z-10 flex flex-col items-center">
                        {/* Step pill */}
                        <div
                          className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-bold mb-4 ${cfg.pillBg}`}
                        >
                          Step 0{n}
                        </div>
                        {/* SVG Graphic */}
                        <div className="mb-4 group-hover:scale-105 transition-transform duration-300">
                          <Graphic />
                        </div>
                        <h3 className="font-bold text-base mb-1.5 text-foreground">
                          {label}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-55">
                          {desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link to="/editor">
                <Button
                  size="lg"
                  className="gap-2 shadow-md shadow-primary/20 hover:shadow-primary/35 transition-all hover:-translate-y-0.5"
                >
                  Get Started — It's Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ══ SAVED RESUMES ════════════════════════════════════════════════════ */}
        <section
          id="your-resumes"
          className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 border-t"
        >
          <div className="flex items-center justify-between mb-6 gap-3">
            <h2 className="text-xl sm:text-2xl font-bold">Your Resumes</h2>
            <Link to="/editor">
              <Button size="default" className="gap-1.5 shrink-0">
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">New Resume</span>
                <span className="xs:hidden">New</span>
              </Button>
            </Link>
          </div>

          <StorageWarning className="mb-6" />

          {versions.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
              <IconEmptyDoc />
              <p className="font-semibold text-base mb-1 mt-4">
                No saved resumes yet
              </p>
              <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
                Build a resume and save it as a version to see it here.
              </p>
              <Link to="/editor">
                <Button variant="outline" className="gap-2">
                  Build Your First Resume
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {versions.map((v) => (
                <VersionCard key={v.id} version={v} />
              ))}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}
