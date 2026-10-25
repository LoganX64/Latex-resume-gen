import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EditorSidebarV2 } from "@/components/v2/editor/EditorSidebarV2";
import { EditorPaneV2 } from "@/components/v2/editor/EditorPaneV2";
import { SaveVersionDialog } from "@/components/SaveVersionDialog";
import { CompileProgressDialog } from "@/components/CompileProgressDialog";
import { CommandPalette } from "@/components/CommandPalette";
import { useResumeStore } from "@/stores/resume-store";
import { useExportActions } from "@/hooks/useExportActions";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTheme } from "@/components/theme-provider";
import { getAllTemplateConfigs } from "@/templates";
import { Icon } from "@/components/Icon";
import { faImageSlash, faTriangleExclamation } from "@/lib/icons";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditorV2Layout() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const resetResume = useResumeStore((s) => s.resetResume);
  const clearResume = useResumeStore((s) => s.clearResume);
  const setTemplateId = useResumeStore((s) => s.setTemplateId);
  const [activeSection, setActiveSection] = useState("personal");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const {
    handleExportPdf,
    handleExportLatex,
    handleMultiPageDownload,
    handleNoPhotoContinue,
    handleCompileCancel,
    isExportingPdf,
    compileDialogOpen,
    setCompileDialogOpen,
    showMultiPageDialog,
    setShowMultiPageDialog,
    multiPageCount,
    showNoPhotoDialog,
    setShowNoPhotoDialog,
    progress,
    compileStatus,
    compileWsError,
  } = useExportActions();

  const templateConfigs = getAllTemplateConfigs();

  const openSaveDialog = useCallback(() => setShowSaveDialog(true), []);

  const handleLoadSample = useCallback(() => {
    resetResume();
    toast.success("Sample data loaded", {
      description: "Resume populated with sample data.",
    });
  }, [resetResume]);

  const handleClearResume = useCallback(() => {
    clearResume();
    toast.success("Resume cleared", {
      description: "All fields have been cleared.",
    });
  }, [clearResume]);

  const shortcuts = useMemo(
    () => ({
      p: () => handleExportPdf(),
      l: () => handleExportLatex(),
      d: toggleDarkMode,
      s: openSaveDialog,
      h: () => navigate("/"),
      "?": () => setShortcutsOpen(true),
    }),
    [handleExportPdf, handleExportLatex, toggleDarkMode, openSaveDialog, navigate]
  );

  useKeyboardShortcuts(shortcuts);

  return (
    <TooltipProvider delay={400}>
      <SidebarProvider>
        <EditorSidebarV2
          activeSection={activeSection}
          onSectionClick={setActiveSection}
          onSaveClick={openSaveDialog}
        />
        <SidebarInset className="h-svh overflow-hidden bg-background">
          <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-2">
            <EditorPaneV2
              activeSection={activeSection}
              isExportingPdf={isExportingPdf}
              shortcutsOpen={shortcutsOpen}
              onShortcutsOpenChange={setShortcutsOpen}
              onSaveClick={openSaveDialog}
              onClearResume={handleClearResume}
              onLoadSample={handleLoadSample}
              onExportPdf={() => handleExportPdf()}
            />
            <div aria-hidden="true" className="hidden min-h-0 lg:block" />
          </div>
        </SidebarInset>
      </SidebarProvider>

      <AlertDialog
        open={showMultiPageDialog}
        onOpenChange={setShowMultiPageDialog}
      >
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <Icon
                icon={faTriangleExclamation}
                className="h-5 w-5 text-destructive shrink-0"
              />
              <AlertDialogTitle>Multi-page resume</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Your resume is <strong>{multiPageCount} pages</strong> long. Most
              ATS systems and recruiters prefer single-page resumes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <p className="text-xs text-muted-foreground">
            Try hiding less important sections or shortening bullet points to
            fit on one page.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowMultiPageDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleMultiPageDownload}>
              Download anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showNoPhotoDialog} onOpenChange={setShowNoPhotoDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Icon
                icon={faImageSlash}
                className="h-5 w-5 text-muted-foreground shrink-0"
              />
              <DialogTitle>No profile photo</DialogTitle>
            </div>
            <DialogDescription>
              This template supports a profile photo but none has been uploaded.
              Your resume will be exported without a photo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNoPhotoDialog(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleNoPhotoContinue}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SaveVersionDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
      />

      <CompileProgressDialog
        open={compileDialogOpen}
        onOpenChange={setCompileDialogOpen}
        onCancel={handleCompileCancel}
        status={compileStatus}
        progress={progress}
        errorMessage={compileWsError}
      />

      <CommandPalette
        onExportLatex={() => handleExportLatex()}
        onExportPdf={() => handleExportPdf()}
        onToggleDarkMode={toggleDarkMode}
        onResetResume={handleLoadSample}
        onClearResume={handleClearResume}
        onTemplateChange={setTemplateId}
        templateOptions={templateConfigs.map((tc) => ({
          id: tc.id,
          name: tc.name,
        }))}
        isDarkMode={darkMode}
      />
    </TooltipProvider>
  );
}
