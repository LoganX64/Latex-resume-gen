import type { ElementType, ReactNode } from "react";
import { AnimatedGroup } from "@/components/motion/AnimatedGroup";
import { staggerContainer, staggerItem } from "@/lib/motion";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  amount?: number;
  alwaysAnimate?: boolean;
};

export function Stagger({
  children,
  className,
  as = "div",
  amount = 0.1,
  alwaysAnimate = false,
}: StaggerProps) {
  return (
    <AnimatedGroup
      className={className}
      as={as}
      asChild="div"
      amount={amount}
      triggerOn={alwaysAnimate ? "mount" : "inView"}
      variants={{ container: staggerContainer, item: staggerItem }}
    >
      {children}
    </AnimatedGroup>
  );
}
