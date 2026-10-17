import * as React from "react";
import { cn } from "../lib/cn.js";
import { useField } from "./field.js";

export interface OtpInputProps {
  /** Number of cells. Default 6. */
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Called once every cell is filled. */
  onComplete?: (value: string) => void;
  /** Letters and digits. Default digits only. */
  alphanumeric?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Put a gap after this many cells, like 3 for "123 456". */
  groupSize?: number;
  id?: string;
  name?: string;
  "aria-label"?: string;
  className?: string;
}

/** One-time codes: one cell per character. Paste fills every cell and phones offer the code from a text message. */
export const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(function OtpInput(
  { length = 6, value, defaultValue = "", onChange, onComplete, alphanumeric, invalid, disabled, autoFocus, groupSize, id, name, className, "aria-label": label }, ref) {
  const f = useField();
  const [inner, setInner] = React.useState(defaultValue);
  const code = (value ?? inner).slice(0, length);
  const cells = React.useRef<(HTMLInputElement | null)[]>([]);
  const allowed = alphanumeric ? /[a-z0-9]/i : /[0-9]/;
  const clean = (s: string) => s.split("").filter((c) => allowed.test(c)).join("").toUpperCase();
  const bad = invalid ?? f?.invalid, off = disabled ?? f?.disabled;
  function set(next: string) {
    next = next.slice(0, length);
    if (value === undefined) setInner(next);
    onChange?.(next);
    if (next.length === length && code.length !== length) onComplete?.(next);
  }
  const focus = (i: number) => { const el = cells.current[Math.max(0, Math.min(length - 1, i))]; el?.focus(); el?.select(); };
  function write(i: number, chars: string) {
    const c = clean(chars);
    if (!c) return;
    const arr = code.padEnd(i, " ").split("");
    for (let k = 0; k < c.length && i + k < length; k++) arr[i + k] = c[k];
    const next = arr.join("").replace(/\s+$/, "");
    set(next);
    focus(i + c.length);
  }
  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (code[i]) set(code.slice(0, i) + code.slice(i + 1));
      else if (i > 0) { set(code.slice(0, i - 1) + code.slice(i)); focus(i - 1); }
    } else if (e.key === "ArrowLeft") { e.preventDefault(); focus(i - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); focus(i + 1); }
    else if (e.key === "Home") { e.preventDefault(); focus(0); }
    else if (e.key === "End") { e.preventDefault(); focus(code.length); }
  }
  const baseId = id ?? f?.id;
  return (
    <div ref={ref} role="group" aria-label={label ?? (f?.labelId ? undefined : "Verification code")} aria-labelledby={label ? undefined : f?.labelId} aria-describedby={f?.describedBy} className={cn("inline-flex items-center gap-xs", className)}>
      {Array.from({ length }, (_, i) => (
        <React.Fragment key={i}>
          {groupSize && i > 0 && i % groupSize === 0 ? <span aria-hidden="true" className="w-(--space-xs)" /> : null}
          <input ref={(n) => { cells.current[i] = n; }} id={i === 0 ? baseId : undefined} name={i === 0 ? name : undefined}
            value={code[i] ?? ""} disabled={off} autoFocus={autoFocus && i === 0}
            inputMode={alphanumeric ? "text" : "numeric"} autoComplete={i === 0 ? "one-time-code" : "off"} maxLength={length}
            aria-label={`Character ${i + 1} of ${length}`} aria-invalid={bad || undefined}
            onFocus={(e) => e.target.select()}
            onChange={(e) => { const v = e.target.value; write(i, v.length > 1 ? v.replace(code[i] ?? "", "") || v : v); }}
            onPaste={(e) => { e.preventDefault(); write(i, e.clipboardData.getData("text")); }}
            onKeyDown={(e) => onKeyDown(i, e)}
            className={cn("size-(--size-5xl) rounded-control border border-primary bg-primary text-center text-primary shadow-elevation-raised outline-none font-mono heading-h6-semibold caret-transparent",
              "transition-[border-color,box-shadow] duration-(--duration-fast) hover:border-primary-solid focus:border-accent-primary focus:shadow-button-focus-primary",
              bad && "border-error-primary hover:border-error-primary focus:border-error-primary focus:shadow-button-focus-destructive",
              "disabled:cursor-not-allowed disabled:border-disabled-alt disabled:bg-disabled-alt disabled:text-disabled disabled:shadow-none")} />
        </React.Fragment>
      ))}
    </div>
  );
});
