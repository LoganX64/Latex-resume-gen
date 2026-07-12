import { useState } from 'react'
import { Eye, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
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

export function MobilePreviewButton() {
  const [open, setOpen] = useState(false)
  const templateId = useResumeStore((s) => s.templateId)
  const setTemplateId = useResumeStore((s) => s.setTemplateId)
  const templateConfigs = getAllTemplateConfigs()

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg lg:hidden touch-manipulation"
        onClick={() => setOpen(true)}
        aria-label="Preview resume"
      >
        <Eye className="h-6 w-6" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" showCloseButton={false} className="h-[90vh] p-0 flex flex-col overflow-hidden gap-0">
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
                <SheetClose render={
                  <Button variant="ghost" size="icon-xs" aria-label="Close preview" />
                }>
                  <X className="h-4 w-4" />
                </SheetClose>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-2 px-1 min-h-0">
            <ResumePreview />
          </div>
          <div className="shrink-0">
            <OverflowIndicator />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
