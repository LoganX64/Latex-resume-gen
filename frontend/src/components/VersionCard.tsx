import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/stores/resume-store'
import { useVersionsStore } from '@/stores/versions-store'
import { useIsMobile } from '@/hooks/use-mobile'
import { getTemplateConfig } from '@/templates'
import { quickExportPdf, quickExportLatex } from '@/utils/quick-export'
import { recordDownload } from '@/utils/stats'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { FileText, Download, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import type { ResumeVersion } from '@/types/resume'

interface VersionCardProps {
  version: ResumeVersion
}

export function VersionCard({ version }: VersionCardProps) {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const loadFromVersion = useResumeStore((s) => s.loadFromVersion)
  const removeVersion = useVersionsStore((s) => s.removeVersion)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [exportingLatex, setExportingLatex] = useState(false)

  const templateConfig = getTemplateConfig(version.templateId)
  const activeSections = version.sectionOrder.filter((s) => {
    if (s.type === 'personalInfo') return true
    return version.sectionVisibility[s.type]
  })

  function handleLoad() {
    loadFromVersion(version)
    navigate('/editor')
  }

  async function handleExportPdf() {
    setExportingPdf(true)
    const success = await quickExportPdf(version)
    if (success) recordDownload()
    setExportingPdf(false)
  }

  async function handleExportLatex() {
    setExportingLatex(true)
    const success = await quickExportLatex(version)
    if (success) recordDownload()
    setExportingLatex(false)
  }

  function handleDelete() {
    removeVersion(version.id)
    setShowDeleteDialog(false)
    toast.success('Version deleted', { description: `"${version.name}" has been removed.` })
  }

  return (
    <>
      <Card
        size="sm"
        className="group relative overflow-hidden bg-card/90 border border-border/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-rose-400/80 dark:hover:border-rose-500 dark:hover:shadow-rose-950/40 cursor-pointer py-2 sm:py-3"
        onClick={handleLoad}
      >
        {/* Ambient background gradient overlay for light & dark mode */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-rose-500/12 via-rose-500/4 to-transparent dark:from-rose-500/20 dark:via-rose-950/15 dark:to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="relative pb-0 pt-2 px-3 sm:px-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {version.name}
              </CardTitle>
              <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-xs text-muted-foreground">
                <span className="font-medium text-foreground/90">{templateConfig?.name || version.templateId}</span>
                <span className="text-muted-foreground/60">•</span>
                <span>{activeSections.length} sections</span>
                <span className="text-muted-foreground/60">•</span>
                <span>{(() => {
                  const date = new Date(version.createdAt)
                  return isNaN(date.getTime()) ? 'Unknown date' : format(date, 'MMM d, yyyy')
                })()}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative pt-3 pb-3 px-3 sm:px-4">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button size="sm" className="h-8 px-3 text-xs shadow-sm hover:shadow" onClick={handleLoad}>
              Load
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs gap-1.5 border-border/80 hover:border-primary/40"
              onClick={handleExportPdf}
              disabled={exportingPdf}
            >
              {exportingPdf ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
              )}
              PDF
            </Button>
            {!isMobile && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs gap-1.5 border-border/80 hover:border-sky-500/40"
                onClick={handleExportLatex}
                disabled={exportingLatex}
              >
                {exportingLatex ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileText className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                )}
                LaTeX
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 ml-auto text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => setShowDeleteDialog(true)}
              title="Delete version"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete version?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{version.name}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 sm:flex-row sm:justify-end">
            <AlertDialogAction
              onClick={handleDelete}
              className="flex-1 sm:flex-none h-11 sm:h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
            <AlertDialogCancel className="flex-1 sm:flex-none h-11 sm:h-9">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
