import * as React from "react";
import { HoverCard as H } from "radix-ui";
import { cn } from "../lib/cn.js";
import { floatingPanel } from "../lib/floating.js";

export interface HoverCardProps extends Omit<React.ComponentPropsWithoutRef<typeof H.Content>, "content"> {
  /** The preview: a person, a token, a linked page. */
  content: React.ReactNode;
  /** One focusable element, usually a link. */
  children: React.ReactElement;
  /** ms. Default 500. */
  openDelay?: number;
  /** ms. Default 200. */
  closeDelay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** A preview of what a link points to, for people with a pointer. Keyboard and touch users go to the link, so never put actions only here. */
export const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(function HoverCard(
  { content, children, openDelay = 500, closeDelay = 200, open, defaultOpen, onOpenChange, side = "bottom", align = "start", sideOffset = 8, className, ...rest }, ref) {
  return (
    <H.Root openDelay={openDelay} closeDelay={closeDelay} open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <H.Trigger asChild>{children}</H.Trigger>
      <H.Portal>
        <H.Content ref={ref} side={side} align={align} sideOffset={sideOffset} collisionPadding={8}
          className={cn(floatingPanel, "w-72 max-w-(--radix-hover-card-content-available-width) p-base origin-(--radix-hover-card-content-transform-origin)", className)} {...rest}>
          {content}
        </H.Content>
      </H.Portal>
    </H.Root>
  );
});
