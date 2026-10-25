import { Card } from "@/components/ui/card";
import { Icon } from "@/components/Icon";
import { faChevronLeft, faFloppyDisk, faHouse } from "@/lib/icons";
import { navSections } from "@/components/v2/editor/NavSectionsV2";
import { cn } from "@/lib/utils";

const hiddenSections = new Set(["customSections"]);
const activeSection = "personal";
const visibleCount = navSections.filter(
  (section) => !hiddenSections.has(section.id)
).length;

function NavItem({
  id,
  label,
  icon,
}: {
  id: string;
  label: string;
  icon: (typeof navSections)[number]["icon"];
}) {
  const isActive = activeSection === id;
  const isVisible = !hiddenSections.has(id);

  return (
    <li>
      <div
        className={cn(
          "flex h-8 w-full items-center gap-2 overflow-hidden rounded-[calc(var(--radius-sm)+2px)] p-2 text-left text-xs text-sidebar-foreground",
          !isVisible && "opacity-40",
          isActive &&
            "bg-sidebar-primary/10! font-semibold text-sidebar-primary! shadow-[inset_3px_0_0_var(--sidebar-primary)]"
        )}
      >
        <Icon
          icon={icon}
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60"
          )}
        />
        <span className="truncate">{label}</span>
      </div>
    </li>
  );
}

export function ShowcaseSidebar() {
  return (
    <aside className="relative flex w-60 shrink-0 flex-col p-2">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-sidebar shadow-sm ring-1 ring-sidebar-border">
        <div className="flex h-14 shrink-0 items-center px-3">
          <div className="flex items-center gap-1 rounded-md px-1.5 py-1">
            <img
              src="/logo.svg"
              alt=""
              className="h-7 w-7 shrink-0 object-contain"
            />
            <span className="text-lg font-bold italic tracking-tight">
              <span className="text-primary">CV</span>
              <span className="text-foreground">Stack</span>
            </span>
          </div>
        </div>

        <div className="no-scrollbar min-h-0 flex-1 overflow-hidden px-3">
          <div className="mb-2 flex min-w-0 items-center justify-between gap-2 px-2">
            <span className="min-w-0 truncate text-[10px] font-semibold tracking-[0.16em] text-sidebar-foreground/45 uppercase">
              Resume sections
            </span>
            <span className="shrink-0 font-mono text-[10px] text-sidebar-foreground/40">
              {visibleCount}/{navSections.length}
            </span>
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-px">
            {navSections.map((section) => (
              <NavItem
                key={section.id}
                id={section.id}
                label={section.label}
                icon={section.icon}
              />
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 flex-col p-2">
          <Card size="sm" className="gap-0 rounded-lg p-1">
            <div className="flex items-center gap-1">
              <div className="flex h-8 flex-1 items-center justify-center gap-1 rounded-[calc(var(--radius-sm)+2px)] px-1.5 text-xs text-sidebar-foreground">
                <Icon icon={faFloppyDisk} className="h-4 w-4 shrink-0" />
                <span className="font-medium">Save</span>
              </div>
              <div className="flex h-8 flex-1 items-center justify-center gap-1 rounded-[calc(var(--radius-sm)+2px)] px-1.5 text-xs text-sidebar-foreground">
                <Icon icon={faHouse} className="h-4 w-4 shrink-0" />
                <span>Home</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="absolute top-[54px] right-2 z-10 flex size-6 items-center justify-center rounded-full border border-border/40 bg-background text-foreground shadow-xs">
        <Icon
          icon={faChevronLeft}
          style={{ width: 8, height: 8 }}
          aria-hidden="true"
        />
      </div>
    </aside>
  );
}
