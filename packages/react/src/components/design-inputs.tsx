import * as React from "react";
import { Popover as P, Slider as S } from "radix-ui";
import { cn } from "../lib/cn.js";
import { formatOklch, fromHsv, parseColor, toHex, toHsv, type HSV } from "../lib/color.js";
import type { IconProp } from "../lib/icon.js";
import { useField } from "./field.js";
import { fieldFrame } from "./input.js";
import { InputGroup } from "./input-group.js";
import { Button } from "./button.js";
import { Combobox, type ComboboxProps } from "./combobox.js";
import { PopoverContent } from "./popover.js";

const SIZE = { sm: "h-control-sm px-xs body-body-3-regular", md: "h-control-md px-sm body-body-3-regular", lg: "h-control-lg px-base body-body-2-regular" } as const;
const glyph = (d: React.ReactNode) => function G() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
};
const PipetteGlyph = glyph(<><path d="m2 22 1-1h3l9-9" /><path d="M3 21v-3l9-9" /><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" /></>);
const MinusGlyph = glyph(<path d="M5 12h14" />);
const PlusGlyph = glyph(<><path d="M5 12h14" /><path d="M12 5v14" /></>);
const HashGlyph = glyph(<><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" /></>);

/* ---------- ColorPicker ---------- */

function ColorArea({ hsv, onChange }: { hsv: HSV; onChange: (n: HSV) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const at = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    onChange({ h: hsv.h, s: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), v: Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height)) });
  };
  return (
    <div ref={ref} className="seed-color-area relative h-[calc(var(--size-5xl)*3+var(--size-sm)-var(--size-xxs))] cursor-crosshair touch-none rounded-md"
      style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)` }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); at(e); (e.currentTarget.firstElementChild as HTMLElement | null)?.focus(); }}
      onPointerMove={(e) => { if (e.buttons) at(e); }}>
      <span tabIndex={0} role="slider" aria-label="Saturation and brightness"
        aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
        aria-valuenow={Math.round(hsv.s * 100)} aria-valuemin={0} aria-valuemax={100}
        className="seed-color-thumb absolute -mt-(--size-sm) -ml-(--size-sm) size-(--size-lg) rounded-full"
        style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: toHex(fromHsv(hsv)) }}
        onKeyDown={(e) => {
          const d = e.shiftKey ? 0.1 : 0.01; const n = { ...hsv };
          if (e.key === "ArrowLeft") n.s -= d; else if (e.key === "ArrowRight") n.s += d; else if (e.key === "ArrowUp") n.v += d; else if (e.key === "ArrowDown") n.v -= d; else return;
          e.preventDefault(); n.s = Math.max(0, Math.min(1, n.s)); n.v = Math.max(0, Math.min(1, n.v)); onChange(n);
        }} />
    </div>
  );
}

export type ColorPickerSwatch = string | { color: string; name?: string };
export interface ColorPickerProps {
  /** A hex color. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  swatches?: ColorPickerSwatch[];
  /** The panel without the trigger, for a sidebar or a dialog. */
  inline?: boolean;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  defaultOpen?: boolean;
  "aria-label"?: string;
}

/** Pick a color by eye or by value: an area, a hue slider, a hex field, the OKLCH reading and suggested swatches. */
export function ColorPicker({ value, defaultValue = "#2563eb", onValueChange, swatches, inline, size = "md", invalid, disabled, id, className, defaultOpen, "aria-label": label }: ColorPickerProps) {
  const f = useField();
  const [inner, setInner] = React.useState(defaultValue);
  const current = value ?? inner;
  const c = parseColor(current) ?? { r: 0, g: 0, b: 0, a: 1 };
  const [hsv, setHsvState] = React.useState<HSV>(() => toHsv(c));
  const [hex, setHexText] = React.useState(toHex(c));
  const last = React.useRef(toHex(c));
  React.useEffect(() => {
    const hx = toHex(c);
    if (hx !== last.current) { last.current = hx; setHsvState(toHsv(c)); setHexText(hx); }
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps
  const emit = (hx: string) => { last.current = hx; if (value === undefined) setInner(hx); onValueChange?.(hx); };
  const setHsv = (n: HSV) => { setHsvState(n); const hx = toHex(fromHsv(n)); setHexText(hx); emit(hx); };
  const setHex = (text: string) => {
    setHexText(text);
    const p = parseColor(text);
    if (p && /^#?([0-9a-f]{6}|[0-9a-f]{3})$/i.test(text.trim())) { setHsvState(toHsv(p)); emit(toHex(p)); }
  };
  const shown = toHex(c);
  const panel = (
    <div className="flex flex-col gap-sm font-primary">
      <ColorArea hsv={hsv} onChange={setHsv} />
      <S.Root min={0} max={359} value={[Math.round(hsv.h)]} onValueChange={(v) => setHsv({ ...hsv, h: v[0]! })} className="relative flex h-control-sm touch-none select-none items-center">
        <S.Track className="seed-hue-track relative h-(--size-md) grow rounded-full" />
        <S.Thumb aria-label="Hue" className="seed-color-thumb block size-(--size-lg) cursor-grab rounded-full" style={{ background: `hsl(${hsv.h} 100% 50%)` }} />
      </S.Root>
      <div className="flex flex-col gap-xxs">
        <InputGroup size="sm" aria-label="Hex" value={hex} start="HEX" spellCheck={false} onChange={(e) => setHex(e.target.value)} className="font-mono" />
        <span title="OKLCH" className="font-mono text-tertiary body-body-4-regular">{formatOklch(c)}</span>
      </div>
      {swatches?.length ? (
        <div role="list" aria-label="Suggested colors" className="flex flex-wrap gap-xxs border-t border-tertiary pt-xs">
          {swatches.map((s, i) => {
            const col = typeof s === "string" ? s : s.color;
            const name = typeof s === "string" ? s : s.name ?? s.color;
            const p = parseColor(col);
            const on = p ? toHex(p) === shown : false;
            return (
              <span key={i} role="listitem">
                <button type="button" aria-label={name} title={name} aria-pressed={on} onClick={() => p && setHex(toHex(p))} style={{ background: col }}
                  className={cn("block size-(--size-xl) cursor-pointer rounded-sm border-0 p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
                    on ? "shadow-[0_0_0_2px_var(--bg-elevated),0_0_0_4px_var(--border-accent-primary)]" : "shadow-[inset_0_0_0_1px_var(--border-secondary)]")} />
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
  if (inline) return <div className={cn("w-[calc(var(--size-5xl)*5)]", className)}>{panel}</div>;
  const bad = invalid ?? f?.invalid, off = disabled ?? f?.disabled;
  return (
    <P.Root defaultOpen={defaultOpen}>
      <P.Trigger asChild>
        <button type="button" id={id ?? f?.id} disabled={off} aria-label={label} aria-describedby={f?.describedBy} aria-invalid={bad || undefined}
          className={cn("flex w-full cursor-pointer items-center gap-xs text-left text-primary", fieldFrame, SIZE[size],
            "focus-visible:border-accent-primary focus-visible:shadow-button-focus-primary focus-visible:outline-none data-[state=open]:border-accent-primary",
            bad && "border-error-primary", off && "cursor-not-allowed border-disabled-alt bg-disabled-alt text-disabled", className)}>
          <span className="size-(--size-lg) shrink-0 rounded-sm shadow-[inset_0_0_0_1px_var(--border-secondary)]" style={{ background: shown }} />
          <span className="min-w-0 flex-1 truncate mono-value-regular">{shown}</span>
          <span className="inline-flex text-icon-tertiary"><PipetteGlyph /></span>
        </button>
      </P.Trigger>
      <PopoverContent aria-label={label ?? "Color picker"} className="w-[calc(var(--size-5xl)*5+var(--size-xl))]">{panel}</PopoverContent>
    </P.Root>
  );
}

/* ---------- TokenInput ---------- */

export interface TokenOption { name: string; value?: string; color?: string; kind?: string; icon?: IconProp; group?: string }
export interface TokenInputProps extends Omit<ComboboxProps, "options"> { tokens: TokenOption[] }

/** A field to point at a token instead of a raw value: search by name or value, with its color beside it. */
export const TokenInput = React.forwardRef<HTMLInputElement, TokenInputProps>(function TokenInput({ tokens, placeholder = "Search tokens", emptyText = "No tokens match", ...rest }, ref) {
  const options = tokens.map((t) => {
    const isColor = t.kind ? t.kind === "color" : !!parseColor(t.value) || /^var\(/.test(String(t.color ?? ""));
    return {
      value: t.name, label: t.name, description: t.value, keywords: [String(t.value ?? ""), t.group ?? ""],
      icon: isColor
        ? <span className="inline-block size-(--size-md) shrink-0 rounded-sm shadow-[inset_0_0_0_1px_var(--border-secondary)]" style={{ background: t.color ?? t.value }} />
        : (t.icon ?? HashGlyph),
    };
  });
  return <Combobox ref={ref} options={options} placeholder={placeholder} emptyText={emptyText} {...rest} />;
});

/* ---------- NumberInput ---------- */

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "size" | "onChange" | "step" | "min" | "max"> {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Decimals follow the step. Default 1. */
  step?: number;
  /** px, ms, %. */
  unit?: string;
  stepper?: boolean;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
}

/** A number field with a unit and steppers: radii, spacing, durations, opacity. */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(function NumberInput(
  { value, defaultValue = null, onValueChange, min, max, step = 1, unit, stepper = true, size = "md", invalid, disabled, className, onBlur, onKeyDown, ...rest }, ref) {
  const [inner, setInner] = React.useState<number | null>(defaultValue);
  const v = value !== undefined ? value : inner;
  const [draft, setDraft] = React.useState<string | null>(null);
  const decimals = (String(step).split(".")[1] ?? "").length;
  const clamp = (n: number) => { if (min != null) n = Math.max(min, n); if (max != null) n = Math.min(max, n); return +n.toFixed(decimals); };
  const set = (n: number | null) => { if (value === undefined) setInner(n); onValueChange?.(n); };
  const bump = (dir: 1 | -1, big?: boolean) => { const base = v ?? min ?? 0; set(clamp(base + dir * step * (big ? 10 : 1))); setDraft(null); };
  const commit = () => { if (draft == null) return; const n = Number.parseFloat(draft); set(Number.isNaN(n) ? (draft.trim() === "" ? null : v) : clamp(n)); setDraft(null); };
  const btn = (dir: 1 | -1) => (
    <Button variant="ghost" size="sm" tabIndex={-1} aria-label={dir < 0 ? "Decrease" : "Increase"} icon={dir < 0 ? <MinusGlyph /> : <PlusGlyph />}
      disabled={disabled || (v != null && (dir < 0 ? min != null && v <= min : max != null && v >= max))} onClick={() => bump(dir)}
      className={cn(size === "sm" ? "size-(--size-2xl)" : "", dir < 0 ? "-ml-xxs" : "-mr-xxs")} />
  );
  return (
    <InputGroup ref={ref} size={size} invalid={invalid} disabled={disabled} inputMode="decimal" role="spinbutton"
      aria-valuenow={v ?? undefined} aria-valuemin={min} aria-valuemax={max} aria-valuetext={v == null ? undefined : `${v}${unit ? ` ${unit}` : ""}`}
      value={draft ?? (v == null ? "" : String(v))}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={(e) => { commit(); onBlur?.(e); }}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp") { e.preventDefault(); bump(1, e.shiftKey); }
        else if (e.key === "ArrowDown") { e.preventDefault(); bump(-1, e.shiftKey); }
        else if (e.key === "Enter") commit();
        onKeyDown?.(e);
      }}
      start={stepper ? btn(-1) : null}
      end={<>{unit ? <span className="whitespace-nowrap text-tertiary select-none">{unit}</span> : null}{stepper ? btn(1) : null}</>}
      className={cn("text-center tabular-nums [&_input]:text-center", className)} {...rest} />
  );
});
