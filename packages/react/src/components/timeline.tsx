import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";

type Status = "default" | "accent" | "success" | "warning" | "error";
const DOT: Record<Status, string> = { default: "bg-primary shadow-[inset_0_0_0_2px_var(--icon-tertiary)]", accent: "bg-accent-solid", success: "bg-success-secondary", warning: "bg-warning-secondary", error: "bg-error-secondary" };
const CHIP: Record<Status, string> = { default: "bg-tertiary text-icon-secondary", accent: "bg-accent-primary text-icon-info-primary", success: "bg-success-primary text-icon-success-primary-hover", warning: "bg-warning-primary text-icon-warning-primary-hover", error: "bg-error-primary text-icon-error-primary" };

/** "52 minutes ago", "yesterday", in the reader's language. */
export function formatRelative(date: Date | number, now: Date | number = Date.now(), locale?: string): string {
  const ms = new Date(date).getTime() - new Date(now).getTime(), abs = Math.abs(ms) / 1000;
  if (abs < 45) return "just now";
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [u, s] of units) if (abs >= s * (u === "minute" ? 0.75 : 1)) return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(Math.round(ms / 1000 / s), u);
  return "just now";
}

export interface TimelineItem { id?: string | number; title: React.ReactNode; description?: React.ReactNode; time?: Date | number | React.ReactNode; status?: Status; icon?: IconProp; content?: React.ReactNode }
export interface TimelineProps extends React.OlHTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
  /** For stable relative times. */
  now?: Date;
  locale?: string;
  dense?: boolean;
}

/** Events in order: a version history, an activity feed, the steps of a sync. */
export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(function Timeline({ items, now, locale, dense, className, ...rest }, ref) {
  return (
    <ol ref={ref} className={cn("m-0 list-none p-0 font-primary", className)} {...rest}>
      {items.map((it, i) => {
        const st = it.status ?? "default";
        const t = it.time;
        const stamp = t instanceof Date || typeof t === "number"
          ? <time dateTime={new Date(t).toISOString()} title={new Date(t).toLocaleString(locale)}>{formatRelative(t, now, locale)}</time> : t;
        return (
          <li key={it.id ?? i} className={cn("relative flex gap-sm", i < items.length - 1 && (dense ? "pb-sm" : "pb-lg"))}>
            {i < items.length - 1 ? <span aria-hidden="true" className="absolute top-(--size-2xl) bottom-0 left-[calc(var(--size-2xl)/2)] w-px bg-(--border-secondary)" /> : null}
            <span aria-hidden="true" className={cn("relative inline-flex size-(--size-2xl) shrink-0 items-center justify-center rounded-full", it.icon ? cn(CHIP[st], "shadow-[0_0_0_3px_var(--bg-primary)]") : "")}>
              {it.icon ? renderIcon(it.icon, "xs") : <span className={cn("size-(--size-sm) rounded-full", DOT[st])} />}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-xxxs pt-xxxs">
              <div className="flex flex-wrap items-baseline justify-between gap-sm">
                <span className="text-primary label-label-2-medium">{it.title}</span>
                {stamp ? <span className="whitespace-nowrap text-tertiary body-body-4-regular">{stamp}</span> : null}
              </div>
              {it.description ? <div className="text-secondary body-body-3-regular">{it.description}</div> : null}
              {it.content ? <div className="mt-xs">{it.content}</div> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
});
