import * as React from "react";
import { Dialog as D } from "radix-ui";
import { cn } from "../lib/cn.js";
import { XGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";

/** A panel that slides in from an edge: details, filters, a form next to the page. It blocks the page like a Dialog. */
export const Sheet = D.Root;
export const SheetTrigger = D.Trigger;
export const SheetClose = D.Close;

const SIDE = {
  right: "inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=open]:animate-seed-sheet-right",
  left: "inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=open]:animate-seed-sheet-left",
  bottom: "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl border-t data-[state=open]:animate-seed-sheet-bottom",
} as const;

export interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof D.Content> {
  /** Default 'right'. */
  side?: keyof typeof SIDE;
  hideClose?: boolean;
  /** Default 'Close'. */
  closeLabel?: string;
}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent({ side = "right", hideClose, closeLabel = "Close", className, children, ...rest }, ref) {
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-40 bg-overlay-alpha-primary data-[state=open]:animate-seed-fade-in data-[state=closed]:animate-seed-fade-out motion-reduce:animate-none" />
      <D.Content ref={ref} className={cn("fixed z-40 flex flex-col gap-base overflow-y-auto border-secondary bg-elevated p-lg text-primary shadow-elevation-2xl font-primary outline-none",
        "data-[state=closed]:animate-seed-fade-out motion-reduce:animate-none", SIDE[side], className)} {...rest}>
        {children}
        {hideClose ? null : (
          <D.Close asChild><Button variant="ghost" size="sm" icon={<XGlyph />} aria-label={closeLabel} className="absolute top-base right-base" /></D.Close>
        )}
      </D.Content>
    </D.Portal>
  );
});
export function SheetHeader({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-xxs pr-2xl", className)} {...rest} />;
}
export function SheetFooter({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto flex flex-wrap justify-end gap-xs pt-base", className)} {...rest} />;
}
export const SheetTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof D.Title>>(function SheetTitle({ className, ...rest }, ref) {
  return <D.Title ref={ref} className={cn("m-0 text-primary heading-h6-semibold", className)} {...rest} />;
});
export const SheetDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof D.Description>>(function SheetDescription({ className, ...rest }, ref) {
  return <D.Description ref={ref} className={cn("m-0 text-secondary body-body-3-regular", className)} {...rest} />;
});
