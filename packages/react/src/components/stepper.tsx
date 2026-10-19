import * as React from "react";
import { cn } from "../lib/cn.js";
import { CheckGlyph } from "../lib/glyphs.js";

export interface StepperStep { label: React.ReactNode; description?: React.ReactNode; optional?: boolean }
export interface StepperProps extends Omit<React.OlHTMLAttributes<HTMLOListElement>, "onClick"> {
  steps: (string | StepperStep)[];
  /** Index of the step in progress. Default 0. */
  current?: number;
  /** Default 'horizontal'. Vertical suits side panels and narrow screens. */
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md";
  /** Makes finished steps buttons, to go back. */
  onStepClick?: (index: number) => void;
}

/** Where someone is in a flow with a few known steps: onboarding, an import, a wizard. Each step reads number, then name, with a line to the next. */
export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(function Stepper({ steps, current = 0, orientation = "horizontal", size = "md", onStepClick, className, "aria-label": label = "Progress", ...rest }, ref) {
  const vertical = orientation === "vertical";
  const sm = size === "sm";
  // The marker is 24px (16px when small); lines start at its middle.
  const half = sm ? "calc(var(--size-lg)/2)" : "calc(var(--size-xl)/2)";
  return (
    <ol ref={ref} aria-label={label} className={cn("m-0 flex list-none p-0 font-primary", vertical ? "flex-col" : "w-full items-start gap-xs", className)} {...rest}>
      {steps.map((raw, i) => {
        const s: StepperStep = typeof raw === "string" ? { label: raw } : raw;
        const state = i < current ? "done" : i === current ? "current" : "upcoming";
        const last = i === steps.length - 1;
        const dot = (
          <span aria-hidden="true" className={cn("inline-flex shrink-0 items-center justify-center rounded-full border tabular-nums leading-none",
            sm ? "size-(--size-lg) caption-caption-1-medium" : "size-(--size-xl) label-label-3-medium",
            state === "done" && "border-accent-solid bg-accent-solid text-icon-white",
            state === "current" && "border-accent-primary bg-primary text-accent-primary shadow-button-focus-primary",
            state === "upcoming" && "border-primary bg-primary text-tertiary")}>
            {state === "done" ? <CheckGlyph size={sm ? 10 : 12} /> : i + 1}
          </span>
        );
        const text = (
          <span className={cn("sd-stepper__text flex min-w-0 flex-col", !sm && "pt-xxxs")}>
            <span className={cn("truncate", sm ? "label-label-3-medium" : "label-label-2-medium", state === "current" ? "text-primary" : state === "done" ? "text-secondary" : "text-tertiary")}>
              {s.label}{s.optional ? <span className="text-tertiary"> (optional)</span> : null}
            </span>
            {s.description ? <span className={cn("text-tertiary body-body-4-regular", !vertical && "whitespace-nowrap")}>{s.description}</span> : null}
            <span className="sr-only">{state === "done" ? " (done)" : state === "upcoming" ? " (not started)" : ""}</span>
          </span>
        );
        const clickable = state === "done" && !!onStepClick;
        const box = "inline-flex min-w-0 shrink-0 items-start gap-xs text-left";
        const inner = clickable ? (
          <button type="button" onClick={() => onStepClick!(i)}
            className={cn(box, "group cursor-pointer rounded-control border-0 bg-transparent p-0 font-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary [&:hover_.truncate]:text-primary [&:hover_.truncate]:underline [&:hover_.truncate]:underline-offset-3")}>{dot}{text}</button>
        ) : <span className={box}>{dot}{text}</span>;
        const line = !last ? (
          <span aria-hidden="true" className={cn(state === "done" ? "bg-accent-solid" : "bg-(--border-secondary)",
            vertical ? "absolute bottom-xxs w-px" : "h-px min-w-(--space-base) flex-1 self-start")}
            style={vertical ? { left: half, top: `calc(${sm ? "var(--size-lg)" : "var(--size-xl)"} + var(--space-xxs))` } : { marginTop: half }} />
        ) : null;
        return (
          <li key={i} aria-current={state === "current" ? "step" : undefined}
            className={cn("sd-stepper__step", `sd-stepper__step--${state}`, vertical ? "relative pb-base last:pb-0" : cn("flex items-center gap-xs", last ? "flex-none" : "flex-[1_0_auto]"))}>
            {inner}
            {line}
          </li>
        );
      })}
    </ol>
  );
});
