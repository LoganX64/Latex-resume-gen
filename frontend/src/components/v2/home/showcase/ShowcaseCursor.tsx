import { m } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

export type ShowcaseCursorState = {
  x: number;
  y: number;
  visible: boolean;
  pressed: boolean;
  ripple: number;
};

export const HIDDEN_SHOWCASE_CURSOR: ShowcaseCursorState = {
  x: 660,
  y: 760,
  visible: false,
  pressed: false,
  ripple: 0,
};

export function ShowcaseCursor({
  cursor,
  duration,
}: {
  cursor: ShowcaseCursorState;
  duration: number;
}) {
  return (
    <m.div
      className="pointer-events-none absolute top-0 left-0 z-50"
      initial={false}
      animate={{ x: cursor.x, y: cursor.y, opacity: cursor.visible ? 1 : 0 }}
      transition={{
        x: { duration, ease: EASE_OUT },
        y: { duration, ease: EASE_OUT },
        opacity: { duration: 0.18, ease: "easeOut" },
      }}
    >
      {cursor.ripple > 0 && (
        <m.span
          key={cursor.ripple}
          className="absolute -top-1.5 -left-1.5 size-3 rounded-full border border-background/80 bg-background/30"
          initial={{ scale: 0.2, opacity: 0.55 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      )}
      <m.div
        className="origin-top-left"
        animate={{ scale: cursor.pressed ? 0.86 : 1 }}
        transition={{ duration: 0.1, ease: EASE_OUT }}
      >
        <svg
          viewBox="0 0 14 20"
          className="h-[18px] w-[13px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
          aria-hidden="true"
        >
          <path
            d="M.8.8 12 10.6l-4.8.8 2.5 5-2.1 1-2.5-5.1L.8 16.6Z"
            fill="#fff"
            stroke="#1f2937"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      </m.div>
    </m.div>
  );
}
