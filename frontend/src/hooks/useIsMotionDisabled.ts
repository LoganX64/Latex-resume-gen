import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "./use-mobile";

/**
 * Returns `true` when motion / animations should be fully disabled.
 *
 * Disabled when EITHER:
 *  - the OS/browser preference is `prefers-reduced-motion: reduce`, OR
 *  - the viewport is at mobile width (< 768 px).
 *
 * Import this hook in motion components instead of calling
 * `useReducedMotion()` directly so that the mobile‑no‑motion rule
 * is enforced in a single place.
 */
export function useIsMotionDisabled(): boolean {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  return !!(prefersReduced || isMobile);
}
