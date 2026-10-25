import { Link } from 'react-router-dom'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'
import { faStar } from '@/lib/icons'
import { SunIcon } from '@/components/SunIcon'
import { MoonIcon } from '@/components/MoonIcon'
import { ShineButton } from '@/components/motion/ShineButton'
import { toggleThemeFromButton } from '@/lib/theme-transition'

export function NavbarV2() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/v2" className="flex items-center gap-1 shrink-0">
          <img src="/logo.svg" alt="" className="h-7 w-7 object-contain" />
          <span className="text-lg font-bold italic tracking-tight">
            <span className="text-primary">CV</span>
            <span className="text-foreground">Stack</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {import.meta.env.VITE_GITHUB_URL && (
            <a
              href={import.meta.env.VITE_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon-sm" aria-label="Star on GitHub">
                <Icon icon={faStar} className="h-3.5 w-3.5" />
              </Button>
            </a>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(event) =>
              toggleThemeFromButton(event.currentTarget, toggleDarkMode)
            }
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <SunIcon className="h-3.5 w-3.5" /> : <MoonIcon className="h-3.5 w-3.5" />}
          </Button>
          <Link to="/editor-v2">
            <ShineButton size="sm" className="rounded-full px-4">
              <span className="hidden sm:inline">Build Resume</span>
              <span className="sm:hidden">Build</span>
            </ShineButton>
          </Link>
        </div>
      </div>
    </nav>
  )
}
