import { useResumeStore } from "@/stores/resume-store";
import { useStatsStore } from "@/stores/stats-store";
import { useNavigate } from "react-router-dom";
import { recordVisit } from "@/utils/stats";
import { useEffect } from "react";
import { Icon } from "@/components/Icon";
import {
  faFloppyDisk,
  faEye,
  faDownload,
  faHouse,
  faUser,
  faFileLines,
  faBriefcase,
  faFolder,
  faGraduationCap,
  faAward,
  faGlobe,
  faPuzzlePiece,
  faLayerGroup,
  faTrophy,
  faBookOpen,
  faXmark,
} from "@/lib/icons";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";

const navItems = [
  { id: "personal", icon: faUser, label: "Personal Info" },
  { id: "summary", icon: faFileLines, label: "Summary" },
  { id: "experience", icon: faBriefcase, label: "Experience" },
  { id: "skills", icon: faPuzzlePiece, label: "Skills" },
  { id: "projects", icon: faFolder, label: "Projects" },
  { id: "education", icon: faGraduationCap, label: "Education" },
  { id: "certifications", icon: faAward, label: "Certifications" },
  { id: "achievements", icon: faTrophy, label: "Achievements" },
  { id: "publications", icon: faBookOpen, label: "Publications" },
  { id: "languages", icon: faGlobe, label: "Languages" },
  { id: "customSections", icon: faLayerGroup, label: "Custom Sections" },
];

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSection?: string;
  onSectionClick?: (id: string) => void;
  onSaveClick?: () => void;
}

export function MobileSidebar({
  open,
  onOpenChange,
  activeSection,
  onSectionClick,
  onSaveClick,
}: MobileSidebarProps) {
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility);
  const stats = useStatsStore();
  const refresh = useStatsStore((s) => s.refresh);
  const navigate = useNavigate();

  useEffect(() => {
    recordVisit().then(() => refresh());
  }, []);

  const visibleSections = navItems.filter((item) => {
    const sectionKey =
      item.id === "personal"
        ? "personalInfo"
        : (item.id as keyof typeof sectionVisibility);
    return item.id === "personal" || (sectionVisibility[sectionKey] ?? false);
  }).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-64 p-0 flex flex-col bg-sidebar border-r border-sidebar-border"
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-2.5 px-3 py-3 border-b border-sidebar-border bg-sidebar shrink-0">
          <img
            src="/cvstack-logo-light.svg"
            alt="CVStack Logo"
            className="h-7 w-auto shrink-0 rounded-md dark:hidden"
          />
          <img
            src="/cvstack-logo-dark.svg"
            alt="CVStack Logo"
            className="hidden h-7 w-auto shrink-0 rounded-md dark:block"
          />
          <SheetClose className="ml-auto p-1 rounded-md hover:bg-sidebar-accent">
            <Icon icon={faXmark} className="h-4 w-4" />
          </SheetClose>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">
              Resume sections
            </span>
            <span className="font-mono text-[10px] text-sidebar-foreground/40">
              {visibleSections}/{navItems.length}
            </span>
          </div>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const sectionKey =
                item.id === "personal"
                  ? "personalInfo"
                  : (item.id as keyof typeof sectionVisibility);
              const isVisible =
                item.id === "personal" ||
                (sectionVisibility[sectionKey] ?? false);
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionClick?.(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-sidebar-primary/10! text-sidebar-primary! font-semibold shadow-[inset_3px_0_0_var(--sidebar-primary)]"
                      : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
                  } ${!isVisible ? "opacity-40" : ""}`}
                >
                  <Icon
                    icon={item.icon}
                    className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60"}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── Footer ── */}
        <div className="border-t border-sidebar-border/70 bg-sidebar/80 p-3 space-y-2 shrink-0">
          <div className="flex items-center justify-between rounded-md bg-sidebar-accent/50 px-2.5 py-2 text-[11px] text-sidebar-foreground/55">
            <span className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-default">
              <Icon icon={faEye} className="h-3.5 w-3.5" />
              <span>
                {stats.visits.toLocaleString()} visit
                {stats.visits !== 1 ? "s" : ""}
              </span>
            </span>
            <span className="h-3 w-px bg-sidebar-border" />
            <span className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-default">
              <Icon icon={faDownload} className="h-3.5 w-3.5" />
              <span>
                {stats.downloads.toLocaleString()} download
                {stats.downloads !== 1 ? "s" : ""}
              </span>
            </span>
          </div>
          <button
            onClick={() => onSaveClick?.()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors"
          >
            <Icon icon={faFloppyDisk} className="h-3.5 w-3.5" />
            <span>Save Version</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors"
          >
            <Icon icon={faHouse} className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
