import * as React from "react";
import type { Metadata } from "next";
import { tokens } from "@flinbu/seed-tokens";
import { Badge, Button } from "@flinbu/seed";
import { Download, FileText } from "lucide-react";
import { Code } from "@/components/code";
import { GlyphExplorer, TypeTester, WeightAxis } from "./showroom";

export const metadata: Metadata = {
  title: "Fenly Serif",
  description: "Fenly Serif, Seed's own serif for titles and reading text: a variable font from ExtraLight to Black, roman and italic, under the SIL Open Font License.",
};

const WEIGHTS: [number, string][] = [[200, "ExtraLight"], [300, "Light"], [400, "Regular"], [500, "Medium"], [600, "SemiBold"], [700, "Bold"], [800, "ExtraBold"], [900, "Black"]];
const SETS = [
  { name: "Uppercase", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  { name: "Lowercase", chars: "abcdefghijklmnopqrstuvwxyz" },
  { name: "Figures", chars: "0123456789" },
  { name: "Accented and extra letters", chars: "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŒàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿœßıªº" },
  { name: "Punctuation and symbols", chars: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~¡¿«»‹›‘’‚“”„–—…•·′″¢£¤¥€¦§¶©®™°±×÷−¬¹²³¼½¾↑↓" },
];
const SAMPLE: Record<string, string> = {
  "display-title-regular": "Tokens",
  "display-number-regular": "86",
  "display-headline-regular": "No components yet",
  "display-greeting-regular": "What should we work on in Seed?",
  "reading-body-light": "Four status text colors are below 4.5:1 on bg-primary in Light. I moved each one step darker on its own scale.",
  "reading-body-regular": "Emphasis inside reading text.",
  "reading-small-light": "Notes and captions inside long-form text.",
};
const STATS: [string, string][] = [["Weights", "200 to 900"], ["Styles", "Roman, Italic"], ["Characters", "230"], ["Format", "Variable WOFF2"], ["License", "SIL OFL 1.1"]];
const DETAILS: [string, string][] = [
  ["Based on", "Literata, by The Literata Project Authors (TypeTogether for Google)"],
  ["Changes", "Lighter at every weight (Regular is Literata at 330), x-height 500, 10 units more room on each side of every letter, the text optical size for every size"],
  ["Axis", "wght 200 to 900, default 400"],
  ["Files", "FenlySerif-Variable.woff2 (90 KB), FenlySerif-Italic-Variable.woff2 (93 KB)"],
  ["Languages", "English, Spanish, Portuguese, French, German, Italian and most Western European languages"],
  ["OpenType", "Ligatures (fi, fl, ff), tabular and proportional figures, fractions"],
];

const SNIPPET_SEED = `/* With Seed it's already there: display and reading text use it. */
@import "tailwindcss";
@import "@flinbu/seed-tokens/tailwind.css";

<h1 className="display-title-regular">Tokens</h1>
<p className="reading-body-light">Long reading text…</p>`;
const SNIPPET_CSS = `@font-face {
  font-family: "Fenly Serif";
  src: url("/fonts/FenlySerif-Variable.woff2") format("woff2");
  font-weight: 200 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Fenly Serif";
  src: url("/fonts/FenlySerif-Italic-Variable.woff2") format("woff2");
  font-weight: 200 900;
  font-style: italic;
  font-display: swap;
}
h1 { font-family: "Fenly Serif", Domine, Georgia, serif; font-weight: 400; }`;

function Section({ id, eyebrow, title, lead, children }: { id: string; eyebrow: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-b border-secondary">
      <div className="mx-auto flex max-w-screen-xl flex-col gap-xl px-lg py-4xl">
        <div className="flex max-w-2xl flex-col gap-xs">
          <span className="mono-label-medium text-tertiary">{eyebrow}</span>
          <h2 id={`${id}-title`} className="m-0 display-headline-regular text-primary text-balance">{title}</h2>
          {lead ? <p className="m-0 reading-body-light text-secondary">{lead}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export default function FenlySerifPage() {
  const styles = tokens.typeStyles.filter((t) => t.family === "display" || t.family === "reading");
  return (
    <main id="content">
      <section className="stage border-b border-secondary">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-2xl px-lg pt-5xl pb-4xl">
          <div className="flex flex-wrap items-center gap-xs">
            <span className="mono-label-medium text-tertiary">Seed · Typeface</span>
            <Badge variant="accent">New in 0.3</Badge>
          </div>
          <h1 className="m-0 font-display text-[clamp(56px,15vw,208px)] leading-[0.92] font-[350] tracking-[-0.04em] text-primary">
            Fenly <span className="italic">Serif</span>
          </h1>
          <div className="grid grid-cols-1 items-end gap-xl lg:grid-cols-[minmax(0,1fr)_auto]">
            <p className="m-0 max-w-2xl font-display text-[22px] leading-[1.55] font-light text-secondary">
              Seed’s own serif, for titles and long reading. Steady strokes, open spacing and a calm, even rhythm, from ExtraLight to Black, in roman and italic. Free to use under the SIL Open Font License.
            </p>
            <div className="flex flex-wrap gap-xs">
              <Button size="lg" asChild><a href="/fonts/FenlySerif-Variable.woff2" download><Download aria-hidden />Roman</a></Button>
              <Button size="lg" variant="secondary" asChild><a href="/fonts/FenlySerif-Italic-Variable.woff2" download><Download aria-hidden />Italic</a></Button>
              <Button size="lg" variant="ghost" href="/fonts/FenlySerif-OFL.txt" leftIcon={<FileText />}>License</Button>
            </div>
          </div>
          <dl className="m-0 grid grid-cols-2 gap-base border-t border-secondary pt-lg sm:grid-cols-3 lg:grid-cols-5">
            {STATS.map(([k, v]) => (
              <div key={k} className="flex flex-col gap-xxs">
                <dt className="mono-label-medium text-tertiary">{k}</dt>
                <dd className="m-0 font-display text-[24px] leading-tight text-primary">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section id="try" eyebrow="Type tester" title="Try it." lead="Pick a sample or click the text and type your own. Every weight between 200 and 900 is there, not just the named ones.">
        <TypeTester />
      </Section>

      <Section id="weights" eyebrow="Weights" title="Eight weights, and everything between." lead="One variable file per style carries the whole range. Drag through the axis, then compare the named weights in roman and italic.">
        <WeightAxis />
        <ul className="m-0 flex list-none flex-col divide-y divide-secondary border-y border-secondary p-0">
          {WEIGHTS.map(([w, name]) => (
            <li key={w} className="grid grid-cols-1 items-baseline gap-xs py-base md:grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)]">
              <span className="flex items-baseline gap-xs"><span className="mono-value-regular text-primary">{w}</span><span className="body-body-4-regular text-tertiary">{name}</span></span>
              <span className="truncate font-display text-[36px] leading-tight text-primary" style={{ fontWeight: w }}>Calm and even</span>
              <span className="truncate font-display text-[36px] leading-tight italic text-primary" style={{ fontWeight: w }}>Calm and even</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="sizes" eyebrow="Sizes" title="From a hero to a footnote." lead="The same drawing reads well in a 96px title and in a 14px note under a chart.">
        <div className="flex flex-col gap-lg">
          {[[96, 400, "Health 86"], [64, 400, "Pluto proposes."], [40, 400, "A person approves, and it ships."], [24, 300, "Four status colors were under 4.5:1 in Light. Each moved one step darker on its own scale."], [18, 300, "Long reading text sits at 16 to 18px in Light, with a line height a little over one and a half, so a page of docs stays easy to follow."], [14, 300, "Notes and captions: the button uses bg-button-primary and passes 4.6:1 in both themes."]].map(([s, w, t]) => (
            <div key={s} className="grid grid-cols-1 items-baseline gap-xs md:grid-cols-[80px_minmax(0,1fr)]">
              <span className="mono-value-regular text-tertiary">{s}px</span>
              <p className="m-0 font-display text-primary text-pretty" style={{ fontSize: Number(s), lineHeight: Number(s) > 30 ? 1.1 : 1.6, fontWeight: Number(w), letterSpacing: Number(s) > 30 ? "-0.02em" : 0 }}>{t}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="pairing" eyebrow="Pairing" title="Made to sit next to Plus Jakarta Sans." lead="Seed sets the interface in Plus Jakarta Sans and gives the serif the moments that need a voice: titles, big numbers, Pluto’s greeting and long reading.">
        <div className="grid grid-cols-1 gap-base md:grid-cols-3">
          <div className="flex flex-col gap-sm rounded-2xl border border-secondary bg-primary p-lg">
            <span className="mono-label-medium text-tertiary">Health</span>
            <span className="font-display text-[72px] leading-none tracking-[-0.03em] text-primary">86</span>
            <span className="body-body-3-regular text-secondary">Up 4 since last week. Two contrast issues left in Dark.</span>
          </div>
          <div className="flex flex-col gap-sm rounded-2xl border border-secondary bg-primary p-lg">
            <span className="mono-label-medium text-tertiary">Pluto</span>
            <span className="display-greeting-regular text-primary">What should we work on in Seed?</span>
            <span className="reading-small-light text-secondary">I can check contrast, write the docs for a component or propose a new token scale.</span>
          </div>
          <div className="flex flex-col gap-sm rounded-2xl border border-secondary bg-primary p-lg">
            <span className="mono-label-medium text-tertiary">Docs</span>
            <span className="heading-h5-semibold text-primary">Buttons</span>
            <span className="reading-body-light text-secondary">Use one primary button per view. Secondary and ghost buttons carry everything else.</span>
          </div>
        </div>
      </Section>

      <Section id="seed" eyebrow="In Seed" title="The styles that use it." lead="Display styles set titles, empty states, one big number and Pluto’s greeting. Reading styles set docs and Pluto’s answers.">
        <ul className="m-0 flex list-none flex-col divide-y divide-secondary rounded-xl border border-secondary p-0">
          {styles.map((t) => (
            <li key={t.name} className="flex flex-col gap-xxs px-base py-base">
              <span className={`${t.name} text-primary`}>{SAMPLE[t.name] ?? "Grow from a single seed"}</span>
              <span className="flex flex-wrap gap-xs"><code className="mono-value-regular text-secondary">{t.name}</code><span className="body-body-4-regular text-tertiary">{t.fontSize} / {t.lineHeight} · {t.fontWeight}</span></span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="glyphs" eyebrow="Characters" title="230 characters, two styles." lead="Pick a character to see it large, in any weight and in italic.">
        <GlyphExplorer sets={SETS} />
      </Section>

      <Section id="features" eyebrow="OpenType" title="The small things.">
        <div className="grid grid-cols-1 gap-base md:grid-cols-3">
          {[
            ["Ligatures", "liga", "fi fl ff", { fontVariantLigatures: "common-ligatures" }, { fontVariantLigatures: "none" }],
            ["Tabular figures", "tnum", "1,111.10", { fontVariantNumeric: "tabular-nums" }, { fontVariantNumeric: "proportional-nums" }],
            ["Fractions", "frac", "1/2 3/4", { fontVariantNumeric: "diagonal-fractions" }, {}],
          ].map(([name, tag, text, on, off]) => (
            <div key={tag as string} className="flex flex-col gap-sm rounded-2xl border border-secondary bg-primary p-lg">
              <span className="flex items-center justify-between"><span className="label-label-2-medium text-primary">{name as string}</span><code className="mono-value-regular text-tertiary">{tag as string}</code></span>
              <span className="flex flex-wrap items-baseline gap-x-lg gap-y-xs">
                <span className="font-display text-[clamp(32px,9vw,44px)] leading-none text-tertiary" style={off as React.CSSProperties}>{text as string}</span>
                <span className="font-display text-[clamp(32px,9vw,44px)] leading-none text-primary" style={on as React.CSSProperties}>{text as string}</span>
              </span>
              <span className="body-body-4-regular text-tertiary">Off, then on.</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="use" eyebrow="Use it" title="Get it into your project.">
        <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-xs">
            <span className="label-label-2-medium text-primary">With Seed</span>
            <Code code={SNIPPET_SEED} lang="tsx" />
          </div>
          <div className="flex min-w-0 flex-col gap-xs">
            <span className="label-label-2-medium text-primary">Anywhere else</span>
            <Code code={SNIPPET_CSS} lang="css" />
          </div>
        </div>
        <dl className="m-0 grid grid-cols-1 gap-x-xl gap-y-base md:grid-cols-[160px_minmax(0,1fr)]">
          {DETAILS.map(([k, v]) => (
            <React.Fragment key={k}>
              <dt className="mono-label-medium text-tertiary md:pt-xxs">{k}</dt>
              <dd className="m-0 reading-body-light text-primary">{v}</dd>
            </React.Fragment>
          ))}
          <dt className="mono-label-medium text-tertiary md:pt-xxs">License</dt>
          <dd className="m-0 reading-body-light text-primary">
            SIL Open Font License 1.1: use it, ship it and change it, also in commercial work; if you change it, give it a new name. The <a className="text-link underline" href="/fonts/FenlySerif-OFL.txt">full license</a> ships with the font, and <code className="mono-value-regular">scripts/fenly-serif</code> in the Seed repo rebuilds it from Literata.
          </dd>
        </dl>
      </Section>
    </main>
  );
}

