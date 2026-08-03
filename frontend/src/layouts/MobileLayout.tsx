import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { StorageWarning } from "@/components/StorageWarning";
import { SaveVersionDialog } from "@/components/SaveVersionDialog";
import { MobileTopNavbar } from "@/components/mobile/MobileTopNavbar";
import { MobileBottomNavbar } from "@/components/mobile/MobileBottomNavbar";
import { MobileSavedSheet } from "@/components/mobile/MobileSavedSheet";
import { MobilePreviewSheet } from "@/components/mobile/MobilePreviewSheet";
import { useExportActions } from "@/hooks/useExportActions";
import { MobileSidebar } from "@/components/mobile/MobileSidebar";
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
import { Button } from "@/components/ui/button";
import { TriangleAlert, ImageOff } from "lucide-react";
import { CompileProgressDialog } from "@/components/CompileProgressDialog";

export default function MobileLayout() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [showSidebar, setShowSidebar] = useState(false);

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showSavedSheet, setShowSavedSheet] = useState(false);
  const [showPreviewSheet, setShowPreviewSheet] = useState(false);

  const {
    handleExportPdf,
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

  const handleHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="h-dvh overflow-hidden flex flex-col w-full bg-linear-to-br from-background via-rose-50/10 to-rose-100/20 dark:from-background dark:via-rose-950/10 dark:to-rose-950/20">
      <MobileTopNavbar
        onSave={() => setShowSaveDialog(true)}
        onMenuToggle={() => setShowSidebar(true)}
      />
      <main
        id="editor-main"
        className="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
      >
        <EditorPanel activeSection={activeSection} />
        <StorageWarning className="mx-2 mb-2" />
      </main>
      <MobileBottomNavbar
        onHome={handleHome}
        onSaved={() => setShowSavedSheet(true)}
        onPreview={() => setShowPreviewSheet(true)}
        onDownload={() => handleExportPdf()}
        isExportingPdf={isExportingPdf}
      />

      <MobileSidebar
        open={showSidebar}
        onOpenChange={setShowSidebar}
        activeSection={activeSection}
        onSectionClick={(id) => {
          setActiveSection(id);
          setShowSidebar(false);
        }}
        onSaveClick={() => {
          setShowSaveDialog(true);
          setShowSidebar(false);
        }}
      />
      <MobileSavedSheet
        open={showSavedSheet}
        onOpenChange={setShowSavedSheet}
      />
      <MobilePreviewSheet
        open={showPreviewSheet}
        onOpenChange={setShowPreviewSheet}
      />

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

      <AlertDialog
        open={showMultiPageDialog}
        onOpenChange={setShowMultiPageDialog}
      >
        <AlertDialogContent className="sm:max-w-sm">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-destructive shrink-0" />
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
              <ImageOff className="h-5 w-5 text-muted-foreground shrink-0" />
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
    </div>
  );
}
