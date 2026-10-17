import * as React from "react";
import { cn } from "../lib/cn.js";
import { CheckGlyph, MessageGlyph, RotateGlyph } from "../lib/glyphs.js";
import { Avatar } from "./avatar.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { InputGroup } from "./input-group.js";
import { Kbd } from "./kbd.js";
import { formatRelative } from "./timeline.js";

export interface ThreadComment { id?: string | number; author: { name: string; src?: string; role?: string }; body: React.ReactNode; time?: Date | number | React.ReactNode; edited?: boolean }
export interface CommentThreadProps extends React.HTMLAttributes<HTMLElement> {
  comments: ThreadComment[];
  /** What the thread is about, like "button/secondary · Dark". */
  anchor?: React.ReactNode;
  /** Shows the reply box; ⌘ or Ctrl + Enter sends. */
  onReply?: (text: string) => void;
  resolved?: boolean;
  defaultResolved?: boolean;
  onResolvedChange?: (resolved: boolean) => void;
  /** A node per comment, usually a DropdownMenu. */
  commentActions?: (c: ThreadComment) => React.ReactNode;
  placeholder?: string;
  replyLabel?: string;
  now?: Date;
}

/** People's conversation pinned to a token, component or proposal. Resolving collapses it to one line. */
export const CommentThread = React.forwardRef<HTMLElement, CommentThreadProps>(function CommentThread(
  { comments, anchor, onReply, resolved, defaultResolved = false, onResolvedChange, commentActions, placeholder = "Reply…", replyLabel = "Reply", now, className, ...rest }, ref) {
  const [inner, setInner] = React.useState(defaultResolved);
  const isResolved = resolved ?? inner;
  const [expanded, setExpanded] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const id = React.useId();
  const count = `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`;
  const send = () => { const t = draft.trim(); if (t && onReply) { onReply(t); setDraft(""); } };
  return (
    <section ref={ref} aria-labelledby={id} className={cn("flex flex-col gap-sm rounded-petal rounded-tl-petal-tip border border-secondary p-base font-primary", isResolved ? "bg-secondary" : "bg-primary", className)} {...rest}>
      <div className="-mt-xxs flex min-h-control-sm items-center gap-xs">
        <span id={id} className="flex min-w-0 flex-1 items-center gap-xxs truncate text-tertiary body-body-4-regular">{anchor ? <><MessageGlyph size={12} className="shrink-0" />{anchor}</> : count}</span>
        {isResolved ? <Badge variant="success" icon={<CheckGlyph />}>Resolved</Badge> : null}
        <Button variant="ghost" size="sm" leftIcon={isResolved ? <RotateGlyph /> : <CheckGlyph />} onClick={() => { const n = !isResolved; if (resolved === undefined) setInner(n); onResolvedChange?.(n); setExpanded(false); }}>{isResolved ? "Reopen" : "Resolve"}</Button>
      </div>
      {isResolved && !expanded ? (
        <button type="button" onClick={() => setExpanded(true)} className="self-start cursor-pointer border-0 bg-transparent p-0 text-left font-primary text-secondary underline decoration-(--border-primary) underline-offset-3 body-body-3-regular focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary">{count}. Show</button>
      ) : (
        <ol className="m-0 flex list-none flex-col gap-base p-0">
          {comments.map((c, i) => {
            const t = c.time;
            const stamp = t instanceof Date || typeof t === "number" ? <time dateTime={new Date(t).toISOString()} title={new Date(t).toLocaleString()}>{formatRelative(t, now)}</time> : t;
            return (
              <li key={c.id ?? i} className="flex gap-sm">
                <Avatar name={c.author.name} src={c.author.src} size="sm" />
                <div className="flex min-w-0 flex-1 flex-col gap-xxxs">
                  <div className="flex min-h-(--size-xl) flex-wrap items-center gap-xs">
                    <span className="text-primary label-label-3-semibold">{c.author.name}</span>
                    {c.author.role ? <Badge appearance="outline">{c.author.role}</Badge> : null}
                    <span className="text-tertiary body-body-4-regular">{stamp}{c.edited ? " · edited" : ""}</span>
                    {commentActions ? <span className="ml-auto">{commentActions(c)}</span> : null}
                  </div>
                  <div className="whitespace-pre-wrap text-primary [overflow-wrap:anywhere] body-body-3-regular">{c.body}</div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
      {!isResolved && onReply ? (
        <InputGroup multiline rows={2} placeholder={placeholder} aria-label="Reply" value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
          bottom={<><span className="inline-flex items-center gap-xxxs text-tertiary body-body-4-regular"><Kbd>⌘</Kbd><Kbd>Enter</Kbd> to send</span><Button size="sm" disabled={!draft.trim()} onClick={send}>{replyLabel}</Button></>} />
      ) : null}
    </section>
  );
});
