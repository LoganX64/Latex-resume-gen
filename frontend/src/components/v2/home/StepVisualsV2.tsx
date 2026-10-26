import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, m } from "framer-motion";
import { Icon } from "@/components/Icon";
import { buttonVariants } from "@/components/ui/button";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";
import {
  faCheck,
  faChevronDown,
  faDownload,
  faFileLines,
  faUpload,
  faXmark,
} from "@/lib/icons";
import { SHOWCASE_PHOTO } from "@/components/v2/home/showcase/showcase-data";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { createStepClock } from "@/lib/step-clock";
import { cn } from "@/lib/utils";

export type StepVisualPhase = "idle" | "running" | "done";

export type StepVisualProps = {
  phase: StepVisualPhase;
  paused: boolean;
  onDone: () => void;
};

type LoopContext = {
  wait: (ms: number) => Promise<boolean>;
  isCancelled: () => boolean;
};

function useStepSequence(
  phase: StepVisualPhase,
  paused: boolean,
  run: (context: LoopContext) => Promise<boolean>,
  reset: () => void,
  onDone: () => void,
) {
  const runRef = useRef(run);
  runRef.current = run;
  const resetRef = useRef(reset);
  resetRef.current = reset;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const clockRef = useRef<ReturnType<typeof createStepClock> | null>(null);

  useEffect(() => {
    if (phase === "idle") {
      resetRef.current();
      return;
    }
    if (phase !== "running") return;

    const clock = createStepClock();
    clockRef.current = clock;
    let cancelled = false;

    void runRef
      .current({
        wait: (ms) => clock.wait(ms),
        isCancelled: () => cancelled,
      })
      .then((completed) => {
        if (!cancelled && completed) onDoneRef.current();
      });

    return () => {
      cancelled = true;
      clock.dispose();
      if (clockRef.current === clock) clockRef.current = null;
    };
  }, [phase]);

  useEffect(() => {
    clockRef.current?.setPaused(paused);
  }, [paused]);
}

function BlinkCaret() {
  return (
    <m.span
      aria-hidden="true"
      className="ml-px inline-block h-2 w-px shrink-0 bg-primary"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 0.9,
        repeat: Infinity,
        times: [0, 0.5, 0.5, 1],
        ease: "linear",
      }}
    />
  );
}

type InfoField =
  | "fullName"
  | "professionalTitle"
  | "email"
  | "phone"
  | "location"
  | "linkedin"
  | "github"
  | "website";

const INFO_FIELD_ORDER: { key: InfoField; value: string }[] = [
  { key: "fullName", value: "Jitin K" },
  { key: "professionalTitle", value: "Backend Engineer" },
  { key: "email", value: "kpjitin@gmail.com" },
  { key: "phone", value: "+91 98765 43210" },
  { key: "location", value: "Ulhasnagar, IND" },
  { key: "linkedin", value: "linkedin.com/in/alexchen" },
  { key: "github", value: "github.com/alexchen" },
  { key: "website", value: "jitin-k.dev" },
];

const EMPTY_INFO_VALUES: Record<InfoField, string> = {
  fullName: "",
  professionalTitle: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  website: "",
};

const INFO_VALUES = INFO_FIELD_ORDER.reduce<Record<InfoField, string>>(
  (values, field) => {
    values[field.key] = field.value;
    return values;
  },
  { ...EMPTY_INFO_VALUES },
);

const INFO_PLACEHOLDERS: Record<InfoField, string> = {
  fullName: "John Doe…",
  professionalTitle: "Senior Software Engineer…",
  email: "john@example.com…",
  phone: "+1 234 567 890…",
  location: "San Francisco, CA…",
  linkedin: "linkedin.com/in/johndoe…",
  github: "github.com/johndoe…",
  website: "johndoe.dev…",
};

const PREVIEW_TRANSITION_MS = DURATION.base * 2000;

const FILL_START_DELAY_MS = 500;
const TYPE_DELAY_MS = 24;
const FIELD_GAP_MS = 110;
const SAVED_SETTLE_MS = 180;
const INFO_CHAR_COUNT = INFO_FIELD_ORDER.reduce(
  (total, field) => total + field.value.length,
  0,
);

const FILL_DETAILS_DURATION =
  FILL_START_DELAY_MS +
  INFO_CHAR_COUNT * TYPE_DELAY_MS +
  INFO_FIELD_ORDER.length * FIELD_GAP_MS +
  SAVED_SETTLE_MS;

function InfoFieldInput({
  label,
  value,
  field,
  activeField,
}: {
  label: string;
  value: string;
  field: InfoField;
  activeField: InfoField | null;
}) {
  const isActive = activeField === field;

  return (
    <div className="min-w-0">
      <div className="truncate text-[6px] leading-none font-medium text-foreground">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 flex h-5 items-center rounded-md border bg-input/20 px-1.5 transition-colors duration-200 dark:bg-input/30",
          isActive ? "border-ring ring-1 ring-ring/30" : "border-input",
        )}
      >
        {value ? (
          <span className="truncate text-[6.5px] leading-none text-foreground">
            {value}
          </span>
        ) : (
          <span className="truncate text-[6.5px] leading-none text-muted-foreground/40">
            {INFO_PLACEHOLDERS[field]}
          </span>
        )}
        {isActive && <BlinkCaret />}
      </div>
    </div>
  );
}

function PersonalInfoCard({
  values,
  activeField,
  saved,
}: {
  values: Record<InfoField, string>;
  activeField: InfoField | null;
  saved: boolean;
}) {
  return (
    <div className="relative w-[268px] max-w-full overflow-hidden rounded-lg border border-border/60 bg-background shadow-sm">
      <div className="flex items-center justify-between gap-2 px-2 py-1.5">
        <div className="truncate text-[8px] leading-none font-semibold text-foreground">
          Personal Information
        </div>
        <AnimatePresence initial={false}>
          {saved && (
            <m.span
              key="info-saved"
              className="flex shrink-0 items-center gap-0.5 text-[5.5px] leading-none font-medium text-primary"
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            >
              <Icon icon={faCheck} className="size-1.5" aria-hidden="true" />
              Saved
            </m.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 px-2 pb-2">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <InfoFieldInput
              label="Full Name *"
              value={values.fullName}
              field="fullName"
              activeField={activeField}
            />
            <InfoFieldInput
              label="Professional Title"
              value={values.professionalTitle}
              field="professionalTitle"
              activeField={activeField}
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <InfoFieldInput
              label="Email *"
              value={values.email}
              field="email"
              activeField={activeField}
            />
            <InfoFieldInput
              label="Phone *"
              value={values.phone}
              field="phone"
              activeField={activeField}
            />
          </div>

          <InfoFieldInput
            label="Location *"
            value={values.location}
            field="location"
            activeField={activeField}
          />

          <div className="grid grid-cols-3 gap-1.5">
            <InfoFieldInput
              label="LinkedIn"
              value={values.linkedin}
              field="linkedin"
              activeField={activeField}
            />
            <InfoFieldInput
              label="GitHub"
              value={values.github}
              field="github"
              activeField={activeField}
            />
            <InfoFieldInput
              label="Website"
              value={values.website}
              field="website"
              activeField={activeField}
            />
          </div>
        </div>

        <div className="flex w-12 shrink-0 flex-col items-center gap-1.5 pt-0.5">
          <div className="relative size-12">
            <div className="size-full overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted">
              <img
                src={SHOWCASE_PHOTO}
                alt=""
                width={48}
                height={48}
                loading="lazy"
                decoding="async"
                className="size-full object-cover"
              />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex size-3 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
              <Icon icon={faXmark} className="size-1.5" aria-hidden="true" />
            </span>
          </div>
          <span className="flex h-[18px] w-full items-center justify-center gap-0.5 rounded-md border border-input bg-background text-[5px] leading-none font-medium text-foreground">
            <Icon
              icon={faUpload}
              className="size-1.5 shrink-0"
              aria-hidden="true"
            />
            Upload Photo
          </span>
        </div>
      </div>
    </div>
  );
}

export function FillDetailsStepVisual({
  phase,
  paused,
  onDone,
}: StepVisualProps) {
  const reduce = useIsMotionDisabled();

  const [values, setValues] =
    useState<Record<InfoField, string>>(EMPTY_INFO_VALUES);
  const [activeField, setActiveField] = useState<InfoField | null>(null);
  const [saved, setSaved] = useState(false);

  const reset = () => {
    setValues(EMPTY_INFO_VALUES);
    setActiveField(null);
    setSaved(false);
  };

  useStepSequence(
    phase,
    paused,
    async ({ wait, isCancelled }) => {
      reset();

      if (!(await wait(FILL_START_DELAY_MS))) return false;

      for (const field of INFO_FIELD_ORDER) {
        setActiveField(field.key);
        for (let index = 1; index <= field.value.length; index += 1) {
          if (!(await wait(TYPE_DELAY_MS))) return false;
          if (isCancelled()) return false;
          setValues((current) => ({
            ...current,
            [field.key]: field.value.slice(0, index),
          }));
        }
        if (!(await wait(FIELD_GAP_MS))) return false;
      }

      setActiveField(null);
      setSaved(true);

      return wait(SAVED_SETTLE_MS);
    },
    reset,
    onDone,
  );

  if (reduce) {
    return (
      <div
        aria-hidden="true"
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
      >
        <PersonalInfoCard
          values={INFO_VALUES}
          activeField={null}
          saved
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-2xl" />
      <PersonalInfoCard
        values={values}
        activeField={activeField}
        saved={saved}
      />
    </div>
  );
}

function ThumbLine({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "block h-[1.5px] shrink-0 rounded-full bg-neutral-400/40",
        className,
      )}
    />
  );
}

function DataSciSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-[3px] leading-[4px] font-bold tracking-[0.08em] text-[#3d5a80] uppercase">
        {title}
      </div>
      <div className="mt-[1px] h-px w-full bg-[#3d5a80]/40" />
      <div className="mt-[1.5px] space-y-[1.5px]">{children}</div>
    </div>
  );
}

function DataSciRole() {
  return (
    <div>
      <div className="flex items-center justify-between gap-1">
        <ThumbLine className="w-8 bg-neutral-700/60" />
        <ThumbLine className="w-4" />
      </div>
      <ThumbLine className="mt-[1px] w-6" />
      <div className="mt-[1.5px] space-y-[1.5px] pl-1">
        <ThumbLine className="w-full" />
        <ThumbLine className="w-[86%]" />
      </div>
    </div>
  );
}

function DataSciSheet() {
  return (
    <div className="flex h-full w-full flex-col bg-white p-2 text-neutral-800">
      <div className="flex items-start gap-1">
        <div className="w-[18px] shrink-0 space-y-[2px] pt-[2px]">
          <ThumbLine className="w-full bg-neutral-500/50" />
          <ThumbLine className="w-[88%]" />
          <ThumbLine className="w-full" />
        </div>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate text-[5.5px] leading-none font-bold tracking-wide text-neutral-900">
            Jitin K
          </div>
          <div className="mt-[1.5px] truncate text-[3px] leading-none text-[#3d5a80]">
            Backend Engineer
          </div>
        </div>
        <div className="flex w-[20px] shrink-0 flex-col items-end space-y-[2px] pt-[2px]">
          <ThumbLine className="w-full" />
          <ThumbLine className="w-[84%]" />
          <ThumbLine className="w-[92%]" />
        </div>
      </div>

      <div className="mt-[3px] h-[2px] w-full bg-[#3d5a80]" />

      <DataSciSection title="Summary" className="mt-[3px]">
        <ThumbLine className="w-full" />
        <ThumbLine className="w-[92%]" />
        <ThumbLine className="w-[74%]" />
      </DataSciSection>

      <DataSciSection title="Technical Experience" className="mt-[4px]">
        <DataSciRole />
        <DataSciRole />
      </DataSciSection>

      <DataSciSection title="Skills" className="mt-[4px]">
        <div className="flex items-center gap-1">
          <ThumbLine className="w-5 bg-neutral-700/50" />
          <ThumbLine className="flex-1" />
        </div>
        <div className="flex items-center gap-1">
          <ThumbLine className="w-4 bg-neutral-700/50" />
          <ThumbLine className="flex-1" />
        </div>
        <div className="flex items-center gap-1">
          <ThumbLine className="w-6 bg-neutral-700/50" />
          <ThumbLine className="flex-1" />
        </div>
      </DataSciSection>

      <DataSciSection title="Projects" className="mt-[4px]">
        <DataSciRole />
      </DataSciSection>

      <DataSciSection title="Education" className="mt-[4px]">
        <div className="flex items-center justify-between gap-1">
          <ThumbLine className="w-9 bg-neutral-700/50" />
          <ThumbLine className="w-4" />
        </div>
        <ThumbLine className="w-7" />
      </DataSciSection>

      <div className="mt-auto flex justify-center pt-[3px]">
        <ThumbLine className="h-px w-5" />
      </div>
    </div>
  );
}

const TEMPLATE_OPTIONS = [
  "Classic Professional",
  "Technical",
  "Engineering Resume",
  "Modern Sidebar",
  "Compact One Page",
];

const SELECTED_TEMPLATE = "Technical";

type TemplateCursorState = {
  x: number;
  y: number;
  visible: boolean;
  pressed: boolean;
  ripple: number;
};

const HIDDEN_CURSOR: TemplateCursorState = {
  x: 192,
  y: 198,
  visible: false,
  pressed: false,
  ripple: 0,
};

function TemplateCursor({
  cursor,
  duration,
}: {
  cursor: TemplateCursorState;
  duration: number;
}) {
  return (
    <m.div
      className="pointer-events-none absolute top-0 left-0 z-40"
      initial={false}
      animate={{ x: cursor.x, y: cursor.y, opacity: cursor.visible ? 1 : 0 }}
      transition={{
        x: { duration, ease: EASE_OUT },
        y: { duration, ease: EASE_OUT },
        opacity: { duration: 0.15, ease: "easeOut" },
      }}
    >
      {cursor.ripple > 0 && (
        <m.span
          key={cursor.ripple}
          className="absolute -top-1 -left-1 size-2.5 rounded-full border border-background/80 bg-background/30"
          initial={{ scale: 0.2, opacity: 0.55 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      )}
      <m.div
        className="origin-top-left"
        animate={{ scale: cursor.pressed ? 0.86 : 1 }}
        transition={{ duration: 0.1, ease: EASE_OUT }}
      >
        <svg
          viewBox="0 0 14 20"
          className="h-[14px] w-[10px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
          aria-hidden="true"
        >
          <path
            d="M.8.8 12 10.6l-4.8.8 2.5 5-2.1 1-2.5-5.1L.8 16.6Z"
            fill="#fff"
            stroke="#1f2937"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </m.div>
    </m.div>
  );
}

function TemplateSelect({
  open,
  selected,
  hovered,
  cursor,
  cursorMs,
}: {
  open: boolean;
  selected: boolean;
  hovered: boolean;
  cursor: TemplateCursorState;
  cursorMs: number;
}) {
  return (
    <div className="relative h-[210px] w-[208px]">
      <div
        className={cn(
          "flex h-8 w-full items-center justify-between gap-1.5 rounded-md border bg-background px-2 py-1 text-[11px] leading-none transition-colors",
          open ? "border-ring ring-2 ring-ring/30" : "border-input",
        )}
      >
        <span
          className={cn(
            "truncate",
            selected ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {selected ? SELECTED_TEMPLATE : "Select template"}
        </span>
        <m.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: DURATION.fast, ease: EASE_OUT }}
        >
          <Icon
            icon={faChevronDown}
            className="size-3.5 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </m.span>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            key="template-menu"
            className="absolute inset-x-0 top-[38px] z-20 origin-top overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -3, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
          >
            {TEMPLATE_OPTIONS.map((option) => (
              <div
                key={option}
                className={cn(
                  "relative flex min-h-7 items-center rounded-md px-2 py-1 pr-8 text-[11px] leading-none",
                  hovered &&
                    option === SELECTED_TEMPLATE &&
                    "bg-accent text-accent-foreground",
                )}
              >
                <span className="truncate">{option}</span>
                {selected && option === SELECTED_TEMPLATE && (
                  <Icon
                    icon={faCheck}
                    className="absolute right-2 size-3 shrink-0"
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </m.div>
        )}
      </AnimatePresence>

      <TemplateCursor cursor={cursor} duration={cursorMs} />
    </div>
  );
}

function TemplatePreview() {
  return (
    <div className="h-[200px] w-[140px] overflow-hidden rounded-[3px] bg-white shadow-[0_18px_36px_-20px_rgba(0,0,0,0.5)] ring-1 ring-black/10">
      <div className="h-[148px] w-[104px] origin-top-left scale-[1.35]">
        <DataSciSheet />
      </div>
    </div>
  );
}

const PICK_TEMPLATE_TIMING = {
  reset: 450,
  cursorShow: 100,
  cursorOpen: 540,
  pressOpen: 130,
  menuOpen: 450,
  cursorOption: 500,
  hover: 140,
  pressSelect: 130,
  selected: 320,
  close: 260,
} as const;

const PICK_TEMPLATE_DURATION =
  Object.values(PICK_TEMPLATE_TIMING).reduce((total, ms) => total + ms, 0) +
  PREVIEW_TRANSITION_MS;

export function PickTemplateStepVisual({
  phase,
  paused,
  onDone,
}: StepVisualProps) {
  const reduce = useIsMotionDisabled();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [preview, setPreview] = useState(false);
  const [cursor, setCursor] = useState<TemplateCursorState>(HIDDEN_CURSOR);
  const [cursorMs, setCursorMs] = useState(0.5);

  const reset = () => {
    setOpen(false);
    setSelected(false);
    setHovered(false);
    setPreview(false);
    setCursor((current) => ({
      ...current,
      ...HIDDEN_CURSOR,
      ripple: current.ripple,
    }));
  };

  useStepSequence(
    phase,
    paused,
    async ({ wait }) => {
      reset();

      if (!(await wait(PICK_TEMPLATE_TIMING.reset))) return false;

      setCursor((current) => ({ ...current, visible: true }));
      if (!(await wait(PICK_TEMPLATE_TIMING.cursorShow))) return false;

      setCursorMs(0.5);
      setCursor((current) => ({ ...current, x: 150, y: 16 }));
      if (!(await wait(PICK_TEMPLATE_TIMING.cursorOpen))) return false;

      setCursor((current) => ({
        ...current,
        pressed: true,
        ripple: current.ripple + 1,
      }));
      if (!(await wait(PICK_TEMPLATE_TIMING.pressOpen))) return false;
      setCursor((current) => ({ ...current, pressed: false }));
      setOpen(true);
      if (!(await wait(PICK_TEMPLATE_TIMING.menuOpen))) return false;

      setCursorMs(0.45);
      setCursor((current) => ({ ...current, x: 170, y: 92 }));
      if (!(await wait(PICK_TEMPLATE_TIMING.cursorOption))) return false;

      setHovered(true);
      if (!(await wait(PICK_TEMPLATE_TIMING.hover))) return false;

      setCursor((current) => ({
        ...current,
        pressed: true,
        ripple: current.ripple + 1,
      }));
      if (!(await wait(PICK_TEMPLATE_TIMING.pressSelect))) return false;
      setCursor((current) => ({ ...current, pressed: false }));
      setSelected(true);
      if (!(await wait(PICK_TEMPLATE_TIMING.selected))) return false;

      setOpen(false);
      setHovered(false);
      setCursor((current) => ({ ...current, visible: false }));
      if (!(await wait(PICK_TEMPLATE_TIMING.close))) return false;

      setPreview(true);
      return wait(PREVIEW_TRANSITION_MS);
    },
    reset,
    onDone,
  );

  if (reduce) {
    return (
      <div
        aria-hidden="true"
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
      >
        <TemplatePreview />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {preview ? (
          <m.div
            key="template-preview"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            <TemplatePreview />
          </m.div>
        ) : (
          <m.div
            key="template-select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            <TemplateSelect
              open={open}
              selected={selected}
              hovered={hovered}
              cursor={cursor}
              cursorMs={cursorMs}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const EXPORT_TEMPLATE = "Technical";

const EXPORT_CURSOR_START: TemplateCursorState = {
  x: 0,
  y: 0,
  visible: false,
  pressed: false,
  ripple: 0,
};

function ExportToolbar({
  pressed,
  downloadRef,
}: {
  pressed: boolean;
  downloadRef: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background p-1.5 shadow-sm">
      <span className="shrink-0 text-[10px] leading-none font-semibold whitespace-nowrap text-foreground">
        A4 Page Preview
      </span>
      <span className="shrink-0 text-[8px] leading-none whitespace-nowrap text-muted-foreground italic">
        (approximate)
      </span>
      <span className="flex h-6 min-w-[62px] shrink-0 items-center justify-between gap-1 rounded-md border border-input bg-background px-2 text-[8px] leading-none text-foreground">
        <span className="truncate">{EXPORT_TEMPLATE}</span>
        <Icon
          icon={faChevronDown}
          className="size-2 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </span>
      <span
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-6 shrink-0 rounded-md border border-dashed border-border/70 p-0 text-foreground",
        )}
      >
        <Icon icon={faFileLines} className="size-2.5" aria-hidden="true" />
      </span>
      <m.span
        ref={downloadRef}
        aria-hidden="true"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-6 shrink-0 rounded-md border border-dashed border-border/70 p-0 text-foreground",
        )}
        animate={{ scale: pressed ? 0.9 : 1 }}
        transition={{ duration: 0.1, ease: EASE_OUT }}
      >
        <Icon icon={faDownload} className="size-2.5" aria-hidden="true" />
      </m.span>
    </div>
  );
}

const EXPORT_TIMING = {
  reset: 700,
  cursorReset: 40,
  cursorShow: 140,
  cursorMove: 540,
  settle: 90,
  press: 120,
  release: 100,
  cursorHide: 140,
} as const;

const EXPORT_PDF_DURATION =
  Object.values(EXPORT_TIMING).reduce((total, ms) => total + ms, 0) +
  PREVIEW_TRANSITION_MS;

export function ExportPdfStepVisual({
  phase,
  paused,
  onDone,
}: StepVisualProps) {
  const reduce = useIsMotionDisabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLSpanElement>(null);

  const [preview, setPreview] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [cursor, setCursor] =
    useState<TemplateCursorState>(EXPORT_CURSOR_START);
  const [cursorMs, setCursorMs] = useState(0.5);

  const reset = () => {
    setPreview(false);
    setPressed(false);
    setCursor(EXPORT_CURSOR_START);
    setCursorMs(0);
  };

  useStepSequence(
    phase,
    paused,
    async ({ wait }) => {
      reset();

      if (!(await wait(EXPORT_TIMING.reset))) return false;

      const container = containerRef.current;
      const button = downloadRef.current;
      if (!container || !button) {
        return wait(400);
      }

      const containerRect = container.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const start = {
        x: containerRect.width * 0.68,
        y: containerRect.height * 0.72,
      };
      const target = {
        x: buttonRect.left - containerRect.left + buttonRect.width / 2 - 1,
        y: buttonRect.top - containerRect.top + buttonRect.height / 2 - 1,
      };

      setCursor({ ...start, visible: false, pressed: false, ripple: 0 });
      if (!(await wait(EXPORT_TIMING.cursorReset))) return false;
      setCursor((current) => ({ ...current, visible: true }));
      if (!(await wait(EXPORT_TIMING.cursorShow))) return false;

      setCursorMs(0.52);
      setCursor((current) => ({ ...current, x: target.x, y: target.y }));
      if (!(await wait(EXPORT_TIMING.cursorMove))) return false;
      if (!(await wait(EXPORT_TIMING.settle))) return false;

      setPressed(true);
      setCursor((current) => ({
        ...current,
        pressed: true,
        ripple: current.ripple + 1,
      }));
      if (!(await wait(EXPORT_TIMING.press))) return false;
      setPressed(false);
      setCursor((current) => ({ ...current, pressed: false }));
      if (!(await wait(EXPORT_TIMING.release))) return false;

      setCursor((current) => ({ ...current, visible: false }));
      if (!(await wait(EXPORT_TIMING.cursorHide))) return false;

      setPreview(true);
      return wait(PREVIEW_TRANSITION_MS);
    },
    reset,
    onDone,
  );

  if (reduce) {
    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
      >
        <TemplatePreview />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {preview ? (
          <m.div
            key="export-preview"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            <TemplatePreview />
          </m.div>
        ) : (
          <m.div
            key="export-toolbar"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            <ExportToolbar pressed={pressed} downloadRef={downloadRef} />
          </m.div>
        )}
      </AnimatePresence>

      <TemplateCursor cursor={cursor} duration={cursorMs} />
    </div>
  );
}

export const STEP_DURATIONS = [
  FILL_DETAILS_DURATION,
  PICK_TEMPLATE_DURATION,
  EXPORT_PDF_DURATION,
] as const;

export const STEP_LINE_TIMING = [
  {
    delay: FILL_START_DELAY_MS,
    duration: FILL_DETAILS_DURATION - FILL_START_DELAY_MS,
  },
  {
    delay: PICK_TEMPLATE_TIMING.reset,
    duration: PICK_TEMPLATE_DURATION - PICK_TEMPLATE_TIMING.reset,
  },
  {
    delay: EXPORT_TIMING.reset + EXPORT_TIMING.cursorReset,
    duration:
      EXPORT_PDF_DURATION - EXPORT_TIMING.reset - EXPORT_TIMING.cursorReset,
  },
] as const;
