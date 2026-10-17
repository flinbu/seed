import * as React from "react";
import { cn } from "../lib/cn.js";
import { Label } from "./label.js";

/** What a control inside a Field receives. Seed controls read it with useField(); others get the same props cloned in. */
export interface FieldContextValue { id: string; describedBy?: string; invalid?: boolean; required?: boolean; disabled?: boolean }
const FieldContext = React.createContext<FieldContextValue | null>(null);
export function useField(): FieldContextValue | null { return React.useContext(FieldContext); }

export interface FieldProps {
  label?: React.ReactNode;
  /** Small text at the right of the label, e.g. "Optional". */
  labelAside?: React.ReactNode;
  /** Helper text under the control, linked with aria-describedby. */
  hint?: React.ReactNode;
  /** Error message; also marks the control invalid. */
  error?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  /** Exactly one control: Input, Textarea, Select, Checkbox, Switch… */
  children: React.ReactElement;
}

/** Label, control, hint and error, wired together for screen readers. */
export function Field({ label, labelAside, hint, error, required, disabled, id, className, children }: FieldProps) {
  const auto = React.useId();
  const cid = id ?? (children.props as { id?: string }).id ?? `seed-field-${auto}`;
  const hintId = hint ? `${cid}-hint` : undefined, errId = error ? `${cid}-error` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;
  const ctx: FieldContextValue = { id: cid, describedBy, invalid: !!error, required, disabled };
  return (
    <FieldContext.Provider value={ctx}>
      <div className={cn("flex min-w-0 flex-col gap-xxs", className)}>
        {label || labelAside ? (
          <div className="flex items-baseline justify-between gap-xs">
            {label ? <Label htmlFor={cid} required={required} disabled={disabled}>{label}</Label> : <span />}
            {labelAside ? <span className="body-body-4-regular text-tertiary">{labelAside}</span> : null}
          </div>
        ) : null}
        {children}
        {hint ? <p id={hintId} className="m-0 body-body-4-regular text-tertiary">{hint}</p> : null}
        {error ? (
          <p id={errId} className="m-0 inline-flex items-center gap-xxs body-body-4-regular text-error-primary">
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
