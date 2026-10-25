import { Card } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { faBug, faGithub, faShieldHalved } from "@/lib/icons";

export function StorageCardV2() {
  return (
    <Card
      size="sm"
      className="absolute inset-x-3 bottom-1 z-20 gap-1.5 rounded-xl border border-border/40 bg-background/55 px-3 py-2 ring-0 backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 sm:inset-x-4 sm:bottom-2"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
          <Icon
            icon={faShieldHalved}
            className="h-3.5 w-3.5 shrink-0 text-emerald-500"
          />
          <span>Stored locally in browser</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <a
            href="https://github.com/LoganX64"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Icon icon={faGithub} className="h-3 w-3" />
            <span>LoganX64</span>
          </a>
          <span>·</span>
          <a
            href="mailto:kpjitin@gmail.com?subject=LaTeX%20Resume%20Enquiry"
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            aria-label="Report a bug"
            title="Bug Report"
          >
            <Icon icon={faBug} className="h-3 w-3 text-rose-500" />
          </a>
        </div>
      </div>
    </Card>
  );
}
