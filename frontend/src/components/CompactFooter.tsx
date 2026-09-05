import { Icon } from '@/components/Icon'
import { faEnvelope, faShieldHalved, faGithub } from '@/lib/icons'



export function CompactFooter() {
  return (
    <footer className="flex items-center justify-between border-t px-4 py-2 text-[11px] text-muted-foreground bg-background/95 backdrop-blur shrink-0 gap-2">
      <div className="flex items-center gap-1.5 truncate">
        <Icon icon={faShieldHalved} className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        <span className="truncate">Stored locally in browser</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <a
          href="https://github.com/LoganX64"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <Icon icon={faGithub} className="h-3 w-3" />
          <span>LoganX64</span>
        </a>
        <span>·</span>
        <a
          href="mailto:kpjitin@gmail.com?subject=LaTeX%20Resume%20Enquiry"
          className="hover:text-foreground transition-colors inline-flex items-center gap-1"
          aria-label="Email developer"
          title="kpjitin@gmail.com"
        >
          <Icon icon={faEnvelope} className="h-3 w-3 text-rose-500" />
        </a>
      </div>
    </footer>
  )
}
