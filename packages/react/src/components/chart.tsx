import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { Button } from "./button.js";
import { directionOf, useDirection } from "./direction.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table.js";

const glyph = (d: React.ReactNode) => function G({ size = 16 }: { size?: number | string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
};
const TableGlyph = glyph(<><path d="M12 3v18" /><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18M3 15h18" /></>);
const ChartGlyph = glyph(<><path d="M3 3v16a2 2 0 0 0 2 2h16" /><path d="M18 17V9M13 17V5M8 17v-3" /></>);
const UpRight = glyph(<><path d="M7 7h10v10" /><path d="M7 17 17 7" /></>);
const DownRight = glyph(<><path d="m7 7 10 10" /><path d="M17 7v10H7" /></>);

/** 1.2K, 4.5M, 3B. */
export function compactNumber(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "–";
  const a = Math.abs(n);
  if (a >= 1e9) return +(n / 1e9).toFixed(1) + "B";
  if (a >= 1e6) return +(n / 1e6).toFixed(1) + "M";
  if (a >= 1e3) return +(n / 1e3).toFixed(1) + "K";
  return String(+n.toFixed(2));
}
function niceStep(raw: number) { const p = Math.pow(10, Math.floor(Math.log10(raw || 1))), f = raw / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; }
/** Round gridline values from 0 to at least max. */
export function niceTicks(max: number, count = 4): number[] {
  if (!(max > 0)) max = 1;
  const step = niceStep(max / count), top = Math.ceil(max / step) * step, out: number[] = [];
  for (let v = 0; v <= top + step / 2; v += step) out.push(+v.toFixed(10));
  return out;
}
function barPath(x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h);
  if (h <= 0) return "";
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

/* ---------- Chart ---------- */

export interface ChartSeries { key: string; label?: string; color?: string }
export type ChartDatum = Record<string, string | number | null | undefined>;
export interface ChartProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** bar (grouped for several series), stacked, line or area. */
  type?: "bar" | "stacked" | "line" | "area";
  data: ChartDatum[];
  /** The key for the horizontal axis. Default 'x'. */
  x?: string;
  /** In a stable order: colors come from the palette in that order. */
  series: ChartSeries[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Plot height in px. Default 240. */
  height?: number;
  yMax?: number;
  valueFormat?: (v: number) => string;
  xFormat?: (v: unknown) => string;
  /** Header of the first column in the table view. */
  xLabel?: string;
  /** end: the value at the end of each line, or on top of each bar for one series. */
  labels?: "end";
  legend?: boolean;
  /** false hides the table toggle. */
  toolbar?: boolean;
  defaultView?: "chart" | "table";
}

/** Bar, stacked bar, line and area charts in Seed's chart palette, with a tooltip, keyboard reading and a table view. */
export const Chart = React.forwardRef<HTMLElement, ChartProps>(function Chart(
  { type = "bar", data, x: xKey = "x", series: rawSeries, title, description, height = 240, yMax, valueFormat = compactNumber, xFormat = (v) => String(v), xLabel = "", labels, legend = true, toolbar = true, defaultView = "chart", className, "aria-label": ariaLabel, ...rest }, ref) {
  const series = rawSeries.map((s, i) => ({ ...s, color: s.color ?? `var(--seed-chart-${(i % 8) + 1})` }));
  const fmt = valueFormat, xfmt = xFormat;
  const box = React.useRef<HTMLDivElement>(null);
  const [W, setW] = React.useState(560);
  const [act, setAct] = React.useState<number | null>(null);
  const [view, setView] = React.useState(defaultView);
  const ctxDir = useDirection();
  React.useLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const m = () => { if (el.clientWidth) setW(el.clientWidth); };
    m();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(m); ro.observe(el); return () => ro.disconnect();
  }, [view]);
  const H = height;
  const stacked = type === "stacked";
  const val = (d: ChartDatum, k: string) => +(d[k] ?? 0) || 0;
  let maxV = 0;
  for (const d of data) {
    if (stacked) maxV = Math.max(maxV, series.reduce((s, se) => s + val(d, se.key), 0));
    else for (const se of series) maxV = Math.max(maxV, val(d, se.key));
  }
  const ticks = niceTicks(yMax ?? maxV, 4), top = ticks[ticks.length - 1]!;
  const padL = Math.max(28, Math.max(...ticks.map((t) => fmt(t).length)) * 7 + 10);
  const pad = { l: padL, r: labels === "end" && (type === "line" || type === "area") ? 64 : 12, t: 10, b: 26 };
  const pw = Math.max(10, W - pad.l - pad.r), ph = Math.max(10, H - pad.t - pad.b);
  const n = Math.max(1, data.length);
  const isBar = type === "bar" || stacked;
  const band = pw / n;
  const xAt = (i: number) => (isBar ? pad.l + band * i + band / 2 : pad.l + (n === 1 ? pw / 2 : (pw * i) / (n - 1)));
  const yAt = (v: number) => pad.t + ph - (v / top) * ph;

  const marks: React.ReactNode[] = [];
  if (isBar) {
    const k = stacked ? 1 : series.length;
    const bw = Math.min(24, Math.max(4, (band * 0.72 - 2 * (k - 1)) / k));
    const groupW = bw * k + 2 * (k - 1);
    data.forEach((d, i) => {
      const gx = xAt(i) - groupW / 2;
      let acc = 0;
      series.forEach((se, j) => {
        const v = val(d, se.key); if (v <= 0) return;
        const x = stacked ? gx : gx + j * (bw + 2);
        const y0 = yAt(acc + v), y1 = yAt(acc);
        const topMost = !stacked || series.slice(j + 1).every((o) => !(val(d, o.key) > 0));
        const hh = y1 - y0 - (stacked && acc > 0 ? 2 : 0);
        marks.push(<path key={`${i}-${j}`} d={topMost ? barPath(x, y0, bw, hh, 4) : `M${x},${y0}h${bw}v${hh}h${-bw}Z`} fill={se.color} className="seed-chart-bar" opacity={act != null && act !== i ? 0.45 : 1} />);
        if (stacked) acc += v;
      });
      if (labels === "end" && !stacked && series.length === 1) {
        const v1 = val(d, series[0]!.key);
        marks.push(<text key={`l${i}`} x={xAt(i)} y={yAt(v1) - 6} textAnchor="middle" className="seed-chart-value">{fmt(v1)}</text>);
      }
    });
  } else {
    series.forEach((se, j) => {
      const pts = data.map((d, i) => [xAt(i), yAt(val(d, se.key))] as const);
      const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("");
      if (type === "area" && pts.length) marks.push(<path key={`a${j}`} d={`${line}L${pts[pts.length - 1]![0]},${pad.t + ph}L${pts[0]![0]},${pad.t + ph}Z`} fill={se.color} className="seed-chart-area" />);
      marks.push(<path key={`l${j}`} d={line} stroke={se.color} className="seed-chart-line" />);
      const last = pts[pts.length - 1];
      if (last) {
        marks.push(<circle key={`e${j}`} cx={last[0]} cy={last[1]} r={4} fill={se.color} className="seed-chart-dot" />);
        if (labels === "end") marks.push(<text key={`t${j}`} x={last[0] + 8} y={last[1] + 4} className="seed-chart-value">{fmt(val(data[data.length - 1]!, se.key))}</text>);
      }
      if (act != null && pts[act]) marks.push(<circle key={`h${j}`} cx={pts[act]![0]} cy={pts[act]![1]} r={4} fill={se.color} className="seed-chart-dot" />);
    });
  }
  const everyX = Math.max(1, Math.ceil(n / Math.max(1, Math.floor(pw / 64))));
  const pick = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect(), px = e.clientX - r.left;
    if (px < pad.l - 4 || px > pad.l + pw + 4) { setAct(null); return; }
    const i = isBar ? Math.floor((px - pad.l) / band) : Math.round(((px - pad.l) / pw) * (n - 1));
    setAct(Math.max(0, Math.min(n - 1, i)));
  };
  const summary = ariaLabel ?? (typeof title === "string" ? title : "Chart");
  const cur = act != null ? data[act] : undefined;
  const keyLine = "inline-block h-(--size-xxs) w-(--size-md) shrink-0 rounded-full";
  const keyBox = "inline-block size-[calc(var(--size-md)-var(--size-xxs))] shrink-0 rounded-(--size-xxs)";

  return (
    <figure ref={ref} className={cn("m-0 flex min-w-0 flex-col gap-sm font-primary", className)} {...rest}>
      {title || description || toolbar ? (
        <figcaption className="flex items-start justify-between gap-sm">
          <span className="flex flex-col gap-xxxs">
            {title ? <span className="text-primary label-label-1-semibold">{title}</span> : null}
            {description ? <span className="text-secondary body-body-3-regular">{description}</span> : null}
          </span>
          {toolbar ? <Button variant="ghost" size="sm" icon={view === "chart" ? <TableGlyph /> : <ChartGlyph />} aria-label={view === "chart" ? "Show as table" : "Show as chart"}
            onClick={() => { setAct(null); setView(view === "chart" ? "table" : "chart"); }} /> : null}
        </figcaption>
      ) : null}
      {series.length > 1 && legend ? (
        <ul aria-label="Legend" className="m-0 flex list-none flex-wrap gap-x-base gap-y-xxs p-0">
          {series.map((se) => (
            <li key={se.key} className="inline-flex items-center gap-xs text-secondary body-body-4-regular">
              <span className={isBar ? keyBox : keyLine} style={{ background: se.color }} />{se.label ?? se.key}
            </li>
          ))}
        </ul>
      ) : null}
      {view === "table" ? (
        <Table density="compact" aria-label={`${summary} data`}>
          <TableHeader><TableRow><TableHead>{xLabel}</TableHead>{series.map((se) => <TableHead key={se.key} align="right">{se.label ?? se.key}</TableHead>)}</TableRow></TableHeader>
          <TableBody>
            {data.map((d, i) => <TableRow key={i}><TableCell>{xfmt(d[xKey])}</TableCell>{series.map((se) => <TableCell key={se.key} align="right" className="tabular-nums">{fmt(val(d, se.key))}</TableCell>)}</TableRow>)}
          </TableBody>
        </Table>
      ) : (
        <div ref={box} tabIndex={0} role="group" aria-label={`${summary}. Use the arrow keys to read values, or show it as a table.`}
          className="relative w-full touch-pan-y rounded-md outline-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-primary" style={{ height: H }}
          onPointerMove={pick} onPointerLeave={() => setAct(null)} onBlur={() => setAct(null)}
          onKeyDown={(e) => {
            const rtl = directionOf(e.currentTarget, ctxDir) === "rtl";
            const fwd = rtl ? "ArrowLeft" : "ArrowRight", back = rtl ? "ArrowRight" : "ArrowLeft";
            if (e.key === fwd) { e.preventDefault(); setAct(act == null ? 0 : Math.min(n - 1, act + 1)); }
            else if (e.key === back) { e.preventDefault(); setAct(act == null ? n - 1 : Math.max(0, act - 1)); }
            else if (e.key === "Home") { e.preventDefault(); setAct(0); }
            else if (e.key === "End") { e.preventDefault(); setAct(n - 1); }
            else if (e.key === "Escape") setAct(null);
          }}>
          <svg width={W} height={H} aria-hidden="true" className="block overflow-visible">
            {ticks.map((t) => {
              const y = yAt(t);
              return (
                <g key={`y${t}`}>
                  <line x1={pad.l} x2={pad.l + pw} y1={y} y2={y} className={t === 0 ? "seed-chart-base" : "seed-chart-grid"} />
                  <text x={pad.l - 8} y={y + 4} textAnchor="end" className="seed-chart-tick">{fmt(t)}</text>
                </g>
              );
            })}
            {data.map((d, i) => (i % everyX ? null : <text key={`x${i}`} x={xAt(i)} y={pad.t + ph + 18} textAnchor="middle" className="seed-chart-tick">{xfmt(d[xKey])}</text>))}
            {act != null && !isBar ? <line x1={xAt(act)} x2={xAt(act)} y1={pad.t} y2={pad.t + ph} className="seed-chart-cross" /> : null}
            {act != null && isBar ? <rect x={pad.l + band * act} y={pad.t} width={band} height={ph} className="seed-chart-band" /> : null}
            {marks}
          </svg>
          {cur ? (
            <div className="pointer-events-none absolute z-2 flex min-w-[calc(var(--size-5xl)*3-var(--size-sm))] flex-col gap-xxxs rounded-md border border-secondary bg-elevated px-sm py-xs shadow-elevation-md"
              style={xAt(act!) > W - 180 ? { right: W - xAt(act!) + 12, top: pad.t } : { left: xAt(act!) + 12, top: pad.t }}>
              <div className="mb-xxxs text-secondary label-label-3-medium">{xfmt(cur[xKey])}</div>
              {series.map((se) => (
                <div key={se.key} className="flex items-center gap-xs">
                  <span className={keyLine} style={{ background: se.color }} />
                  <span className="text-primary tabular-nums label-label-2-semibold">{fmt(val(cur, se.key))}</span>
                  <span className="text-secondary body-body-4-regular">{se.label ?? se.key}</span>
                </div>
              ))}
              {stacked ? <div className="mt-xxxs border-t border-tertiary pt-xxxs text-secondary body-body-4-regular">Total <strong className="font-semibold text-primary">{fmt(series.reduce((s, se) => s + val(cur, se.key), 0))}</strong></div> : null}
            </div>
          ) : null}
          <div className="sr-only" aria-live="polite">{cur ? `${xfmt(cur[xKey])}: ${series.map((se) => `${se.label ?? se.key} ${fmt(val(cur, se.key))}`).join(", ")}` : ""}</div>
        </div>
      )}
    </figure>
  );
});

/* ---------- StatTile ---------- */

function Sparkline({ values, width = 96, height = 28 }: { values: number[]; width?: number; height?: number }) {
  if (values.length < 2) return null;
  const mn = Math.min(...values), mx = Math.max(...values), rg = mx - mn || 1;
  const pts = values.map((x, i) => [(i / (values.length - 1)) * (width - 6) + 3, height - 3 - ((x - mn) / rg) * (height - 6)] as const);
  const last = pts[pts.length - 1]!;
  return (
    <svg width={width} height={height} aria-hidden="true" className="shrink-0 overflow-visible">
      <path d={pts.map((q, i) => `${i ? "L" : "M"}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join("")} className="seed-spark-line" />
      <circle cx={last[0]} cy={last[1]} r={3} className="seed-spark-dot" />
    </svg>
  );
}

export interface StatDelta { value: number; unit?: string; display?: string; period?: string; goodWhen?: "up" | "down" }
export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sentence case, no colon. */
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: IconProp;
  /** A percent, or { value, unit?, display?, period?, goodWhen? }. */
  delta?: number | StatDelta;
  /** Recent values for a sparkline. */
  trend?: number[];
  size?: "md" | "lg";
  format?: (v: React.ReactNode) => React.ReactNode;
}

/** One number that answers a question at a glance. Color follows good or bad, not up or down. */
export const StatTile = React.forwardRef<HTMLDivElement, StatTileProps>(function StatTile(
  { label, value, icon, delta, trend, size = "md", format = (x) => (typeof x === "number" ? x.toLocaleString() : x), className, ...rest }, ref) {
  const dv = delta == null ? null : typeof delta === "number" ? delta : delta.value;
  const obj = typeof delta === "object" ? delta : null;
  const good = obj?.goodWhen === "down" ? (dv ?? 0) < 0 : (dv ?? 0) > 0;
  const tone = dv == null || dv === 0 ? "neutral" : good ? "good" : "bad";
  const toneText = tone === "good" ? "text-success-primary" : tone === "bad" ? "text-error-primary" : "";
  return (
    <div ref={ref} className={cn("flex min-w-0 flex-col gap-xxs rounded-xl border border-secondary bg-primary p-base font-primary", className)} {...rest}>
      <div className="flex items-center gap-xs text-secondary body-body-3-regular">
        {icon ? <span className="inline-flex leading-none text-icon-tertiary">{renderIcon(icon, "sm")}</span> : null}{label}
      </div>
      <div className="flex items-end justify-between gap-sm">
        <span className={cn("m-0 text-primary", size === "lg" ? "heading-h2-semibold" : "heading-h4-semibold")}>{format(value)}</span>
        {trend ? <Sparkline values={trend} /> : null}
      </div>
      {delta != null ? (
        <div className="inline-flex items-center gap-xxxs text-secondary body-body-4-regular">
          {dv ? <span className={cn("inline-flex", toneText)}>{dv > 0 ? <UpRight size={12} /> : <DownRight size={12} />}</span> : null}
          <span className={cn("font-semibold", toneText)}>{(dv! > 0 ? "+" : dv! < 0 ? "−" : "") + (obj?.display ?? `${Math.abs(dv!)}${obj?.unit ?? "%"}`)}</span>
          {obj?.period ? <span className="text-tertiary"> vs {obj.period}</span> : null}
          <span className="sr-only">{tone === "good" ? ", better" : tone === "bad" ? ", worse" : ""}</span>
        </div>
      ) : null}
    </div>
  );
});
