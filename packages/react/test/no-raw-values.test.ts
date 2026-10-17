import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/* Seed's rule: components use tokens only. No raw colors, no pixel values, no primitive palette in components. */
const dir = path.resolve(__dirname, "../src/components");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".tsx"));
const classStrings = (src: string) => [...src.matchAll(/"([^"\n]*)"/g)].map((m) => m[1]).filter((s) => /(^|\s)[\w:-]*(bg|text|border|p|px|py|m|mt|gap|h|w|size|rounded|shadow|outline)-/.test(s));
const PALETTE = /(^|[\s:])(bg|text|border|outline|ring|fill|stroke)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|brand)-\d{2,3}\b/;
function arbitraryOk(v: string) {
  // Allowed inside [...] and (...): CSS variables, calc of variables, keywords, %, fr and ch.
  const stripped = v.replace(/var\(--[\w-]+\)/g, "").replace(/--[\w-]+/g, "").replace(/\b(inherit|initial|auto|calc|currentColor)\b/g, "");
  return !/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(|\d+(\.\d+)?(px|rem|em|vh|vw)\b/i.test(stripped);
}
describe("components use tokens only", () => {
  for (const f of files) {
    it(f, () => {
      const src = fs.readFileSync(path.join(dir, f), "utf8");
      const bad: string[] = [];
      for (const s of classStrings(src)) for (const c of s.split(/\s+/)) {
        const arb = /\[([^\]]+)\]|\((--[^)]+)\)/.exec(c);
        if (arb && !arbitraryOk(arb[1] ?? arb[2])) bad.push(c);
        if (PALETTE.test(" " + c)) bad.push(c);
      }
      expect(bad, `raw values in ${f}`).toEqual([]);
    });
  }
});
