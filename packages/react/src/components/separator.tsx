import * as React from "react";
import { Separator as RadixSeparator } from "radix-ui";
import { cn } from "../lib/cn.js";

export interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof RadixSeparator.Root> {}
/** A 1px line. Decorative by default; decorative={false} exposes role="separator". */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator({ orientation = "horizontal", decorative = true, className, ...rest }, ref) {
  return <RadixSeparator.Root ref={ref} orientation={orientation} decorative={decorative}
    className={cn("shrink-0 bg-(--border-secondary)", orientation === "vertical" ? "w-px self-stretch" : "h-px w-full", className)} {...rest} />;
});
