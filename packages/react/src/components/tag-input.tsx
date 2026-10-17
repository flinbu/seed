import * as React from "react";
import { Popover as P } from "radix-ui";
import { cn } from "../lib/cn.js";
import { floatingPanel, menuItem } from "../lib/floating.js";
import { fieldFrame } from "./input.js";
import { useField } from "./field.js";
import { Tag } from "./tag.js";

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tags: string[]) => void;
  /** Offered as people type. */
  suggestions?: string[];
  /** Return true, or the message to show. */
  validate?: (tag: string) => true | string;
  max?: number;
  placeholder?: string;
  /** A color chip per tag, for tokens. */
  swatchFor?: (tag: string) => string | undefined;
  size?: "sm" | "md";
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

/** Turns typed text into tags. Enter or a comma adds; pasting a list adds each item; Backspace removes the last one. */
export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(function TagInput(
  { value, defaultValue = [], onValueChange, suggestions, validate, max, placeholder = "Add…", swatchFor, size = "md", invalid, disabled, id, className, "aria-label": label }, ref) {
  const f = useField();
  const [inner, setInner] = React.useState(defaultValue);
  const tags = value ?? inner;
  const set = (n: string[]) => { if (value === undefined) setInner(n); onValueChange?.(n); };
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [live, setLive] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cid = id ?? f?.id ?? React.useId();
  const off = disabled ?? f?.disabled, bad = invalid ?? f?.invalid ?? !!error;
  const t = text.trim().toLowerCase();
  const sugg = (suggestions ?? []).filter((s) => !tags.includes(s) && (!t || s.toLowerCase().includes(t))).slice(0, 8);
  const listOpen = open && sugg.length > 0;

  function add(raw: string) {
    const parts = raw.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...tags]; let problem: string | null = null;
    for (const p of parts) {
      if (max && next.length >= max) { problem = `You can add up to ${max}.`; break; }
      if (next.includes(p)) { problem = `"${p}" is already added.`; continue; }
      const ok = validate ? validate(p) : true;
      if (ok !== true) { problem = ok; continue; }
      next.push(p);
    }
    setError(problem);
    if (next.length !== tags.length) { set(next); setLive(`Added ${next.slice(tags.length).join(", ")}`); }
    setText(""); setActive(0);
  }
  function remove(i: number) { const n = tags.filter((_, k) => k !== i); setLive(`Removed ${tags[i]}`); set(n); inputRef.current?.focus(); }
  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (listOpen && e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, sugg.length - 1)); }
    else if (listOpen && e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Escape" && listOpen) { e.preventDefault(); setOpen(false); }
    else if (e.key === "Enter" || e.key === ",") {
      if (listOpen && e.key === "Enter" && sugg[active] && (!t || sugg[active].toLowerCase().startsWith(t) || active > 0)) { e.preventDefault(); add(sugg[active]); return; }
      if (text.trim()) { e.preventDefault(); add(text); }
    } else if (e.key === "Backspace" && !text && tags.length) { e.preventDefault(); remove(tags.length - 1); }
  }
  return (
    <div className={cn("flex min-w-0 flex-col gap-xxs", className)}>
      <P.Root open={listOpen} onOpenChange={setOpen}>
        <P.Anchor asChild>
          <div onMouseDown={(e) => { if (e.target === e.currentTarget) { e.preventDefault(); inputRef.current?.focus(); } }}
            className={cn("flex cursor-text flex-wrap items-center gap-xxs px-xs py-xxs", fieldFrame, size === "sm" ? "min-h-control-sm" : "min-h-control-md",
              "focus-within:border-accent-primary focus-within:shadow-button-focus-primary",
              bad && "border-error-primary hover:border-error-primary focus-within:border-error-primary focus-within:shadow-button-focus-destructive",
              off && "border-disabled-alt bg-disabled-alt shadow-none hover:border-disabled-alt")}>
            <ul aria-label={label ? `${label}, added` : "Added"} className="contents">
              {tags.map((tag, i) => <li key={tag} className="inline-flex max-w-full"><Tag size="sm" swatch={swatchFor?.(tag)} onRemove={off ? undefined : () => remove(i)}>{tag}</Tag></li>)}
            </ul>
            <input ref={(n) => { (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = n; if (typeof ref === "function") ref(n); else if (ref) ref.current = n; }}
              id={cid} value={text} disabled={off} placeholder={tags.length ? "" : placeholder} aria-label={label}
              aria-invalid={bad || undefined} aria-describedby={[f?.describedBy, error ? `${cid}-err` : null].filter(Boolean).join(" ") || undefined}
              role={suggestions ? "combobox" : undefined} aria-autocomplete={suggestions ? "list" : undefined} aria-expanded={suggestions ? listOpen : undefined}
              aria-controls={listOpen ? `${cid}-list` : undefined} aria-activedescendant={listOpen ? `${cid}-s-${active}` : undefined}
              onChange={(e) => { const v = e.target.value; setError(null); if (/[,\n]/.test(v)) { add(v); return; } setText(v); setActive(0); setOpen(true); }}
              onPaste={(e) => { const p = e.clipboardData.getData("text"); if (/[,\n]/.test(p)) { e.preventDefault(); add(text + p); } }}
              onFocus={() => setOpen(true)} onBlur={() => { if (text.trim()) add(text); }} onKeyDown={onKey}
              className="h-(--size-2xl) min-w-20 flex-1 border-0 bg-transparent p-0 px-xxs font-primary text-primary outline-none placeholder:text-placeholder body-body-3-regular disabled:cursor-not-allowed" />
          </div>
        </P.Anchor>
        <P.Portal>
          <P.Content align="start" sideOffset={4} collisionPadding={8} onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => { if (inputRef.current?.parentElement?.contains(e.target as Node)) e.preventDefault(); }}
            className={cn(floatingPanel, "max-h-64 w-(--radix-popover-trigger-width) overflow-y-auto p-xxs")}>
            <div id={`${cid}-list`} role="listbox" aria-label="Suggestions">
              {sugg.map((s, i) => (
                <div key={s} id={`${cid}-s-${i}`} role="option" aria-selected={false} data-highlighted={i === active ? "" : undefined}
                  onMouseDown={(e) => e.preventDefault()} onMouseMove={() => setActive(i)} onClick={() => { add(s); inputRef.current?.focus(); }} className={menuItem}>{s}</div>
              ))}
            </div>
          </P.Content>
        </P.Portal>
      </P.Root>
      {error ? <span id={`${cid}-err`} className="text-error-primary body-body-4-medium">{error}</span> : null}
      <span className="sr-only" aria-live="polite">{live}</span>
    </div>
  );
});
