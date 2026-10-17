import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { ChevronRightGlyph, FileGlyph, FolderGlyph, FolderOpenGlyph } from "../lib/glyphs.js";

export interface FileTreeNode { name: string; children?: FileTreeNode[]; meta?: React.ReactNode; icon?: IconProp }
export interface FileTreeProps {
  items: FileTreeNode[];
  /** Path of the selected file, like "css/tokens.css". */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (path: string) => void;
  /** Paths of open folders. */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (paths: string[]) => void;
  /** Opens every folder when uncontrolled. */
  expandAll?: boolean;
  className?: string;
  "aria-label"?: string;
}

function allFolders(nodes: FileTreeNode[], base = ""): string[] {
  return nodes.flatMap((n) => (n.children ? [base + n.name, ...allFolders(n.children, base + n.name + "/")] : []));
}

/** Files and folders, like an export or a repo. The ARIA tree pattern: arrows move and open, Enter selects. */
export function FileTree({ items, selected, defaultSelected = null, onSelect, expanded, defaultExpanded, onExpandedChange, expandAll, className, "aria-label": label = "Files" }: FileTreeProps) {
  const [sel, setSel] = React.useState(defaultSelected);
  const cur = selected !== undefined ? selected : sel;
  const [openInner, setOpenInner] = React.useState<string[]>(defaultExpanded ?? (expandAll ? allFolders(items) : []));
  const open = expanded ?? openInner;
  const setOpen = (n: string[]) => { if (expanded === undefined) setOpenInner(n); onExpandedChange?.(n); };
  const [focus, setFocus] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLUListElement>(null);

  const visible: { path: string; node: FileTreeNode; depth: number; parent: string | null }[] = [];
  (function walk(nodes: FileTreeNode[], base: string, depth: number, parent: string | null) {
    for (const n of nodes) {
      const p = base + n.name;
      visible.push({ path: p, node: n, depth, parent });
      if (n.children && open.includes(p)) walk(n.children, p + "/", depth + 1, p);
    }
  })(items, "", 0, null);
  const tabStop = focus && visible.some((v) => v.path === focus) ? focus : cur && visible.some((v) => v.path === cur) ? cur : visible[0]?.path;
  const moveTo = (p: string) => { setFocus(p); ref.current?.querySelector<HTMLElement>(`[data-path="${CSS.escape(p)}"]`)?.focus(); };
  function toggle(p: string, to?: boolean) { const isOpen = open.includes(p); const want = to ?? !isOpen; if (want !== isOpen) setOpen(want ? [...open, p] : open.filter((x) => x !== p)); }
  function onKey(e: React.KeyboardEvent, i: number) {
    const v = visible[i]; const folder = !!v.node.children; const isOpen = open.includes(v.path);
    const rtl = (e.currentTarget as HTMLElement).closest("[dir]")?.getAttribute("dir") === "rtl";
    const right = rtl ? "ArrowLeft" : "ArrowRight", left = rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key === "ArrowDown") { e.preventDefault(); if (visible[i + 1]) moveTo(visible[i + 1].path); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (visible[i - 1]) moveTo(visible[i - 1].path); }
    else if (e.key === "Home") { e.preventDefault(); moveTo(visible[0].path); }
    else if (e.key === "End") { e.preventDefault(); moveTo(visible[visible.length - 1].path); }
    else if (e.key === right) { e.preventDefault(); if (folder && !isOpen) toggle(v.path, true); else if (folder && visible[i + 1]) moveTo(visible[i + 1].path); }
    else if (e.key === left) { e.preventDefault(); if (folder && isOpen) toggle(v.path, false); else if (v.parent) moveTo(v.parent); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (folder) toggle(v.path); else { if (selected === undefined) setSel(v.path); onSelect?.(v.path); } }
  }
  return (
    <ul ref={ref} role="tree" aria-label={label} className={cn("m-0 flex list-none flex-col p-0 font-primary", className)}>
      {visible.map((v, i) => {
        const folder = !!v.node.children, isOpen = open.includes(v.path), isSel = v.path === cur;
        return (
          <li key={v.path} role="treeitem" data-path={v.path} tabIndex={v.path === tabStop ? 0 : -1}
            aria-level={v.depth + 1} aria-expanded={folder ? isOpen : undefined} aria-selected={folder ? undefined : isSel}
            onFocus={() => setFocus(v.path)} onKeyDown={(e) => onKey(e, i)}
            onClick={() => { if (folder) toggle(v.path); else { if (selected === undefined) setSel(v.path); onSelect?.(v.path); } }}
            style={{ paddingInlineStart: `calc(var(--space-xs) + ${v.depth} * var(--space-base))` }}
            className={cn("flex h-control-sm cursor-pointer items-center gap-xs rounded-control pr-xs outline-none select-none body-body-3-regular",
              "text-primary hover:bg-secondary-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-primary", isSel && "bg-selected hover:bg-selected-hover label-label-2-medium")}>
            <span className="inline-flex w-(--size-lg) shrink-0 justify-center text-icon-tertiary">
              {folder ? <ChevronRightGlyph size={14} className={cn("transition-transform duration-(--duration-fast) rtl:-scale-x-100", isOpen && "rotate-90")} /> : null}
            </span>
            <span className="inline-flex shrink-0 text-icon-secondary">{v.node.icon ? renderIcon(v.node.icon, "sm") : folder ? (isOpen ? <FolderOpenGlyph /> : <FolderGlyph />) : <FileGlyph />}</span>
            <span className="min-w-0 flex-1 truncate">{v.node.name}</span>
            {v.node.meta != null ? <span className="shrink-0 text-tertiary tabular-nums body-body-4-regular">{v.node.meta}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}
