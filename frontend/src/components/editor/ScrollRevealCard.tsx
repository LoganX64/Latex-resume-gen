import type { ReactNode } from "react";
import { m } from "framer-motion";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { editorCard } from "@/lib/motion";

export function ScrollRevealCard({ children }: { children: ReactNode }) {
  const reduce = useIsMotionDisabled();
  const { ref, isInView } = useScrollReveal();

  if (reduce) return <>{children}</>;

  return (
    <m.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={editorCard}
    >
      {children}
    </m.div>
  );
}
