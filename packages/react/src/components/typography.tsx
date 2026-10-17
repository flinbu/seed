import * as React from "react";
import { cn } from "../lib/cn.js";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  /** body 16/26 (default) or small 14/22, for the assistant's answers and notes. */
  size?: "body" | "small";
  as?: React.ElementType;
}
/** Styles rendered rich text and Markdown with Seed's reading styles: Noto Serif Light, real headings, quiet tables. */
export const Typography = React.forwardRef<HTMLElement, TypographyProps>(function Typography({ size = "body", as: As = "div", className, ...rest }, ref) {
  return <As ref={ref} className={cn("seed-prose", size === "small" && "seed-prose-small", className)} {...rest} />;
});

const HEADING = { 1: "heading-h1-semibold", 2: "heading-h2-semibold", 3: "heading-h3-semibold", 4: "heading-h4-semibold", 5: "heading-h5-semibold", 6: "heading-h6-semibold" } as const;
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** The element, h1 to h6. Default 2. Pick it for structure. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** The look, when it differs from the level. */
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Domine display title, for hero screens only. */
  display?: boolean;
}
/** A heading whose level (structure) and size (look) are set separately. */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(function Heading({ level = 2, size, display, className, ...rest }, ref) {
  const H = `h${level}` as "h2";
  return <H ref={ref} className={cn("m-0 text-primary", display ? "display-title-regular" : HEADING[size ?? level], className)} {...rest} />;
});

const TEXT = {
  lead: "body-body-1-regular text-secondary", body: "body-body-2-regular text-primary", small: "body-body-3-regular text-primary", muted: "body-body-3-regular text-secondary",
  caption: "body-body-4-regular text-tertiary", reading: "reading-body-light text-primary", label: "mono-label-medium uppercase text-tertiary", value: "mono-value-regular text-primary",
} as const;
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?: keyof typeof TEXT;
  as?: React.ElementType;
}
/** One piece of copy in a Seed type style. label and value are mono, for spec labels and token values. */
export const Text = React.forwardRef<HTMLElement, TextProps>(function Text({ variant = "body", as, className, ...rest }, ref) {
  const As = as ?? (variant === "label" || variant === "value" ? "span" : "p");
  return <As ref={ref} className={cn("m-0", TEXT[variant], className)} {...rest} />;
});
