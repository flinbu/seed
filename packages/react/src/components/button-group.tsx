import * as React from "react";
import { cn } from "../lib/cn.js";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

/** Joins related Buttons into one control: a split button with its menu, Undo and Redo, a stepper. Give it an aria-label. */
export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup({ orientation = "horizontal", className, ...rest }, ref) {
  const v = orientation === "vertical";
  return (
    <div ref={ref} role="group" className={cn("inline-flex w-fit items-stretch isolate",
      v ? "flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none"
        : "[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
      "[&>*]:shadow-none [&>*:focus-visible]:z-10 [&>*:hover]:z-[1]", className)} {...rest} />
  );
});

/** Text inside a ButtonGroup, like a unit or the current page. */
export const ButtonGroupText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(function ButtonGroupText({ className, ...rest }, ref) {
  return <span ref={ref} className={cn("inline-flex items-center rounded-control border border-primary bg-secondary px-sm text-secondary label-label-2-medium", className)} {...rest} />;
});
