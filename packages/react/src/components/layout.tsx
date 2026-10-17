import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn.js";

/* Gaps come from Seed's space scale, so layouts follow the theme's density. */
const GAP = { none: "gap-0", xxxs: "gap-xxxs", xxs: "gap-xxs", xs: "gap-xs", sm: "gap-sm", base: "gap-base", md: "gap-md", lg: "gap-lg", xl: "gap-xl", "2xl": "gap-2xl", "3xl": "gap-3xl", "4xl": "gap-4xl" } as const;
const ALIGN = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch", baseline: "items-baseline" } as const;
const JUSTIFY = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between", around: "justify-around", evenly: "justify-evenly" } as const;
export type Gap = keyof typeof GAP;

interface FlexProps extends React.HTMLAttributes<HTMLElement> {
  gap?: Gap;
  align?: keyof typeof ALIGN;
  justify?: keyof typeof JUSTIFY;
  /** Renders your own element with these styles. */
  asChild?: boolean;
  as?: React.ElementType;
}

export interface StackProps extends FlexProps {
  /** A 1px line between children. */
  divider?: boolean;
}
/** Children in a column with a token gap. Use it instead of margins between siblings. Default gap 'base'. */
export const Stack = React.forwardRef<HTMLElement, StackProps>(function Stack({ gap = "base", align, justify, divider, asChild, as: As = "div", className, children, ...rest }, ref) {
  const C: any = asChild ? Slot.Root : As;
  const kids = divider
    ? React.Children.toArray(children).filter(Boolean).flatMap((c, i) => (i ? [<div key={`d${i}`} role="none" className="h-px w-full shrink-0 bg-(--border-secondary)" />, c] : [c]))
    : children;
  return <C ref={ref} className={cn("flex min-w-0 flex-col", GAP[gap], align && ALIGN[align], justify && JUSTIFY[justify], className)} {...rest}>{kids}</C>;
});

export interface InlineProps extends FlexProps {
  /** Default true. */
  wrap?: boolean;
}
/** Children in a row that wraps: badges, button rows, a title with its actions. Default gap 'xs', centered. */
export const Inline = React.forwardRef<HTMLElement, InlineProps>(function Inline({ gap = "xs", align = "center", justify, wrap = true, asChild, as: As = "div", className, ...rest }, ref) {
  const C: any = asChild ? Slot.Root : As;
  return <C ref={ref} className={cn("flex min-w-0 flex-row", wrap ? "flex-wrap" : "flex-nowrap", GAP[gap], ALIGN[align], justify && JUSTIFY[justify], className)} {...rest} />;
});

const gridVariants = cva("grid min-w-0", {
  variants: {
    columns: { 1: "grid-cols-1", 2: "grid-cols-1 sm:grid-cols-2", 3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", 4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", 6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6", 12: "grid-cols-12" },
    minChild: { none: "", xs: "grid-cols-[repeat(auto-fill,minmax(min(var(--container-3xs),100%),1fr))]", sm: "grid-cols-[repeat(auto-fill,minmax(min(var(--container-2xs),100%),1fr))]", md: "grid-cols-[repeat(auto-fill,minmax(min(var(--container-xs),100%),1fr))]", lg: "grid-cols-[repeat(auto-fill,minmax(min(var(--container-sm),100%),1fr))]" },
  },
  defaultVariants: { minChild: "none" },
});
export interface GridProps extends Omit<FlexProps, "justify">, VariantProps<typeof gridVariants> {}
/**
 * Equal columns that collapse on small screens (columns), or as many columns of at least a size as fit (minChild:
 * xs 16rem, sm 18rem, md 20rem, lg 24rem). Default gap 'base'.
 */
export const Grid = React.forwardRef<HTMLElement, GridProps>(function Grid({ gap = "base", align, columns, minChild, asChild, as: As = "div", className, ...rest }, ref) {
  const C: any = asChild ? Slot.Root : As;
  return <C ref={ref} className={cn(gridVariants({ columns: minChild && minChild !== "none" ? undefined : columns ?? 2, minChild }), GAP[gap], align && ALIGN[align], className)} {...rest} />;
});

const containerVariants = cva("mx-auto box-border w-full", {
  variants: {
    size: { sm: "max-w-2xl", md: "max-w-3xl", lg: "max-w-5xl", xl: "max-w-7xl", prose: "max-w-prose", full: "max-w-none" },
    padding: { true: "px-base md:px-lg xl:px-2xl", false: "" },
  },
  defaultVariants: { size: "lg", padding: true },
});
export interface ContainerProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof containerVariants> { asChild?: boolean; as?: React.ElementType }
/** Centers content at a readable width (sm 672, md 768, lg 1024, xl 1280, prose 65ch) with gutters that grow with the screen. */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(function Container({ size, padding, asChild, as: As = "div", className, ...rest }, ref) {
  const C: any = asChild ? Slot.Root : As;
  return <C ref={ref} className={cn(containerVariants({ size, padding }), className)} {...rest} />;
});

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  /** Shows itself while focused: use it for "Skip to content" links. */
  focusable?: boolean;
  as?: React.ElementType;
  href?: string;
}
/** Text for screen readers only. If sighted people would benefit too, show it instead. */
export const VisuallyHidden = React.forwardRef<HTMLElement, VisuallyHiddenProps>(function VisuallyHidden({ focusable, as: As = "span", className, ...rest }, ref) {
  return <As ref={ref} className={cn(focusable
    ? "sr-only focus:not-sr-only focus:fixed focus:top-xs focus:left-xs focus:z-[100] focus:rounded-control focus:border focus:border-accent-primary focus:bg-elevated focus:px-sm focus:py-xs focus:text-primary focus:shadow-elevation-lg focus:outline-2 focus:outline-offset-2 focus:outline-accent-primary label-label-2-medium"
    : "sr-only", className)} {...rest} />;
});
