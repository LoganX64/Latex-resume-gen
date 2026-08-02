import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/stores/resume-store'
import { useStatsStore } from '@/stores/stats-store'
import { recordVisit } from '@/utils/stats'
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
  Layers,
  PanelLeftClose,
  Eye,
  Download,
  Save,
  Home,
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
  { id: 'customSections', icon: Layers, label: 'Custom Sections' },
] as const

interface AppSidebarProps {
  activeSection?: string
  onSectionClick?: (id: string) => void
  onSaveClick?: () => void
}

export function AppSidebar({ activeSection, onSectionClick, onSaveClick }: AppSidebarProps) {
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const { toggleSidebar, state } = useSidebar()
  const stats = useStatsStore()
  const refresh = useStatsStore((s) => s.refresh)
  const navigate = useNavigate()

  useEffect(() => {
    recordVisit().then(() => refresh())
  }, [])

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-10 p-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-9 p-1.5" render={<Link to="/" />}>
              <img src="/logo.svg" alt="Logo" className="h-7 w-7 shrink-0 rounded-md" />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-sm">
                  <span className="text-primary">LaTeX</span> Resume
                </span>
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
                const sectionKey = item.id === 'personal' ? 'personalInfo' : item.id as keyof typeof sectionVisibility
                const isVisible =
                  item.id === 'personal' || (sectionVisibility[sectionKey] ?? false)
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeSection === item.id}
                      onClick={() => onSectionClick?.(item.id)}
                      tooltip={item.label}
                      className={`${!isVisible ? 'opacity-40' : ''} ${
                        activeSection === item.id ? '!bg-primary/10 !text-primary font-semibold border-l-2 border-primary' : ''
                      }`}
                    >
                      <item.icon className={`h-3.5 w-3.5 ${activeSection === item.id ? 'text-primary' : ''}`} />
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
        {state === 'collapsed' ? (
          <div className="flex flex-col items-center gap-1 py-1">
            <span
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-sidebar-accent transition-colors cursor-default"
              title={`${stats.visits.toLocaleString()} visit${stats.visits !== 1 ? 's' : ''}`}
            >
              <Eye className="h-4 w-4 text-sidebar-foreground/60" />
            </span>
            <span
              className="flex items-center justify-center w-7 h-7 rounded hover:bg-sidebar-accent transition-colors cursor-default"
              title={`${stats.downloads.toLocaleString()} download${stats.downloads !== 1 ? 's' : ''}`}
            >
              <Download className="h-4 w-4 text-sidebar-foreground/60" />
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-sidebar-foreground/60">
            <span className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-default">
              <Eye className="h-3.5 w-3.5" />
              <span>{stats.visits.toLocaleString()} visit{stats.visits !== 1 ? 's' : ''}</span>
            </span>
            <span className="text-sidebar-foreground/30">·</span>
            <span className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-default">
              <Download className="h-3.5 w-3.5" />
              <span>{stats.downloads.toLocaleString()} download{stats.downloads !== 1 ? 's' : ''}</span>
            </span>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" onClick={onSaveClick} tooltip="Save as version">
              <Save className="h-3 w-3" />
              <span>Save Version</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" onClick={() => navigate('/')} tooltip="Back to home">
              <Home className="h-3 w-3" />
              <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" onClick={toggleSidebar} tooltip="Toggle sidebar">
              <PanelLeftClose className="h-3 w-3 group-data-[collapsible=icon]:rotate-180 transition-transform duration-200" />
              <span>Collapse</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
