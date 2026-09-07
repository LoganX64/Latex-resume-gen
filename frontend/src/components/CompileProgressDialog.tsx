import { Icon } from '@/components/Icon'
import { faCheck, faTriangleExclamation, faXmark } from '@/lib/icons'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
type StepState = 'pending' | 'active' | 'complete' | 'error'
type CompileStatus = CompileProgressDialogProps['status']

function getStepState(
  stepId: StepId,
  activeStep: StepId | null,
  status: CompileStatus
): StepState {
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

function Spinner({ className }: { className?: string }) {
  return (
    <m.span
      className={cn(
        'block h-3.5 w-3.5 rounded-full border-2 border-current/25 border-t-current',
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  )
}

function CheckPath() {
  const reduce = useReducedMotion()
  return (
    <m.svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION.fast }}
    >
      <m.path
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT }}
      />
    </m.svg>
  )
}

function StatusGlyph({ status }: { status: CompileStatus }) {
  const reduce = useReducedMotion()
  const enter = reduce
    ? undefined
    : { initial: { scale: 0.7, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.7, opacity: 0 } }

  return (
    <AnimatePresence mode="wait">
      {status === 'done' ? (
        <m.span
          key="done"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/25"
          {...enter}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          <Icon icon={faCheck} className="h-3.5 w-3.5" />
        </m.span>
      ) : status === 'error' ? (
        <m.span
          key="error"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive text-destructive-foreground shadow-sm shadow-destructive/20"
          {...enter}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          <Icon icon={faTriangleExclamation} className="h-3.5 w-3.5" />
        </m.span>
      ) : (
        <m.span
          key="busy"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20"
          {...enter}
          transition={{ duration: DURATION.fast }}
        >
          {!reduce && (
            <m.span
              className="absolute inset-0 rounded-lg bg-primary/15"
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <Spinner className="relative" />
        </m.span>
      )}
    </AnimatePresence>
  )
}

function StepIcon({ state }: { state: StepState }) {
  return (
    <AnimatePresence mode="wait">
      {state === 'complete' ? (
        <m.span
          key="complete"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.55, opacity: 0 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          <CheckPath />
        </m.span>
      ) : state === 'active' ? (
        <m.span
          key="active"
          className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.55, opacity: 0 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          <m.span
            className="absolute inset-0 rounded-full bg-primary/40"
            animate={{ scale: [1, 1.45], opacity: [0.45, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <Spinner className="relative h-3 w-3" />
        </m.span>
      ) : state === 'error' ? (
        <m.span
          key="error"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.55, opacity: 0 }}
          transition={{ duration: DURATION.base, ease: EASE_OUT }}
        >
          <Icon icon={faTriangleExclamation} className="h-2.5 w-2.5" />
        </m.span>
      ) : (
        <m.span
          key="pending"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.fast }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        </m.span>
      )}
    </AnimatePresence>
  )
}

function StepRow({
  state,
  label,
  description,
  output,
  isLast,
}: {
  state: StepState
  label: string
  description: string
  output?: string
  isLast: boolean
}) {
  const reduce = useReducedMotion()

  return (
    <m.div className="flex gap-3" variants={reduce ? undefined : fadeUp}>
      <div className="flex flex-col items-center">
        <StepIcon state={state} />
        {!isLast && (
          <div className="relative mt-1.5 w-px flex-1 overflow-hidden rounded-full bg-border">
            <m.div
              className={cn(
                'absolute inset-x-0 top-0 w-full origin-top rounded-full',
                state === 'complete' ? 'bg-primary/50' : 'bg-transparent'
              )}
              initial={false}
              animate={{ scaleY: state === 'complete' ? 1 : 0 }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
              style={{ height: '100%', minHeight: 14 }}
            />
          </div>
        )}
      </div>

      <div className={cn('min-w-0 flex-1', !isLast && 'pb-3')}>
        <p
          className={cn(
            'text-xs font-medium leading-none transition-colors duration-300',
            state === 'pending' && 'text-muted-foreground/50',
            state === 'active' && 'text-foreground',
            state === 'complete' && 'text-foreground',
            state === 'error' && 'text-destructive'
          )}
        >
          {label}
        </p>
        <div className="mt-1 min-h-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {state === 'active' && output ? (
              <m.p
                key="output"
                className="line-clamp-2 text-[11px] leading-snug text-muted-foreground"
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -3 }}
                transition={{ duration: DURATION.base, ease: EASE_OUT }}
              >
                {output}
              </m.p>
            ) : (
              <m.p
                key="desc"
                className={cn(
                  'text-[11px] transition-colors duration-300',
                  state === 'pending' ? 'text-muted-foreground/40' : 'text-muted-foreground'
                )}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: DURATION.fast }}
              >
                {description}
              </m.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </m.div>
  )
}

function ProgressTrack({
  status,
  activeStep,
}: {
  status: CompileStatus
  activeStep: StepId | null
}) {
  const reduce = useReducedMotion()
  const completedCount =
    status === 'done'
      ? STEPS.length
      : activeStep
        ? STEP_ORDER.indexOf(activeStep)
        : 0
  const pct = Math.round((completedCount / STEPS.length) * 100)
  const isBusy = status === 'compiling' || status === 'connecting' || status === 'idle'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">Progress</span>
        <m.span
          key={pct}
          className={cn(
            'font-mono text-[11px] tabular-nums',
            status === 'error' ? 'text-destructive' : 'text-primary'
          )}
          initial={reduce ? false : { opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.fast }}
        >
          {status === 'error' ? '—' : `${pct}%`}
        </m.span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
        <m.div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            status === 'error' ? 'bg-destructive' : 'bg-primary'
          )}
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
        />
        {isBusy && !reduce && (
          <m.div
            className="absolute inset-y-0 w-16 rounded-full bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent"
            animate={{ x: ['-4rem', '18rem'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
          />
        )}
      </div>
    </div>
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
  const reduce = useReducedMotion()

  const activeStep = (progress.length > 0 ? progress[progress.length - 1].step : null) as StepId | null
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

  const subtitleText =
    status === 'done'
      ? 'Your PDF is ready'
      : status === 'error'
        ? 'Something went wrong while building'
        : status === 'connecting'
          ? 'Establishing a secure connection'
          : `Step ${Math.min((activeStep ? STEP_ORDER.indexOf(activeStep) : 0) + 1, STEPS.length)} of ${STEPS.length}`

  const footerHint =
    status === 'connecting'
      ? 'Establishing connection…'
      : status === 'compiling'
        ? 'This may take a few seconds'
        : status === 'done'
          ? 'PDF is ready to download'
          : status === 'error'
            ? 'Compilation encountered an error'
            : 'Waiting to start…'

  return (
    <Dialog open={open} onOpenChange={handleClose} disablePointerDismissal={isAnimating}>
      <DialogContent
        className="!top-[42%] flex w-[min(100%,27rem)] max-w-[27rem] flex-col gap-0 overflow-hidden p-0 sm:max-w-[27rem]"
        showCloseButton={false}
      >
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden border-b border-border/70 bg-muted/20 px-4 py-3.5">
          {!reduce && isAnimating && (
            <m.div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-primary/15 blur-2xl"
              animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          {!reduce && status === 'done' && (
            <m.div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-primary/20 blur-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            />
          )}
          {!reduce && status === 'error' && (
            <m.div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-destructive/20 blur-2xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            />
          )}

          <div className="relative flex items-start gap-3">
            <StatusGlyph status={status} />

            <div className="min-w-0 flex-1 pt-0.5">
              <DialogHeader className="gap-0.5">
                <DialogTitle className="h-4 leading-none">
                  <AnimatePresence mode="wait">
                    <m.span
                      key={titleText}
                      className="block truncate"
                      initial={reduce ? false : { opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -4 }}
                      transition={{ duration: DURATION.base, ease: EASE_OUT }}
                    >
                      {titleText}
                    </m.span>
                  </AnimatePresence>
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Live progress for compiling your LaTeX resume into a PDF.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-1 h-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  <m.p
                    key={subtitleText}
                    className={cn(
                      'truncate text-[11px] leading-4',
                      status === 'error' ? 'text-destructive' : 'text-muted-foreground'
                    )}
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: DURATION.fast }}
                  >
                    {subtitleText}
                  </m.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center">
              {!isAnimating && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close"
                >
                  <Icon icon={faXmark} className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 px-4 py-3.5">
          <ProgressTrack status={status} activeStep={activeStep} />

          <m.div
            className="flex flex-col"
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

          <AnimatePresence>
            {status === 'error' && errorMessage && (
              <m.div
                className="overflow-hidden rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: DURATION.base, ease: EASE_OUT }}
              >
                <p className="line-clamp-2 break-words font-mono text-[11px] leading-relaxed text-destructive">
                  {errorMessage}
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-t border-border/70 bg-muted/10 px-4">
          <div className="min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <m.span
                key={footerHint}
                className="block truncate text-[11px] text-muted-foreground"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: DURATION.fast }}
              >
                {footerHint}
              </m.span>
            </AnimatePresence>
          </div>
          {isAnimating ? (
            <Button variant="outline" size="xs" className="h-7 shrink-0 px-2.5 text-[11px]" onClick={onCancel}>
              Cancel
            </Button>
          ) : (
            <Button
              variant={status === 'done' ? 'default' : 'ghost'}
              size="xs"
              className="h-7 shrink-0 px-2.5 text-[11px]"
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
