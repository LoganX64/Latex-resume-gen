import { useCallback, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Sidebar } from '@/components/editor/Sidebar'
import { EditorPanel } from '@/components/editor/EditorPanel'
import { ResumePreview } from '@/components/preview/ResumePreview'
import { OverflowIndicator } from '@/components/preview/OverflowIndicator'
import { useResumeStore } from '@/stores/resume-store'
import { downloadFile } from '@/utils/download'
import { Sun, Moon, Download, FileText, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'
import { getTemplate, getAllTemplateConfigs } from '@/templates'

export function MainLayout() {
  const { darkMode, toggleDarkMode } = useTheme()
  const resetResume = useResumeStore((s) => s.resetResume)
  const resume = useResumeStore((s) => s.resume)
  const sectionOrder = useResumeStore((s) => s.sectionOrder)
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility)
  const templateId = useResumeStore((s) => s.templateId)
  const setTemplateId = useResumeStore((s) => s.setTemplateId)
  const [isOverflowing, setIsOverflowing] = useState(false)

  const templateConfigs = getAllTemplateConfigs()
  const currentTemplate = getTemplate(templateId)

  const handleExportLatex = useCallback(() => {
    if (!currentTemplate) return
    const latex = currentTemplate.generateLatex(resume, sectionOrder, sectionVisibility)
    const name = resume.personalInfo.fullName || 'resume'
    const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.tex`
    downloadFile(latex, filename, 'application/x-latex')
  }, [resume, sectionOrder, sectionVisibility, currentTemplate])

  const handleExportPdf = useCallback(async () => {
    if (!currentTemplate) return
    const latex = currentTemplate.generateLatex(resume, sectionOrder, sectionVisibility)
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latex }),
      })
      if (!response.ok) {
        const error = await response.json()
        console.error('Compilation failed:', error)
        return
      }
      const blob = await response.blob()
      const name = resume.personalInfo.fullName || 'resume'
      const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.pdf`
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('PDF export failed:', err)
    }
  }, [resume, sectionOrder, sectionVisibility, currentTemplate])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <Separator orientation="vertical" className="h-auto" />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-[55%] min-w-0 border-r border-border">
          <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <h2 className="text-sm font-semibold text-foreground">Resume Editor</h2>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={resetResume}
                aria-label="Reset resume"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={toggleDarkMode}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto">
            <EditorPanel />
          </div>
        </div>
        <div className="flex flex-col flex-1 min-w-0 bg-muted/30">
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
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleExportLatex}
                aria-label="Export LaTeX file"
              >
                <FileText className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleExportPdf}
                aria-label="Export PDF file"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ResumePreview onOverflowChange={setIsOverflowing} />
          </div>
          <OverflowIndicator isOverflowing={isOverflowing} />
        </div>
      </div>
    </div>
  )
}
