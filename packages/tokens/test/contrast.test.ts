import { describe, expect, it } from "vitest";
import { contrast, createTheme, tokens, type Mode, type NeutralScale } from "../src";

/* WCAG 2.2 AA for the quiet text colors (FEN-202). Placeholders, helper text and descriptions are text, so they need
   4.5:1 on every neutral surface they sit on; placeholder icons need 3:1. Disabled colors stay exempt and separate. */
const SURFACES = [
  "bg-primary", "bg-secondary", "bg-tertiary", "bg-elevated", "bg-canvas", "bg-inset", "bg-selected",
  "bg-primary-hover", "bg-secondary-hover", "bg-tertiary-hover",
];
const TEXT = ["text-primary", "text-secondary", "text-tertiary", "text-placeholder"];
const ICONS = ["icon-tertiary", "icon-placeholder"];
const MODES: Mode[] = ["light", "dark"];
const NEUTRALS: NeutralScale[] = ["neutral", "gray", "slate", "zinc", "stone"];

function failures(neutral: NeutralScale, tokens: string[], min: number) {
  const t = createTheme({ neutral }).tokens;
  const out: string[] = [];
  for (const m of MODES) for (const fg of tokens) for (const bg of SURFACES) {
    const r = contrast(t[m][fg], t[m][bg]);
    if (r < min) out.push(`${neutral} ${m} ${fg} on ${bg}: ${r.toFixed(2)}`);
  }
  return out;
}

describe("quiet text contrast", () => {
  for (const neutral of NEUTRALS) {
    it(`text holds 4.5:1 on every neutral surface (${neutral})`, () => {
      expect(failures(neutral, TEXT, 4.5)).toEqual([]);
    });
    it(`placeholder and tertiary icons hold 3:1 (${neutral})`, () => {
      expect(failures(neutral, ICONS, 3)).toEqual([]);
    });
  }
  it("placeholders use the tertiary text color", () => {
    const t = createTheme().tokens;
    for (const m of MODES) expect(t[m]["text-placeholder"]).toBe(t[m]["text-tertiary"]);
  });
  it("keeps disabled labels distinct from helper text", () => {
    const t = createTheme().tokens;
    for (const m of MODES) expect(t[m]["text-disabled"]).not.toBe(t[m]["text-tertiary"]);
  });
});

/* Alerts and Banners sit on bg-primary in both emphasis modes: only the icon carries the tone (3:1 as a meaningful
   graphic), links use text-accent-primary (4.5:1) and loud ones get a decorative hairline in the tone. */
describe("alert tones on the neutral surface", () => {
  const TONES = { info: "blue", success: "green", warning: "orange", error: "red", offer: "emerald" } as const;
  const ALERT_ICONS = ["icon-info-primary", "icon-success-primary-hover", "icon-warning-primary-hover", "icon-error-primary", "icon-offer-primary-hover", "icon-secondary"];
  for (const neutral of NEUTRALS) {
    it(`icons hold 3:1 and links 4.5:1 on bg-primary (${neutral})`, () => {
      const t = createTheme({ neutral }).tokens;
      const bad: string[] = [];
      for (const m of MODES) {
        for (const ic of ALERT_ICONS) if (contrast(t[m][ic], t[m]["bg-primary"]) < 3) bad.push(`${m} ${ic}`);
        for (const l of ["text-accent-primary", "text-accent-primary-hover"]) if (contrast(t[m][l], t[m]["bg-primary"]) < 4.5) bad.push(`${m} ${l}`);
      }
      expect(bad).toEqual([]);
    });
  }
  it("border-{tone}-subtle is the -300 step in Light and the -400 step at 40% over bg-primary in Dark", () => {
    const t = createTheme().tokens;
    const p = tokens.primitives as Record<string, string>;
    const mix = (a: string, b: string, w: number) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * w + parseInt(b.slice(i, i + 2), 16) * (1 - w)).toString(16).padStart(2, "0")).join("");
    for (const [tone, scale] of Object.entries(TONES)) {
      expect(t.light[`border-${tone}-subtle`]).toBe(p[`${scale}-300`]);
      expect(t.dark[`border-${tone}-subtle`]).toBe(mix(p[`${scale}-400`], t.dark["bg-primary"], 0.4));
    }
  });
  it("loud hairlines stand apart from the neutral card hairline", () => {
    const t = createTheme().tokens;
    for (const m of MODES) for (const tone of Object.keys(TONES)) {
      expect(contrast(t[m][`border-${tone}-subtle`], t[m]["bg-primary"])).toBeGreaterThan(contrast(t[m]["border-secondary"], t[m]["bg-primary"]));
    }
  });
});
