import * as React from "react";
import { Slider as S } from "radix-ui";
import { cn } from "../lib/cn.js";
import { useField } from "./field.js";

export interface SliderProps extends Omit<React.ComponentPropsWithoutRef<typeof S.Root>, "value" | "defaultValue" | "onValueChange" | "onValueCommit"> {
  /** One number, or two for a range. */
  value?: number | number[];
  defaultValue?: number | number[];
  onValueChange?: (value: number | number[]) => void;
  /** Called when the person lets go. */
  onValueCommit?: (value: number | number[]) => void;
  /** Shows the value at the right of the track. */
  showValue?: boolean;
  /** Formats the shown and announced value, e.g. (v) => `${v}%`. */
  formatValue?: (value: number) => string;
  invalid?: boolean;
  /** Names each thumb for screen readers. Default the Field label, or "Minimum" / "Maximum" for ranges. */
  thumbLabels?: string[];
}

const arr = (v: number | number[] | undefined) => (v === undefined ? undefined : Array.isArray(v) ? v : [v]);

/** Picks a number, or a range, on a track. Pair it with a number field when precision matters. */
export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  { value, defaultValue, onValueChange, onValueCommit, showValue, formatValue, invalid, thumbLabels, min = 0, max = 100, className, disabled, id, ...rest }, ref) {
  const f = useField();
  const single = !Array.isArray(value ?? defaultValue);
  const [inner, setInner] = React.useState<number[]>(arr(defaultValue) ?? [min]);
  const current = arr(value) ?? inner;
  const fmt = formatValue ?? ((v: number) => String(v));
  const out = (v: number[]) => (single ? v[0] : v);
  const off = disabled ?? f?.disabled;
  const labels = thumbLabels ?? (current.length > 1 ? ["Minimum", "Maximum"] : []);
  return (
    <div className={cn("flex min-w-0 items-center gap-sm", className)}>
      <S.Root ref={ref} id={id} min={min} max={max} disabled={off} value={current}
        onValueChange={(v) => { if (value === undefined) setInner(v); onValueChange?.(out(v)); }}
        onValueCommit={(v) => onValueCommit?.(out(v))}
        className="group relative flex h-control-sm min-w-0 flex-1 touch-none select-none items-center data-[disabled]:cursor-not-allowed" {...rest}>
        <S.Track className="relative h-(--size-xs) grow overflow-hidden rounded-full bg-tertiary">
          <S.Range className={cn("absolute h-full rounded-full bg-accent-solid group-data-[disabled]:bg-disabled", invalid && "bg-error-secondary")} />
        </S.Track>
        {current.map((v, i) => (
          <S.Thumb key={i} id={i === 0 ? f?.id : undefined} aria-label={labels[i]} aria-labelledby={labels[i] ? undefined : f?.labelId} aria-valuetext={formatValue ? fmt(v) : undefined}
            aria-describedby={f?.describedBy} aria-invalid={invalid ?? f?.invalid ?? undefined}
            className={cn("block size-(--size-lg) cursor-grab rounded-full border-2 border-accent-primary bg-white shadow-elevation-sm transition-[box-shadow,transform] duration-(--duration-fast)",
              "hover:shadow-button-focus-primary active:cursor-grabbing focus-visible:shadow-button-focus-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
              "data-[disabled]:cursor-not-allowed data-[disabled]:border-disabled data-[disabled]:shadow-none", invalid && "border-error-primary")} />
        ))}
      </S.Root>
      {showValue ? <output className="min-w-(--size-4xl) text-right text-primary tabular-nums label-label-2-medium" aria-live="off">{current.map(fmt).join(" – ")}</output> : null}
    </div>
  );
});
