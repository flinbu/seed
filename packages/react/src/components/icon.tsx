import * as React from "react";
import { cn } from "../lib/cn.js";
import { ICON_PX, type IconProp, type IconSize } from "../lib/icon.js";

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  /** A Lucide icon (or any icon component). Omit it and pass <path> children to draw a custom 24px icon. */
  as?: Exclude<IconProp, React.ReactElement>;
  /** xs 12, sm 16 (default), md 20, lg 24 px, or a number. */
  size?: IconSize | number;
  /** Accessible name. Without it the icon is decorative (aria-hidden). */
  label?: string;
  strokeWidth?: number;
}

/** Draws an icon at Seed's icon sizes. Decorative unless you give it a label. */
export function Icon({ as: As, size = "sm", label, strokeWidth = 2, className, children, ...rest }: IconProps) {
  const px = typeof size === "number" ? size : ICON_PX[size];
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const, focusable: "false" as const };
  if (As) {
    const C = As as React.ComponentType<any>;
    return <C size={px} strokeWidth={strokeWidth} className={cn("inline-block shrink-0 align-middle", className)} {...a11y} {...rest} />;
  }
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={cn("inline-block shrink-0 align-middle", className)} {...a11y} {...rest}>
      {children}
    </svg>
  );
}
