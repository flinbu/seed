import * as React from "react";
import { Label as RadixLabel } from "radix-ui";
import { cn } from "../lib/cn.js";

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof RadixLabel.Root> {
  /** Adds a red asterisk (decorative; also set required on the control). */
  required?: boolean;
  disabled?: boolean;
  /** Default 'md' (14px); 'sm' is 12px. */
  size?: "sm" | "md";
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label({ required, disabled, size = "md", className, children, ...rest }, ref) {
  return (
    <RadixLabel.Root ref={ref} className={cn("inline-block text-primary cursor-default [&[for]]:cursor-pointer", size === "sm" ? "label-label-3-medium" : "label-label-2-medium",
      disabled && "text-disabled cursor-not-allowed [&[for]]:cursor-not-allowed", className)} {...rest}>
      {children}
      {required ? <span aria-hidden="true" className="text-error-primary"> *</span> : null}
    </RadixLabel.Root>
  );
});
