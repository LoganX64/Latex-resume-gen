import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useResumeStore } from "@/stores/resume-store";
import { useStatsStore } from "@/stores/stats-store";
import { recordVisit } from "@/utils/stats";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icon } from "@/components/Icon";
import {
  faBars,
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
} from "@/lib/icons";

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

interface AppSidebarProps {
  activeSection?: string;
  onSectionClick?: (id: string) => void;
  onSaveClick?: () => void;
}

export function AppSidebar({
  activeSection,
  onSectionClick,
  onSaveClick,
}: AppSidebarProps) {
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility);
  const { toggleSidebar, state } = useSidebar();
  const stats = useStatsStore();
  const refresh = useStatsStore((s) => s.refresh);
  const navigate = useNavigate();

  useEffect(() => {
    recordVisit().then(() => refresh());
  }, []);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-10 sm:h-12 p-1 flex items-center justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-9 sm:h-10 p-1.5"
              render={<Link to="/" />}
            >
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
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-muted-foreground">
                  IT Professional Resume Builder
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="py-2 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
        {state === "collapsed" ? (
          <div className="flex flex-col items-center gap-1 py-1">
            <span
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-sidebar-accent transition-colors cursor-default"
              title={`${stats.visits.toLocaleString()} visit${stats.visits !== 1 ? "s" : ""}`}
            >
              <Icon icon={faEye} className="h-4 w-4 lg:h-4 lg:w-4 text-sidebar-foreground/60" />
            </span>
            <span
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-sidebar-accent transition-colors cursor-default"
              title={`${stats.downloads.toLocaleString()} download${stats.downloads !== 1 ? "s" : ""}`}
            >
              <Icon icon={faDownload} className="h-4 w-4 lg:h-4 lg:w-4 text-sidebar-foreground/60" />
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-sidebar-foreground/60">
            <span className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-default">
              <Icon icon={faEye} className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              <span>
                {stats.visits.toLocaleString()} visit
                {stats.visits !== 1 ? "s" : ""}
              </span>
            </span>
            <span className="text-sidebar-foreground/30">·</span>
            <span className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-default">
              <Icon icon={faDownload} className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              <span>
                {stats.downloads.toLocaleString()} download
                {stats.downloads !== 1 ? "s" : ""}
              </span>
            </span>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              onClick={onSaveClick}
              tooltip="Save as version"
            >
              <Icon icon={faFloppyDisk} className="h-3 w-3 lg:h-4 lg:w-4" />
              <span>Save Version</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              onClick={() => navigate("/")}
              tooltip="Back to home"
            >
              <Icon icon={faHouse} className="h-3 w-3 lg:h-4 lg:w-4" />
              <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              onClick={toggleSidebar}
              tooltip="Toggle sidebar"
            >
              <Icon icon={faBars} className="h-3 w-3 lg:h-4 lg:w-4 group-data-[collapsible=icon]:rotate-180 transition-transform duration-200" />
              <span>Collapse</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
