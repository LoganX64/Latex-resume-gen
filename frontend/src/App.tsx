import { Button } from '@/components/ui/button'
import { useResumeStore } from '@/stores/resume-store'
import { useTheme } from '@/components/theme-provider'
import { Sun, Moon } from 'lucide-react'

function App() {
  const { darkMode, toggleDarkMode } = useTheme()
  const resume = useResumeStore((s) => s.resume)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">LaTeX Resume Generator</h1>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </header>
      <main className="p-4">
        <p className="text-muted-foreground">
          Phase 2 complete. Store active. Personal: {resume.personalInfo.fullName || '(empty)'}
        </p>
      </main>
    </div>
  )
}

export default App
