import { useCallback, useEffect, useRef, useState } from "react";
import {
  hasSeenClearResumeGuide,
  markClearResumeGuideSeen,
} from "@/lib/clear-resume-guide";

const GUIDE_DELAY_MS = 600;

interface UseClearResumeGuideOptions {
  enabled?: boolean;
  delayMs?: number;
}

export function useClearResumeGuide({
  enabled = true,
  delayMs = GUIDE_DELAY_MS,
}: UseClearResumeGuideOptions = {}) {
  const [open, setOpen] = useState(false);
  const dismissedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setOpen(false);
      return;
    }

    if (hasSeenClearResumeGuide()) return;

    const timer = window.setTimeout(() => {
      if (!dismissedRef.current && !hasSeenClearResumeGuide()) {
        setOpen(true);
      }
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [enabled, delayMs]);

  const close = useCallback(() => {
    dismissedRef.current = true;
    setOpen(false);
  }, []);

  const acknowledge = useCallback(() => {
    close();
    markClearResumeGuideSeen();
  }, [close]);

  return { open: enabled && open, close, acknowledge };
}
