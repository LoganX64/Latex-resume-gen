import { useMemo, type ElementType, type ReactNode } from "react";
import { m } from "framer-motion";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";
import { DURATION, EASE_OUT } from "@/lib/motion";

type HoverCardProps = {
  children: ReactNode;
  className?: string;
  lift?: number;
  scale?: number;
  as?: ElementType;
};

export function HoverCard({
  children,
  className,
  lift = 4,
  scale = 1.01,
  as = "div",
}: HoverCardProps) {
  const reduce = useIsMotionDisabled();
  const MotionTag = useMemo(() => m(as), [as]);
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <MotionTag
      className={className}
      whileHover={{
        y: -lift,
        scale,
        transition: { duration: DURATION.fast, ease: EASE_OUT },
      }}
      whileTap={{
        scale: scale - 0.01,
        transition: { duration: DURATION.fast, ease: EASE_OUT },
      }}
    >
      {children}
    </MotionTag>
  );
}
