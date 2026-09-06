import { forwardRef, type ReactNode } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { useSectionAnimation } from "./SectionAnimationContext";

interface AnimatedSectionChildProps {
  index: number;
  className?: string;
  variant?: "card" | "plain";
  children: ReactNode;
}

export const AnimatedSectionChild = forwardRef<
  HTMLDivElement,
  AnimatedSectionChildProps & { style?: React.CSSProperties }
>(function AnimatedSectionChild({ index, className, variant = "card", children, style }, ref) {
  const { collapsed } = useSectionAnimation();

  return (
    <m.div
      ref={ref}
      style={style}
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: collapsed ? 0 : 1,
        y: collapsed ? 12 : 0,
      }}
      transition={{
        opacity: { duration: DURATION.fast },
        y: { duration: DURATION.slow, ease: EASE_OUT, delay: collapsed ? 0 : index * 0.06 },
      }}
      className={cn(
        variant === "card" && "flex flex-col gap-(--card-spacing) overflow-hidden rounded-lg bg-card text-xs/relaxed text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)]",
        className,
      )}
    >
      {children}
    </m.div>
  );
});
