import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icon";
import { faCheck } from "@/lib/icons";
import { DURATION, EASE_OUT } from "@/lib/motion";

function Checkbox({ className, checked, ...props }: CheckboxPrimitive.Root.Props) {
  const reduce = useReducedMotion();

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-lg border border-input transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className,
      )}
      checked={checked}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <AnimatePresence mode="wait">
          {checked ? (
            <motion.span
              key="check"
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: DURATION.slow, ease: EASE_OUT }}
              className="grid place-content-center"
            >
              <Icon icon={faCheck} />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
