import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, m, useInView } from "framer-motion";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";
import { cn } from "@/lib/utils";
import { getAllTemplateConfigs } from "@/templates";

const SHEET_WIDTH = 126;
const SHEET_HEIGHT = 178;
const STACK_HEIGHT = SHEET_HEIGHT + 8;
const ROTATE_INTERVAL_MS = 3000;
const MOCK_PHOTO = "/profile-pic-preview.jpg";

const CAROUSEL_TEMPLATES = getAllTemplateConfigs().slice(0, 4);

const SLOTS = [
  { x: 0, y: 0, rotate: 0, rotateY: 0, scale: 1, opacity: 1, zIndex: 40 },
  {
    x: 30,
    y: 6,
    rotate: 5,
    rotateY: -14,
    scale: 0.93,
    opacity: 0.78,
    zIndex: 30,
  },
  {
    x: 0,
    y: 14,
    rotate: 0,
    rotateY: 0,
    scale: 0.9,
    opacity: 0.5,
    zIndex: 20,
  },
  {
    x: -30,
    y: 8,
    rotate: -5,
    rotateY: 14,
    scale: 0.93,
    opacity: 0.78,
    zIndex: 10,
  },
];

function MiniBar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "block h-[1.5px] shrink-0 rounded-full bg-neutral-500/25",
        className
      )}
    />
  );
}

function MiniLines({
  widths,
  className,
  barClassName,
}: {
  widths: string[];
  className?: string;
  barClassName?: string;
}) {
  return (
    <div className={cn("space-y-[2px]", className)}>
      {widths.map((width, index) => (
        <MiniBar key={index} className={cn(width, barClassName)} />
      ))}
    </div>
  );
}

function MiniHeading({
  children,
  className,
  accent = false,
}: {
  children: string;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "text-[3px] leading-[4px] font-bold tracking-[0.09em] uppercase",
        accent ? "text-[#1e3a5f]" : "text-neutral-700",
        className
      )}
    >
      {children}
    </div>
  );
}

function MiniRole({
  bullets = 2,
  accent = false,
  className,
}: {
  bullets?: number;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mt-[3px]", className)}>
      <div className="flex items-center justify-between gap-[3px]">
        <MiniBar
          className={cn(
            "h-[2px] w-[42%]",
            accent ? "bg-[#1e3a5f]/60" : "bg-neutral-700/55"
          )}
        />
        <MiniBar className="w-[17%]" />
      </div>
      <MiniBar className="mt-[1.5px] w-[30%]" />
      <div className="mt-[2px] space-y-[1.5px]">
        {Array.from({ length: bullets }).map((_, index) => (
          <div key={index} className="flex items-center gap-[2px]">
            <span
              className={cn(
                "size-[1.5px] shrink-0 rotate-45",
                accent ? "bg-[#1e3a5f]/60" : "bg-neutral-500/50"
              )}
            />
            <MiniBar className={cn("w-full", index > 0 && "w-[82%]")} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AcademicMock() {
  return (
    <div
      className="flex h-full w-full flex-col bg-white p-[9px] text-neutral-800"
      style={{ fontFamily: 'Palatino, "Palatino Linotype", Georgia, serif' }}
    >
      <div className="text-center">
        <div
          className="text-[7px] leading-none font-bold tracking-[0.04em]"
          style={{ fontVariant: "small-caps" }}
        >
          Jitin K
        </div>
        <div className="mt-[2px] text-[2.5px] leading-none text-neutral-500 italic">
          Ph.D. Candidate · Machine Learning
        </div>
        <div className="mt-[3px] flex items-center justify-center gap-[3px]">
          <MiniBar className="w-8" />
          <span className="size-[1px] rounded-full bg-neutral-400" />
          <MiniBar className="w-6" />
          <span className="size-[1px] rounded-full bg-neutral-400" />
          <MiniBar className="w-7" />
        </div>
      </div>

      <div className="mt-[5px] h-px w-full bg-neutral-300" />

      <MiniHeading className="mt-[5px]">Research Interests</MiniHeading>
      <div className="mt-[2px] flex gap-[2px]">
        <MiniBar className="w-[31%]" />
        <MiniBar className="w-[24%]" />
        <MiniBar className="w-[27%]" />
      </div>

      <MiniHeading className="mt-[5px]">Education</MiniHeading>
      <MiniRole bullets={0} />
      <MiniRole bullets={0} className="mt-[2.5px]" />

      <MiniHeading className="mt-[5px]">Publications</MiniHeading>
      <div className="mt-[2px] space-y-[2.5px]">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex items-center gap-[3px]">
            <span className="text-[2px] leading-none text-neutral-500">
              {index + 1}.
            </span>
            <MiniBar className={cn("w-full", index === 1 && "w-[88%]")} />
          </div>
        ))}
      </div>

      <MiniHeading className="mt-[5px]">Teaching Experience</MiniHeading>
      <MiniRole bullets={2} />
      <MiniRole bullets={1} className="mt-[2.5px]" />

      <div className="mt-auto flex justify-center pt-[4px]">
        <MiniBar className="h-px w-[22%]" />
      </div>
    </div>
  );
}

function ClassicMock() {
  return (
    <div
      className="flex h-full w-full flex-col bg-white p-[10px] text-neutral-800"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <div className="text-center">
        <div className="text-[8px] leading-none font-bold tracking-[0.1em] uppercase">
          Jitin K
        </div>
        <div className="mt-[2px] text-[3px] leading-none text-neutral-500 italic">
          Software Engineer
        </div>
        <div className="mt-[4px] h-px w-full bg-neutral-700/70" />
        <div className="mt-[3px] flex items-center justify-center gap-[3px]">
          <MiniBar className="w-7" />
          <span className="size-[1px] rounded-full bg-neutral-400" />
          <MiniBar className="w-8" />
          <span className="size-[1px] rounded-full bg-neutral-400" />
          <MiniBar className="w-6" />
        </div>
      </div>

      <MiniHeading className="mt-[6px] border-b border-neutral-300 pb-[1.5px]">
        Professional Experience
      </MiniHeading>
      <MiniRole bullets={2} />
      <MiniRole bullets={2} className="mt-[4px]" />
      <MiniRole bullets={1} className="mt-[4px]" />

      <MiniHeading className="mt-[6px] border-b border-neutral-300 pb-[1.5px]">
        Education
      </MiniHeading>
      <MiniRole bullets={0} />
      <MiniRole bullets={0} className="mt-[2.5px]" />

      <MiniHeading className="mt-[6px] border-b border-neutral-300 pb-[1.5px]">
        Technical Skills
      </MiniHeading>
      <div className="mt-[2px] space-y-[2px]">
        <MiniBar className="w-full" />
        <MiniBar className="w-[86%]" />
        <MiniBar className="w-[68%]" />
      </div>

      <div className="mt-auto flex justify-center pt-[4px]">
        <MiniBar className="h-px w-[18%]" />
      </div>
    </div>
  );
}

function CompactMock() {
  return (
    <div
      className="flex h-full w-full flex-col bg-white p-[9px] text-neutral-800"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="flex items-start justify-between gap-[6px]">
        <div>
          <div className="text-[6.5px] leading-none font-bold">
            Jitin K
          </div>
          <div className="mt-[2px] text-[2.5px] leading-none text-neutral-500 italic">
            Backend Engineer
          </div>
        </div>
        <div className="flex flex-col items-end gap-[1.5px] pt-[1px]">
          <MiniBar className="w-10" />
          <MiniBar className="w-8" />
          <MiniBar className="w-9" />
        </div>
      </div>

      <div className="mt-[4px] h-px w-full bg-neutral-300" />

      <div className="mt-[4px] grid flex-1 grid-cols-[1.55fr_1fr] gap-[7px]">
        <div>
          <MiniHeading>Experience</MiniHeading>
          <MiniRole bullets={2} />
          <MiniRole bullets={2} className="mt-[3px]" />
          <MiniRole bullets={1} className="mt-[3px]" />

          <MiniHeading className="mt-[5px]">Projects</MiniHeading>
          <MiniRole bullets={1} />
          <MiniRole bullets={1} className="mt-[3px]" />

          <MiniHeading className="mt-[5px]">Achievements</MiniHeading>
          <MiniLines widths={["w-full", "w-[84%]"]} className="mt-[2px]" />
        </div>

        <div className="border-l border-neutral-200 pl-[6px]">
          <MiniHeading>Skills</MiniHeading>
          <MiniLines
            widths={["w-8 bg-neutral-700/45", "w-full", "w-[86%]", "w-full"]}
            className="mt-[2px]"
          />
          <MiniLines
            widths={["w-7 bg-neutral-700/45", "w-full", "w-[78%]"]}
            className="mt-[3px]"
          />
          <MiniLines
            widths={["w-6 bg-neutral-700/45", "w-[92%]"]}
            className="mt-[3px]"
          />

          <MiniHeading className="mt-[5px]">Education</MiniHeading>
          <MiniRole bullets={0} />
          <MiniRole bullets={0} className="mt-[3px]" />

          <MiniHeading className="mt-[5px]">Certifications</MiniHeading>
          <MiniLines widths={["w-full", "w-[76%]"]} className="mt-[2px]" />
        </div>
      </div>
    </div>
  );
}

function EngineeringMock() {
  return (
    <div
      className="flex h-full w-full flex-col bg-white p-[9px] text-neutral-800"
      style={{
        fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="flex items-start justify-between gap-[5px] border-b-2 border-[#1e3a5f] pb-[4px]">
        <div className="min-w-0">
          <div className="text-[7px] leading-none font-bold text-[#1e3a5f]">
            Jitin K
          </div>
          <div className="mt-[2px] text-[3px] leading-none text-[#1e3a5f] italic">
            Backend Engineer
          </div>
          <div className="mt-[3px] flex flex-wrap items-center gap-[3px]">
            <MiniBar className="w-8" />
            <span className="size-[1px] rounded-full bg-neutral-400" />
            <MiniBar className="w-6" />
            <span className="size-[1px] rounded-full bg-neutral-400" />
            <MiniBar className="w-7" />
          </div>
        </div>
        <img
          src={MOCK_PHOTO}
          alt=""
          className="h-[18px] w-4 shrink-0 rounded-[1px] border border-neutral-300 object-cover"
        />
      </div>

      <MiniHeading className="mt-[5px]" accent>
        Professional Summary
      </MiniHeading>
      <MiniLines
        widths={["w-full", "w-[92%]"]}
        className="mt-[2px]"
        barClassName="bg-neutral-500/20"
      />

      <MiniHeading className="mt-[5px]" accent>
        Technical Skills
      </MiniHeading>
      <div className="mt-[2px] grid grid-cols-2 gap-x-[6px] gap-y-[2.5px]">
        {[0, 1, 2, 3].map((index) => (
          <div key={index}>
            <MiniBar className="w-[42%] bg-[#1e3a5f]/45" />
            <MiniBar className="mt-[1.5px] w-full" />
          </div>
        ))}
      </div>

      <MiniHeading className="mt-[5px]" accent>
        Work Experience
      </MiniHeading>
      <MiniRole bullets={2} accent />
      <MiniRole bullets={2} accent className="mt-[3px]" />

      <MiniHeading className="mt-[5px]" accent>
        Projects
      </MiniHeading>
      <MiniRole bullets={2} accent />
    </div>
  );
}

function TemplateMock({ id }: { id: string }) {
  switch (id) {
    case "academic":
      return <AcademicMock />;
    case "classic":
      return <ClassicMock />;
    case "compact":
      return <CompactMock />;
    case "engineering":
      return <EngineeringMock />;
    default:
      return <ClassicMock />;
  }
}

export function MultipleTemplatesVisual() {
  const reduce = useIsMotionDisabled();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.25 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || !isInView) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % CAROUSEL_TEMPLATES.length);
    }, ROTATE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [isInView, reduce]);

  const activeConfig = CAROUSEL_TEMPLATES[active];

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      inert
      className="pointer-events-none relative flex h-full w-full select-none flex-col items-center justify-center gap-1.5 overflow-hidden"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.035] blur-2xl" />

      <div
        className="relative"
        style={{
          width: SHEET_WIDTH,
          height: STACK_HEIGHT,
          perspective: 900,
        }}
      >
        {CAROUSEL_TEMPLATES.map((config, index) => {
          const slot =
            (index - active + CAROUSEL_TEMPLATES.length) %
            CAROUSEL_TEMPLATES.length;
          const position = SLOTS[slot];

          return (
            <m.div
              key={config.id}
              className="absolute top-0 left-0 overflow-hidden rounded-[5px] bg-white shadow-[0_16px_35px_-16px_rgba(0,0,0,0.45)] ring-1 ring-black/10"
              style={
                {
                  width: SHEET_WIDTH,
                  height: SHEET_HEIGHT,
                  zIndex: position.zIndex,
                  transformStyle: "preserve-3d",
                } satisfies CSSProperties
              }
              animate={{
                x: position.x,
                y: position.y,
                rotate: position.rotate,
                rotateY: position.rotateY,
                scale: position.scale,
                opacity: position.opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 190,
                damping: 26,
                mass: 0.9,
                opacity: { duration: 0.4, ease: "easeOut" },
              }}
            >
              <TemplateMock id={config.id} />
            </m.div>
          );
        })}
      </div>

      <div className="flex h-5 items-center gap-2 rounded-full border border-border/60 bg-background/80 px-2.5 shadow-sm backdrop-blur-sm">
        <span className="relative block h-3 w-[104px] overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <m.span
              key={activeConfig.id}
              className="absolute inset-0 truncate text-[9px] leading-3 font-medium tracking-tight text-muted-foreground"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {activeConfig.name}
            </m.span>
          </AnimatePresence>
        </span>

        <span className="flex items-center gap-1">
          {CAROUSEL_TEMPLATES.map((config, index) => (
            <m.span
              key={config.id}
              className={cn(
                "h-1 rounded-full",
                index === active ? "bg-primary" : "bg-foreground/20"
              )}
              animate={{ width: index === active ? 12 : 4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
