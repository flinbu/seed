import * as React from "react";
import { Collapsible as C } from "radix-ui";
import { cn } from "../lib/cn.js";

/** One section that opens and closes: advanced settings, details, a long description. Accordion is for several. */
export const Collapsible = C.Root;
export const CollapsibleTrigger = C.Trigger;
export const CollapsibleContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof C.Content>>(function CollapsibleContent({ className, ...rest }, ref) {
  return <C.Content ref={ref} className={cn("overflow-hidden data-[state=open]:animate-seed-collapsible-open data-[state=closed]:animate-seed-collapsible-close motion-reduce:animate-none", className)} {...rest} />;
});
