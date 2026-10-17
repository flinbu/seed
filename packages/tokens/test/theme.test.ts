import { describe, expect, it } from "vitest";
import { contrast, createTheme, generateScale, STEPS } from "../src";

const BRANDS = ["#0d9488", "#db2777", "#facc15", "#84cc16", "#0b1f3a", "#7c3aed", "#ea580c", "#64748b", "#22d3ee", "#000000", "#ffffff"];

describe("generateScale", () => {
  it("keeps the brand color exactly at its step and gets darker step by step", () => {
    for (const b of BRANDS.slice(0, 9)) {
      const { scale, anchor } = generateScale(b);
      expect(scale[anchor]).toBe(b);
      const lum = STEPS.map((s) => contrast(scale[s], "#000000"));
      for (let i = 1; i < lum.length; i++) expect(lum[i]).toBeLessThan(lum[i - 1] + 1e-6);
    }
  });
});

describe("createTheme", () => {
  it("Seed's own defaults pass every check", () => {
    const t = createTheme();
    expect(t.checks.filter((c) => !c.pass)).toEqual([]);
  });
  for (const b of BRANDS) {
    it(`${b} passes AA in Light and Dark`, () => {
      const t = createTheme({ brand: b, name: "x" });
      expect(t.checks.filter((c) => !c.pass).map((c) => `${c.mode} ${c.token} ${c.ratio.toFixed(2)}`)).toEqual([]);
      for (const m of ["light", "dark"] as const) {
        expect(contrast(t.tokens[m]["text-link"], t.tokens[m]["bg-primary"])).toBeGreaterThanOrEqual(4.5);
        expect(contrast(t.tokens[m]["button-primary"], t.tokens[m]["button-primary-text"])).toBeGreaterThanOrEqual(4.5);
        expect(contrast(t.tokens[m]["text-accent-primary"], t.tokens[m]["bg-accent-primary"])).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
  it("keeps a light brand on its buttons with near-black text", () => {
    const t = createTheme({ brand: "#facc15" });
    expect(t.onAccent).toBe("#0a0a0a");
    expect(t.tokens.light["button-primary"]).toBe("#facc15");
    expect(t.css).toMatch(/--text-on-accent: var\(--neutral-950\)/);
  });
  it("scopes a named theme to data-brand, including nested Light and Dark", () => {
    const t = createTheme({ brand: "#db2777", name: "acme" });
    expect(t.css).toMatch(/^\[data-brand="acme"\],$/m);
    expect(t.css).toContain('[data-brand="acme"] [data-theme="light"]');
    expect(t.css).toContain('[data-brand="acme"] [data-theme="dark"]');
    expect(t.css).toContain("--brand-500: #db2777;");
    // On :root, a brand that needs no per-mode adjustments only ships its scale (tokens re-resolve there).
    expect(createTheme({ radius: "round" }).css).not.toContain('[data-theme="dark"]');
  });
  it("redeclares every brand-linked token inside a named scope", () => {
    const t = createTheme({ brand: "#0d9488", name: "teal" });
    for (const k of ["button-primary", "bg-accent-solid", "text-link", "bg-accent-primary", "border-accent-primary", "button-focus-primary"]) expect(t.css).toContain(`--${k}:`);
  });
  it("applies radius, density, fonts and neutral presets", () => {
    const t = createTheme({ radius: "pill", density: "compact", neutral: "slate", fonts: { primary: "Inter, sans-serif" } });
    expect(t.css).toContain("--radius-control: 9999px;");
    expect(t.css).toContain("--control-md: 36px;");
    expect(t.css).toContain("--font-primary: Inter, sans-serif;");
    expect(t.css).toMatch(/--text-primary: var\(--slate-900\)/);
  });
  it("rejects bad input with a clear message", () => {
    expect(() => createTheme({ brand: "teal" })).toThrow(/Not a hex color/);
    expect(() => createTheme({ name: "my brand" })).toThrow(/letters, numbers and dashes/);
  });
});
