import type { ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type ShineButtonProps = {
  children: ReactNode;
  className?: string;
  shineColor?: string;
  duration?: number;
  delay?: number;
  loop?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export function ShineButton({
  children,
  className = "",
  shineColor = "rgba(255, 255, 255, 0.4)",
  duration = 2.5,
  delay = 0,
  loop = true,
  variant = "default",
  size = "default",
  onClick,
  type = "button",
}: ShineButtonProps) {
  const reduce = useReducedMotion();

  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      {children}
      {!reduce && (
        <m.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${shineColor} 50%, transparent 60%)`,
          }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration,
            delay,
            repeat: loop ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      )}
    </Button>
  );
}
