import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getTemplateConfig, loadTemplate, type Template } from "@/templates";
import { cn } from "@/lib/utils";
import type { Margins, ResumeVersion } from "@/types/resume";

const A4_WIDTH_PX = 794;
const MM_TO_PX = 3.7795275591;
const DEFAULT_MARGINS: Margins = {
  top: 7.62,
  bottom: 7.62,
  left: 7.62,
  right: 7.62,
};

export function ResumeCardPreview({
  version,
  className,
}: {
  version: ResumeVersion;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [template, setTemplate] = useState<Template | null>(null);

  const config = getTemplateConfig(version.templateId);
  const margins = config?.margins ?? DEFAULT_MARGINS;

  const visibleSections = useMemo(
    () =>
      version.sectionOrder.filter((section) => {
        if (section.type === "personalInfo") return true;
        return version.sectionVisibility[section.type];
      }),
    [version.sectionOrder, version.sectionVisibility]
  );

  useEffect(() => {
    let cancelled = false;
    setTemplate(null);

    loadTemplate(version.templateId)
      .then((loaded) => {
        if (!cancelled) setTemplate(loaded ?? null);
      })
      .catch(() => {
        if (!cancelled) setTemplate(null);
      });

    return () => {
      cancelled = true;
    };
  }, [version.templateId]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) setScale(width / A4_WIDTH_PX);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden bg-white",
        className
      )}
    >
      {template && scale > 0 && (
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{
            width: A4_WIDTH_PX,
            paddingTop: margins.top * MM_TO_PX,
            paddingLeft: margins.left * MM_TO_PX,
            paddingRight: margins.right * MM_TO_PX,
            boxSizing: "border-box",
            transform: `scale(${scale})`,
          }}
        >
          <template.Preview
            resume={version.resume}
            sections={visibleSections}
          />
        </div>
      )}
    </div>
  );
}
