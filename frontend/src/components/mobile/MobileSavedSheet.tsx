import { useState } from 'react'
import { useResumeStore } from '@/stores/resume-store'
import { useVersionsStore } from '@/stores/versions-store'
import { getTemplateConfig } from '@/templates'
import { quickExportPdf } from '@/utils/quick-export'
import { recordDownload } from '@/utils/stats'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Icon } from '@/components/Icon'
import { faDownload, faTrash, faFileLines } from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { m, AnimatePresence } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface MobileSavedSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSavedSheet({ open, onOpenChange }: MobileSavedSheetProps) {
  const loadFromVersion = useResumeStore((s) => s.loadFromVersion)
  const versions = useVersionsStore((s) => s.versions)
  const removeVersion = useVersionsStore((s) => s.removeVersion)
  const [versionToDelete, setVersionToDelete] = useState<(typeof versions)[0] | null>(null)

  function handleLoad(version: (typeof versions)[0]) {
    loadFromVersion(version)
    onOpenChange(false)
    toast.success('Version loaded', { description: `"${version.name}" has been loaded.` })
  }

  async function handleExportPdf(version: (typeof versions)[0]) {
    const success = await quickExportPdf(version)
    if (success) recordDownload()
  }

  function confirmDelete() {
    if (versionToDelete) {
      removeVersion(versionToDelete.id)
      toast.success('Version deleted', { description: `"${versionToDelete.name}" has been removed.` })
      setVersionToDelete(null)
    }
  }

  return (
    <>
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
                <Icon icon={faFileLines} className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No saved resumes yet.</p>
                <p className="text-xs mt-1">
                  Save your current resume to see it here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {versions.map((version) => {
                    const templateConfig = getTemplateConfig(version.templateId)
                    const date = new Date(version.createdAt)
                    return (
                      <m.div
                        key={version.id}
                        layout
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85, height: 0, marginTop: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleLoad(version)}
                        >
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="text-sm font-medium truncate">{version.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {templateConfig?.name || version.templateId}
                              {' · '}
                              {isNaN(date.getTime()) ? 'Unknown date' : format(date, 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="h-11 w-11 sm:h-9 sm:w-9"
                              onClick={() => handleExportPdf(version)}
                              aria-label="Download PDF"
                            >
                              <Icon icon={faDownload} className="h-4 w-4" />
                            </Button>
                            <m.div whileTap={{ scale: 0.8, rotate: -15 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="h-11 w-11 sm:h-9 sm:w-9 text-destructive hover:text-destructive active:bg-rose-500/10"
                                onClick={() => setVersionToDelete(version)}
                                aria-label="Delete version"
                              >
                                <Icon icon={faTrash} className="h-4 w-4 text-rose-500" />
                              </Button>
                            </m.div>
                          </div>
                        </div>
                      </m.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-border">
            <Button
              variant="outline"
              className="w-full h-11 sm:h-7"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!versionToDelete} onOpenChange={(open) => !open && setVersionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Version</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{versionToDelete?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
