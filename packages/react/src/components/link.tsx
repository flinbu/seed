import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { ArrowUpRightGlyph, ChevronRightGlyph } from "../lib/glyphs.js";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** default: underlined inline. subtle: gray, underline on hover. standalone: on its own line with a chevron. */
  variant?: "default" | "subtle" | "standalone";
  /** Opens in a new tab, with an arrow and "(opens in a new tab)" for screen readers. */
  external?: boolean;
  icon?: IconProp;
  /** Styles your own element, like a router Link. */
  asChild?: boolean;
}

/** Text that goes somewhere. Use Button for actions. Say where it goes, never "click here". */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link({ variant = "default", external, icon, asChild, className, children, ...rest }, ref) {
  const cls = cn("rounded-sm underline-offset-3 transition-colors duration-(--duration-fast) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
    variant === "default" && "text-link underline decoration-[color-mix(in_srgb,currentColor_40%,transparent)] hover:text-link-hover hover:decoration-current",
    variant === "subtle" && "text-secondary no-underline hover:text-primary hover:underline",
    variant === "standalone" && "inline-flex items-center gap-xxxs text-link no-underline label-label-2-medium hover:underline", className);
  if (asChild) return <Slot.Root ref={ref} className={cls} {...rest}>{children}</Slot.Root>;
  return (
    <a ref={ref} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
      {icon ? <span className="mr-xxs inline-flex align-[-0.125em] leading-none">{renderIcon(icon, "xs")}</span> : null}
      {children}
      {external ? <><ArrowUpRightGlyph size={12} className="ml-px inline align-[-0.0625em] rtl:-scale-x-100" /><span className="sr-only"> (opens in a new tab)</span></> : null}
      {variant === "standalone" && !external ? <ChevronRightGlyph size={12} className="rtl:-scale-x-100" /> : null}
    </a>
  );
});
