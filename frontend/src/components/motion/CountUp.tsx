import { useEffect } from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from "framer-motion";

type CountUpProps = {
  to: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
};

export function CountUp({ to, duration = 1.2, format, className }: CountUpProps) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => {
    const n = Math.round(latest);
    return format ? format(n) : n.toLocaleString();
  });

  useEffect(() => {
    if (reduce) {
      mv.set(to);
      return;
    }
    const controls = animate(mv, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [to, duration, reduce, mv]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
