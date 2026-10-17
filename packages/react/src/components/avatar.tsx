import * as React from "react";
import { Avatar as RadixAvatar } from "radix-ui";
import { cn } from "../lib/cn.js";

const SIZE = {
  xs: "size-(--size-2xl) caption-caption-1-semibold", sm: "size-(--size-3xl) label-label-3-semibold",
  md: "size-(--size-4xl) label-label-2-semibold", lg: "size-(--size-5xl) label-label-1-semibold",
} as const;

export interface AvatarProps extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Root> {
  src?: string;
  alt?: string;
  /** Used for the initials and the accessible name. */
  name?: string;
  /** xs 24, sm 32, md 40 (default), lg 48 px. */
  size?: keyof typeof SIZE;
  /** 'square' for workspaces and organizations. */
  shape?: "circle" | "square";
}

export function initials(name?: string): string {
  if (!name) return "";
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
}

/** A person or a workspace: the photo when it loads, initials when it doesn't. */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar({ src, alt, name, size = "md", shape = "circle", className, ...rest }, ref) {
  return (
    <RadixAvatar.Root ref={ref} role="img" aria-label={alt ?? name}
      className={cn("relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-tertiary text-secondary", SIZE[size],
        shape === "square" ? (size === "xs" || size === "sm" ? "rounded-md" : "rounded-lg") : "rounded-full", className)} {...rest}>
      {src ? <RadixAvatar.Image src={src} alt="" className="size-full object-cover" /> : null}
      <RadixAvatar.Fallback aria-hidden="true" delayMs={src ? 300 : undefined}>{initials(name)}</RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
});
