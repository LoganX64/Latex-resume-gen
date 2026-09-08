import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/stores/resume-store'
import { useVersionsStore } from '@/stores/versions-store'
import { useIsMobile } from '@/hooks/use-mobile'
import { getTemplateConfig } from '@/templates'
import { quickExportLatex } from '@/utils/quick-export'
import { recordDownload } from '@/utils/stats'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Icon } from '@/components/Icon'
import { faSpinner, faFileLines, faDownload, faTrash, faTriangleExclamation } from '@/lib/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { m, useReducedMotion } from 'framer-motion'
import { DURATION, EASE_OUT } from '@/lib/motion'
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
import { CompileProgressDialog } from '@/components/CompileProgressDialog'
import { Spinner } from '@/components/ui/spinner'
import { useVersionExport } from '@/hooks/useVersionExport'
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
  const [exportingLatex, setExportingLatex] = useState(false)

  const {
    handleExportPdf,
    handleMultiPageDownload,
    handleCompileCancel,
    isExportingPdf,
    compileDialogOpen,
    setCompileDialogOpen,
    showMultiPageDialog,
    setShowMultiPageDialog,
    multiPageCount,
    progress,
    compileStatus,
    compileWsError,
  } = useVersionExport()

  const templateConfig = getTemplateConfig(version.templateId)
  const activeSections = version.sectionOrder.filter((s) => {
    if (s.type === 'personalInfo') return true
    return version.sectionVisibility[s.type]
  })

  function handleLoad() {
    loadFromVersion(version)
    navigate('/editor')
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

  const reduce = useReducedMotion();
  const motionProps = reduce
    ? {}
    : {
        whileHover: { y: -4, transition: { duration: DURATION.fast, ease: EASE_OUT } },
        whileTap: { scale: 0.99, transition: { duration: DURATION.fast, ease: EASE_OUT } },
      };

  return (
    <>
      <m.div {...motionProps} className="h-full">
        <Card
          size="sm"
          className="group relative overflow-hidden bg-card border border-border/80 hover:shadow-lg hover:border-rose-400/80 dark:hover:border-rose-500 dark:hover:shadow-rose-950/40 cursor-pointer py-2 sm:py-3 h-full"
          onClick={handleLoad}
        >
        <CardHeader className="relative pb-0 pt-2 px-3 sm:px-4">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
              {version.name}
            </CardTitle>
            {isMobile && (
              <m.div whileTap={{ scale: 0.8, rotate: -15 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setShowDeleteDialog(true)}
                  title="Delete version"
                >
                  <Icon icon={faTrash} className="h-3.5 w-3.5 text-rose-500" />
                </Button>
              </m.div>
            )}
          </div>
          <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-xs text-muted-foreground mt-1">
            <span className="font-medium text-foreground/90">{templateConfig?.name || version.templateId}</span>
            <span className="text-muted-foreground/60">•</span>
            <span>{activeSections.length} sections</span>
            <span className="text-muted-foreground/60">•</span>
            <span>{(() => {
              const date = new Date(version.createdAt)
              return isNaN(date.getTime()) ? 'Unknown date' : format(date, 'MMM d, yyyy')
            })()}</span>
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
              className="h-8 px-2.5 text-xs gap-1.5 border-dashed border-border/80 hover:border-primary/40"
              onClick={() => handleExportPdf(version)}
              disabled={isExportingPdf}
            >
              {isExportingPdf ? (
                <Spinner className="h-3.5 w-3.5" />
              ) : (
                <Icon icon={faDownload} className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
              )}
              PDF
            </Button>
            {!isMobile && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs gap-1.5 border-dashed border-border/80 hover:border-sky-500/40"
                onClick={handleExportLatex}
                disabled={exportingLatex}
              >
                {exportingLatex ? (
                <Icon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Icon icon={faFileLines} className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                )}
                LaTeX
              </Button>
            )}
            {!isMobile && (
              <m.div whileTap={{ scale: 0.8, rotate: -15 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setShowDeleteDialog(true)}
                  title="Delete version"
                >
                  <Icon icon={faTrash} className="h-3.5 w-3.5 text-rose-500" />
                </Button>
              </m.div>
            )}
          </div>
        </CardContent>
      </Card>
      </m.div>

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

      <CompileProgressDialog
        open={compileDialogOpen}
        onOpenChange={setCompileDialogOpen}
        onCancel={handleCompileCancel}
        status={compileStatus}
        progress={progress}
        errorMessage={compileWsError}
      />

      <AlertDialog open={showMultiPageDialog} onOpenChange={setShowMultiPageDialog}>
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <Icon
                icon={faTriangleExclamation}
                className="h-5 w-5 text-destructive shrink-0"
              />
              <AlertDialogTitle>Multi-page resume</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Your resume is <strong>{multiPageCount} pages</strong> long. Most
              ATS systems and recruiters prefer single-page resumes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <p className="text-xs text-muted-foreground">
            Try hiding less important sections or shortening bullet points to
            fit on one page.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowMultiPageDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleMultiPageDownload}>
              Download anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
