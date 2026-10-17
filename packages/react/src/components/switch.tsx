import * as React from "react";
import { Switch as RadixSwitch } from "radix-ui";
import { cn } from "../lib/cn.js";
import { ChoiceLayout, type ChoiceText } from "./choice.js";
import { useField } from "./field.js";

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>, ChoiceText {
  /** Default 'md' (40 × 20); 'sm' is 32 × 16. */
  size?: "sm" | "md";
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch({ label, description, size = "md", id, disabled, className, ...rest }, ref) {
  const f = useField();
  const auto = React.useId();
  const cid = id ?? f?.id ?? `seed-switch-${auto}`;
  const off = disabled ?? f?.disabled;
  const control = (
    <RadixSwitch.Root ref={ref} id={cid} disabled={off} aria-describedby={[description ? `${cid}-desc` : null, f?.describedBy].filter(Boolean).join(" ") || undefined}
      className={cn("group relative mt-px inline-flex shrink-0 cursor-pointer items-center rounded-full bg-icon-tertiary transition-colors duration-(--duration-fast)",
        size === "sm" ? "h-(--size-lg) w-(--size-3xl)" : "h-(--size-xl) w-(--size-4xl)",
        "hover:bg-icon-secondary data-[state=checked]:bg-accent-solid data-[state=checked]:hover:bg-accent-solid-hover",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
        "disabled:cursor-not-allowed disabled:bg-disabled-alt", label || description ? "" : className)} {...rest}>
      <RadixSwitch.Thumb className={cn("pointer-events-none block translate-x-xxxs rounded-full bg-white shadow-elevation-sm transition-transform duration-(--duration-fast)",
        size === "sm" ? "size-(--size-md) data-[state=checked]:translate-x-[calc(var(--size-lg)+var(--space-xxxs))]" : "size-(--size-lg) data-[state=checked]:translate-x-[calc(var(--size-xl)+var(--space-xxxs))]",
        "group-disabled:bg-disabled group-disabled:shadow-none")} />
    </RadixSwitch.Root>
  );
  return <ChoiceLayout id={cid} label={label} description={description} disabled={off} control={control} className={className} />;
});
