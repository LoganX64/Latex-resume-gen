import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { Icon } from "@/components/Icon";
import { buttonVariants } from "@/components/ui/button";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";
import { SHOWCASE_PHOTO } from "@/components/v2/home/showcase/showcase-data";
import {
  faDownload,
  faExpand,
  faFilePdf,
  faLock,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faShieldHalved,
  faUpload,
  faUser,
  faXmark,
} from "@/lib/icons";
import { EASE_IN, EASE_OUT } from "@/lib/motion";
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
      <div
        aria-hidden="true"
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
      >
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
      aria-hidden="true"
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

type DemoCursorState = {
  x: number;
  y: number;
  visible: boolean;
  pressed: boolean;
  ripple: number;
};

type PhotoPosition = { x: number; y: number };

const PHOTO_START: PhotoPosition = { x: 12, y: -6 };
const PHOTO_CENTER: PhotoPosition = { x: 0, y: 5 };
const CROP_ZOOM_START = 1.15;
const CROP_ZOOM_IN = 1.45;
const CROP_ZOOM_OUT = 1.3;
const CROP_ZOOM_MIN = 1;
const CROP_ZOOM_MAX = 3;
const CROP_ZOOM_TRACK = 140;
const CROP_ZOOM_THUMB = 8;
const UPLOAD_CURSOR_START = { x: 228, y: 128 };
const UPLOAD_CURSOR_TARGET = { x: 206, y: 106 };
const CROP_CURSOR_START = { x: 138, y: 66 };
const CROP_CURSOR_FACE = { x: 134, y: 70 };
const CROP_CURSOR_DRAG = { x: 122, y: 81 };
const CROP_CURSOR_APPLY = { x: 221.5, y: 185.5 };

function DemoCursor({
  cursor,
  duration,
}: {
  cursor: DemoCursorState;
  duration: number;
}) {
  return (
    <m.div
      className="pointer-events-none absolute top-0 left-0 z-30"
      initial={false}
      animate={{
        x: cursor.x,
        y: cursor.y,
        opacity: cursor.visible ? 1 : 0,
      }}
      transition={{
        x: { duration, ease: EASE_OUT },
        y: { duration, ease: EASE_OUT },
        opacity: { duration: 0.18, ease: "easeOut" },
      }}
    >
      {cursor.ripple > 0 && (
        <m.span
          key={cursor.ripple}
          className="absolute -top-1.5 -left-1.5 size-3 rounded-full border border-background/80 bg-background/30"
          initial={{ scale: 0.2, opacity: 0.55 }}
          animate={{ scale: 2.4, opacity: 0 }}
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
          className="h-[18px] w-[13px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
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

function MockField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="truncate text-[6.5px] leading-none font-medium text-muted-foreground">
        {label}
      </div>
      <div className="flex h-5 items-center rounded-md border border-input bg-input/20 px-1.5 dark:bg-input/30">
        <span className="truncate text-[7px] leading-none text-foreground">
          {value}
        </span>
      </div>
    </div>
  );
}

function PhotoUploadPanel({
  hasPhoto,
  uploadPressed,
}: {
  hasPhoto: boolean;
  uploadPressed: boolean;
}) {
  return (
    <div className="w-[252px] max-w-full rounded-xl border border-border/60 bg-card p-2.5 shadow-[0_10px_28px_-18px_rgba(0,0,0,0.4)] ring-1 ring-border/30">
      <div className="text-[9px] leading-none font-semibold text-foreground">
        Personal Information
      </div>
      <div className="mt-2 flex gap-2.5">
        <div className="min-w-0 flex-1 space-y-1.5">
          <MockField
            label="Professional Title"
            value="Senior Full Stack Engineer"
          />
          <MockField label="Phone *" value="+1 (415) 555-0192" />
          <MockField label="Location *" value="San Francisco, CA" />
        </div>
        <div className="flex w-[72px] shrink-0 flex-col items-center justify-center gap-1.5">
          <div className="relative">
            <div className="flex size-12 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted">
              <AnimatePresence mode="wait" initial={false}>
                {hasPhoto ? (
                  <m.img
                    key="photo"
                    src={SHOWCASE_PHOTO}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                  />
                ) : (
                  <m.span
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                  >
                    <Icon
                      icon={faUser}
                      className="size-5 text-muted-foreground/50"
                      aria-hidden="true"
                    />
                  </m.span>
                )}
              </AnimatePresence>
            </div>
            {hasPhoto && (
              <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                <Icon
                  icon={faXmark}
                  className="size-2"
                  aria-hidden="true"
                />
              </span>
            )}
          </div>
          <m.span
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-[21px] cursor-default gap-1 rounded-md px-1.5 text-[7px] font-medium",
            )}
            animate={{ scale: uploadPressed ? 0.94 : 1 }}
            transition={{ duration: 0.1, ease: EASE_OUT }}
          >
            <Icon icon={faUpload} className="size-2.5" aria-hidden="true" />
            Upload Photo
          </m.span>
        </div>
      </div>
    </div>
  );
}

function CropDialogMock({
  zoom,
  photo,
  photoMoveMs,
  zoomMs,
  applyPressed,
}: {
  zoom: number;
  photo: PhotoPosition;
  photoMoveMs: number;
  zoomMs: number;
  applyPressed: boolean;
}) {
  const zoomProgress =
    (zoom - CROP_ZOOM_MIN) / (CROP_ZOOM_MAX - CROP_ZOOM_MIN);
  const thumbX = zoomProgress * (CROP_ZOOM_TRACK - CROP_ZOOM_THUMB);

  return (
    <div className="w-[248px] max-w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-[0_18px_44px_-18px_rgba(0,0,0,0.5)] ring-1 ring-foreground/10">
      <div className="flex items-center gap-1.5 border-b border-border/70 bg-muted/20 px-2 py-1.5">
        <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
          <Icon icon={faExpand} className="size-2.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[8px] leading-tight font-semibold">
            Crop Profile Photo
          </div>
          <div className="truncate text-[6px] leading-tight text-muted-foreground">
            Position your photo inside the square frame.
          </div>
        </div>
        <span className="flex size-4 shrink-0 items-center justify-center rounded text-muted-foreground/70">
          <Icon icon={faXmark} className="size-2" aria-hidden="true" />
        </span>
      </div>

      <div className="space-y-1.5 bg-background p-1.5">
        <div className="relative flex h-[78px] w-full items-center justify-center overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10">
          <div className="relative size-[78px] overflow-hidden bg-muted-foreground/20">
            <m.img
              src={SHOWCASE_PHOTO}
              alt=""
              width={320}
              height={320}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
              initial={false}
              animate={{ x: photo.x, y: photo.y, scale: zoom }}
              transition={{
                x: { duration: photoMoveMs, ease: EASE_OUT },
                y: { duration: photoMoveMs, ease: EASE_OUT },
                scale: { duration: zoomMs, ease: EASE_OUT },
              }}
            />
            <div className="pointer-events-none absolute inset-0 border border-white/90 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[calc(50%-39px)] bg-black/40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[calc(50%-39px)] bg-black/40" />
        </div>

        <div className="rounded-md border border-border/70 bg-muted/20 px-1.5 py-1">
          <div className="flex items-center justify-between">
            <span className="text-[6.5px] font-medium text-foreground">
              Zoom
            </span>
            <span className="font-mono text-[6.5px] text-muted-foreground">
              {zoom.toFixed(1)}x
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-1.5">
            <Icon
              icon={faMagnifyingGlassMinus}
              className="size-2 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="relative h-1 w-[140px] rounded-full bg-muted">
              <m.div
                className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary"
                initial={false}
                animate={{ scaleX: zoomProgress }}
                transition={{ duration: zoomMs, ease: EASE_OUT }}
              />
              <m.div
                className="absolute top-1/2 -mt-1 size-2 rounded-[2px] border border-ring bg-white shadow-sm"
                initial={false}
                animate={{ x: thumbX }}
                transition={{ duration: zoomMs, ease: EASE_OUT }}
              />
            </div>
            <Icon
              icon={faMagnifyingGlassPlus}
              className="size-2 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 border-t border-border/70 bg-muted/10 px-2 py-1.5">
        <span
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-5 cursor-default rounded px-2 text-[7px]",
          )}
        >
          Cancel
        </span>
        <m.span
          className={cn(
            buttonVariants(),
            "h-5 cursor-default rounded px-2 text-[7px]",
          )}
          animate={{ scale: applyPressed ? 0.94 : 1 }}
          transition={{ duration: 0.1, ease: EASE_OUT }}
        >
          Apply
        </m.span>
      </div>
    </div>
  );
}

export function PhotoSupportVisual() {
  const reduce = useIsMotionDisabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  const [phase, setPhase] = useState<"upload" | "crop">("upload");
  const [hasPhoto, setHasPhoto] = useState(false);

  const [uploadCursor, setUploadCursor] = useState<DemoCursorState>({
    ...UPLOAD_CURSOR_START,
    visible: false,
    pressed: false,
    ripple: 0,
  });
  const [uploadCursorMs, setUploadCursorMs] = useState(0.5);
  const [uploadPressed, setUploadPressed] = useState(false);

  const [dialogCursor, setDialogCursor] = useState<DemoCursorState>({
    ...CROP_CURSOR_START,
    visible: false,
    pressed: false,
    ripple: 0,
  });
  const [dialogCursorMs, setDialogCursorMs] = useState(0.45);
  const [applyPressed, setApplyPressed] = useState(false);

  const [photo, setPhoto] = useState<PhotoPosition>(PHOTO_START);
  const [zoom, setZoom] = useState(CROP_ZOOM_START);
  const [photoMoveMs, setPhotoMoveMs] = useState(0.6);
  const [zoomMs, setZoomMs] = useState(0.3);

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

    const step = async (ms: number) => {
      await wait(ms);
      return !cancelled;
    };

    const resetScene = () => {
      setPhase("upload");
      setHasPhoto(false);
      setUploadPressed(false);
      setApplyPressed(false);
      setPhoto(PHOTO_START);
      setZoom(CROP_ZOOM_START);
      setUploadCursorMs(0);
      setDialogCursorMs(0);
      setUploadCursor({
        ...UPLOAD_CURSOR_START,
        visible: false,
        pressed: false,
        ripple: 0,
      });
      setDialogCursor({
        ...CROP_CURSOR_START,
        visible: false,
        pressed: false,
        ripple: 0,
      });
    };

    const moveUploadCursor = async (x: number, y: number, ms: number) => {
      setUploadCursorMs(ms / 1000);
      setUploadCursor((current) => ({ ...current, x, y }));
      return step(ms);
    };

    const moveDialogCursor = async (x: number, y: number, ms: number) => {
      setDialogCursorMs(ms / 1000);
      setDialogCursor((current) => ({ ...current, x, y }));
      return step(ms);
    };

    const run = async () => {
      while (!cancelled) {
        resetScene();
        if (!(await step(350))) return;

        setUploadCursor((current) => ({ ...current, visible: true }));
        if (!(await step(120))) return;
        if (
          !(await moveUploadCursor(
            UPLOAD_CURSOR_TARGET.x,
            UPLOAD_CURSOR_TARGET.y,
            500,
          ))
        ) {
          return;
        }
        if (!(await step(80))) return;

        setUploadPressed(true);
        setUploadCursor((current) => ({
          ...current,
          pressed: true,
          ripple: current.ripple + 1,
        }));
        if (!(await step(110))) return;
        setUploadPressed(false);
        setUploadCursor((current) => ({ ...current, pressed: false }));
        if (!(await step(180))) return;

        setUploadCursor((current) => ({ ...current, visible: false }));
        if (!(await step(180))) return;
        setPhase("crop");
        if (!(await step(320))) return;

        setDialogCursor((current) => ({ ...current, visible: true }));
        if (!(await step(140))) return;
        if (
          !(await moveDialogCursor(
            CROP_CURSOR_FACE.x,
            CROP_CURSOR_FACE.y,
            360,
          ))
        ) {
          return;
        }
        if (!(await step(100))) return;

        setDialogCursor((current) => ({
          ...current,
          pressed: true,
          ripple: current.ripple + 1,
        }));
        if (!(await step(100))) return;
        setPhotoMoveMs(0.6);
        setPhoto(PHOTO_CENTER);
        if (
          !(await moveDialogCursor(
            CROP_CURSOR_DRAG.x,
            CROP_CURSOR_DRAG.y,
            600,
          ))
        ) {
          return;
        }
        setDialogCursor((current) => ({ ...current, pressed: false }));
        if (!(await step(140))) return;

        setZoomMs(0.32);
        setZoom(CROP_ZOOM_IN);
        if (!(await step(360))) return;
        setZoom(CROP_ZOOM_OUT);
        if (!(await step(300))) return;
        if (!(await step(160))) return;

        if (
          !(await moveDialogCursor(
            CROP_CURSOR_APPLY.x,
            CROP_CURSOR_APPLY.y,
            380,
          ))
        ) {
          return;
        }
        if (!(await step(100))) return;

        setApplyPressed(true);
        setDialogCursor((current) => ({
          ...current,
          pressed: true,
          ripple: current.ripple + 1,
        }));
        if (!(await step(110))) return;
        setApplyPressed(false);
        setDialogCursor((current) => ({ ...current, pressed: false }));
        if (!(await step(140))) return;

        setDialogCursor((current) => ({ ...current, visible: false }));
        setHasPhoto(true);
        setPhase("upload");
        if (!(await step(900))) return;
        if (!(await step(900))) return;
        if (!(await step(250))) return;
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
      <div
        ref={containerRef}
        aria-hidden="true"
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center opacity-50"
        >
          <PhotoUploadPanel hasPhoto uploadPressed={false} />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-black/25 p-3 dark:bg-black/35"
        >
          <CropDialogMock
            zoom={1.35}
            photo={PHOTO_CENTER}
            photoMoveMs={0}
            zoomMs={0}
            applyPressed={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="relative flex h-full w-full items-center justify-center"
      >
        <div className="relative">
          <PhotoUploadPanel
            hasPhoto={hasPhoto}
            uploadPressed={uploadPressed}
          />
          <DemoCursor cursor={uploadCursor} duration={uploadCursorMs} />
        </div>
      </div>

      <AnimatePresence>
        {phase === "crop" && (
          <m.div
            key="crop-modal"
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/25 dark:bg-black/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2, ease: EASE_OUT } }}
            exit={{ opacity: 0, transition: { duration: 0.18, ease: EASE_IN } }}
          >
            <m.div
              className="relative"
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.26, ease: EASE_OUT },
              }}
              exit={{
                opacity: 0,
                y: 4,
                scale: 0.97,
                transition: { duration: 0.18, ease: EASE_IN },
              }}
            >
              <CropDialogMock
                zoom={zoom}
                photo={photo}
                photoMoveMs={photoMoveMs}
                zoomMs={zoomMs}
                applyPressed={applyPressed}
              />
              <DemoCursor cursor={dialogCursor} duration={dialogCursorMs} />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PdfExportVisual() {
  return (
    <div aria-hidden="true" className="relative w-60 max-w-full">
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
    <div aria-hidden="true" className="relative w-60 max-w-full">
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
    <div aria-hidden="true" className="w-60 max-w-full">
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
    <div
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center"
    >
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
