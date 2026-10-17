import * as React from "react";
import { cn } from "../lib/cn.js";
import { CopyButton } from "./copy.js";

export interface DescriptionItem { term: React.ReactNode; description?: React.ReactNode; mono?: boolean; copy?: boolean | string; key?: string }
export interface DescriptionListProps extends React.HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  /** horizontal (default): term column then value. vertical: stacked. grid: columns of pairs. */
  layout?: "horizontal" | "vertical" | "grid";
  /** For grid. Default 3. */
  columns?: 2 | 3 | 4;
  dense?: boolean;
}

/** Pairs of labels and values: a token's details, a version's metadata. Empty values show a quiet dash. */
export const DescriptionList = React.forwardRef<HTMLDListElement, DescriptionListProps>(function DescriptionList({ items, layout = "horizontal", columns = 3, dense, className, ...rest }, ref) {
  return (
    <dl ref={ref} className={cn("m-0 font-primary", layout === "vertical" && "flex flex-col gap-base",
      layout === "grid" && cn("grid grid-cols-2 gap-x-lg gap-y-base", columns === 3 && "sm:grid-cols-3", columns === 4 && "sm:grid-cols-4"), className)} {...rest}>
      {items.map((it, i) => {
        const empty = it.description == null || it.description === "";
        return (
          <div key={it.key ?? i} className={cn("group min-w-0",
            layout === "horizontal" ? cn("grid grid-cols-1 gap-xxxs sm:grid-cols-[minmax(var(--container-3xs),33%)_minmax(0,1fr)] sm:gap-base", !dense && "border-b border-secondary py-sm last:border-b-0", dense && "py-xxs") : "flex flex-col gap-xxxs")}>
            <dt className="m-0 text-secondary body-body-3-regular">{it.term}</dt>
            <dd className={cn("m-0 flex min-w-0 items-center gap-xxs text-primary body-body-3-regular", it.mono && "font-mono mono-value-regular")}>
              <span className="min-w-0 [overflow-wrap:anywhere]">{empty ? <span className="text-tertiary">–</span> : it.description}</span>
              {it.copy && !empty ? (
                <CopyButton value={typeof it.copy === "string" ? it.copy : String(it.description)} label={`Copy ${typeof it.term === "string" ? it.term.toLowerCase() : "value"}`}
                  className="-my-xxs opacity-0 group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100" />
              ) : null}
            </dd>
          </div>
        );
      })}
    </dl>
  );
});
