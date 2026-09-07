import { Icon } from "@/components/Icon";
import { faEye, faDownload, faHouse, faBookmark, faFloppyDisk } from "@/lib/icons";
import { Spinner } from "@/components/ui/spinner";

interface MobileBottomNavbarProps {
  onHome: () => void;
  onSaved: () => void;
  onSave: () => void;
  onPreview: () => void;
  onDownload: () => void;
  isExportingPdf: boolean;
}

export function MobileBottomNavbar({
  onHome,
  onSaved,
  onSave,
  onPreview,
  onDownload,
  isExportingPdf,
}: MobileBottomNavbarProps) {
  return (
    <nav className="relative select-none rounded-t-2xl border-t border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] shrink-0 safe-area-inset-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 pt-2 pb-3">
        {/* Left: Save */}
        <button
          onClick={onSave}
          className="flex flex-col items-center justify-center min-w-[50px] py-1 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors active:scale-95"
          aria-label="Save as version"
        >
          <Icon icon={faFloppyDisk} className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Save</span>
        </button>

        {/* Left: Saved */}
        <button
          onClick={onSaved}
          className="flex flex-col items-center justify-center min-w-[50px] py-1 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors active:scale-95"
          aria-label="Saved versions"
        >
          <Icon icon={faBookmark} className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Saved</span>
        </button>

        {/* Center: Home (raised) */}
        <div className="relative flex justify-center -mt-6 z-10">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 blur-md opacity-60 scale-110" />
          <button
            onClick={onHome}
            className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-600 text-white shadow-xl border-4 border-background active:scale-95 transition-transform"
            aria-label="Home"
          >
            <Icon icon={faHouse} className="h-6 w-6" />
          </button>
        </div>

        {/* Right: Preview */}
        <button
          onClick={onPreview}
          className="flex flex-col items-center justify-center min-w-[50px] py-1 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-colors active:scale-95"
          aria-label="Preview"
        >
          <Icon icon={faEye} className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-1">Preview</span>
        </button>

        {/* Right: Download */}
        <button
          onClick={onDownload}
          disabled={isExportingPdf}
          className="flex flex-col items-center justify-center min-w-[50px] py-1 text-primary hover:bg-primary/10 rounded-xl transition-colors active:scale-95 disabled:opacity-60"
          aria-label="Download PDF"
        >
          {isExportingPdf ? (
            <Spinner className="h-5 w-5" />
          ) : (
            <Icon icon={faDownload} className="h-5 w-5" />
          )}
          <span className="text-[10px] font-medium mt-1">
            {isExportingPdf ? "Exporting…" : "Download"}
          </span>
        </button>
      </div>
    </nav>
  );
}
