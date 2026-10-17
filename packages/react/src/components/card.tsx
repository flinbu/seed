import * as React from "react";
import { cn } from "../lib/cn.js";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Hover elevation and pointer cursor, for a card that opens something. Put the real link or button inside. */
  interactive?: boolean;
}
export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card({ interactive, className, ...rest }, ref) {
  return <div ref={ref} className={cn("flex min-w-0 flex-col rounded-xl border border-secondary bg-primary text-primary shadow-elevation-raised",
    interactive && "cursor-pointer transition-[box-shadow,border-color] duration-(--duration-fast) hover:border-primary hover:shadow-elevation-md", className)} {...rest} />;
});
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardHeader({ className, ...rest }, ref) {
  return <div ref={ref} className={cn("flex flex-col gap-xxs px-lg pt-lg", className)} {...rest} />;
});
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> { as?: "h2" | "h3" | "h4" }
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle({ as: As = "h3", className, ...rest }, ref) {
  return <As ref={ref} className={cn("m-0 text-primary label-label-1-semibold", className)} {...rest} />;
});
export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(function CardDescription({ className, ...rest }, ref) {
  return <p ref={ref} className={cn("m-0 text-secondary body-body-3-regular", className)} {...rest} />;
});
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardContent({ className, ...rest }, ref) {
  return <div ref={ref} className={cn("px-lg py-base", className)} {...rest} />;
});
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function CardFooter({ className, ...rest }, ref) {
  return <div ref={ref} className={cn("flex items-center justify-end gap-xs px-lg pb-lg", className)} {...rest} />;
});
