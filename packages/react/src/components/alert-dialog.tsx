import * as React from "react";
import { AlertDialog as A } from "radix-ui";
import { cn } from "../lib/cn.js";
import { buttonVariants } from "./button.js";

/** One hard-to-undo decision: delete, discard, overwrite. No close button; Cancel gets focus first. */
export const AlertDialog = A.Root;
export const AlertDialogTrigger = A.Trigger;

export interface AlertDialogContentProps extends React.ComponentPropsWithoutRef<typeof A.Content> {
  /** sm 384 (default), md 512 px. */
  size?: "sm" | "md";
}
export const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(function AlertDialogContent({ size = "sm", className, ...rest }, ref) {
  return (
    <A.Portal>
      <A.Overlay className="fixed inset-0 z-40 bg-overlay-alpha-secondary data-[state=open]:animate-seed-fade-in data-[state=closed]:animate-seed-fade-out motion-reduce:animate-none" />
      <A.Content ref={ref} className={cn("fixed top-1/2 left-1/2 z-40 flex max-h-[calc(100dvh-var(--space-2xl))] w-[calc(100%-var(--space-xl))] -translate-x-1/2 -translate-y-1/2 flex-col gap-base overflow-y-auto",
        "rounded-2xl border border-secondary bg-elevated p-lg text-primary shadow-elevation-xl font-primary outline-none data-[state=open]:animate-seed-grow data-[state=closed]:animate-seed-shrink motion-reduce:animate-none",
        size === "md" ? "max-w-lg" : "max-w-sm", className)} {...rest} />
    </A.Portal>
  );
});
export function AlertDialogHeader({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex flex-col gap-xxs", className)} {...rest} />; }
export function AlertDialogFooter({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex flex-wrap justify-end gap-xs pt-xs", className)} {...rest} />; }
export const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof A.Title>>(function AlertDialogTitle({ className, ...rest }, ref) {
  return <A.Title ref={ref} className={cn("m-0 text-primary heading-h6-semibold", className)} {...rest} />;
});
export const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof A.Description>>(function AlertDialogDescription({ className, ...rest }, ref) {
  return <A.Description ref={ref} className={cn("m-0 text-secondary body-body-3-regular", className)} {...rest} />;
});
export interface AlertDialogActionProps extends React.ComponentPropsWithoutRef<typeof A.Action> {
  /** Default 'destructive'; use 'primary' for decisions that only feel big. */
  variant?: "destructive" | "primary";
}
/** The verb from the title ("Delete"), never OK or Yes. */
export const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(function AlertDialogAction({ variant = "destructive", className, ...rest }, ref) {
  return <A.Action ref={ref} className={cn(buttonVariants({ variant, size: "md" }), className)} {...rest} />;
});
/** Always "Cancel". */
export const AlertDialogCancel = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof A.Cancel>>(function AlertDialogCancel({ className, children = "Cancel", ...rest }, ref) {
  return <A.Cancel ref={ref} className={cn(buttonVariants({ variant: "tertiary", size: "md" }), className)} {...rest}>{children}</A.Cancel>;
});
