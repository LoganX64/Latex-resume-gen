import { PanelLeft, Save, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { useTheme } from '@/components/theme-provider'

interface MobileTopNavbarProps {
  onSave: () => void
}

export function MobileTopNavbar({ onSave }: MobileTopNavbarProps) {
  const { toggleSidebar } = useSidebar()
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          className="h-11 w-11"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-semibold text-foreground">Resume Editor</h1>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="h-11 w-11"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onSave}
          aria-label="Save as version"
          className="h-11 w-11"
        >
          <Save className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
