import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp, type IconSize } from "../lib/icon.js";
import { Spinner } from "./spinner.js";

export const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-xs shrink-0 whitespace-nowrap select-none cursor-pointer no-underline",
    "rounded-control border border-transparent font-primary",
    "transition-[background-color,color,border-color,box-shadow] duration-(--duration-fast) ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
    "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        primary: "bg-button-primary text-button-primary-text hover:not-disabled:bg-button-primary-hover hover:not-disabled:text-button-primary-text-hover focus-visible:shadow-button-focus-primary disabled:bg-disabled disabled:text-white",
        secondary: "bg-primary text-primary border-primary shadow-elevation-raised hover:not-disabled:bg-primary-hover focus-visible:shadow-button-focus-secondary disabled:bg-disabled-alt disabled:text-disabled disabled:border-disabled-alt disabled:shadow-none",
        tertiary: "bg-tertiary text-primary hover:not-disabled:bg-tertiary-hover focus-visible:shadow-button-focus-tertiary disabled:bg-disabled-alt disabled:text-disabled",
        ghost: "bg-button-ghost text-secondary hover:not-disabled:bg-button-ghost-hover hover:not-disabled:text-primary focus-visible:shadow-button-focus-ghost disabled:text-disabled",
        destructive: "bg-button-destructive text-button-destructive-text hover:not-disabled:bg-button-destructive-hover hover:not-disabled:text-button-destructive-text-hover focus-visible:shadow-button-focus-destructive focus-visible:outline-error-primary disabled:bg-disabled disabled:text-white",
        success: "bg-button-success text-button-success-text hover:not-disabled:bg-button-success-hover hover:not-disabled:text-button-success-text-hover focus-visible:shadow-button-focus-success focus-visible:outline-success-primary disabled:bg-disabled disabled:text-white",
        link: "h-auto! p-0! border-0 rounded-sm text-link [font:inherit] hover:not-disabled:text-link-hover hover:not-disabled:underline underline-offset-3 disabled:text-disabled",
      },
      size: {
        sm: "h-control-sm px-sm gap-xxs label-label-3-medium",
        md: "h-control-md px-base label-label-2-medium",
        lg: "h-control-lg px-lg label-label-1-medium",
      },
      iconOnly: { true: "px-0", false: "" },
      fullWidth: { true: "flex w-full", false: "" },
    },
    compoundVariants: [
      { iconOnly: true, size: "sm", className: "w-control-sm" },
      { iconOnly: true, size: "md", className: "w-control-md" },
      { iconOnly: true, size: "lg", className: "w-control-lg" },
    ],
    defaultVariants: { variant: "primary", size: "md", iconOnly: false, fullWidth: false },
  },
);

const ICON: Record<"sm" | "md" | "lg", IconSize> = { sm: "sm", md: "sm", lg: "md" };

type Base = Omit<VariantProps<typeof buttonVariants>, "iconOnly">;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, Base {
  /** Icon-only button: square, needs aria-label. */
  icon?: IconProp;
  leftIcon?: IconProp;
  rightIcon?: IconProp;
  /** Shows a Spinner in place of the left icon and disables the button. */
  loading?: boolean;
  /** Renders a link with the same styling. */
  href?: string;
  /** Renders your own element (for example a router Link) with the button's styling. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", icon, leftIcon, rightIcon, loading = false, fullWidth, href, asChild, className, children, disabled, type, ...rest },
  ref,
) {
  const s = size ?? "md";
  const iconOnly = !!icon;
  const classes = cn(buttonVariants({ variant, size: s, iconOnly, fullWidth }), loading && "cursor-progress", className);
  const lead = loading ? <Spinner size={ICON[s]} label={null} /> : renderIcon(iconOnly ? icon : leftIcon, ICON[s]);
  const content = (
    <>
      {lead ? <span className="inline-flex leading-none">{lead}</span> : null}
      {iconOnly ? null : children}
      {!iconOnly && rightIcon ? <span className="inline-flex leading-none">{renderIcon(rightIcon, ICON[s])}</span> : null}
    </>
  );
  if (asChild) return <Slot.Root ref={ref} className={classes} {...rest}>{children}</Slot.Root>;
  if (href) {
    const off = disabled || loading;
    return (
      <a ref={ref as unknown as React.Ref<HTMLAnchorElement>} href={off ? undefined : href} aria-disabled={off || undefined} aria-busy={loading || undefined}
        className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{content}</a>
    );
  }
  return (
    <button ref={ref} type={type ?? "button"} disabled={disabled || loading} aria-busy={loading || undefined} className={classes} {...rest}>
      {content}
    </button>
  );
});
