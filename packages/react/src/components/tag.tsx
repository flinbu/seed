import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { XGlyph } from "../lib/glyphs.js";

type Variant = "neutral" | "accent" | "success" | "warning" | "error";
const TONE: Record<Variant, string> = {
  neutral: "border-secondary bg-primary text-primary",
  accent: "border-info-secondary bg-accent-primary text-info-primary-hover",
  success: "border-success-secondary bg-success-primary text-success-primary-hover",
  warning: "border-warning-secondary bg-warning-primary text-warning-primary-hover",
  error: "border-error-secondary bg-error-primary text-error-primary",
};

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onClick"> {
  variant?: Variant;
  /** md 32 (default), sm 24 px. */
  size?: "sm" | "md";
  icon?: IconProp;
  /** A CSS color shown as a chip, for tokens. */
  swatch?: string;
  /** Makes it a toggle button; pass selected for its state. */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selected?: boolean;
  /** Adds a remove button named "Remove {text}". */
  onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  removeLabel?: string;
  disabled?: boolean;
}

/** A small label people act on: filter by it, remove it, or read a token's color. Use Badge for status nobody clicks. */
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(function Tag({ variant = "neutral", size = "md", icon, swatch, onClick, selected, onRemove, removeLabel, disabled, className, children, ...rest }, ref) {
  const pad = size === "sm" ? "px-xxs" : "px-xs";
  const inner = (
    <>
      {swatch ? <span aria-hidden="true" className="size-(--size-md) shrink-0 rounded-sm shadow-[inset_0_0_0_1px_var(--border-secondary)]" style={{ background: swatch }} /> : null}
      {icon ? <span className="inline-flex shrink-0 leading-none">{renderIcon(icon, "xs")}</span> : null}
      <span className="min-w-0 truncate">{children}</span>
    </>
  );
  return (
    <span ref={ref} className={cn("inline-flex max-w-full items-center rounded-control border align-middle whitespace-nowrap font-primary label-label-3-medium",
      size === "sm" ? "h-(--size-2xl)" : "h-control-sm", TONE[variant], selected && "border-primary bg-selected", disabled && "bg-disabled-alt text-disabled", className)} {...rest}>
      {onClick ? (
        <button type="button" disabled={disabled} aria-pressed={selected !== undefined ? !!selected : undefined} onClick={onClick}
          className={cn("inline-flex h-full min-w-0 cursor-pointer items-center gap-xxs rounded-control border-0 bg-transparent text-inherit [font:inherit] hover:not-disabled:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-primary disabled:cursor-not-allowed", pad)}>{inner}</button>
      ) : <span className={cn("inline-flex min-w-0 items-center gap-xxs", pad)}>{inner}</span>}
      {onRemove && !disabled ? (
        <button type="button" aria-label={removeLabel ?? `Remove ${typeof children === "string" ? children : "tag"}`} onClick={(e) => { e.stopPropagation(); onRemove(e); }}
          className={cn("-ml-xxs mr-xxxs inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-icon-tertiary hover:bg-tertiary hover:text-icon-primary focus-visible:outline-2 focus-visible:outline-accent-primary",
            size === "sm" ? "size-(--size-lg)" : "size-(--size-xl)")}><XGlyph size={12} /></button>
      ) : null}
    </span>
  );
});
