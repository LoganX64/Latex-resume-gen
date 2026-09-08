import { useEffect, useRef, useState } from "react";
import { useIsMotionDisabled } from "./useIsMotionDisabled";

interface UseScrollRevealOptions {
  once?: boolean;
}

export function useScrollReveal({
  once = true,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const reduce = useIsMotionDisabled();
  const [isInView, setIsInView] = useState(reduce);

  useEffect(() => {
    if (reduce || !ref.current) return;
    const el = ref.current;

    const scrollContainer = document.getElementById("editor-main");
    if (!scrollContainer) return;

    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      const isAlreadyVisible =
        rect.top < containerRect.bottom && rect.bottom > containerRect.top;

      if (isAlreadyVisible) {
        setIsInView(true);
        if (once) return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setIsInView(false);
          }
        },
        { root: scrollContainer, threshold: 0, rootMargin: "0px" }
      );

      observer.observe(el);
      observerRef.current = observer;
    });

    return () => observerRef.current?.disconnect();
  }, [reduce, once]);

  return { ref, isInView };
}
