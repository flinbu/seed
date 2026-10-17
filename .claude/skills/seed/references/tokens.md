# Seed tokens

Use semantic tokens; they switch between Light and Dark. Primitive scales (`blue-600`, `neutral-200`) are only for charts, tags and illustration.

## Color (Tailwind utilities shown)

| Need | Use |
|---|---|
| Behind everything | `bg-canvas` |
| Page and cards | `bg-primary` |
| Sidebars, table headers | `bg-secondary` |
| Inputs at rest, chips | `bg-tertiary` |
| Code and wells | `bg-inset` |
| Popovers, menus, dialogs | `bg-elevated` |
| Selected rows, active nav | `bg-selected` |
| Customer content | `bg-stage` |
| Hover partners | `bg-primary-hover`, `bg-secondary-hover`… |
| Body and headings | `text-primary` |
| Supporting copy | `text-secondary` |
| Meta, helper (14px+) | `text-tertiary` |
| Links | `text-link` |
| Icons | `text-icon-primary`, `text-icon-secondary`, `text-icon-tertiary` |
| Cards, dividers | `border-secondary` |
| Inputs, outlined buttons | `border-primary` |
| Focus, selection | `border-accent-primary` |
| Primary action, on states | `bg-accent-solid` with `text-on-accent` |
| Soft highlight | `bg-accent-primary` |
| Status soft fill + text | `bg-{error,success,warning,info,offer}-primary` + `text-{status}-primary` |
| Status solid | `bg-{status}-secondary` |
| Inverse (tooltips, toasts) | `bg-black-solid` + `text-on-dark-color` |
| Scrims | `bg-overlay-alpha-primary` (popovers, drawers), `-secondary` (modals) |

Decorative only (below 3:1): every `*-secondary` status text, `text-placeholder`, `text-disabled`.

## Space (4px base)

`xxxs` 2, `xxs` 4, `xs` 8, `sm` 12, `base` 16, `md` 20, `lg` 24, `xl` 32, `2xl` 40 … `6xl` 72. Utilities: `p-base`, `gap-xs`, `px-lg`. Default component padding `base`; icon-to-label gap `xs`.

## Size

Icons 16 in labels and inputs, 20 in buttons, 24 standalone. Controls: `h-control-sm` 32, `h-control-md` 40 (default), `h-control-lg` 48.

## Radius

`rounded-control` 4 (all controls), `rounded-xl` 12 (cards), `rounded-2xl` 16 (dialogs), `rounded-full` (avatars, switches). Petal: `rounded-petal rounded-tl-petal-tip`.

## Elevation

`shadow-elevation-raised` cards, `-md` hovered cards and menus, `-lg` dropdowns and popovers, `-xl` dialogs, `-2xl` modal sheets.

## Type styles

- Label (controls): `label-label-1/2/3-{regular,medium,semibold}` (16/14/12). Default control label `label-label-2-medium`.
- Body: `body-body-1..4-regular` (18/16/14/12). Default paragraph `body-body-2-regular`; dense UI `body-body-3-regular`.
- Heading: `heading-h1..h6-semibold` (56 to 20). One H1 per page.
- Reading (long text): `reading-body-light` (Noto Serif 16/26), `reading-small-light` (14/22).
- Display (Domine): `display-title-regular` 38, `display-headline-regular` 28, `display-number-regular` 30.
- Mono: `mono-label-medium` (11, uppercase, 0.1em), `mono-value-regular` (13).

## Motion

`duration-fast` 120ms (press, hover), `duration-base` 200ms, `duration-slow` 320ms (arrivals). `easing-spring` for things opening, `easing-out` for everything else.

## Charts

`--sd-chart-1` to `--sd-chart-8` (blue, orange, teal, amber, pink, green, violet, red), assigned in order, never cycled. Status colors stay status colors. One y-axis.
