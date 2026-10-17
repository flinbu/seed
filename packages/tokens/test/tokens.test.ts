import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { tokens } from "../src";
import { dist, read, rule, tailwind } from "./helpers";

describe("tokens.css", () => {
  const css = read("tokens.css");
  it("declares every primitive and semantic token", () => {
    for (const name of Object.keys(tokens.primitives)) expect(css).toContain(`--${name}:`);
    for (const s of tokens.semantic) expect(css).toContain(`--${s.name}:`);
  });
  it("has Light, Dark and a system-following block", () => {
    expect(css).toMatch(/:root,\n\[data-theme="light"\] \{/);
    expect(css).toMatch(/\[data-theme="dark"\] \{/);
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\) \{\n {2}:root:not\(\[data-theme\]\),\n {2}\[data-theme="system"\]/);
  });
  it("points semantic colors at primitives and the accent at the brand scale", () => {
    expect(css).toMatch(/--bg-primary: var\(--b-w-white\);/);
    expect(css).toMatch(/--bg-accent-solid: var\(--brand-600\);/);
    expect(css).toMatch(/--text-info-primary: var\(--blue-600\);/); // info stays blue when the brand changes
    expect(css).toMatch(/--brand-600: var\(--blue-600\);/);
  });
  it("lets focus rings follow the theme", () => {
    expect(css).toMatch(/--button-focus-primary: [^;]*var\(--button-primary-focus\)/);
  });
  it("ships the fonts it references", () => {
    const fonts = read("fonts.css");
    for (const f of fonts.match(/fonts\/[\w-]+\.woff2/g) || []) expect(fs.existsSync(path.join(dist, f))).toBe(true);
  });
});

describe("tailwind.css", () => {
  it("turns tokens into utilities", async () => {
    const want: Record<string, RegExp> = {
      "bg-primary": /background-color: var\(--bg-primary\)/,
      "text-secondary": /color: var\(--text-secondary\)/,
      "border-primary": /border-color: var\(--border-primary\)/,
      "text-icon-secondary": /color: var\(--icon-secondary\)/,
      "bg-button-primary": /background-color: var\(--button-primary\)/,
      "bg-brand-500": /background-color: var\(--brand-500\)/,
      "p-base": /padding: var\(--space-base\)/,
      "gap-xs": /gap: var\(--space-xs\)/,
      "h-control-md": /height: var\(--control-md\)/,
      "rounded-control": /border-radius: var\(--seed-radius-control\)/,
      "shadow-elevation-md": /var\(--elevation-md\)/,
      "font-display": /font-family: var\(--seed-font-display\)/,
      "ring-accent-primary": /--tw-ring-color: var\(--border-accent-primary\)/,
      "label-label-2-medium": /font-size: 14px; line-height: 20px; font-weight: 500/,
    };
    const css = await tailwind(Object.keys(want));
    for (const [cls, re] of Object.entries(want)) expect(rule(css, cls), cls).toMatch(re);
  });
  it("keeps Tailwind's numeric spacing", async () => {
    expect(rule(await tailwind(["p-4"]), "p-4")).toMatch(/calc\(var\(--spacing\) \* 4\)/);
  });
  it("keeps Tailwind's container sizes for width utilities", async () => {
    const css = await tailwind(["max-w-xl", "w-sm", "-mt-xxs", "inset-x-base", "translate-x-xxxs", "w-control-md", "min-h-control-lg"]);
    expect(rule(css, "max-w-xl")).toMatch(/var\(--container-xl\)/);
    expect(rule(css, "w-sm")).toMatch(/var\(--container-sm\)/);
    expect(css).toMatch(/margin-top: calc\(var\(--space-xxs\) \* -1\)/);
    expect(rule(css, "inset-x-base")).toMatch(/var\(--space-base\)/);
    expect(rule(css, "translate-x-xxxs")).toMatch(/var\(--space-xxxs\)/);
    expect(rule(css, "w-control-md")).toMatch(/var\(--control-md\)/);
    expect(rule(css, "min-h-control-lg")).toMatch(/var\(--control-lg\)/);
  });
  it("dark: follows data-theme and the OS", async () => {
    const css = await tailwind(["dark:bg-secondary"]);
    expect(css).toContain('.dark\\:bg-secondary:where([data-theme="dark"], [data-theme="dark"] *)');
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\)[\s\S]*:root:not\(\[data-theme\]\) \*/);
  });
  it("re-resolves radius and font aliases on [data-brand]", () => {
    expect(read("tailwind.css")).toMatch(/:root,\n\[data-brand\],\n\[data-theme\] \{\n {2}--seed-radius-none/);
  });
  it("doesn't let Tailwind's theme variables shadow Seed's", () => {
    // radius and font theme keys go through --seed-* aliases; a direct var(--radius-x) here would point at itself.
    expect(read("tailwind.css")).not.toMatch(/--radius-[\w-]+: var\(--radius-/);
    expect(read("tailwind.css")).not.toMatch(/--font-[\w-]+: var\(--font-/);
  });
});
