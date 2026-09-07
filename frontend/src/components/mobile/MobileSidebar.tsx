import { useResumeStore } from "@/stores/resume-store";
import { useStatsStore } from "@/stores/stats-store";
import { useNavigate } from "react-router-dom";
import { recordVisit } from "@/utils/stats";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/Icon";
import {
  faFloppyDisk,
  faEye,
  faArrowDown,
  faRotateLeft,
  faTrash,
  faHouse,
  faUser,
  faFileLines,
  faBriefcase,
  faFolder,
  faGraduationCap,
  faAward,
  faGlobe,
  faPuzzlePiece,
  faLayerGroup,
  faTrophy,
  faBookOpen,
  faXmark,
} from "@/lib/icons";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const navItems = [
  { id: "personal", icon: faUser, label: "Personal Info" },
  { id: "summary", icon: faFileLines, label: "Summary" },
  { id: "experience", icon: faBriefcase, label: "Experience" },
  { id: "skills", icon: faPuzzlePiece, label: "Skills" },
  { id: "projects", icon: faFolder, label: "Projects" },
  { id: "education", icon: faGraduationCap, label: "Education" },
  { id: "certifications", icon: faAward, label: "Certifications" },
  { id: "achievements", icon: faTrophy, label: "Achievements" },
  { id: "publications", icon: faBookOpen, label: "Publications" },
  { id: "languages", icon: faGlobe, label: "Languages" },
  { id: "customSections", icon: faLayerGroup, label: "Custom Sections" },
];

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
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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

  const confirmClearResume = () => {
    clearResume();
    toast.success("Resume cleared", {
      description: "All fields have been cleared.",
    });
    setShowClearConfirm(false);
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-64 p-0 flex flex-col bg-sidebar border-r border-sidebar-border"
        >
          {/* ── Header ── */}
          <div className="flex items-center gap-2.5 px-3 py-3 border-b border-sidebar-border bg-sidebar shrink-0">
            <img
              src="/cvstack-logo-light.svg"
              alt="CVStack Logo"
              className="h-7 w-auto shrink-0 rounded-md dark:hidden"
            />
            <img
              src="/cvstack-logo-dark.svg"
              alt="CVStack Logo"
              className="hidden h-7 w-auto shrink-0 rounded-md dark:block"
            />
            <SheetClose className="ml-auto p-1 rounded-md hover:bg-sidebar-accent">
              <Icon icon={faXmark} className="h-4 w-4" />
            </SheetClose>
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
                    <Icon
                      icon={item.icon}
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
                <Icon icon={faEye} className="h-3 w-3" />
                {stats.visits.toLocaleString()} visits
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Icon icon={faArrowDown} className="h-3 w-3" />
                {stats.downloads.toLocaleString()} downloads
              </span>
            </div>

            <button
              onClick={() => onSaveClick?.()}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors"
            >
              <Icon icon={faFloppyDisk} className="h-3.5 w-3.5 text-primary" />
              <span>Save Version</span>
            </button>

            <button
              onClick={handleLoadSample}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors"
            >
              <Icon icon={faRotateLeft} className="h-3.5 w-3.5 text-sidebar-foreground/60" />
              <span>Load Sample Data</span>
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium hover:bg-destructive/10 text-destructive/80 hover:text-destructive transition-colors"
            >
              <Icon icon={faTrash} className="h-3.5 w-3.5 text-rose-500" />
              <span>Clear Resume</span>
            </button>

            <button
              onClick={() => {
                navigate("/");
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors"
            >
              <Icon icon={faHouse} className="h-3.5 w-3.5 text-sidebar-foreground/60" />
              <span>Home</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to clear your resume? All entered data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClearResume}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
