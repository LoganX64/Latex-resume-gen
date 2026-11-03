export const CLEAR_RESUME_BUTTON_ID = "clear-resume-button";
export const CLEAR_RESUME_GUIDE_STORAGE_KEY =
  "latex-resume-clear-resume-guide-seen";

let seenInMemory = false;

export function hasSeenClearResumeGuide(): boolean {
  if (seenInMemory) return true;

  try {
    return localStorage.getItem(CLEAR_RESUME_GUIDE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markClearResumeGuideSeen(): void {
  seenInMemory = true;

  try {
    localStorage.setItem(CLEAR_RESUME_GUIDE_STORAGE_KEY, "1");
  } catch {
    // Storage can be unavailable in private mode. The in-memory flag still
    // prevents the guide from repeating during the current session.
  }
}
