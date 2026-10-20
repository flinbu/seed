"use client";
import * as React from "react";
import { Slider, Switch, ToggleGroup, ToggleGroupItem, cn } from "@flinbu/seed";

const SAMPLES = {
  headline: "Grow from a single seed.",
  paragraph:
    "A design system is a promise kept in small places: the space under a heading, the weight of a label, the calm of a page that reads well. Fenly Serif carries titles and long reading text, so a screen can be quiet and still have a voice.",
  pangram: "Sphinx of black quartz, judge my vow. ¿Qué pingüino ñandú vio el kiwi? 0123456789",
} as const;
type Sample = keyof typeof SAMPLES;
const NAMES: Record<number, string> = { 200: "ExtraLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black" };
const weightName = (w: number) => NAMES[Math.round(w / 100) * 100] ?? String(w);

function Control({ label, value, children }: { label: string; value?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-xxs">
      <span className="flex items-center justify-between gap-xs">
        <span className="label-label-3-medium text-secondary">{label}</span>
        {value ? <span className="mono-value-regular text-tertiary">{value}</span> : null}
      </span>
      {children}
    </div>
  );
}

/** Type anything and set its size, weight, spacing and style. The preview is editable. */
export function TypeTester() {
  const [sample, setSample] = React.useState<Sample>("headline");
  const [size, setSize] = React.useState(88);
  const [weight, setWeight] = React.useState(400);
  const [track, setTrack] = React.useState(-2);
  const [italic, setItalic] = React.useState(false);
  const pick = (s: Sample) => {
    setSample(s);
    setSize(s === "headline" ? 88 : s === "paragraph" ? 22 : 40);
    setTrack(s === "headline" ? -2 : 0);
    setWeight(s === "paragraph" ? 300 : 400);
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-secondary bg-primary">
      <div className="grid grid-cols-1 gap-base border-b border-secondary bg-secondary p-base sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_auto] lg:items-end">
        <Control label="Text">
          <ToggleGroup type="single" size="sm" variant="outline" allowEmpty={false} value={sample} onValueChange={(v) => pick(v as Sample)} aria-label="Sample text">
            <ToggleGroupItem value="headline">Headline</ToggleGroupItem>
            <ToggleGroupItem value="paragraph">Paragraph</ToggleGroupItem>
            <ToggleGroupItem value="pangram">Pangram</ToggleGroupItem>
          </ToggleGroup>
        </Control>
        <Control label="Size" value={`${size}px`}>
          <Slider min={12} max={160} value={size} onValueChange={(v) => setSize(v as number)} aria-label="Size" />
        </Control>
        <Control label="Weight" value={`${weight} · ${weightName(weight)}`}>
          <Slider min={200} max={900} step={10} value={weight} onValueChange={(v) => setWeight(v as number)} aria-label="Weight" />
        </Control>
        <Control label="Letter spacing" value={`${track / 100}em`}>
          <Slider min={-6} max={10} value={track} onValueChange={(v) => setTrack(v as number)} aria-label="Letter spacing" />
        </Control>
        <Switch label="Italic" checked={italic} onCheckedChange={setItalic} />
      </div>
      <div
        key={sample}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        aria-label="Type tester: edit the text"
        className="min-h-56 p-xl font-display text-primary outline-none [overflow-wrap:anywhere] focus-visible:bg-secondary/40"
        style={{ fontSize: size, lineHeight: size > 40 ? 1.08 : 1.6, fontWeight: weight, fontStyle: italic ? "italic" : "normal", letterSpacing: `${track / 100}em` }}
      >
        {SAMPLES[sample]}
      </div>
    </div>
  );
}

/** Every character in the font; pick one to see it large with its code point. */
export function GlyphExplorer({ sets }: { sets: { name: string; chars: string }[] }) {
  const [glyph, setGlyph] = React.useState("g");
  const [italic, setItalic] = React.useState(false);
  const [weight, setWeight] = React.useState(400);
  const cp = `U+${glyph.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`;
  return (
    <div className="grid grid-cols-1 gap-lg lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 flex-col gap-lg">
        {sets.map((s) => (
          <div key={s.name} className="flex flex-col gap-xs">
            <span className="mono-label-medium text-tertiary">{s.name}</span>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(var(--size-4xl),1fr))] gap-xxs">
              {[...s.chars].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setGlyph(c)}
                  aria-label={`${c} ${`U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`}`}
                  aria-pressed={c === glyph}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-md border border-secondary bg-primary font-display text-[22px] text-primary transition-colors hover:bg-secondary-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-primary",
                    c === glyph && "border-accent-primary bg-selected text-accent-primary",
                  )}
                  style={{ fontStyle: italic ? "italic" : "normal", fontWeight: weight }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="lg:sticky lg:top-(--space-6xl) lg:self-start">
        <div className="flex flex-col overflow-hidden rounded-2xl border border-secondary bg-primary">
          <div className="stage relative flex aspect-square items-center justify-center overflow-hidden">
            <span className="font-display text-[176px] leading-none text-primary" style={{ fontStyle: italic ? "italic" : "normal", fontWeight: weight }}>
              {glyph}
            </span>
          </div>
          <div className="flex flex-col gap-sm border-t border-secondary p-base">
            <span className="flex items-baseline justify-between">
              <span className="heading-h6-semibold text-primary">{glyph}</span>
              <code className="mono-value-regular text-secondary">{cp}</code>
            </span>
            <Control label="Weight" value={`${weight} · ${weightName(weight)}`}>
              <Slider min={200} max={900} step={10} value={weight} onValueChange={(v) => setWeight(v as number)} aria-label="Glyph weight" />
            </Control>
            <Switch label="Italic" checked={italic} onCheckedChange={setItalic} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** One line per weight, moving through the axis on hover. */
export function WeightAxis() {
  const [w, setW] = React.useState(400);
  return (
    <div className="flex flex-col gap-base">
      <div className="flex items-center gap-base">
        <Slider min={200} max={900} value={w} onValueChange={(v) => setW(v as number)} aria-label="Weight axis" className="flex-1" />
        <span className="w-36 text-right mono-value-regular text-secondary">wght {w}</span>
      </div>
      <p className="m-0 font-display text-[clamp(56px,10vw,128px)] leading-none tracking-[-0.03em] text-primary" style={{ fontWeight: w }}>
        Aa Gg Rr 86
      </p>
    </div>
  );
}
