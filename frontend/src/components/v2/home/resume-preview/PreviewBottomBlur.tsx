import { cn } from "@/lib/utils";

const BLUR_LAYERS = [
  { blur: 0.3, from: 0, to: 25 },
  { blur: 0.6, from: 25, to: 50 },
  { blur: 0.9, from: 50, to: 75 },
  { blur: 1.3, from: 75, to: 100 },
];

export function PreviewBottomBlur({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-20",
        className
      )}
    >
      {BLUR_LAYERS.map((layer) => {
        const mask = `linear-gradient(to bottom, transparent ${layer.from}%, black ${layer.to}%, black 100%)`;

        return (
          <div
            key={layer.blur}
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${layer.blur}px)`,
              WebkitBackdropFilter: `blur(${layer.blur}px)`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
