import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import * as Sentry from '@sentry/react'
import { useResumeStore } from '@/stores/resume-store'
import { downloadFile, downloadPdf } from '@/utils/download'
import { recordDownload } from '@/utils/stats'
import { loadTemplate, getTemplateConfig } from '@/templates'
import { useWebSocketCompile } from '@/hooks/useWebSocketCompile'

interface UseExportActionsOptions {
  onNavigateHome?: () => void
}

export function useExportActions(_options?: UseExportActionsOptions) {
  const resume = useResumeStore((s) => s.resume)
  const sectionOrder = useResumeStore((s) => s.sectionOrder)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const templateId = useResumeStore((s) => s.templateId)

  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [showMultiPageDialog, setShowMultiPageDialog] = useState(false)
  const [multiPageCount, setMultiPageCount] = useState(0)
  const pendingDownloadRef = useRef<{ blob: Blob; filename: string } | null>(null)
  const [showNoPhotoDialog, setShowNoPhotoDialog] = useState(false)
  const pendingNoPhotoRef = useRef<'pdf' | 'latex' | null>(null)
  const [compileDialogOpen, setCompileDialogOpen] = useState(false)

  const {
    progress,
    status: compileStatus,
    error: compileWsError,
    result: compileResult,
    startCompile,
    cancel: cancelCompile,
    reset: resetCompile,
  } = useWebSocketCompile()

  const checkPhotoWarning = useCallback((exportType: 'pdf' | 'latex') => {
    const config = getTemplateConfig(templateId)
    if (config?.supportsPhoto && !resume.personalInfo.profileImage) {
      pendingNoPhotoRef.current = exportType
      setShowNoPhotoDialog(true)
      return true
    }
    return false
  }, [templateId, resume.personalInfo.profileImage])

  const handleExportLatex = useCallback(async (skipPhotoWarning = false) => {
    if (!skipPhotoWarning && checkPhotoWarning('latex')) return
    const template = await loadTemplate(templateId)
    if (!template) return
    const latex = template.generateLatex(resume, sectionOrder, sectionVisibility)
    const name = resume.personalInfo.fullName || 'resume'
    const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.tex`
    downloadFile(latex, filename, 'application/x-latex')
    recordDownload()
    toast.success('LaTeX file exported', {
      description: `${filename} downloaded successfully.`,
    })
  }, [resume, sectionOrder, sectionVisibility, templateId, checkPhotoWarning])

  const handleExportPdf = useCallback(async (skipPhotoWarning = false) => {
    if (isExportingPdf) return
    if (!skipPhotoWarning && checkPhotoWarning('pdf')) return

    Sentry.startSpan({ name: 'Export PDF', op: 'export.pdf' }, async (span) => {
      setIsExportingPdf(true)
      setCompileDialogOpen(true)
      resetCompile()
      span.setAttribute('template', templateId)

      try {
        const template = await loadTemplate(templateId)
        if (!template) {
          span.setAttribute('success', false)
          span.setAttribute('reason', 'template_not_found')
          setCompileDialogOpen(false)
          return
        }

        const latex = template.generateLatex(resume, sectionOrder, sectionVisibility)
        span.setAttribute('latex.length', latex.length)

        const profileImage = resume.personalInfo.profileImage || ''
        startCompile(latex, profileImage)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Could not connect to server'
        span.setAttribute('success', false)
        span.setAttribute('error', message)
        toast.error('PDF export failed', {
          description: `${message}. Make sure the backend is running.`,
        })
        setIsExportingPdf(false)
      }
    })
  }, [resume, sectionOrder, sectionVisibility, templateId, isExportingPdf, checkPhotoWarning, startCompile, resetCompile])

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

  const handleNoPhotoContinue = useCallback(() => {
    const exportType = pendingNoPhotoRef.current
    setShowNoPhotoDialog(false)
    pendingNoPhotoRef.current = null
    if (exportType === 'pdf') handleExportPdf(true)
    else if (exportType === 'latex') handleExportLatex(true)
  }, [handleExportPdf, handleExportLatex])

  const handleCompileCancel = useCallback(() => {
    cancelCompile()
    setIsExportingPdf(false)
  }, [cancelCompile])

  useEffect(() => {
    if (compileStatus === 'done' && compileResult?.pdfBlob) {
      const name = resume.personalInfo.fullName || 'resume'
      const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.pdf`
      const blob = compileResult.pdfBlob

      Sentry.startSpan({ name: 'Export PDF - handle result', op: 'export.pdf' }, (span) => {
        span.setAttribute('pdf.size', blob.size)

        const pageCount = parseInt(
          progress.find((p) => p.step === 'reading')?.message?.match(/\d+/)?.[0] || '1',
          10
        )
        span.setAttribute('pdf.pages', pageCount)

        if (pageCount > 1) {
          pendingDownloadRef.current = { blob, filename }
          setMultiPageCount(pageCount)
          setTimeout(() => {
            setCompileDialogOpen(false)
            setShowMultiPageDialog(true)
          }, 500)
          span.setAttribute('success', true)
          span.setAttribute('multiPage', true)
          return
        }

        setTimeout(() => {
          downloadPdf(blob, filename)
          recordDownload()
          setCompileDialogOpen(false)
          resetCompile()
        }, 500)
        span.setAttribute('success', true)
        toast.success('PDF exported', {
          description: `${filename} downloaded successfully.`,
        })
      })
      setIsExportingPdf(false)
    } else if (compileStatus === 'error') {
      setIsExportingPdf(false)
    }
  }, [compileStatus, compileResult, progress, resume.personalInfo.fullName, resetCompile])

  return useMemo(() => ({
    handleExportPdf,
    handleExportLatex,
    handleMultiPageDownload,
    handleNoPhotoContinue,
    handleCompileCancel,
    isExportingPdf,
    compileDialogOpen,
    setCompileDialogOpen,
    showMultiPageDialog,
    setShowMultiPageDialog,
    multiPageCount,
    showNoPhotoDialog,
    setShowNoPhotoDialog,
    progress,
    compileStatus,
    compileWsError,
  }), [
    handleExportPdf,
    handleExportLatex,
    handleMultiPageDownload,
    handleNoPhotoContinue,
    handleCompileCancel,
    isExportingPdf,
    compileDialogOpen,
    showMultiPageDialog,
    multiPageCount,
    showNoPhotoDialog,
    progress,
    compileStatus,
    compileWsError,
  ])
}
