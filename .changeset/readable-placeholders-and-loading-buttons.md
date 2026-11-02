---
"@flinbu/seed-tokens": patch
"@flinbu/seed": patch
---

Placeholders, helper text and loading buttons meet WCAG AA contrast (FEN-202). `text-placeholder` now uses the tertiary text color (`neutral-600` in Light, `neutral-400` in Dark, was 2.5:1 and 3.7:1), and `text-tertiary` holds 4.5:1 on every neutral surface, `bg-tertiary` and `bg-selected` included (`neutral-600` in Light, was `neutral-500` at 4.3:1 and 4.0:1 there). `icon-placeholder` matches `icon-tertiary`. A disabled checkbox, radio or switch keeps its description in `text-tertiary`; `text-disabled` is only for the labels of disabled controls. A loading Button keeps its colors, focus and spinner, is `aria-busy` and `aria-disabled` instead of `disabled`, and ignores clicks and form submits until it's done.
