import * as React from "react";
import { cn } from "../lib/cn.js";
import { Avatar, type AvatarProps } from "./avatar.js";
import { Tooltip } from "./tooltip.js";

export interface AvatarGroupPerson { id?: string; name: string; src?: string; status?: AvatarProps["status"] }
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  people: AvatarGroupPerson[];
  /** Avatars shown before "+N". Default 4. */
  max?: number;
  /** Default 'sm'. */
  size?: AvatarProps["size"];
  /** Accessible name for the group, like "Editing now". Default "{n} people". */
  label?: string;
}
const OVERLAP = { xs: "-ml-xxs", sm: "-ml-xs", md: "-ml-xs", lg: "-ml-sm" } as const;

/** A stack of people: who's in a file, who reviewed a change. Every face has a tooltip with the name. */
export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup({ people, max = 4, size = "sm", label, className, ...rest }, ref) {
  const shown = people.length > max ? people.slice(0, max - 1) : people;
  const extra = people.slice(shown.length);
  const item = cn("relative inline-flex rounded-full outline-none hover:z-20 focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary [&_[role=img]]:shadow-[0_0_0_2px_var(--bg-primary)]");
  return (
    <div ref={ref} role="group" aria-label={label ?? `${people.length} people`} className={cn("inline-flex items-center", className)} {...rest}>
      {shown.map((p, i) => (
        <Tooltip key={p.id ?? p.name} content={p.status ? `${p.name} · ${p.status[0].toUpperCase()}${p.status.slice(1)}` : p.name}>
          <span tabIndex={0} className={cn(item, i > 0 && OVERLAP[size ?? "sm"])} style={{ zIndex: shown.length - i }}>
            <Avatar name={p.name} src={p.src} status={p.status} size={size} />
          </span>
        </Tooltip>
      ))}
      {extra.length ? (
        <Tooltip content={extra.map((p) => p.name).join(", ")}>
          <span tabIndex={0} className={cn(item, OVERLAP[size ?? "sm"])}>
            <span role="img" aria-label={`${extra.length} more: ${extra.map((p) => p.name).join(", ")}`}
              className={cn("inline-flex items-center justify-center rounded-full border border-secondary bg-secondary text-secondary",
                size === "xs" ? "size-(--size-2xl) caption-caption-1-semibold" : size === "md" ? "size-(--size-4xl) label-label-2-semibold" : size === "lg" ? "size-(--size-5xl) label-label-1-semibold" : "size-(--size-3xl) label-label-3-semibold")}>+{extra.length}</span>
          </span>
        </Tooltip>
      ) : null}
    </div>
  );
});
