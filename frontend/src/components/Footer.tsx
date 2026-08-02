import { Link } from 'react-router-dom'
import { Mail, ShieldCheck, Heart } from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 text-muted-foreground text-xs">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Brand Info */}
        <div className="space-y-3 max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img src="/logo.svg" alt="LaTeX Resume Logo" className="h-7 w-7 rounded-md" />
            <span className="font-bold text-sm tracking-tight text-foreground">
              <span className="text-primary">LaTeX</span> Resume
            </span>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Free, professional, ATS-friendly resume builder with LaTeX-quality typesetting.
            Single-page design, photo support, and instant PDF — all in your browser.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              100% Local & Private
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© {new Date().getFullYear()} LaTeX Resume Generator. Built with React & Tectonic.</p>
          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1">
              Built with <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" /> by{' '}
              <a
                href="https://github.com/LoganX64"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-2 hover:text-primary transition-colors"
              >
                LoganX64
              </a>
            </p>
            <span className="text-border">·</span>
            <a
              href="https://github.com/LoganX64"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href="mailto:kpjitin@gmail.com?subject=LaTeX%20Resume%20Enquiry"
              className="hover:text-foreground transition-colors"
              aria-label="Email"
              title="kpjitin@gmail.com"
            >
              <Mail className="h-4 w-4 text-rose-500" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
