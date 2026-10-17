import * as React from "react";
import { cn } from "../lib/cn.js";
import { Button } from "./button.js";

const ChevronLeft = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:-scale-x-100"><path d="m15 18-6-6 6-6" /></svg>;
const ChevronRight = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:-scale-x-100"><path d="m9 18 6-6-6-6" /></svg>;

/** Pages to show: always the first and last, the current one with `siblings` on each side, and gaps as "…". */
export function pageRange(page: number, count: number, siblings = 1): (number | "gap")[] {
  const out: (number | "gap")[] = [];
  const from = Math.max(2, page - siblings), to = Math.min(count - 1, page + siblings);
  out.push(1);
  if (from > 2) out.push(from === 3 ? 2 : "gap");
  for (let p = from; p <= to; p++) out.push(p);
  if (to < count - 1) out.push(to === count - 2 ? count - 1 : "gap");
  if (count > 1) out.push(count);
  return out;
}

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** 1-based current page. */
  page: number;
  /** Number of pages. */
  count: number;
  onPageChange: (page: number) => void;
  /** Pages on each side of the current one. Default 1. */
  siblings?: number;
  /** Text before the buttons, like "21–40 of 446 tokens". */
  summary?: React.ReactNode;
  /** Default 'sm'. */
  size?: "sm" | "md";
}

/** Moves through pages of results. Previous and Next stay put so people can click through quickly. */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination({ page, count, onPageChange, siblings = 1, summary, size = "sm", className, "aria-label": label = "Pagination", ...rest }, ref) {
  const go = (p: number) => onPageChange(Math.min(count, Math.max(1, p)));
  return (
    <nav ref={ref} aria-label={label} className={cn("flex flex-wrap items-center justify-between gap-sm", className)} {...rest}>
      {summary ? <span className="text-secondary body-body-3-regular">{summary}</span> : <span />}
      <ul className="m-0 flex list-none items-center gap-xxxs p-0">
        <li><Button variant="ghost" size={size} icon={<ChevronLeft />} aria-label="Previous page" disabled={page <= 1} onClick={() => go(page - 1)} /></li>
        {pageRange(page, count, siblings).map((p, i) => (
          <li key={i} className="hidden sm:block">
            {p === "gap" ? <span aria-hidden="true" className="inline-flex w-control-sm justify-center text-tertiary">…</span> : (
              <Button variant={p === page ? "secondary" : "ghost"} size={size} aria-label={`Page ${p}`} aria-current={p === page ? "page" : undefined}
                className={cn("min-w-control-sm px-xs tabular-nums", size === "md" && "min-w-control-md")} onClick={() => go(p)}>{p}</Button>
            )}
          </li>
        ))}
        <li className="px-xs text-secondary body-body-3-regular sm:hidden" aria-live="polite">{page} of {count}</li>
        <li><Button variant="ghost" size={size} icon={<ChevronRight />} aria-label="Next page" disabled={page >= count} onClick={() => go(page + 1)} /></li>
      </ul>
    </nav>
  );
});
