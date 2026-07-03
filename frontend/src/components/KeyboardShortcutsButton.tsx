import { Keyboard } from "lucide-react"
import { KeyboardShortcutsDialog } from "./KeyboardShortcutsDialog"

interface KeyboardShortcutsButtonProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsButton({
  open,
  onOpenChange,
}: KeyboardShortcutsButtonProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="inline-flex size-6 items-center justify-center rounded-[min(var(--radius-md),10px)] hover:bg-muted hover:text-foreground"
        aria-label="Keyboard shortcuts"
      >
        <Keyboard className="h-3.5 w-3.5" />
      </button>
      <KeyboardShortcutsDialog open={open} onOpenChange={onOpenChange} />
    </>
  )
}
