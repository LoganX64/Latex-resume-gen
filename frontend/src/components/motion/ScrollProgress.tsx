import { m, useScroll, useSpring } from "framer-motion";
import { useIsMotionDisabled } from "@/hooks/useIsMotionDisabled";

export function ScrollProgress() {
  const reduce = useIsMotionDisabled();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduce) return null;

  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-14 left-0 right-0 z-50 h-0.5 origin-left will-change-transform bg-gradient-to-r from-primary via-rose-400 to-primary"
    />
  );
}
