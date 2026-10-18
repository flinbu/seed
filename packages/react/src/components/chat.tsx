import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { ArrowDownGlyph, CircleAlertGlyph, FileCodeGlyph, FileGlyph, FileImageGlyph, FileTextGlyph, XGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";
import { Spinner } from "./spinner.js";
import { Toggle } from "./toggle.js";

/* ---------- Bubble ---------- */

export interface BubbleReaction { icon?: IconProp; label: string; count?: number; pressed?: boolean; onPressedChange?: (pressed: boolean) => void }
export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** neutral (default, your turns), ghost (unframed reading text, Pluto's answers), outline, muted, accent or error. */
  variant?: "neutral" | "ghost" | "outline" | "muted" | "accent" | "error";
  /** start (default) or end; set for you inside a Message. */
  align?: "start" | "end";
  size?: "md" | "sm";
  /** Makes the whole bubble a link. */
  href?: string;
  reactions?: BubbleReaction[];
}
const bubbleLook: Record<NonNullable<BubbleProps["variant"]>, string> = {
  neutral: "bg-tertiary",
  ghost: "",
  outline: "border border-secondary bg-primary",
  muted: "bg-secondary text-secondary",
  accent: "bg-accent-primary",
  error: "bg-error-primary text-error-primary",
};

/** The framed surface of one chat turn. A petal: the tight corner points at the sender. */
export const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(function Bubble(
  { variant = "neutral", align = "start", size = "md", href, reactions, className, children, ...rest }, ref) {
  const ghost = variant === "ghost";
  const surface = cn(
    "block text-primary [overflow-wrap:anywhere]",
    ghost ? "p-0 font-reading" : size === "sm" ? "px-xs py-xxs" : "px-sm py-xs",
    align === "end" ? "rounded-petal rounded-tr-petal-tip" : "rounded-petal rounded-tl-petal-tip",
    bubbleLook[variant],
    href && "no-underline hover:brightness-97 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary",
  );
  return (
    <div ref={ref} className={cn("relative inline-flex flex-col font-primary", ghost ? "max-w-full reading-small-light" : cn("max-w-[min(100%,var(--container-lg))] body-body-3-regular", align === "end" ? "self-end" : "self-start"), className)} {...rest}>
      {href ? <a href={href} className={surface}>{children}</a> : <div className={surface}>{children}</div>}
      {reactions?.length ? (
        <div className={cn("relative -mt-xxs flex gap-xxxs px-xs", align === "end" && "justify-end")}>
          {reactions.map((r, i) => (
            <Toggle key={i} size="sm" pressed={r.pressed} onPressedChange={r.onPressedChange} leftIcon={r.icon}
              aria-label={r.label + (r.count != null ? `, ${r.count}` : "")}
              className="h-(--size-xl) rounded-full border border-secondary bg-elevated px-xxs body-body-4-regular">
              {r.count != null ? String(r.count) : null}
            </Toggle>
          ))}
        </div>
      ) : null}
    </div>
  );
});

export interface BubbleGroupProps extends React.HTMLAttributes<HTMLDivElement> { align?: "start" | "end" }
/** Consecutive bubbles from one sender. */
export function BubbleGroup({ align = "start", className, ...rest }: BubbleGroupProps) {
  return <div className={cn("flex flex-col gap-xxxs", align === "end" ? "items-end" : "items-start", className)} {...rest} />;
}

/* ---------- Message ---------- */

export interface MessageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** user (right, neutral bubble), assistant (left, unframed reading text) or system. */
  from?: "user" | "assistant" | "system";
  align?: "start" | "end";
  /** For chats between people. Pluto's chat uses none. */
  avatar?: React.ReactNode;
  name?: React.ReactNode;
  time?: React.ReactNode;
  /** Ghost Buttons, shown on hover and focus (always on touch screens). Keep to three or fewer. */
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  status?: "sending" | "error";
  /** The Bubble kind for string children. */
  variant?: BubbleProps["variant"];
  /** MessageScroller treats user turns as anchors; set false to opt out, or true on any other turn. */
  scrollAnchor?: boolean;
  children?: React.ReactNode;
}

/** One turn in a conversation: who said it, when, what, and what you can do with it. */
export const Message = React.forwardRef<HTMLDivElement, MessageProps>(function Message(
  { from = "assistant", align, avatar, name, time, actions, footer, status, variant, scrollAnchor: _anchor, className, children, ...rest }, ref) {
  const side = align ?? (from === "user" ? "end" : "start");
  const body = typeof children === "string" || typeof children === "number"
    ? <Bubble variant={variant ?? (from === "user" ? "neutral" : "ghost")} align={side}>{children}</Bubble>
    : children;
  const statusText = status === "sending" ? "Sending" : status === "error" ? "Not sent" : null;
  return (
    <div ref={ref} data-from={from} className={cn("group/message flex gap-xs", side === "end" && "flex-row-reverse", from === "user" ? "items-end" : "items-start", className)} {...rest}>
      {avatar ? <div className={cn("shrink-0", from === "assistant" && "mt-xxxs")}>{avatar}</div> : null}
      <div className={cn("flex min-w-0 flex-1 flex-col gap-xxs", from === "assistant" ? "items-stretch" : side === "end" ? "items-end" : "items-start")}>
        {name || time ? (
          <div className="flex items-baseline gap-xs">
            {name ? <span className="text-primary label-label-3-medium">{name}</span> : null}
            {time ? <span className="text-tertiary body-body-4-regular">{time}</span> : null}
          </div>
        ) : null}
        {body}
        {footer || actions || statusText ? (
          <div className={cn("flex min-h-(--size-3xl) items-center gap-xs", side === "end" && "flex-row-reverse")}>
            {statusText ? (
              <span className={cn("inline-flex items-center gap-xxs body-body-4-regular", status === "error" ? "text-error-primary" : "text-tertiary")}>
                {status === "error" ? <CircleAlertGlyph size={12} /> : null}{statusText}
              </span>
            ) : null}
            {footer}
            {actions ? <div className="inline-flex gap-xxxs opacity-0 transition-opacity duration-(--duration-fast) group-hover/message:opacity-100 group-focus-within/message:opacity-100 pointer-coarse:opacity-100 motion-reduce:transition-none">{actions}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
});

/** Consecutive turns from the same sender, with a tighter gap. */
export function MessageGroup({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-xxs", className)} {...rest} />;
}

/* ---------- MessageScroller ---------- */

export interface MessageScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Follow streamed output while at the bottom. Default true. */
  autoScroll?: boolean;
  /** How much of the previous turn stays visible when a new anchor scrolls near the top. Default 48 (px). */
  peek?: number;
  defaultScrollPosition?: "end" | "start";
  /** A CSS height, or give the parent a fixed height. */
  height?: number | string;
  jumpLabel?: string;
}

const isAnchor = (child: React.ReactNode) => {
  if (!React.isValidElement(child)) return false;
  const p = child.props as { scrollAnchor?: boolean; from?: string };
  return p.scrollAnchor === true || (p.scrollAnchor !== false && p.from === "user");
};

/** The scrolling transcript: follows new output at the bottom, never moves you while you read back, offers "Jump to latest". */
export const MessageScroller = React.forwardRef<HTMLDivElement, MessageScrollerProps>(function MessageScroller(
  { autoScroll = true, peek = 48, defaultScrollPosition = "end", height, jumpLabel = "Jump to latest", className, style, children, "aria-label": label = "Conversation", ...rest }, ref) {
  const vRef = React.useRef<HTMLDivElement>(null);
  const cRef = React.useRef<HTMLDivElement>(null);
  const follow = React.useRef(autoScroll);
  const anchors = React.useRef(0);
  const [atEnd, setAtEnd] = React.useState(true);
  const check = React.useCallback(() => {
    const v = vRef.current; if (!v) return;
    const end = v.scrollHeight - v.scrollTop - v.clientHeight < 8;
    setAtEnd(end);
    if (end) follow.current = autoScroll;
  }, [autoScroll]);
  const release = () => { const v = vRef.current; if (v && v.scrollHeight - v.scrollTop - v.clientHeight > 8) follow.current = false; };
  const toEnd = () => {
    const v = vRef.current; if (!v) return;
    v.scrollTo?.({ top: v.scrollHeight, behavior: "smooth" });
    follow.current = autoScroll;
  };
  React.useLayoutEffect(() => {
    const v = vRef.current, c = cRef.current; if (!v || !c) return;
    if (defaultScrollPosition !== "start") v.scrollTop = v.scrollHeight;
    anchors.current = c.querySelectorAll("[data-scroll-anchor]").length;
    const changed = () => {
      const list = c.querySelectorAll<HTMLElement>("[data-scroll-anchor]");
      if (list.length > anchors.current) {
        anchors.current = list.length;
        const a = list[list.length - 1]!;
        v.scrollTo?.({ top: Math.max(0, a.offsetTop - peek), behavior: "smooth" });
        follow.current = false;
      } else if (follow.current) v.scrollTop = v.scrollHeight;
      check();
    };
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(changed) : null;
    ro?.observe(c);
    const mo = new MutationObserver(changed);
    mo.observe(c, { childList: true, subtree: true, characterData: true });
    return () => { ro?.disconnect(); mo.disconnect(); };
  }, [check, defaultScrollPosition, peek]);
  return (
    <div ref={ref} className={cn("relative flex min-h-0 flex-col", className)} style={height != null ? { ...style, height } : style} {...rest}>
      <div ref={vRef} tabIndex={0} role="log" aria-label={label} aria-live="polite" aria-relevant="additions"
        onScroll={check} onWheel={release} onTouchMove={release}
        onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Home") follow.current = false; }}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain outline-0 [scrollbar-color:var(--border-primary)_transparent] [scrollbar-width:thin] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-primary">
        <div ref={cRef} className="flex flex-col gap-lg p-base">
          {React.Children.map(children, (child, i) => child == null || child === false ? null : (
            <div key={React.isValidElement(child) && child.key != null ? child.key : i} data-scroll-anchor={isAnchor(child) ? "" : undefined} className="motion-safe:animate-seed-rise">
              {child}
            </div>
          ))}
        </div>
      </div>
      {!atEnd ? (
        <Button variant="secondary" size="sm" leftIcon={<ArrowDownGlyph />} onClick={toEnd}
          className="absolute bottom-sm left-1/2 -translate-x-1/2 rounded-full shadow-elevation-md motion-safe:animate-seed-grow">{jumpLabel}</Button>
      ) : null}
    </div>
  );
});

/* ---------- Attachment ---------- */

const EXT_ICON: Record<string, IconProp> = {};
for (const e of ["pdf", "doc", "docx", "txt", "md", "csv", "xls", "xlsx"]) EXT_ICON[e] = FileTextGlyph;
for (const e of ["json", "js", "ts", "tsx", "jsx", "css", "html"]) EXT_ICON[e] = FileCodeGlyph;
for (const e of ["png", "jpg", "jpeg", "gif", "webp", "svg"]) EXT_ICON[e] = FileImageGlyph;

export interface AttachmentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The file name. */
  name: string;
  /** Type and size, or what went wrong. Written for you while uploading or processing. */
  description?: React.ReactNode;
  state?: "done" | "idle" | "uploading" | "processing" | "error";
  /** 0 to 100 while uploading. */
  progress?: number;
  /** An image preview. */
  src?: string;
  /** Overrides the icon picked from the file extension. */
  icon?: IconProp;
  onRemove?: () => void;
  actions?: React.ReactNode;
  /** Links the name once the file is ready. */
  href?: string;
  size?: "md" | "sm";
  orientation?: "horizontal" | "vertical";
}

/** A file or image in a conversation or an upload list. */
export const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(function Attachment(
  { name, description, state = "done", progress, src, icon, onRemove, actions, href, size = "md", orientation = "horizontal", className, ...rest }, ref) {
  const busy = state === "uploading" || state === "processing";
  const error = state === "error";
  const vertical = orientation === "vertical";
  const ext = (name.split(".").pop() ?? "").toLowerCase();
  const desc = description ?? (state === "uploading" ? `Uploading${progress != null ? ` · ${Math.round(progress)}%` : ""}` : state === "processing" ? "Processing" : error ? "Upload failed" : null);
  const media = cn("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md leading-none",
    error ? "bg-error-primary text-icon-error-primary" : "bg-tertiary text-icon-secondary",
    vertical ? "aspect-4/3 w-full" : size === "sm" ? "size-(--size-3xl)" : "size-(--size-4xl)");
  return (
    <div ref={ref} aria-busy={busy || undefined}
      className={cn("relative flex min-w-0 overflow-hidden rounded-lg border bg-primary font-primary",
        error ? "border-error-primary" : "border-secondary",
        vertical ? "w-[calc(var(--size-5xl)*3+var(--size-lg))] flex-col items-stretch p-xxs" : cn("items-center", size === "sm" ? "gap-xs p-xxs" : "gap-sm py-xs pr-sm pl-xs"),
        className)} {...rest}>
      <span className={media}>
        {src ? <img src={src} alt="" className="size-full object-cover" /> : error ? <CircleAlertGlyph size={20} /> : renderIcon(icon ?? EXT_ICON[ext] ?? FileGlyph, "md")}
      </span>
      <span className={cn("flex min-w-0 flex-1 flex-col", vertical && "px-xxs pb-xxs")}>
        {href && !busy ? (
          <a href={href} target={href.startsWith("#") ? undefined : "_blank"} rel="noreferrer" className="truncate text-primary no-underline label-label-2-medium hover:underline hover:underline-offset-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary">{name}</a>
        ) : <span className={cn("truncate text-primary label-label-2-medium", busy && "seed-shimmer")}>{name}</span>}
        {desc ? <span role={error ? "alert" : undefined} className={cn("body-body-4-regular", error ? "text-error-primary" : "text-secondary")}>{desc}</span> : null}
      </span>
      {actions || onRemove ? (
        <span className={cn("inline-flex shrink-0 gap-xxxs", vertical && "absolute top-xs right-xs rounded-md bg-elevated shadow-elevation-sm")}>
          {actions}
          {onRemove ? <Button variant="ghost" size="sm" icon={<XGlyph />} aria-label={`Remove ${name}`} onClick={onRemove} /> : null}
        </span>
      ) : null}
      {state === "uploading" && progress != null ? (
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-(--size-xxs) bg-tertiary">
          <span className="block h-full bg-accent-solid transition-[width] duration-(--duration-base) motion-reduce:transition-none" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
        </span>
      ) : null}
    </div>
  );
});

/** Several attachments in a row that scrolls sideways and snaps. */
export function AttachmentGroup({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="list" className={cn("flex snap-x snap-mandatory gap-xs overflow-x-auto pb-xxxs [scrollbar-color:var(--border-primary)_transparent] [scrollbar-width:thin]", className)} {...rest}>
      {React.Children.map(children, (c) => c ? <div role="listitem" className="max-w-(--container-2xs) flex-none snap-start">{c}</div> : null)}
    </div>
  );
}

/* ---------- Marker ---------- */

export interface MarkerProps extends React.HTMLAttributes<HTMLElement> {
  /** note (default), border (a hairline below) or separator (a centered label between rules). */
  variant?: "note" | "border" | "separator";
  icon?: IconProp;
  status?: "running" | "error";
  href?: string;
}

/** A small inline line in a conversation: what is happening now, a system note, or a labeled divider. */
export const Marker = React.forwardRef<HTMLElement, MarkerProps>(function Marker({ variant = "note", icon, status, href, className, children, ...rest }, ref) {
  if (variant === "separator") {
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={cn("flex items-center gap-sm font-primary", className)} {...rest}>
        <span aria-hidden="true" className="h-px flex-1 bg-(--border-secondary)" />
        <span className="whitespace-nowrap text-tertiary label-label-3-medium">{children}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-(--border-secondary)" />
      </div>
    );
  }
  const running = status === "running";
  const error = status === "error";
  const glyph = running ? <Spinner size="xs" label={null} /> : icon ? renderIcon(icon, "xs") : null;
  const inner = (
    <>
      {glyph ? <span className={cn("inline-flex leading-none", error ? "text-error-primary" : "text-icon-tertiary")}>{glyph}</span> : null}
      <span className={cn("body-body-4-regular", running && "seed-shimmer", href && "group-hover/marker:text-primary group-hover/marker:underline group-hover/marker:underline-offset-3")}>{children}</span>
    </>
  );
  const cls = cn("flex items-center gap-xs font-primary", error ? "text-error-primary" : "text-tertiary", variant === "border" && "border-b border-tertiary pb-xs", className);
  if (href) return <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={cn("group/marker rounded-control no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary", cls)} {...rest}>{inner}</a>;
  return <div ref={ref as React.Ref<HTMLDivElement>} role={running ? "status" : undefined} className={cls} {...rest}>{inner}</div>;
});
