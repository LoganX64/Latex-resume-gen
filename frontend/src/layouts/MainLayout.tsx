import { useCallback, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { Sidebar } from '@/components/editor/Sidebar'
import { EditorPanel } from '@/components/editor/EditorPanel'
import { ResumePreview } from '@/components/preview/ResumePreview'
import { OverflowIndicator } from '@/components/preview/OverflowIndicator'
import { useResumeStore } from '@/stores/resume-store'
import { downloadFile, downloadPdf } from '@/utils/download'
import {
  Sun,
  Moon,
  Download,
  FileText,
  RotateCcw,
  Search,
  Loader2,
  TriangleAlert,
} from 'lucide-react'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTheme } from '@/components/theme-provider'
import { getTemplate, getAllTemplateConfigs } from '@/templates'
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
  const resetResume = useResumeStore((s) => s.resetResume)
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

  const templateConfigs = getAllTemplateConfigs()
  const currentTemplate = getTemplate(templateId)

  const handleExportLatex = useCallback(() => {
    if (!currentTemplate) return
    const latex = currentTemplate.generateLatex(resume, sectionOrder, sectionVisibility)
    const name = resume.personalInfo.fullName || 'resume'
    const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.tex`
    downloadFile(latex, filename, 'application/x-latex')
    toast.success('LaTeX file exported', {
      description: `${filename} downloaded successfully.`,
    })
  }, [resume, sectionOrder, sectionVisibility, currentTemplate])

  const handleExportPdf = useCallback(async () => {
    if (!currentTemplate || isExportingPdf) return
    setIsExportingPdf(true)
    const latex = currentTemplate.generateLatex(resume, sectionOrder, sectionVisibility)
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
  }, [resume, sectionOrder, sectionVisibility, currentTemplate, isExportingPdf])

  const handleMultiPageDownload = useCallback(() => {
    const pending = pendingDownloadRef.current
    if (!pending) return
    downloadPdf(pending.blob, pending.filename)
    toast.success('PDF exported', {
      description: `${pending.filename} downloaded successfully.`,
    })
    setShowMultiPageDialog(false)
    pendingDownloadRef.current = null
  }, [])

  const handleResetResume = useCallback(() => {
    resetResume()
    toast.success('Resume reset', { description: 'All fields restored to defaults.' })
  }, [resetResume])

  const shortcuts = useMemo(
    () => ({
      p: handleExportPdf,
      l: handleExportLatex,
      d: toggleDarkMode,
      '?': () => setShortcutsOpen(true),
    }),
    [handleExportPdf, handleExportLatex, toggleDarkMode]
  )

  useKeyboardShortcuts(shortcuts)

  return (
    <TooltipProvider delay={400}>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar activeSection={activeSection} onSectionClick={setActiveSection} />
        <Separator orientation="vertical" className="h-auto" />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-col w-full md:w-[55%] min-w-0 border-r border-border">
            <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <h2 className="text-sm font-semibold text-foreground">Resume Editor</h2>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger render={<Button variant="ghost" size="icon-xs" onClick={handleResetResume} aria-label="Reset resume" />}>
                    <RotateCcw className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>Reset resume</TooltipContent>
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
                  <TooltipContent>Command palette (⌘K)</TooltipContent>
                </Tooltip>
                <KeyboardShortcutsButton open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
              </div>
            </header>
            <div className="flex-1 overflow-y-auto">
              <EditorPanel activeSection={activeSection} />
            </div>
          </div>
          <div className="hidden md:flex md:flex-col md:flex-1 min-w-0 bg-muted/30">
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
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
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
          onResetResume={handleResetResume}
          onTemplateChange={setTemplateId}
          templateOptions={templateConfigs.map((tc) => ({ id: tc.id, name: tc.name }))}
          isDarkMode={darkMode}
        />
      </div>
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
    </TooltipProvider>
  )
}
