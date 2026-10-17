import * as React from "react";
import { cn } from "../lib/cn.js";
import { ChevronRightGlyph } from "../lib/glyphs.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu.js";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** From the top level down; the last item is the current page. */
  items: BreadcrumbItem[];
  /** Collapse the middle into a menu when there are more than this many items. Default 4. */
  maxItems?: number;
  /** Renders links: pass your router's Link. Default <a>. */
  linkAs?: React.ElementType;
}

const linkCls = "rounded-sm text-secondary no-underline transition-colors duration-(--duration-fast) hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary";

/** Where the page sits: the path back up, with the current page last. */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb({ items, maxItems = 4, linkAs: L = "a", className, "aria-label": label = "Breadcrumb", ...rest }, ref) {
  const collapse = items.length > maxItems;
  const hidden = collapse ? items.slice(1, items.length - (maxItems - 2)) : [];
  const shown: (BreadcrumbItem | "more")[] = collapse ? [items[0], "more", ...items.slice(items.length - (maxItems - 2))] : items;
  return (
    <nav ref={ref} aria-label={label} className={className} {...rest}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-xxs p-0 body-body-3-regular">
        {shown.map((it, i) => {
          const last = i === shown.length - 1;
          return (
            <li key={i} className="inline-flex items-center gap-xxs">
              {it === "more" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger aria-label={`${hidden.length} more`} className={cn(linkCls, "cursor-pointer border-0 bg-transparent px-xxs font-primary [font:inherit]")}>…</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {hidden.map((h, k) => <DropdownMenuItem key={k} asChild={!!h.href} onSelect={h.onClick as any}>{h.href ? <L href={h.href}>{h.label}</L> : h.label}</DropdownMenuItem>)}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : last ? (
                <span aria-current="page" className="text-primary label-label-2-medium">{it.label}</span>
              ) : it.href ? (
                <L href={it.href} onClick={it.onClick} className={linkCls}>{it.label}</L>
              ) : (
                <button type="button" onClick={it.onClick} className={cn(linkCls, "cursor-pointer border-0 bg-transparent p-0 font-primary [font:inherit]")}>{it.label}</button>
              )}
              {last ? null : <ChevronRightGlyph size={14} className="text-icon-tertiary rtl:-scale-x-100" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
