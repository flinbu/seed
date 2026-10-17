import * as React from "react";
import { cn } from "../lib/cn.js";
import { ArrowDownGlyph, ArrowUpGlyph, ChevronsUpDownGlyph } from "../lib/glyphs.js";

const DensityCtx = React.createContext<"comfortable" | "compact">("comfortable");

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** comfortable rows are 48px (default), compact 40px. */
  density?: "comfortable" | "compact";
  /** Classes for the scrolling frame around the table. */
  frameClassName?: string;
}

/** Rows of records. The frame scrolls sideways on narrow screens; the page never does. */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table({ density = "comfortable", className, frameClassName, ...rest }, ref) {
  return (
    <DensityCtx.Provider value={density}>
      <div className={cn("w-full overflow-x-auto rounded-petal rounded-tl-petal-tip border border-secondary bg-primary", frameClassName)}>
        <table ref={ref} className={cn("w-full border-collapse text-primary body-body-3-regular", className)} {...rest} />
      </div>
    </DensityCtx.Provider>
  );
});

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableHeader({ className, ...rest }, ref) {
  return <thead ref={ref} className={cn("bg-secondary", className)} {...rest} />;
});
export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableBody({ className, ...rest }, ref) {
  return <tbody ref={ref} className={cn("[&>tr:last-child>td]:border-b-0", className)} {...rest} />;
});
export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableFooter({ className, ...rest }, ref) {
  return <tfoot ref={ref} className={cn("bg-secondary label-label-2-medium [&>tr>td]:border-t [&>tr>td]:border-b-0 [&>tr>td]:border-secondary", className)} {...rest} />;
});

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Selected rows use the neutral selection color. */
  selected?: boolean;
}
export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow({ selected, className, ...rest }, ref) {
  return <tr ref={ref} aria-selected={selected || undefined} className={cn("transition-colors duration-(--duration-fast) [tbody>&]:hover:bg-secondary-hover", selected && "bg-selected [tbody>&]:hover:bg-selected-hover", className)} {...rest} />;
});

export type SortDirection = "ascending" | "descending" | false;
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Makes the header a sort button. Pass the current direction, or false when another column is sorted. */
  sort?: SortDirection;
  onSort?: () => void;
  align?: "left" | "center" | "right";
}
export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead({ sort, onSort, align = "left", className, children, scope, ...rest }, ref) {
  const d = React.useContext(DensityCtx);
  const sortable = sort !== undefined || !!onSort;
  const Arrow = sort === "ascending" ? ArrowUpGlyph : sort === "descending" ? ArrowDownGlyph : ChevronsUpDownGlyph;
  return (
    <th ref={ref} scope={scope ?? "col"} aria-sort={sortable ? (sort || "none") : undefined}
      className={cn("h-control-md whitespace-nowrap border-b border-secondary text-secondary label-label-3-medium", d === "compact" ? "px-sm" : "px-base",
        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left", className)} {...rest}>
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

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> { align?: "left" | "center" | "right" }
export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell({ align = "left", className, ...rest }, ref) {
  const d = React.useContext(DensityCtx);
  return <td ref={ref} className={cn("border-b border-secondary align-middle", d === "compact" ? "h-control-md px-sm" : "h-control-lg px-base",
    align === "right" ? "text-right tabular-nums" : align === "center" ? "text-center" : "text-left", className)} {...rest} />;
});

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(function TableCaption({ className, ...rest }, ref) {
  return <caption ref={ref} className={cn("caption-bottom border-t border-secondary px-base py-sm text-left text-tertiary body-body-4-regular", className)} {...rest} />;
});
