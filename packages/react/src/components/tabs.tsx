import * as React from "react";
import { Tabs as T } from "radix-ui";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";

type Variant = "line" | "pill";
const VariantCtx = React.createContext<Variant>("line");

/** Switches between views of the same thing. Use links for pages and a ToggleGroup for filters. */
export const Tabs = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof T.Root>>(function Tabs({ className, ...rest }, ref) {
  return <T.Root ref={ref} className={cn("flex min-w-0 flex-col gap-base", className)} {...rest} />;
});

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof T.List> {
  /** line (default): an underline under the page's sections. pill: a segmented control for small views. */
  variant?: Variant;
  /** Tabs share the full width. */
  fullWidth?: boolean;
}
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(function TabsList({ variant = "line", fullWidth, className, ...rest }, ref) {
  return (
    <VariantCtx.Provider value={variant}>
      <T.List ref={ref} className={cn("flex items-center",
        variant === "line" ? "gap-lg border-b border-secondary" : "gap-xxxs self-start rounded-lg bg-tertiary p-xxxs",
        fullWidth && "self-stretch *:flex-1 *:justify-center", className)} {...rest} />
    </VariantCtx.Provider>
  );
});

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof T.Trigger> {
  icon?: IconProp;
  /** A count shown after the label, like the number of tokens in that view. */
  count?: React.ReactNode;
}
export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger({ icon, count, className, children, ...rest }, ref) {
  const v = React.useContext(VariantCtx);
  return (
    <T.Trigger ref={ref} className={cn("inline-flex cursor-pointer items-center gap-xs whitespace-nowrap border-0 bg-transparent font-primary text-secondary label-label-2-medium",
      "transition-[color,background-color,box-shadow] duration-(--duration-fast) hover:not-disabled:text-primary data-[state=active]:text-primary",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:cursor-not-allowed disabled:text-disabled",
      v === "line" ? "-mb-px h-control-md border-b-2 border-solid border-transparent px-0 data-[state=active]:border-current focus-visible:rounded-sm"
        : "h-control-sm rounded-md px-sm data-[state=active]:bg-primary data-[state=active]:shadow-elevation-sm", className)} {...rest}>
      {icon ? <span className="inline-flex leading-none">{renderIcon(icon, "sm")}</span> : null}
      {children}
      {count != null ? <span className="inline-flex h-(--size-xl) min-w-(--size-xl) items-center justify-center rounded-full bg-tertiary px-xxs text-secondary label-label-3-medium">{count}</span> : null}
    </T.Trigger>
  );
});

export const TabsContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof T.Content>>(function TabsContent({ className, ...rest }, ref) {
  return <T.Content ref={ref} className={cn("min-w-0 outline-none focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary", className)} {...rest} />;
});
