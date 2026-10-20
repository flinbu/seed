# Fenly Serif

Seed's serif for display titles and reading text: a variable font (weight 200 to 900, roman and italic) built from [Literata](https://github.com/googlefonts/literata), with the roman s from [Domine](https://github.com/googlefonts/domine), under the SIL Open Font License 1.1.

What changes from Literata: the roman s is Domine's (ball terminals instead of squared serifs), fitted to Fenly Serif's x-height, width and weight, every weight is lighter (Regular is Literata at 330, Bold at 620), the optical size is fixed at 12, the x-height is 500, every letter gets 10 units more room on each side, and it's renamed. The drawing is Literata's. Heavy weights don't swap the few glyphs Literata swaps there (its `rvrn` feature).

Build it (Python 3 with `fonttools[woff]`):

```
npm pack @fontsource-variable/literata && tar -xzf fontsource-variable-literata-*.tgz
python3 scripts/fenly-serif/build.py package/files
cp FenlySerif-Variable.woff2 FenlySerif-Italic-Variable.woff2 packages/tokens/src/fonts/
```

The license ships next to the fonts as `packages/tokens/src/fonts/FenlySerif-OFL.txt`.
