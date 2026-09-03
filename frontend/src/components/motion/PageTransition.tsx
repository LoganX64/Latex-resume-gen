import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { m, useReducedMotion } from "framer-motion";
import { pageEnter } from "@/lib/motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className="contents">{children}</div>;
  }
  return (
    <m.div
      key={location.pathname}
      variants={pageEnter}
      initial="hidden"
      animate="show"
      exit="exit"
      className="contents"
    >
      {children}
    </m.div>
  );
}
