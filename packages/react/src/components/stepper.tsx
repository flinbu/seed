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

/** Where someone is in a flow with a few known steps: onboarding, an import, a wizard. */
export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(function Stepper({ steps, current = 0, orientation = "horizontal", size = "md", onStepClick, className, "aria-label": label = "Progress", ...rest }, ref) {
  const vertical = orientation === "vertical";
  return (
    <ol ref={ref} aria-label={label} className={cn("m-0 flex list-none p-0", vertical ? "flex-col" : "items-start", className)} {...rest}>
      {steps.map((raw, i) => {
        const s: StepperStep = typeof raw === "string" ? { label: raw } : raw;
        const state = i < current ? "done" : i === current ? "current" : "upcoming";
        const last = i === steps.length - 1;
        const dot = (
          <span className={cn("relative z-[1] inline-flex shrink-0 items-center justify-center rounded-full border font-primary tabular-nums",
            size === "sm" ? "size-(--size-xl) label-label-3-semibold" : "size-(--size-2xl) label-label-3-semibold",
            state === "done" && "border-accent-primary bg-accent-solid text-on-accent",
            state === "current" && "border-accent-primary bg-primary text-accent-primary shadow-button-focus-primary",
            state === "upcoming" && "border-primary bg-primary text-tertiary")}>
            {state === "done" ? <CheckGlyph size={size === "sm" ? 12 : 14} /> : i + 1}
          </span>
        );
        const text = (
          <span className={cn("flex min-w-0 flex-col gap-px", !vertical && "items-center text-center")}>
            <span className={cn(size === "sm" ? "label-label-3-medium" : "label-label-2-medium", state === "upcoming" ? "text-secondary" : "text-primary")}>
              {s.label}{s.optional ? <span className="text-tertiary"> (optional)</span> : null}
            </span>
            {s.description ? <span className="text-tertiary body-body-4-regular">{s.description}</span> : null}
            <span className="sr-only">{state === "done" ? ", done" : state === "current" ? ", current step" : ""}</span>
          </span>
        );
        const clickable = state === "done" && !!onStepClick;
        const inner = clickable ? (
          <button type="button" onClick={() => onStepClick!(i)}
            className={cn("flex cursor-pointer gap-xs rounded-md border-0 bg-transparent p-0 text-left font-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
              vertical ? "flex-row items-start" : "flex-col items-center")}>{dot}{text}</button>
        ) : <div className={cn("flex gap-xs", vertical ? "flex-row items-start" : "flex-col items-center")}>{dot}{text}</div>;
        return (
          <li key={i} aria-current={state === "current" ? "step" : undefined} className={cn("relative flex", vertical ? "pb-lg last:pb-0" : "flex-1 justify-center")}>
            {!last ? (
              <span aria-hidden="true" className={cn("absolute", state === "done" ? "bg-accent-solid" : "bg-(--border-secondary)",
                vertical ? cn("w-px top-(--size-2xl) bottom-0", size === "sm" ? "left-[calc(var(--size-xl)/2)]" : "left-[calc(var(--size-2xl)/2)]")
                  : cn("h-px left-[50%] right-[-50%]", size === "sm" ? "top-[calc(var(--size-xl)/2)]" : "top-[calc(var(--size-2xl)/2)]"))} />
            ) : null}
            {inner}
          </li>
        );
      })}
    </ol>
  );
});
