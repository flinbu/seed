# Fenly Serif

Seed's own serif, for display titles and reading text. One variable file per style covers every weight from ExtraLight (200) to Black (900), in roman and italic. Free to use, ship and change under the [SIL Open Font License 1.1](OFL.txt).

| File | For |
| --- | --- |
| [`FenlySerif[wght].ttf`](FenlySerif%5Bwght%5D.ttf) | Desktop: macOS, Windows, Figma |
| [`FenlySerif-Italic[wght].ttf`](FenlySerif-Italic%5Bwght%5D.ttf) | Desktop, italic |
| [`FenlySerif-Variable.woff2`](FenlySerif-Variable.woff2) | Web |
| [`FenlySerif-Italic-Variable.woff2`](FenlySerif-Italic-Variable.woff2) | Web, italic |

## Install on a Mac
Double-click each `.ttf` and choose Install in Font Book, then restart the apps that use it (Figma included).

## Use it on the web
With Seed it's already loaded: `@flinbu/seed-tokens` ships these files and its `fonts.css`. Anywhere else:

```css
@font-face {
  font-family: "Fenly Serif";
  src: url("FenlySerif-Variable.woff2") format("woff2");
  font-weight: 200 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Fenly Serif";
  src: url("FenlySerif-Italic-Variable.woff2") format("woff2");
  font-weight: 200 900;
  font-style: italic;
  font-display: swap;
}
```

## Where it comes from
Built from [Literata](https://github.com/googlefonts/literata) (The Literata Project Authors), with the roman s from [Domine](https://github.com/googlefonts/domine) (The Domine Project Authors). [`scripts/fenly-serif`](../../scripts/fenly-serif) rebuilds it and lists every change.
