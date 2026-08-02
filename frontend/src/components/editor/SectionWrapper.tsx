import { ReactNode } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useResumeStore } from '@/stores/resume-store'
import type { SectionVisibility } from '@/types/resume'

interface SectionWrapperProps {
  id: string
  sectionType: keyof SectionVisibility
  label: string
  collapsed: boolean
  onToggleCollapse: () => void
  children: ReactNode
}

export function SectionWrapper({
  id,
  sectionType,
  label,
  collapsed,
  onToggleCollapse,
  children,
}: SectionWrapperProps) {
  const toggleSectionVisibility = useResumeStore((s) => s.toggleSectionVisibility)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const sectionTypeKey = sectionType
  const isVisible = sectionVisibility[sectionTypeKey] ?? true

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50 z-50' : ''}`}
    >
      <Card className="relative bg-card border border-border/80 hover:border-primary/40 shadow-sm transition-all duration-200 overflow-hidden">
        <CardHeader className="py-2.5 px-3">
          <div className="flex items-center gap-2">
            <button
              aria-label={`Drag to reorder ${label}`}
              className="cursor-grab active:cursor-grabbing text-muted-foreground/70 hover:text-primary transition-colors touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" aria-hidden="true" />
            </button>
            <CardTitle className="text-xs sm:text-sm font-semibold flex-1 text-foreground">{label}</CardTitle>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => toggleSectionVisibility(sectionTypeKey)}
              aria-label={isVisible ? `Hide ${label} section` : `Show ${label} section`}
            >
              {isVisible ? (
                <Eye className="h-3.5 w-3.5 text-primary" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground/60" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onToggleCollapse}
              aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
            >
              {collapsed ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </Button>
          </div>
        </CardHeader>
        {!collapsed && <CardContent className="px-3 pb-3 pt-3">{children}</CardContent>}
      </Card>
    </div>
  )
}
