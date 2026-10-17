import * as React from "react";
import { Code } from "./code";

/** A live example on the dotted stage, with its source underneath. */
export function Example({ title, note, code, children }: { title?: string; note?: string; code: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-sm">
      {title ? <h3 className="m-0 label-label-1-semibold text-primary">{title}</h3> : null}
      {note ? <p className="m-0 reading-small-light text-secondary">{note}</p> : null}
      <div className="overflow-hidden rounded-xl border border-secondary">
        <div className="stage flex min-h-(--space-6xl) flex-wrap items-center justify-center gap-sm px-lg py-2xl">{children}</div>
        <Code code={code} className="rounded-none border-0 border-t" />
      </div>
    </section>
  );
}
