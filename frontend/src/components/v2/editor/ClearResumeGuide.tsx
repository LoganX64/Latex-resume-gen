import { useEffect, useState } from "react";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/Icon";
import { faTrash } from "@/lib/icons";
import { CLEAR_RESUME_BUTTON_ID } from "@/lib/clear-resume-guide";
import "@/components/v2/editor/clear-resume-guide.css";

interface ClearResumeGuideProps {
  open: boolean;
  onClose: () => void;
  onAcknowledge: () => void;
}

export function ClearResumeGuide({
  open,
  onClose,
  onAcknowledge,
}: ClearResumeGuideProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      setAnchor(null);
      return;
    }

    setAnchor(document.getElementById(CLEAR_RESUME_BUTTON_ID));
  }, [open]);

  useEffect(() => {
    if (!open || !anchor) return;

    anchor.classList.add("clear-resume-guide-target");
    return () => anchor.classList.remove("clear-resume-guide-target");
  }, [open, anchor]);

  if (!open || !anchor) return null;

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <PopoverContent
        anchor={anchor}
        side="bottom"
        align="end"
        sideOffset={10}
        collisionPadding={12}
        className="w-[17rem] gap-2.5 p-3"
      >
        <PopoverArrow />
        <PopoverHeader className="gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
              <Icon icon={faTrash} className="h-3.5 w-3.5" />
            </span>
            <PopoverTitle>Clear the whole resume</PopoverTitle>
          </div>
          <PopoverDescription className="leading-relaxed">
            Use this button to clear all sections at once — no need to clear
            each section manually.
          </PopoverDescription>
        </PopoverHeader>
        <div className="flex justify-end">
          <Button size="xs" onClick={onAcknowledge}>
            Got it
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
