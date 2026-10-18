/* Color math for Seed's design system tools: parsing, WCAG 2 contrast, OKLCH and HSV. */
export interface RGBA { r: number; g: number; b: number; a: number }
export interface HSV { h: number; s: number; v: number }

/** Parses #rgb, #rgba, #rrggbb, #rrggbbaa, rgb() and rgba(). Returns null for anything else. */
export function parseColor(input: string | null | undefined): RGBA | null {
  if (!input) return null;
  const str = String(input).trim();
  let m = /^#?([0-9a-f]{3,8})$/i.exec(str);
  if (m) {
    let s = m[1]!;
    if (s.length === 3 || s.length === 4) s = s.split("").map((c) => c + c).join("");
    if (s.length !== 6 && s.length !== 8) return null;
    const n = Number.parseInt(s.slice(0, 6), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: s.length === 8 ? Number.parseInt(s.slice(6), 16) / 255 : 1 };
  }
  m = /^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i.exec(str);
  if (m) {
    const a = m[4] == null ? 1 : m[4].endsWith("%") ? Number.parseFloat(m[4]) / 100 : Number.parseFloat(m[4]);
    return { r: +m[1]!, g: +m[2]!, b: +m[3]!, a };
  }
  return null;
}

export function toHex(c: RGBA): string {
  return "#" + [c.r, c.g, c.b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
}
/** A readable value: hex when opaque, rgba() when not. */
export function formatColor(c: RGBA): string {
  return c.a < 1 ? `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${+c.a.toFixed(2)})` : toHex(c);
}
const lin = (v: number) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
export const luminance = (c: RGBA) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
/** Blends a translucent color over an opaque one. */
export function blend(fg: RGBA, bg: RGBA): RGBA {
  const a = fg.a ?? 1;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}
/** The WCAG 2 contrast ratio, with a translucent foreground blended over the background first. */
export function contrastRatio(fg: RGBA, bg: RGBA): number {
  const x = luminance(blend(fg, bg)), y = luminance(bg);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
/** Rounds down to one decimal, so a pass is never overstated: 4.49 → "4.4:1". */
export const formatRatio = (r: number) => (Math.floor(r * 10 + 1e-9) / 10).toFixed(1) + ":1";

export function toOklch(c: RGBA): { l: number; c: number; h: number } {
  const r = lin(c.r), g = lin(c.g), b = lin(c.b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let h = (Math.atan2(B, A) * 180) / Math.PI; if (h < 0) h += 360;
  return { l: L, c: Math.sqrt(A * A + B * B), h };
}
export function formatOklch(c: RGBA): string {
  const o = toOklch(c);
  return `oklch(${(o.l * 100).toFixed(1)}% ${o.c.toFixed(3)} ${(o.c < 0.002 ? 0 : o.h).toFixed(1)})`;
}
export function toHsv(c: RGBA): HSV {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60; if (h < 0) h += 360;
  return { h, s: mx ? d / mx : 0, v: mx };
}
export function fromHsv({ h, s, v }: HSV): RGBA {
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c, hh = h % 360;
  const p = hh < 60 ? [c, x, 0] : hh < 120 ? [x, c, 0] : hh < 180 ? [0, c, x] : hh < 240 ? [0, x, c] : hh < 300 ? [x, 0, c] : [c, 0, x];
  return { r: (p[0]! + m) * 255, g: (p[1]! + m) * 255, b: (p[2]! + m) * 255, a: 1 };
}
