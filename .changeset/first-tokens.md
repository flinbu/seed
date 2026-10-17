---
"@flinbu/seed-tokens": minor
---

First release of Seed's tokens as a package: CSS variables with Light, Dark and system modes, a Tailwind CSS v4 theme, DTCG JSON, typed data, `createTheme()` and the `seed theme` CLI.

Two Dark values change from the Seed library so they pass WCAG AA: `bg-accent-solid` is blue-600 (was blue-500, 3.6:1 with white text) and `text-accent-primary` is blue-300 (was blue-400, 4.0:1 on `bg-accent-primary`). New tokens: `text-on-accent`, `control-sm`, `control-md`, `control-lg` and the `brand-50` to `brand-950` scale.
