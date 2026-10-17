import * as React from "react";
import { cn } from "../lib/cn.js";

type Tone = "accent" | "success" | "warning" | "error" | "neutral";
const BAR: Record<Tone, string> = { accent: "bg-accent-solid", success: "bg-success-secondary", warning: "bg-warning-secondary", error: "bg-error-secondary", neutral: "bg-(--icon-secondary)" };
const STROKE: Record<Tone, string> = { accent: "stroke-(--bg-accent-solid)", success: "stroke-(--bg-success-secondary)", warning: "stroke-(--bg-warning-secondary)", error: "stroke-(--bg-error-secondary)", neutral: "stroke-(--icon-secondary)" };

/** Picks the tone from low/high/optimum the way HTML's <meter> does: optimum's zone is good, one zone away warns, two is an error. */
export function meterTone(value: number, min: number, max: number, low?: number, high?: number, optimum?: number): Tone {
  if (low == null && high == null) return "accent";
  const zone = (x: number) => (low != null && x < low ? 0 : high != null && x > high ? 2 : 1);
  const d = Math.abs(zone(optimum ?? (min + max) / 2) - zone(value));
  return d === 0 ? "success" : d === 1 ? "warning" : "error";
}

export interface MeterProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  min?: number;
  /** Default 100. */
  max?: number;
  low?: number;
  high?: number;
  optimum?: number;
  /** Overrides the computed tone. */
  tone?: Tone;
  label?: React.ReactNode;
  /** Shown and announced text, like "182 of 200". */
  valueText?: string;
  /** Default true. */
  showValue?: boolean;
  size?: "sm" | "md";
}

/** A level within a known range: credits used, adoption, storage. Use Progress for tasks that finish. */
export const Meter = React.forwardRef<HTMLDivElement, MeterProps>(function Meter({ value, min = 0, max = 100, low, high, optimum, tone, label, valueText, showValue = true, size = "md", className, ...rest }, ref) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const t = tone ?? meterTone(value, min, max, low, high, optimum);
  const id = React.useId();
  return (
    <div ref={ref} className={cn("flex flex-col gap-xs font-primary", className)} {...rest}>
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-sm">
          {label ? <span id={id} className="text-primary label-label-3-medium">{label}</span> : <span />}
          {showValue ? <span className="text-secondary tabular-nums label-label-3-medium">{valueText ?? `${Math.round(pct)}%`}</span> : null}
        </div>
      ) : null}
      <div role="meter" aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-valuetext={valueText} aria-labelledby={label ? id : undefined}
        className={cn("relative overflow-hidden rounded-full bg-tertiary", size === "sm" ? "h-(--size-xs)" : "h-(--size-sm)")}>
        <div className={cn("h-full rounded-full transition-[width] duration-(--duration-base) motion-reduce:transition-none", BAR[t])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
});

const RING = { sm: [20, 2.5], md: [40, 4], lg: [64, 5], xl: [96, 6] } as const;
export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Leave it out to spin. */
  value?: number;
  max?: number;
  /** sm 20, md 40 (default), lg 64, xl 96 px. */
  size?: keyof typeof RING;
  tone?: Tone;
  /** Number in the middle (md and up). */
  showValue?: boolean;
  /** Accessible name. Default "Progress". */
  label?: string;
  valueText?: string;
}
/** Circular progress or a score: health, a sync, a big single figure. */
export const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(function ProgressRing({ value, max = 100, size = "md", tone = "accent", showValue, label = "Progress", valueText, className, ...rest }, ref) {
  const [d, sw] = RING[size]; const r = (d - sw) / 2, c = 2 * Math.PI * r;
  const busy = value == null;
  const pct = busy ? 25 : Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div ref={ref} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={busy ? undefined : value} aria-valuetext={valueText}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)} style={{ width: d, height: d }} {...rest}>
      <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} aria-hidden="true" className={cn("absolute inset-0", busy && "animate-spin motion-reduce:animate-[spin_3s_linear_infinite]")}>
        <circle cx={d / 2} cy={d / 2} r={r} fill="none" strokeWidth={sw} className="stroke-(--bg-tertiary)" />
        <circle cx={d / 2} cy={d / 2} r={r} fill="none" strokeWidth={sw} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)}
          transform={`rotate(-90 ${d / 2} ${d / 2})`} className={cn("transition-[stroke-dashoffset] duration-(--duration-slow) motion-reduce:transition-none", STROKE[tone])} />
      </svg>
      {showValue && !busy && size !== "sm" ? <span className={cn("relative text-primary tabular-nums", size === "md" ? "caption-caption-1-semibold" : size === "lg" ? "label-label-2-semibold" : "heading-h6-semibold")}>{valueText ?? `${Math.round(pct)}%`}</span> : null}
    </div>
  );
});
