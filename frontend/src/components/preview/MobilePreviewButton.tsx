import { useState } from 'react'
import { Eye, X, ChevronLeft, User, FileText, Briefcase, Puzzle, FolderGit2, GraduationCap, Award, Trophy, BookOpen, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useSidebar } from '@/components/ui/sidebar'
import { ResumePreview } from './ResumePreview'
import { OverflowIndicator } from './OverflowIndicator'
import { useResumeStore } from '@/stores/resume-store'
import { getAllTemplateConfigs } from '@/templates'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

interface MobilePreviewButtonProps {
  activeSection?: string
  onSectionClick?: (id: string) => void
}

export function MobilePreviewButton({ activeSection, onSectionClick }: MobilePreviewButtonProps) {
  const [open, setOpen] = useState(false)
  const { openMobile } = useSidebar()
  const templateId = useResumeStore((s) => s.templateId)
  const setTemplateId = useResumeStore((s) => s.setTemplateId)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const templateConfigs = getAllTemplateConfigs()

  return (
    <>
      {!openMobile && (
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-20 right-6 z-40 h-14 w-14 rounded-full shadow-lg lg:hidden touch-manipulation"
          onClick={() => setOpen(true)}
          aria-label="Preview resume"
        >
          <Eye className="h-6 w-6" />
        </Button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" showCloseButton={false} className="h-[90dvh] p-0 flex flex-col overflow-hidden gap-0">
          <SheetHeader className="px-4 py-2 border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-sm">Live Preview</SheetTitle>
              <div className="flex items-center gap-2">
                <Select value={templateId} onValueChange={(v) => v && setTemplateId(v)}>
                  <SelectTrigger className="text-[10px] h-6 px-2 py-1 gap-1 cursor-pointer w-32" aria-label="Select resume template">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-32 text-[10px]">
                    {templateConfigs.map((tc) => (
                      <SelectItem key={tc.id} value={tc.id} className="py-0.5 pr-6 pl-1.5 text-[10px]">
                        {tc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <SheetClose className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted" aria-label="Close preview">
                  <X className="h-4 w-4" />
                </SheetClose>
              </div>
            </div>
          </SheetHeader>
          <div className="flex overflow-x-auto gap-1 px-3 py-1.5 shrink-0 border-b border-border">
            {navItems.map((item) => {
              const sectionKey = item.id === 'personal' ? 'personalInfo' : item.id as keyof typeof sectionVisibility
              const isVisible = item.id === 'personal' || (sectionVisibility[sectionKey] ?? false)
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionClick?.(item.id)
                    setOpen(false)
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] whitespace-nowrap shrink-0 transition-colors ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : isVisible
                        ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                        : 'bg-muted/30 text-muted-foreground/50'
                  }`}
                >
                  <item.icon className="h-3 w-3" />
                  {item.label}
                </button>
              )
            })}
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <ResumePreview />
          </div>
          <div className="shrink-0">
            <OverflowIndicator />
          </div>
          <div className="shrink-0 border-t border-border p-3">
            <Button
              variant="ghost"
              className="w-full justify-center gap-2"
              onClick={() => setOpen(false)}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Editor
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
