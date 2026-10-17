import * as React from "react";
import { Popover as P } from "radix-ui";
import { cn } from "../lib/cn.js";
import { floatingPanel } from "../lib/floating.js";
import { CalendarGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";
import { Calendar, addDays, isSameDay, startOfDay, type DateRange } from "./calendar.js";
import { fieldFrame } from "./input.js";
import { useField } from "./field.js";

const SIZE = { sm: "h-control-sm px-xs body-body-3-regular", md: "h-control-md px-sm body-body-3-regular", lg: "h-control-lg px-base body-body-2-regular" } as const;

interface TriggerBits { size?: "sm" | "md" | "lg"; invalid?: boolean; disabled?: boolean; id?: string; className?: string; "aria-label"?: string; placeholder?: string }
const Trigger = React.forwardRef<HTMLButtonElement, TriggerBits & { text: React.ReactNode; empty: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>>(function Trigger(
  { size = "md", invalid, disabled, id, className, text, empty, ...rest }, ref) {
  const f = useField();
  const bad = invalid ?? f?.invalid, off = disabled ?? f?.disabled;
  return (
    <button ref={ref} type="button" id={id ?? f?.id} disabled={off} aria-invalid={bad || undefined} aria-describedby={f?.describedBy}
      className={cn("flex w-full cursor-pointer items-center gap-xs text-left font-primary outline-none", fieldFrame, SIZE[size],
        "focus-visible:border-accent-primary focus-visible:shadow-button-focus-primary data-[state=open]:border-accent-primary data-[state=open]:shadow-button-focus-primary",
        bad && "border-error-primary hover:border-error-primary",
        "disabled:cursor-not-allowed disabled:border-disabled-alt disabled:bg-disabled-alt disabled:text-disabled disabled:shadow-none", className)} {...rest}>
      <CalendarGlyph className="shrink-0 text-icon-tertiary" />
      <span className={cn("min-w-0 flex-1 truncate", empty && "text-placeholder")}>{text}</span>
    </button>
  );
});

const content = cn(floatingPanel, "w-auto p-base origin-(--radix-popover-content-transform-origin)");

export interface DatePickerProps extends TriggerBits {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (date: Date) => void;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  weekStartsOn?: number;
  locale?: string;
  /** Default: "Oct 17, 2026" in the locale. */
  formatDate?: (date: Date) => string;
}

/** A field that opens a Calendar. Picking a day closes it. */
export function DatePicker({ value, defaultValue = null, onValueChange, min, max, isDateDisabled, weekStartsOn, locale, formatDate, placeholder = "Pick a date", ...trigger }: DatePickerProps) {
  const [inner, setInner] = React.useState<Date | null>(defaultValue);
  const v = value !== undefined ? value : inner;
  const [open, setOpen] = React.useState(false);
  const fmt = formatDate ?? ((d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }));
  return (
    <P.Root open={open} onOpenChange={setOpen}>
      <P.Trigger asChild><Trigger {...trigger} text={v ? fmt(v) : placeholder} empty={!v} /></P.Trigger>
      <P.Portal>
        <P.Content align="start" sideOffset={4} collisionPadding={8} aria-label="Choose date" className={content}>
          <Calendar value={v} min={min} max={max} isDateDisabled={isDateDisabled} weekStartsOn={weekStartsOn} locale={locale}
            onValueChange={(d) => { if (value === undefined) setInner(d); onValueChange?.(d); setOpen(false); }} />
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}

export interface DateRangePreset { label: string; range: () => DateRange }
export function defaultRangePresets(): DateRangePreset[] {
  const t = startOfDay(new Date());
  return [
    { label: "Today", range: () => ({ from: t, to: t }) },
    { label: "Last 7 days", range: () => ({ from: addDays(t, -6), to: t }) },
    { label: "Last 30 days", range: () => ({ from: addDays(t, -29), to: t }) },
    { label: "This month", range: () => ({ from: new Date(t.getFullYear(), t.getMonth(), 1), to: t }) },
    { label: "Last month", range: () => ({ from: new Date(t.getFullYear(), t.getMonth() - 1, 1), to: new Date(t.getFullYear(), t.getMonth(), 0) }) },
    { label: "This year", range: () => ({ from: new Date(t.getFullYear(), 0, 1), to: t }) },
  ];
}
export function formatRange(r: DateRange | null | undefined, locale?: string): string {
  if (!r?.from) return "";
  const a = r.from, b = r.to;
  const full = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  if (!b) return full(a) + " –";
  if (isSameDay(a, b)) return full(a);
  return a.toLocaleDateString(locale, a.getFullYear() === b.getFullYear() ? { day: "numeric", month: "short" } : { day: "numeric", month: "short", year: "numeric" }) + " – " + full(b);
}

export interface DateRangePickerProps extends TriggerBits {
  value?: DateRange | null;
  defaultValue?: DateRange | null;
  onValueChange?: (range: DateRange) => void;
  /** Default: Today, Last 7 days, Last 30 days, This month, Last month, This year. false hides them. */
  presets?: DateRangePreset[] | false;
  /** Default 2. */
  months?: 1 | 2;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  weekStartsOn?: number;
  locale?: string;
  formatRange?: (range: DateRange) => string;
}

/** Picks a start and end date, with presets. Apply commits the range; a preset applies at once. */
export function DateRangePicker({ value, defaultValue = null, onValueChange, presets, months = 2, min, max, isDateDisabled, weekStartsOn, locale, formatRange: fmt, placeholder = "Pick a date range", ...trigger }: DateRangePickerProps) {
  const [inner, setInner] = React.useState<DateRange | null>(defaultValue);
  const v = value !== undefined ? value : inner;
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<DateRange | null>(v);
  const list = presets === false ? [] : presets ?? defaultRangePresets();
  const commit = (r: DateRange) => { if (value === undefined) setInner(r); onValueChange?.(r); setOpen(false); };
  const match = v?.from && v.to ? list.find((p) => { const r = p.range(); return isSameDay(r.from, v.from) && isSameDay(r.to, v.to); }) : undefined;
  const text = v?.from ? (match ? match.label : (fmt ?? ((r: DateRange) => formatRange(r, locale)))(v)) : placeholder;
  const days = draft?.from && draft.to ? Math.round((startOfDay(draft.to).getTime() - startOfDay(draft.from).getTime()) / 864e5) + 1 : 0;
  return (
    <P.Root open={open} onOpenChange={(o) => { setOpen(o); if (o) setDraft(v); }}>
      <P.Trigger asChild><Trigger {...trigger} text={text} empty={!v?.from} /></P.Trigger>
      <P.Portal>
        <P.Content align="start" sideOffset={4} collisionPadding={8} aria-label="Choose date range" className={cn(content, "flex max-h-(--radix-popover-content-available-height) max-w-(--radix-popover-content-available-width) flex-col overflow-y-auto p-0 sm:flex-row")}>
          {list.length ? (
            <div role="group" aria-label="Presets" className="flex flex-row flex-wrap gap-xxxs border-b border-secondary p-xs sm:min-w-36 sm:flex-col sm:border-r sm:border-b-0">
              {list.map((p) => (
                <Button key={p.label} variant="ghost" size="sm" aria-pressed={match === p} onClick={() => commit(p.range())}
                  className={cn("justify-start", match === p && "bg-selected text-primary")}>{p.label}</Button>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col gap-sm p-base">
            <Calendar mode="range" months={months} value={draft} onValueChange={setDraft} min={min} max={max} isDateDisabled={isDateDisabled} weekStartsOn={weekStartsOn} locale={locale} />
            <div className="flex flex-wrap items-center justify-between gap-sm border-t border-secondary pt-sm">
              <span className="text-secondary body-body-3-regular" aria-live="polite">
                {draft?.from ? (draft.to ? `${formatRange(draft, locale)} · ${days} ${days === 1 ? "day" : "days"}` : "Pick an end date") : "Pick a start date"}
              </span>
              <div className="flex gap-xs">
                <P.Close asChild><Button variant="tertiary" size="sm">Cancel</Button></P.Close>
                <Button size="sm" disabled={!(draft?.from && draft.to)} onClick={() => draft && commit(draft)}>Apply</Button>
              </div>
            </div>
          </div>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
