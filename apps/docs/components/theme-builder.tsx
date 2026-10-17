"use client";
import * as React from "react";
import { createTheme, formatRatio, type ThemeOptions } from "@flinbu/seed-tokens";
import { Alert, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, Field, Input, Progress, Switch, ToggleGroup, ToggleGroupItem, cn } from "@flinbu/seed";
import { Check, Copy, Palette, Search, X } from "lucide-react";
import { useSiteTheme } from "./site-theme";

const PRESETS = [
  { name: "Seed", brand: "#2563eb" }, { name: "Teal", brand: "#0d9488" }, { name: "Violet", brand: "#7c3aed" },
  { name: "Rose", brand: "#db2777" }, { name: "Ember", brand: "#ea580c" }, { name: "Sun", brand: "#facc15" }, { name: "Forest", brand: "#166534" },
];
type Opts = Required<Pick<ThemeOptions, "brand" | "radius" | "density" | "neutral">>;

function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-col gap-xxs">
      <span className="label-label-3-medium text-secondary">{label}</span>
      <ToggleGroup type="single" size="sm" variant="outline" value={value} allowEmpty={false} onValueChange={(v) => onChange(v as T)} aria-label={label} className="flex-wrap">
        {options.map(([v, l]) => <ToggleGroupItem key={v} value={v}>{l}</ToggleGroupItem>)}
      </ToggleGroup>
    </div>
  );
}

/** Pick a brand and presets; see Seed re-themed live, every contrast check, and the CSS to copy. */
export function ThemeBuilder() {
  const { saved, apply } = useSiteTheme();
  const [o, setO] = React.useState<Opts>({ brand: "#0d9488", radius: "default", density: "default", neutral: "neutral" });
  const [hex, setHex] = React.useState(o.brand);
  const [copied, setCopied] = React.useState<string | null>(null);
  const set = (p: Partial<Opts>) => setO((x) => ({ ...x, ...p }));
  const theme = React.useMemo(() => { try { return createTheme({ ...o, name: "preview" }); } catch { return null; } }, [o]);
  const cssOut = React.useMemo(() => { try { return createTheme({ ...o, name: "acme" }).css; } catch { return ""; } }, [o]);
  React.useEffect(() => {
    let el = document.getElementById("seed-preview-theme") as HTMLStyleElement | null;
    if (!el) { el = document.createElement("style"); el.id = "seed-preview-theme"; document.head.appendChild(el); }
    if (theme) el.textContent = theme.css;
  }, [theme]);
  const cli = `npx seed theme --brand "${o.brand}" --name acme${o.radius !== "default" ? ` --radius ${o.radius}` : ""}${o.density !== "default" ? ` --density ${o.density}` : ""}${o.neutral !== "neutral" ? ` --neutral ${o.neutral}` : ""} --out src/acme.css`;
  const copy = async (k: string, t: string) => { await navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 1500); };
  const fails = theme?.checks.filter((c) => !c.pass) ?? [];
  const applied = saved && saved.brand === o.brand && saved.radius === o.radius && saved.density === o.density && saved.neutral === o.neutral;

  return (
    <div className="not-prose my-xl flex flex-col overflow-hidden rounded-xl border border-secondary bg-primary">
      <div className="flex flex-col gap-base border-b border-secondary p-lg">
        <div className="flex flex-wrap items-end gap-base">
          <div className="flex flex-col gap-xxs">
            <span className="label-label-3-medium text-secondary">Brand color</span>
            <div className="flex items-center gap-xs">
              <input type="color" aria-label="Brand color picker" value={o.brand} onChange={(e) => { set({ brand: e.target.value }); setHex(e.target.value); }}
                className="size-control-md cursor-pointer rounded-control border border-primary bg-primary p-xxxs" />
              <Input size="md" aria-label="Brand color hex" value={hex} className="w-32 font-mono"
                onChange={(e) => { setHex(e.target.value); if (/^#[0-9a-f]{6}$/i.test(e.target.value)) set({ brand: e.target.value }); }} />
            </div>
          </div>
          <div className="flex flex-wrap gap-xxs">
            {PRESETS.map((p) => (
              <button key={p.name} type="button" onClick={() => { set({ brand: p.brand }); setHex(p.brand); }} aria-pressed={o.brand === p.brand}
                className={cn("inline-flex h-control-sm items-center gap-xs rounded-full border px-sm label-label-3-medium text-secondary transition-colors", o.brand === p.brand ? "border-accent-primary bg-selected text-primary" : "border-secondary hover:bg-secondary-hover")}>
                <span aria-hidden className="size-(--size-md) rounded-full" style={{ background: p.brand }} />{p.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-lg">
          <Seg label="Corners" value={o.radius} options={[["sharp", "Sharp"], ["default", "Default"], ["round", "Round"], ["pill", "Pill"]]} onChange={(radius) => set({ radius })} />
          <Seg label="Density" value={o.density} options={[["compact", "Compact"], ["default", "Default"], ["comfortable", "Comfortable"]]} onChange={(density) => set({ density })} />
          <Seg label="Grays" value={o.neutral} options={[["neutral", "Neutral"], ["slate", "Slate"], ["zinc", "Zinc"], ["stone", "Stone"]]} onChange={(neutral) => set({ neutral })} />
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div data-brand="preview" className="stage flex flex-col gap-base border-b border-secondary p-lg lg:border-r lg:border-b-0">
          <div className="flex gap-px overflow-hidden rounded-md" aria-label="Brand scale" role="img">
            {theme ? Object.entries(theme.scale).map(([s, c]) => <span key={s} className="h-(--size-2xl) flex-1" style={{ background: c }} title={`brand-${s} ${c}`} />) : null}
          </div>
          <Card>
            <CardHeader><CardTitle>Invite your team</CardTitle><CardDescription>Editors can propose changes; viewers are free.</CardDescription></CardHeader>
            <CardContent className="flex flex-col gap-sm">
              <Field label="Email"><Input leftIcon={<Search />} placeholder="name@company.com" /></Field>
              <div className="flex flex-wrap gap-sm"><Checkbox label="Can approve" defaultChecked /><Switch label="Email digest" defaultChecked /></div>
              <Progress value={62} label="Seats used" showValue size="sm" />
              <p className="m-0 body-body-3-regular text-secondary">Read the <a href="#" className="text-link underline underline-offset-3">guide to roles</a>.</p>
            </CardContent>
            <CardFooter className="flex-wrap justify-between">
              <div className="flex gap-xxs"><Badge variant="accent">New</Badge><Badge variant="accent" appearance="solid">3 seats</Badge></div>
              <div className="flex gap-xs"><Button variant="secondary" size="sm">Cancel</Button><Button size="sm" leftIcon={<Palette />}>Send invites</Button></div>
            </CardFooter>
          </Card>
        </div>

        <div className="flex flex-col gap-base p-lg">
          <div className="flex items-center justify-between gap-xs">
            <span className="label-label-2-semibold text-primary">Contrast</span>
            {theme ? <Badge variant={fails.length ? "error" : "success"} icon={fails.length ? X : Check}>{fails.length ? `${fails.length} fail` : `All ${theme.checks.length} pass AA`}</Badge> : null}
          </div>
          <ul className="m-0 flex max-h-56 list-none flex-col gap-xxxs overflow-y-auto p-0">
            {theme?.checks.map((c, i) => (
              <li key={i} className="flex items-center justify-between gap-xs body-body-4-regular">
                <span className="flex items-center gap-xxs text-secondary">{c.pass ? <Check size={12} aria-hidden className="text-icon-success-primary" /> : <X size={12} aria-hidden className="text-icon-error-primary" />}<span className="mono-value-regular text-tertiary">{c.mode}</span> {c.label}</span>
                <span className="tabular-nums text-primary">{formatRatio(c.ratio)}</span>
              </li>
            ))}
          </ul>
          {theme?.adjustments.length ? <p className="m-0 body-body-4-regular text-tertiary">Seed moved {theme.adjustments.length} {theme.adjustments.length === 1 ? "token" : "tokens"} along the scale so they pass.</p> : null}
          {theme && theme.onAccent !== "#ffffff" ? <Alert variant="neutral" title="Near-black text on buttons">White doesn’t reach 4.5:1 on this brand, so buttons keep your color with dark text.</Alert> : null}
          <div className="mt-auto flex flex-wrap gap-xs">
            <Button size="sm" onClick={() => apply(applied ? null : o)} variant={applied ? "secondary" : "primary"}>{applied ? "Remove from this site" : "Try it on this site"}</Button>
            <Button size="sm" variant="secondary" leftIcon={copied === "css" ? Check : Copy} onClick={() => copy("css", cssOut)}>{copied === "css" ? "Copied" : "Copy CSS"}</Button>
            <Button size="sm" variant="ghost" leftIcon={copied === "cli" ? Check : Copy} onClick={() => copy("cli", cli)}>{copied === "cli" ? "Copied" : "Copy command"}</Button>
          </div>
          <code className="block overflow-x-auto whitespace-nowrap rounded-md bg-inset px-sm py-xs font-mono body-body-4-regular text-secondary">{cli}</code>
        </div>
      </div>
    </div>
  );
}
