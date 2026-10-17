import * as React from "react";
import { Dialog as D } from "radix-ui";
import { cn } from "../lib/cn.js";

/** A panel that rises from the bottom with a grab handle: mobile menus, quick actions, filters on phones. */
export const Drawer = D.Root;
export const DrawerTrigger = D.Trigger;
export const DrawerClose = D.Close;

export const DrawerContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof D.Content>>(function DrawerContent({ className, children, ...rest }, ref) {
  const start = React.useRef<number | null>(null);
  const [dy, setDy] = React.useState(0);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-40 bg-overlay-alpha-primary data-[state=open]:animate-seed-fade-in data-[state=closed]:animate-seed-fade-out motion-reduce:animate-none" />
      <D.Content ref={ref} style={dy ? { transform: `translateY(${dy}px)` } : undefined}
        className={cn("fixed inset-x-0 bottom-0 z-40 mx-auto flex max-h-[85dvh] w-full max-w-2xl flex-col rounded-t-2xl border border-b-0 border-secondary bg-elevated px-lg pb-lg text-primary shadow-elevation-2xl font-primary outline-none",
          "data-[state=open]:animate-seed-sheet-bottom data-[state=closed]:animate-seed-fade-out motion-reduce:animate-none", className)} {...rest}>
        <div aria-hidden="true" className="flex shrink-0 cursor-grab touch-none justify-center py-sm active:cursor-grabbing"
          onPointerDown={(e) => { start.current = e.clientY; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); }}
          onPointerMove={(e) => { if (start.current != null) setDy(Math.max(0, e.clientY - start.current)); }}
          onPointerUp={() => { if (dy > 80) closeRef.current?.click(); setDy(0); start.current = null; }}>
          <span className="h-(--size-xs) w-(--size-4xl) rounded-full bg-(--border-primary)" />
        </div>
        <D.Close ref={closeRef} className="sr-only">Close</D.Close>
        <div className="flex min-h-0 flex-col gap-base overflow-y-auto">{children}</div>
      </D.Content>
    </D.Portal>
  );
});
export function DrawerHeader({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex flex-col gap-xxs", className)} {...rest} />; }
export function DrawerFooter({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex flex-col gap-xs pt-xs sm:flex-row sm:justify-end", className)} {...rest} />; }
export const DrawerTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof D.Title>>(function DrawerTitle({ className, ...rest }, ref) {
  return <D.Title ref={ref} className={cn("m-0 text-primary heading-h6-semibold", className)} {...rest} />;
});
export const DrawerDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof D.Description>>(function DrawerDescription({ className, ...rest }, ref) {
  return <D.Description ref={ref} className={cn("m-0 text-secondary body-body-3-regular", className)} {...rest} />;
});
