import * as React from "react";
import { cn } from "../lib/cn.js";
import { ArrowDownGlyph, ArrowUpGlyph, ChevronsUpDownGlyph } from "../lib/glyphs.js";

const TableCtx = React.createContext<{ density: "comfortable" | "compact"; stack: boolean }>({ density: "comfortable", stack: false });
const SectionCtx = React.createContext<"head" | "body" | "foot">("body");

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** comfortable rows are 48px (default), compact 40px. */
  density?: "comfortable" | "compact";
  /** Below 768px each row becomes a card: the first cell as its title, then every other cell under its column's header. Default true; false keeps a table that scrolls sideways. */
  stackOnMobile?: boolean;
  /** Classes for the frame around the table. */
  frameClassName?: string;
}

/* Labels every body and footer cell with its column's header text (data-label), unless the cell has its own label.
   Stacked rows show it above the value; it follows the header row as rows and headers change. */
function useColumnLabels(table: React.RefObject<HTMLTableElement | null>, on: boolean) {
  React.useEffect(() => {
    const el = table.current;
    if (!on || !el) return;
    const apply = () => {
      const head = el.tHead?.rows[el.tHead.rows.length - 1];
      const labels: string[] = [];
      if (head) for (const th of Array.from(head.cells)) for (let i = 0; i < th.colSpan; i++) labels.push(th.textContent?.trim() ?? "");
      for (const section of [...Array.from(el.tBodies), el.tFoot]) {
        if (!section) continue;
        for (const row of Array.from(section.rows)) {
          let col = 0;
          for (const cell of Array.from(row.cells)) {
            const own = cell.hasAttribute("data-label") && !cell.hasAttribute("data-label-auto");
            const label = cell.colSpan === 1 ? labels[col] : undefined;
            if (!own) {
              if (label) { cell.setAttribute("data-label", label); cell.setAttribute("data-label-auto", ""); }
              else { cell.removeAttribute("data-label"); cell.removeAttribute("data-label-auto"); }
            }
            col += cell.colSpan;
          }
        }
      }
    };
    apply();
    const watch = new MutationObserver(apply);
    watch.observe(el, { childList: true, subtree: true, characterData: true });
    return () => watch.disconnect();
  }, [table, on]);
}

/** Rows of records. Below 768px each row stacks into a card so text keeps its size; stackOnMobile={false} keeps the table, and its frame scrolls sideways instead of the page. */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table({ density = "comfortable", stackOnMobile = true, className, frameClassName, ...rest }, ref) {
  const inner = React.useRef<HTMLTableElement | null>(null);
  const setRef = React.useCallback((node: HTMLTableElement | null) => {
    inner.current = node;
    if (typeof ref === "function") ref(node); else if (ref) ref.current = node;
  }, [ref]);
  useColumnLabels(inner, stackOnMobile);
  const ctx = React.useMemo(() => ({ density, stack: stackOnMobile }), [density, stackOnMobile]);
  return (
    <TableCtx.Provider value={ctx}>
      <div className={cn("w-full overflow-x-auto rounded-petal rounded-tl-petal-tip border border-secondary bg-primary",
        stackOnMobile && "max-md:overflow-visible max-md:border-0 max-md:bg-transparent", frameClassName)}>
        {/* Stacked rows are no longer laid out as a table, so the roles are explicit: every browser keeps each value tied to its header. */}
        <table ref={setRef} role={stackOnMobile ? "table" : undefined}
          className={cn("w-full border-collapse text-primary body-body-3-regular", stackOnMobile && "seed-table-stack max-md:flex max-md:flex-col max-md:gap-sm", className)} {...rest} />
      </div>
    </TableCtx.Provider>
  );
});

/* Stacked, the header row keeps only what people use (sort buttons, select all) as a bar above the cards;
   plain header text is visually hidden but still read, so every value keeps its header for screen readers. */
export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableHeader({ className, ...rest }, ref) {
  const { stack } = React.useContext(TableCtx);
  return (
    <SectionCtx.Provider value="head">
      <thead ref={ref} role={stack ? "rowgroup" : undefined} className={cn("bg-secondary", stack && "max-md:block max-md:bg-transparent max-md:[&:not(:has(button,input,select,a))]:sr-only", className)} {...rest} />
    </SectionCtx.Provider>
  );
});
export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableBody({ className, ...rest }, ref) {
  const { stack } = React.useContext(TableCtx);
  return (
    <SectionCtx.Provider value="body">
      <tbody ref={ref} role={stack ? "rowgroup" : undefined} className={cn("[&>tr:last-child>td]:border-b-0", stack && "max-md:flex max-md:flex-col max-md:gap-sm", className)} {...rest} />
    </SectionCtx.Provider>
  );
});
export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableFooter({ className, ...rest }, ref) {
  const { stack } = React.useContext(TableCtx);
  return (
    <SectionCtx.Provider value="foot">
      <tfoot ref={ref} role={stack ? "rowgroup" : undefined} className={cn("bg-secondary label-label-2-medium [&>tr>td]:border-t [&>tr>td]:border-b-0 [&>tr>td]:border-secondary",
        stack && "max-md:flex max-md:flex-col max-md:gap-sm max-md:bg-transparent max-md:[&>tr>td]:border-t-0", className)} {...rest} />
    </SectionCtx.Provider>
  );
});

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Selected rows use the neutral selection color. */
  selected?: boolean;
}
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({ selected, className, ...rest }, ref) {
  const { stack } = React.useContext(TableCtx);
  const section = React.useContext(SectionCtx);
  return <tr ref={ref} role={stack ? "row" : undefined} aria-selected={selected || undefined} className={cn("transition-colors duration-(--duration-fast) [tbody>&]:hover:bg-secondary-hover", selected && "bg-selected [tbody>&]:hover:bg-selected-hover",
    stack && (section === "head" ? "max-md:flex max-md:flex-wrap max-md:items-center max-md:gap-x-base max-md:gap-y-xs"
      : cn("max-md:relative max-md:flex max-md:min-w-0 max-md:flex-col max-md:gap-sm max-md:rounded-petal max-md:rounded-tl-petal-tip max-md:border max-md:border-secondary max-md:p-base",
        !selected && (section === "foot" ? "max-md:bg-secondary" : "max-md:bg-primary"))), className)} {...rest} />;
});

export type SortDirection = "ascending" | "descending" | false;
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Makes the header a sort button. Pass the current direction, or false when another column is sorted. */
  sort?: SortDirection;
  onSort?: () => void;
  align?: "left" | "center" | "right";
}
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead({ sort, onSort, align = "left", className, children, scope, ...rest }, ref) {
  const { density: d, stack } = React.useContext(TableCtx);
  const sortable = sort !== undefined || !!onSort;
  const Arrow = sort === "ascending" ? ArrowUpGlyph : sort === "descending" ? ArrowDownGlyph : ChevronsUpDownGlyph;
  return (
    <th ref={ref} scope={scope ?? "col"} role={stack ? (scope === "row" ? "rowheader" : "columnheader") : undefined} aria-sort={sortable ? (sort || "none") : undefined}
      className={cn("h-control-md whitespace-nowrap border-b border-secondary text-tertiary mono-label-medium", d === "compact" ? "px-sm" : "px-base",
        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left",
        stack && "max-md:h-auto max-md:border-0 max-md:px-0 max-md:text-left max-md:[&:not(:has(button,input,select,a))]:sr-only", className)} {...rest}>
      {sortable ? (
        <button type="button" onClick={onSort} className={cn("-mx-xxs inline-flex cursor-pointer items-center gap-xxs rounded-sm border-0 bg-transparent px-xxs py-xxxs font-primary text-inherit [font:inherit]",
          "hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-primary", sort && "text-primary")}>
          {children}
          <Arrow size={12} className={sort ? "text-icon-secondary" : "text-icon-tertiary"} />
        </button>
      ) : children}
    </th>
  );
});

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  /** The column's name, shown above the value when rows stack on phones. Default the header's text, read after render. */
  label?: string;
}
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell({ align = "left", label, className, ...rest }, ref) {
  const { density: d, stack } = React.useContext(TableCtx);
  return <td ref={ref} role={stack ? "cell" : undefined} data-label={label} className={cn("border-b border-secondary align-middle", d === "compact" ? "h-control-md px-sm" : "h-control-lg px-base",
    align === "right" ? "text-right tabular-nums" : align === "center" ? "text-center" : "text-left",
    stack && "max-md:block max-md:h-auto max-md:min-w-0 max-md:border-0 max-md:p-0 max-md:text-left max-md:wrap-break-word", className)} {...rest} />;
});

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(function TableCaption({ className, ...rest }, ref) {
  const { stack } = React.useContext(TableCtx);
  return <caption ref={ref} className={cn("caption-bottom border-t border-secondary px-base py-sm text-left text-tertiary body-body-4-regular", stack && "max-md:order-last max-md:border-0 max-md:px-0 max-md:py-0", className)} {...rest} />;
});
