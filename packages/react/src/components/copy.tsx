import * as React from "react";
import { cn } from "../lib/cn.js";
import { CheckGlyph, CopyGlyph, EyeGlyph, EyeOffGlyph } from "../lib/glyphs.js";
import { Button, type ButtonProps } from "./button.js";
import { Tooltip } from "./tooltip.js";
import { fieldFrame } from "./input.js";
import { useField } from "./field.js";

async function write(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const ta = document.createElement("textarea");
  ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand?.("copy"); } finally { document.body.removeChild(ta); }
}

/** Copies text and reports it for 2 seconds. Returns [copied, copy]. */
export function useCopy(timeout = 2000): [boolean, (text: string) => Promise<void>] {
  const [done, setDone] = React.useState(false);
  const t = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(t.current), []);
  return [done, async (text: string) => { await write(text); setDone(true); clearTimeout(t.current); t.current = setTimeout(() => setDone(false), timeout); }];
}

export interface CopyButtonProps extends Omit<ButtonProps, "value" | "icon" | "children" | "onCopy"> {
  value: string;
  /** Tooltip and accessible name. Default "Copy". */
  label?: string;
  copiedLabel?: string;
  onCopy?: (value: string) => void;
}
/** An icon button that copies a value; the icon turns into a check and "Copied" is announced. */
export function CopyButton({ value, label = "Copy", copiedLabel = "Copied", onCopy, variant = "ghost", size = "sm", className, ...rest }: CopyButtonProps) {
  const [done, copy] = useCopy();
  return (
    <>
      <Tooltip content={done ? copiedLabel : label}>
        <Button variant={variant} size={size} aria-label={label} icon={done ? <CheckGlyph className="text-icon-success-primary-hover" /> : <CopyGlyph />}
          onClick={async () => { await copy(value); onCopy?.(value); }} className={className} {...rest} />
      </Tooltip>
      <span className="sr-only" aria-live="polite">{done ? copiedLabel : ""}</span>
    </>
  );
}

export interface CopyFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onCopy"> {
  value: string;
  /** Masks the value with a Show button. */
  secret?: boolean;
  /** Characters kept visible while masked, like "sk_live_". */
  revealPrefix?: number;
  copyLabel?: string;
  onCopy?: (value: string) => void;
  size?: "sm" | "md" | "lg";
}
/** A read-only value with a copy button: install commands, API keys, token names, URLs. */
export const CopyField = React.forwardRef<HTMLDivElement, CopyFieldProps>(function CopyField({ value, secret, revealPrefix = 0, copyLabel = "Copy", onCopy, size = "md", className, id, ...rest }, ref) {
  const f = useField();
  const [shown, setShown] = React.useState(!secret);
  const masked = secret && !shown ? value.slice(0, revealPrefix) + "•".repeat(Math.max(8, Math.min(24, value.length - revealPrefix))) : value;
  return (
    <div ref={ref} className={cn("flex items-center gap-xxs pl-sm pr-xxs", fieldFrame, "bg-secondary shadow-none hover:border-primary",
      size === "sm" ? "h-control-sm" : size === "lg" ? "h-control-lg" : "h-control-md", className)} {...rest}>
      <code id={id ?? f?.id} aria-describedby={f?.describedBy} className="min-w-0 flex-1 truncate select-all bg-transparent p-0 font-mono text-primary mono-value-regular">{masked}</code>
      {secret ? <Button variant="ghost" size="sm" icon={shown ? <EyeOffGlyph /> : <EyeGlyph />} aria-label={shown ? "Hide" : "Show"} aria-pressed={shown} onClick={() => setShown(!shown)} /> : null}
      <CopyButton value={value} label={copyLabel} onCopy={onCopy} />
    </div>
  );
});
