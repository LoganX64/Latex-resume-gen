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

interface NavSectionsProps {
  activeSection?: string;
  onSectionClick?: (id: string) => void;
}

export function NavSections({
  activeSection,
  onSectionClick,
}: NavSectionsProps) {
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility);
  const { state } = useSidebar();
  const visibleSections = navSections.filter((item) => {
    const sectionKey =
      item.id === "personal"
        ? "personalInfo"
        : (item.id as keyof typeof sectionVisibility);
    return item.id === "personal" || (sectionVisibility[sectionKey] ?? false);
  }).length;

  return (
    <SidebarGroup className="px-3">
      {state !== "collapsed" && (
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-foreground/45">
            Resume sections
          </span>
          <span className="font-mono text-[10px] text-sidebar-foreground/40">
            {visibleSections}/{navSections.length}
          </span>
        </div>
      )}
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
    </SidebarGroup>
  );
}
