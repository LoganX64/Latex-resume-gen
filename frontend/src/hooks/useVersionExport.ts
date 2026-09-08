import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { downloadPdf } from '@/utils/download'
import { recordDownload } from '@/utils/stats'
import { loadTemplate } from '@/templates'
import { useWebSocketCompile } from '@/hooks/useWebSocketCompile'
import type { ResumeVersion } from '@/types/resume'

export function useVersionExport() {
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [compileDialogOpen, setCompileDialogOpen] = useState(false)
  const [showMultiPageDialog, setShowMultiPageDialog] = useState(false)
  const [multiPageCount, setMultiPageCount] = useState(0)
  const pendingDownloadRef = useRef<{ blob: Blob; filename: string } | null>(null)
  const pendingVersionRef = useRef<ResumeVersion | null>(null)

  const {
    progress,
    status: compileStatus,
    error: compileWsError,
    result: compileResult,
    startCompile,
    cancel: cancelCompile,
    reset: resetCompile,
  } = useWebSocketCompile()

  const handleExportPdf = useCallback(async (version: ResumeVersion) => {
    if (isExportingPdf) return

    setIsExportingPdf(true)
    setCompileDialogOpen(true)
    resetCompile()
    pendingVersionRef.current = version

    try {
      const template = await loadTemplate(version.templateId)
      if (!template) {
        setCompileDialogOpen(false)
        setIsExportingPdf(false)
        return
      }

      const latex = template.generateLatex(version.resume, version.sectionOrder, version.sectionVisibility)
      const profileImage = version.resume.personalInfo.profileImage || ''
      startCompile(latex, profileImage)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not connect to server'
      toast.error('PDF export failed', {
        description: `${message}. Make sure the backend is running.`,
      })
      setIsExportingPdf(false)
    }
  }, [isExportingPdf, startCompile, resetCompile])

  const handleMultiPageDownload = useCallback(() => {
    const pending = pendingDownloadRef.current
    if (!pending) return
    downloadPdf(pending.blob, pending.filename)
    recordDownload()
    toast.success('PDF exported', {
      description: `${pending.filename} downloaded successfully.`,
    })
    setShowMultiPageDialog(false)
    pendingDownloadRef.current = null
  }, [])

  const handleCompileCancel = useCallback(() => {
    cancelCompile()
    setIsExportingPdf(false)
  }, [cancelCompile])

  useEffect(() => {
    if (compileStatus === 'done' && compileResult?.pdfBlob) {
      const version = pendingVersionRef.current
      const name = version?.resume.personalInfo.fullName || 'resume'
      const versionName = version?.name || 'export'
      const filename = `${name.toLowerCase().replace(/\s+/g, '-')}-${versionName.toLowerCase().replace(/\s+/g, '-')}.pdf`
      const blob = compileResult.pdfBlob

      const pageCount = parseInt(
        progress.find((p) => p.step === 'reading')?.message?.match(/\d+/)?.[0] || '1',
        10
      )

      if (pageCount > 1) {
        pendingDownloadRef.current = { blob, filename }
        setMultiPageCount(pageCount)
        setTimeout(() => {
          setCompileDialogOpen(false)
          setShowMultiPageDialog(true)
        }, 500)
        return
      }

      setTimeout(() => {
        downloadPdf(blob, filename)
        recordDownload()
        setCompileDialogOpen(false)
        resetCompile()
      }, 500)
      toast.success('PDF exported', {
        description: `${filename} downloaded successfully.`,
      })
      setIsExportingPdf(false)
      pendingVersionRef.current = null
    } else if (compileStatus === 'error') {
      setIsExportingPdf(false)
    }
  }, [compileStatus, compileResult, progress, resetCompile])

  return useMemo(() => ({
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
  }), [
    handleExportPdf,
    handleMultiPageDownload,
    handleCompileCancel,
    isExportingPdf,
    compileDialogOpen,
    showMultiPageDialog,
    multiPageCount,
    progress,
    compileStatus,
    compileWsError,
  ])
}
