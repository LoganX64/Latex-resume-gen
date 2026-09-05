import { cn } from "@/lib/utils"
import { Icon } from "@/components/Icon"
import { faSpinner } from "@/lib/icons"

function Spinner({ className, ...props }: { className?: string; [key: string]: any }) {
  return (
    <Icon icon={faSpinner} data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
