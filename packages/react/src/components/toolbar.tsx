import * as React from "react";
import { Toolbar as T } from "radix-ui";
import { cn } from "../lib/cn.js";
import { buttonVariants } from "./button.js";

/** A row of related tools with one Tab stop; arrow keys move between them. Give it an aria-label. */
export const Toolbar = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof T.Root>>(function Toolbar({ className, orientation, ...rest }, ref) {
  return <T.Root ref={ref} orientation={orientation} className={cn("flex w-fit max-w-full items-center gap-xxs rounded-lg border border-secondary bg-primary p-xxs",
    orientation === "vertical" ? "flex-col" : "flex-wrap", className)} {...rest} />;
});
/** Any Seed Button inside a Toolbar: wrap it with asChild so it joins the arrow-key order. */
export const ToolbarButton = T.Button;
export const ToolbarLink = T.Link;
export const ToolbarToggleGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof T.ToggleGroup>>(function ToolbarToggleGroup({ className, ...rest }, ref) {
  return <T.ToggleGroup ref={ref} className={cn("inline-flex items-center gap-px", className)} {...(rest as any)} />;
}) as typeof T.ToggleGroup;
export interface ToolbarToggleItemProps extends React.ComponentPropsWithoutRef<typeof T.ToggleItem> { size?: "sm" | "md" }
export const ToolbarToggleItem = React.forwardRef<HTMLButtonElement, ToolbarToggleItemProps>(function ToolbarToggleItem({ size = "sm", className, ...rest }, ref) {
  return <T.ToggleItem ref={ref} className={cn(buttonVariants({ variant: "ghost", size }), "data-[state=on]:bg-selected data-[state=on]:text-primary", className)} {...rest} />;
});
export const ToolbarSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof T.Separator>>(function ToolbarSeparator({ className, ...rest }, ref) {
  return <T.Separator ref={ref} className={cn("mx-xxs h-(--size-xl) w-px shrink-0 bg-(--border-secondary) data-[orientation=horizontal]:mx-0 data-[orientation=horizontal]:my-xxs data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-auto", className)} {...rest} />;
});
