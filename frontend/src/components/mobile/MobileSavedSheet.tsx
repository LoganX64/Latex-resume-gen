import { useResumeStore } from '@/stores/resume-store'
import { useVersionsStore } from '@/stores/versions-store'
import { getTemplateConfig } from '@/templates'
import { quickExportPdf } from '@/utils/quick-export'
import { recordDownload } from '@/utils/stats'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Download, Trash2, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

interface MobileSavedSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSavedSheet({ open, onOpenChange }: MobileSavedSheetProps) {
  const loadFromVersion = useResumeStore((s) => s.loadFromVersion)
  const versions = useVersionsStore((s) => s.versions)
  const removeVersion = useVersionsStore((s) => s.removeVersion)

  function handleLoad(version: (typeof versions)[0]) {
    loadFromVersion(version)
    onOpenChange(false)
    toast.success('Version loaded', { description: `"${version.name}" has been loaded.` })
  }

  async function handleExportPdf(version: (typeof versions)[0]) {
    const success = await quickExportPdf(version)
    if (success) recordDownload()
  }

  function handleDelete(version: (typeof versions)[0]) {
    removeVersion(version.id)
    toast.success('Version deleted', { description: `"${version.name}" has been removed.` })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" showCloseButton={false} className="max-h-[80dvh] overflow-hidden flex flex-col">
        <SheetHeader className="pb-2">
          <SheetTitle>Saved Resumes</SheetTitle>
          <SheetDescription>
            {versions.length === 0
              ? 'No saved resumes yet.'
              : `${versions.length} saved version${versions.length === 1 ? '' : 's'}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {versions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No saved resumes yet.</p>
              <p className="text-xs mt-1">
                Save your current resume to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {versions.map((version) => {
                const templateConfig = getTemplateConfig(version.templateId)
                const date = new Date(version.createdAt)
                return (
                  <div
                    key={version.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-medium truncate">{version.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {templateConfig?.name || version.templateId}
                        {' · '}
                        {isNaN(date.getTime()) ? 'Unknown date' : format(date, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-9 w-9"
                        onClick={() => handleLoad(version)}
                        aria-label="Load version"
                      >
                        <span className="text-xs font-medium">Load</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-9 w-9"
                        onClick={() => handleExportPdf(version)}
                        aria-label="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-9 w-9 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(version)}
                        aria-label="Delete version"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="p-3 border-t border-border">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
