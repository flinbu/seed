import { contrast, formatRatio, parseHex, toHex } from "./color";
import { generateScale, type Scale, type Step } from "./scale";
import { STEPS, brandDefault, primitives, semantic, shadows, radius as baseRadius, control as baseControl, fonts as baseFonts } from "./generated/tokens";

export type Mode = "light" | "dark";
export type NeutralScale = "neutral" | "gray" | "slate" | "zinc" | "stone";
export type RadiusPreset = "sharp" | "default" | "round" | "pill";
export type Density = "compact" | "default" | "comfortable";
export type FontRole = keyof typeof baseFonts;

export interface ThemeOptions {
  /** Scopes the theme to [data-brand="name"]. Without a name the theme replaces Seed's defaults on :root. */
  name?: string;
  /** Brand (accent) color as hex. Seed builds an 11-step scale around it. Default: Seed blue. */
  brand?: string;
  /** Which gray family surfaces, borders and text use. Default: neutral (true gray). */
  neutral?: NeutralScale;
  radius?: RadiusPreset;
  density?: Density;
  /** CSS font-family stacks per role. Load the fonts yourself. */
  fonts?: Partial<Record<FontRole, string>>;
  /** Text on accent solids. auto picks white, or near-black when the brand is too light for white. */
  onAccent?: "auto" | "white" | "dark";
}
export interface ThemeCheck { token: string; mode: Mode; against: string; ratio: number; min: number; pass: boolean; label: string }
export interface ThemeAdjustment { token: string; mode: Mode; from: string; to: string; reason: string }
export interface Theme {
  name: string | null;
  selector: string;
  css: string;
  scale: Scale;
  anchor: Step;
  onAccent: string;
  tokens: Record<Mode, Record<string, string>>;
  checks: ThemeCheck[];
  adjustments: ThemeAdjustment[];
  passed: boolean;
}

const DARK_TEXT = "#0a0a0a";
const RADIUS: Record<RadiusPreset, Partial<Record<string, string>>> = {
  default: {},
  sharp: { "radius-sm": "0px", "radius-md": "2px", "radius-lg": "4px", "radius-xl": "6px", "radius-2xl": "8px", "radius-3xl": "12px", "radius-4xl": "16px", "radius-5xl": "24px", "radius-control": "2px", "radius-petal": "4px", "radius-petal-tip": "2px" },
  round: { "radius-sm": "4px", "radius-md": "6px", "radius-lg": "12px", "radius-xl": "16px", "radius-2xl": "20px", "radius-3xl": "28px", "radius-4xl": "36px", "radius-5xl": "56px", "radius-control": "8px", "radius-petal": "16px", "radius-petal-tip": "6px" },
  pill: { "radius-sm": "4px", "radius-md": "6px", "radius-lg": "12px", "radius-xl": "16px", "radius-2xl": "20px", "radius-3xl": "28px", "radius-4xl": "36px", "radius-5xl": "56px", "radius-control": "9999px", "radius-petal": "16px", "radius-petal-tip": "6px" },
};
const DENSITY: Record<Density, Record<string, string>> = {
  compact: { "control-sm": "28px", "control-md": "36px", "control-lg": "44px" },
  default: {},
  comfortable: { "control-sm": "36px", "control-md": "44px", "control-lg": "52px" },
};

/* What each accent token has to reach. Text needs 4.5:1, icons and focus borders 3:1 (WCAG 2.2 AA). */
type Rule = { token: string; min: number; kind: "on-bg" | "on-tint" | "fill"; label: string };
const RULES: Rule[] = [
  { token: "text-accent-primary", min: 4.5, kind: "on-bg", label: "Accent text on bg-primary" },
  { token: "text-accent-primary-hover", min: 4.5, kind: "on-bg", label: "Accent text (hover) on bg-primary" },
  { token: "text-link", min: 4.5, kind: "on-bg", label: "Links on bg-primary" },
  { token: "text-link-hover", min: 4.5, kind: "on-bg", label: "Links (hover) on bg-primary" },
  { token: "icon-accent-primary", min: 3, kind: "on-bg", label: "Accent icons on bg-primary" },
  { token: "border-accent-primary", min: 3, kind: "on-bg", label: "Focus and selection border on bg-primary" },
  { token: "text-accent-primary", min: 4.5, kind: "on-tint", label: "Accent text on accent tint (badges, chips)" },
  { token: "bg-accent-solid", min: 4.5, kind: "fill", label: "Text on accent solid" },
  { token: "bg-accent-solid-hover", min: 4.5, kind: "fill", label: "Text on accent solid (hover)" },
  { token: "button-primary", min: 4.5, kind: "fill", label: "Primary button label" },
  { token: "button-primary-hover", min: 4.5, kind: "fill", label: "Primary button label (hover)" },
];

const stepOf = (ref: string | null) => (ref && /^brand-\d+$/.test(ref) ? (Number(ref.split("-")[1]) as Step) : null);
const idx = (s: Step) => STEPS.indexOf(s);

export function createTheme(options: ThemeOptions = {}): Theme {
  const name = options.name ? String(options.name).trim() : null;
  if (name && !/^[a-z0-9][a-z0-9-]*$/i.test(name)) throw new Error(`Theme name "${name}" can only use letters, numbers and dashes.`);
  const brandHex = options.brand ? toHex(parseHex(options.brand)) : null;
  const { scale, anchor } = brandHex ? generateScale(brandHex) : { scale: { ...brandDefault } as unknown as Scale, anchor: 600 as Step };
  const neutral = options.neutral || "neutral";

  // Resolve every semantic token per mode: which primitive (ref) and which hex.
  type Cell = { ref: string | null; hex: string };
  const sem = new Map<string, Record<Mode, Cell>>();
  const base = new Map<string, Record<Mode, string | null>>();
  const hexOf = (ref: string | null, raw: string) => {
    if (!ref) return raw;
    if (ref.startsWith("brand-")) return scale[Number(ref.split("-")[1]) as Step];
    return (primitives as Record<string, string>)[ref] ?? raw;
  };
  for (const s of semantic) {
    base.set(s.name, { light: s.lightRef, dark: s.darkRef });
    const cell = (m: Mode): Cell => {
      let ref = (m === "light" ? s.lightRef : s.darkRef) as string | null;
      if (ref && neutral !== "neutral" && ref.startsWith("neutral-")) ref = `${neutral}-${ref.split("-")[1]}`;
      return { ref, hex: hexOf(ref, m === "light" ? s.light : s.dark) };
    };
    sem.set(s.name, { light: cell("light"), dark: cell("dark") });
  }

  // Text on accent solids. A light brand (anchor at 400 or lighter, like yellow or lime) keeps its own color on
  // buttons with near-black text; anything else uses white text on a darker step.
  const lightBrand = !!brandHex && idx(anchor) <= idx(400 as Step) && contrast(DARK_TEXT, scale[anchor]) >= 4.5;
  const onAccent = options.onAccent === "dark" ? DARK_TEXT : options.onAccent === "white" ? "#ffffff" : lightBrand ? DARK_TEXT : "#ffffff";
  if (onAccent !== "#ffffff") {
    for (const t of ["text-on-accent", "button-primary-text", "button-primary-text-hover"]) {
      if (sem.get(t)) sem.set(t, { light: { ref: "neutral-950", hex: DARK_TEXT }, dark: { ref: "neutral-950", hex: DARK_TEXT } });
    }
    // Fills start at the brand itself; hover goes one step darker.
    const a = anchor, h = STEPS[Math.min(STEPS.length - 1, idx(anchor) + 1)] as Step;
    for (const [t, s] of [["bg-accent-solid", a], ["button-primary", a], ["bg-accent-solid-hover", h], ["button-primary-hover", h]] as [string, Step][]) {
      if (sem.get(t)) sem.set(t, { light: { ref: `brand-${s}`, hex: scale[s] }, dark: { ref: `brand-${s}`, hex: scale[s] } });
    }
  }

  // Walk each accent token along the scale until it passes, keeping hover one step away from its base.
  const adjustments: ThemeAdjustment[] = [];
  const checks: ThemeCheck[] = [];
  const pairOf = (t: string) => (t.endsWith("-hover") ? t.replace(/-hover$/, "") : null);
  for (const m of ["light", "dark"] as Mode[]) {
    const bg = sem.get("bg-primary")![m].hex;
    for (const r of RULES) {
      const cell = sem.get(r.token)?.[m]; if (!cell) continue;
      const step = stepOf(cell.ref);
      const against = r.kind === "fill" ? onAccent : r.kind === "on-tint" ? sem.get("bg-accent-primary")![m].hex : bg;
      const ratio = (hex: string) => contrast(hex, against);
      if (step != null) {
        // Fills and light-mode text get darker; dark-mode text gets lighter.
        const dir = r.kind === "fill" ? 1 : m === "light" ? 1 : -1;
        const dirFill = r.kind === "fill" && onAccent !== "#ffffff" ? -1 : dir;
        const parent = pairOf(r.token);
        const passes = (st: Step) => ratio(scale[st]) >= r.min;
        let i = idx(step);
        if (parent) {
          // Hover keeps the same distance from its base as in Seed; if that fails, it tries the other side.
          const pb = stepOf(base.get(parent)![m]), hb = stepOf(base.get(r.token)![m]), pnow = stepOf(sem.get(parent)![m].ref);
          if (pb != null && hb != null && pnow != null) {
            const d = idx(hb) - idx(pb) || 1, clamp = (n: number) => Math.min(STEPS.length - 1, Math.max(0, n));
            const tries = [clamp(idx(pnow) + d), clamp(idx(pnow) - d)].filter((n) => n !== idx(pnow));
            i = tries.find((n) => passes(STEPS[n] as Step)) ?? tries[0] ?? idx(pnow);
          }
        }
        while (!passes(STEPS[i] as Step) && i + dirFill >= 0 && i + dirFill < STEPS.length) i += dirFill;
        const final = STEPS[i] as Step;
        if (final !== step) {
          adjustments.push({ token: r.token, mode: m, from: `brand-${step}`, to: `brand-${final}`, reason: parent ? `hover for ${parent}` : `${formatRatio(ratio(scale[step]))} is below ${r.min}:1` });
          sem.set(r.token, { ...sem.get(r.token)!, [m]: { ref: `brand-${final}`, hex: scale[final] } });
        }
      }
      const hex = sem.get(r.token)![m].hex, rr = ratio(hex);
      checks.push({ token: r.token, mode: m, against: r.kind === "fill" ? (onAccent === "#ffffff" ? "text-on-accent (white)" : "text-on-accent (near-black)") : r.kind === "on-tint" ? "bg-accent-primary" : "bg-primary", ratio: rr, min: r.min, pass: rr >= r.min - 1e-9, label: r.label });
    }
  }

  // Which tokens differ from Seed's defaults (those go in the CSS).
  const changed = new Set<string>();
  for (const [t, v] of sem) for (const m of ["light", "dark"] as Mode[]) if (v[m].ref !== base.get(t)![m]) changed.add(t);
  // CSS resolves var() where a property is declared, so a scoped theme must redeclare every token that points at
  // the brand scale; otherwise children inherit the value already resolved on :root (Seed blue).
  if (name) for (const [t, v] of sem) if (/^brand-/.test(v.light.ref || "") || /^brand-/.test(v.dark.ref || "")) changed.add(t);
  const shadowLines = name ? Object.entries(shadows).filter(([, v]) => /var\(--/.test(v)).map(([k, v]) => `  --${k}: ${v};`) : [];
  const val = (c: Cell) => (c.ref ? `var(--${c.ref})` : c.hex);

  const radii = RADIUS[options.radius || "default"];
  const dens = DENSITY[options.density || "default"];
  const fontDecl = Object.entries(options.fonts || {}).filter(([, v]) => v).map(([k, v]) => `  --font-${k}: ${v};`);
  const sel = (parts: string[]) => parts.join(",\n");
  const S = name
    ? { light: sel([`[data-brand="${name}"]`, `[data-brand="${name}"][data-theme="light"]`, `[data-brand="${name}"] [data-theme="light"]`]),
        dark: sel([`[data-brand="${name}"][data-theme="dark"]`, `[data-brand="${name}"] [data-theme="dark"]`, `[data-theme="dark"] [data-brand="${name}"]`]),
        system: sel([`:root:not([data-theme])[data-brand="${name}"]`, `:root:not([data-theme]) [data-brand="${name}"]`, `[data-theme="system"][data-brand="${name}"]`, `[data-theme="system"] [data-brand="${name}"]`, `[data-brand="${name}"] [data-theme="system"]`]) }
    : { light: sel([":root", '[data-theme="light"]']), dark: '[data-theme="dark"]', system: sel([":root:not([data-theme])", '[data-theme="system"]']) };
  const tokLines = (m: Mode) => [...changed].map((t) => `  --${t}: ${val(sem.get(t)![m])};`);
  const head = [
    `/* Seed theme${name ? ` "${name}"` : ""}, made with createTheme(${JSON.stringify({ ...options, name: undefined })}).`,
    name ? `   Use it with data-brand="${name}" on <html> or any element. Load it after @flinbu/seed-tokens.` : `   Replaces Seed's defaults. Load it after @flinbu/seed-tokens.`,
    `   Contrast: ${checks.filter((c) => c.pass).length} of ${checks.length} checks pass (WCAG 2.2 AA). */`,
  ].join("\n");
  const lightBody = [
    ...(brandHex ? STEPS.map((s) => `  --brand-${s}: ${scale[s as Step]};`) : []),
    ...Object.entries(radii).map(([k, v]) => `  --${k}: ${v};`),
    ...Object.entries(dens).map(([k, v]) => `  --${k}: ${v};`),
    ...fontDecl,
    ...tokLines("light"),
    ...shadowLines,
  ];
  const darkBody = tokLines("dark");
  let css = `${head}\n${S.light} {\n${lightBody.join("\n")}\n}\n`;
  if (darkBody.length) css += `\n${S.dark} {\n${darkBody.join("\n")}\n}\n\n@media (prefers-color-scheme: dark) {\n  ${S.system.replace(/\n/g, "\n  ")} {\n${darkBody.map((l) => "  " + l).join("\n")}\n  }\n}\n`;

  const tokens = { light: {} as Record<string, string>, dark: {} as Record<string, string> };
  for (const [t, v] of sem) { tokens.light[t] = v.light.hex; tokens.dark[t] = v.dark.hex; }
  return { name, selector: name ? `[data-brand="${name}"]` : ":root", css, scale, anchor, onAccent, tokens, checks, adjustments, passed: checks.every((c) => c.pass) };
}

export { baseRadius as radiusDefaults, baseControl as controlDefaults };
