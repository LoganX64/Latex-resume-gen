import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/editor/Sidebar'
import { EditorPanel } from '@/components/editor/EditorPanel'
import { ResumePreview } from '@/components/preview/ResumePreview'
import { OverflowIndicator } from '@/components/preview/OverflowIndicator'
import { MobilePreviewButton } from '@/components/preview/MobilePreviewButton'
import { StorageWarning } from '@/components/StorageWarning'
import { SaveVersionDialog } from '@/components/SaveVersionDialog'
import { useResumeStore } from '@/stores/resume-store'
import { downloadFile, downloadPdf } from '@/utils/download'
import { recordDownload } from '@/utils/stats'
import {
  Sun,
  Moon,
  Download,
  FileText,
  RotateCcw,
  Trash2,
  Search,
  TriangleAlert,
  ImageOff,
  Save,
  Home,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTheme } from '@/components/theme-provider'
import { loadTemplate, getAllTemplateConfigs, getTemplateConfig } from '@/templates'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { CommandPalette } from '@/components/CommandPalette'
import { KeyboardShortcutsButton } from '@/components/KeyboardShortcutsButton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function MainLayout() {
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const resetResume = useResumeStore((s) => s.resetResume)
  const clearResume = useResumeStore((s) => s.clearResume)
  const resume = useResumeStore((s) => s.resume)
  const sectionOrder = useResumeStore((s) => s.sectionOrder)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const templateId = useResumeStore((s) => s.templateId)
  const setTemplateId = useResumeStore((s) => s.setTemplateId)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [showMultiPageDialog, setShowMultiPageDialog] = useState(false)
  const [multiPageCount, setMultiPageCount] = useState(0)
  const pendingDownloadRef = useRef<{ blob: Blob; filename: string } | null>(null)
  const [showNoPhotoDialog, setShowNoPhotoDialog] = useState(false)
  const pendingNoPhotoRef = useRef<'pdf' | 'latex' | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  const templateConfigs = getAllTemplateConfigs()

  const checkPhotoWarning = useCallback((exportType: 'pdf' | 'latex') => {
    const config = getTemplateConfig(templateId)
    if (config?.supportsPhoto && !resume.personalInfo.profileImage) {
      pendingNoPhotoRef.current = exportType
      setShowNoPhotoDialog(true)
      return true
    }
    return false
  }, [templateId, resume.personalInfo.profileImage])

  const handleExportLatex = useCallback(async () => {
    if (checkPhotoWarning('latex')) return
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

  const handleExportPdf = useCallback(async () => {
    if (isExportingPdf) return
    if (checkPhotoWarning('pdf')) return
    setIsExportingPdf(true)
    const template = await loadTemplate(templateId)
    if (!template) {
      setIsExportingPdf(false)
      return
    }
    const latex = template.generateLatex(resume, sectionOrder, sectionVisibility)
    const profileImage = resume.personalInfo.profileImage || ''
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latex, profileImage }),
      })
      if (!response.ok) {
        let message = 'Compilation failed'
        try {
          const error = await response.json()
          message = error.message || message
        } catch {
          message = `Server error: ${response.status}`
        }
        toast.error('PDF export failed', { description: message })
        return
      }
      const pageCount = parseInt(response.headers.get('X-PDF-Page-Count') || '1', 10)
      const blob = await response.blob()
      const name = resume.personalInfo.fullName || 'resume'
      const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.pdf`
      if (pageCount > 1) {
        pendingDownloadRef.current = { blob, filename }
        setMultiPageCount(pageCount)
        setShowMultiPageDialog(true)
        return
      }
      downloadPdf(blob, filename)
      recordDownload()
      toast.success('PDF exported', {
        description: `${filename} downloaded successfully.`,
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not connect to server'
      toast.error('PDF export failed', {
        description: `${message}. Make sure the backend is running.`,
      })
    } finally {
      setIsExportingPdf(false)
    }
  }, [resume, sectionOrder, sectionVisibility, templateId, isExportingPdf, checkPhotoWarning])

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
    if (exportType === 'pdf') handleExportPdf()
    else if (exportType === 'latex') handleExportLatex()
  }, [handleExportPdf, handleExportLatex])

  const handleLoadSample = useCallback(() => {
    resetResume()
    toast.success('Sample data loaded', { description: 'Resume populated with sample data.' })
  }, [resetResume])

  const handleClearResume = useCallback(() => {
    clearResume()
    toast.success('Resume cleared', { description: 'All fields have been cleared.' })
  }, [clearResume])

  const shortcuts = useMemo(
    () => ({
      p: handleExportPdf,
      l: handleExportLatex,
      d: toggleDarkMode,
      s: () => setShowSaveDialog(true),
      h: () => navigate('/'),
      '?': () => setShortcutsOpen(true),
    }),
    [handleExportPdf, handleExportLatex, toggleDarkMode, navigate]
  )

  useKeyboardShortcuts(shortcuts)

  return (
    <TooltipProvider delay={400}>
      <SidebarProvider>
        <AppSidebar activeSection={activeSection} onSectionClick={setActiveSection} onSaveClick={() => setShowSaveDialog(true)} />
        <SidebarInset className="h-screen overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-col w-full lg:w-[55%] min-w-0 border-r border-border">
              <header className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <h2 className="text-sm font-semibold text-foreground">Resume Editor</h2>
                <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon-xs" onClick={() => setShowSaveDialog(true)} aria-label="Save as version" />}>
                    <Save className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>Save as version</TooltipContent>
                </Tooltip>
                <Link to="/">
                  <Tooltip>
                    <TooltipTrigger render={<Button variant="ghost" size="icon-xs" aria-label="Back to home" />}>
                      <Home className="h-3.5 w-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>Home</TooltipContent>
                  </Tooltip>
                </Link>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon-xs" onClick={handleClearResume} aria-label="Clear resume" />}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>Clear resume</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon-xs" onClick={handleLoadSample} aria-label="Load sample data" />}>
                    <RotateCcw className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>Load sample data</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon-xs" onClick={toggleDarkMode} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} />}>
                    {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                  </TooltipTrigger>
                  <TooltipContent>{darkMode ? 'Light mode' : 'Dark mode'}</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon-xs" onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))} aria-label="Command palette" />}>
                    <Search className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>Command palette ({navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘K' : 'Ctrl+K'})</TooltipContent>
                </Tooltip>
                <KeyboardShortcutsButton open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
              </div>
            </header>
            <div className="flex-1 overflow-y-auto">
              <EditorPanel activeSection={activeSection} />
            </div>
            <StorageWarning className="mx-2 mb-2" />
          </div>
          <div className="hidden lg:flex lg:flex-col lg:flex-1 min-w-0 bg-muted/30">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">Live Preview</h2>
                <Select value={templateId} onValueChange={(v) => v && setTemplateId(v)}>
                  <SelectTrigger className="text-[10px] h-6 px-2 py-1 gap-1 cursor-pointer" aria-label="Select resume template">
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
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon-xs" onClick={handleExportLatex} aria-label="Export LaTeX file" />}>
                    <FileText className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>Export LaTeX (⌘L)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon-xs" onClick={handleExportPdf} disabled={isExportingPdf} aria-label="Export PDF file" />}>
                    {isExportingPdf ? (
                      <Spinner className="h-3.5 w-3.5" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>Export PDF (⌘P)</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ResumePreview />
            </div>
            <OverflowIndicator />
          </div>
        </div>
        <CommandPalette
          onExportLatex={handleExportLatex}
          onExportPdf={handleExportPdf}
          onToggleDarkMode={toggleDarkMode}
          onResetResume={handleLoadSample}
          onClearResume={handleClearResume}
          onTemplateChange={setTemplateId}
          templateOptions={templateConfigs.map((tc) => ({ id: tc.id, name: tc.name }))}
          isDarkMode={darkMode}
        />
        </SidebarInset>
      </SidebarProvider>
      <MobilePreviewButton />
      <AlertDialog open={showMultiPageDialog} onOpenChange={setShowMultiPageDialog}>
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-destructive shrink-0" />
              <AlertDialogTitle>Multi-page resume</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Your resume is <strong>{multiPageCount} pages</strong> long.
              Most ATS systems and recruiters prefer single-page resumes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <p className="text-xs text-muted-foreground">
            Try hiding less important sections or shortening bullet points to fit on one page.
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
      <Dialog open={showNoPhotoDialog} onOpenChange={setShowNoPhotoDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ImageOff className="h-5 w-5 text-muted-foreground shrink-0" />
              <DialogTitle>No profile photo</DialogTitle>
            </div>
            <DialogDescription>
              This template supports a profile photo but none has been uploaded.
              Your resume will be exported without a photo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowNoPhotoDialog(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleNoPhotoContinue}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SaveVersionDialog open={showSaveDialog} onOpenChange={setShowSaveDialog} />
    </TooltipProvider>
  )
}
