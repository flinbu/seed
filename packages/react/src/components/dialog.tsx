import * as React from "react";
import { Dialog as D } from "radix-ui";
import { cn } from "../lib/cn.js";
import { XGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";

/** A blocking task on top of the page: a short form, a review, a choice. Use AlertDialog (soon) for one hard-to-undo decision. */
export const Dialog = D.Root;
/** Wraps your trigger (usually a Seed Button) with asChild. */
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

const WIDTH = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" } as const;

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof D.Content> {
  /** sm 384, md 512 (default), lg 672 px wide. */
  size?: "sm" | "md" | "lg";
  /** Hide the close button (keep a Cancel button in the footer instead). */
  hideClose?: boolean;
  /** Label of the close button. Default 'Close'. */
  closeLabel?: string;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent({ size = "md", hideClose, closeLabel = "Close", className, children, ...rest }, ref) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-40 bg-overlay-alpha-secondary data-[state=open]:animate-seed-fade-in data-[state=closed]:animate-seed-fade-out motion-reduce:animate-none" />
      <D.Content ref={ref}
        className={cn("fixed top-1/2 left-1/2 z-40 flex max-h-[calc(100dvh-var(--space-2xl))] w-[calc(100%-var(--space-xl))] -translate-x-1/2 -translate-y-1/2 flex-col gap-base overflow-y-auto",
          "rounded-2xl border border-secondary bg-elevated p-lg text-primary shadow-elevation-xl font-primary outline-none",
          "data-[state=open]:animate-seed-grow data-[state=closed]:animate-seed-shrink motion-reduce:animate-none", WIDTH[size], className)} {...rest}>
        {children}
        {hideClose ? null : (
          <D.Close asChild>
            <Button variant="ghost" size="sm" icon={<XGlyph />} aria-label={closeLabel} className="absolute top-base right-base" />
          </D.Close>
        )}
      </D.Content>
    </D.Portal>
  );
});

export function DialogHeader({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-xxs pr-2xl", className)} {...rest} />;
}
export function DialogFooter({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-wrap justify-end gap-xs pt-xs", className)} {...rest} />;
}
export const DialogTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof D.Title>>(function DialogTitle({ className, ...rest }, ref) {
  return <D.Title ref={ref} className={cn("m-0 text-primary heading-h6-semibold", className)} {...rest} />;
});
export const DialogDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof D.Description>>(function DialogDescription({ className, ...rest }, ref) {
  return <D.Description ref={ref} className={cn("m-0 text-secondary body-body-3-regular", className)} {...rest} />;
});
