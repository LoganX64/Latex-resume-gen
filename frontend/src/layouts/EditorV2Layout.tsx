import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/editor-v2/AppSidebar";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { OverflowIndicator } from "@/components/preview/OverflowIndicator";
import { StorageWarning } from "@/components/StorageWarning";
import { Card } from "@/components/ui/card";
import { CompactFooter } from "@/components/CompactFooter";
import { SaveVersionDialog } from "@/components/SaveVersionDialog";
import { useResumeStore } from "@/stores/resume-store";
import { useExportActions } from "@/hooks/useExportActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileTopNavbar } from "@/components/mobile/MobileTopNavbar";
import { MobileBottomNavbar } from "@/components/mobile/MobileBottomNavbar";
import { MobileSidebar } from "@/components/mobile/MobileSidebar";
import { MobilePreviewSheet } from "@/components/mobile/MobilePreviewSheet";
import { MobileSavedSheet } from "@/components/mobile/MobileSavedSheet";
import { Icon } from "@/components/Icon";
import {
  faTriangleExclamation,
  faImageSlash,
  faMagnifyingGlass,
  faFloppyDisk,
  faHouse,
  faEye,
  faTrash,
  faFileLines,
  faDownload,
  faSun,
  faMoon,
  faRotateLeft,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/components/theme-provider";
import { getAllTemplateConfigs } from "@/templates";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { CommandPalette } from "@/components/CommandPalette";
import { CompileProgressDialog } from "@/components/CompileProgressDialog";
import { KeyboardShortcutsButton } from "@/components/KeyboardShortcutsButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function EditorSplitPaneLeft({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${className} animate-slide-in-left`}>
      {children}
    </div>
  );
}

function EditorSplitPaneRight({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${className} animate-slide-in-right`}>
      {children}
    </div>
  );
}

export default function EditorV2Layout() {
  const isMobile = useIsMobile();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const resetResume = useResumeStore((s) => s.resetResume);
  const clearResume = useResumeStore((s) => s.clearResume);
  const templateId = useResumeStore((s) => s.templateId);
  const setTemplateId = useResumeStore((s) => s.setTemplateId);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);

  const {
    handleExportPdf,
    handleExportVersionPdf,
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
      p: handleExportPdf,
      l: handleExportLatex,
      d: toggleDarkMode,
      s: () => setShowSaveDialog(true),
      h: () => navigate("/"),
      "?": () => setShortcutsOpen(true),
    }),
    [handleExportPdf, handleExportLatex, toggleDarkMode, navigate],
  );

  useKeyboardShortcuts(shortcuts);

  useLayoutEffect(() => {
    if (!isMobile) return;
    const el = document.getElementById("editor-main");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    el?.scrollTo({ top: 0, behavior: "auto" });
  }, [isMobile, location.pathname]);

  return (
    <TooltipProvider delay={400}>
      <a
        href="#editor-main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-background focus:border focus:border-ring focus:rounded"
      >
        Skip to editor
      </a>

      {/* ── Mobile layout ── */}
      {isMobile ? (
        <div className="flex flex-col h-dvh overflow-hidden bg-background">
          <MobileTopNavbar
            onMenuToggle={() => setSidebarOpen(true)}
          />
          <div className="flex-1 min-h-0 overflow-hidden">
            <div
              id="editor-main"
              className="h-full overflow-y-auto pb-24"
            >
              <EditorPanel
                activeSection={activeSection}
                disableInitialActiveSectionScroll
              />
            </div>
          </div>
          <MobileBottomNavbar
            onHome={() => navigate("/")}
            onSaved={() => setSavedOpen(true)}
            onSave={() => setShowSaveDialog(true)}
            onPreview={() => setPreviewOpen(true)}
            onDownload={handleExportPdf}
            isExportingPdf={isExportingPdf}
          />
          <MobileSidebar
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            activeSection={activeSection}
            onSectionClick={(id) => {
              setActiveSection(id);
              setSidebarOpen(false);
            }}
            onSaveClick={() => setShowSaveDialog(true)}
          />
          <MobileSavedSheet
            open={savedOpen}
            onOpenChange={setSavedOpen}
            onExportPdf={handleExportVersionPdf}
            isExportingPdf={isExportingPdf}
          />
        </div>
      ) : (
      /* ── Desktop layout ── */
      <SidebarProvider>
        {!fullscreenPreview && (
          <AppSidebar
            activeSection={activeSection}
            onSectionClick={setActiveSection}
            onSaveClick={() => setShowSaveDialog(true)}
          />
        )}
        <SidebarInset className="h-dvh overflow-hidden flex flex-col bg-background">
          <div className="flex flex-1 overflow-hidden min-h-0 p-3 gap-3">
            {!fullscreenPreview && (
              <EditorSplitPaneLeft className="flex flex-col w-full lg:w-[55%] min-w-0">
                <Card className="flex flex-col flex-1 min-h-0 gap-0 overflow-hidden py-0">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card shrink-0">
                    <span className="text-xs font-semibold text-foreground">
                      Resume Editor
                    </span>
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="sm:h-7 sm:w-7 lg:h-8 lg:w-8"
                              onClick={() => setShowSaveDialog(true)}
                              aria-label="Save as version"
                            />
                          }
                        >
                          <Icon
                            icon={faFloppyDisk}
                            className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
                          />
                        </TooltipTrigger>
                        <TooltipContent>Save as version</TooltipContent>
                      </Tooltip>
                      <Link to="/">
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                className="sm:h-7 sm:w-7 lg:h-8 lg:w-8"
                                aria-label="Back to home"
                              />
                            }
                          >
                            <Icon
                              icon={faHouse}
                              className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
                            />
                          </TooltipTrigger>
                          <TooltipContent>Home</TooltipContent>
                        </Tooltip>
                      </Link>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="sm:h-7 sm:w-7 lg:h-8 lg:w-8"
                              onClick={handleClearResume}
                              aria-label="Clear resume"
                            />
                          }
                        >
                          <Icon
                            icon={faTrash}
                            className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-rose-500"
                          />
                        </TooltipTrigger>
                        <TooltipContent>Clear resume</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="sm:h-7 sm:w-7 lg:h-8 lg:w-8"
                              onClick={handleLoadSample}
                              aria-label="Load sample data"
                            />
                          }
                        >
                          <Icon
                            icon={faRotateLeft}
                            className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
                          />
                        </TooltipTrigger>
                        <TooltipContent>Load sample data</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="sm:h-7 sm:w-7 lg:h-8 lg:w-8"
                              onClick={toggleDarkMode}
                              aria-label={
                                darkMode
                                  ? "Switch to light mode"
                                  : "Switch to dark mode"
                              }
                            />
                          }
                        >
                          {darkMode ? (
                            <Icon
                              icon={faSun}
                              className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
                            />
                          ) : (
                            <Icon
                              icon={faMoon}
                              className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
                            />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {darkMode ? "Light mode" : "Dark mode"}
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="sm:h-7 sm:w-7 lg:h-8 lg:w-8"
                              onClick={() =>
                                document.dispatchEvent(
                                  new KeyboardEvent("keydown", {
                                    key: "k",
                                    metaKey: true,
                                  }),
                                )
                              }
                              aria-label="Command palette"
                            />
                          }
                        >
                          <Icon
                            icon={faMagnifyingGlass}
                            className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          Command palette (
                          {navigator.platform.toUpperCase().indexOf("MAC") >= 0
                            ? "⌘K"
                            : "Ctrl+K"}
                          )
                        </TooltipContent>
                      </Tooltip>
                      <KeyboardShortcutsButton
                        open={shortcutsOpen}
                        onOpenChange={setShortcutsOpen}
                      />
                    </div>
                  </div>
                  <div
                    id="editor-main"
                    className="flex-1 overflow-y-auto relative"
                  >
                    <EditorPanel activeSection={activeSection} />
                  </div>
                  <StorageWarning className="mx-2 mb-2" />
                  <CompactFooter />
                </Card>
              </EditorSplitPaneLeft>
            )}
            <EditorSplitPaneRight className={`flex flex-col h-full ${fullscreenPreview ? "w-full" : "hidden lg:flex lg:flex-col lg:flex-1"} min-w-0`}>
              <Card className="flex flex-col flex-1 min-h-0 overflow-hidden py-0">
                <ResumePreview
                  fullscreen={fullscreenPreview}
                  onToggleFullscreen={() => setFullscreenPreview((v) => !v)}
                  toolbarActions={
                    <>
                      <Select
                        value={templateId}
                        onValueChange={(v) => v && setTemplateId(v)}
                      >
                        <SelectTrigger
                          className="text-xs sm:text-sm h-8 sm:h-9 px-2 py-1 gap-1 cursor-pointer min-w-[120px] sm:min-w-[140px]"
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
                  }
                />
                <OverflowIndicator />
              </Card>
            </EditorSplitPaneRight>
          </div>
          <CommandPalette
            onExportLatex={handleExportLatex}
            onExportPdf={handleExportPdf}
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
        </SidebarInset>
      </SidebarProvider>
      )}

      <Button
        variant="default"
        size="icon"
        className="fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full shadow-lg hidden md:flex lg:hidden touch-manipulation"
        onClick={() => setPreviewOpen(true)}
        aria-label="Preview resume"
      >
        <Icon icon={faEye} className="h-6 w-6 md:h-7 md:w-7" />
      </Button>

      {/* ── Shared dialogs ── */}
      <MobilePreviewSheet open={previewOpen} onOpenChange={setPreviewOpen} />
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
    </TooltipProvider>
  );
}
