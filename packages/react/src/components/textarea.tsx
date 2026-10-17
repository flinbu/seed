import * as React from "react";
import { cn } from "../lib/cn.js";
import { fieldFrame } from "./input.js";
import { useField } from "./field.js";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** false locks the size. Default: vertical resize. */
  resize?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ invalid, resize = true, className, disabled, required, id, rows = 3, ...rest }, ref) {
  const f = useField();
  const bad = invalid ?? f?.invalid, off = disabled ?? f?.disabled;
  return (
    <textarea ref={ref} id={id ?? f?.id} rows={rows} disabled={off} required={required ?? f?.required} aria-invalid={bad || undefined} aria-describedby={f?.describedBy}
      className={cn("block w-full min-h-control-lg px-sm py-xs font-primary body-body-3-regular outline-none placeholder:text-placeholder", fieldFrame,
        resize ? "resize-y" : "resize-none", "focus:border-accent-primary focus:shadow-button-focus-primary",
        bad && "border-error-primary hover:border-error-primary focus:border-error-primary focus:shadow-button-focus-destructive",
        "disabled:bg-disabled-alt disabled:border-disabled-alt disabled:text-disabled disabled:shadow-none disabled:cursor-not-allowed", className)} {...rest} />
  );
});
