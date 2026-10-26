import type { ReactNode } from "react";
import { Icon } from "@/components/Icon";
import {
  faDownload,
  faFilePdf,
  faLock,
  faShieldHalved,
  faUser,
  faXmark,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

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

export function SinglePageVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative h-36 w-28 rounded-[4px] bg-card p-2.5 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] ring-1 ring-border/60">
        <div className="flex items-center gap-1.5">
          <span className="size-4 rounded-full bg-primary/15 ring-1 ring-primary/20" />
          <span className="h-1.5 w-12 rounded-full bg-foreground/70" />
        </div>
        <Bar className="mt-1.5 h-0.5 w-16" />

        <div className="mt-3 space-y-1">
          <Bar className="h-0.5 w-8 bg-primary/60" />
          <Bar className="w-full" />
          <Bar className="w-11/12" />
          <Bar className="w-4/5" />
        </div>

        <div className="mt-3 space-y-1">
          <Bar className="h-0.5 w-10 bg-primary/60" />
          <Bar className="w-full" />
          <Bar className="w-10/12" />
          <Bar className="w-3/4" />
        </div>

        <div className="mt-3 flex gap-1">
          <span className="h-3 flex-1 rounded-sm bg-muted" />
          <span className="h-3 flex-1 rounded-sm bg-muted" />
          <span className="h-3 flex-1 rounded-sm bg-muted" />
        </div>
      </div>
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
