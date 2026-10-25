import { Icon } from "@/components/Icon"
import { faKeyboard } from "@/lib/icons"
import { cn } from "@/lib/utils"
import { KeyboardShortcutsDialog } from "./KeyboardShortcutsDialog"

interface KeyboardShortcutsButtonProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
}

export function KeyboardShortcutsButton({
  open,
  onOpenChange,
  className,
}: KeyboardShortcutsButtonProps) {
  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className={cn(
          "inline-flex size-6 sm:size-7 lg:size-8 items-center justify-center rounded-[min(var(--radius-md),10px)] hover:bg-muted hover:text-foreground",
          className
        )}
        aria-label="Keyboard shortcuts"
      >
        <Icon icon={faKeyboard} className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
      </button>
      <KeyboardShortcutsDialog open={open} onOpenChange={onOpenChange} />
    </>
  )
}
