import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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

export function NavSections({ activeSection, onSectionClick }: NavSectionsProps) {
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navSections.map((item) => {
          const sectionKey =
            item.id === "personal"
              ? "personalInfo"
              : (item.id as keyof typeof sectionVisibility);
          const isVisible =
            item.id === "personal" ||
            (sectionVisibility[sectionKey] ?? false);

          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeSection === item.id}
                onClick={() => onSectionClick?.(item.id)}
                tooltip={item.label}
                className={`${!isVisible ? "opacity-40" : ""} ${
                  activeSection === item.id
                    ? "bg-primary/10! text-primary! font-semibold border-l-2 border-primary"
                    : ""
                }`}
              >
                <Icon
                  icon={item.icon}
                  className={`h-3.5 w-3.5 lg:h-4 lg:w-4 ${activeSection === item.id ? "text-primary" : ""}`}
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
