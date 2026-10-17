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
  /** A presence dot. Read as part of the name: "Ana Ruiz, away". */
  status?: "online" | "away" | "busy" | "offline";
}

const DOT = { online: "bg-success-secondary", away: "bg-warning-secondary", busy: "bg-error-secondary", offline: "bg-primary shadow-[0_0_0_2px_var(--bg-primary),inset_0_0_0_2px_var(--icon-tertiary)]" } as const;

export function initials(name?: string): string {
  if (!name) return "";
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
}

/** A person or a workspace: the photo when it loads, initials when it doesn't. */
export const Avatar: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLSpanElement>> = React.forwardRef<HTMLSpanElement, AvatarProps>(function AvatarRender({ src, alt, name, size = "md", shape = "circle", status, className, ...rest }, ref) {
  if (status) {
    return (
      <span ref={ref} role="img" aria-label={`${alt ?? name ?? "Avatar"}, ${status}`} className={cn("relative inline-flex shrink-0", className)}>
        <Avatar src={src} name={name} size={size} shape={shape} aria-hidden="true" role="presentation" aria-label={undefined} {...rest} />
        <span aria-hidden="true" className={cn("absolute -right-px -bottom-px rounded-full shadow-[0_0_0_2px_var(--bg-primary)]", size === "xs" ? "size-(--size-sm)" : "size-[calc(var(--size-sm)+var(--space-xxxs))]", DOT[status])} />
      </span>
    );
  }
  return (
    <RadixAvatar.Root ref={ref} role="img" aria-label={alt ?? name}
      className={cn("relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-tertiary text-secondary", SIZE[size],
        shape === "square" ? (size === "xs" || size === "sm" ? "rounded-md" : "rounded-lg") : "rounded-full", className)} {...rest}>
      {src ? <RadixAvatar.Image src={src} alt="" className="size-full object-cover" /> : null}
      <RadixAvatar.Fallback aria-hidden="true" delayMs={src ? 300 : undefined}>{initials(name)}</RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
});
