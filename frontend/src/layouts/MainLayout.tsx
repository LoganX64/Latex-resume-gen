import { useCallback, useMemo, useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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

export function MainLayout() {
  const { darkMode, toggleDarkMode } = useTheme()
  const resetResume = useResumeStore((s) => s.resetResume)
  const resume = useResumeStore((s) => s.resume)
  const sectionOrder = useResumeStore((s) => s.sectionOrder)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const templateId = useResumeStore((s) => s.templateId)
  const setTemplateId = useResumeStore((s) => s.setTemplateId)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

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
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latex }),
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
      const blob = await response.blob()
      const name = resume.personalInfo.fullName || 'resume'
      const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.pdf`
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
        <Sidebar />
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
              <EditorPanel />
            </div>
          </div>
          <div className="hidden md:flex md:flex-col md:flex-1 min-w-0 bg-muted/30">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">Live Preview</h2>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="text-[10px] bg-transparent border border-border rounded px-2 py-1 text-foreground cursor-pointer"
                  aria-label="Select resume template"
                >
                  {templateConfigs.map((tc) => (
                    <option key={tc.id} value={tc.id}>
                      {tc.name}
                    </option>
                  ))}
                </select>
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
              <ResumePreview onOverflowChange={setIsOverflowing} />
            </div>
            <OverflowIndicator isOverflowing={isOverflowing} />
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
    </TooltipProvider>
  )
}
