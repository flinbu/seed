import * as React from "react";
import { Progress as RadixProgress } from "radix-ui";
import { cn } from "../lib/cn.js";

const BAR = { accent: "bg-accent-solid", success: "bg-success-secondary", warning: "bg-warning-secondary", error: "bg-error-secondary" } as const;

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Omit for an indeterminate bar. */
  value?: number | null;
  /** Default 100. */
  max?: number;
  label?: React.ReactNode;
  /** Shows the percentage (or valueText) at the right. */
  showValue?: boolean;
  /** Replaces the percentage, e.g. "9.2 of 10 GB"; also announced. */
  valueText?: string;
  variant?: keyof typeof BAR;
  size?: "sm" | "md";
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress({ value, max = 100, label, showValue, valueText, variant = "accent", size = "md", className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...rest }, ref) {
  const auto = React.useId();
  const lid = `seed-progress-${auto}`;
  const pct = value == null ? null : Math.max(0, Math.min(100, (value / max) * 100));
  const text = valueText ?? (pct == null ? undefined : `${Math.round(pct)}%`);
  return (
    <div ref={ref} className={cn("flex min-w-0 flex-col gap-xxs", className)} {...rest}>
      {label || showValue ? (
        <div className="flex justify-between gap-xs body-body-4-regular">
          {label ? <span id={lid} className="text-primary">{label}</span> : <span />}
          {showValue && text ? <span className="tabular-nums text-secondary">{text}</span> : null}
        </div>
      ) : null}
      <RadixProgress.Root value={value ?? null} max={max} getValueLabel={() => text ?? ""} aria-labelledby={label ? lid : ariaLabelledBy} aria-label={label || ariaLabelledBy ? undefined : ariaLabel}
        className={cn("relative overflow-hidden rounded-full bg-tertiary", size === "sm" ? "h-(--size-xs)" : "h-(--size-sm)")}>
        <RadixProgress.Indicator className={cn("h-full rounded-full", BAR[variant], pct == null ? "absolute w-2/5 motion-safe:animate-seed-indeterminate" : "transition-[width] duration-(--duration-slow)")}
          style={pct == null ? undefined : { width: `${pct}%` }} />
      </RadixProgress.Root>
    </div>
  );
});
