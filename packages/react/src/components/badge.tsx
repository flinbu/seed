import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";

type Tone = "neutral" | "accent" | "error" | "success" | "warning" | "info" | "offer";
const SOFT: Record<Tone, string> = {
  neutral: "bg-tertiary text-secondary", accent: "bg-accent-primary text-accent-primary", error: "bg-error-primary text-error-primary",
  success: "bg-success-primary text-success-primary-hover", warning: "bg-warning-primary text-warning-primary-hover", info: "bg-info-primary text-info-primary-hover", offer: "bg-offer-primary text-offer-primary-hover",
};
const SOLID: Record<Tone, string> = {
  neutral: "bg-black-solid text-on-dark-color", accent: "bg-accent-solid text-on-accent", error: "bg-error-secondary text-on-dark-color",
  success: "bg-success-secondary text-on-dark-color", warning: "bg-warning-secondary text-on-dark-color", info: "bg-info-secondary text-on-dark-color", offer: "bg-offer-secondary text-on-dark-color",
};
const OUTLINE: Record<Tone, string> = {
  neutral: "border-primary text-secondary", accent: "border-accent-primary text-accent-primary", error: "border-error-primary text-error-primary",
  success: "border-success-primary text-success-primary-hover", warning: "border-warning-primary text-warning-primary-hover", info: "border-info-primary text-info-primary-hover", offer: "border-offer-primary text-offer-primary-hover",
};
export const badgeVariants = cva("inline-flex h-(--size-2xl) items-center gap-xxs whitespace-nowrap rounded-control border border-transparent px-xs label-label-3-medium", {
  variants: { variant: { neutral: "", accent: "", error: "", success: "", warning: "", info: "", offer: "" }, appearance: { soft: "", solid: "", outline: "" } },
  defaultVariants: { variant: "neutral", appearance: "soft" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  icon?: IconProp;
  /** A leading status dot in the text color. */
  dot?: boolean;
}

/** A short status or count. Pair color with a word or icon; never color alone. */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ variant = "neutral", appearance = "soft", icon, dot, className, children, ...rest }, ref) {
  const v = (variant ?? "neutral") as Tone, a = appearance ?? "soft";
  return (
    <span ref={ref} className={cn(badgeVariants({ variant: v, appearance: a }), (a === "solid" ? SOLID : a === "outline" ? OUTLINE : SOFT)[v], className)} {...rest}>
      {dot ? <span aria-hidden="true" className="size-(--size-sm) rounded-full bg-current" /> : null}
      {renderIcon(icon, "xs")}
      {children}
    </span>
  );
});
