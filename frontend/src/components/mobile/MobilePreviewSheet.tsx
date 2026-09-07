import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { faExpand, faMagnifyingGlassPlus, faMagnifyingGlassMinus, faXmark } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { useResumeStore } from "@/stores/resume-store";
import { getAllTemplateConfigs } from "@/templates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ZoomLevel } from "@/types/resume";

const zoomLevels: ZoomLevel[] = [50, 75, 100, 125, 150];

interface MobilePreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobilePreviewSheet({
  open,
  onOpenChange,
}: MobilePreviewSheetProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState<ZoomLevel>("fit");
  const templateId = useResumeStore((s) => s.templateId);
  const setTemplateId = useResumeStore((s) => s.setTemplateId);
  const templateConfigs = getAllTemplateConfigs();

  useEffect(() => {
    if (!open) {
      setZoom("fit");
      setFullscreen(false);
    }
  }, [open]);

  const cycleZoom = (direction: "in" | "out") => {
    if (direction === "in") {
      if (zoom === "fit") {
        setZoom(100);
      } else {
        const currentIdx = zoomLevels.indexOf(zoom);
        if (currentIdx < zoomLevels.length - 1) {
          setZoom(zoomLevels[currentIdx + 1]);
        }
      }
    } else {
      if (zoom === "fit") return;
      const currentIdx = zoomLevels.indexOf(zoom);
      if (currentIdx > 0) {
        setZoom(zoomLevels[currentIdx - 1]);
      } else {
        setZoom("fit");
      }
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="p-0 flex flex-col gap-0 overflow-hidden"
          style={{ height: "90dvh" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <SheetTitle className="text-sm">Live Preview</SheetTitle>
            <div className="flex items-center gap-2">
              <Select
                value={templateId}
                onValueChange={(v) => v && setTemplateId(v)}
              >
                <SelectTrigger
                  className="text-xs h-8 px-2 py-1 gap-1 cursor-pointer w-36"
                  aria-label="Select resume template"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="min-w-36 text-xs">
                  {templateConfigs.map((tc) => (
                    <SelectItem
                      key={tc.id}
                      value={tc.id}
                      className="py-1 pr-6 pl-1.5 text-xs"
                    >
                      {tc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setFullscreen(true)}
                aria-label="Fullscreen preview"
              >
                <Icon icon={faExpand} className="h-4 w-4" />
              </Button>
              <SheetClose
                className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted"
                aria-label="Close preview"
              >
                <Icon icon={faXmark} className="h-4 w-4" />
              </SheetClose>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResumePreview
              hideToolbar
              zoom={zoom}
              onZoomChange={setZoom}
              fullscreen={fullscreen}
              onToggleFullscreen={() => {
                setFullscreen(false);
                setZoom("fit");
              }}
            />
          </div>
          <div className="shrink-0 border-t border-border p-3">
            <Button
              variant="ghost"
              className="w-full justify-center gap-2"
              onClick={() => onOpenChange(false)}
            >
              <Icon icon={faXmark} className="h-4 w-4" />
              Close Preview
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {fullscreen && (
        <div
          className="fixed inset-0 z-200 bg-gray-900 overflow-auto"
          style={{ overscrollBehavior: "contain" }}
        >
          <ResumePreview
            hideToolbar
            zoom={zoom}
            onZoomChange={setZoom}
            fullscreen={fullscreen}
            onToggleFullscreen={() => setFullscreen(false)}
          />
          <div className="fixed bottom-6 right-6 z-200 flex flex-col gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-background/90 backdrop-blur"
              onClick={() => cycleZoom("in")}
              disabled={zoom === 150}
              aria-label="Zoom in"
            >
              <Icon icon={faMagnifyingGlassPlus} className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-background/90 backdrop-blur"
              onClick={() => cycleZoom("out")}
              disabled={zoom === "fit"}
              aria-label="Zoom out"
            >
              <Icon icon={faMagnifyingGlassMinus} className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg bg-background/90 backdrop-blur"
              onClick={() => setZoom("fit")}
              aria-label="Fit to screen"
            >
              <Icon icon={faExpand} className="h-5 w-5" />
            </Button>
          </div>
          <button
            onClick={() => {
              setFullscreen(false);
              setZoom("fit");
            }}
            className="fixed top-4 right-4 z-200 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors shadow-lg"
            aria-label="Close fullscreen"
          >
            <Icon icon={faXmark} className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
}
