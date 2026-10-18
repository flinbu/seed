import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { CheckGlyph, ChevronRightGlyph, CircleDashedGlyph, CircleXGlyph } from "../lib/glyphs.js";
import { Spinner } from "./spinner.js";

export interface TraceStep {
  id?: string | number;
  /** Past tense once done ("Read tokens.json"), present while running ("Drafting a proposal"). */
  title: React.ReactNode;
  /** A count or duration, kept short. */
  description?: React.ReactNode;
  icon?: IconProp;
  /** Omit when done. */
  status?: "running" | "error" | "pending";
  /** Makes the row expand. */
  detail?: React.ReactNode;
  href?: string;
  defaultOpen?: boolean;
}
export interface TraceProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  steps: TraceStep[];
  /** One line that folds the whole trace ("Pluto checked your Dark theme · 6s"). */
  summary?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const STATUS_TEXT = { running: "In progress", error: "Failed", pending: "Not started" } as const;
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent-primary";

function Step({ step, last }: { step: TraceStep; last: boolean }) {
  const [open, setOpen] = React.useState(!!step.defaultOpen);
  const id = React.useId();
  const st = step.status;
  const icon = st === "running" ? <Spinner size="sm" label={null} />
    : st === "error" ? <CircleXGlyph size={16} />
    : st === "pending" ? <CircleDashedGlyph size={16} />
    : renderIcon(step.icon ?? CheckGlyph, "sm");
  const row = (
    <>
      <span className={cn("relative inline-flex w-(--size-lg) shrink-0 justify-center bg-primary leading-none",
        st === "error" ? "text-error-primary" : st === "running" ? "text-icon-accent-primary" : "text-icon-tertiary")}>{icon}</span>
      <span className={cn("min-w-0 truncate body-body-3-regular", st === "error" ? "text-error-primary" : st === "pending" ? "text-tertiary" : "text-primary", st === "running" && "seed-shimmer")}>
        {step.title}{st ? <span className="sr-only">, {STATUS_TEXT[st]}</span> : null}
      </span>
      {step.description ? <span className="shrink-0 text-tertiary tabular-nums body-body-4-regular">{step.description}</span> : null}
      {step.detail ? <span className={cn("inline-flex leading-none text-icon-tertiary transition-transform duration-(--duration-base) motion-reduce:transition-none", open && "rotate-90")}><ChevronRightGlyph size={12} /></span> : null}
    </>
  );
  const line = "flex min-h-(--size-2xl) w-full items-center gap-xs rounded-control px-xxs py-xxxs text-left text-secondary no-underline";
  return (
    <li className="relative">
      {!last ? <span aria-hidden="true" className="absolute top-(--size-2xl) -bottom-(--size-xxs) left-[calc(var(--space-xxs)+var(--size-sm))] w-px bg-(--border-secondary)" /> : null}
      {step.detail ? (
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}
          className={cn(line, "m-0 cursor-pointer border-0 bg-transparent font-primary hover:bg-primary-hover", focusRing)}>{row}</button>
      ) : step.href ? <a href={step.href} className={cn(line, "hover:bg-primary-hover", focusRing)}>{row}</a> : <span className={line}>{row}</span>}
      {step.detail ? (
        <div id={id} hidden={!open} className="mt-xxxs mb-xs ml-[calc(var(--size-lg)+var(--space-xs)+var(--space-xxs))] rounded-md bg-secondary px-sm py-xs text-secondary body-body-3-regular">{step.detail}</div>
      ) : null}
    </li>
  );
}

/** The steps behind an answer: what Pluto read, checked, found and is doing now. */
export const Trace = React.forwardRef<HTMLDivElement, TraceProps>(function Trace(
  { steps, summary, open, defaultOpen = true, onOpenChange, className, "aria-label": label, ...rest }, ref) {
  const [inner, setInner] = React.useState(defaultOpen);
  const isOpen = open ?? inner;
  const id = React.useId();
  const running = steps.some((s) => s.status === "running");
  const toggle = () => { if (open === undefined) setInner(!isOpen); onOpenChange?.(!isOpen); };
  return (
    <div ref={ref} aria-busy={running || undefined} className={cn("flex flex-col gap-xxs font-primary", className)} {...rest}>
      {summary ? (
        <button type="button" aria-expanded={isOpen} aria-controls={id} onClick={toggle}
          className={cn("m-0 flex cursor-pointer items-center gap-xs self-start rounded-control border-0 bg-transparent px-xxs py-xxxs text-left font-primary text-secondary hover:bg-primary-hover", focusRing)}>
          <span className={cn("body-body-3-regular", running && "seed-shimmer")}>{summary}</span>
          <span className={cn("inline-flex leading-none text-icon-tertiary transition-transform duration-(--duration-base) motion-reduce:transition-none", isOpen && "rotate-90")}><ChevronRightGlyph size={12} /></span>
        </button>
      ) : null}
      <ol id={id} hidden={summary ? !isOpen : undefined} aria-label={summary ? undefined : label ?? "Steps"} className="relative m-0 flex list-none flex-col p-0">
        {steps.map((s, i) => <Step key={s.id ?? i} step={s} last={i === steps.length - 1} />)}
      </ol>
    </div>
  );
});
