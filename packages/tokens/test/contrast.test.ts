import { describe, expect, it } from "vitest";
import { contrast, createTheme, type Mode, type NeutralScale } from "../src";

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
