import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { m, useReducedMotion } from "framer-motion";
import { pageEnter } from "@/lib/motion";

export function PageTransition({
  children,
  disableOnMobile = false,
}: {
  children: ReactNode;
  disableOnMobile?: boolean;
}) {
  const location = useLocation();
  const reduce = useReducedMotion();
  const isMobile =
    disableOnMobile &&
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  if (reduce || isMobile) {
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
