import type { ElementType, ReactNode } from "react";
import { m } from "framer-motion";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";
import { VIEWPORT, DURATION, EASE_OUT } from "@/lib/motion";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
  alwaysAnimate?: boolean;
};

export function FadeIn({ children, delay = 0, y = 12, className, as = "div", alwaysAnimate = false }: FadeInProps) {
  const reduce = useIsMotionDisabled();
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const MotionTag = m(as);
  if (alwaysAnimate) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.base, ease: EASE_OUT, delay }}
      >
        {children}
      </MotionTag>
    );
  }
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
