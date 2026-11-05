# @flinbu/seed-tokens

## 0.6.0

### Minor Changes

- c68817a: Tables stack into cards on phones, so their text never shrinks. Below 768px (the `md` breakpoint) every row of a `Table`, `DataTable` or `PropsTable` becomes a full-width card: the first cell is the card's title (in `PropsTable`, the prop's name in mono, with required marked as before), and every other value sits under its column's header, small and muted, at the normal text size. No sideways scrolling and nothing squeezed. `DataTable` keeps its sort buttons and select all in a bar above the cards, and a row's checkbox moves to the card's corner. It stays accessible: rows keep table roles, so screen readers still read each value with its header, and the visible label is hidden from them so it isn't read twice. Headers come from the header row on their own; `TableCell` takes a `label` to set one by hand. Above 768px nothing changes. A table that has to stay a table on phones takes `stackOnMobile={false}` and scrolls sideways inside its frame, as before. The docs' own Props tables now use `PropsTable`.

## 0.5.1

### Patch Changes

- 56622a6: Sheets and drawers dim the page in dark mode too: `bg-overlay-alpha-primary` is black at 50% there, not white at 20%, which lightened the page behind.

## 0.5.0

### Minor Changes

- a0c334b: Alerts and banners are calmer. Both now sit on the page's own surface (`bg-primary`) with the neutral card hairline, and only the icon carries the tone, so every existing `<Alert>` and `<Banner>` turns quiet with no code changes. The saturated tinted fills and strong borders are gone. When one alert really has to stand out, use the new `emphasis="loud"`: the same surface with a 1px hairline in the tone, from the new `border-info-subtle`, `border-success-subtle`, `border-warning-subtle`, `border-error-subtle` and `border-offer-subtle` tokens (the -300 step in Light, the -400 step at 40% over `bg-primary` in Dark). Announcements change too: an alert or banner rendered with the page has no live role, and one that appears later takes the new `live` prop to become `role="status"`, or `role="alert"` for errors only, so warnings no longer interrupt. Every alert and banner reads a visually hidden "Info:", "Success:", "Warning:" or "Error:" first (translate it with `toneLabel`), and links inside them use `text-accent-primary`.

## 0.4.1

### Patch Changes

- bc8b60b: Placeholders, helper text and loading buttons meet WCAG AA contrast (FEN-202). `text-placeholder` now uses the tertiary text color (`neutral-600` in Light, `neutral-400` in Dark, was 2.5:1 and 3.7:1), and `text-tertiary` holds 4.5:1 on every neutral surface, `bg-tertiary` and `bg-selected` included (`neutral-600` in Light, was `neutral-500` at 4.3:1 and 4.0:1 there). `icon-placeholder` matches `icon-tertiary`. A disabled checkbox, radio or switch keeps its description in `text-tertiary`; `text-disabled` is only for the labels of disabled controls. A loading Button keeps its colors, focus and spinner, is `aria-busy` and `aria-disabled` instead of `disabled`, and ignores clicks and form submits until it's done.

## 0.4.0

### Minor Changes

- 89e242e: New `graphite` primitive scale (14 true-gray steps between the neutral steps, `graphite-110` to `graphite-925`). The Dark surfaces and the light hover, selected and border grays now point at it, so every semantic color is an alias of a primitive; no values change.

### Patch Changes

- 9b03a3d: Fenly Serif names its weights (ExtraLight to Black, and their italics), so desktop apps like Font Book and Figma list each one. The letters don't change.

## 0.3.2

### Patch Changes

- e241b49: Fenly Serif's roman s takes Domine's ball terminals instead of squared serifs, fitted to its x-height, width and weight. At ExtraBold and Black it's a little lighter than the letters around it.

## 0.3.1

### Patch Changes

- cd55042: Fenly Serif is lighter at every weight: Regular is now about as light as Literata at 330 and Bold as Literata at 620, so titles and reading text sit calmer, above all in Dark. CSS weights don't change.

## 0.3.0

### Minor Changes

- aee72a8: Fenly Serif is Seed's serif: display titles and reading text use it, with Domine and Noto Serif as fallbacks. It's Seed's own variable font (weight 200 to 900, roman and italic), built from Literata under the SIL Open Font License; `scripts/fenly-serif` rebuilds it. Type sizes don't change.

## 0.2.1

No changes in this release.

## 0.2.0

No changes in this release.

## 0.1.2

### Patch Changes

- 6635cb6: Both packages link to the docs site as their homepage. First release staged by the GitHub workflow through trusted publishing.
