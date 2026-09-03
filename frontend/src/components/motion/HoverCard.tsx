import type { ElementType, ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
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
  const reduce = useReducedMotion();
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const MotionTag = m(as);
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
