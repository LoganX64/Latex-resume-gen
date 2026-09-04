import {
  Children,
  useMemo,
  type ComponentType,
  type ElementType,
  type ReactNode,
} from "react";
import { m, useReducedMotion, type Variants } from "framer-motion";

export type PresetType =
  | "fade"
  | "slide"
  | "scale"
  | "blur"
  | "blur-slide"
  | "zoom"
  | "flip"
  | "bounce"
  | "rotate"
  | "swing";

export type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: { container?: Variants; item?: Variants };
  preset?: PresetType;
  as?: ElementType;
  asChild?: ElementType;
  triggerOn?: "mount" | "inView";
  amount?: number;
  once?: boolean;
};

const defaultContainerVariants: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<PresetType, Variants> = {
  fade: {},
  slide: {
    hidden: { y: 20 },
    visible: { y: 0 },
  },
  scale: {
    hidden: { scale: 0.8 },
    visible: { scale: 1 },
  },
  blur: {
    hidden: { filter: "blur(4px)" },
    visible: { filter: "blur(0px)" },
  },
  "blur-slide": {
    hidden: { filter: "blur(4px)", y: 20 },
    visible: { filter: "blur(0px)", y: 0 },
  },
  zoom: {
    hidden: { scale: 0.5 },
    visible: {
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  },
  flip: {
    hidden: { rotateX: -90 },
    visible: {
      rotateX: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  },
  bounce: {
    hidden: { y: -50 },
    visible: {
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  },
  rotate: {
    hidden: { rotate: -180 },
    visible: {
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
  },
  swing: {
    hidden: { rotate: -10 },
    visible: {
      rotate: 0,
      transition: { type: "spring", stiffness: 300, damping: 8 },
    },
  },
};

const addDefaultVariants = (variants: Variants) => ({
  hidden: { ...defaultItemVariants.hidden, ...variants.hidden },
  visible: { ...defaultItemVariants.visible, ...variants.visible },
});

export function AnimatedGroup({
  children,
  className,
  variants,
  preset,
  as = "div",
  asChild = "div",
  triggerOn = "inView",
  amount = 0.15,
  once = true,
}: AnimatedGroupProps) {
  const reduce = useReducedMotion();

  const selected = {
    item: addDefaultVariants(preset ? presetVariants[preset] : {}),
    container: addDefaultVariants(defaultContainerVariants),
  };
  const containerVariants = variants?.container ?? selected.container;
  const itemVariants = variants?.item ?? selected.item;

  const Container = useMemo(
    () => m.create(as as string) as ComponentType<Record<string, unknown>>,
    [as],
  );
  const Child = useMemo(
    () => m.create(asChild as string) as ComponentType<Record<string, unknown>>,
    [asChild],
  );

  if (reduce) {
    const Plain = as as ElementType;
    return <Plain className={className}>{children}</Plain>;
  }

  const initial = { initial: "hidden" } as const;
  const motionProps =
    triggerOn === "mount"
      ? { ...initial, animate: "visible" }
      : { ...initial, whileInView: "visible", viewport: { once, amount } };

  const renderedChildren = Children.map(children, (child, index) => (
    <Child key={index} variants={itemVariants}>
      {child}
    </Child>
  ));

  return (
    <Container
      className={className}
      variants={containerVariants}
      {...motionProps}
    >
      {renderedChildren}
    </Container>
  );
}
