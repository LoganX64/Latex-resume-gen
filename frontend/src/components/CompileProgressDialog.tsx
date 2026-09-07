import { Icon } from '@/components/Icon'
import { faCheck, faChevronDown, faChevronRight, faTriangleExclamation } from '@/lib/icons'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { CompileStep } from '@/hooks/useWebSocketCompile'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import { DURATION, EASE_OUT, staggerContainer, fadeUp } from '@/lib/motion'

interface CompileProgressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel: () => void
  status: 'idle' | 'connecting' | 'compiling' | 'done' | 'error'
  progress: CompileStep[]
  errorMessage?: string
}

const STEPS = [
  { id: 'validating', label: 'Validating LaTeX' },
  { id: 'writing', label: 'Writing files' },
  { id: 'compiling', label: 'Compiling with Tectonic' },
  { id: 'reading', label: 'Reading PDF' },
] as const

const STEP_ORDER = STEPS.map((s) => s.id)
type StepId = (typeof STEP_ORDER)[number]

function getStepState(
  stepId: StepId,
  activeStep: StepId | null,
  status: 'idle' | 'connecting' | 'compiling' | 'done' | 'error'
): 'pending' | 'active' | 'complete' | 'error' {
  if (status === 'error') {
    if (activeStep && STEP_ORDER.indexOf(stepId) <= STEP_ORDER.indexOf(activeStep)) {
      return stepId === activeStep ? 'error' : 'complete'
    }
    return 'pending'
  }
  if (status === 'done') return 'complete'
  if (!activeStep) return 'pending'
  if (STEP_ORDER.indexOf(stepId) < STEP_ORDER.indexOf(activeStep)) return 'complete'
  if (stepId === activeStep) return 'active'
  return 'pending'
}

function StepPill({
  state,
  label,
  output,
}: {
  state: 'pending' | 'active' | 'complete' | 'error'
  label: string
  output?: string
}) {
  const reduce = useReducedMotion()

  return (
    <m.div
      className="relative"
      variants={reduce ? undefined : fadeUp}
    >
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300',
          state === 'pending' && 'bg-muted/50 text-muted-foreground/50',
          state === 'active' && 'bg-primary text-primary-foreground shadow-sm shadow-primary/20',
          state === 'complete' && 'bg-green-500 text-white',
          state === 'error' && 'bg-destructive text-destructive-foreground'
        )}
      >
        <div className="flex h-5 w-5 shrink-0 items-center justify-center">
          <AnimatePresence mode="wait">
            {state === 'complete' ? (
              <m.svg
                key="check"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast }}
              >
                <m.path
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
                />
              </m.svg>
            ) : state === 'active' ? (
              <m.div
                key="spinner"
                className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: DURATION.fast },
                  rotate: { duration: 0.8, repeat: Infinity, ease: 'linear' },
                }}
              />
            ) : state === 'error' ? (
              <m.span
                key="error"
                className="text-xs font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: DURATION.base, ease: EASE_OUT }}
              >
                !
              </m.span>
            ) : (
              <m.div
                key="dot"
                className="h-2 w-2 rounded-full bg-current opacity-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast }}
              />
            )}
          </AnimatePresence>
        </div>

        <span className="flex-1">{label}</span>

        {output && state === 'active' && (
          <m.span
            className="text-[10px] opacity-70 truncate max-w-32"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            {output}
          </m.span>
        )}
      </div>
    </m.div>
  )
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
  const reduce = useReducedMotion()

  const activeStep = (progress.length > 0 ? progress[progress.length - 1].step : null) as StepId | null
  const hasOutput = progress.some((p) => p.output)
  const isAnimating = status === 'compiling' || status === 'connecting'

  const handleClose = (_open: boolean, eventDetails?: { reason?: string }) => {
    if (eventDetails?.reason === 'escape-key' && isAnimating) {
      return
    }
    if (isAnimating) {
      onCancel()
    }
    onOpenChange(false)
  }

  const titleText =
    status === 'done'
      ? 'Compilation complete'
      : status === 'error'
        ? 'Compilation failed'
        : status === 'connecting'
          ? 'Connecting...'
          : 'Compiling your resume'

  return (
    <Dialog open={open} onOpenChange={handleClose} disablePointerDismissal={isAnimating}>
      <DialogContent className="sm:max-w-sm" showCloseButton={!isAnimating}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <m.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: DURATION.base, ease: EASE_OUT }}
                >
                  <Icon icon={faCheck} className="h-4 w-4 text-green-500" />
                </m.div>
              ) : status === 'error' ? (
                <m.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: DURATION.base, ease: EASE_OUT }}
                >
                  <Icon icon={faTriangleExclamation} className="h-4 w-4 text-destructive" />
                </m.div>
              ) : (
                <m.div
                  key="spinner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION.fast }}
                  className="flex items-center justify-center"
                >
                  <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </m.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <m.span
                key={titleText}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: DURATION.base, ease: EASE_OUT }}
              >
                {titleText}
              </m.span>
            </AnimatePresence>
          </DialogTitle>
        </DialogHeader>

        <m.div
          className="flex flex-col gap-1.5 py-2"
          variants={reduce ? undefined : staggerContainer}
          initial="hidden"
          animate="show"
        >
          {STEPS.map((step) => {
            const stepState = getStepState(step.id, activeStep, status)
            const serverStep = progress.find((p) => p.step === step.id)
            return (
              <StepPill
                key={step.id}
                state={stepState}
                label={step.label}
                output={serverStep?.output}
              />
            )
          })}
        </m.div>

        {hasOutput && (
          <div className="border-t pt-2">
            <button
              onClick={() => setShowOutput(!showOutput)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showOutput ? (
                <Icon icon={faChevronDown} className="h-3 w-3" />
              ) : (
                <Icon icon={faChevronRight} className="h-3 w-3" />
              )}
              Tectonic output
            </button>
            <AnimatePresence>
              {showOutput && (
                <m.div
                  className="mt-1 max-h-32 overflow-y-auto rounded bg-muted p-2 text-[10px] font-mono text-muted-foreground"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE_OUT }}
                >
                  {progress
                    .filter((p) => p.output)
                    .map((p, i) => (
                      <div key={i}>{p.output}</div>
                    ))}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {status === 'error' && errorMessage && (
          <m.p
            className="text-xs text-destructive mt-1"
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            {errorMessage}
          </m.p>
        )}
      </DialogContent>
    </Dialog>
  )
}
