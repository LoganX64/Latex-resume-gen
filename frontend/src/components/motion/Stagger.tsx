import type { ElementType, ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem, VIEWPORT } from "@/lib/motion";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  amount?: number;
};

export function Stagger({ children, className, as = "div", amount = 0.1 }: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const MotionTag = m(as);
  return (
    <MotionTag
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ ...VIEWPORT, amount }}
    >
      {children}
    </MotionTag>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
};

export function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const MotionTag = m(as);
  return (
    <MotionTag className={className} variants={staggerItem}>
      {children}
    </MotionTag>
  );
}
