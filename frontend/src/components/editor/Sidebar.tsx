import { useResumeStore } from '@/stores/resume-store'
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
} from '@/components/ui/sidebar'
import {
  User,
  FileText,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Trophy,
  BookOpen,
  Globe,
  Puzzle,
  PanelLeftClose,
} from 'lucide-react'

const navItems = [
  { id: 'personal', icon: User, label: 'Personal Info' },
  { id: 'summary', icon: FileText, label: 'Summary' },
  { id: 'experience', icon: Briefcase, label: 'Experience' },
  { id: 'skills', icon: Puzzle, label: 'Skills' },
  { id: 'projects', icon: FolderGit2, label: 'Projects' },
  { id: 'education', icon: GraduationCap, label: 'Education' },
  { id: 'certifications', icon: Award, label: 'Certifications' },
  { id: 'achievements', icon: Trophy, label: 'Achievements' },
  { id: 'publications', icon: BookOpen, label: 'Publications' },
  { id: 'languages', icon: Globe, label: 'Languages' },
] as const

interface AppSidebarProps {
  activeSection?: string
  onSectionClick?: (id: string) => void
}

export function AppSidebar({ activeSection, onSectionClick }: AppSidebarProps) {
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={toggleSidebar}>
              <img src="/favicon.svg" alt="Logo" className="h-6 w-6 shrink-0" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-sidebar-foreground">
                  LaTeX Resume
                </span>
                <span className="text-[10px] text-sidebar-foreground/60">
                  IT Professional Resume Builder
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const key = item.id as keyof typeof sectionVisibility
                const isVisible =
                  item.id === 'personal' || (sectionVisibility[key] ?? false)
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeSection === item.id}
                      onClick={() => onSectionClick?.(item.id)}
                      tooltip={item.label}
                      className={!isVisible ? 'opacity-40' : ''}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar} tooltip="Toggle sidebar">
              <PanelLeftClose className="h-3.5 w-3.5 group-data-[collapsible=icon]:rotate-180 transition-transform duration-200" />
              <span>Collapse</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
