import { Link } from 'react-router-dom'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Star, FileText } from 'lucide-react'

export function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/logo.svg" alt="LaTeX Resume Logo" className="h-7 w-7 rounded-md" />
          <span className="font-bold text-sm sm:text-base tracking-tight">
            <span className="text-primary">LaTeX</span>
            <span className="text-foreground"> Resume</span>
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {import.meta.env.VITE_GITHUB_URL && (
            <a
              href={import.meta.env.VITE_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon-sm" aria-label="Star on GitHub">
                <Star className="h-3.5 w-3.5" />
              </Button>
            </a>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
          <Link to="/editor">
            <Button size="sm" className="gap-1.5">
              <FileText className="h-3.5 w-3.5 sm:hidden" aria-hidden="true" />
              <span className="hidden sm:inline">Build Resume</span>
              <span className="sm:hidden">Build</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
