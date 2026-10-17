import * as React from "react";
import { cn } from "../lib/cn.js";

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  /** block (default), text (a 12px line) or circle. */
  shape?: "block" | "text" | "circle";
}
/** A placeholder in the shape of content that's loading. Mark the loading region with aria-busy. */
export function Skeleton({ width, height, shape = "block", className, style, ...rest }: SkeletonProps) {
  return <span aria-hidden="true" className={cn("block bg-tertiary motion-safe:animate-pulse",
    shape === "text" ? "h-(--size-md) rounded-sm" : shape === "circle" ? "h-(--size-lg) rounded-full" : "h-(--size-lg) rounded-md", className)}
    style={{ width, height, ...style }} {...rest} />;
}
