import * as React from "react";
import { Popover as P } from "radix-ui";
import { cn } from "../lib/cn.js";
import { floatingPanel, menuIcon, menuItem } from "../lib/floating.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { Textarea, type TextareaProps } from "./textarea.js";

export interface MentionItem { value: string; label: string; description?: React.ReactNode; icon?: IconProp | React.ReactNode; insert?: string }
export interface MentionInputProps extends Omit<TextareaProps, "value" | "defaultValue" | "onSubmit"> {
  /** Trigger character to items, e.g. { "@": people, "#": tokens }. */
  sources?: Record<string, MentionItem[]>;
  /** Shortcut for one source on "@". */
  items?: MentionItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onMention?: (item: MentionItem, trigger: string) => void;
  /** Runs on ⌘ or Ctrl + Enter. */
  onSubmit?: (value: string) => void;
}

const MIRROR = ["boxSizing", "width", "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
  "fontStyle", "fontWeight", "fontSize", "lineHeight", "fontFamily", "letterSpacing", "wordSpacing", "textIndent", "textTransform", "tabSize"] as const;
function caretRect(ta: HTMLTextAreaElement, pos: number) {
  const div = document.createElement("div"), cs = getComputedStyle(ta);
  MIRROR.forEach((p) => { (div.style as any)[p] = (cs as any)[p]; });
  Object.assign(div.style, { position: "absolute", visibility: "hidden", whiteSpace: "pre-wrap", overflowWrap: "break-word", top: "0", left: "-9999px" });
  div.textContent = ta.value.slice(0, pos);
  const span = document.createElement("span"); span.textContent = ta.value.slice(pos) || ".";
  div.appendChild(span); document.body.appendChild(div);
  const r = ta.getBoundingClientRect(), lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
  const out = { left: r.left + span.offsetLeft - ta.scrollLeft, top: r.top + span.offsetTop - ta.scrollTop, height: lh };
  document.body.removeChild(div);
  return out;
}

/** A text area that suggests people, tokens or components after a trigger: @ to mention, # to link a token. */
export const MentionInput = React.forwardRef<HTMLTextAreaElement, MentionInputProps>(function MentionInput(
  { sources, items, value, defaultValue = "", onValueChange, onMention, onSubmit, onKeyDown, onChange, className, id, ...rest }, ref) {
  const src = sources ?? { "@": items ?? [] };
  const [inner, setInner] = React.useState(defaultValue);
  const v = value ?? inner;
  const set = (n: string) => { if (value === undefined) setInner(n); onValueChange?.(n); };
  const [q, setQ] = React.useState<{ trigger: string; start: number; text: string } | null>(null);
  const [active, setActive] = React.useState(0);
  const [anchor, setAnchor] = React.useState({ left: 0, top: 0, height: 0 });
  const ta = React.useRef<HTMLTextAreaElement | null>(null);
  const caretTo = React.useRef<number | null>(null);
  const uid = React.useId();
  React.useLayoutEffect(() => { if (caretTo.current != null && ta.current) { const c = caretTo.current; caretTo.current = null; ta.current.focus(); ta.current.setSelectionRange(c, c); } });
  const list = q ? (src[q.trigger] ?? []).filter((it) => { const t = q.text.toLowerCase(); return !t || it.label.toLowerCase().includes(t) || it.value.toLowerCase().includes(t); }).slice(0, 8) : [];
  const open = !!q && list.length > 0;
  function detect(el: HTMLTextAreaElement) {
    const at = el.selectionStart, before = el.value.slice(0, at);
    let best: { trigger: string; start: number; text: string } | null = null;
    for (const tr of Object.keys(src)) {
      const i = before.lastIndexOf(tr);
      if (i < 0 || (i > 0 && !/\s/.test(before[i - 1]))) continue;
      const text = before.slice(i + tr.length);
      if (/\s/.test(text) || text.length > 30) continue;
      if (!best || i > best.start) best = { trigger: tr, start: i, text };
    }
    if (best) setAnchor(caretRect(el, best.start));
    if (!best || best.text !== q?.text) setActive(0);
    setQ(best);
  }
  function choose(it: MentionItem) {
    const el = ta.current!; const ins = q!.trigger + (it.insert ?? it.label) + " ";
    set(el.value.slice(0, q!.start) + ins + el.value.slice(el.selectionStart));
    caretTo.current = q!.start + ins.length;
    onMention?.(it, q!.trigger); setQ(null);
  }
  return (
    <P.Root open={open} onOpenChange={(o) => { if (!o) setQ(null); }}>
      <P.Anchor virtualRef={{ current: { getBoundingClientRect: () => DOMRect.fromRect({ x: anchor.left, y: anchor.top, width: 0, height: anchor.height }) } } as any} />
      <Textarea ref={(n) => { ta.current = n; if (typeof ref === "function") ref(n); else if (ref) ref.current = n; }} id={id} value={v}
        aria-autocomplete="list" aria-controls={open ? `${uid}-list` : undefined} aria-activedescendant={open ? `${uid}-${active}` : undefined}
        onChange={(e) => { set(e.target.value); detect(e.target); onChange?.(e); }} onClick={(e) => detect(e.currentTarget)}
        onKeyDown={(e) => {
          if (open) {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % list.length); return; }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + list.length) % list.length); return; }
            if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); choose(list[active]); return; }
            if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setQ(null); return; }
          }
          if (onSubmit && e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onSubmit(v); }
          onKeyDown?.(e);
        }}
        className={className} {...rest} />
      <P.Portal>
        <P.Content align="start" side="bottom" sideOffset={4} collisionPadding={8} onOpenAutoFocus={(e) => e.preventDefault()} onCloseAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => { if (ta.current?.contains(e.target as Node)) e.preventDefault(); }}
          className={cn(floatingPanel, "min-w-60 p-xxs")}>
          <div id={`${uid}-list`} role="listbox" aria-label="Suggestions">
            {list.map((it, i) => (
              <div key={it.value} id={`${uid}-${i}`} role="option" aria-selected={i === active} data-highlighted={i === active ? "" : undefined}
                onMouseDown={(e) => e.preventDefault()} onMouseMove={() => setActive(i)} onClick={() => choose(it)} className={cn(menuItem, it.description && "items-start py-xs")}>
                {it.icon ? <span className={cn(menuIcon, it.description && "pt-xxxs")}>{React.isValidElement(it.icon) && typeof it.icon.type !== "string" && (it.icon.props as any).name ? it.icon : renderIcon(it.icon as IconProp, "sm")}</span> : null}
                <span className="flex min-w-0 flex-col"><span className="truncate">{it.label}</span>{it.description ? <span className="text-tertiary body-body-4-regular">{it.description}</span> : null}</span>
              </div>
            ))}
          </div>
        </P.Content>
      </P.Portal>
    </P.Root>
  );
});
