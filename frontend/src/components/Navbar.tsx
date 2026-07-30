import { Link } from 'react-router-dom'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Star } from 'lucide-react'

export function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/favicon.svg?v=2" alt="Logo" className="h-6 w-6" />
          <span className="font-bold text-sm">LaTeX Resume</span>
        </Link>

        <div className="flex items-center gap-2">
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
            <Button size="sm">Build Resume</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
