import { useState } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
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

interface SidebarProps {
  activeSection?: string
  onSectionClick?: (id: string) => void
}

export function Sidebar({ activeSection, onSectionClick }: SidebarProps) {
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={`flex flex-col bg-background border-r border-border transition-[width] duration-300 ease-in-out ${
        isCollapsed ? 'w-12 min-w-[48px]' : 'w-52 min-w-[208px]'
      }`}
    >
      {isCollapsed ? (
        <div className="flex items-center justify-center py-3">
          <img src="/favicon.svg" alt="Logo" width={24} height={24} className="h-6 w-6" />
        </div>
      ) : (
        <div className="px-3 py-3">
          <h1 className="text-base font-bold tracking-tight text-foreground">
            LaTeX Resume
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            IT Professional Resume Builder
          </p>
        </div>
      )}
      <Separator />
      <ScrollArea className="flex-1 py-2">
        <nav
          className={`flex flex-col gap-0.5 ${
            isCollapsed ? 'items-center px-1.5' : 'px-2'
          }`}
        >
          {navItems.map((item) => {
            const key = item.id as keyof typeof sectionVisibility
            const isVisible =
              item.id === 'personal' || (sectionVisibility[key] ?? false)
            const Icon = item.icon

            const button = (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'secondary' : 'ghost'}
                size={isCollapsed ? 'icon' : 'sm'}
                className={`${
                  isCollapsed ? 'h-8 w-8' : 'justify-start gap-2 h-8 text-xs'
                } font-normal ${!isVisible ? 'opacity-40' : ''}`}
                onClick={() => onSectionClick?.(item.id)}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    <ChevronRight className="h-3 w-3 ml-auto shrink-0 opacity-50" />
                  </>
                )}
              </Button>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger render={button} />
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              )
            }

            return button
          })}
        </nav>
      </ScrollArea>
      <Separator />
      <div className={`py-2 ${isCollapsed ? 'flex justify-center' : 'px-2'}`}>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size={isCollapsed ? 'icon' : 'sm'}
                className={`${
                  isCollapsed ? 'h-8 w-8' : 'justify-start gap-2 h-8 text-xs'
                } font-normal`}
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <PanelLeftOpen className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <PanelLeftClose className="h-3.5 w-3.5 shrink-0" />
                )}
              </Button>
            }
          />
          <TooltipContent side={isCollapsed ? 'right' : 'top'}>
            {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
