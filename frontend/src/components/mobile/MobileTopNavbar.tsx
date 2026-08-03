import { PanelLeft, Save, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

interface MobileTopNavbarProps {
  onSave: () => void;
  onMenuToggle: () => void;
}

export function MobileTopNavbar({
  onSave,
  onMenuToggle,
}: MobileTopNavbarProps) {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="flex items-center justify-between px-3 py-2 h-12 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onMenuToggle}
          aria-label="Open sidebar"
          className="h-8 w-8"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1.5">
          <img src="/logo.svg" alt="Logo" className="h-5 w-5 rounded-sm" />
          <h1 className="text-sm font-semibold text-foreground">
            <span className="text-primary">LaTeX</span> Resume
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="h-8 w-8"
        >
          {darkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onSave}
          aria-label="Save as version"
          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
        >
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
