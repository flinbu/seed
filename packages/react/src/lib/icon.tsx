import * as React from "react";

/** An icon: an element like <Search /> (works everywhere, including React Server Components) or, in client components, the component itself (Search). */
export type IconProp = React.ComponentType<{ size?: number | string; className?: string; "aria-hidden"?: boolean | "true" | "false"; strokeWidth?: number }> | React.ReactElement;
export type IconSize = "xs" | "sm" | "md" | "lg";
export const ICON_PX: Record<IconSize, number> = { xs: 12, sm: 16, md: 20, lg: 24 };

export function renderIcon(icon: IconProp | null | undefined | false, size: IconSize = "sm", className?: string): React.ReactNode {
  if (!icon) return null;
  if (React.isValidElement(icon)) {
    // Elements get Seed's size and are hidden from screen readers unless they already say otherwise.
    const p = icon.props as { size?: unknown; className?: string; "aria-hidden"?: unknown; "aria-label"?: unknown };
    return React.cloneElement(icon as React.ReactElement<any>, {
      size: p.size ?? ICON_PX[size],
      "aria-hidden": p["aria-hidden"] ?? (p["aria-label"] ? undefined : true),
      className: [p.className, className].filter(Boolean).join(" ") || undefined,
    });
  }
  const C = icon as React.ComponentType<any>;
  return <C size={ICON_PX[size]} aria-hidden="true" className={className} />;
}
