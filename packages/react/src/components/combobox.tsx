import * as React from "react";
import { Popover as P } from "radix-ui";
import { cn } from "../lib/cn.js";
import { floatingPanel, menuIcon, menuItem } from "../lib/floating.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { CheckGlyph, ChevronsUpDownGlyph, XGlyph } from "../lib/glyphs.js";
import { fieldFrame } from "./input.js";
import { useField } from "./field.js";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: React.ReactNode;
  icon?: IconProp;
  /** Extra words that match when searching. */
  keywords?: string[];
  disabled?: boolean;
}
export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  /** Shown when nothing matches. Default 'No matches'. */
  emptyText?: React.ReactNode;
  /** Adds a clear button once something is picked. */
  clearable?: boolean;
  /** Your own matching. Default: label and keywords contain the text, ignoring case. */
  filter?: (option: ComboboxOption, query: string) => boolean;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: IconProp;
  id?: string;
  name?: string;
  className?: string;
  "aria-label"?: string;
}
const SIZE = { sm: "h-control-sm px-xs body-body-3-regular", md: "h-control-md px-sm body-body-3-regular", lg: "h-control-lg px-base body-body-2-regular" } as const;
const SearchGlyph = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;

/** A field you type into to find and pick one option from a long list. */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(props, ref) {
  const { options, placeholder = "Search", emptyText = "No matches", clearable, size = "md", leftIcon, className, name } = props;
  const f = useField();
  const auto = React.useId();
  const id = props.id ?? f?.id ?? `seed-combobox-${auto}`;
  const listId = `${id}-list`;
  const [inner, setInner] = React.useState<string | null>(props.defaultValue ?? null);
  const value = props.value !== undefined ? props.value : inner;
  const setValue = (v: string | null) => { if (props.value === undefined) setInner(v); props.onValueChange?.(v); };
  const selected = options.find((o) => o.value === value) ?? null;
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const bad = props.invalid ?? f?.invalid, off = props.disabled ?? f?.disabled;
  const q = query.trim().toLowerCase();
  const match = props.filter ?? ((o: ComboboxOption, t: string) => o.label.toLowerCase().includes(t) || (o.keywords ?? []).join(" ").toLowerCase().includes(t));
  const shown = open && q ? options.filter((o) => match(o, q)) : options;
  const enabled = shown.filter((o) => !o.disabled);
  const current = enabled[Math.min(active, enabled.length - 1)];

  function openList() {
    if (open || off) return;
    setQuery(""); setOpen(true);
    const i = enabled.findIndex((o) => o.value === value);
    setActive(i >= 0 ? i : 0);
  }
  function close() { setOpen(false); setQuery(""); }
  function choose(o: ComboboxOption) { setValue(o.value); close(); }
  React.useEffect(() => {
    if (!open || !current) return;
    listRef.current?.querySelector(`[data-value="${CSS.escape(current.value)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); if (!open) openList(); else setActive((a) => Math.min(a + 1, enabled.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (!open) openList(); else setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Home" && open) { e.preventDefault(); setActive(0); }
    else if (e.key === "End" && open) { e.preventDefault(); setActive(enabled.length - 1); }
    else if (e.key === "Enter" && open) { e.preventDefault(); if (current) choose(current); }
    else if (e.key === "Escape" && open) { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === "Tab") close();
  }
  const optId = (o: ComboboxOption) => `${id}-o-${o.value.replace(/\s+/g, "-")}`;

  return (
    <P.Root open={open} onOpenChange={(o) => (o ? openList() : close())}>
      <P.Anchor asChild>
        <div className={cn("flex items-center gap-xs", fieldFrame, SIZE[size], "focus-within:border-accent-primary focus-within:shadow-button-focus-primary",
          bad && "border-error-primary hover:border-error-primary focus-within:border-error-primary focus-within:shadow-button-focus-destructive",
          off && "border-disabled-alt bg-disabled-alt text-disabled shadow-none hover:border-disabled-alt", className)}>
          <span className={cn("inline-flex leading-none", off ? "text-icon-disabled" : "text-icon-tertiary")}>{renderIcon(selected && !open && selected.icon ? selected.icon : leftIcon, "sm") ?? <SearchGlyph />}</span>
          <input ref={(n) => { (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = n; if (typeof ref === "function") ref(n); else if (ref) ref.current = n; }}
            id={id} name={name} disabled={off} required={props.required ?? f?.required} autoComplete="off"
            role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={open ? listId : undefined}
            aria-activedescendant={open && current ? optId(current) : undefined} aria-invalid={bad || undefined}
            aria-describedby={f?.describedBy} aria-label={props["aria-label"]}
            placeholder={open && selected ? selected.label : placeholder}
            value={open ? query : selected?.label ?? ""}
            onChange={(e) => { setQuery(e.target.value); setActive(0); if (!open) setOpen(true); }}
            onClick={openList} onKeyDown={onKeyDown}
            className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 font-primary text-inherit outline-none placeholder:text-placeholder disabled:cursor-not-allowed [font-size:inherit] [line-height:inherit] [font-weight:inherit]" />
          {clearable && selected && !off ? (
            <button type="button" aria-label="Clear" onMouseDown={(e) => e.preventDefault()} onClick={() => { setValue(null); inputRef.current?.focus(); }}
              className="inline-flex size-(--size-xl) cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-icon-tertiary hover:bg-tertiary hover:text-icon-primary focus-visible:outline-2 focus-visible:outline-accent-primary">
              <XGlyph size={14} />
            </button>
          ) : <ChevronsUpDownGlyph className="shrink-0 text-icon-tertiary" />}
        </div>
      </P.Anchor>
      <P.Portal>
        <P.Content align="start" sideOffset={4} collisionPadding={8} onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => { if (inputRef.current?.parentElement?.contains(e.target as Node)) e.preventDefault(); }}
          className={cn(floatingPanel, "max-h-80 w-(--radix-popover-trigger-width) min-w-48 overflow-y-auto p-xxs origin-(--radix-popover-content-transform-origin)")}>
          <div ref={listRef} id={listId} role="listbox" aria-label={props["aria-label"] ?? "Options"}>
            {shown.length ? shown.map((o) => {
              const isActive = current?.value === o.value, isSel = o.value === value;
              return (
                <div key={o.value} id={optId(o)} data-value={o.value} role="option" aria-selected={isSel} aria-disabled={o.disabled || undefined}
                  data-highlighted={isActive ? "" : undefined} data-disabled={o.disabled ? "" : undefined}
                  onMouseDown={(e) => e.preventDefault()} onMouseMove={() => { if (!o.disabled) setActive(enabled.indexOf(o)); }}
                  onClick={() => { if (!o.disabled) choose(o); }}
                  className={cn(menuItem, "pr-2xl", o.description && "items-start py-xs")}>
                  {o.icon ? <span className={cn(menuIcon, o.description && "pt-xxxs")}>{renderIcon(o.icon, "sm")}</span> : null}
                  <span className="flex min-w-0 flex-1 flex-col"><span className="truncate">{o.label}</span>
                    {o.description ? <span className="whitespace-normal text-tertiary body-body-4-regular">{o.description}</span> : null}</span>
                  {isSel ? <span className="absolute right-xs inline-flex text-icon-accent-primary-hover"><CheckGlyph /></span> : null}
                </div>
              );
            }) : <div className="px-xs py-sm text-tertiary body-body-3-regular">{emptyText}</div>}
          </div>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
});
