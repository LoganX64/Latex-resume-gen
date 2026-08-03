import { useResumeStore } from "@/stores/resume-store";
import { useStatsStore } from "@/stores/stats-store";
import { useNavigate } from "react-router-dom";
import { recordVisit } from "@/utils/stats";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  User,
  FileText,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Trophy,
  BookOpen,
  Globe,
  Puzzle,
  Layers,
  Save,
  Home,
  Eye,
  Download,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const navItems = [
  { id: "personal", icon: User, label: "Personal Info" },
  { id: "summary", icon: FileText, label: "Summary" },
  { id: "experience", icon: Briefcase, label: "Experience" },
  { id: "skills", icon: Puzzle, label: "Skills" },
  { id: "projects", icon: FolderGit2, label: "Projects" },
  { id: "education", icon: GraduationCap, label: "Education" },
  { id: "certifications", icon: Award, label: "Certifications" },
  { id: "achievements", icon: Trophy, label: "Achievements" },
  { id: "publications", icon: BookOpen, label: "Publications" },
  { id: "languages", icon: Globe, label: "Languages" },
  { id: "customSections", icon: Layers, label: "Custom Sections" },
] as const;

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSection?: string;
  onSectionClick?: (id: string) => void;
  onSaveClick?: () => void;
}

export function MobileSidebar({
  open,
  onOpenChange,
  activeSection,
  onSectionClick,
  onSaveClick,
}: MobileSidebarProps) {
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility);
  const resetResume = useResumeStore((s) => s.resetResume);
  const clearResume = useResumeStore((s) => s.clearResume);
  const stats = useStatsStore();
  const refresh = useStatsStore((s) => s.refresh);
  const navigate = useNavigate();

  useEffect(() => {
    recordVisit().then(() => refresh());
  }, []);

  const handleLoadSample = () => {
    resetResume();
    toast.success("Sample data loaded", {
      description: "Resume populated with sample data.",
    });
    onOpenChange(false);
  };

  const handleClearResume = () => {
    clearResume();
    toast.success("Resume cleared", {
      description: "All fields have been cleared.",
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-64 p-0 flex flex-col bg-sidebar border-r border-sidebar-border"
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-2.5 px-3 py-3 border-b border-sidebar-border bg-linear-to-r from-primary/10 via-sidebar to-sidebar shrink-0">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-7 w-7 shrink-0 rounded-md"
          />
          <div className="flex flex-col leading-tight text-left">
            <SheetTitle className="text-sm font-bold text-sidebar-foreground">
              <span className="text-primary">LaTeX</span> Resume
            </SheetTitle>
            <p className="text-[10px] text-sidebar-foreground/60">
              IT Professional Resume Builder
            </p>
          </div>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const sectionKey =
                item.id === "personal"
                  ? "personalInfo"
                  : (item.id as keyof typeof sectionVisibility);
              const isVisible =
                item.id === "personal" ||
                (sectionVisibility[sectionKey] ?? false);
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionClick?.(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-2.5"
                      : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
                  } ${!isVisible ? "opacity-40" : ""}`}
                >
                  <item.icon
                    className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-primary" : "text-sidebar-foreground/60"}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── Footer ── */}
        <div className="border-t border-sidebar-border px-2 py-2 space-y-0.5 shrink-0">
          {/* Stats row */}
          <div className="flex items-center justify-center gap-3 px-3 py-1.5 text-[10px] text-sidebar-foreground/50">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {stats.visits.toLocaleString()} visits
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Download className="h-3 w-3" />
              {stats.downloads.toLocaleString()} downloads
            </span>
          </div>

          <button
            onClick={() => onSaveClick?.()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors"
          >
            <Save className="h-3.5 w-3.5 text-primary" />
            <span>Save Version</span>
          </button>

          <button
            onClick={handleLoadSample}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-sidebar-foreground/60" />
            <span>Load Sample Data</span>
          </button>

          <button
            onClick={handleClearResume}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium hover:bg-destructive/10 text-destructive/80 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Resume</span>
          </button>

          <button
            onClick={() => {
              navigate("/");
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5 text-sidebar-foreground/60" />
            <span>Home</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
