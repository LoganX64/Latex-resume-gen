import type { ElementType, ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { VIEWPORT, DURATION, EASE_OUT } from "@/lib/motion";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
};

export function FadeIn({ children, delay = 0, y = 12, className, as = "div" }: FadeInProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const MotionTag = m(as);
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION.base, ease: EASE_OUT, delay }}
    >
      {children}
    </MotionTag>
  );
}
