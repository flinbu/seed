import * as React from "react";
import { Tooltip as RadixTooltip } from "radix-ui";
import { cn } from "../lib/cn.js";

/** Optional: share one delay across many tooltips (moving between them opens the next one instantly). */
export const TooltipProvider = RadixTooltip.Provider;

export interface TooltipProps extends Omit<React.ComponentPropsWithoutRef<typeof RadixTooltip.Content>, "content"> {
  /** What the trigger does, in a few words. */
  content: React.ReactNode;
  /** A keyboard shortcut shown after the text, like "⌘Z". */
  shortcut?: React.ReactNode;
  /** The trigger: one focusable element, usually an icon-only Button. */
  children: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** ms before it opens on hover. Default 300; focus opens it right away. */
  delay?: number;
}

/** Names an icon button or explains a control. Never put anything interactive or essential only in a tooltip. */
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { content, shortcut, children, open, defaultOpen, onOpenChange, delay = 300, side = "top", sideOffset = 6, className, ...rest }, ref) {
  return (
    <RadixTooltip.Provider delayDuration={delay}>
      <RadixTooltip.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content ref={ref} side={side} sideOffset={sideOffset} collisionPadding={8}
            className={cn("z-[60] inline-flex max-w-xs items-center gap-xs rounded-control bg-black-solid px-xs py-xxs text-on-dark-color label-label-3-medium",
              "origin-(--radix-tooltip-content-transform-origin) data-[state=delayed-open]:animate-seed-fade-in data-[state=instant-open]:animate-seed-fade-in motion-reduce:animate-none", className)} {...rest}>
            {content}
            {shortcut ? <span className="font-mono opacity-70">{shortcut}</span> : null}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
});
