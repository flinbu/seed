import { hexToOklch, oklchToHex, parseHex, toHex } from "./color";
import { STEPS } from "./generated/tokens";

export type Step = (typeof STEPS)[number];
export type Scale = Record<Step, string>;

/* Lightness of each step in OKLCH, tuned to sit where Seed's (and Tailwind's) scales sit,
   so a brand scale swaps in for blue without changing how bright anything looks. */
const L: Record<Step, number> = { 50: 0.971, 100: 0.932, 200: 0.882, 300: 0.809, 400: 0.707, 500: 0.623, 600: 0.546, 700: 0.488, 800: 0.424, 900: 0.379, 950: 0.282 };
/* Chroma follows a curve that peaks in the middle; the ends stay soft so tints and deep shades don't glow. */
const C: Record<Step, number> = { 50: 0.12, 100: 0.24, 200: 0.42, 300: 0.66, 400: 0.88, 500: 1, 600: 1, 700: 0.92, 800: 0.8, 900: 0.66, 950: 0.5 };

/**
 * An 11-step scale (50 to 950) around one brand color. The step closest to the brand's lightness
 * is the brand color itself, exactly; the rest keep its hue and fit inside sRGB.
 */
export function generateScale(brand: string): { scale: Scale; anchor: Step } {
  const hex = toHex(parseHex(brand));
  const o = hexToOklch(hex);
  const anchor = STEPS.reduce((best, s) => (Math.abs(L[s] - o.l) < Math.abs(L[best] - o.l) ? s : best), STEPS[0] as Step) as Step;
  const peak = Math.min(o.c / C[anchor], 0.37);
  const scale = {} as Scale;
  for (const s of STEPS) scale[s] = s === anchor ? hex : oklchToHex({ l: L[s], c: peak * C[s], h: o.h });
  return { scale, anchor };
}
