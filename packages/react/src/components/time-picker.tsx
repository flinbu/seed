import * as React from "react";
import { Popover as P } from "radix-ui";
import { cn } from "../lib/cn.js";
import { floatingPanel, menuItem } from "../lib/floating.js";
import { CheckGlyph, ChevronsUpDownGlyph, ClockGlyph } from "../lib/glyphs.js";
import { fieldFrame } from "./input.js";
import { useField } from "./field.js";

const pad = (n: number) => String(n).padStart(2, "0");
/** "9", "930", "9:30pm", "21:30" → "21:30" (24-hour "HH:mm"), or null. */
export function parseTime(s: string): string | null {
  const m = String(s).trim().toLowerCase().replace(/\s+/g, "").match(/^(\d{1,2})(?::?(\d{2}))?(a|am|p|pm)?$/);
  if (!m) return null;
  let h = +m[1]; const min = m[2] ? +m[2] : 0; const ap = m[3];
  if (ap) { if (h < 1 || h > 12) return null; if (ap[0] === "p" && h < 12) h += 12; if (ap[0] === "a" && h === 12) h = 0; }
  if (h > 23 || min > 59) return null;
  return `${pad(h)}:${pad(min)}`;
}
export function formatTime(v: string | null | undefined, hourCycle?: 12 | 24, locale?: string): string {
  if (!v) return "";
  const [h, m] = v.split(":").map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit", hour12: hourCycle === 12 ? true : hourCycle === 24 ? false : undefined });
}

export interface TimePickerProps {
  /** "HH:mm", 24-hour. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Minutes between options. Default 15. */
  step?: number;
  min?: string;
  max?: string;
  hourCycle?: 12 | 24;
  locale?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}
const SIZE = { sm: "h-control-sm px-xs body-body-3-regular", md: "h-control-md px-sm body-body-3-regular", lg: "h-control-lg px-base body-body-2-regular" } as const;

/** A time typed ("2:15pm", "1415") or picked from a list, shown in the reader's format. */
export function TimePicker({ value, defaultValue = null, onValueChange, step = 15, min = "00:00", max = "23:59", hourCycle, locale, placeholder, size = "md", invalid, disabled, id, className, "aria-label": label }: TimePickerProps) {
  const f = useField();
  const [inner, setInner] = React.useState(defaultValue);
  const v = value !== undefined ? value : inner;
  const [text, setText] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [bad, setBad] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null), listRef = React.useRef<HTMLDivElement>(null);
  const cid = id ?? f?.id ?? React.useId();
  const times = React.useMemo(() => { const out: string[] = []; for (let m = 0; m < 1440; m += step) { const t = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`; if (t >= min && t <= max) out.push(t); } return out; }, [step, min, max]);
  const nearest = (t: string) => { let i = 0; times.forEach((x, k) => { if (x <= t) i = k; }); return i; };
  const now = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const commit = (n: string | null) => { if (value === undefined) setInner(n); onValueChange?.(n); setText(null); setBad(false); setOpen(false); };
  function commitText() { if (text == null) return; if (!text.trim()) return commit(null); const p = parseTime(text); if (p) commit(p); else setBad(true); }
  React.useEffect(() => { if (open) listRef.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" }); }, [active, open]);
  function openList() { if (!open) { setActive(nearest(v ?? now())); setOpen(true); } }
  const off = disabled ?? f?.disabled, isBad = invalid ?? f?.invalid ?? bad;
  return (
    <P.Root open={open} onOpenChange={(o) => (o ? openList() : setOpen(false))}>
      <P.Anchor asChild>
        <div className={cn("flex items-center gap-xs", fieldFrame, SIZE[size], "focus-within:border-accent-primary focus-within:shadow-button-focus-primary",
          isBad && "border-error-primary hover:border-error-primary focus-within:border-error-primary focus-within:shadow-button-focus-destructive",
          off && "border-disabled-alt bg-disabled-alt text-disabled shadow-none", className)}>
          <ClockGlyph className="shrink-0 text-icon-tertiary" />
          <input ref={inputRef} id={cid} disabled={off} autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={open}
            aria-controls={open ? `${cid}-list` : undefined} aria-activedescendant={open ? `${cid}-t-${active}` : undefined}
            aria-invalid={isBad || undefined} aria-describedby={f?.describedBy} aria-label={label}
            value={text ?? formatTime(v, hourCycle, locale)} placeholder={placeholder ?? formatTime("09:00", hourCycle, locale)}
            onClick={openList}
            onChange={(e) => { setText(e.target.value); setBad(false); const p = parseTime(e.target.value); if (p) setActive(nearest(p)); if (!open) setOpen(true); }}
            onBlur={() => setTimeout(() => { if (!listRef.current?.contains(document.activeElement)) commitText(); }, 0)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); if (!open) openList(); else setActive((a) => Math.min(a + 1, times.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); if (!open) openList(); else setActive((a) => Math.max(a - 1, 0)); }
              else if (e.key === "Enter") { e.preventDefault(); if (text != null) commitText(); else if (open) commit(times[active]); }
              else if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); setText(null); }
            }}
            className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-primary text-inherit outline-none placeholder:text-placeholder [font-size:inherit] [line-height:inherit]" />
          <ChevronsUpDownGlyph className="shrink-0 text-icon-tertiary" />
        </div>
      </P.Anchor>
      <P.Portal>
        <P.Content align="start" sideOffset={4} collisionPadding={8} onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => { if (inputRef.current?.parentElement?.contains(e.target as Node)) e.preventDefault(); }}
          className={cn(floatingPanel, "max-h-60 w-(--radix-popover-trigger-width) overflow-y-auto p-xxs")}>
          <div ref={listRef} id={`${cid}-list`} role="listbox" aria-label="Times">
            {times.map((t, i) => (
              <div key={t} id={`${cid}-t-${i}`} data-i={i} role="option" aria-selected={t === v} data-highlighted={i === active ? "" : undefined}
                onMouseDown={(e) => e.preventDefault()} onMouseMove={() => setActive(i)} onClick={() => commit(t)} className={cn(menuItem, "pr-2xl tabular-nums")}>
                {formatTime(t, hourCycle, locale)}
                {t === v ? <CheckGlyph className="absolute right-xs text-icon-accent-primary-hover" /> : null}
              </div>
            ))}
          </div>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
