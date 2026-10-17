/* seed: Seed's command line. `seed theme --brand #0d9488` writes a theme.css that passes WCAG AA. */
import fs from "node:fs";
import path from "node:path";
import { createTheme, type ThemeOptions } from "./create-theme";
import { contrast, formatRatio } from "./color";

const HELP = `seed: tools for the Seed design system

Usage
  seed theme --brand <hex> [options]   Make a theme.css from a brand color
  seed contrast <hex> <hex>            WCAG contrast between two colors

Theme options
  --brand <hex>            Brand (accent) color, e.g. #0d9488
  --name <name>            Scope to [data-brand="name"] (default: replace Seed's defaults)
  --neutral <scale>        neutral (default), gray, slate, zinc or stone
  --radius <preset>        sharp, default, round or pill
  --density <preset>       compact, default or comfortable
  --font-<role> <stack>    primary, titles, display, reading or mono, e.g. --font-primary "Inter, sans-serif"
  --on-accent <mode>       auto (default), white or dark
  --out <file>             Where to write the CSS (default: ./seed-theme.css, "-" prints it)
  --json                   Print the theme (scale, checks, adjustments) as JSON
  --no-strict              Write the file even if a contrast check fails

Exits with 1 when a contrast check fails, so CI catches an inaccessible brand.`;

function parse(argv: string[]) {
  const pos: string[] = [], flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const k = a.slice(2);
      if (k.startsWith("no-")) { flags[k.slice(3)] = false; continue; }
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) flags[k] = true; else { flags[k] = next; i++; }
    } else pos.push(a);
  }
  return { pos, flags };
}
const tty = process.stdout.isTTY;
const c = (code: number, s: string) => (tty ? `\x1b[${code}m${s}\x1b[0m` : s);
const swatch = (hex: string) => {
  if (!tty) return "";
  const n = parseInt(hex.slice(1), 16);
  return `\x1b[48;2;${(n >> 16) & 255};${(n >> 8) & 255};${n & 255}m    \x1b[0m `;
};

export function main(argv = process.argv.slice(2)): number {
  const { pos, flags } = parse(argv);
  const cmd = pos[0];
  if (!cmd || cmd === "help" || flags.help) { console.log(HELP); return 0; }
  if (cmd === "contrast") {
    if (pos.length < 3) { console.error("Usage: seed contrast <hex> <hex>"); return 2; }
    const r = contrast(pos[1], pos[2]);
    console.log(`${formatRatio(r)}  text ${r >= 4.5 ? c(32, "passes") : c(31, "fails")} AA (4.5:1) · large text and UI ${r >= 3 ? c(32, "pass") : c(31, "fail")} (3:1)`);
    return 0;
  }
  if (cmd === "theme") {
    const fonts: Record<string, string> = {};
    for (const k of Object.keys(flags)) if (k.startsWith("font-") && typeof flags[k] === "string") fonts[k.slice(5)] = flags[k] as string;
    const opts: ThemeOptions = {
      brand: typeof flags.brand === "string" ? flags.brand : undefined,
      name: typeof flags.name === "string" ? flags.name : undefined,
      neutral: flags.neutral as ThemeOptions["neutral"], radius: flags.radius as ThemeOptions["radius"], density: flags.density as ThemeOptions["density"],
      onAccent: flags["on-accent"] as ThemeOptions["onAccent"], fonts,
    };
    let theme;
    try { theme = createTheme(opts); } catch (e) { console.error(c(31, (e as Error).message)); return 2; }
    if (flags.json) { console.log(JSON.stringify({ ...theme, css: undefined }, null, 2)); return theme.passed ? 0 : 1; }
    const out = typeof flags.out === "string" ? flags.out : "seed-theme.css";
    const strict = flags.strict !== false;
    console.log(c(1, `Seed theme${theme.name ? ` "${theme.name}"` : ""}`) + (opts.brand ? ` from ${opts.brand}` : ""));
    console.log(Object.entries(theme.scale).map(([s, h]) => `${swatch(h)}${s.padStart(3)} ${h}${Number(s) === theme.anchor ? c(2, "  ← your brand") : ""}`).join("\n"));
    console.log("\n" + c(1, "Contrast"));
    for (const k of theme.checks) console.log(`  ${k.pass ? c(32, "✓") : c(31, "✗")} ${k.mode.padEnd(5)} ${k.label.padEnd(44)} ${formatRatio(k.ratio).padStart(7)}  (needs ${k.min}:1)`);
    if (theme.adjustments.length) { console.log("\n" + c(1, "Adjusted to pass")); for (const a of theme.adjustments) console.log(`  ${a.mode.padEnd(5)} ${a.token}: ${a.from} → ${a.to} (${a.reason})`); }
    if (theme.onAccent !== "#ffffff") console.log(`\nText on accent solids is near-black: white doesn't reach 4.5:1 on this brand.`);
    if (!theme.passed && strict) { console.error("\n" + c(31, "Some checks fail, so no file was written. Pick a different brand color or pass --no-strict.")); return 1; }
    if (out === "-") console.log("\n" + theme.css);
    else { fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true }); fs.writeFileSync(out, theme.css); console.log(`\nWrote ${out}. Import it after @flinbu/seed-tokens.`); }
    return theme.passed ? 0 : 1;
  }
  console.error(`Unknown command "${cmd}".\n\n${HELP}`);
  return 2;
}

process.exitCode = main();
