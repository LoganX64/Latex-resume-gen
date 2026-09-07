import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useResumeStore } from "@/stores/resume-store";
import { Icon } from "@/components/Icon";
import {
  faXmark,
  faUser,
  faUpload,
  faExpand,
  faMagnifyingGlassMinus,
  faMagnifyingGlassPlus,
} from "@/lib/icons";
import Cropper from "react-easy-crop";
import * as Sentry from "@sentry/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function ProfileImageUpload() {
  const profileImage = useResumeStore(
    (s) => s.resume.personalInfo.profileImage,
  );
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo);
  const removeProfileImage = useResumeStore((s) => s.removeProfileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function onCropComplete(
    _croppedArea: unknown,
    croppedAreaPixels: { x: number; y: number; width: number; height: number },
  ) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  async function getCroppedImg() {
    if (!imageSrc || !croppedAreaPixels) return;

    Sentry.startSpan(
      { name: "Crop Profile Image", op: "image.crop" },
      (span) => {
        span.setAttribute("crop.width", croppedAreaPixels.width);
        span.setAttribute("crop.height", croppedAreaPixels.height);

        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
          const MAX_SIZE = 400;
          const { width, height } = croppedAreaPixels;
          const scale = Math.min(MAX_SIZE / width, MAX_SIZE / height, 1);
          const outputW = Math.round(width * scale);
          const outputH = Math.round(height * scale);

          const canvas = document.createElement("canvas");
          canvas.width = outputW;
          canvas.height = outputH;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            width,
            height,
            0,
            0,
            outputW,
            outputH,
          );
          const croppedImage = canvas.toDataURL("image/jpeg", 0.8);
          span.setAttribute("output.size", croppedImage.length);
          updatePersonalInfo("profileImage", croppedImage);
          setCropDialogOpen(false);
          setImageSrc(null);
        };
      },
    );
  }

  function removeImage() {
    removeProfileImage();
  }

  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div className="relative w-20 h-20">
        <div className="w-full h-full rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              width={80}
              height={80}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon
              icon={faUser}
              className="h-8 w-8 text-muted-foreground/50"
              aria-hidden="true"
            />
          )}
        </div>
        {profileImage && (
          <button
            onClick={removeImage}
            aria-label="Remove profile photo"
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Icon icon={faXmark} className="h-3 w-3" />
          </button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload profile photo"
      />
      <Button
        variant="outline"
        size="sm"
        className="h-10 text-sm sm:h-8 sm:text-xs cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Icon icon={faUpload} className="h-3 w-3 mr-1" aria-hidden="true" />
        Upload Photo
      </Button>

      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="border-b border-border/70 bg-muted/20 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon
                  icon={faExpand}
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </span>
              <div>
                <DialogTitle className="text-sm">
                  Crop Profile Photo
                </DialogTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Position your photo inside the square frame.
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-2.5 bg-background p-3">
            <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              )}
            </div>
            <div className="rounded-lg border border-border/70 bg-muted/20 px-2.5 py-2">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="crop-zoom"
                  className="text-xs font-medium text-foreground"
                >
                  Zoom
                </label>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {zoom.toFixed(1)}x
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  icon={faMagnifyingGlassMinus}
                  className="h-3 w-3 text-muted-foreground"
                  aria-hidden="true"
                />
                <Slider
                  id="crop-zoom"
                  min={1}
                  max={3}
                  step={0.1}
                  value={[zoom]}
                  onValueChange={(value) =>
                    setZoom(Array.isArray(value) ? value[0] : value)
                  }
                  className="flex-1"
                />
                <Icon
                  icon={faMagnifyingGlassPlus}
                  className="h-3 w-3 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="border-t border-border/70 bg-muted/10 px-3 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCropDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={getCroppedImg}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
