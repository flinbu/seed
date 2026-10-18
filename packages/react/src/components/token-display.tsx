import * as React from "react";
import { cn } from "../lib/cn.js";
import { contrastRatio, formatColor, formatRatio, parseColor, toHex, blend } from "../lib/color.js";
import { useResolvedColor } from "../lib/use-resolved-color.js";
import { CheckGlyph, CopyGlyph } from "../lib/glyphs.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { useCopy } from "./copy.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table.js";

/* ---------- ColorSwatch ---------- */

export interface ColorSwatchProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Any CSS color, usually the token itself (var(--bg-accent-solid)), so it follows the theme. */
  color: string;
  /** The token name; the copy Button copies it. */
  name?: string;
  /** Shown instead of the value the browser reads. */
  value?: React.ReactNode;
  /** The primitive it points to, for the theme shown. */
  alias?: React.ReactNode;
  usage?: React.ReactNode;
  layout?: "card" | "row" | "chip";
  size?: "md" | "sm";
  selected?: boolean;
  copy?: boolean;
}

/** One color token: its color on the checkerboard, name, value, alias and a copy Button. */
export const ColorSwatch = React.forwardRef<HTMLDivElement, ColorSwatchProps>(function ColorSwatch(
  { color, name, value, alias, usage, layout = "card", size = "md", selected, copy = true, className, ...rest }, ref) {
  const fill = React.useRef<HTMLSpanElement>(null);
  const resolved = useResolvedColor(fill);
  const [copied, doCopy] = useCopy(1200);
  const shown = value ?? (resolved ? formatColor(resolved) : "");
  const card = layout === "card";
  const copyBtn = copy && name && layout !== "chip" ? (
    <Button variant="ghost" size="sm" icon={copied ? <CheckGlyph /> : <CopyGlyph />} aria-label={copied ? "Copied" : `Copy ${name}`} onClick={() => void doCopy(name)}
      className={cn("opacity-0 transition-opacity duration-(--duration-fast) group-hover/swatch:opacity-100 group-focus-within/swatch:opacity-100 pointer-coarse:opacity-100 motion-reduce:transition-none",
        card && "absolute top-xs right-xs bg-elevated shadow-elevation-sm")} />
  ) : null;
  return (
    <div ref={ref} className={cn("group/swatch relative flex min-w-0 gap-sm font-primary",
      card && cn("flex-col rounded-lg border bg-primary p-xxs", size === "sm" ? "w-[calc(var(--size-5xl)*2.5)]" : "w-[calc(var(--size-5xl)*3+var(--size-lg))]"),
      card && (selected ? "border-accent-primary shadow-[0_0_0_1px_var(--border-accent-primary)]" : "border-secondary"),
      layout === "row" && "items-center py-xxs", className)} {...rest}>
      <span aria-hidden="true" className={cn("seed-checker relative block shrink-0 overflow-hidden shadow-[inset_0_0_0_1px_var(--border-secondary)]",
        layout === "chip" ? "size-(--size-xl) rounded-sm" : layout === "row" ? "size-(--size-3xl) rounded-md" : cn("w-full rounded-md", size === "sm" ? "h-(--size-5xl)" : "h-[calc(var(--size-5xl)*1.5)]"))}>
        <span ref={fill} className="absolute inset-0 rounded-[inherit]" style={{ background: color }} />
      </span>
      {layout === "chip" ? null : (
        <span className={cn("flex min-w-0 flex-1 flex-col gap-xxxs", card && "px-xxs pb-xxs")}>
          {name ? <span className="truncate text-primary mono-value-regular">{name}</span> : null}
          <span className="font-mono text-secondary body-body-4-regular">{shown}{alias ? <span className="text-tertiary"> → {alias}</span> : null}</span>
          {usage && layout !== "row" ? <span className="text-tertiary body-body-4-regular">{usage}</span> : null}
        </span>
      )}
      {copyBtn}
    </div>
  );
});

/* ---------- ColorScale ---------- */

export interface ColorScaleStep { label: string; color: string }
export interface ColorScaleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  steps?: ColorScaleStep[];
  /** { "50": "#eff6ff", ... } in place of steps. */
  colors?: Record<string, string>;
  name?: string;
  /** The step that is the brand color. */
  anchor?: string | number;
  showValues?: boolean;
  /** Makes the steps a radio group. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (label: string) => void;
}

/** A color ramp from 50 to 950 in one row. */
export const ColorScale = React.forwardRef<HTMLDivElement, ColorScaleProps>(function ColorScale(
  { steps, colors, name, anchor, showValues, value, defaultValue = null, onValueChange, className, ...rest }, ref) {
  const list = steps ?? Object.entries(colors ?? {}).map(([label, color]) => ({ label, color }));
  const [inner, setInner] = React.useState(defaultValue);
  const sel = value !== undefined ? value : inner;
  const selectable = !!onValueChange || defaultValue != null;
  const pick = (l: string) => { if (value === undefined) setInner(l); onValueChange?.(l); };
  const onKey = (e: React.KeyboardEvent) => {
    const i = list.findIndex((s) => s.label === sel);
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = list[(Math.max(i, 0) + d + list.length) % list.length]!;
    pick(n.label);
    (e.currentTarget.querySelector(`[data-label="${CSS.escape(n.label)}"]`) as HTMLElement | null)?.focus();
  };
  return (
    <div ref={ref} className={cn("flex flex-col gap-xs font-primary", className)} {...rest}>
      {name ? <div className="text-tertiary uppercase tracking-widest mono-label-medium">{name}</div> : null}
      <div role={selectable ? "radiogroup" : "list"} aria-label={name ?? "Color scale"} onKeyDown={selectable ? onKey : undefined} className="flex gap-xxxs">
        {list.map((s, i) => {
          const c = parseColor(s.color);
          const light = c ? contrastRatio({ r: 255, g: 255, b: 255, a: 1 }, c) >= 4.5 : false;
          const isAnchor = anchor != null && String(anchor) === s.label;
          const on = sel != null && String(sel) === s.label;
          const label = (name ? `${name} ` : "") + s.label + (isAnchor ? ", brand color" : "");
          const body = (
            <>
              <span className={cn("seed-checker relative block h-(--size-4xl) rounded-sm shadow-[inset_0_0_0_1px_var(--border-tertiary)] transition-transform duration-(--duration-fast) motion-reduce:transition-none",
                i === 0 && "rounded-l-md", i === list.length - 1 && "rounded-r-md", on && "shadow-[0_0_0_2px_var(--bg-primary),0_0_0_4px_var(--border-accent-primary)]")}>
                <span className="absolute inset-0 rounded-[inherit]" style={{ background: s.color }} />
                {isAnchor ? <span title="Brand color" className="absolute bottom-xxs left-1/2 size-(--size-xs) -translate-x-1/2 rounded-full" style={{ background: light ? "#fff" : "#171717" }} /> : null}
              </span>
              <span className={cn("font-mono body-body-4-regular", on ? "font-semibold text-primary" : "text-secondary")}>{s.label}</span>
              {showValues && c ? <span className="truncate font-mono text-tertiary body-body-4-regular">{toHex(c)}</span> : null}
            </>
          );
          const cell = "flex min-w-0 flex-1 flex-col gap-xxs text-left";
          return selectable ? (
            <button key={s.label} type="button" role="radio" aria-checked={on} aria-label={label} data-label={s.label} tabIndex={on || (sel == null && i === 0) ? 0 : -1} onClick={() => pick(s.label)}
              className={cn(cell, "group/step cursor-pointer rounded-sm border-0 bg-transparent p-0 font-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary [&:hover>span:first-child]:-translate-y-(--size-xxs)")}>{body}</button>
          ) : <span key={s.label} role="listitem" aria-label={label} title={c ? toHex(c) : s.color} className={cell}>{body}</span>;
        })}
      </div>
    </div>
  );
});

/* ---------- TokenPreview ---------- */

export interface TokenPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  kind?: "space" | "size" | "radius" | "shadow" | "border" | "opacity" | "duration";
  /** The CSS value to draw, usually the token (var(--space-base)). */
  value: string;
  /** Text shown in place of the raw value. */
  display?: React.ReactNode;
  name?: string;
  usage?: React.ReactNode;
  layout?: "row" | "tile";
}

/** What a non-color token does: spacing as a bar, a radius as a corner, a shadow on a card, a duration as motion. */
export const TokenPreview = React.forwardRef<HTMLDivElement, TokenPreviewProps>(function TokenPreview(
  { kind = "space", value, display, name, usage, layout = "row", className, ...rest }, ref) {
  const bar = "block max-w-full min-w-px rounded-sm border border-accent-primary bg-accent-primary";
  const vis =
    kind === "space" ? <span className={cn(bar, "h-(--space-sm)")} style={{ width: value }} />
    : kind === "size" ? <span className={cn(bar, "max-h-[calc(var(--size-5xl)*1.5)]")} style={{ width: value, height: value }} />
    : kind === "radius" ? <span className="block size-(--size-4xl) border-t-2 border-l-2 border-primary-solid bg-linear-135 from-(--bg-tertiary) to-transparent to-70%" style={{ borderTopLeftRadius: value }} />
    : kind === "shadow" ? <span className="block h-(--size-4xl) w-(--size-5xl) rounded-md bg-elevated" style={{ boxShadow: value }} />
    : kind === "border" ? <span className="block h-(--size-3xl) w-(--size-5xl) rounded-md border-solid border-primary-solid" style={{ borderWidth: value }} />
    : kind === "opacity" ? <span className="seed-checker relative block h-(--size-3xl) w-(--size-5xl) overflow-hidden rounded-md"><span className="absolute inset-0 bg-(--text-primary)" style={{ opacity: value }} /></span>
    : <span className="relative block h-(--size-xs) w-[calc(var(--size-5xl)+var(--size-3xl))] rounded-full bg-tertiary"><span className="seed-token-move absolute -top-(--size-xs) left-0 size-(--size-md) rounded-full bg-accent-solid" style={{ animationDuration: value }} /></span>;
  const tile = layout === "tile";
  return (
    <div ref={ref} className={cn("flex min-w-0 gap-sm font-primary", tile ? "w-[calc(var(--size-5xl)*3-var(--size-sm))] flex-col items-start rounded-lg border border-secondary p-sm" : "items-center", className)} {...rest}>
      <span aria-hidden="true" className={cn("flex shrink-0 items-center", tile ? "h-[calc(var(--size-5xl)*1.5)] w-full justify-center" : "min-h-(--size-3xl) w-[calc(var(--size-5xl)*2)]", kind === "shadow" && "justify-center py-sm")}>{vis}</span>
      <span className="flex min-w-0 flex-col gap-xxxs">
        {name ? <span className="text-primary mono-value-regular">{name}</span> : null}
        <span className="font-mono text-secondary body-body-4-regular">{display ?? value}</span>
        {usage ? <span className="text-tertiary body-body-4-regular">{usage}</span> : null}
      </span>
    </div>
  );
});

/* ---------- TypeSpecimen ---------- */

export interface TypeSpecs { family?: string; size?: string; lineHeight?: string; weight?: string | number; tracking?: string }
export interface TypeSpecimenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The type style class, like heading-h5-semibold. */
  styleName: string;
  sample?: React.ReactNode;
  usage?: React.ReactNode;
  /** Shown instead of measuring the sample. */
  specs?: TypeSpecs;
  layout?: "row" | "stack";
}

/** One text style: its name, specs and a sample set in it. */
export const TypeSpecimen = React.forwardRef<HTMLDivElement, TypeSpecimenProps>(function TypeSpecimen(
  { styleName, sample = "The quick brown fox jumps over the lazy dog", usage, specs, layout = "row", className, ...rest }, ref) {
  const el = React.useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = React.useState<TypeSpecs | null>(null);
  React.useLayoutEffect(() => {
    if (specs || !el.current) return;
    const cs = getComputedStyle(el.current);
    const next = { family: cs.fontFamily.split(",")[0]!.replace(/["']/g, ""), size: cs.fontSize, lineHeight: cs.lineHeight, weight: cs.fontWeight, tracking: cs.letterSpacing === "normal" ? "0" : cs.letterSpacing };
    setMeasured((p) => (JSON.stringify(p) === JSON.stringify(next) ? p : next));
  }, [styleName, specs]);
  const s = specs ?? measured ?? {};
  const line = [s.family, s.size && s.lineHeight ? `${s.size} / ${s.lineHeight}` : s.size, s.weight, s.tracking && s.tracking !== "0" && s.tracking !== "0px" ? `tracking ${s.tracking}` : null].filter(Boolean).join(" · ");
  return (
    <div ref={ref} className={cn("grid items-baseline gap-base border-b border-tertiary py-sm font-primary",
      layout === "stack" ? "grid-cols-1 gap-xs" : "grid-cols-1 sm:grid-cols-[minmax(calc(var(--size-5xl)*3+var(--size-lg)),calc(var(--size-5xl)*4+var(--size-xl)))_minmax(0,1fr)]", className)} {...rest}>
      <div className="flex min-w-0 flex-col gap-xxxs">
        <span className="text-primary [overflow-wrap:anywhere] mono-value-regular">{styleName}</span>
        <span className="font-mono text-tertiary body-body-4-regular">{line}</span>
        {usage ? <span className="text-secondary body-body-4-regular">{usage}</span> : null}
      </div>
      <div ref={el} className={cn("min-w-0 truncate text-primary", styleName)}>{sample}</div>
    </div>
  );
});

/* ---------- ContrastPair ---------- */

export interface ContrastPairProps extends React.HTMLAttributes<HTMLDivElement> {
  fg: string;
  bg: string;
  /** text (4.5:1, AAA 7:1), large (3:1, AAA 4.5:1) or ui (3:1). */
  kind?: "text" | "large" | "ui";
  /** Each sample sits in its own data-theme. Leave out to check the current theme. */
  themes?: string[];
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const WHITE = { r: 255, g: 255, b: 255, a: 1 };
function ContrastSample({ fg, bg, kind, theme }: { fg: string; bg: string; kind: "text" | "large" | "ui"; theme?: string }) {
  const box = React.useRef<HTMLDivElement>(null);
  const ink = React.useRef<HTMLSpanElement>(null);
  const b = useResolvedColor(box, "backgroundColor"), f = useResolvedColor(ink, "color");
  const ratio = f && b ? contrastRatio(f, blend(b, WHITE)) : null;
  const need = kind === "text" ? 4.5 : 3;
  const aaa = kind === "large" ? 4.5 : 7;
  const level = ratio == null ? null : kind !== "ui" && ratio >= aaa ? "AAA" : ratio >= need ? "AA" : "Fail";
  return (
    <div data-theme={theme} className="flex flex-col overflow-hidden rounded-lg border border-secondary bg-primary text-primary">
      <div ref={box} className="relative flex h-[calc(var(--size-5xl)*1.5)] items-center justify-center border-b border-secondary" style={{ background: bg }}>
        <span ref={ink} className={cn("leading-none", kind === "large" ? "heading-h4-semibold" : "label-label-1-medium")} style={{ color: fg }}>
          {kind === "ui" ? <CheckGlyph size={24} /> : "Aa"}
        </span>
        {theme ? <span className="absolute top-xxs left-xs uppercase tracking-widest opacity-70 mono-label-medium" style={{ color: fg }}>{theme}</span> : null}
      </div>
      <div className="flex items-center justify-between gap-xs px-sm py-xs">
        <span className="text-primary tabular-nums mono-value-regular">{ratio == null ? "–" : formatRatio(ratio)}</span>
        {level ? <Badge variant={level === "Fail" ? "error" : "success"}>{level === "Fail" ? `Fails ${need}:1` : level}</Badge> : null}
      </div>
    </div>
  );
}

/** A contrast check for one pair of colors, in each theme side by side. */
export const ContrastPair = React.forwardRef<HTMLDivElement, ContrastPairProps>(function ContrastPair(
  { fg, bg, kind = "text", themes, label, description, className, ...rest }, ref) {
  const list: (string | undefined)[] = themes?.length ? themes : [undefined];
  return (
    <div ref={ref} className={cn("flex flex-col gap-xs font-primary", className)} {...rest}>
      {label ? (
        <div className="flex flex-wrap items-baseline justify-between gap-x-sm">
          <span className="text-primary label-label-2-medium">{label}</span>
          <span className="text-tertiary body-body-4-regular">{description ?? (kind === "ui" ? "Icons and borders need 3:1" : kind === "large" ? "Large text needs 3:1" : "Text needs 4.5:1")}</span>
        </div>
      ) : null}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(calc(var(--size-5xl)*3),1fr))] gap-xs">
        {list.map((t, i) => <ContrastSample key={t ?? i} theme={t} fg={fg} bg={bg} kind={kind} />)}
      </div>
    </div>
  );
});

/* ---------- PropsTable ---------- */

export interface PropRow { name: string; type?: string; default?: React.ReactNode; required?: boolean; description?: React.ReactNode }
export interface PropsTableProps extends React.HTMLAttributes<HTMLTableElement> {
  props: PropRow[];
  /** Names the table "<Component> props". */
  component?: string;
}
const chip = "rounded-sm bg-tertiary px-xxs font-mono text-primary body-body-4-regular";

/** A component's API: each prop's name, type, default and description. */
export const PropsTable = React.forwardRef<HTMLTableElement, PropsTableProps>(function PropsTable({ props: rows, component, className, "aria-label": label, ...rest }, ref) {
  return (
    <Table ref={ref} aria-label={label ?? (component ? `${component} props` : "Props")} className={className} {...rest}>
      <TableHeader>
        <TableRow><TableHead className="w-1/4">Prop</TableHead><TableHead className="w-3/10">Type</TableHead><TableHead className="w-[14%]">Default</TableHead><TableHead>Description</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.name}>
            <TableCell className="whitespace-nowrap text-primary">
              <code className="mono-value-regular">{r.name}</code>
              {r.required ? <span title="Required" className="text-error-primary"> *<span className="sr-only">required</span></span> : null}
            </TableCell>
            <TableCell>
              {r.type ? <span className="flex flex-wrap gap-xxxs">{r.type.split(/\s*\|\s*/).map((t, i) => <code key={i} className={chip}>{t}</code>)}</span> : null}
            </TableCell>
            <TableCell>{r.default != null ? <code className={chip}>{r.default}</code> : <span className="text-tertiary" aria-label="No default">–</span>}</TableCell>
            <TableCell className="text-secondary body-body-3-regular">{r.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
