import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { Icon } from "@/components/Icon";
import { buttonVariants } from "@/components/ui/button";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";
import { SHOWCASE_PHOTO } from "@/components/v2/home/showcase/showcase-data";
import {
  faCheck,
  faChevronDown,
  faDownload,
  faExpand,
  faFileLines,
  faLock,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
  faShieldHalved,
  faUpload,
  faUser,
  faXmark,
} from "@/lib/icons";
import { DURATION, EASE_IN, EASE_OUT } from "@/lib/motion";
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

const PDF_FILENAME = "jitin-k.pdf";

const PDF_COMPILE_STEPS = [
  { label: "Validating LaTeX", description: "Checking syntax" },
  { label: "Writing files", description: "Preparing workspace" },
  {
    label: "Compiling with Tectonic",
    description: 'note: "version 2" Tectonic command-line interface activated',
  },
  { label: "Reading PDF", description: "Finalizing output" },
] as const;

type PdfPhase = "idle" | "compiling" | "done";
type PdfStepState = "pending" | "active" | "complete";

function PdfSpinner({ className }: { className?: string }) {
  return (
    <m.span
      aria-hidden="true"
      className={cn(
        "block size-2 rounded-full border-[1.5px] border-current/25 border-t-current",
        className,
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    />
  );
}

function PreviewToolbar({
  filePressed = false,
  downloadPressed = false,
  exporting = false,
  fileButtonRef,
  downloadButtonRef,
}: {
  filePressed?: boolean;
  downloadPressed?: boolean;
  exporting?: boolean;
  fileButtonRef?: RefObject<HTMLSpanElement | null>;
  downloadButtonRef?: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className="relative z-10 flex items-center gap-1.5">
      <span className="shrink-0 text-[10px] leading-none font-semibold whitespace-nowrap text-foreground">
        A4 Page Preview
      </span>
      <span className="shrink-0 text-[8px] leading-none whitespace-nowrap text-muted-foreground italic">
        (approximate)
      </span>
      <span className="flex h-6 min-w-[70px] shrink-0 items-center justify-between gap-1 rounded-md border border-input bg-input/20 px-2 text-[8px] leading-none text-foreground dark:bg-input/30">
        <span className="truncate">twocolumn</span>
        <Icon
          icon={faChevronDown}
          className="size-2 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </span>
      <m.span
        ref={fileButtonRef}
        aria-hidden="true"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-6 shrink-0 rounded-md border border-dashed border-border/70 p-0 text-foreground",
        )}
        animate={{ scale: filePressed ? 0.9 : 1 }}
        transition={{ duration: 0.1, ease: EASE_OUT }}
      >
        <Icon icon={faFileLines} className="size-2.5" aria-hidden="true" />
      </m.span>
      <m.span
        ref={downloadButtonRef}
        aria-hidden="true"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon-xs" }),
          "size-6 shrink-0 rounded-md border border-dashed border-border/70 p-0 text-foreground",
        )}
        animate={{ scale: downloadPressed ? 0.9 : 1 }}
        transition={{ duration: 0.1, ease: EASE_OUT }}
      >
        {exporting ? (
          <PdfSpinner className="size-2.5" />
        ) : (
          <Icon icon={faDownload} className="size-2.5" />
        )}
      </m.span>
    </div>
  );
}

function PreviewStage({
  stageRef,
  fileButtonRef,
  downloadButtonRef,
  filePressed = false,
  downloadPressed = false,
  exporting = false,
  hideToolbar = false,
  children,
}: {
  stageRef?: RefObject<HTMLDivElement | null>;
  fileButtonRef?: RefObject<HTMLSpanElement | null>;
  downloadButtonRef?: RefObject<HTMLSpanElement | null>;
  filePressed?: boolean;
  downloadPressed?: boolean;
  exporting?: boolean;
  hideToolbar?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      ref={stageRef}
      className="relative flex h-full w-full max-w-[272px] flex-col items-center justify-center overflow-hidden"
    >
      <m.div
        className="pointer-events-none will-change-transform"
        initial={false}
        animate={{
          opacity: hideToolbar ? 0 : 1,
          y: hideToolbar ? -16 : 0,
          scale: hideToolbar ? 0.95 : 1,
        }}
        transition={{
          duration: hideToolbar ? 0.22 : 0.32,
          ease: hideToolbar ? EASE_IN : EASE_OUT,
        }}
      >
        <PreviewToolbar
          fileButtonRef={fileButtonRef}
          downloadButtonRef={downloadButtonRef}
          filePressed={filePressed}
          downloadPressed={downloadPressed}
          exporting={exporting}
        />
      </m.div>
      {children}
    </div>
  );
}

function BraveGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="m15.68 0l2.096 2.38s1.84-.512 2.709.358c.868.87 1.584 1.638 1.584 1.638l-.562 1.381.715 2.047s-2.104 7.98-2.35 8.955c-.486 1.919-.818 2.66-2.198 3.633a186 186 0 0 1-4.293 2.916c-.409.256-.92.692-1.38.692s-.97-.436-1.38-.692a186 186 0 0 1-4.293-2.916c-1.38-.973-1.712-1.714-2.197-3.633c-.247-.975-2.351-8.955-2.351-8.955l.715-2.047l-.562-1.381s.716-.768 1.585-1.638c.868-.87 2.708-.358 2.708-.358L8.321 0h7.36zm-3.679 14.936c-.14 0-1.038.317-1.758.69s-1.242.637-1.409.742s-.065.301.087.409s2.194 1.69 2.393 1.866c.198.175.489.464.687.464s.49-.29.688-.464s2.24-1.759 2.392-1.866s.254-.305.087-.41s-.689-.368-1.41-.741c-.72-.373-1.617-.69-1.757-.69m0-11.278s-.409.001-1.022.206s-1.278.46-1.584.46s-2.581-.434-2.581-.434s-2.695 3.262-2.695 3.959s.339.881.68 1.243l2.02 2.149c.192.203.59.511.356 1.066c-.235.555-.58 1.26-.196 1.977c.384.716 1.042 1.194 1.464 1.115c.421-.08 1.412-.598 1.776-.834c.364-.237 1.518-1.19 1.518-1.554s-1.193-1.02-1.413-1.168c-.22-.15-1.226-.725-1.247-.95c-.02-.227-.012-.293.284-.851c.297-.559.831-1.304.742-1.8c-.089-.495-.95-.753-1.565-.986s-1.799-.671-1.947-.74s-.11-.133.339-.175c.448-.043 1.719-.212 2.292-.052s1.552.403 1.632.532c.079.13.149.134.067.579s-.5 2.581-.541 2.96c-.04.38-.12.63.288.724c.409.094 1.097.256 1.333.256s.924-.162 1.333-.256c.408-.093.329-.344.288-.723c-.04-.38-.46-2.516-.541-2.961s-.012-.45.067-.579c.08-.129 1.059-.372 1.632-.532s1.845.009 2.292.052c.449.042.487.107.339.175c-.148.069-1.332.508-1.947.74c-.615.233-1.476.49-1.565.986c-.09.496.445 1.241.742 1.8s.304.624.284.85s-1.026.802-1.247.95c-.22.15-1.413.804-1.413 1.169c0 .364 1.154 1.317 1.518 1.554c.364.236 1.355.755 1.776.834s1.08-.4 1.464-1.115c.384-.716.039-1.422-.195-1.977s.163-.863.355-1.066l2.02-2.149c.341-.362.68-.546.68-1.243s-2.695-3.96-2.695-3.96s-2.274.436-2.58.436s-.972-.256-1.585-.461s-1.022-.206-1.022-.206" />
    </svg>
  );
}

function PdfDownloadBubble() {
  return (
    <div className="flex w-[238px] max-w-full items-center gap-2 rounded-xl bg-white p-3 text-[#202124] shadow-[0_18px_36px_-14px_rgba(0,0,0,0.5)] ring-1 ring-black/5 dark:bg-[#202124] dark:text-white dark:ring-white/10">
      <BraveGlyph className="size-[18px] shrink-0 text-[#fb542b]" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[8.5px] leading-none font-semibold">
          {PDF_FILENAME}
        </div>
        <div className="mt-1 text-[6.5px] leading-none text-[#5f6368] dark:text-white/55">
          24.1 KB • Done
        </div>
      </div>
    </div>
  );
}

function PdfStatusGlyph({ done, instant }: { done: boolean; instant: boolean }) {
  return (
    <div className="flex size-6 shrink-0 items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <m.span
            key="pdf-done"
            className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm shadow-primary/25"
            initial={instant ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={instant ? undefined : { scale: 0.7, opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            <Icon icon={faCheck} className="size-2.5" aria-hidden="true" />
          </m.span>
        ) : (
          <m.span
            key="pdf-busy"
            className="relative flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20"
            initial={instant ? false : { scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={instant ? undefined : { scale: 0.85, opacity: 0 }}
            transition={{ duration: DURATION.fast }}
          >
            {!instant && (
              <m.span
                aria-hidden="true"
                className="absolute inset-0 rounded-md bg-primary/15"
                animate={{ opacity: [0.35, 0.7, 0.35] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
            <PdfSpinner className="relative size-2.5" />
          </m.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function PdfStepGlyph({
  state,
  instant,
}: {
  state: PdfStepState;
  instant: boolean;
}) {
  return (
    <span className="relative flex size-3.5 shrink-0 items-center justify-center">
      <AnimatePresence mode="wait" initial={false}>
        {state === "complete" ? (
          <m.span
            key="pdf-step-complete"
            className="flex size-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground"
            initial={instant ? false : { scale: 0.55, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={instant ? undefined : { scale: 0.55, opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            <Icon icon={faCheck} className="size-1.5" aria-hidden="true" />
          </m.span>
        ) : state === "active" ? (
          <m.span
            key="pdf-step-active"
            className="relative flex size-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground"
            initial={instant ? false : { scale: 0.55, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={instant ? undefined : { scale: 0.55, opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
          >
            {!instant && (
              <m.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-primary/40"
                animate={{ scale: [1, 1.55], opacity: [0.45, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}
            <PdfSpinner className="relative size-2" />
          </m.span>
        ) : (
          <m.span
            key="pdf-step-pending"
            className="flex size-3.5 items-center justify-center rounded-full border border-border bg-muted/60"
            initial={instant ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={instant ? undefined : { opacity: 0 }}
            transition={{ duration: DURATION.fast }}
          >
            <span className="size-1 rounded-full bg-muted-foreground/30" />
          </m.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function PdfStepRow({
  state,
  label,
  description,
  isLast,
  instant,
}: {
  state: PdfStepState;
  label: string;
  description: string;
  isLast: boolean;
  instant: boolean;
}) {
  return (
    <m.div
      className="flex gap-2"
      initial={instant ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
    >
      <div className="flex flex-col items-center">
        <PdfStepGlyph state={state} instant={instant} />
        {!isLast && (
          <div className="relative mt-1 w-px flex-1 overflow-hidden rounded-full bg-border">
            <m.div
              className="absolute inset-0 origin-top rounded-full bg-primary/50"
              initial={false}
              animate={{ scaleY: state === "complete" ? 1 : 0 }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            />
          </div>
        )}
      </div>

      <div className={cn("min-w-0 flex-1", !isLast && "pb-1.5")}>
        <div
          className={cn(
            "truncate text-[7.5px] leading-none font-medium transition-colors duration-300",
            state === "pending" ? "text-muted-foreground/50" : "text-foreground",
          )}
        >
          {label}
        </div>
        <div
          className={cn(
            "mt-0.5 truncate text-[7px] leading-[9px] transition-colors duration-300",
            state === "pending"
              ? "text-muted-foreground/40"
              : "text-muted-foreground",
          )}
        >
          {description}
        </div>
      </div>
    </m.div>
  );
}

function PdfCompileDialog({
  activeStep,
  instant,
}: {
  activeStep: number;
  instant: boolean;
}) {
  const done = activeStep >= PDF_COMPILE_STEPS.length;
  const completed = done
    ? PDF_COMPILE_STEPS.length
    : Math.min(activeStep, PDF_COMPILE_STEPS.length);
  const pct = Math.round((completed / PDF_COMPILE_STEPS.length) * 100);
  const title = done ? "Compilation complete" : "Compiling your resume";
  const subtitle = done
    ? "Your PDF is ready"
    : `Step ${Math.min(activeStep + 1, PDF_COMPILE_STEPS.length)} of ${PDF_COMPILE_STEPS.length}`;
  const footerText = done
    ? "Preparing download..."
    : "This may take a few seconds";

  return (
    <div className="w-full overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] ring-1 ring-foreground/10">
      <div className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-primary/[0.05] to-popover px-2.5 py-1.5 dark:from-primary/[0.08]">
        {instant ? (
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -top-8 -right-6 size-24 rounded-full blur-2xl",
              done ? "bg-primary/20" : "bg-primary/15",
            )}
          />
        ) : (
          <m.div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -top-8 -right-6 size-24 rounded-full blur-2xl",
              done ? "bg-primary/20" : "bg-primary/15",
            )}
            initial={done ? { opacity: 0, scale: 0.8 } : false}
            animate={
              done
                ? { opacity: 1, scale: 1 }
                : { opacity: [0.4, 0.75, 0.4], scale: [1, 1.08, 1] }
            }
            transition={
              done
                ? { duration: DURATION.slow, ease: EASE_OUT }
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
          />
        )}

        <div className="relative flex items-start gap-2">
          <PdfStatusGlyph done={done} instant={instant} />

          <div className="min-w-0 flex-1 pt-px">
            <div className="flex h-[10px] items-center">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={title}
                  className="truncate text-[9px] leading-none font-medium"
                  initial={instant ? false : { opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={instant ? undefined : { opacity: 0, y: -2 }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                >
                  {title}
                </m.div>
              </AnimatePresence>
            </div>
            <div className="mt-0.5 h-[9px] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <m.p
                  key={subtitle}
                  className="truncate text-[7px] leading-[9px] text-muted-foreground"
                  initial={instant ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={instant ? undefined : { opacity: 0 }}
                  transition={{ duration: DURATION.fast }}
                >
                  {subtitle}
                </m.p>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 px-2.5 py-1.5">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[7px] leading-none text-muted-foreground">
              Progress
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={pct}
                className="font-mono text-[7px] leading-none tabular-nums text-primary"
                initial={instant ? false : { opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={instant ? undefined : { opacity: 0 }}
                transition={{ duration: DURATION.fast }}
              >
                {pct}%
              </m.span>
            </AnimatePresence>
          </div>
          <div className="relative h-[3.5px] overflow-hidden rounded-full bg-muted">
            <m.div
              className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary"
              initial={instant ? false : { scaleX: 0 }}
              animate={{ scaleX: pct / 100 }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
            />
            {!done && !instant && (
              <m.div
                aria-hidden="true"
                className="absolute inset-y-0 w-10 rounded-full bg-gradient-to-r from-transparent via-primary-foreground/35 to-transparent"
                initial={{ x: "-2.5rem" }}
                animate={{ x: "16rem" }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 0.4,
                }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {PDF_COMPILE_STEPS.map((step, index) => {
            const state: PdfStepState =
              done || index < activeStep
                ? "complete"
                : index === activeStep
                  ? "active"
                  : "pending";

            return (
              <PdfStepRow
                key={step.label}
                state={state}
                label={step.label}
                description={step.description}
                isLast={index === PDF_COMPILE_STEPS.length - 1}
                instant={instant}
              />
            );
          })}
        </div>
      </div>

      <div className="flex h-6 shrink-0 items-center justify-between gap-2 border-t border-border/70 bg-muted/10 px-2.5">
        <div className="min-w-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={footerText}
              className="flex min-w-0 items-center gap-1 truncate text-[7px] leading-none text-muted-foreground"
              initial={instant ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={instant ? undefined : { opacity: 0 }}
              transition={{ duration: DURATION.fast }}
            >
              <span className="truncate">{footerText}</span>
            </m.span>
          </AnimatePresence>
        </div>
        {!done && (
          <span
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-[18px] shrink-0 cursor-default rounded px-1.5 text-[7px]",
            )}
          >
            Cancel
          </span>
        )}
      </div>
    </div>
  );
}

export function PdfExportVisual() {
  const reduce = useIsMotionDisabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const downloadButtonRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  const [phase, setPhase] = useState<PdfPhase>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const [downloadPressed, setDownloadPressed] = useState(false);
  const [showDownloadBubble, setShowDownloadBubble] = useState(false);
  const [cursor, setCursor] = useState<DemoCursorState>({
    x: 0,
    y: 0,
    visible: false,
    pressed: false,
    ripple: 0,
  });
  const [cursorDuration, setCursorDuration] = useState(0);

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
      setPhase("idle");
      setActiveStep(-1);
      setDownloadPressed(false);
      setShowDownloadBubble(false);
      setCursor({ x: 0, y: 0, visible: false, pressed: false, ripple: 0 });
      setCursorDuration(0);
    };

    const run = async () => {
      while (!cancelled) {
        resetScene();
        if (!(await step(450))) return;

        const stage = stageRef.current;
        const button = downloadButtonRef.current;
        if (!stage || !button) {
          if (!(await step(400))) return;
          continue;
        }

        const stageRect = stage.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const start = {
          x: stageRect.width * 0.68,
          y: stageRect.height * 0.72,
        };
        const target = {
          x: buttonRect.left - stageRect.left + buttonRect.width / 2 - 1,
          y: buttonRect.top - stageRect.top + buttonRect.height / 2 - 1,
        };

        setCursor({ ...start, visible: false, pressed: false, ripple: 0 });
        if (!(await step(40))) return;
        setCursor((current) => ({ ...current, visible: true }));
        if (!(await step(140))) return;

        setCursorDuration(0.52);
        setCursor((current) => ({ ...current, x: target.x, y: target.y }));
        if (!(await step(520))) return;
        if (!(await step(90))) return;

        setDownloadPressed(true);
        setCursor((current) => ({
          ...current,
          pressed: true,
          ripple: current.ripple + 1,
        }));
        if (!(await step(120))) return;
        setDownloadPressed(false);
        setCursor((current) => ({ ...current, pressed: false }));
        if (!(await step(90))) return;

        setCursor((current) => ({ ...current, visible: false }));
        if (!(await step(140))) return;

        setPhase("compiling");
        setActiveStep(0);
        if (!(await step(760))) return;
        setActiveStep(1);
        if (!(await step(650))) return;
        setActiveStep(2);
        if (!(await step(1000))) return;
        setActiveStep(3);
        if (!(await step(600))) return;
        setActiveStep(PDF_COMPILE_STEPS.length);
        setPhase("done");
        if (!(await step(900))) return;

        setPhase("idle");
        if (!(await step(320))) return;

        setShowDownloadBubble(true);
        if (!(await step(2200))) return;
        setShowDownloadBubble(false);
        if (!(await step(260))) return;
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
        className="relative flex h-full w-full items-center justify-center overflow-hidden p-2"
      >
        <PreviewStage />
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/45 p-2 dark:bg-black/60">
          <div className="w-full max-w-[258px]">
            <PdfCompileDialog activeStep={PDF_COMPILE_STEPS.length} instant />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-2"
    >
      <PreviewStage
        stageRef={stageRef}
        downloadButtonRef={downloadButtonRef}
        downloadPressed={downloadPressed}
        exporting={phase !== "idle"}
        hideToolbar={showDownloadBubble}
      >
        <DemoCursor cursor={cursor} duration={cursorDuration} />
      </PreviewStage>

      <AnimatePresence>
        {phase !== "idle" && (
          <m.div
            key="pdf-export-dialog"
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/45 p-2 dark:bg-black/60"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.2, ease: EASE_OUT },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.18, ease: EASE_IN },
            }}
          >
            <m.div
              className="w-full max-w-[258px]"
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
              <PdfCompileDialog activeStep={activeStep} instant={false} />
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDownloadBubble && (
          <m.div
            key="pdf-download-bubble"
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center p-2"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.24, ease: EASE_OUT },
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              transition: { duration: 0.18, ease: EASE_IN },
            }}
          >
            <PdfDownloadBubble />
          </m.div>
        )}
      </AnimatePresence>
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

function LatexDocumentMockup() {
  return (
    <div className="w-60 max-w-full overflow-hidden rounded-lg bg-card shadow-[0_8px_24px_-12px_rgba(0,0,0,0.35)] ring-1 ring-border/60">
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-2.5 py-1.5">
        <WindowDots />
        <span className="ml-1 text-[8px] font-medium text-muted-foreground">
          jitin-k.tex
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
  );
}

export function LatexSourceVisual() {
  const reduce = useIsMotionDisabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fileButtonRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  const [showDocument, setShowDocument] = useState(false);
  const [toolbarHidden, setToolbarHidden] = useState(false);
  const [filePressed, setFilePressed] = useState(false);
  const [cursor, setCursor] = useState<DemoCursorState>({
    x: 0,
    y: 0,
    visible: false,
    pressed: false,
    ripple: 0,
  });
  const [cursorDuration, setCursorDuration] = useState(0);

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
      setShowDocument(false);
      setToolbarHidden(false);
      setFilePressed(false);
      setCursor({ x: 0, y: 0, visible: false, pressed: false, ripple: 0 });
      setCursorDuration(0);
    };

    const run = async () => {
      while (!cancelled) {
        resetScene();
        if (!(await step(500))) return;

        const stage = stageRef.current;
        const button = fileButtonRef.current;
        if (!stage || !button) {
          if (!(await step(400))) return;
          continue;
        }

        const stageRect = stage.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const start = {
          x: stageRect.width * 0.62,
          y: stageRect.height * 0.74,
        };
        const target = {
          x: buttonRect.left - stageRect.left + buttonRect.width / 2 - 1,
          y: buttonRect.top - stageRect.top + buttonRect.height / 2 - 1,
        };

        setCursor({ ...start, visible: false, pressed: false, ripple: 0 });
        if (!(await step(40))) return;
        setCursor((current) => ({ ...current, visible: true }));
        if (!(await step(140))) return;

        setCursorDuration(0.52);
        setCursor((current) => ({ ...current, x: target.x, y: target.y }));
        if (!(await step(520))) return;
        if (!(await step(90))) return;

        setFilePressed(true);
        setCursor((current) => ({
          ...current,
          pressed: true,
          ripple: current.ripple + 1,
        }));
        if (!(await step(120))) return;
        setFilePressed(false);
        setCursor((current) => ({ ...current, pressed: false }));
        if (!(await step(90))) return;

        setCursor((current) => ({ ...current, visible: false }));
        if (!(await step(90))) return;

        setToolbarHidden(true);
        if (!(await step(260))) return;

        setShowDocument(true);
        if (!(await step(2800))) return;
        setShowDocument(false);
        if (!(await step(260))) return;

        setToolbarHidden(false);
        if (!(await step(600))) return;
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
        className="relative flex h-full w-full items-center justify-center overflow-hidden p-2"
      >
        <LatexDocumentMockup />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative flex h-full w-full items-center justify-center overflow-hidden p-2"
    >
      <PreviewStage
        stageRef={stageRef}
        fileButtonRef={fileButtonRef}
        filePressed={filePressed}
        hideToolbar={toolbarHidden}
      >
        <DemoCursor cursor={cursor} duration={cursorDuration} />
      </PreviewStage>

      <AnimatePresence>
        {showDocument && (
          <m.div
            key="latex-source-document"
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-2 will-change-transform"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.34, ease: EASE_OUT },
            }}
            exit={{
              opacity: 0,
              y: 6,
              scale: 0.98,
              transition: { duration: 0.22, ease: EASE_IN },
            }}
          >
            <LatexDocumentMockup />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PRIVACY_DOT_CLASS =
  "absolute top-1 left-0 size-1 rounded-full bg-primary";

const PRIVACY_DOT_TRAVEL_MS = 1600;
const PRIVACY_DOT_GAP_MS = 530;

export function PrivacyVisual() {
  const reduce = useIsMotionDisabled();
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => setTrackWidth(track.getBoundingClientRect().width);
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const travel = trackWidth > 0 ? trackWidth + 2 : 56;
  const showDots = !reduce;

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
          <div ref={trackRef} className="relative h-3 flex-1">
            <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-border" />
            {reduce &&
              [0.28, 0.52, 0.76].map((position) => (
                <span
                  key={position}
                  className={cn(PRIVACY_DOT_CLASS, "opacity-60")}
                  style={{ left: `${position * 100}%` }}
                />
              ))}
            {showDots &&
              [0, 1, 2].map((index) => (
                <m.span
                  key={index}
                  className={PRIVACY_DOT_CLASS}
                  initial={{ x: 0, opacity: 0 }}
                  animate={{
                    x: [0, travel],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    x: {
                      duration: PRIVACY_DOT_TRAVEL_MS / 1000,
                      delay: index * (PRIVACY_DOT_GAP_MS / 1000),
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear",
                    },
                    opacity: {
                      duration: PRIVACY_DOT_TRAVEL_MS / 1000,
                      delay: index * (PRIVACY_DOT_GAP_MS / 1000),
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear",
                      times: [0, 0.1, 0.88, 1],
                    },
                  }}
                />
              ))}
          </div>
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

