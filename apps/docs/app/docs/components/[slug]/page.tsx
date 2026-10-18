import { notFound } from "next/navigation";
import { Badge } from "@flinbu/seed";
import { COMPONENTS, bySlug } from "@/lib/registry";
import { exampleSource } from "@/lib/examples";
import { Example } from "@/components/example";
import * as buttonEx from "@/examples/button";
import * as formsEx from "@/examples/forms";
import * as choicesEx from "@/examples/choices";
import * as displayEx from "@/examples/display";
import * as feedbackEx from "@/examples/feedback";
import * as overlaysEx from "@/examples/overlays";
import * as navigationEx from "@/examples/navigation";
import * as flowEx from "@/examples/flow";
import * as datesEx from "@/examples/dates";
import * as productEx from "@/examples/product";
import * as menusEx from "@/examples/menus";
import * as peopleEx from "@/examples/people";
import * as contentEx from "@/examples/content";
import * as chatEx from "@/examples/chat";
import * as toolsEx from "@/examples/tools";

const FILES: Record<string, Record<string, () => React.ReactNode>> = { button: buttonEx, forms: formsEx, choices: choicesEx, display: displayEx, feedback: feedbackEx, overlays: overlaysEx, navigation: navigationEx, flow: flowEx, dates: datesEx, product: productEx, menus: menusEx, people: peopleEx, content: contentEx, chat: chatEx, tools: toolsEx } as any;

export function generateStaticParams() { return COMPONENTS.map((c) => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = bySlug((await params).slug);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = bySlug((await params).slug);
  if (!c) notFound();
  const parts = c.parts ?? [c.name.split(" ")[0]];
  return (
    <article className="flex flex-col gap-2xl">
      <header className="flex flex-col gap-sm">
        <span className="mono-label-medium text-tertiary">{c.group}</span>
        <h1 className="m-0 display-title-regular text-primary">{c.name}</h1>
        <p className="m-0 reading-body-light text-secondary">{c.description}</p>
        <code className="self-start rounded-md bg-inset px-sm py-xs font-mono body-body-4-regular text-secondary">{`import { ${parts.join(", ")} } from "@flinbu/seed";`}</code>
      </header>
      {c.examples.map((e) => {
        const Fn = FILES[e.file][e.fn];
        return <Example key={e.fn} title={e.title} note={e.note} code={exampleSource(e.file, e.fn)}><Fn /></Example>;
      })}
      <section className="grid gap-base sm:grid-cols-2">
        <div className="flex flex-col gap-xs rounded-xl border border-success-secondary bg-success-primary p-base">
          <h2 className="m-0 label-label-2-semibold text-primary">Use it for</h2>
          <ul className="m-0 flex flex-col gap-xxs pl-base reading-small-light text-secondary">{c.use.map((u) => <li key={u}>{u}</li>)}</ul>
        </div>
        {c.avoid ? (
          <div className="flex flex-col gap-xs rounded-xl border border-warning-secondary bg-warning-primary p-base">
            <h2 className="m-0 label-label-2-semibold text-primary">Use something else for</h2>
            <ul className="m-0 flex flex-col gap-xxs pl-base reading-small-light text-secondary">{c.avoid.map((u) => <li key={u}>{u}</li>)}</ul>
          </div>
        ) : null}
      </section>
      <section className="flex flex-col gap-sm">
        <h2 className="m-0 heading-h6-semibold text-primary">Props</h2>
        <div className="overflow-x-auto rounded-xl border border-secondary">
          <table className="w-full border-collapse body-body-3-regular">
            <thead><tr>{["Prop", "Type", "Default", "Description"].map((h) => <th key={h} className="border-b border-secondary bg-secondary px-sm py-xs text-left mono-label-medium text-tertiary">{h}</th>)}</tr></thead>
            <tbody>{c.props.map((p) => (
              <tr key={p.name}>
                <td className="border-b border-secondary px-sm py-xs align-top"><code className="whitespace-nowrap mono-value-regular text-primary">{p.name}</code></td>
                <td className="border-b border-secondary px-sm py-xs align-top"><code className="mono-value-regular text-secondary">{p.type}</code></td>
                <td className="border-b border-secondary px-sm py-xs align-top"><code className="whitespace-nowrap mono-value-regular text-tertiary">{p.default ?? "none"}</code></td>
                <td className="border-b border-secondary px-sm py-xs align-top text-secondary">{p.description}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>
      <section className="flex flex-col gap-sm">
        <h2 className="m-0 heading-h6-semibold text-primary">Accessibility</h2>
        <ul className="m-0 flex flex-col gap-xxs pl-lg reading-body-light text-secondary">{c.a11y.map((a) => <li key={a}>{a}</li>)}</ul>
      </section>
    </article>
  );
}
