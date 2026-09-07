import { Icon } from "@/components/Icon";
import { faBars, faRotateLeft, faTrash } from "@/lib/icons";
import { SunIcon } from "@/components/SunIcon";
import { MoonIcon } from "@/components/MoonIcon";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useResumeStore } from "@/stores/resume-store";
import { toast } from "sonner";

interface MobileTopNavbarProps {
  onMenuToggle: () => void;
}

export function MobileTopNavbar({
  onMenuToggle,
}: MobileTopNavbarProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const resetResume = useResumeStore((s) => s.resetResume);
  const clearResume = useResumeStore((s) => s.clearResume);

  const handleLoadSample = () => {
    resetResume();
    toast.success("Sample data loaded", {
      description: "Resume populated with sample data.",
    });
  };

  const handleClearResume = () => {
    clearResume();
    toast.success("Resume cleared", {
      description: "All fields have been cleared.",
    });
  };

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
          <Icon icon={faBars} className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1.5">
          <img src="/cvstack-logo-light.svg" alt="CVStack Logo" className="h-5 w-auto rounded-sm dark:hidden" />
          <img src="/cvstack-logo-dark.svg" alt="CVStack Logo" className="hidden h-5 w-auto rounded-sm dark:block" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleLoadSample}
          aria-label="Load sample data"
          className="h-8 w-8"
          title="Load sample data"
        >
          <Icon icon={faRotateLeft} className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleClearResume}
          aria-label="Clear resume"
          className="h-8 w-8 text-destructive hover:text-destructive"
          title="Clear resume"
        >
          <Icon icon={faTrash} className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="h-8 w-8"
        >
          {darkMode ? (
            <SunIcon className="h-4 w-4" />
          ) : (
            <MoonIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
