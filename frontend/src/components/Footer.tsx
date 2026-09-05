import { Link } from 'react-router-dom'
import { Icon } from '@/components/Icon'
import { faEnvelope, faShieldHalved, faHeart, faGithub } from '@/lib/icons'



export function Footer() {
  return (
    <footer className="border-t bg-muted/20 text-muted-foreground text-xs">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Brand Info */}
        <div className="space-y-3 max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img src="/cvstack-logo-light.svg" alt="CVStack Logo" className="h-7 w-auto rounded-md dark:hidden" />
            <img src="/cvstack-logo-dark.svg" alt="CVStack Logo" className="hidden h-7 w-auto rounded-md dark:block" />
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Free, professional, ATS-friendly resume builder with LaTeX-quality typesetting.
            Single-page design, photo support, and instant PDF — all in your browser.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
              <Icon icon={faShieldHalved} className="h-3.5 w-3.5 text-rose-500" />
              100% Local & Private
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>© {new Date().getFullYear()} CVStack. Built with React & Tectonic.</p>
          <div className="flex items-center gap-3">
            <p className="flex items-center gap-1">
              Built with <Icon icon={faHeart} className="h-3 w-3 text-rose-500 fill-rose-500 inline" /> by{' '}
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
              <Icon icon={faGithub} className="h-4 w-4" />
            </a>
            <a
              href="mailto:kpjitin@gmail.com?subject=LaTeX%20Resume%20Enquiry"
              className="hover:text-foreground transition-colors"
              aria-label="Email"
              title="kpjitin@gmail.com"
            >
              <Icon icon={faEnvelope} className="h-4 w-4 text-rose-500" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
