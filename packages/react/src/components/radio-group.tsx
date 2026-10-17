import * as React from "react";
import { RadioGroup as RadixRadio } from "radix-ui";
import { cn } from "../lib/cn.js";
import { ChoiceLayout, type ChoiceText } from "./choice.js";

const InvalidContext = React.createContext(false);

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadixRadio.Root> {
  /** Default 'vertical'. */
  orientation?: "vertical" | "horizontal";
  invalid?: boolean;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup({ orientation = "vertical", invalid, className, ...rest }, ref) {
  return (
    <InvalidContext.Provider value={!!invalid}>
      <RadixRadio.Root ref={ref} orientation={orientation} aria-invalid={invalid || undefined}
        className={cn("flex", orientation === "horizontal" ? "flex-row flex-wrap gap-lg" : "flex-col gap-sm", className)} {...rest} />
    </InvalidContext.Provider>
  );
});

export interface RadioProps extends React.ComponentPropsWithoutRef<typeof RadixRadio.Item>, ChoiceText {}

export const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(function Radio({ label, description, id, disabled, className, ...rest }, ref) {
  const invalid = React.useContext(InvalidContext);
  const auto = React.useId();
  const cid = id ?? `seed-radio-${auto}`;
  const control = (
    <RadixRadio.Item ref={ref} id={cid} disabled={disabled} aria-describedby={description ? `${cid}-desc` : undefined}
      className={cn("mt-xxxs inline-flex size-(--size-lg) shrink-0 cursor-pointer items-center justify-center rounded-full border border-icon-tertiary bg-primary",
        "hover:border-icon-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
        "data-[state=checked]:border-(--bg-accent-solid) data-[state=checked]:bg-accent-solid",
        invalid && "border-error-primary",
        "disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled-alt", label || description ? "" : className)} {...rest}>
      <RadixRadio.Indicator className="size-(--size-xs) rounded-full bg-icon-white [[data-disabled]_&]:bg-icon-disabled" />
    </RadixRadio.Item>
  );
  return <ChoiceLayout id={cid} label={label} description={description} disabled={disabled} control={control} className={className} />;
});
