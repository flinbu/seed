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
  // The description keeps text-tertiary when the control is disabled: WCAG exempts the control, not the sentence
  // that explains it ("Needs a Pro plan"), so it stays at 4.5:1.
  return (
    <div className={cn("inline-flex items-start gap-xs", className)}>
      {control}
      <span className="flex flex-col gap-xxxs">
        {label ? <Label htmlFor={id} disabled={disabled} className="body-body-3-regular">{label}</Label> : null}
        {description ? <span id={`${id}-desc`} className="body-body-3-regular text-tertiary">{description}</span> : null}
      </span>
    </div>
  );
}
