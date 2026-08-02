import { AlertTriangle } from 'lucide-react'

export function StorageWarning({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-[11px] sm:text-xs text-destructive ${className}`}>
      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
      <span>
        Your data is stored locally in this browser only. It will be permanently lost if you clear browser history.
      </span>
    </div>
  )
}
