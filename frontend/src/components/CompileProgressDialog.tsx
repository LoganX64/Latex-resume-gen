import { Check, Circle, X, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import type { CompileStep } from '@/hooks/useWebSocketCompile'

interface CompileProgressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel: () => void
  status: 'idle' | 'connecting' | 'compiling' | 'done' | 'error'
  progress: CompileStep[]
  errorMessage?: string
}

const STEP_ORDER = ['validating', 'writing', 'compiling', 'reading', 'done']

const STEP_LABELS: Record<string, string> = {
  validating: 'Validating LaTeX',
  writing: 'Writing files',
  compiling: 'Compiling with Tectonic',
  reading: 'Reading PDF',
  done: 'Done',
}

export function CompileProgressDialog({
  open,
  onOpenChange,
  onCancel,
  status,
  progress,
  errorMessage,
}: CompileProgressDialogProps) {
  const [showOutput, setShowOutput] = useState(false)

  const activeStep = progress.length > 0 ? progress[progress.length - 1].step : null
  const hasOutput = progress.some((p) => p.output)

  const handleClose = (_open: boolean, eventDetails?: { reason?: string }) => {
    if (eventDetails?.reason === 'escape-key' && (status === 'compiling' || status === 'connecting')) {
      return
    }
    if (status === 'compiling' || status === 'connecting') {
      onCancel()
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose} disablePointerDismissal={status === 'compiling' || status === 'connecting'}>
      <DialogContent className="sm:max-w-sm" showCloseButton={status !== 'compiling' && status !== 'connecting'}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status === 'done' ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : status === 'error' ? (
              <X className="h-4 w-4 text-destructive" />
            ) : (
              <Spinner className="h-4 w-4" />
            )}
            {status === 'done'
              ? 'Compilation complete'
              : status === 'error'
                ? 'Compilation failed'
                : status === 'connecting'
                  ? 'Connecting...'
                  : 'Compiling your resume'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-1">
          {STEP_ORDER.filter((s) => s !== 'done').map((stepId) => {
            const isComplete =
              status === 'done' ||
              (activeStep && STEP_ORDER.indexOf(activeStep) > STEP_ORDER.indexOf(stepId)) ||
              activeStep === 'done'
            const isActive = activeStep === stepId && status === 'compiling'
            const isPending = !isComplete && !isActive

            const serverStep = progress.find((p) => p.step === stepId)

            return (
              <div key={stepId} className="flex items-center gap-2">
                {isComplete ? (
                  <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                ) : isActive ? (
                  <Spinner className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                )}
                <span
                  className={cn(
                    'text-sm',
                    isComplete && 'text-muted-foreground',
                    isActive && 'text-foreground font-medium',
                    isPending && 'text-muted-foreground/50'
                  )}
                >
                  {STEP_LABELS[stepId] || stepId}
                </span>
                {serverStep?.output && stepId === 'compiling' && (
                  <span className="text-[10px] text-muted-foreground ml-auto truncate max-w-48">
                    {serverStep.output}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {hasOutput && (
          <div className="border-t pt-2">
            <button
              onClick={() => setShowOutput(!showOutput)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showOutput ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              Tectonic output
            </button>
            {showOutput && (
              <div className="mt-1 max-h-32 overflow-y-auto rounded bg-muted p-2 text-[10px] font-mono text-muted-foreground">
                {progress
                  .filter((p) => p.output)
                  .map((p, i) => (
                    <div key={i}>{p.output}</div>
                  ))}
              </div>
            )}
          </div>
        )}

        {status === 'error' && errorMessage && (
          <p className="text-xs text-destructive mt-1">{errorMessage}</p>
        )}

      </DialogContent>
    </Dialog>
  )
}
