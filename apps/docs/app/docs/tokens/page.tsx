import { tokens } from "@flinbu/seed-tokens";
import { Badge } from "@flinbu/seed";

export const metadata = { title: "Tokens" };
const GROUPS: [string, string, (r: string) => string][] = [
  ["bg", "Backgrounds", (r) => `bg-${r}`], ["text", "Text", (r) => `text-${r}`], ["icon", "Icons", (r) => `text-icon-${r}`], ["border", "Borders", (r) => `border-${r}`], ["button", "Buttons", (r) => `bg-button-${r}`],
];
const Swatch = ({ light, dark }: { light: string; dark: string }) => (
  <span className="inline-flex h-(--size-2xl) w-(--size-5xl) shrink-0 overflow-hidden rounded-md border border-secondary" aria-hidden>
    <span className="flex-1" style={{ background: light }} /><span className="flex-1" style={{ background: dark }} />
  </span>
);

export default function TokensPage() {
  const sem = tokens.semantic;
  return (
    <article>
      <h1 className="m-0 mb-base display-title-regular text-primary">Tokens</h1>
      <p className="my-sm reading-body-light text-secondary">Every value in Seed. Build UI with the semantic colors; each swatch shows Light on the left and Dark on the right. The Tailwind class is next to each name.</p>
      {GROUPS.map(([k, title, cls]) => (
        <section key={k} className="mt-3xl">
          <h2 className="mb-sm heading-h6-semibold text-primary">{title}</h2>
          <ul className="m-0 flex list-none flex-col divide-y divide-secondary rounded-xl border border-secondary p-0">
            {sem.filter((s) => s.name.startsWith(k + "-")).map((s) => (
              <li key={s.name} className="flex items-center gap-sm px-sm py-xs">
                <Swatch light={s.light} dark={s.dark} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <code className="mono-value-regular text-primary">{s.name}</code>
                  {s.usage ? <span className="truncate body-body-4-regular text-tertiary">{s.usage}</span> : null}
                </span>
                <code className="hidden shrink-0 rounded-sm bg-tertiary px-xxs mono-value-regular text-secondary sm:inline">{cls(s.name.slice(k.length + 1))}</code>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section className="mt-3xl">
        <h2 className="mb-sm heading-h6-semibold text-primary">Type styles</h2>
        <ul className="m-0 flex list-none flex-col divide-y divide-secondary rounded-xl border border-secondary p-0">
          {tokens.typeStyles.filter((t) => !/title-title-[12]|heading-h[12]/.test(t.name)).map((t) => (
            <li key={t.name} className="flex flex-col gap-xxs px-sm py-sm">
              <span className={`${t.name} truncate text-primary`}>{t.group === "Mono" ? "Seed / Tokens" : "Grow from a single seed"}</span>
              <span className="flex flex-wrap gap-xs"><code className="mono-value-regular text-secondary">{t.name}</code><span className="body-body-4-regular text-tertiary">{t.fontSize} / {t.lineHeight} · {t.fontWeight}</span></span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-3xl">
        <h2 className="mb-sm heading-h6-semibold text-primary">Spacing</h2>
        <ul className="m-0 flex list-none flex-col gap-xxs p-0">
          {Object.entries(tokens.space).filter(([n]) => !/zero|px$/.test(n)).map(([n, v]) => (
            <li key={n} className="flex items-center gap-sm"><code className="w-28 mono-value-regular text-secondary">{n.replace("space-", "p-")}</code><span className="h-(--size-sm) rounded-sm bg-accent-solid" style={{ width: v }} /><span className="body-body-4-regular text-tertiary">{v}</span></li>
          ))}
        </ul>
      </section>
      <section className="mt-3xl">
        <h2 className="mb-sm heading-h6-semibold text-primary">Radius</h2>
        <div className="flex flex-wrap gap-sm">
          {Object.entries(tokens.radius).filter(([n]) => n !== "radius-none").map(([n, v]) => (
            <div key={n} className="flex flex-col items-center gap-xxs"><span className="size-(--size-5xl) border border-primary bg-tertiary" style={{ borderRadius: `var(--${n})` }} /><code className="mono-value-regular text-secondary">{n.replace("radius-", "rounded-")}</code><span className="body-body-4-regular text-tertiary">{v}</span></div>
          ))}
        </div>
      </section>
      <section className="mt-3xl">
        <h2 className="mb-sm heading-h6-semibold text-primary">Elevation</h2>
        <div className="stage grid grid-cols-2 gap-base rounded-xl border border-secondary p-lg sm:grid-cols-4">
          {Object.keys(tokens.shadows).filter((n) => n.startsWith("elevation-") && !/sunken|overflow/.test(n)).map((n) => (
            <div key={n} className="flex h-(--space-6xl) items-end rounded-lg bg-primary p-xs" style={{ boxShadow: `var(--${n})` }}><code className="mono-value-regular text-secondary">shadow-{n}</code></div>
          ))}
        </div>
        <p className="mt-base body-body-4-regular text-tertiary"><Badge>{sem.length} semantic</Badge> <Badge>{Object.keys(tokens.primitives).length} primitives</Badge></p>
      </section>
    </article>
  );
}
