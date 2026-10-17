import * as React from "react";
import { Checkbox as RadixCheckbox } from "radix-ui";
import { cn } from "../lib/cn.js";
import { ChoiceLayout, type ChoiceText } from "./choice.js";
import { useField } from "./field.js";

type RadixProps = React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>;
export interface CheckboxProps extends Omit<RadixProps, "checked" | "defaultChecked" | "onCheckedChange">, ChoiceText {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Shows a dash: some, not all, children are selected. */
  indeterminate?: boolean;
  invalid?: boolean;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { label, description, checked, defaultChecked, onCheckedChange, indeterminate, invalid, disabled, id, className, ...rest }, ref) {
  const f = useField();
  const auto = React.useId();
  const cid = id ?? f?.id ?? `seed-checkbox-${auto}`;
  const off = disabled ?? f?.disabled, bad = invalid ?? f?.invalid;
  const state = indeterminate ? "indeterminate" : checked;
  const control = (
    <RadixCheckbox.Root ref={ref} id={cid} disabled={off} checked={state} defaultChecked={defaultChecked}
      onCheckedChange={(v) => onCheckedChange?.(v === true)} aria-invalid={bad || undefined}
      aria-describedby={[description ? `${cid}-desc` : null, f?.describedBy].filter(Boolean).join(" ") || undefined}
      className={cn("peer group mt-xxxs inline-flex size-(--size-lg) shrink-0 cursor-pointer items-center justify-center rounded-sm border border-icon-tertiary bg-primary text-icon-white",
        "hover:border-icon-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
        "data-[state=checked]:border-(--bg-accent-solid) data-[state=checked]:bg-accent-solid data-[state=indeterminate]:border-(--bg-accent-solid) data-[state=indeterminate]:bg-accent-solid",
        bad && "border-error-primary",
        "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled-alt disabled:text-icon-disabled", label || description ? "" : className)} {...rest}>
      <RadixCheckbox.Indicator className="inline-flex">
        {state === "indeterminate"
          ? <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>
          : <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>}
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
  );
  return <ChoiceLayout id={cid} label={label} description={description} disabled={off} control={control} className={className} />;
});
