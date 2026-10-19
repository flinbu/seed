import * as React from "react";
import { Dialog as D } from "radix-ui";
import { cn } from "../lib/cn.js";
import { menuIcon, menuItem, menuLabel, menuShortcut } from "../lib/floating.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { SearchGlyph } from "../lib/glyphs.js";
import { Kbd } from "./kbd.js";

export interface CommandItem {
  label: string;
  icon?: IconProp;
  description?: React.ReactNode;
  /** Shown at the end, like "⌘N" or ["⌘", "N"]. */
  shortcut?: string | string[];
  /** Extra words that match. */
  keywords?: string[];
  onSelect?: () => void;
  disabled?: boolean;
}
export interface CommandGroup { label?: string; items: CommandItem[] }
export interface CommandPaletteProps {
  groups: CommandGroup[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** An element that opens it, usually a Button. */
  trigger?: React.ReactElement;
  /** Key used with ⌘ or Ctrl to open it. Default 'k'; false turns it off. */
  hotkey?: string | false;
  placeholder?: string;
  /** Shown when nothing matches. */
  emptyText?: React.ReactNode;
  "aria-label"?: string;
}

/** Search every action and place from one box: ⌘K. Running a command closes it. */
export function CommandPalette({ groups, open, defaultOpen = false, onOpenChange, trigger, hotkey = "k", placeholder = "Type a command or search", emptyText = "No results", "aria-label": label = "Command palette" }: CommandPaletteProps) {
  const [inner, setInner] = React.useState(defaultOpen);
  const isOpen = open ?? inner;
  const setOpen = (o: boolean) => { if (open === undefined) setInner(o); onOpenChange?.(o); };
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();
  React.useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey.toLowerCase()) { e.preventDefault(); setOpen(!isOpen); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hotkey, isOpen]);
  React.useEffect(() => { if (!isOpen) { setQ(""); setActive(0); } }, [isOpen]);
  const t = q.trim().toLowerCase();
  const shown = groups.map((g) => ({ ...g, items: g.items.filter((it) => !t || it.label.toLowerCase().includes(t) || (it.keywords ?? []).join(" ").toLowerCase().includes(t)) })).filter((g) => g.items.length);
  const flat = shown.flatMap((g) => g.items).filter((it) => !it.disabled);
  const current = flat[Math.min(active, flat.length - 1)];
  const optId = (it: CommandItem) => `${id}-${flat.indexOf(it)}`;
  React.useEffect(() => { if (current) listRef.current?.querySelector(`[id="${optId(current)}"]`)?.scrollIntoView({ block: "nearest" }); }, [active, t]);
  /** The footer keys are a step smaller, like the prototype's. */
  const k = "h-(--size-lg) min-w-(--size-lg)";
  function run(it: CommandItem) { setOpen(false); it.onSelect?.(); }
  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % Math.max(flat.length, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + flat.length) % Math.max(flat.length, 1)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(flat.length - 1); }
    else if (e.key === "Enter" && current) { e.preventDefault(); run(current); }
  }
  return (
    <D.Root open={isOpen} onOpenChange={setOpen}>
      {trigger ? <D.Trigger asChild>{trigger}</D.Trigger> : null}
      <D.Portal>
        <D.Overlay className="fixed inset-0 z-40 bg-overlay-alpha-secondary data-[state=open]:animate-seed-fade-in motion-reduce:animate-none" />
        <D.Content aria-label={label} aria-describedby={undefined}
          className="fixed top-[12dvh] left-1/2 z-40 flex max-h-[76dvh] w-[calc(100%-var(--space-xl))] max-w-lg -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-secondary bg-elevated text-primary shadow-elevation-xl font-primary outline-none data-[state=open]:animate-seed-grow motion-reduce:animate-none">
          <D.Title className="sr-only">{label}</D.Title>
          <div className="flex h-control-lg shrink-0 items-center gap-xs border-b border-secondary px-base">
            <SearchGlyph className="shrink-0 text-icon-tertiary" />
            <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKey} placeholder={placeholder}
              role="combobox" aria-expanded aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={current ? optId(current) : undefined} aria-label={placeholder}
              className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-primary text-primary outline-none placeholder:text-placeholder body-body-2-regular" />
          </div>
          <div ref={listRef} id={`${id}-list`} role="listbox" aria-label="Results" className="max-h-80 min-h-0 flex-1 overflow-y-auto p-xxs">
            {shown.length ? shown.map((g, gi) => (
              <div key={gi} role="group" aria-label={g.label}>
                {g.label ? <div className={menuLabel} aria-hidden="true">{g.label}</div> : null}
                {g.items.map((it) => {
                  const on = current === it;
                  const keys = it.shortcut ? (Array.isArray(it.shortcut) ? it.shortcut : [it.shortcut]) : [];
                  return (
                    <div key={it.label} id={it.disabled ? undefined : optId(it)} role="option" aria-selected={on} aria-disabled={it.disabled || undefined}
                      data-highlighted={on ? "" : undefined} data-disabled={it.disabled ? "" : undefined}
                      onMouseMove={() => { if (!it.disabled) setActive(flat.indexOf(it)); }} onClick={() => { if (!it.disabled) run(it); }}
                      className={cn(menuItem, it.description && "items-start py-xs")}>
                      {it.icon ? <span className={cn(menuIcon, it.description && "pt-xxxs")}>{renderIcon(it.icon, "sm")}</span> : null}
                      <span className="flex min-w-0 flex-1 flex-col"><span className="truncate">{it.label}</span>
                        {it.description ? <span className="text-tertiary body-body-4-regular">{it.description}</span> : null}</span>
                      {keys.length ? <span className={cn(menuShortcut, "flex gap-xxxs")}>{keys.map((k) => <Kbd key={k}>{k}</Kbd>)}</span> : null}
                    </div>
                  );
                })}
              </div>
            )) : <p className="m-0 px-xs py-lg text-center text-tertiary body-body-3-regular">{emptyText}</p>}
          </div>
          <div aria-hidden="true" className="flex shrink-0 flex-wrap gap-base border-t border-secondary bg-secondary px-base py-xs text-tertiary body-body-4-regular">
            <span className="inline-flex items-center gap-xxxs"><Kbd className={k}>↑</Kbd><Kbd className={k}>↓</Kbd> to navigate</span>
            <span className="inline-flex items-center gap-xxxs"><Kbd className={k}>↵</Kbd> to select</span>
            <span className="inline-flex items-center gap-xxxs"><Kbd className={k}>Esc</Kbd> to close</span>
          </div>
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
