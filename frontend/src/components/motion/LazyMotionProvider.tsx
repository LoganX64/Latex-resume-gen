import type { ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

export function LazyMotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
