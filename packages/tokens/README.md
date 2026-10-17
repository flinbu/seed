# @flinbu/seed-tokens

Seed's design tokens for the web: CSS variables with Light and Dark, a Tailwind CSS v4 theme, DTCG JSON, typed data, and `createTheme()` plus the `seed` CLI for brand themes that pass WCAG AA.

```bash
npm i @flinbu/seed-tokens
```

## With Tailwind CSS v4

```css
/* app.css */
@import "tailwindcss";
@import "@flinbu/seed-tokens/tailwind.css";
```

Every token is a utility:

| Token | Utility |
|---|---|
| `bg-primary`, `bg-accent-solid` | `bg-primary`, `bg-accent-solid` |
| `text-secondary`, `text-link` | `text-secondary`, `text-link` |
| `border-primary`, `border-accent-primary` | `border-primary`, `ring-accent-primary`, `outline-accent-primary` |
| `icon-secondary`, `button-primary` | `text-icon-secondary`, `bg-button-primary` |
| `space-xs` … `space-6xl`, `space-base` | `p-base`, `gap-xs`, `mt-lg` … (Tailwind's `p-4` still works) |
| `control-sm/md/lg` | `h-control-md` |
| `radius-control`, `radius-xl` … | `rounded-control`, `rounded-xl` |
| `elevation-md`, `button-focus-primary` | `shadow-elevation-md` |
| font families | `font-primary`, `font-display`, `font-reading`, `font-mono` |
| type styles | `label-label-2-medium`, `body-body-3-regular`, `heading-h4-semibold` … |

`dark:` follows `data-theme="dark"` on the element or an ancestor, and the OS when `data-theme` is `system` or missing. You rarely need it: semantic tokens already switch.

## Without Tailwind

```css
@import "@flinbu/seed-tokens/index.css"; /* variables, fonts and type classes */
```

```css
.card { background: var(--bg-primary); color: var(--text-primary); padding: var(--space-base); border-radius: var(--radius-xl); }
```

## Light, Dark and system

Light is the default. Set `data-theme` on `<html>` or any element:

```html
<html data-theme="system"> <!-- follows the OS; same as no data-theme -->
<div data-theme="dark">…</div> <!-- a dark area inside a light page -->
```

## Theming

A theme is a set of overrides on the semantic tokens; components never change. Make one from a brand color:

```bash
npx seed theme --brand "#0d9488" --name acme --radius round --out src/acme.css
```

It builds an 11-step scale around your color (your exact color sits at its step), points every accent token at it, then walks each one along the scale until it passes WCAG 2.2 AA in Light and Dark: 4.5:1 for text, 3:1 for icons and focus borders. Light brands like yellow keep their color on buttons with near-black text. The command fails (exit code 1) when a check can't pass, so CI catches an inaccessible brand.

```css
@import "tailwindcss";
@import "@flinbu/seed-tokens/tailwind.css";
@import "./acme.css";
```

```html
<html data-brand="acme">
```

Without `--name`, the theme replaces Seed's defaults on `:root`. With a name, it applies inside `[data-brand="acme"]`, so one page can show several brands.

Options: `--neutral slate|zinc|stone|gray`, `--radius sharp|default|round|pill`, `--density compact|default|comfortable`, `--font-primary "Inter, sans-serif"` (and `titles`, `display`, `reading`, `mono`), `--on-accent auto|white|dark`, `--json`.

The same in code:

```ts
import { createTheme } from "@flinbu/seed-tokens";

const theme = createTheme({ brand: "#0d9488", name: "acme", radius: "round" });
theme.css;      // the stylesheet
theme.checks;   // every contrast check, with ratios
theme.passed;   // false if any check fails
```

## Data

```ts
import { tokens, contrast } from "@flinbu/seed-tokens";
tokens.semantic.find((t) => t.name === "bg-primary"); // { light: "#ffffff", dark: "#181818", lightRef: "b-w-white", … }
contrast("#2563eb", "#ffffff"); // 5.17
```

`@flinbu/seed-tokens/tokens.json` is the same set in the W3C Design Tokens (DTCG) format, for Style Dictionary and other tools.

## Fonts

`tailwind.css` and `index.css` include Seed's fonts (Plus Jakarta Sans, Domine, Noto Serif, Inconsolata, all SIL Open Font License). Import `tokens.css` alone if you load fonts yourself.
