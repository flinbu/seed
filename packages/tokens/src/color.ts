/* Color math for theming: hex ↔ OKLCH, sRGB gamut mapping and WCAG 2 contrast. No dependencies. */

export type RGB = [number, number, number]; // 0..1, gamma-encoded sRGB
export type OKLCH = { l: number; c: number; h: number };

export function parseHex(hex: string): RGB {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`Not a hex color: "${hex}". Use #rgb or #rrggbb.`);
  let s = m[1];
  if (s.length === 3) s = s.split("").map((c) => c + c).join("");
  const n = parseInt(s, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
export function toHex(rgb: RGB): string {
  return "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
}
const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
const gam = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055);

export function rgbToOklch(rgb: RGB): OKLCH {
  const [r, g, b] = rgb.map(lin);
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const c = Math.sqrt(A * A + B * B);
  let h = (Math.atan2(B, A) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}
/** Unclamped linear-light conversion; values outside 0..1 mean out of sRGB gamut. */
function oklchToLinear({ l, c, h }: OKLCH): RGB {
  const a = c * Math.cos((h * Math.PI) / 180), b = c * Math.sin((h * Math.PI) / 180);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const L = l_ ** 3, M = m_ ** 3, S = s_ ** 3;
  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}
export function inGamut(o: OKLCH): boolean {
  return oklchToLinear(o).every((v) => v >= -1e-4 && v <= 1 + 1e-4);
}
/** Keeps lightness and hue, lowers chroma until the color fits in sRGB. */
export function oklchToHex(o: OKLCH): string {
  let c = o.c;
  if (!inGamut({ ...o, c })) {
    let lo = 0, hi = c;
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (inGamut({ ...o, c: mid })) lo = mid; else hi = mid; }
    c = lo;
  }
  return toHex(oklchToLinear({ ...o, c }).map((v) => gam(Math.min(1, Math.max(0, v)))) as RGB);
}
export function hexToOklch(hex: string): OKLCH { return rgbToOklch(parseHex(hex)); }

export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
/** WCAG 2 contrast ratio between two hex colors, 1 to 21. */
export function contrast(a: string, b: string): number {
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
/** Ratio rounded down to one decimal, like "4.5:1", so it never overstates a pass. */
export function formatRatio(r: number): string { return (Math.floor(r * 10 + 1e-9) / 10).toFixed(1) + ":1"; }
