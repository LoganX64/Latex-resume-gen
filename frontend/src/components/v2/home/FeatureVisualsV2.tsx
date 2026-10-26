import { useEffect, useRef, useState, type ReactNode } from "react";
import { m, useInView } from "framer-motion";
import { Icon } from "@/components/Icon";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";
import {
  faDownload,
  faFilePdf,
  faLock,
  faShieldHalved,
  faUser,
  faXmark,
} from "@/lib/icons";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const RESUME_NAME = "Jitin k";
const RESUME_TITLE = "Backend Engineer";
const RESUME_SUMMARY =
  "Backend engineer building fast, reliable APIs with Go, PostgreSQL, and Docker.";
const ZOOM_SCALE = 2.4;
const ZOOM_DURATION = 1.15;
const FADE_DURATION = 0.25;

type ActiveField = "name" | "title" | "summary" | null;

function Bar({ className }: { className?: string }) {
  return (
    <div className={cn("h-1 rounded-full bg-muted-foreground/15", className)} />
  );
}

function WindowDots() {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      <span className="size-1.5 rounded-full bg-[#ff5f57]" />
      <span className="size-1.5 rounded-full bg-[#febc2e]" />
      <span className="size-1.5 rounded-full bg-[#28c840]" />
    </div>
  );
}

function Caret({ className }: { className?: string }) {
  return (
    <m.span
      aria-hidden="true"
      className={cn(
        "ml-px inline-block w-px shrink-0 bg-[#1d76e2]",
        className,
      )}
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

function MockHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-[3px] leading-[4px] font-bold tracking-wide text-[#1d76e2] uppercase",
        className,
      )}
    >
      {children}
    </h3>
  );
}

function MockRole({
  company,
  title,
  date,
  bullets,
}: {
  company: string;
  title: string;
  date: string;
  bullets: number;
}) {
  return (
    <div className="mt-[3px]">
      <div className="flex h-[4px] items-center gap-1 overflow-hidden whitespace-nowrap">
        <span className="shrink-0 text-[3px] leading-none font-bold text-[#333333] uppercase">
          {company}
        </span>
        <span className="truncate text-[2.5px] leading-none text-[#333333]">
          | {title}
        </span>
      </div>
      <div className="mt-px h-[3px] truncate text-[2.5px] leading-[3px] text-[#6a6a6a]">
        {date}
      </div>
      <div className="mt-[2px] space-y-[2px]">
        {Array.from({ length: bullets }).map((_, index) => (
          <div key={index} className="flex h-[3px] items-center gap-1">
            <span className="size-[2px] shrink-0 rotate-45 bg-[#1d76e2]" />
            <div className="min-w-0 flex-1">
              <Bar
                className={cn(
                  "h-[2px] bg-[#6a6a6a]/20",
                  index === 0 ? "w-full" : "w-4/5",
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockSkillGroup({ label, lines }: { label: string; lines: number }) {
  return (
    <div className="mt-[3px]">
      <div className="h-[4px] text-[2.5px] leading-[4px] font-bold text-[#333333] uppercase">
        {label}
      </div>
      <div className="mt-px space-y-[2px]">
        {Array.from({ length: lines }).map((_, index) => (
          <Bar
            key={index}
            className={cn(
              "h-[2px] bg-[#6a6a6a]/25",
              index === 0 ? "w-full" : "w-3/4",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function MockEducation({
  school,
  degree,
  date,
}: {
  school: string;
  degree: string;
  date: string;
}) {
  return (
    <div className="mt-[3px]">
      <div className="h-[4px] truncate text-[3px] leading-[4px] font-bold text-[#333333] uppercase">
        {school}
      </div>
      <div className="h-[3px] truncate text-[2.5px] leading-[3px] text-[#333333]">
        {degree}
      </div>
      <div className="h-[3px] truncate text-[2.5px] leading-[3px] text-[#6a6a6a]">
        {date}
      </div>
    </div>
  );
}

function ResumeMock({
  name,
  title,
  summary,
  activeField,
}: {
  name: string;
  title: string;
  summary: string;
  activeField: ActiveField;
}) {
  return (
    <div className="relative h-36 w-28 overflow-hidden rounded-[4px] bg-white p-2.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] ring-1 ring-border/60">
      <div className="flex h-2 min-w-0 items-center overflow-hidden text-[7px] leading-none font-bold whitespace-nowrap text-[#1d76e2]">
        <span className="truncate">{name}</span>
        {activeField === "name" && <Caret className="h-2" />}
      </div>
      <div className="mt-[1px] flex h-[4px] min-w-0 items-center overflow-hidden text-[3px] leading-[4px] whitespace-nowrap text-[#1d76e2]">
        <span className="truncate">{title}</span>
        {activeField === "title" && <Caret className="h-[3px]" />}
      </div>
      <div className="mt-[1px] h-[3px] truncate text-[2.5px] leading-[3px] text-[#1d76e2]">
        alexmorgan.dev · linkedin.com/in/alexmorgan · alex@morgan.dev
      </div>

      <MockHeading className="mt-[4px]">Professional Summary</MockHeading>
      <div className="mt-[1px] h-[10px] overflow-hidden text-[3px] leading-[4px] text-[#333333]">
        {summary}
        {activeField === "summary" && <Caret className="h-[4px]" />}
      </div>

      <div className="mt-[4px] flex items-start gap-[6px]">
        <div className="flex w-[62%] shrink-0 flex-col">
          <MockHeading>Experience</MockHeading>
          <MockRole
            company="Northwind"
            title="Senior Backend Engineer"
            date="2022 – Present · San Francisco"
            bullets={2}
          />
          <MockRole
            company="Lumen Labs"
            title="Backend Engineer"
            date="2020 – 2022 · Remote"
            bullets={2}
          />
          <MockRole
            company="Fieldwork"
            title="Software Engineer"
            date="2018 – 2020"
            bullets={1}
          />
          <MockHeading className="mt-[4px]">Projects</MockHeading>
          <div className="mt-[2px]">
            <div className="flex h-[4px] items-center gap-1">
              <span className="text-[3px] leading-none font-bold text-[#333333] uppercase">
                CVStack
              </span>
              <Bar className="h-[2px] flex-1 bg-[#6a6a6a]/25" />
            </div>
            <div className="mt-[2px] space-y-[2px]">
              <Bar className="h-[2px] w-full bg-[#6a6a6a]/20" />
              <Bar className="h-[2px] w-[82%] bg-[#6a6a6a]/20" />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col border-l border-[#1d76e2]/15 pl-[5px]">
          <MockHeading>Skills</MockHeading>
          <MockSkillGroup label="Design" lines={2} />
          <MockSkillGroup label="Tools" lines={2} />
          <MockSkillGroup label="Code" lines={1} />
          <MockHeading className="mt-[4px]">Education</MockHeading>
          <MockEducation
            school="RISD"
            degree="BFA Graphic Design"
            date="2016 – 2020"
          />
          <MockEducation
            school="Parsons"
            degree="Certificate, UX"
            date="2021"
          />
        </div>
      </div>
    </div>
  );
}

export function SinglePageVisual() {
  const reduce = useIsMotionDisabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  const [name, setName] = useState(RESUME_NAME);
  const [title, setTitle] = useState(RESUME_TITLE);
  const [summary, setSummary] = useState(RESUME_SUMMARY);
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [isFullView, setIsFullView] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (reduce || !isInView) return;

    let cancelled = false;
    const timers = new Set<number>();

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });

    const type = async (
      text: string,
      field: Exclude<ActiveField, null>,
      setValue: (value: string) => void,
      minDelay: number,
      maxDelay: number,
    ) => {
      setActiveField(field);
      setValue("");
      for (let index = 1; index <= text.length; index++) {
        if (cancelled) return;
        const char = text[index - 1];
        const delay = minDelay + Math.random() * (maxDelay - minDelay);
        const punctuationPause = /[.,]/.test(char) ? 140 : 0;
        await wait(delay + punctuationPause);
        if (cancelled) return;
        setValue(text.slice(0, index));
      }
    };

    const run = async () => {
      await wait(250);

      while (!cancelled) {
        setIsVisible(false);
        await wait(FADE_DURATION * 1000);
        if (cancelled) return;

        setIsFullView(false);
        setName("");
        setTitle("");
        setSummary("");
        setActiveField(null);
        setIsVisible(true);
        await wait(FADE_DURATION * 1000);
        if (cancelled) return;

        await type(RESUME_NAME, "name", setName, 50, 105);
        if (cancelled) return;

        await wait(250);
        if (cancelled) return;

        await type(RESUME_TITLE, "title", setTitle, 45, 90);
        if (cancelled) return;

        await wait(300);
        if (cancelled) return;

        await type(RESUME_SUMMARY, "summary", setSummary, 16, 40);
        if (cancelled) return;

        await wait(350);
        setActiveField(null);
        await wait(200);
        if (cancelled) return;

        setIsFullView(true);
        await wait(ZOOM_DURATION * 1000);
        if (cancelled) return;

        await wait(2200);
      }
    };

    void run();

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    };
  }, [isInView, reduce]);

  if (reduce) {
    return (
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <ResumeMock
          name={RESUME_NAME}
          title={RESUME_TITLE}
          summary={RESUME_SUMMARY}
          activeField={null}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <m.div
        initial={false}
        animate={{
          scale: isFullView ? 1 : ZOOM_SCALE,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          scale: {
            duration: isFullView ? ZOOM_DURATION : 0,
            ease: isFullView ? EASE_OUT : "linear",
          },
          opacity: { duration: FADE_DURATION, ease: "easeOut" },
        }}
        style={{ originX: 0.5, originY: 0.12 }}
      >
        <ResumeMock
          name={name}
          title={title}
          summary={summary}
          activeField={activeField}
        />
      </m.div>
    </div>
  );
}

export function PhotoSupportVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative">
        <div className="relative h-36 w-28 overflow-hidden rounded-lg bg-gradient-to-br from-rose-200 via-rose-300 to-rose-500 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] ring-1 ring-border/60 dark:from-rose-950 dark:via-rose-800 dark:to-rose-600">
          <div className="absolute inset-0 flex translate-y-2 items-end justify-center">
            <Icon icon={faUser} className="size-16 text-white/80" />
          </div>

          <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-white/50" />
          <div className="absolute inset-x-0 top-2/3 border-t border-dashed border-white/50" />
          <div className="absolute inset-y-0 left-1/3 border-l border-dashed border-white/50" />
          <div className="absolute inset-y-0 left-2/3 border-l border-dashed border-white/50" />

          <span className="absolute top-1 left-1 size-2 border-t-2 border-l-2 border-white" />
          <span className="absolute top-1 right-1 size-2 border-t-2 border-r-2 border-white" />
          <span className="absolute bottom-1 left-1 size-2 border-b-2 border-l-2 border-white" />
          <span className="absolute right-1 bottom-1 size-2 border-r-2 border-b-2 border-white" />
        </div>
      </div>
    </div>
  );
}

export function PdfExportVisual() {
  return (
    <div className="relative w-60 max-w-full">
      <div className="rounded-xl bg-card p-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] ring-1 ring-border/60">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon icon={faFilePdf} className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold">resume.pdf</div>
            <div className="text-[8px] text-muted-foreground">
              LaTeX · 1 page · A4
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-full rounded-full bg-primary" />
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-md bg-foreground px-2.5 py-1.5 text-[9px] font-medium text-background">
          <span>Export PDF</span>
          <Icon icon={faDownload} className="size-2.5" />
        </div>
      </div>
    </div>
  );
}

const latexLines: ReactNode[] = [
  <>
    <span className="text-primary">\documentclass</span>
    <span className="text-muted-foreground">{"{article}"}</span>
  </>,
  <>
    <span className="text-primary">\usepackage</span>
    <span className="text-muted-foreground">{"{geometry}"}</span>
  </>,
  <>
    <span className="text-primary">\begin</span>
    <span className="text-muted-foreground">{"{document}"}</span>
  </>,
  <>
    <span className="text-primary">\section</span>
    <span className="text-muted-foreground">{"{Experience}"}</span>
  </>,
  <>
    <span className="text-primary">\textbf</span>
    <span className="text-muted-foreground">{"{ACME}"}</span>
    <span className="text-foreground/50"> \hfill 2024</span>
  </>,
  <>
    <span className="text-foreground/60">\end</span>
    <span className="text-muted-foreground">{"{document}"}</span>
  </>,
];

export function LatexSourceVisual() {
  return (
    <div className="relative w-60 max-w-full">
      <div className="overflow-hidden rounded-lg bg-card shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] ring-1 ring-border/60">
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-2.5 py-1.5">
          <WindowDots />
          <span className="ml-1 text-[8px] font-medium text-muted-foreground">
            resume.tex
          </span>
          <span className="ml-auto rounded bg-primary/10 px-1.5 py-0.5 text-[7px] font-bold tracking-wide text-primary">
            TEX
          </span>
        </div>

        <div className="space-y-[3px] p-2.5 font-mono text-[8px] leading-[1.4]">
          {latexLines.map((line, index) => (
            <div key={index} className="flex gap-2 whitespace-nowrap">
              <span className="w-2 shrink-0 text-right text-muted-foreground/40">
                {index + 1}
              </span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PrivacyVisual() {
  return (
    <div className="w-60 max-w-full">
      <div className="rounded-xl bg-card p-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] ring-1 ring-border/60">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon icon={faLock} className="size-3.5" />
            </div>
            <div>
              <div className="text-[10px] font-semibold">
                Local storage only
              </div>
              <div className="text-[8px] text-muted-foreground">
                IndexedDB · this device
              </div>
            </div>
          </div>
          <Icon icon={faShieldHalved} className="size-4 text-primary/70" />
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          <span className="rounded-md bg-muted px-1.5 py-1 text-[8px] font-medium">
            This device
          </span>
          <span className="flex-1 border-t border-dashed border-border" />
          <Icon icon={faXmark} className="size-2.5 text-muted-foreground/60" />
          <span className="rounded-md bg-muted/60 px-1.5 py-1 text-[8px] text-muted-foreground line-through decoration-muted-foreground/40">
            Cloud
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-md bg-muted/60 px-2 py-1.5 text-[8px]">
          <span className="text-muted-foreground">Data sent</span>
          <span className="font-semibold">0 bytes</span>
        </div>
      </div>
    </div>
  );
}

export function MultipleTemplatesVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-40 w-56">
        <div className="absolute top-5 left-2 h-32 w-24 -rotate-6 rounded-md bg-card p-2 opacity-60 shadow-sm ring-1 ring-border/60">
          <div className="mb-2 h-1.5 w-8 rounded-full bg-primary/40" />
          <div className="space-y-1">
            <Bar className="w-full" />
            <Bar className="w-5/6" />
            <Bar className="w-full" />
            <Bar className="w-2/3" />
          </div>
        </div>

        <div className="absolute top-5 right-2 h-32 w-24 rotate-6 rounded-md bg-card p-2 opacity-60 shadow-sm ring-1 ring-border/60">
          <div className="mb-2 h-1.5 w-10 rounded-full bg-primary/40" />
          <div className="space-y-1">
            <Bar className="w-2/3" />
            <Bar className="w-full" />
            <Bar className="w-5/6" />
            <Bar className="w-full" />
          </div>
        </div>

        <div className="absolute top-1 left-1/2 h-36 w-28 -translate-x-1/2 rounded-md bg-card p-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] ring-2 ring-primary/70">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-primary/20" />
            <span className="h-1 w-10 rounded-full bg-foreground/60" />
          </div>
          <div className="flex gap-1.5">
            <div className="h-20 w-8 rounded-sm bg-primary/15" />
            <div className="flex-1 space-y-1">
              <Bar className="w-10 bg-foreground/40" />
              <Bar className="w-full" />
              <Bar className="w-5/6" />
              <Bar className="w-full" />
              <Bar className="w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
