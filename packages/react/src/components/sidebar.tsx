import * as React from "react";
import { Collapsible as C } from "radix-ui";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { ChevronDownGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";
import { Tooltip } from "./tooltip.js";

export type SidebarItem =
  | { type?: "item"; id?: string; label: string; icon?: IconProp; href?: string; onClick?: (e: React.MouseEvent) => void; active?: boolean; badge?: React.ReactNode; items?: SidebarItem[]; defaultOpen?: boolean }
  | { type: "section"; label: string };

export interface SidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  items: SidebarItem[];
  /** Shares a row with the collapse button: keep it short (a logo). */
  header?: React.ReactNode;
  /** Under the header, hidden when collapsed (a workspace switcher). */
  subheader?: React.ReactNode;
  /** Content, or a function that receives collapsed. */
  footer?: React.ReactNode | ((collapsed: boolean) => React.ReactNode);
  /** Shows the collapse button. */
  collapsible?: boolean;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Renders links: pass your router's Link. Default <a>. */
  linkAs?: React.ElementType;
  /** Labels of the collapse button. */
  collapseLabel?: string;
  expandLabel?: string;
}

const PanelGlyph = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:-scale-x-100"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>;

const row = cn("group flex h-control-sm w-full min-w-0 cursor-pointer items-center gap-xs rounded-control border-0 bg-transparent px-xs text-left font-primary no-underline",
  "text-secondary label-label-2-regular transition-colors duration-(--duration-fast) hover:bg-secondary-hover hover:text-primary",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-primary");
const on = "bg-selected text-primary label-label-2-medium hover:bg-selected-hover";

function Entry({ it, depth, small, L }: { it: Extract<SidebarItem, { type?: "item" }>; depth: number; small: boolean; L: React.ElementType }) {
  const kids = it.items?.length ? it.items : null;
  const childActive = !!kids?.some((k) => k.type !== "section" && (k as any).active);
  const [open, setOpen] = React.useState(it.defaultOpen ?? childActive);
  const content = (
    <>
      {it.icon ? <span className={cn("inline-flex shrink-0 leading-none", it.active ? "text-icon-primary" : "text-icon-tertiary group-hover:text-icon-secondary")}>{renderIcon(it.icon, "sm")}</span> : null}
      {small ? <span className="sr-only">{it.label}</span> : <span className="min-w-0 flex-1 truncate">{it.label}</span>}
      {!small && it.badge != null ? <span className="ml-auto inline-flex h-(--size-xl) min-w-(--size-xl) items-center justify-center rounded-full bg-tertiary px-xxs text-secondary label-label-3-medium">{it.badge}</span> : null}
      {!small && kids ? <ChevronDownGlyph size={14} className={cn("ml-auto shrink-0 text-icon-tertiary transition-transform duration-(--duration-fast)", !open && "-rotate-90 rtl:rotate-90")} /> : null}
    </>
  );
  const cls = cn(row, it.active && on, small && "justify-center px-0", depth > 0 && "pl-[calc(var(--space-xs)+var(--size-lg)+var(--space-xs))]");
  let el: React.ReactElement;
  if (kids && !small) {
    return (
      <li>
        <C.Root open={open} onOpenChange={setOpen}>
          <C.Trigger className={cn(cls, childActive && !open && "text-primary")}>{content}</C.Trigger>
          <C.Content asChild><ul className="m-0 mt-px flex list-none flex-col gap-px p-0">{kids.map((k, i) => k.type === "section" ? null : <Entry key={k.id ?? i} it={k as any} depth={depth + 1} small={small} L={L} />)}</ul></C.Content>
        </C.Root>
      </li>
    );
  }
  const target = kids && small ? (kids.find((k) => k.type !== "section") as any) : it;
  el = target?.href
    ? <L href={target.href} onClick={target.onClick} aria-current={it.active || childActive ? "page" : undefined} className={cls}>{content}</L>
    : <button type="button" onClick={target?.onClick} aria-current={it.active || childActive ? "page" : undefined} className={cls}>{content}</button>;
  return <li>{small ? <Tooltip content={it.label} side="right">{el}</Tooltip> : el}</li>;
}


/** The app's main navigation, on the left. It collapses to icons with tooltips. */
export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { items, header, subheader, footer, collapsible, collapsed, defaultCollapsed = false, onCollapsedChange, linkAs: L = "a", collapseLabel = "Collapse sidebar", expandLabel = "Expand sidebar",
    className, "aria-label": label = "Main", ...rest }, ref) {
  const [inner, setInner] = React.useState(defaultCollapsed);
  const small = collapsed ?? inner;
  const toggle = () => { const n = !small; if (collapsed === undefined) setInner(n); onCollapsedChange?.(n); };

  const groups: { label?: string; items: SidebarItem[] }[] = [];
  for (const it of items) {
    if (it.type === "section") groups.push({ label: it.label, items: [] });
    else { if (!groups.length) groups.push({ items: [] }); groups[groups.length - 1].items.push(it); }
  }
  return (
    <nav ref={ref} aria-label={label} data-collapsed={small || undefined}
      className={cn("flex h-full shrink-0 flex-col gap-sm border-r border-secondary bg-secondary p-xs font-primary transition-[width] duration-(--duration-base) motion-reduce:transition-none",
        small ? "w-[calc(var(--size-3xl)+var(--space-xs)*2+var(--space-px))]" : "w-60", className)} {...rest}>
      {header || collapsible ? (
        <div className={cn("flex min-h-control-sm items-center gap-xs", small ? "flex-col" : "justify-between pl-xs")}>
          {!small ? <div className="min-w-0 flex-1">{header}</div> : null}
          {collapsible ? (
            <Tooltip content={small ? expandLabel : collapseLabel} side="right">
              <Button variant="ghost" size="sm" icon={<PanelGlyph />} aria-label={small ? expandLabel : collapseLabel} aria-expanded={!small} onClick={toggle} />
            </Tooltip>
          ) : null}
        </div>
      ) : null}
      {subheader && !small ? <div>{subheader}</div> : null}
      <div className="-mx-xs flex min-h-0 flex-1 flex-col gap-base overflow-y-auto px-xs">
        {groups.map((g, gi) => (
          <div key={gi} className="flex flex-col gap-xxs">
            {g.label ? (small ? <hr aria-hidden="true" className="mx-xs my-0 border-0 border-t border-secondary" /> : <span className="px-xs pt-xxs mono-label-medium uppercase text-tertiary">{g.label}</span>) : null}
            <ul className="m-0 flex list-none flex-col gap-px p-0">{g.items.map((it, i) => <Entry key={(it as any).id ?? i} it={it as any} depth={0} small={small} L={L} />)}</ul>
          </div>
        ))}
      </div>
      {footer ? <div className="border-t border-secondary pt-xs">{typeof footer === "function" ? footer(small) : footer}</div> : null}
    </nav>
  );
});
