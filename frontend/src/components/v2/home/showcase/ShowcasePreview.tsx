import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/Icon";
import { buttonVariants } from "@/components/ui/button";
import {
  faChevronDown,
  faDownload,
  faExpand,
  faFileLines,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
} from "@/lib/icons";
import { getTemplateConfig, loadTemplate, type Template } from "@/templates";
import type { Margins } from "@/types/resume";
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

export function ShowcasePreview() {
  const [template, setTemplate] = useState<Template | null>(null);
  const config = getTemplateConfig("engineering");
  const margins = useMemo(() => config?.margins ?? DEFAULT_MARGINS, [config]);

  useEffect(() => {
    let cancelled = false;
    loadTemplate("engineering")
      .then((loaded) => {
        if (!cancelled) setTemplate(loaded ?? null);
      })
      .catch(() => {
        if (!cancelled) setTemplate(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="flex h-[calc(100%-8px)] min-h-0 min-w-0 flex-col overflow-hidden rounded-l-xl border-l border-border bg-muted/20">
      <div className="flex h-14 shrink-0 items-center justify-between px-4 backdrop-blur">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-sm font-semibold whitespace-nowrap text-foreground">
            A4 Page Preview
          </span>
          <span className="shrink-0 text-xs whitespace-nowrap text-muted-foreground italic">
            (approximate)
          </span>
          <span className="flex h-9 min-w-[120px] cursor-default items-center justify-between gap-1 rounded-md border border-input bg-input/20 px-2 py-1 text-sm">
            <span className="truncate">Engineering Resume</span>
            <Icon
              icon={faChevronDown}
              className="size-3.5 shrink-0 text-muted-foreground"
            />
          </span>
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
              className="relative overflow-hidden rounded-3xl bg-white text-black"
              style={{
                width: A4_WIDTH_PX,
                height: A4_HEIGHT_PX,
                boxShadow:
                  "0 15px 35px -10px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: margins.top * MM_TO_PX,
                  left: margins.left * MM_TO_PX,
                  right: margins.right * MM_TO_PX,
                  bottom: margins.bottom * MM_TO_PX,
                  overflow: "hidden",
                }}
              >
                {template ? (
                  <template.Preview
                    resume={showcaseResume}
                    sections={showcaseSections}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
