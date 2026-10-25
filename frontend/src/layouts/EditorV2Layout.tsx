import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditorSidebarV2 } from "@/components/v2/editor/EditorSidebarV2";
import { EditorPaneV2 } from "@/components/v2/editor/EditorPaneV2";
import { ResumePreviewV2 } from "@/components/v2/preview/ResumePreviewV2";
import { SaveVersionDialog } from "@/components/SaveVersionDialog";
import { CompileProgressDialog } from "@/components/CompileProgressDialog";
import { CommandPalette } from "@/components/CommandPalette";
import { useResumeStore } from "@/stores/resume-store";
import { useExportActions } from "@/hooks/useExportActions";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTheme } from "@/components/theme-provider";
import { getAllTemplateConfigs } from "@/templates";
import { Icon } from "@/components/Icon";
import {
  faDownload,
  faFileLines,
  faImageSlash,
  faTriangleExclamation,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
  const templateId = useResumeStore((s) => s.templateId);
  const setTemplateId = useResumeStore((s) => s.setTemplateId);
  const [activeSection, setActiveSection] = useState("personal");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);

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

  const previewToolbarActions = (
    <>
      <Select
        value={templateId}
        onValueChange={(v) => v && setTemplateId(v)}
      >
        <SelectTrigger
          className="text-xs sm:text-sm h-8 sm:h-9 px-2 py-1 gap-1 cursor-pointer min-w-[120px]"
          aria-label="Select resume template"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="min-w-48 text-xs sm:text-sm">
          {templateConfigs.map((tc) => (
            <SelectItem
              key={tc.id}
              value={tc.id}
              className="py-1 pr-6 pl-1.5 text-xs sm:text-sm"
            >
              {tc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="sm:h-7 sm:w-7 lg:h-8 lg:w-8"
              onClick={() => handleExportLatex()}
              aria-label="Export LaTeX file"
            />
          }
        >
          <Icon
            icon={faFileLines}
            className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
          />
        </TooltipTrigger>
        <TooltipContent>Export LaTeX (⌘L)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="sm:h-7 sm:w-7 lg:h-8 lg:w-8"
              onClick={() => handleExportPdf()}
              disabled={isExportingPdf}
              aria-label="Export PDF file"
            />
          }
        >
          {isExportingPdf ? (
            <Spinner className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
          ) : (
            <Icon
              icon={faDownload}
              className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
            />
          )}
        </TooltipTrigger>
        <TooltipContent>Export PDF (⌘P)</TooltipContent>
      </Tooltip>
    </>
  );

  return (
    <TooltipProvider delay={400}>
      <SidebarProvider>
        {!fullscreenPreview && (
          <EditorSidebarV2
            activeSection={activeSection}
            onSectionClick={setActiveSection}
            onSaveClick={openSaveDialog}
          />
        )}
        <SidebarInset className="h-svh overflow-hidden bg-background">
          <div
            className={cn(
              "grid h-full min-h-0",
              fullscreenPreview
                ? "grid-cols-1"
                : "grid-cols-1 lg:grid-cols-2"
            )}
          >
            {!fullscreenPreview && (
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
            )}
            <section
              className={cn(
                "min-h-0 min-w-0 flex-col overflow-hidden",
                fullscreenPreview
                  ? "flex h-full"
                  : "hidden h-[calc(100%-8px)] rounded-l-xl border-l border-border lg:flex"
              )}
            >
              <ResumePreviewV2
                fullscreen={fullscreenPreview}
                onToggleFullscreen={() =>
                  setFullscreenPreview((value) => !value)
                }
                toolbarActions={previewToolbarActions}
              />
            </section>
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
