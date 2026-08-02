import { Home, Bookmark, Eye, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface MobileBottomNavbarProps {
  onHome: () => void
  onSaved: () => void
  onPreview: () => void
  onDownload: () => void
  isExportingPdf: boolean
}

export function MobileBottomNavbar({
  onHome,
  onSaved,
  onPreview,
  onDownload,
  isExportingPdf,
}: MobileBottomNavbarProps) {
  return (
    <nav className="flex items-stretch border-t border-border bg-background shrink-0 safe-area-inset-bottom">
      <Button
        variant="ghost"
        className="flex-1 flex flex-col items-center justify-center gap-1 h-16 rounded-none"
        onClick={onHome}
        aria-label="Go to home"
      >
        <Home className="h-5 w-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Button>
      <Button
        variant="ghost"
        className="flex-1 flex flex-col items-center justify-center gap-1 h-16 rounded-none"
        onClick={onSaved}
        aria-label="Saved versions"
      >
        <Bookmark className="h-5 w-5" />
        <span className="text-[10px] font-medium">Saved</span>
      </Button>
      <Button
        variant="ghost"
        className="flex-1 flex flex-col items-center justify-center gap-1 h-16 rounded-none"
        onClick={onPreview}
        aria-label="Preview resume"
      >
        <Eye className="h-5 w-5" />
        <span className="text-[10px] font-medium">Preview</span>
      </Button>
      <Button
        variant="ghost"
        className="flex-1 flex flex-col items-center justify-center gap-1 h-16 rounded-none"
        onClick={onDownload}
        disabled={isExportingPdf}
        aria-label="Download PDF"
      >
        {isExportingPdf ? (
          <Spinner className="h-5 w-5" />
        ) : (
          <Download className="h-5 w-5" />
        )}
        <span className="text-[10px] font-medium">
          {isExportingPdf ? 'Exporting...' : 'Download'}
        </span>
      </Button>
    </nav>
  )
}
