import * as React from "react";
import { Popover as RadixPopover } from "radix-ui";
import { cn } from "../lib/cn.js";
import { floatingPanel } from "../lib/floating.js";

/** Content that floats next to its trigger: a small form, details, settings. Use DropdownMenu for commands. */
export const Popover = RadixPopover.Root;
/** Wraps your trigger (usually a Seed Button) with asChild. */
export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverAnchor = RadixPopover.Anchor;
export const PopoverClose = RadixPopover.Close;

export interface PopoverContentProps extends React.ComponentPropsWithoutRef<typeof RadixPopover.Content> {
  /** Render in place instead of in a portal at the end of the body. */
  inline?: boolean;
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent({ className, align = "start", sideOffset = 8, collisionPadding = 8, inline, ...rest }, ref) {
  const content = (
    <RadixPopover.Content ref={ref} align={align} sideOffset={sideOffset} collisionPadding={collisionPadding}
      className={cn(floatingPanel, "w-72 max-w-(--radix-popover-content-available-width) p-base origin-(--radix-popover-content-transform-origin)", className)} {...rest} />
  );
  return inline ? content : <RadixPopover.Portal>{content}</RadixPopover.Portal>;
});
