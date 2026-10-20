---
name: seed
description: Builds and reviews UI with Seed, Fenly's open design system for React and Tailwind CSS v4 (npm @flinbu/seed). Use when the user asks to "build this with Seed", "use Seed components", "style this with Seed tokens", "make a Seed theme", "write UI copy in Seed's voice", "check this against Seed", or works in a project that imports @flinbu/seed or @flinbu/seed-tokens.
---

# Seed

Seed is a calm, neutral-first design system: true-gray surfaces, one blue accent you can rebrand, five status hues, WCAG 2.2 AA in Light and Dark. It is the UI of Fenly and open for everyone (MIT).

- Docs and live theme builder: https://seed-lyart.vercel.app (machine-readable index at `/llms.txt`)
- Packages: `@flinbu/seed` (React components) and `@flinbu/seed-tokens` (tokens, Tailwind theme, `seed theme` CLI)
- Repo: https://github.com/flinbu/seed
- Full design system (all components with live previews, guidelines, tokens): https://claude.ai/artifact/3EcyStkY8yCeAxSM7a1biz

## Workflow

1. **Check the setup.** Look for `@flinbu/seed` in `package.json` and `@import "@flinbu/seed/styles.css"` in the main stylesheet. If missing, set it up as in `references/setup.md`.
2. **Pick components before writing markup.** Read `references/components.md`. Use a component that exists before building one; compose before customizing; customize with props before overriding CSS.
   - Components marked *package* import from `@flinbu/seed`.
   - Components marked *design system* are designed and specified but not in the npm package yet. Build them from package parts and tokens following their spec in the design system link above, and say so to the user. Never invent a Seed import that does not exist.
3. **Style only with tokens.** Use Seed's Tailwind utilities (`bg-primary`, `text-secondary`, `border-secondary`, `p-base`, `gap-xs`, `rounded-control`, `shadow-elevation-md`) and type classes (`label-label-2-medium`, `body-body-3-regular`, `heading-h5-semibold`). Never hex values, raw px or arbitrary Tailwind values. If a value is missing, the system is missing a token: say so instead of hardcoding. See `references/tokens.md`.
4. **Write the copy in Seed's voice.** Follow `references/writing.md`: sentence case, verbs on buttons, specific errors, no em dashes, no emoji.
5. **Check accessibility** with the checklist in `references/accessibility.md` before calling the work done.
6. **Review in both themes.** Every screen must work in Light and Dark (`data-theme` on `<html>`, or `ThemeProvider`).

## Rules that are easy to get wrong

- One primary button per view. Others are `secondary`, `tertiary` or `ghost`.
- Blue is only for the primary action, controls that are on, links, focus, and (in Fenly) the assistant. Selection is neutral (`bg-selected`). Never tint surfaces to look branded.
- Show customer content (their colors, components) on `bg-stage`, not on tinted chrome.
- Borders before shadows. Shadows only for things that float.
- Radii: `rounded-control` (4px) on every control; cards `rounded-xl`; containers that hold content (tables, alerts, popovers) use the petal: 12px with a 4px top-left corner. Never the petal on controls or floating panels.
- Type: Plus Jakarta Sans Light (300) is the normal UI weight; Medium for controls, SemiBold for headings. Fenly Serif display only for hero titles, empty-state headlines and one big number, never under 20px. Inconsolata uppercase (`mono-label-medium`) for spec labels and token names.
- Icons are Lucide, passed as elements (`leftIcon={<Plus />}`). Icon-only buttons need `aria-label` and a tooltip.
- Status is never color alone: pair it with an icon or a word.
- Never use native `<select>`: use Seed's Select or Combobox.
- Motion grows from where things start; everything stops under `prefers-reduced-motion`.
- An AI assistant has a name and speaks in the first person; it proposes and a person approves. No avatars inside an AI conversation.

## Theming

Rebrand with one command; it builds a full OKLCH scale and fixes any accent that fails AA:

```bash
npx seed theme --brand "#0d9488" --name acme --radius round --out src/acme.css
```

Import it after Seed's styles and set `data-brand="acme"` on `<html>` or any element.

## When reviewing someone's UI

Report findings in this order: accessibility failures, raw values instead of tokens, components rebuilt that Seed already has, copy that breaks the writing rules, then visual polish. For each, name the Seed token, component or rule that fixes it.
