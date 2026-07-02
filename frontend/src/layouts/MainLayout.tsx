import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sidebar } from '@/components/editor/Sidebar'
import { EditorPanel } from '@/components/editor/EditorPanel'
import { useResumeStore } from '@/stores/resume-store'
import { Sun, Moon, Download, FileText, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/theme-provider'

export function MainLayout() {
  const { darkMode, toggleDarkMode } = useTheme()
  const resetResume = useResumeStore((s) => s.resetResume)

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
                title="Reset resume"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={toggleDarkMode}
                title="Toggle theme"
              >
                {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </header>
          <ScrollArea className="flex-1">
            <EditorPanel />
          </ScrollArea>
        </div>
        <div className="flex flex-col flex-1 min-w-0 bg-muted/30">
          <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <h2 className="text-sm font-semibold text-foreground">Live Preview</h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-xs" title="Export LaTeX">
                <FileText className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon-xs" title="Export PDF">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          </header>
          <ScrollArea className="flex-1 p-6">
            <div className="flex items-start justify-center">
              <div className="bg-white shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
                <div className="p-8 text-sm text-gray-500 italic">
                  Preview will be implemented in Phase 4
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
