import * as React from "react";
import { cn } from "../lib/cn.js";
import { CheckGlyph, EyeGlyph, EyeOffGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";
import { Input, type InputProps } from "./input.js";

export interface PasswordRequirement { label: React.ReactNode; test: (value: string) => boolean }
export interface PasswordInputProps extends Omit<InputProps, "type" | "rightIcon"> {
  /** Rules shown under the field and marked as they're met. Write them as rules, never as errors. */
  requirements?: PasswordRequirement[];
}

/** A password field with Show/Hide and, when creating one, a live list of requirements. Never blocks paste. */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput({ requirements, value, defaultValue, onChange, autoComplete = "current-password", className, ...rest }, ref) {
  const [shown, setShown] = React.useState(false);
  const [inner, setInner] = React.useState(String(defaultValue ?? ""));
  const v = value !== undefined ? String(value) : inner;
  const id = React.useId();
  return (
    <div className={cn("flex min-w-0 flex-col gap-xs", className)}>
      <Input ref={ref} type={shown ? "text" : "password"} autoComplete={autoComplete} spellCheck={false} value={v}
        onChange={(e) => { if (value === undefined) setInner(e.target.value); onChange?.(e); }}
        aria-describedby={requirements?.length ? id : undefined}
        rightIcon={<Button variant="ghost" size="sm" icon={shown ? <EyeOffGlyph /> : <EyeGlyph />} aria-label={shown ? "Hide password" : "Show password"} aria-pressed={shown}
          onClick={() => setShown(!shown)} className="-mr-xxs" />} className="pr-xxs" {...rest} />
      {requirements?.length ? (
        <ul id={id} aria-label="Password requirements" className="m-0 flex list-none flex-col gap-xxs p-0">
          {requirements.map((r, i) => {
            const ok = r.test(v);
            return (
              <li key={i} className={cn("flex items-center gap-xs body-body-4-regular", ok ? "text-secondary" : "text-tertiary")}>
                <span className={cn("inline-flex size-(--size-lg) items-center justify-center rounded-full border", ok ? "border-transparent bg-success-secondary text-white" : "border-primary")}>{ok ? <CheckGlyph size={10} /> : null}</span>
                {r.label}<span className="sr-only">{ok ? ", done" : ", not yet"}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
});
