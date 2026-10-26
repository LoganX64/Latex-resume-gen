import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { Icon } from "@/components/Icon";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";
import {
  faCheck,
  faDownload,
  faFilePdf,
  faTableColumns,
  faUpload,
  faXmark,
} from "@/lib/icons";
import { SHOWCASE_PHOTO } from "@/components/v2/home/showcase/showcase-data";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type LoopContext = {
  wait: (ms: number) => Promise<boolean>;
  isCancelled: () => boolean;
};

function useLoopingEffect(
  isInView: boolean,
  reduce: boolean,
  run: (context: LoopContext) => Promise<void>,
) {
  const runRef = useRef(run);
  runRef.current = run;

  useEffect(() => {
    if (reduce || !isInView) return;

    let cancelled = false;
    const timers = new Set<number>();

    const wait = (ms: number) =>
      new Promise<boolean>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve(!cancelled);
        }, ms);
        timers.add(id);
      });

    void runRef.current({ wait, isCancelled: () => cancelled });

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };
  }, [isInView, reduce]);
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

function Spinner({ className }: { className?: string }) {
  return (
    <m.span
      aria-hidden="true"
      className={cn(
        "block size-2.5 rounded-full border-[1.5px] border-current/25 border-t-current",
        className,
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
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
    <div className="relative w-[268px] max-w-full overflow-hidden rounded-lg border border-border/60 bg-background/60 shadow-sm ring-1 ring-foreground/5 backdrop-blur-sm">
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

export function FillDetailsStepVisual() {
  const reduce = useIsMotionDisabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  const [values, setValues] =
    useState<Record<InfoField, string>>(EMPTY_INFO_VALUES);
  const [activeField, setActiveField] = useState<InfoField | null>(null);
  const [saved, setSaved] = useState(false);

  useLoopingEffect(isInView, reduce, async ({ wait, isCancelled }) => {
    const typeValue = async (field: InfoField, text: string) => {
      setActiveField(field);
      for (let index = 1; index <= text.length; index += 1) {
        if (!(await wait(18 + Math.random() * 18))) return false;
        if (isCancelled()) return false;
        setValues((current) => ({
          ...current,
          [field]: text.slice(0, index),
        }));
      }
      return true;
    };

    while (!isCancelled()) {
      setValues(EMPTY_INFO_VALUES);
      setActiveField(null);
      setSaved(false);

      if (!(await wait(500))) return;

      for (const field of INFO_FIELD_ORDER) {
        if (!(await typeValue(field.key, field.value))) return;
        if (!(await wait(110))) return;
      }

      setActiveField(null);
      setSaved(true);

      if (!(await wait(2400))) return;
    }
  });

  if (reduce) {
    return (
      <div
        ref={containerRef}
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
      ref={containerRef}
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

function ClassicThumb() {
  return (
    <div className="flex h-full w-full flex-col bg-white px-2 py-2">
      <div className="mx-auto h-[3px] w-9 rounded-full bg-neutral-700/70" />
      <div className="mx-auto mt-1 h-[2px] w-5 rounded-full bg-neutral-400/60" />
      <div className="mx-auto mt-1 flex items-center gap-[2px]">
        <ThumbLine className="w-3" />
        <ThumbLine className="w-2" />
        <ThumbLine className="w-3" />
      </div>
      <div className="mt-1.5 h-px w-full bg-neutral-300" />
      <div className="mt-1.5 h-[2px] w-7 rounded-full bg-neutral-600/60" />
      <div className="mt-1 space-y-[2px]">
        <ThumbLine className="w-full" />
        <ThumbLine className="w-[84%]" />
      </div>
      <div className="mt-1.5 h-[2px] w-6 rounded-full bg-neutral-600/60" />
      <div className="mt-1 space-y-[2px]">
        <ThumbLine className="w-full" />
        <ThumbLine className="w-[92%]" />
        <ThumbLine className="w-[76%]" />
      </div>
      <div className="mt-1.5 h-[2px] w-8 rounded-full bg-neutral-600/60" />
      <div className="mt-1 space-y-[2px]">
        <ThumbLine className="w-full" />
        <ThumbLine className="w-[88%]" />
      </div>
    </div>
  );
}

function ModernThumb() {
  return (
    <div className="flex h-full w-full bg-white">
      <div className="flex w-6 flex-col items-center bg-[#1e3a5f] px-1 py-2">
        <span className="size-3 rounded-full bg-white/25" />
        <span className="mt-1.5 h-[2px] w-full rounded-full bg-white/50" />
        <span className="mt-1 h-[1.5px] w-[80%] rounded-full bg-white/30" />
        <span className="mt-2 h-[1.5px] w-full rounded-full bg-white/30" />
        <span className="mt-1 h-[1.5px] w-[70%] rounded-full bg-white/30" />
        <span className="mt-2 h-[1.5px] w-full rounded-full bg-white/30" />
        <span className="mt-1 h-[1.5px] w-[85%] rounded-full bg-white/30" />
      </div>
      <div className="flex-1 px-1.5 py-2">
        <div className="h-[2.5px] w-8 rounded-full bg-[#1e3a5f]/70" />
        <div className="mt-1 h-[1.5px] w-5 rounded-full bg-neutral-400/60" />
        <div className="mt-2 h-[2px] w-6 rounded-full bg-[#1e3a5f]/50" />
        <div className="mt-1 space-y-[2px]">
          <ThumbLine className="w-full" />
          <ThumbLine className="w-[82%]" />
        </div>
        <div className="mt-2 h-[2px] w-7 rounded-full bg-[#1e3a5f]/50" />
        <div className="mt-1 space-y-[2px]">
          <ThumbLine className="w-full" />
          <ThumbLine className="w-[90%]" />
          <ThumbLine className="w-[68%]" />
        </div>
        <div className="mt-2 h-[2px] w-5 rounded-full bg-[#1e3a5f]/50" />
        <div className="mt-1 space-y-[2px]">
          <ThumbLine className="w-full" />
          <ThumbLine className="w-[78%]" />
        </div>
      </div>
    </div>
  );
}

function CompactThumb() {
  return (
    <div className="flex h-full w-full flex-col bg-white px-1.5 py-2">
      <div className="h-[2.5px] w-8 rounded-full bg-neutral-700/70" />
      <div className="mt-1 h-[1.5px] w-4 rounded-full bg-neutral-400/60" />
      <div className="mt-1.5 h-px w-full bg-neutral-300" />
      <div className="mt-1.5 grid flex-1 grid-cols-2 gap-1.5">
        <div>
          <div className="h-[2px] w-6 rounded-full bg-neutral-600/60" />
          <div className="mt-1 space-y-[2px]">
            <ThumbLine className="w-full" />
            <ThumbLine className="w-[86%]" />
            <ThumbLine className="w-[92%]" />
          </div>
          <div className="mt-1.5 h-[2px] w-5 rounded-full bg-neutral-600/60" />
          <div className="mt-1 space-y-[2px]">
            <ThumbLine className="w-full" />
            <ThumbLine className="w-[78%]" />
          </div>
          <div className="mt-1.5 h-[2px] w-7 rounded-full bg-neutral-600/60" />
          <div className="mt-1 space-y-[2px]">
            <ThumbLine className="w-full" />
            <ThumbLine className="w-[88%]" />
          </div>
        </div>
        <div className="border-l border-neutral-200 pl-1.5">
          <div className="h-[2px] w-4 rounded-full bg-neutral-600/60" />
          <div className="mt-1 space-y-[2px]">
            <ThumbLine className="w-full" />
            <ThumbLine className="w-[72%]" />
            <ThumbLine className="w-full" />
          </div>
          <div className="mt-1.5 h-[2px] w-5 rounded-full bg-neutral-600/60" />
          <div className="mt-1 space-y-[2px]">
            <ThumbLine className="w-full" />
            <ThumbLine className="w-[84%]" />
          </div>
        </div>
      </div>
    </div>
  );
}

const TEMPLATES = [
  { id: "classic", name: "Classic" },
  { id: "modern", name: "Modern" },
  { id: "compact", name: "Compact" },
] as const;

function TemplateThumb({ index }: { index: number }) {
  if (index === 1) return <ModernThumb />;
  if (index === 2) return <CompactThumb />;
  return <ClassicThumb />;
}

function TemplatePickerPanel({ active }: { active: number }) {
  const activeTemplate = TEMPLATES[active];

  return (
    <div className="w-[262px] max-w-full rounded-xl border border-border/60 bg-card p-2.5 shadow-[0_16px_36px_-22px_rgba(0,0,0,0.5)] ring-1 ring-border/30">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon
              icon={faTableColumns}
              className="size-2.5"
              aria-hidden="true"
            />
          </span>
          <span className="truncate text-[9px] leading-none font-semibold text-foreground">
            Choose a template
          </span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={activeTemplate.id}
            className="shrink-0 text-[7px] leading-none font-medium text-muted-foreground"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
          >
            {activeTemplate.name}
          </m.span>
        </AnimatePresence>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        {TEMPLATES.map((template, index) => {
          const isActive = active === index;

          return (
            <m.div
              key={template.id}
              className="relative overflow-hidden rounded-md bg-white shadow-[0_8px_18px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/10"
              initial={false}
              animate={{
                scale: isActive ? 1.04 : 0.97,
                y: isActive ? -2 : 0,
                opacity: isActive ? 1 : 0.55,
              }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
            >
              <div className="h-24 w-full">
                <TemplateThumb index={index} />
              </div>
              <m.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-md border-2 border-primary"
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: DURATION.fast }}
              />
              <AnimatePresence>
                {isActive && (
                  <m.span
                    key="template-selected"
                    className="absolute right-1 bottom-1 z-10 flex size-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  >
                    <Icon
                      icon={faCheck}
                      className="size-2"
                      aria-hidden="true"
                    />
                  </m.span>
                )}
              </AnimatePresence>
            </m.div>
          );
        })}
      </div>

      <div className="mt-2.5 flex h-6 items-center justify-between rounded-md border border-border/70 bg-muted/30 px-2">
        <span className="flex items-center gap-1 text-[7px] leading-none font-medium text-muted-foreground">
          <Icon
            icon={faCheck}
            className="size-2 shrink-0 text-primary"
            aria-hidden="true"
          />
          Selected
        </span>
        <span className="rounded bg-primary px-1.5 py-0.5 text-[6.5px] leading-none font-medium text-primary-foreground">
          Use template
        </span>
      </div>
    </div>
  );
}

const TEMPLATE_ROTATE_MS = 2400;

export function PickTemplateStepVisual() {
  const reduce = useIsMotionDisabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || !isInView) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % TEMPLATES.length);
    }, TEMPLATE_ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [isInView, reduce]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-2xl" />
      <TemplatePickerPanel active={active} />
    </div>
  );
}

type ExportPhase = "idle" | "working" | "done";

function ExportSheet({ phase }: { phase: ExportPhase }) {
  return (
    <div className="relative h-[104px] w-[74px] shrink-0 overflow-hidden rounded-[3px] bg-white p-2 text-neutral-800 shadow-[0_10px_20px_-14px_rgba(0,0,0,0.5)] ring-1 ring-black/10">
      <div className="h-[3px] w-9 rounded-full bg-[#1d76e2]/80" />
      <div className="mt-1 h-[2px] w-6 rounded-full bg-neutral-400/60" />
      <div className="mt-1.5 h-px w-full bg-neutral-300" />
      <div className="mt-1.5 h-[2px] w-7 rounded-full bg-neutral-600/60" />
      <div className="mt-1 space-y-[2px]">
        <ThumbLine className="w-full" />
        <ThumbLine className="w-[88%]" />
        <ThumbLine className="w-[72%]" />
      </div>
      <div className="mt-1.5 h-[2px] w-8 rounded-full bg-neutral-600/60" />
      <div className="mt-1 space-y-[2px]">
        <ThumbLine className="w-full" />
        <ThumbLine className="w-[82%]" />
        <ThumbLine className="w-[90%]" />
        <ThumbLine className="w-[64%]" />
      </div>
      <div className="mt-1.5 h-[2px] w-6 rounded-full bg-neutral-600/60" />
      <div className="mt-1 space-y-[2px]">
        <ThumbLine className="w-full" />
        <ThumbLine className="w-[76%]" />
      </div>

      {phase === "working" && (
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-6 bg-gradient-to-b from-transparent via-[#1d76e2]/25 to-transparent"
          initial={{ y: -26 }}
          animate={{ y: 106 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      )}

      <AnimatePresence>
        {phase === "done" && (
          <m.div
            key="export-done"
            className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
          >
            <m.span
              className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
            >
              <Icon icon={faCheck} className="size-3" aria-hidden="true" />
            </m.span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const EXPORT_COPY: Record<
  ExportPhase,
  { title: string; subtitle: string }
> = {
  idle: {
    title: "Ready to compile",
    subtitle: "Single-page A4 output",
  },
  working: {
    title: "Compiling LaTeX",
    subtitle: "Building your PDF",
  },
  done: {
    title: "PDF ready",
    subtitle: "resume.pdf · 24 KB",
  },
};

function ExportPanel({
  phase,
  percent,
  pressed,
}: {
  phase: ExportPhase;
  percent: number;
  pressed: boolean;
}) {
  const copy = EXPORT_COPY[phase];

  return (
    <div className="w-[262px] max-w-full rounded-xl border border-border/60 bg-card p-2.5 shadow-[0_16px_36px_-22px_rgba(0,0,0,0.5)] ring-1 ring-border/30">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon icon={faFilePdf} className="size-2.5" aria-hidden="true" />
          </span>
          <span className="truncate text-[9px] leading-none font-semibold text-foreground">
            Export to PDF
          </span>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[6.5px] leading-none font-medium text-muted-foreground">
          A4
        </span>
      </div>

      <div className="mt-2.5 flex gap-2.5">
        <ExportSheet phase={phase} />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="h-[20px]">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={copy.title}
                className="truncate text-[8px] leading-none font-semibold text-foreground"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              >
                {copy.title}
              </m.div>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <m.p
                key={copy.subtitle}
                className="mt-1 truncate text-[6.5px] leading-none text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast }}
              >
                {copy.subtitle}
              </m.p>
            </AnimatePresence>
          </div>

          <div className="mt-1">
            <div className="flex items-center justify-between text-[6.5px] leading-none">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-mono tabular-nums text-primary">
                {percent}%
              </span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
              <m.div
                className="h-full origin-left rounded-full bg-primary"
                initial={false}
                animate={{ scaleX: percent / 100 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
              />
            </div>
          </div>

          <div className="mt-auto space-y-1 pt-2">
            <div className="flex items-center justify-between text-[6.5px] leading-none">
              <span className="text-muted-foreground">Engine</span>
              <span className="font-medium text-foreground">Tectonic</span>
            </div>
            <div className="flex items-center justify-between text-[6.5px] leading-none">
              <span className="text-muted-foreground">Template</span>
              <span className="font-medium text-foreground">Classic</span>
            </div>
          </div>
        </div>
      </div>

      <m.span
        className={cn(
          "mt-2.5 flex h-6 items-center justify-center gap-1 rounded-md text-[7px] leading-none font-medium transition-colors",
          phase === "done"
            ? "bg-primary/10 text-primary ring-1 ring-primary/20"
            : "bg-primary text-primary-foreground",
        )}
        animate={{ scale: pressed ? 0.96 : 1 }}
        transition={{ duration: 0.1, ease: EASE_OUT }}
      >
        {phase === "done" ? (
          <Icon icon={faCheck} className="size-2.5" aria-hidden="true" />
        ) : phase === "working" ? (
          <Spinner className="size-2.5" />
        ) : (
          <Icon icon={faDownload} className="size-2.5" aria-hidden="true" />
        )}
        {phase === "done"
          ? "resume.pdf"
          : phase === "working"
            ? `Compiling ${percent}%`
            : "Download PDF"}
      </m.span>
    </div>
  );
}

export function ExportPdfStepVisual() {
  const reduce = useIsMotionDisabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  const [phase, setPhase] = useState<ExportPhase>("idle");
  const [percent, setPercent] = useState(0);
  const [pressed, setPressed] = useState(false);

  useLoopingEffect(isInView, reduce, async ({ wait }) => {
    while (true) {
      setPhase("idle");
      setPercent(0);
      setPressed(false);

      if (!(await wait(650))) return;

      setPressed(true);
      if (!(await wait(150))) return;
      setPressed(false);

      setPhase("working");
      for (let value = 10; value <= 100; value += 10) {
        setPercent(value);
        if (!(await wait(95))) return;
      }

      setPercent(100);
      setPhase("done");

      if (!(await wait(2400))) return;
    }
  });

  if (reduce) {
    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
      >
        <ExportPanel phase="done" percent={100} pressed={false} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-2xl" />
      <ExportPanel phase={phase} percent={percent} pressed={pressed} />
    </div>
  );
}
