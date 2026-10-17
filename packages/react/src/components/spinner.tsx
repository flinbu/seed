import * as React from "react";
import { cn } from "../lib/cn.js";
import { ICON_PX, type IconSize } from "../lib/icon.js";

export interface SpinnerProps {
  /** Default 'sm' (16px). */
  size?: IconSize;
  /** Announced to screen readers. Default 'Loading'; pass null when a parent already announces the busy state. */
  label?: string | null;
  className?: string;
}

export function Spinner({ size = "sm", label = "Loading", className }: SpinnerProps) {
  const px = ICON_PX[size];
  return (
    <span role={label ? "status" : undefined} className={cn("inline-flex leading-none text-current", className)}>
      <svg width={px} height={px} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" className="motion-safe:animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
