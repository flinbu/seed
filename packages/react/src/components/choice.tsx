import * as React from "react";
import { cn } from "../lib/cn.js";
import { Label } from "./label.js";

export interface ChoiceText {
  /** Rendered with Label and linked to the control. */
  label?: React.ReactNode;
  /** Helper line under the label, linked with aria-describedby. */
  description?: React.ReactNode;
}

/** Lays out a checkbox, radio or switch with its label and description. */
export function ChoiceLayout({ id, label, description, disabled, control, className }: ChoiceText & { id: string; disabled?: boolean; control: React.ReactNode; className?: string }) {
  if (!label && !description) return <>{control}</>;
  return (
    <div className={cn("inline-flex items-start gap-xs", className)}>
      {control}
      <span className="flex flex-col gap-xxxs">
        {label ? <Label htmlFor={id} disabled={disabled} className="body-body-3-regular">{label}</Label> : null}
        {description ? <span id={`${id}-desc`} className={cn("body-body-3-regular", disabled ? "text-disabled" : "text-tertiary")}>{description}</span> : null}
      </span>
    </div>
  );
}
