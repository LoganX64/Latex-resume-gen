import type { Transition, Variants } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export const DURATION = {
  fast: 0.18,
  base: 0.32,
  slow: 0.55,
} as const;

export const EASE_OUT: Transition["ease"] = [0.16, 1, 0.3, 1];
export const EASE_IN: Transition["ease"] = [0.7, 0, 0.84, 0];

export const STAGGER = {
  children: 0.06,
  delay: 0.08,
} as const;

export const VIEWPORT = {
  once: true,
  amount: 0.15,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: STAGGER.children,
      delayChildren: STAGGER.delay,
    },
  },
};

export const staggerItem: Variants = fadeUp;

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: DURATION.fast, ease: EASE_IN },
  },
};

export const splitPaneLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const splitPaneRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT, delay: 0.08 },
  },
};

export function useMotionVariants(variants: Variants): Variants {
  const reduce = useReducedMotion();
  if (!reduce) return variants;
  return Object.fromEntries(
    Object.entries(variants).map(([key, value]) => {
      if (typeof value !== "object" || value === null) return [key, value];
      const v = value as { opacity?: number; y?: number; x?: number; scale?: number; transition?: Transition };
      return [
        key,
        {
          opacity: v.opacity ?? 1,
          transition: { duration: 0 },
        },
      ];
    }),
  ) as Variants;
}
