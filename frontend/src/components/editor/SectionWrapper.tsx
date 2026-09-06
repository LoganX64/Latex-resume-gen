import { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";
import { faEye, faEyeSlash, faGripVertical, faChevronDown } from "@/lib/icons";
import { useResumeStore } from "@/stores/resume-store";
import type { SectionVisibility } from "@/types/resume";
import { m } from "framer-motion";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { SectionAnimationProvider } from "./SectionAnimationContext";

interface SectionWrapperProps {
  id: string;
  sectionType: keyof SectionVisibility;
  label: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  children: ReactNode;
}

export function SectionWrapper({
  id,
  sectionType,
  label,
  collapsed,
  onToggleCollapse,
  children,
}: SectionWrapperProps) {
  const toggleSectionVisibility = useResumeStore(
    (s) => s.toggleSectionVisibility,
  );
  const sectionVisibility = useResumeStore((s) => s.sectionVisibility);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging
      ? "none"
      : "transform 560ms cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const sectionTypeKey = sectionType;
  const isVisible = sectionVisibility[sectionTypeKey] ?? true;

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "z-50" : ""}>
      <Card className="relative gap-0 bg-background/60 backdrop-blur-sm border border-border/60 hover:border-primary/40 shadow-sm overflow-hidden py-0">
        <CardHeader className="py-2.5 px-3">
          <div className="flex items-center gap-2">
            <button
              aria-label={`Drag to reorder ${label}`}
              className="cursor-grab active:cursor-grabbing text-rose-500 hover:text-rose-500/80 transition-colors touch-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              {...attributes}
              {...listeners}
            >
              <Icon
                icon={faGripVertical}
                className="h-4 w-4 lg:h-4 lg:w-4"
                aria-hidden="true"
              />
            </button>
            <CardTitle className="text-sm sm:text-base font-semibold flex-1 text-foreground">
              {label}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => toggleSectionVisibility(sectionTypeKey)}
              aria-label={
                isVisible ? `Hide ${label} section` : `Show ${label} section`
              }
            >
              {isVisible ? (
                <Icon
                  icon={faEye}
                  className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-primary"
                />
              ) : (
                <Icon
                  icon={faEyeSlash}
                  className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-muted-foreground/60"
                />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onToggleCollapse}
              aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
              className="relative"
            >
              <m.div
                animate={{ rotate: collapsed ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Icon
                  icon={faChevronDown}
                  className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-muted-foreground"
                />
              </m.div>
            </Button>
          </div>
        </CardHeader>
        <m.div
          initial={false}
          animate={{
            height: collapsed ? 0 : "auto",
          }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
          style={{ overflow: "hidden" }}
        >
          <CardContent className="px-3 pb-3 pt-1">
            <SectionAnimationProvider value={{ collapsed }}>
              {children}
            </SectionAnimationProvider>
          </CardContent>
        </m.div>
      </Card>
    </div>
  );
}
