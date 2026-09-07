import { Link } from "react-router-dom";
import { Icon } from "@/components/Icon";
import { faHouse, faArrowRight } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { m, useReducedMotion } from "framer-motion";
import { DURATION, EASE_OUT } from "@/lib/motion";

/** Lost document SVG illustration – matches the HomePage DocIllustration style */
function LostDocIllustration() {
  return (
    <svg
      viewBox="0 0 140 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-36 h-44 sm:w-44 sm:h-52 drop-shadow-2xl"
    >
      {/* Drop shadow */}
      <ellipse cx="70" cy="160" rx="44" ry="7" fill="#000" opacity="0.08" />

      <g transform="rotate(-6 65 85)">
        {/* Paper shadow */}
        <rect x="20" y="12" width="94" height="132" rx="6" fill="#000" opacity="0.1" />

        {/* Paper body */}
        <rect x="16" y="8" width="94" height="132" rx="6" fill="#ffffff" />
        <rect x="16" y="8" width="94" height="132" rx="6" stroke="#e2e8f0" strokeWidth="1.5" />

        {/* Rose header bar */}
        <rect x="16" y="8" width="94" height="28" rx="6" fill="#e11d48" />
        <rect x="16" y="28" width="94" height="8" fill="#e11d48" />

        {/* Avatar circle in header */}
        <circle cx="34" cy="22" r="9" fill="#ffffff" opacity="0.3" />
        <circle cx="34" cy="19" r="4.5" fill="#ffffff" opacity="0.6" />
        <path d="M25 31c0-5 4-9 9-9s9 4 9 9" fill="#ffffff" opacity="0.3" />

        {/* Name & title placeholder lines in header */}
        <rect x="50" y="16" width="36" height="3.5" rx="1.75" fill="#ffffff" opacity="0.9" />
        <rect x="50" y="23" width="22" height="2.5" rx="1.25" fill="#ffffff" opacity="0.6" />

        {/* Body section lines */}
        <rect x="26" y="44" width="18" height="2.5" rx="1.25" fill="#e11d48" />
        <rect x="26" y="50" width="72" height="2" rx="1" fill="#64748b" />
        <rect x="26" y="55" width="66" height="2" rx="1" fill="#cbd5e1" />
        <rect x="26" y="60" width="58" height="2" rx="1" fill="#cbd5e1" />

        <rect x="26" y="70" width="18" height="2.5" rx="1.25" fill="#e11d48" />
        <rect x="26" y="76" width="72" height="2" rx="1" fill="#64748b" />
        <rect x="26" y="81" width="60" height="2" rx="1" fill="#cbd5e1" />
        <rect x="26" y="86" width="68" height="2" rx="1" fill="#cbd5e1" />

        <rect x="26" y="96" width="18" height="2.5" rx="1.25" fill="#e11d48" />
        <rect x="26" y="102" width="72" height="2" rx="1" fill="#64748b" />
        <rect x="26" y="107" width="52" height="2" rx="1" fill="#cbd5e1" />

        {/* Big ? overlay in center */}
        <text
          x="63"
          y="78"
          textAnchor="middle"
          fill="#e11d48"
          fontSize="40"
          fontWeight="800"
          fontFamily="system-ui, sans-serif"
          opacity="0.15"
        >
          ?
        </text>
      </g>

      {/* Floating question marks */}
      <g opacity="0.5">
        <text x="120" y="38" fill="#e11d48" fontSize="16" fontWeight="700" fontFamily="system-ui">?</text>
        <text x="10" y="60" fill="#e11d48" fontSize="12" fontWeight="700" fontFamily="system-ui">?</text>
        <text x="126" y="88" fill="#e11d48" fontSize="10" fontWeight="700" fontFamily="system-ui">?</text>
      </g>

      {/* Dashed wandering path at bottom */}
      <path
        d="M12 148 C28 142, 42 152, 58 144 S82 138, 98 146 S116 140, 128 148"
        stroke="#e11d48"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="5 4"
        fill="none"
        opacity="0.25"
      />
    </svg>
  );
}

export default function NotFoundPage() {
  const reduce = useReducedMotion();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Dot grid accent */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dots404"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots404)" className="text-foreground" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 -mt-16">
        <m.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          className="flex flex-col items-center text-center"
        >
          {/* Illustration */}
          <m.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.1 }}
            className="mb-6"
          >
            <LostDocIllustration />
          </m.div>

          {/* 404 number */}
          <m.h1
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.2 }}
            className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-primary/10 select-none leading-none"
            aria-hidden="true"
          >
            404
          </m.h1>

          {/* Title + description */}
          <m.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.3 }}
            className="mt-4 space-y-2"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Page not found
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md">
              The page you're looking for doesn't exist, has been moved, or is
              taking a coffee break.
            </p>
          </m.div>

          {/* CTA */}
          <m.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3"
          >
            <Link to="/">
              <Button className="gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all hover:-translate-y-0.5">
                <Icon icon={faHouse} className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
            <Link to="/editor">
              <Button variant="outline" className="gap-2 border-dashed">
                Build a Resume
                <Icon icon={faArrowRight} className="h-4 w-4" />
              </Button>
            </Link>
          </m.div>
        </m.div>
      </div>
    </div>
  );
}
