import * as React from "react";
import { Popover as P } from "radix-ui";
import { cn } from "../lib/cn.js";
import { ChevronDownGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu.js";
import { Field, useField } from "./field.js";
import { Input } from "./input.js";
import { PopoverContent } from "./popover.js";
import { Separator } from "./separator.js";
import { Toggle } from "./toggle.js";
import { Tooltip } from "./tooltip.js";

const g = (d: React.ReactNode) => function G({ size = 16, className }: { size?: number | string; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>{d}</svg>;
};
const I = {
  bold: g(<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />),
  italic: g(<><path d="M19 4h-9M14 20H5M15 4 9 20" /></>),
  underline: g(<><path d="M6 4v6a6 6 0 0 0 12 0V4" /><path d="M4 20h16" /></>),
  strike: g(<><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><path d="M4 12h16" /></>),
  code: g(<><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></>),
  ul: g(<><path d="M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13" /></>),
  ol: g(<><path d="M10 12h11M10 18h11M10 6h11" /><path d="M4 10h2M4 6h1v4M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></>),
  quote: g(<><path d="M17 6H3M21 12H8M21 18H8M3 12v6" /></>),
  link: g(<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>),
  unlink: g(<><path d="m18.84 12.25 1.72-1.71h-.02a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="m5.17 11.75-1.71 1.71a5 5 0 0 0 7.07 7.07l1.71-1.71" /><path d="M8 2v3M2 8h3M16 22v-3M22 16h-3" /></>),
  undo: g(<><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></>),
  redo: g(<><path d="m15 14 5-5-5-5" /><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" /></>),
  clear: g(<><path d="M4 7V4h16v3M5 20h6M13 4 8 20M15 15l5 5M20 15l-5 5" /></>),
};

const TYPE: Record<string, string> = { P: "reading-body-light", H2: "heading-h5-semibold", H3: "heading-h6-semibold", LI: "reading-body-light", BLOCKQUOTE: "reading-body-light" };
const BLOCKS = [{ value: "p", label: "Paragraph" }, { value: "h2", label: "Heading 1" }, { value: "h3", label: "Heading 2" }, { value: "pre", label: "Code block" }];
const BLOCK_RE = /^(P|H[1-6]|UL|OL|BLOCKQUOTE|PRE|DIV|HR|TABLE)$/;

/* The browser nests a list made from a paragraph inside it (<p><ul>…</ul></p>) and leaves loose text at the top level
   when a list is removed. Lift lists out, wrap loose text in paragraphs, and keep the caret where it was. */
function liftLists(root: HTMLElement) {
  const sel = document.getSelection();
  const a = sel?.rangeCount ? [sel.anchorNode, sel.anchorOffset, sel.focusNode, sel.focusOffset] as const : null;
  let moved = false;
  for (const blk of Array.from(root.children)) {
    if (blk.tagName === "UL" || blk.tagName === "OL") continue;
    const lists = Array.from(blk.childNodes).filter((n) => n.nodeName === "UL" || n.nodeName === "OL");
    if (!lists.length) continue;
    const others = Array.from(blk.childNodes).filter((n) => !lists.includes(n) && !(n.nodeType === 3 && !n.textContent?.trim()) && n.nodeName !== "BR");
    if (others.length) continue;
    lists.forEach((l) => root.insertBefore(l, blk));
    root.removeChild(blk); moved = true;
  }
  let group: HTMLElement | null = null;
  for (const n of Array.from(root.childNodes)) {
    if (n.nodeType === 1 && BLOCK_RE.test(n.nodeName)) { group = null; continue; }
    if (n.nodeType === 3 && !n.textContent?.trim() && !group) continue;
    if (!group) { group = document.createElement("p"); root.insertBefore(group, n); }
    group.appendChild(n); moved = true;
    if (n.nodeName === "BR" && group.childNodes.length > 1) { group.removeChild(n); group = null; }
  }
  if (moved && a?.[0] && a[2] && root.contains(a[0])) { try { sel!.setBaseAndExtent(a[0], a[1], a[2], a[3]); } catch { /* the caret stays where the browser put it */ } }
}
function decorate(root: HTMLElement | null) {
  if (!root) return;
  liftLists(root);
  root.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));
  for (const el of Array.from(root.children)) {
    if (el.tagName === "UL" || el.tagName === "OL") { el.removeAttribute("class"); el.querySelectorAll("li").forEach((li) => { li.className = TYPE.LI!; }); }
    else { const c = TYPE[el.tagName === "DIV" ? "P" : el.tagName]; if (c) el.className = c; else el.removeAttribute("class"); }
    el.querySelectorAll("*:not(li)").forEach((x) => x.removeAttribute("class"));
  }
}
/** The HTML without Seed's classes, inline styles or empty spans. */
function clean(root: HTMLElement): string {
  const c = root.cloneNode(true) as HTMLElement;
  c.querySelectorAll("[class],[style]").forEach((el) => { el.removeAttribute("class"); el.removeAttribute("style"); });
  const spans = Array.from(c.querySelectorAll("span"));
  for (let j = spans.length - 1; j >= 0; j--) { const sp = spans[j]!; if (!sp.attributes.length) { while (sp.firstChild) sp.parentNode!.insertBefore(sp.firstChild, sp); sp.remove(); } }
  const html = c.innerHTML.replace(/​/g, "").trim();
  return html === "<p><br></p>" || html === "<br>" ? "" : html;
}
const exec = (cmd: string, val?: string) => { try { return document.execCommand?.(cmd, false, val); } catch { return false; } };
const query = (cmd: string) => { try { return !!document.queryCommandState?.(cmd); } catch { return false; } };

export type RteTool = "block" | "bold" | "italic" | "underline" | "strike" | "code" | "ul" | "ol" | "quote" | "link" | "undo" | "redo" | "clear" | "|";
export interface RichTextEditorProps {
  defaultValue?: string;
  value?: string;
  onChange?: (html: string) => void;
  /** Trim the tools; '|' adds a separator. */
  toolbar?: RteTool[];
  placeholder?: string;
  /** Default 160 (px). */
  minHeight?: number | string;
  maxHeight?: number | string;
  /** Over the limit marks it invalid and turns the count red. */
  maxLength?: number;
  showCount?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  /** Keep formatting on paste. Default false: paste is plain text. */
  pasteFormatting?: boolean;
  id?: string;
  className?: string;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

const DEFAULT_TOOLS: RteTool[] = ["block", "|", "bold", "italic", "underline", "strike", "code", "|", "ul", "ol", "quote", "|", "link", "|", "undo", "redo", "clear"];

/** A WYSIWYG editor for formatted text that emits clean HTML. */
export function RichTextEditor({
  defaultValue = "", value, onChange, toolbar = DEFAULT_TOOLS, placeholder = "", minHeight = 160, maxHeight, maxLength, showCount, readOnly, disabled, invalid, pasteFormatting,
  id, className, onFocus, onBlur, "aria-label": ariaLabel, "aria-labelledby": labelledBy, "aria-describedby": describedBy,
}: RichTextEditorProps) {
  const f = useField();
  const ed = React.useRef<HTMLDivElement>(null);
  const saved = React.useRef<Range | null>(null);
  const last = React.useRef<string | null>(null);
  const [st, setSt] = React.useState<Record<string, boolean>>({});
  const [blk, setBlk] = React.useState("p");
  const [count, setCount] = React.useState({ chars: 0, words: 0 });
  const [empty, setEmpty] = React.useState(true);
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [url, setUrl] = React.useState("");
  const auto = React.useId();
  const edId = id ?? f?.id ?? `seed-rte-${auto}`;
  const off = !!(disabled ?? f?.disabled) || !!readOnly;

  const measure = () => {
    const t = ed.current?.textContent ?? "";
    setCount({ chars: t.length, words: t.trim() ? t.trim().split(/\s+/).length : 0 });
    setEmpty(!t.trim() && !ed.current?.querySelector("li,img,hr"));
  };
  const emit = () => { decorate(ed.current); measure(); const html = clean(ed.current!); last.current = html; onChange?.(html); };
  const refresh = React.useCallback(() => {
    const sel = document.getSelection();
    if (!ed.current || !sel?.anchorNode || !ed.current.contains(sel.anchorNode)) return;
    let b = "p"; try { b = String(document.queryCommandValue?.("formatBlock") || "p").toLowerCase(); } catch { /* not supported */ }
    let node: Node | null = sel.anchorNode, inCode = false, inLink = false;
    while (node && node !== ed.current) { if (node.nodeName === "CODE") inCode = true; if (node.nodeName === "A") inLink = true; node = node.parentNode; }
    setSt({ bold: query("bold"), italic: query("italic"), underline: query("underline"), strike: query("strikeThrough"), ul: query("insertUnorderedList"), ol: query("insertOrderedList"), quote: b === "blockquote", code: inCode, link: inLink });
    setBlk(b === "blockquote" || b === "div" || !b ? "p" : b);
  }, []);
  React.useEffect(() => {
    const el = ed.current!;
    el.innerHTML = value ?? defaultValue;
    if (!el.innerHTML) el.innerHTML = "<p><br></p>";
    exec("defaultParagraphSeparator", "p");
    decorate(el); measure(); last.current = clean(el);
    document.addEventListener("selectionchange", refresh);
    return () => document.removeEventListener("selectionchange", refresh);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    if (value != null && value !== last.current && ed.current) { ed.current.innerHTML = value || "<p><br></p>"; decorate(ed.current); measure(); last.current = value; }
  }, [value]);

  // Browsers won't unwrap blocks that carry attributes, so the type classes come off before each command and go back after.
  const bare = () => ed.current?.querySelectorAll("[class]").forEach((el) => el.removeAttribute("class"));
  const run = (cmd: string, val?: string) => {
    ed.current?.focus();
    bare();
    if (saved.current) { const s = document.getSelection(); s?.removeAllRanges(); s?.addRange(saved.current); saved.current = null; }
    exec(cmd, val);
    emit(); refresh();
  };
  const toggleCode = () => {
    const sel = document.getSelection(); if (!sel?.rangeCount) return;
    let node: Node | null = sel.anchorNode;
    while (node && node !== ed.current && node.nodeName !== "CODE") node = node.parentNode;
    if (node && node.nodeName === "CODE") { node.parentNode!.replaceChild(document.createTextNode(node.textContent ?? ""), node); emit(); refresh(); return; }
    const text = sel.toString(); if (!text) return;
    run("insertHTML", `<code>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code>&#8203;`);
  };
  // A list inside a heading or quote nests oddly: make the block a paragraph first.
  const listify = (cmd: string) => { bare(); if (!st.ul && !st.ol && (blk !== "p" || st.quote)) exec("formatBlock", "<p>"); run(cmd); };
  const openLink = () => {
    const sel = document.getSelection();
    if (sel?.rangeCount && sel.anchorNode && ed.current?.contains(sel.anchorNode)) saved.current = sel.getRangeAt(0).cloneRange();
    let node: Node | null = sel?.anchorNode ?? null;
    while (node && node !== ed.current && node.nodeName !== "A") node = node.parentNode;
    setUrl(node && node.nodeName === "A" ? (node as HTMLAnchorElement).getAttribute("href") ?? "" : "https://");
    setLinkOpen(true);
  };
  const applyLink = () => {
    let u = url.trim();
    setLinkOpen(false);
    if (!u || u === "https://") return;
    if (!/^(https?:|mailto:|tel:|\/|#)/i.test(u)) u = `https://${u}`;
    if (saved.current?.collapsed) { run("insertHTML", `<a href="${u.replace(/"/g, "&quot;")}">${u.replace(/</g, "&lt;")}</a>`); return; }
    run("createLink", u);
  };
  const keep = (e: React.MouseEvent) => e.preventDefault();
  const TOOLS: Partial<Record<RteTool, { Icon: ReturnType<typeof g>; label: string; key?: string; act: () => void; plain?: boolean }>> = {
    bold: { Icon: I.bold, label: "Bold", key: "⌘B", act: () => run("bold") },
    italic: { Icon: I.italic, label: "Italic", key: "⌘I", act: () => run("italic") },
    underline: { Icon: I.underline, label: "Underline", key: "⌘U", act: () => run("underline") },
    strike: { Icon: I.strike, label: "Strikethrough", act: () => run("strikeThrough") },
    code: { Icon: I.code, label: "Inline code", act: toggleCode },
    ul: { Icon: I.ul, label: "Bulleted list", act: () => listify("insertUnorderedList") },
    ol: { Icon: I.ol, label: "Numbered list", act: () => listify("insertOrderedList") },
    quote: { Icon: I.quote, label: "Quote", act: () => run("formatBlock", st.quote ? "<p>" : "<blockquote>") },
    undo: { Icon: I.undo, label: "Undo", key: "⌘Z", act: () => run("undo"), plain: true },
    redo: { Icon: I.redo, label: "Redo", key: "⇧⌘Z", act: () => run("redo"), plain: true },
    clear: { Icon: I.clear, label: "Clear formatting", act: () => { run("removeFormat"); run("unlink"); }, plain: true },
  };
  const bad = invalid ?? f?.invalid;
  const over = !!maxLength && count.chars > maxLength;
  const isInvalid = !!bad || over;

  return (
    <div className={cn("flex min-w-0 flex-col rounded-lg border bg-primary shadow-elevation-raised transition-[border-color,box-shadow] duration-(--duration-fast)",
      isInvalid ? "border-error-primary focus-within:shadow-button-focus-destructive" : "border-primary hover:border-primary-solid focus-within:border-accent-primary focus-within:shadow-button-focus-primary",
      disabled && "border-disabled-alt bg-disabled-alt shadow-none hover:border-disabled-alt", className)}>
      {readOnly ? null : (
        <div role="toolbar" aria-label="Formatting" aria-controls={edId} className="flex flex-wrap items-center gap-xxxs rounded-t-lg border-b border-secondary bg-secondary p-xxs">
          {toolbar.map((k, i) => {
            if (k === "|") return <Separator key={i} orientation="vertical" className="mx-xxxs h-(--size-xl) self-center" />;
            if (k === "block") {
              const cur = BLOCKS.find((b) => b.value === blk) ?? BLOCKS[0]!;
              return (
                <DropdownMenu key={i}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" rightIcon={<ChevronDownGlyph />} disabled={off} onMouseDown={keep} aria-label={`Text style: ${cur.label}`} className="min-w-[calc(var(--size-5xl)*2+var(--size-lg))] justify-between text-primary">{cur.label}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent aria-label="Text style" onCloseAutoFocus={(e) => e.preventDefault()}>
                    {BLOCKS.map((b) => <DropdownMenuItem key={b.value} onSelect={() => run("formatBlock", `<${b.value}>`)}>{b.label}</DropdownMenuItem>)}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            if (k === "link") {
              return (
                <P.Root key={i} open={linkOpen} onOpenChange={setLinkOpen}>
                  <Tooltip content="Link" shortcut="⌘K">
                    <P.Trigger asChild>
                      <Toggle size="sm" icon={<I.link />} aria-label="Link" pressed={!!st.link} disabled={off} onMouseDown={keep} onClick={(e) => { e.preventDefault(); if (!linkOpen) openLink(); else setLinkOpen(false); }} />
                    </P.Trigger>
                  </Tooltip>
                  <PopoverContent aria-label="Edit link" className="w-[calc(var(--size-5xl)*6+var(--size-2xl))]">
                    <form className="flex flex-col gap-sm" onSubmit={(e) => { e.preventDefault(); applyLink(); }}>
                      <Field label="Link address"><Input size="sm" leftIcon={<I.link />} value={url} autoFocus onChange={(e) => setUrl(e.target.value)} /></Field>
                      <div className="flex justify-between gap-xs">
                        {st.link ? <Button type="button" variant="ghost" size="sm" leftIcon={<I.unlink />} onClick={() => { setLinkOpen(false); run("unlink"); }}>Remove</Button> : <span />}
                        <Button size="sm" type="submit">Apply</Button>
                      </div>
                    </form>
                  </PopoverContent>
                </P.Root>
              );
            }
            const t = TOOLS[k]; if (!t) return null;
            const btn = t.plain
              ? <Button variant="ghost" size="sm" icon={<t.Icon />} aria-label={t.label} disabled={off} onMouseDown={keep} onClick={t.act} />
              : <Toggle size="sm" icon={<t.Icon />} aria-label={t.label} pressed={!!st[k]} disabled={off} onMouseDown={keep} onClick={(e) => { e.preventDefault(); t.act(); }} />;
            return <Tooltip key={i} content={t.label} shortcut={t.key}>{btn}</Tooltip>;
          })}
        </div>
      )}
      <div ref={ed} id={edId} role="textbox" aria-multiline="true" contentEditable={!off} suppressContentEditableWarning
        aria-label={ariaLabel} aria-labelledby={ariaLabel ? undefined : labelledBy ?? f?.labelId} aria-describedby={describedBy ?? f?.describedBy}
        aria-invalid={isInvalid || undefined} aria-disabled={disabled || undefined} aria-readonly={readOnly || undefined}
        data-placeholder={placeholder} data-empty={empty ? "true" : undefined}
        className="seed-rte-content px-base py-sm" style={{ minHeight, maxHeight }}
        onInput={emit} onFocus={onFocus} onBlur={onBlur}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openLink(); }
          if (e.key === "Tab" && (st.ul || st.ol)) { e.preventDefault(); run(e.shiftKey ? "outdent" : "indent"); }
        }}
        onPaste={(e) => {
          if (pasteFormatting) return;
          e.preventDefault();
          exec("insertText", e.clipboardData.getData("text/plain"));
        }} />
      {showCount || maxLength ? (
        <div className="flex justify-between border-t border-secondary px-base py-xxs text-tertiary tabular-nums body-body-4-regular">
          <span>{count.words} words</span>
          <span className={over ? "text-error-primary" : undefined}>{maxLength ? `${count.chars} / ${maxLength}` : `${count.chars} characters`}</span>
        </div>
      ) : null}
    </div>
  );
}
