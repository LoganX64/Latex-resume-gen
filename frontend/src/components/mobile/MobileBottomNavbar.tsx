import { Home, Bookmark, Eye, Download } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface MobileBottomNavbarProps {
  onHome: () => void;
  onSaved: () => void;
  onPreview: () => void;
  onDownload: () => void;
  isExportingPdf: boolean;
}

export function MobileBottomNavbar({
  onHome,
  onSaved,
  onPreview,
  onDownload,
  isExportingPdf,
}: MobileBottomNavbarProps) {
  return (
    <nav className="flex items-stretch border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 shrink-0 safe-area-inset-bottom">
      {(
        [
          {
            label: "Home",
            icon: <Home className="h-5 w-5" />,
            onClick: onHome,
            key: "home",
          },
          {
            label: "Saved",
            icon: <Bookmark className="h-5 w-5" />,
            onClick: onSaved,
            key: "saved",
          },
          {
            label: "Preview",
            icon: <Eye className="h-5 w-5" />,
            onClick: onPreview,
            key: "preview",
          },
        ] as const
      ).map((item) => (
        <button
          key={item.key}
          onClick={item.onClick}
          className="flex-1 flex flex-col items-center justify-center gap-1 h-16 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
          aria-label={item.label}
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}

      {/* Download CTA — rose accent */}
      <button
        onClick={onDownload}
        disabled={isExportingPdf}
        className="flex-1 flex flex-col items-center justify-center gap-1 h-16 text-primary hover:bg-primary/10 transition-colors disabled:opacity-60"
        aria-label="Download PDF"
      >
        {isExportingPdf ? (
          <Spinner className="h-5 w-5" />
        ) : (
          <Download className="h-5 w-5" />
        )}
        <span className="text-[10px] font-medium">
          {isExportingPdf ? "Exporting…" : "Download"}
        </span>
      </button>
    </nav>
  );
}
