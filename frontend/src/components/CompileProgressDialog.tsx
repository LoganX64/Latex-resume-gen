import { Icon } from '@/components/Icon'
import { faCheck, faChevronDown, faTriangleExclamation, faXmark } from '@/lib/icons'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
  { id: 'validating', label: 'Validating LaTeX', description: 'Checking syntax' },
  { id: 'writing', label: 'Writing files', description: 'Preparing workspace' },
  { id: 'compiling', label: 'Compiling with Tectonic', description: 'Building PDF' },
  { id: 'reading', label: 'Reading PDF', description: 'Finalizing output' },
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

// ── Orbital spinner (two-layer ring) ──────────────────────────────────────────
function OrbitalSpinner() {
  return (
    <span className="relative flex h-4 w-4 items-center justify-center">
      <m.span
        className="absolute inset-0 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
      />
      <m.span
        className="h-1.5 w-1.5 rounded-full bg-primary-foreground"
        animate={{ scale: [1, 0.65, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </span>
  )
}

// ── Animated SVG checkmark ─────────────────────────────────────────────────────
function CheckmarkSvg() {
  const reduce = useReducedMotion()
  return (
    <m.svg
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
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT, delay: 0.05 }}
      />
    </m.svg>
  )
}

// ── Step icon circle ──────────────────────────────────────────────────────────
function StepIcon({ state }: { state: 'pending' | 'active' | 'complete' | 'error' }) {
  return (
    <AnimatePresence mode="wait">
      {state === 'complete' ? (
        <m.span
          key="complete"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-sm shadow-green-500/30 ring-1 ring-green-500/30"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          <CheckmarkSvg />
        </m.span>
      ) : state === 'active' ? (
        <m.span
          key="active"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30 ring-1 ring-primary/40"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          <OrbitalSpinner />
        </m.span>
      ) : state === 'error' ? (
        <m.span
          key="error"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm shadow-destructive/25 ring-1 ring-destructive/30"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          <Icon icon={faTriangleExclamation} className="h-3 w-3" />
        </m.span>
      ) : (
        <m.span
          key="pending"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/25" />
        </m.span>
      )}
    </AnimatePresence>
  )
}

// ── Step row badge ─────────────────────────────────────────────────────────────
function StepBadge({ state }: { state: 'pending' | 'active' | 'complete' | 'error' }) {
  return (
    <AnimatePresence>
      {state === 'complete' && (
        <m.span
          className="shrink-0 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium leading-none text-green-600 dark:text-green-400 ring-1 ring-green-500/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          Done
        </m.span>
      )}
      {state === 'active' && (
        <m.span
          className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium leading-none text-primary ring-1 ring-primary/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          Running
        </m.span>
      )}
      {state === 'error' && (
        <m.span
          className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium leading-none text-destructive ring-1 ring-destructive/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          Failed
        </m.span>
      )}
    </AnimatePresence>
  )
}

// ── Full step row ──────────────────────────────────────────────────────────────
function StepRow({
  state,
  label,
  description,
  output,
  isLast,
}: {
  state: 'pending' | 'active' | 'complete' | 'error'
  label: string
  description: string
  output?: string
  isLast: boolean
}) {
  const reduce = useReducedMotion()

  return (
    <m.div
      className="flex gap-3"
      variants={reduce ? undefined : fadeUp}
    >
      {/* Left rail: icon + connector line */}
      <div className="flex flex-col items-center">
        <StepIcon state={state} />
        {!isLast && (
          <div className="mt-1 w-px flex-1 min-h-3">
            <m.div
              className={cn(
                'w-full h-full rounded-full',
                state === 'complete' ? 'bg-green-500/40' : 'bg-border'
              )}
              style={{ minHeight: '12px' }}
              initial={{ scaleY: 0, originY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.1 }}
            />
          </div>
        )}
      </div>

      {/* Content: label + description/output + badge */}
      <div className="flex flex-1 min-w-0 items-start justify-between gap-2 pb-3">
        <div className="flex flex-col min-w-0 flex-1">
          <span
            className={cn(
              'text-xs font-medium leading-none transition-colors duration-300',
              state === 'pending' && 'text-muted-foreground/40',
              state === 'active' && 'text-foreground',
              state === 'complete' && 'text-foreground',
              state === 'error' && 'text-destructive'
            )}
          >
            {label}
          </span>

          {/* Sub-line: live output when active, else static description */}
          <div className="mt-0.5 min-w-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {state === 'active' && output ? (
                <m.span
                  key="output"
                  className="block truncate text-[10px] text-muted-foreground"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: DURATION.base, ease: EASE_OUT }}
                >
                  {output}
                </m.span>
              ) : (
                <m.span
                  key="desc"
                  className={cn(
                    'block text-[10px] transition-colors duration-300',
                    state === 'pending'
                      ? 'text-muted-foreground/30'
                      : 'text-muted-foreground/60'
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DURATION.fast }}
                >
                  {description}
                </m.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <StepBadge state={state} />
      </div>
    </m.div>
  )
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({
  status,
  activeStep,
}: {
  status: 'idle' | 'connecting' | 'compiling' | 'done' | 'error'
  activeStep: StepId | null
}) {
  const completedCount =
    status === 'done'
      ? STEPS.length
      : activeStep
        ? STEP_ORDER.indexOf(activeStep)
        : 0

  const pct = (completedCount / STEPS.length) * 100
  const isActive = status !== 'done' && status !== 'error'

  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-border">
      <m.div
        className={cn(
          'absolute inset-y-0 left-0 rounded-full',
          status === 'error' ? 'bg-destructive' : status === 'done' ? 'bg-green-500' : 'bg-primary'
        )}
        initial={{ width: '0%' }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      />
      {isActive && (
        <m.div
          className="absolute inset-y-0 w-12 rounded-full bg-white/25"
          animate={{ x: ['-3rem', '500px'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.8 }}
        />
      )}
    </div>
  )
}

// ── Main dialog ───────────────────────────────────────────────────────────────
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
    if (eventDetails?.reason === 'escape-key' && isAnimating) return
    if (isAnimating) onCancel()
    onOpenChange(false)
  }

  const titleText =
    status === 'done'
      ? 'Compilation complete'
      : status === 'error'
        ? 'Compilation failed'
        : status === 'connecting'
          ? 'Connecting…'
          : 'Compiling your resume'

  const completedCount =
    status === 'done'
      ? STEPS.length
      : activeStep
        ? STEP_ORDER.indexOf(activeStep)
        : 0

  return (
    <Dialog open={open} onOpenChange={handleClose} disablePointerDismissal={isAnimating}>
      <DialogContent className="sm:max-w-sm p-0 gap-0 overflow-hidden" showCloseButton={false}>

        {/* ── Header banner ── */}
        <div
          className={cn(
            'relative flex items-center gap-3 px-4 py-3 border-b border-border/60 transition-colors duration-500',
            status === 'done' && 'bg-green-500/5',
            status === 'error' && 'bg-destructive/5',
            (status === 'compiling' || status === 'connecting' || status === 'idle') && 'bg-primary/5'
          )}
        >
          {/* Status icon */}
          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <m.span
                key="done"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-sm shadow-green-500/30"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: DURATION.base, ease: EASE_OUT }}
              >
                <Icon icon={faCheck} className="h-3.5 w-3.5" />
              </m.span>
            ) : status === 'error' ? (
              <m.span
                key="error-icon"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm shadow-destructive/30"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: DURATION.base, ease: EASE_OUT }}
              >
                <Icon icon={faTriangleExclamation} className="h-3.5 w-3.5" />
              </m.span>
            ) : (
              <m.span
                key="spinner-icon"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: DURATION.fast }}
              >
                <OrbitalSpinner />
              </m.span>
            )}
          </AnimatePresence>

          {/* Title + subtitle */}
          <div className="flex-1 min-w-0">
            <DialogHeader>
              <DialogTitle className="leading-none">
                <AnimatePresence mode="wait">
                  <m.span
                    key={titleText}
                    className="block"
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
            <AnimatePresence mode="wait">
              <m.p
                key={`sub-${status}`}
                className={cn(
                  'mt-0.5 text-[10px]',
                  status === 'done' && 'text-green-600 dark:text-green-400',
                  status === 'error' && 'text-destructive',
                  status !== 'done' && status !== 'error' && 'text-muted-foreground'
                )}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: DURATION.fast }}
              >
                {status === 'done'
                  ? `All ${STEPS.length} steps completed`
                  : status === 'error'
                    ? 'An error occurred during compilation'
                    : `Step ${Math.min(completedCount + 1, STEPS.length)} of ${STEPS.length}`}
              </m.p>
            </AnimatePresence>
          </div>

          {/* Close — only when not animating */}
          {!isAnimating && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <Icon icon={faXmark} className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* ── Progress bar ── */}
        <div className="px-4 pt-3">
          <ProgressBar status={status} activeStep={activeStep} />
        </div>

        {/* ── Step list ── */}
        <m.div
          className="flex flex-col px-4 pt-3"
          variants={reduce ? undefined : staggerContainer}
          initial="hidden"
          animate="show"
        >
          {STEPS.map((step, index) => {
            const stepState = getStepState(step.id, activeStep, status)
            const serverStep = progress.find((p) => p.step === step.id)
            return (
              <StepRow
                key={step.id}
                state={stepState}
                label={step.label}
                description={step.description}
                output={serverStep?.output}
                isLast={index === STEPS.length - 1}
              />
            )
          })}
        </m.div>

        {/* ── Error message ── */}
        <AnimatePresence>
          {status === 'error' && errorMessage && (
            <m.div
              className="mx-4 mb-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2"
              initial={reduce ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduce ? undefined : { opacity: 0, height: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
            >
              <p className="text-[10px] font-mono text-destructive leading-relaxed break-all">
                {errorMessage}
              </p>
            </m.div>
          )}
        </AnimatePresence>

        {/* ── Tectonic output collapsible ── */}
        {hasOutput && (
          <div className="border-t border-border/60 mx-4 mb-2 pt-2">
            <button
              onClick={() => setShowOutput(!showOutput)}
              className="flex w-full items-center gap-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <m.span
                animate={{ rotate: showOutput ? 0 : -90 }}
                transition={{ duration: DURATION.fast }}
                className="inline-flex"
              >
                <Icon icon={faChevronDown} className="h-2.5 w-2.5" />
              </m.span>
              Tectonic output
            </button>
            <AnimatePresence>
              {showOutput && (
                <m.div
                  className="mt-1.5 max-h-28 overflow-y-auto rounded-md bg-muted/60 p-2 text-[10px] font-mono text-muted-foreground ring-1 ring-border/50"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE_OUT }}
                >
                  {progress
                    .filter((p) => p.output)
                    .map((p, i) => (
                      <div key={i} className="leading-relaxed break-all">{p.output}</div>
                    ))}
                </m.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex items-center justify-between border-t border-border/60 bg-muted/30 px-4 py-2">
          <span className="text-[10px] text-muted-foreground">
            {status === 'connecting' && 'Establishing connection…'}
            {status === 'compiling' && 'This may take a few seconds'}
            {status === 'done' && 'PDF is ready to download'}
            {status === 'error' && 'Check the output for details'}
            {status === 'idle' && 'Waiting to start…'}
          </span>
          {isAnimating ? (
            <Button
              variant="outline"
              size="xs"
              className="h-6 px-2 text-[10px]"
              onClick={onCancel}
            >
              Cancel
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="xs"
              className="h-6 px-2 text-[10px]"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          )}
        </div>

      </DialogContent>
    </Dialog>
  )
}
