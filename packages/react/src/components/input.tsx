import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { useField } from "./field.js";

const SIZE = { sm: "h-control-sm px-xs body-body-3-regular", md: "h-control-md px-sm body-body-3-regular", lg: "h-control-lg px-base body-body-2-regular" } as const;
/** Shared look of Input, Textarea and Select triggers. */
export const fieldFrame = cn(
  "bg-primary text-primary border border-primary rounded-control shadow-elevation-raised",
  "transition-[border-color,box-shadow] duration-(--duration-fast)",
  "hover:border-primary-solid",
);

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** sm 32, md 40 (default), lg 48 px tall; follows the theme's density. */
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  leftIcon?: IconProp;
  /** An icon, or a small ghost Button for an action inside the field (clear, show password). */
  rightIcon?: IconProp | React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ size = "md", invalid, leftIcon, rightIcon, className, disabled, required, id, ...rest }, ref) {
  const f = useField();
  const bad = invalid ?? f?.invalid, off = disabled ?? f?.disabled;
  const right = rightIcon && (React.isValidElement(rightIcon) || typeof rightIcon === "function" || typeof rightIcon === "object") ? renderIcon(rightIcon as IconProp, "sm") : rightIcon;
  return (
    <div className={cn("flex items-center gap-xs", fieldFrame, SIZE[size], "focus-within:border-accent-primary focus-within:shadow-button-focus-primary",
      bad && "border-error-primary hover:border-error-primary focus-within:border-error-primary focus-within:shadow-button-focus-destructive",
      off && "bg-disabled-alt border-disabled-alt hover:border-disabled-alt text-disabled shadow-none", className)}>
      {leftIcon ? <span className={cn("inline-flex leading-none", off ? "text-icon-disabled" : "text-icon-tertiary")}>{renderIcon(leftIcon, "sm")}</span> : null}
      <input ref={ref} id={id ?? f?.id} disabled={off} required={required ?? f?.required} aria-invalid={bad || undefined} aria-describedby={f?.describedBy}
        className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-primary text-inherit outline-none placeholder:text-placeholder disabled:cursor-not-allowed [font-size:inherit] [line-height:inherit] [font-weight:inherit]" {...rest} />
      {right ? <span className={cn("inline-flex leading-none", off ? "text-icon-disabled" : "text-icon-tertiary")}>{right}</span> : null}
    </div>
  );
});
