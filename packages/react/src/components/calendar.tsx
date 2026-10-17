import * as React from "react";
import { cn } from "../lib/cn.js";
import { ChevronLeftGlyph, ChevronRightGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";

export interface DateRange { from: Date | null; to: Date | null }

const day0 = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const same = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const monthDiff = (a: Date, b: Date) => (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();
export { same as isSameDay, addDays, day0 as startOfDay };

interface Base {
  /** 1 (default) or 2 months side by side (stacked on narrow screens). */
  months?: 1 | 2;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  /** 0 Sunday … 6 Saturday. Default 1 (Monday). */
  weekStartsOn?: number;
  /** BCP 47 locale for names. Default the browser's. */
  locale?: string;
  className?: string;
}
export interface CalendarSingleProps extends Base { mode?: "single"; value?: Date | null; defaultValue?: Date | null; onValueChange?: (date: Date) => void }
export interface CalendarRangeProps extends Base { mode: "range"; value?: DateRange | null; defaultValue?: DateRange | null; onValueChange?: (range: DateRange) => void }
export type CalendarProps = CalendarSingleProps | CalendarRangeProps;

/** A month grid for picking a date or a range. Arrow keys move by day and week, Page Up and Down by month. */
export function Calendar(props: CalendarProps) {
  const range = props.mode === "range";
  const [inner, setInner] = React.useState<any>(props.defaultValue ?? null);
  const v: any = props.value !== undefined ? props.value : inner;
  const set = (n: any) => { if (props.value === undefined) setInner(n); (props.onValueChange as any)?.(n); };
  const selected = !range && v ? day0(v) : null;
  const from = range && v?.from ? day0(v.from) : null, to = range && v?.to ? day0(v.to) : null;
  const today = day0(new Date());
  const count = props.months === 2 ? 2 : 1;
  const [focus, setFocus] = React.useState<Date>(selected ?? from ?? today);
  const [view, setView] = React.useState<Date>(monthStart(selected ?? from ?? today));
  const [hover, setHover] = React.useState<Date | null>(null);
  const wk = props.weekStartsOn ?? 1;
  const box = React.useRef<HTMLDivElement>(null), moved = React.useRef(false);
  const off = (d: Date) => !!((props.min && d < day0(props.min)) || (props.max && d > day0(props.max)) || props.isDateDisabled?.(d));
  function move(d: Date) {
    moved.current = true; setFocus(d);
    const o = monthDiff(view, d);
    if (o < 0) setView(monthStart(d)); else if (o > count - 1) setView(addMonths(monthStart(d), -(count - 1)));
  }
  React.useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    box.current?.querySelector<HTMLElement>(`[data-day="${focus.toDateString()}"]:not([data-outside])`)?.focus();
  }, [focus.getTime()]);
  function onKey(e: React.KeyboardEvent) {
    const rtl = (e.currentTarget as HTMLElement).closest("[dir]")?.getAttribute("dir") === "rtl";
    const map: Record<string, number> = { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1, ArrowUp: -7, ArrowDown: 7 };
    let n: Date | null = null;
    if (map[e.key] != null) n = addDays(focus, map[e.key]);
    else if (e.key === "PageUp") n = new Date(focus.getFullYear(), focus.getMonth() - 1, Math.min(focus.getDate(), 28));
    else if (e.key === "PageDown") n = new Date(focus.getFullYear(), focus.getMonth() + 1, Math.min(focus.getDate(), 28));
    else if (e.key === "Home") n = addDays(focus, -((focus.getDay() - wk + 7) % 7));
    else if (e.key === "End") n = addDays(focus, 6 - ((focus.getDay() - wk + 7) % 7));
    if (n) { e.preventDefault(); move(n); }
  }
  function pick(d: Date) {
    setFocus(d);
    if (!range) return set(d);
    if (!from || to) set({ from: d, to: null });
    else if (d < from) set({ from: d, to: from });
    else set({ from, to: d });
  }
  const nav = (n: number) => { const nv = addMonths(view, n); setView(nv); setFocus(nv); };
  const end = to ?? (from && hover && hover >= from ? hover : null);

  function month(m: Date, idx: number) {
    const start = addDays(m, -((m.getDay() - wk + 7) % 7));
    const weeks = Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
    const names = weeks[0].map((d) => ({ short: d.toLocaleDateString(props.locale, { weekday: "narrow" }), long: d.toLocaleDateString(props.locale, { weekday: "long" }) }));
    let title = m.toLocaleDateString(props.locale, { month: "long", year: "numeric" });
    title = title.charAt(0).toUpperCase() + title.slice(1);
    return (
      <div key={idx} className="flex flex-col gap-xs">
        <div className="flex items-center justify-between gap-xs">
          {idx === 0 ? <Button variant="ghost" size="sm" icon={<ChevronLeftGlyph className="rtl:-scale-x-100" />} aria-label="Previous month" onClick={() => nav(-1)} /> : <span className="w-control-sm" />}
          <span className="text-primary label-label-2-semibold" aria-live="polite">{title}</span>
          {idx === count - 1 ? <Button variant="ghost" size="sm" icon={<ChevronRightGlyph className="rtl:-scale-x-100" />} aria-label="Next month" onClick={() => nav(1)} /> : <span className="w-control-sm" />}
        </div>
        <table role="grid" aria-label={title} className="border-collapse" onKeyDown={onKey} onMouseLeave={() => setHover(null)}>
          <thead><tr>{names.map((n, i) => <th key={i} scope="col" abbr={n.long} className="h-(--size-2xl) w-control-sm text-center font-primary text-tertiary caption-caption-1-semibold">{n.short}</th>)}</tr></thead>
          <tbody>{weeks.map((row, i) => (
            <tr key={i}>{row.map((d) => {
              const out = d.getMonth() !== m.getMonth();
              if (out && count > 1) return <td key={d.toDateString()} role="presentation" />;
              const isStart = range && same(d, from), isEnd = range && same(d, end);
              const inside = !!(range && from && end && d > from && d < end);
              const sel = range ? isStart || isEnd || inside : same(d, selected);
              const solid = range ? isStart || isEnd : sel;
              const span = from && end && !same(from, end);
              return (
                <td key={d.toDateString()} role="gridcell" aria-selected={sel} className={cn("p-0 py-px text-center",
                  inside && "bg-accent-primary",
                  isStart && span && "bg-[linear-gradient(to_right,transparent_50%,var(--bg-accent-primary)_50%)] rtl:bg-[linear-gradient(to_left,transparent_50%,var(--bg-accent-primary)_50%)]",
                  isEnd && span && "bg-[linear-gradient(to_left,transparent_50%,var(--bg-accent-primary)_50%)] rtl:bg-[linear-gradient(to_right,transparent_50%,var(--bg-accent-primary)_50%)]")}>
                  <Button variant={solid ? "primary" : "ghost"} size="sm" disabled={off(d)} tabIndex={same(d, focus) ? 0 : -1}
                    icon={<span className="label-label-2-medium">{d.getDate()}</span>}
                    aria-label={d.toLocaleDateString(props.locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    aria-current={same(d, today) ? "date" : undefined} data-day={d.toDateString()} data-outside={out ? "" : undefined}
                    onMouseEnter={range && from && !to ? () => setHover(d) : undefined} onFocus={range && from && !to ? () => setHover(d) : undefined}
                    onClick={() => pick(d)}
                    className={cn("tabular-nums", !solid && "text-primary hover:not-disabled:bg-tertiary", out && !solid && "text-tertiary", inside && "text-primary",
                      "disabled:text-disabled disabled:line-through",
                      same(d, today) && "after:absolute after:bottom-xxxs after:left-1/2 after:size-(--size-xs) after:-translate-x-1/2 after:rounded-full after:bg-accent-solid",
                      same(d, today) && solid && "after:bg-white")} />
                </td>
              );
            })}</tr>
          ))}</tbody>
        </table>
      </div>
    );
  }
  return (
    <div ref={box} className={cn("inline-flex gap-lg font-primary", count > 1 ? "flex-col sm:flex-row sm:items-start" : "flex-col", props.className)}>
      {Array.from({ length: count }, (_, i) => month(addMonths(view, i), i))}
    </div>
  );
}
