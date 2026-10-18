import * as React from "react";
import { cn } from "../lib/cn.js";
import { SearchGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";
import { Checkbox } from "./checkbox.js";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "./dropdown-menu.js";
import { EmptyState } from "./empty-state.js";
import { Input } from "./input.js";
import { Pagination } from "./pagination.js";
import { Skeleton } from "./skeleton.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table.js";

const ColumnsGlyph = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18M15 3v18" /></svg>;

export interface DataTableColumn<R> {
  key: string;
  header: React.ReactNode;
  /** The cell; default the row's value at key. */
  render?: (row: R) => React.ReactNode;
  align?: "left" | "center" | "right";
  /** Default true. */
  sortable?: boolean;
  /** What to sort by, when the cell isn't the raw value. */
  sortValue?: (row: R) => string | number;
  /** false keeps the column out of the Columns menu. */
  hideable?: boolean;
  className?: string;
}
export interface DataTableSort { key: string; dir: "asc" | "desc" }
export type RowKey = string | number;

export interface DataTableProps<R extends Record<string, unknown>> {
  columns: DataTableColumn<R>[];
  rows: R[];
  /** A key name, or a function. Default 'id'. */
  rowKey?: string | ((row: R, index: number) => RowKey);
  /** Default 10. */
  pageSize?: number;
  /** For the summary: ['component', 'components']. */
  noun?: [string, string];
  /** Default every column key. */
  searchKeys?: string[];
  searchPlaceholder?: string;
  selectable?: boolean;
  selected?: RowKey[];
  defaultSelected?: RowKey[];
  onSelectedChange?: (keys: RowKey[]) => void;
  /** Buttons shown in place of search while rows are selected. */
  bulkActions?: (rows: R[], clear: () => void) => React.ReactNode;
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  defaultHiddenColumns?: string[];
  /** Buttons on the right, such as "New component". */
  toolbar?: React.ReactNode;
  loading?: boolean;
  /** Shown when there are no rows at all. */
  empty?: React.ReactNode;
  density?: "comfortable" | "compact";
  onRowClick?: (row: R) => void;
  columnToggle?: boolean;
  className?: string;
  "aria-label"?: string;
}

/** A list of records with search, sorting across pages, column visibility, pagination, selection and bulk actions. */
export function DataTable<R extends Record<string, unknown>>({
  columns, rows, rowKey = "id", pageSize = 10, noun = ["row", "rows"], searchKeys, searchPlaceholder = "Search", selectable, selected, defaultSelected = [], onSelectedChange,
  bulkActions, sort, defaultSort = null, onSortChange, defaultHiddenColumns = [], toolbar, loading, empty, density, onRowClick, columnToggle = true, className, "aria-label": label,
}: DataTableProps<R>) {
  const [q, setQ] = React.useState("");
  const [hidden, setHidden] = React.useState<string[]>(defaultHiddenColumns);
  const [innerSort, setInnerSort] = React.useState(defaultSort);
  const [innerSel, setInnerSel] = React.useState<RowKey[]>(defaultSelected);
  const [pageState, setPage] = React.useState(1);
  const curSort = sort !== undefined ? sort : innerSort;
  const sel = selected ?? innerSel;
  const setSort = (s: DataTableSort | null) => { if (sort === undefined) setInnerSort(s); onSortChange?.(s); setPage(1); };
  const setSel = (k: RowKey[]) => { if (selected === undefined) setInnerSel(k); onSelectedChange?.(k); };
  const keyOf = (r: R, i: number): RowKey => (typeof rowKey === "function" ? rowKey(r, i) : ((r[rowKey] as RowKey | undefined) ?? i));

  const term = q.trim().toLowerCase();
  const keys = searchKeys ?? columns.map((c) => c.key);
  let list = rows.map((r, i) => ({ r, k: keyOf(r, i) }));
  if (term) list = list.filter(({ r }) => keys.some((k) => r[k] != null && String(r[k]).toLowerCase().includes(term)));
  if (curSort) {
    const col = columns.find((c) => c.key === curSort.key);
    const get = col?.sortValue ?? ((r: R) => r[curSort.key] as string | number);
    list = [...list].sort((a, b) => {
      const x = get(a.r), y = get(b.r);
      const d = typeof x === "number" && typeof y === "number" ? x - y : String(x ?? "").localeCompare(String(y ?? ""), undefined, { numeric: true });
      return curSort.dir === "desc" ? -d : d;
    });
  }
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  const page = Math.min(pageState, pages);
  const shown = list.slice((page - 1) * pageSize, page * pageSize);
  const visible = columns.filter((c) => !hidden.includes(c.key));
  const hideable = columns.filter((c) => c.hideable !== false && typeof c.header === "string");
  const selRows = rows.filter((r, i) => sel.includes(keyOf(r, i)));
  const from = list.length ? (page - 1) * pageSize + 1 : 0, to = Math.min(page * pageSize, list.length);
  const pageKeys = shown.map((x) => x.k);
  const allOnPage = pageKeys.length > 0 && pageKeys.every((k) => sel.includes(k));
  const someOnPage = pageKeys.some((k) => sel.includes(k));
  const cycle = (key: string) => setSort(!curSort || curSort.key !== key ? { key, dir: "asc" } : curSort.dir === "asc" ? { key, dir: "desc" } : null);
  const colCount = visible.length + (selectable ? 1 : 0);

  return (
    <div className={cn("flex min-w-0 flex-col gap-sm font-primary", className)}>
      <div className="flex flex-wrap items-center justify-between gap-xs">
        {sel.length && bulkActions ? (
          <div role="status" className="flex min-h-control-sm flex-wrap items-center gap-xs">
            <span className="text-primary label-label-2-medium">{sel.length} selected</span>
            {bulkActions(selRows, () => setSel([]))}
            <Button variant="ghost" size="sm" onClick={() => setSel([])}>Clear</Button>
          </div>
        ) : (
          <Input size="sm" leftIcon={<SearchGlyph />} placeholder={searchPlaceholder} aria-label={searchPlaceholder} value={q} className="w-full sm:max-w-xs"
            onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        )}
        <span className="inline-flex flex-wrap items-center gap-xs">
          {toolbar}
          {columnToggle && hideable.length ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="secondary" size="sm" leftIcon={<ColumnsGlyph />}>Columns</Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" aria-label="Visible columns" className="min-w-(--container-3xs)">
                <DropdownMenuLabel>Columns</DropdownMenuLabel>
                {hideable.map((c) => {
                  const on = !hidden.includes(c.key);
                  return <DropdownMenuCheckboxItem key={c.key} checked={on} onSelect={(e) => e.preventDefault()}
                    onCheckedChange={() => setHidden(on ? [...hidden, c.key] : hidden.filter((k) => k !== c.key))}>{c.header}</DropdownMenuCheckboxItem>;
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </span>
      </div>
      <Table density={density} aria-label={label} aria-busy={loading || undefined}>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-(--size-4xl)">
                <Checkbox aria-label="Select all on this page" checked={allOnPage} indeterminate={!allOnPage && someOnPage}
                  onCheckedChange={(v) => setSel(v ? Array.from(new Set([...sel, ...pageKeys])) : sel.filter((k) => !pageKeys.includes(k)))} />
              </TableHead>
            ) : null}
            {visible.map((c) => {
              const sortable = c.sortable !== false;
              const dir = curSort?.key === c.key ? (curSort.dir === "asc" ? "ascending" : "descending") : false;
              return <TableHead key={c.key} align={c.align} className={c.className} sort={sortable ? dir : undefined} onSort={sortable ? () => cycle(c.key) : undefined}>{c.header}</TableHead>;
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? Array.from({ length: Math.min(pageSize, 5) }, (_, i) => (
            <TableRow key={`s${i}`}>{Array.from({ length: colCount }, (_, j) => <TableCell key={j}><Skeleton height="var(--size-md)" className="w-3/4" /></TableCell>)}</TableRow>
          )) : shown.length ? shown.map(({ r, k }) => {
            const on = sel.includes(k);
            return (
              <TableRow key={String(k)} className={cn(on && "bg-selected [tbody>&]:hover:bg-selected-hover", onRowClick && "cursor-pointer")} onClick={onRowClick ? () => onRowClick(r) : undefined}>
                {selectable ? (
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox aria-label={`Select row ${String(r[columns[0]?.key ?? ""] ?? k)}`} checked={on} onCheckedChange={(v) => setSel(v ? [...sel, k] : sel.filter((x) => x !== k))} />
                  </TableCell>
                ) : null}
                {visible.map((c) => <TableCell key={c.key} align={c.align} className={c.className}>{c.render ? c.render(r) : (r[c.key] as React.ReactNode)}</TableCell>)}
              </TableRow>
            );
          }) : (
            <TableRow>
              <TableCell colSpan={colCount}>
                {term ? <EmptyState size="sm" icon={<SearchGlyph />} title="No matches" description={`Nothing matches “${q}”.`} actions={<Button variant="secondary" size="sm" onClick={() => setQ("")}>Clear search</Button>} />
                  : empty ?? <EmptyState size="sm" title={`No ${noun[1]} yet`} />}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination page={page} count={pages} onPageChange={setPage}
        summary={list.length ? `${from}–${to} of ${list.length} ${list.length === 1 ? noun[0] : noun[1]}` : `0 ${noun[1]}`} />
    </div>
  );
}
