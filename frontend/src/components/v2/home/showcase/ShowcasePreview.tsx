import { memo, useEffect, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Icon } from "@/components/Icon";
import { buttonVariants } from "@/components/ui/button";
import {
  faCheck,
  faChevronDown,
  faDownload,
  faExpand,
  faFileLines,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
} from "@/lib/icons";
import {
  getAllTemplateConfigs,
  getTemplateConfig,
  loadTemplate,
  type Template,
} from "@/templates";
import type { Margins } from "@/types/resume";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  SHOWCASE_HEIGHT,
  SHOWCASE_SIDEBAR_WIDTH,
  SHOWCASE_WIDTH,
  showcaseResume,
  showcaseSections,
} from "./showcase-data";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.7795275591;
const A4_WIDTH_PX = Math.round(A4_WIDTH_MM * MM_TO_PX);
const A4_HEIGHT_PX = Math.round(A4_HEIGHT_MM * MM_TO_PX);
const DEFAULT_MARGINS: Margins = {
  top: 7.62,
  bottom: 7.62,
  left: 7.62,
  right: 7.62,
};

const PREVIEW_WIDTH = (SHOWCASE_WIDTH - SHOWCASE_SIDEBAR_WIDTH) / 2;
const PREVIEW_HEIGHT = SHOWCASE_HEIGHT - 8;
const PREVIEW_TOOLBAR_HEIGHT = 56;
const PREVIEW_PADDING = 32;
const FIT_SCALE = Math.min(
  (PREVIEW_WIDTH - PREVIEW_PADDING) / A4_WIDTH_PX,
  (PREVIEW_HEIGHT - PREVIEW_TOOLBAR_HEIGHT - PREVIEW_PADDING) / A4_HEIGHT_PX
);

const controlClass =
  "border border-dashed border-border/70 text-foreground";

const TEMPLATE_OPTIONS = getAllTemplateConfigs();

type LoadedTemplate = {
  id: string;
  template: Template;
};

export const ShowcasePreview = memo(function ShowcasePreview({
  templateId,
  menuOpen,
  hoveredTemplateId,
}: {
  templateId: string;
  menuOpen: boolean;
  hoveredTemplateId: string | null;
}) {
  const [loaded, setLoaded] = useState<LoadedTemplate | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadTemplate(templateId)
      .then((template) => {
        if (!cancelled && template) {
          setLoaded({ id: templateId, template });
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(null);
      });

    return () => {
      cancelled = true;
    };
  }, [templateId]);

  const displayedId = loaded?.id ?? templateId;
  const displayedConfig = getTemplateConfig(displayedId);
  const margins = useMemo(
    () => displayedConfig?.margins ?? DEFAULT_MARGINS,
    [displayedConfig],
  );
  const currentName = getTemplateConfig(templateId)?.name ?? templateId;
  const TemplatePreview = loaded?.template.Preview;

  return (
    <section className="flex h-[calc(100%-8px)] min-h-0 min-w-0 flex-col overflow-hidden rounded-l-xl border-l border-border bg-muted/20 [contain:layout_paint]">
      <div className="flex h-14 shrink-0 items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-sm font-semibold whitespace-nowrap text-foreground">
            A4 Page Preview
          </span>
          <span className="shrink-0 text-xs whitespace-nowrap text-muted-foreground italic">
            (approximate)
          </span>

          <div className="relative">
            <span
              data-showcase-target="template-select"
              className={cn(
                "flex h-9 min-w-[120px] cursor-default items-center justify-between gap-1 rounded-md border bg-input/20 px-2 py-1 text-sm transition-colors",
                menuOpen
                  ? "border-ring ring-2 ring-ring/30"
                  : "border-input",
              )}
            >
              <span className="relative block h-4 min-w-0 flex-1 overflow-hidden text-left">
                <AnimatePresence initial={false} mode="wait">
                  <m.span
                    key={currentName}
                    className="absolute inset-0 truncate"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: EASE_OUT }}
                  >
                    {currentName}
                  </m.span>
                </AnimatePresence>
              </span>
              <m.span
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
              >
                <Icon
                  icon={faChevronDown}
                  className="size-3.5 shrink-0 text-muted-foreground"
                />
              </m.span>
            </span>

            <AnimatePresence>
              {menuOpen && (
                <m.div
                  key="showcase-template-menu"
                  className="absolute top-[calc(100%+4px)] left-0 z-40 w-56 origin-top overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -3, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                >
                  {TEMPLATE_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      data-showcase-option={option.id}
                      className={cn(
                        "relative flex min-h-7 items-center rounded-md px-2 py-1 pr-8 text-xs leading-none",
                        hoveredTemplateId === option.id &&
                          "bg-accent text-accent-foreground",
                        option.id === templateId && "font-medium",
                      )}
                    >
                      <span className="truncate">{option.name}</span>
                      {option.id === templateId && (
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
          </div>

          <span
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-xs" }),
              "h-8 w-8",
              controlClass
            )}
          >
            <Icon icon={faFileLines} className="h-4 w-4" />
          </span>
          <span
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-xs" }),
              "h-8 w-8",
              controlClass
            )}
          >
            <Icon icon={faDownload} className="h-4 w-4" />
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          <span
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-xs" }),
              "h-8 w-8",
              controlClass
            )}
          >
            <Icon icon={faMagnifyingGlassMinus} className="h-3 w-3" />
          </span>
          <span className="flex h-8 w-16 shrink-0 items-center justify-between gap-1 rounded-md border border-dashed border-border/70 px-1.5 py-0.5 text-[10px] text-foreground">
            <span>Fit</span>
            <Icon
              icon={faChevronDown}
              className="size-3 shrink-0 text-muted-foreground"
            />
          </span>
          <span
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-xs" }),
              "h-8 w-8",
              controlClass
            )}
          >
            <Icon icon={faMagnifyingGlassPlus} className="h-3 w-3" />
          </span>
          <span
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-xs" }),
              "h-8 w-8",
              controlClass
            )}
          >
            <Icon icon={faExpand} className="h-3 w-3" />
          </span>
        </div>
      </div>

      <div className="editor-scroll-v2 min-h-0 flex-1 overflow-hidden p-4">
        <div
          className="mx-auto"
          style={{
            width: A4_WIDTH_PX * FIT_SCALE,
            height: A4_HEIGHT_PX * FIT_SCALE,
          }}
        >
          <div
            style={{
              width: A4_WIDTH_PX,
              height: A4_HEIGHT_PX,
              transform: `scale(${FIT_SCALE})`,
              transformOrigin: "top left",
            }}
          >
            <div
              className="relative overflow-hidden rounded-3xl bg-white text-black [contain:layout_paint]"
              style={{
                width: A4_WIDTH_PX,
                height: A4_HEIGHT_PX,
                boxShadow:
                  "0 15px 35px -10px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.08)",
              }}
            >
              <AnimatePresence initial={false} mode="wait">
                {loaded && TemplatePreview && (
                  <m.div
                    key={displayedId}
                    className="absolute overflow-hidden"
                    style={{
                      top: margins.top * MM_TO_PX,
                      left: margins.left * MM_TO_PX,
                      right: margins.right * MM_TO_PX,
                      bottom: margins.bottom * MM_TO_PX,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                  >
                    <TemplatePreview
                      resume={showcaseResume}
                      sections={showcaseSections}
                    />
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
