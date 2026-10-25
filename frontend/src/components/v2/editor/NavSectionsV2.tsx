import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icon } from "@/components/Icon";
import { useResumeStore } from "@/stores/resume-store";
import {
  faUser,
  faFileLines,
  faBriefcase,
  faPuzzlePiece,
  faFolder,
  faGraduationCap,
  faAward,
  faTrophy,
  faBookOpen,
  faGlobe,
  faLayerGroup,
} from "@/lib/icons";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { m, useReducedMotion } from "framer-motion";

const navSections = [
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

interface NavSectionsV2Props {
  activeSection?: string;
  onSectionClick?: (id: string) => void;
}

export function NavSectionsV2({
  activeSection,
  onSectionClick,
}: NavSectionsV2Props) {
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility);
  const { state } = useSidebar();
  const reduce = useReducedMotion();
  const visibleSections = navSections.filter((item) => {
    const sectionKey =
      item.id === "personal"
        ? "personalInfo"
        : (item.id as keyof typeof sectionVisibility);
    return item.id === "personal" || (sectionVisibility[sectionKey] ?? false);
  }).length;

  return (
    <SidebarGroup className="px-3">
      <m.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduce ? { duration: 0 } : { duration: 1.2, ease: EASE_OUT }
        }
      >
        <div
          className={cn(
            "grid transition-[grid-template-rows,margin,opacity] duration-300 ease-in-out motion-reduce:transition-none",
            state === "collapsed"
              ? "mb-0 grid-rows-[0fr] opacity-0"
              : "mb-2 grid-rows-[1fr] opacity-100"
          )}
          aria-hidden={state === "collapsed"}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex min-w-0 items-center justify-between gap-2 px-2">
              <span className="min-w-0 truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">
                Resume sections
              </span>
              <span className="shrink-0 font-mono text-[10px] text-sidebar-foreground/40">
                {visibleSections}/{navSections.length}
              </span>
            </div>
          </div>
        </div>
        <SidebarMenu>
          {navSections.map((item) => {
            const sectionKey =
              item.id === "personal"
                ? "personalInfo"
                : (item.id as keyof typeof sectionVisibility);
            const isVisible =
              item.id === "personal" || (sectionVisibility[sectionKey] ?? false);

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={activeSection === item.id}
                  onClick={() => onSectionClick?.(item.id)}
                  tooltip={item.label}
                  className={`${!isVisible ? "opacity-40" : ""} ${
                    activeSection === item.id
                      ? "bg-sidebar-primary/10! text-sidebar-primary! font-semibold shadow-[inset_3px_0_0_var(--sidebar-primary)]"
                      : ""
                  }`}
                >
                  <Icon
                    icon={item.icon}
                    className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${activeSection === item.id ? "text-sidebar-primary" : "text-sidebar-foreground/60"}`}
                  />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </m.div>
    </SidebarGroup>
  );
}
