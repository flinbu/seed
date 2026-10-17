import * as React from "react";
import { cn } from "../lib/cn.js";

/** A keyboard key, like ⌘ or K. */
export function Kbd({ className, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return <kbd className={cn("inline-flex h-(--size-xl) min-w-(--size-xl) items-center justify-center rounded-md border border-secondary bg-secondary px-xxs font-mono text-secondary shadow-elevation-2xs caption-caption-1-semibold", className)} {...rest} />;
}
