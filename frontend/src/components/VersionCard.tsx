import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/stores/resume-store'
import { useVersionsStore } from '@/stores/versions-store'
import { getTemplateConfig } from '@/templates'
import { quickExportPdf, quickExportLatex } from '@/utils/quick-export'
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
    await quickExportPdf(version)
    setExportingPdf(false)
  }

  async function handleExportLatex() {
    setExportingLatex(true)
    await quickExportLatex(version)
    setExportingLatex(false)
  }

  function handleDelete() {
    removeVersion(version.id)
    setShowDeleteDialog(false)
    toast.success('Version deleted', { description: `"${version.name}" has been removed.` })
  }

  return (
    <>
      <Card className="group transition-colors hover:border-foreground/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{version.name}</CardTitle>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{templateConfig?.name || version.templateId}</span>
            <span>{activeSections.length} sections</span>
            <span>{format(new Date(version.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1.5">
            <Button size="sm" onClick={handleLoad}>
              Load
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPdf}
              disabled={exportingPdf}
            >
              {exportingPdf ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportLatex}
              disabled={exportingLatex}
            >
              {exportingLatex ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              )}
              LaTeX
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-destructive hover:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
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
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
