import * as React from "react";
import { cn } from "../lib/cn.js";

export interface TocItem { id: string; label: React.ReactNode; level?: number }
export interface TableOfContentsProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  items: TocItem[];
  activeId?: string;
  onActiveChange?: (id: string) => void;
  /** The scrolling element when it isn't the window. */
  root?: string | React.RefObject<HTMLElement | null> | HTMLElement | null;
  /** Space for a sticky header. Default 16. */
  offset?: number;
  /** Default "On this page"; false hides it. */
  title?: React.ReactNode | false;
}
const getRoot = (r: TableOfContentsProps["root"]) => (typeof r === "string" ? document.querySelector<HTMLElement>(r) : r && "current" in r ? r.current : (r as HTMLElement | null | undefined) ?? null);

/** "On this page": follows the reader and jumps to a section. The current one gets aria-current="location". */
export const TableOfContents = React.forwardRef<HTMLElement, TableOfContentsProps>(function TableOfContents({ items, activeId, onActiveChange, root, offset = 16, title = "On this page", className, "aria-label": label = "On this page", ...rest }, ref) {
  const [inner, setInner] = React.useState(items[0]?.id);
  const cur = activeId ?? inner;
  const set = (id: string) => { if (activeId === undefined) setInner(id); onActiveChange?.(id); };
  const curRef = React.useRef(cur); curRef.current = cur;
  React.useEffect(() => {
    const r = getRoot(root);
    const scroller: HTMLElement | Window = r ?? window;
    const upd = () => {
      const top = r ? r.getBoundingClientRect().top : 0;
      let c = items[0]?.id;
      for (const it of items) { const el = document.getElementById(it.id); if (el && el.getBoundingClientRect().top - top <= offset + 1) c = it.id; }
      const end = r ? r.scrollTop + r.clientHeight >= r.scrollHeight - 2 : window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (end && items.length) c = items[items.length - 1].id;
      if (c && c !== curRef.current) set(c);
    };
    upd();
    scroller.addEventListener("scroll", upd, { passive: true });
    return () => scroller.removeEventListener("scroll", upd);
  }, [items.map((x) => x.id).join("|"), offset]);
  function go(e: React.MouseEvent, it: TocItem) {
    const el = document.getElementById(it.id); if (!el) return;
    e.preventDefault();
    const smooth = !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto";
    const r = getRoot(root);
    if (r) r.scrollTo({ top: el.getBoundingClientRect().top - r.getBoundingClientRect().top + r.scrollTop - offset, behavior: smooth });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: smooth });
    set(it.id);
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    history.replaceState?.(null, "", `#${it.id}`);
  }
  const minLevel = Math.min(...items.map((x) => x.level ?? 2), 9);
  return (
    <nav ref={ref} aria-label={label} className={cn("font-primary", className)} {...rest}>
      {title !== false ? <p className="m-0 mb-xs mono-label-medium uppercase text-tertiary">{title}</p> : null}
      <ul className="m-0 list-none border-l border-secondary p-0">
        {items.map((it) => {
          const on = it.id === cur;
          return (
            <li key={it.id} style={{ paddingInlineStart: `calc(${(it.level ?? 2) - minLevel} * var(--space-sm))` }}>
              <a href={`#${it.id}`} aria-current={on ? "location" : undefined} onClick={(e) => go(e, it)}
                className={cn("relative block rounded-r-control px-sm py-xxs no-underline body-body-3-regular transition-colors duration-(--duration-fast) outline-none hover:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-primary",
                  on ? "text-primary label-label-2-medium before:absolute before:inset-y-xxs before:-left-px before:w-(--size-xxs) before:rounded-full before:bg-accent-solid" : "text-secondary")}>{it.label}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});
