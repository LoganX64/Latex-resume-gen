import { Link } from 'react-router-dom'
import { useVersionsStore } from '@/stores/versions-store'
import { VersionCard } from '@/components/VersionCard'
import { StorageWarning } from '@/components/StorageWarning'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ArrowRight, Plus, Sparkles, FileText, Image, Zap, Code2, ShieldCheck, Palette, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ─── Inline SVG illustrations ────────────────────────────────────────────────

/** Stylized A4 document with typeset lines */
function DocIllustration() {
  return (
    <svg viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full drop-shadow-2xl">
      {/* Paper shadow */}
      <rect x="14" y="12" width="94" height="132" rx="6" fill="#000000" opacity="0.12"/>
      {/* Paper - crisp white resume sheet */}
      <rect x="10" y="8" width="94" height="132" rx="6" fill="#ffffff"/>
      <rect x="10" y="8" width="94" height="132" rx="6" stroke="#e2e8f0" strokeWidth="1.5"/>
      {/* Red header bar */}
      <rect x="10" y="8" width="94" height="28" rx="6" fill="#e11d48"/>
      <rect x="10" y="28" width="94" height="8" fill="#e11d48"/>
      {/* Avatar circle in header */}
      <circle cx="30" cy="22" r="10" fill="#ffffff" opacity="0.3"/>
      <circle cx="30" cy="19" r="5" fill="#ffffff" opacity="0.6"/>
      <path d="M20 34c0-5.5 4.5-10 10-10s10 4.5 10 10" fill="#ffffff" opacity="0.3"/>
      {/* Name & title lines in header */}
      <rect x="46" y="16" width="36" height="4" rx="2" fill="#ffffff" opacity="0.95"/>
      <rect x="46" y="24" width="24" height="3" rx="1.5" fill="#ffffff" opacity="0.7"/>
      {/* Body content */}
      <rect x="20" y="46" width="18" height="2.5" rx="1.25" fill="#e11d48"/>
      <rect x="20" y="52" width="72" height="2" rx="1" fill="#64748b"/>
      <rect x="20" y="57" width="66" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="20" y="62" width="58" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="20" y="72" width="18" height="2.5" rx="1.25" fill="#e11d48"/>
      <rect x="20" y="78" width="72" height="2" rx="1" fill="#64748b"/>
      <rect x="20" y="83" width="60" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="20" y="88" width="68" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="20" y="98" width="18" height="2.5" rx="1.25" fill="#e11d48"/>
      <rect x="20" y="104" width="72" height="2" rx="1" fill="#64748b"/>
      <rect x="20" y="109" width="52" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="20" y="119" width="18" height="2.5" rx="1.25" fill="#e11d48"/>
      <rect x="20" y="125" width="44" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="65" y="125" width="26" height="2" rx="1" fill="#cbd5e1"/>
      {/* Download badge */}
      <circle cx="92" cy="124" r="14" fill="#e11d48"/>
      <path d="M92 116v14M86 124l6 6 6-6" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ─── Feature cards ────────────────────────────────────────────────────────────

const features: { icon: LucideIcon; color: string; bg: string; title: string; desc: string }[] = [
  {
    icon: FileText,
    color: 'text-rose-500',
    bg: 'bg-rose-500/12',
    title: 'Single-Page Design',
    desc: 'Smart compression keeps your resume on one professional page automatically.',
  },
  {
    icon: Image,
    color: 'text-violet-500',
    bg: 'bg-violet-500/12',
    title: 'Photo Support',
    desc: 'Upload and crop a profile photo. Works with sidebar and engineering templates.',
  },
  {
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500/12',
    title: 'Instant PDF Export',
    desc: 'Compile LaTeX via Tectonic for publication-quality PDF output in seconds.',
  },
  {
    icon: Code2,
    color: 'text-sky-500',
    bg: 'bg-sky-500/12',
    title: 'LaTeX Source',
    desc: 'Download the raw .tex file. Edit in Overleaf or any LaTeX editor you prefer.',
  },
  {
    icon: ShieldCheck,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/12',
    title: 'Fully Private',
    desc: 'All data stays in your browser. Nothing is sent to any server, ever.',
  },
  {
    icon: Palette,
    color: 'text-orange-500',
    bg: 'bg-orange-500/12',
    title: 'Multiple Templates',
    desc: 'Choose from professional LaTeX templates designed for different industries.',
  },
]

// ─── Steps ────────────────────────────────────────────────────────────────────

const steps = [
  { n: '1', label: 'Fill your details', desc: 'Enter experience, education, skills, and projects via the structured editor.' },
  { n: '2', label: 'Pick a template', desc: 'Choose a professionally designed LaTeX template that matches your style.' },
  { n: '3', label: 'Export to PDF', desc: 'Compile instantly with Tectonic or download the .tex source for Overleaf.' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const versions = useVersionsStore((s) => s.versions)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b">
        {/* Layered gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-background to-background dark:from-rose-950/20 dark:via-background dark:to-background" />
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-primary/6 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-pink-400/8 blur-2xl" />
          {/* Subtle dot grid */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" className="text-foreground"/>
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
                Build a{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
                    professional
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/10 rounded-sm -z-0" />
                </span>
                <br />
                resume with{' '}
                <span className="text-primary">LaTeX</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                ATS-friendly, single-page resumes with publication-quality typesetting.
                Photo support, multiple templates, and instant PDF — all in your browser.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link to="/editor">
                  <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all hover:-translate-y-0.5">
                    Start Building Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {versions.length > 0 && (
                  <a href="#your-resumes">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                      My Resumes ({versions.length})
                    </Button>
                  </a>
                )}
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-muted-foreground">
                {['📄 LaTeX quality', '⚡ Instant PDF', '🔒 100% private', '🆓 Always free'].map((b) => (
                  <span key={b} className="flex items-center gap-1">{b}</span>
                ))}
              </div>
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
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                PDF Ready
              </div>
              <div className="absolute bottom-0 left-0 -translate-x-2 translate-y-3 rounded-xl border bg-background shadow-md px-3 py-1.5 flex items-center gap-1.5 text-xs font-medium whitespace-nowrap">
                ✨ LaTeX quality
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Everything you need</h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Powerful tools packed into a clean, fast interface — no account needed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} mb-4`}>
                <Icon className={`h-5 w-5 ${color}`} strokeWidth={2} />
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1.5 text-card-foreground">{title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════════════ */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ready in 3 steps</h2>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base">No complexity. No learning curve.</p>
          </div>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {steps.map(({ n, label, desc }) => (
                <div key={n} className="relative flex flex-col items-center text-center">
                  {/* Number bubble */}
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-primary/25 mb-4">
                    {n}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base mb-1.5">{label}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[220px]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link to="/editor">
              <Button size="lg" className="gap-2 shadow-md shadow-primary/20 hover:shadow-primary/35 transition-all hover:-translate-y-0.5">
                Get Started — It's Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SAVED RESUMES ════════════════════════════════════════════════════ */}
      <section id="your-resumes" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 border-t">
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
            <div className="text-5xl mb-4">📄</div>
            <p className="font-semibold text-base mb-1">No saved resumes yet</p>
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
  )
}
