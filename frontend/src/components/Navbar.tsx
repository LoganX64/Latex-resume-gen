import { Link } from 'react-router-dom'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'
import { faFileLines, faStar } from '@/lib/icons'
import { SunIcon } from '@/components/SunIcon'
import { MoonIcon } from '@/components/MoonIcon'
import { ShineButton } from '@/components/motion/ShineButton'

export function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/cvstack-logo-light.svg" alt="CVStack Logo" className="h-7 w-auto rounded-md dark:hidden" />
          <img src="/cvstack-logo-dark.svg" alt="CVStack Logo" className="hidden h-7 w-auto rounded-md dark:block" />
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
                <Icon icon={faStar} className="h-3.5 w-3.5" />
              </Button>
            </a>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <SunIcon className="h-3.5 w-3.5" /> : <MoonIcon className="h-3.5 w-3.5" />}
          </Button>
          <Link to="/editor">
            <ShineButton size="sm" className="gap-1.5">
              <Icon icon={faFileLines} className="h-3.5 w-3.5 sm:hidden" aria-hidden="true" />
              <span className="hidden sm:inline">Build Resume</span>
              <span className="sm:hidden">Build</span>
            </ShineButton>
          </Link>
        </div>
      </div>
    </nav>
  )
}
