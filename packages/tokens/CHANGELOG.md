# @flinbu/seed-tokens

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
