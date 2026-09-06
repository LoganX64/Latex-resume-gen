import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Icon } from "@/components/Icon";
import {
  faCircleCheck,
  faCircleInfo,
  faCircleExclamation,
  faCircleXmark,
  faSpinner,
} from "@/lib/icons";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      swipeDirections={["left", "right"]}
      icons={{
        success: <Icon icon={faCircleCheck} className="size-4" />,
        info: <Icon icon={faCircleInfo} className="size-4" />,
        warning: <Icon icon={faCircleExclamation} className="size-4" />,
        error: <Icon icon={faCircleXmark} className="size-4" />,
        loading: <Icon icon={faSpinner} className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
