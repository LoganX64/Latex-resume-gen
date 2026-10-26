import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BrandLogoV2Props {
  to?: string;
  className?: string;
  inverted?: boolean;
}

export function BrandLogoV2({
  to = "/",
  className,
  inverted = false,
}: BrandLogoV2Props) {
  return (
    <Link to={to} className={cn("flex items-center gap-1 shrink-0", className)}>
      <img src="/logo.svg" alt="" className="h-7 w-7 object-contain" />
      <span className="text-lg font-bold italic tracking-tight">
        <span className="text-primary">CV</span>
        <span className={inverted ? "text-white" : "text-foreground"}>
          Stack
        </span>
      </span>
    </Link>
  );
}
