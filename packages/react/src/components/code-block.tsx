import * as React from "react";
import { cn } from "../lib/cn.js";
import { CheckGlyph, ChevronDownGlyph, ChevronUpGlyph, CopyGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";
import { useCopy } from "./copy.js";

export type CodeLanguage = "tsx" | "ts" | "js" | "jsx" | "css" | "json" | "html" | "bash" | "text" | "diff";
type Kind = "c" | "s" | "k" | "t" | "n" | "p" | "f";
const TOKEN: Record<Kind, string> = {
  c: "text-tertiary italic",
  s: "text-success-primary",
  k: "text-accent-primary",
  t: "text-offer-primary",
  n: "text-warning-primary",
  p: "text-warning-primary",
  f: "text-primary font-semibold",
};
const KW = /\b(import|from|export|default|const|let|var|function|return|if|else|for|while|new|class|extends|async|await|try|catch|throw|typeof|interface|type|true|false|null|undefined|this)\b/;

function rulesFor(lang: string): [RegExp, Kind][] {
  switch (lang) {
    case "css": return [[/\/\*.*?\*\//, "c"], [/"[^"]*"|'[^']*'/, "s"], [/--[\w-]+|#[0-9a-fA-F]{3,8}\b/, "k"], [/-?\d*\.?\d+(px|rem|em|%|ms|s)?\b/, "n"], [/[\w-]+(?=\s*:)/, "p"]];
    case "json": return [[/"[^"]*"(?=\s*:)/, "p"], [/"[^"]*"/, "s"], [/\b(true|false|null)\b/, "k"], [/-?\d+\.?\d*/, "n"]];
    case "bash": case "sh": case "shell": return [[/#.*$/, "c"], [/"[^"]*"|'[^']*'/, "s"], [/^\s*[\w.-]+/, "k"], [/\s--?[\w-]+/, "p"]];
    case "html": return [[/<!--.*?-->/, "c"], [/"[^"]*"/, "s"], [/<\/?[\w-]+/, "k"], [/[\w-]+(?==)/, "p"]];
    default: return [[/\/\/.*$|\/\*.*?\*\//, "c"], [/`[^`]*`|"[^"]*"|'[^']*'/, "s"], [KW, "k"], [/<\/?[A-Z][\w.]*/, "t"], [/<\/?[a-z][\w-]*/, "k"], [/\b\d+\.?\d*\b/, "n"], [/[\w$]+(?=\s*\()/, "f"]];
  }
}

/** Seed's small built-in highlighter: JS, TS, JSX, CSS, JSON, HTML and shell, colored with status text tokens. */
export function highlightLine(line: string, language: string): React.ReactNode[] {
  if (!language || language === "text" || language === "plain") return [line];
  const rules = rulesFor(language);
  const out: React.ReactNode[] = [];
  let rest = line, guard = 0;
  while (rest.length && guard++ < 400) {
    let best: { i: number; t: string; k: Kind } | null = null;
    for (const [re, k] of rules) {
      const m = re.exec(rest);
      if (m && m[0].length && (!best || m.index < best.i)) best = { i: m.index, t: m[0], k };
    }
    if (!best) { out.push(rest); break; }
    if (best.i) out.push(rest.slice(0, best.i));
    out.push(<span key={out.length} className={TOKEN[best.k]}>{best.t}</span>);
    rest = rest.slice(best.i + best.t.length);
  }
  return out;
}

export interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  code: string;
  /** Default tsx. diff lines start with +, - or a space. */
  language?: CodeLanguage | (string & {});
  /** Colors the code inside a diff. Default tsx. */
  diffLanguage?: string;
  /** A file name or label; adds the header with the language and the copy Button. */
  title?: React.ReactNode;
  lineNumbers?: boolean;
  startLine?: number;
  highlightLines?: number[];
  wrap?: boolean;
  /** Collapses long code with a "Show N more lines" Button. */
  maxLines?: number;
  /** A CSS max height; the code scrolls inside it. */
  maxHeight?: number | string;
  actions?: React.ReactNode;
  /** false removes the copy Button. */
  copy?: boolean;
  /** Your own highlighter, for example Shiki on the server. */
  highlight?: (line: string, language: string) => React.ReactNode;
  variant?: "default" | "error";
  size?: "md" | "sm";
}

/** Code, terminal commands, logs and diffs. Copy copies the code only: no line numbers, no diff signs. */
export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(function CodeBlock(
  { code, language = "tsx", diffLanguage = "tsx", title, lineNumbers, startLine = 1, highlightLines = [], wrap, maxLines = 0, maxHeight, actions, copy = true, highlight, variant = "default", size = "md", className, ...rest }, ref) {
  const source = String(code ?? "").replace(/\n$/, "");
  const lines = source.split("\n");
  const diff = language === "diff";
  const [more, setMore] = React.useState(false);
  const [copied, doCopy] = useCopy(1500);
  const shown = maxLines && !more && lines.length > maxLines ? lines.slice(0, maxLines) : lines;
  const text = diff ? lines.map((l) => (/^[+\- ]/.test(l) ? l.slice(1) : l)).join("\n") : source;
  const copyBtn = copy ? <Button variant="ghost" size="sm" icon={copied ? <CheckGlyph /> : <CopyGlyph />} aria-label={copied ? "Copied" : "Copy code"} onClick={() => void doCopy(text)} /> : null;
  const header = title != null || actions;
  return (
    <div ref={ref} className={cn("group/code relative overflow-hidden rounded-petal rounded-tl-petal-tip border bg-inset font-mono", variant === "error" ? "border-error-primary" : "border-secondary", className)} {...rest}>
      {header ? (
        <div className="flex min-h-(--size-4xl) items-center gap-xs border-b border-secondary pr-xs pl-base">
          <span className="min-w-0 flex-1 truncate text-secondary mono-value-regular">{title}</span>
          {language !== "text" ? <span className="text-tertiary uppercase tracking-widest mono-label-medium">{language}</span> : null}
          <span className="inline-flex gap-xxxs">{actions}{copyBtn}</span>
        </div>
      ) : copyBtn ? (
        <span className="absolute top-xs right-xs z-1 rounded-md bg-inset opacity-0 transition-opacity duration-(--duration-fast) group-hover/code:opacity-100 group-focus-within/code:opacity-100 pointer-coarse:opacity-100 motion-reduce:transition-none">{copyBtn}</span>
      ) : null}
      <pre tabIndex={0} aria-label={title != null ? undefined : `${language} code`} style={maxHeight != null ? { maxHeight, overflow: "auto" } : undefined}
        className={cn("m-0 overflow-x-auto text-primary outline-0 [tab-size:2] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-primary",
          size === "sm" ? "py-xs seed-code-sm" : "py-sm mono-value-regular")}>
        <code className={cn("block font-[inherit]", wrap ? "min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]" : "min-w-max")}>
          {shown.map((l, i) => {
            const n = startLine + i;
            const kind = diff ? (l.startsWith("+") ? "added" : l.startsWith("-") ? "removed" : null) : highlightLines.includes(n) ? "highlighted" : null;
            const body = diff && (kind || l.startsWith(" ")) ? l.slice(1) : l;
            return (
              <span key={i} className={cn("block px-base",
                kind === "added" && "bg-success-primary", kind === "removed" && "bg-error-primary",
                kind === "highlighted" && "bg-selected shadow-[inset_var(--size-xxs)_0_0_var(--border-accent-primary)]")}>
                {lineNumbers ? <span aria-hidden="true" className="mr-base inline-block w-[3ch] text-right text-tertiary select-none">{n}</span> : null}
                {diff ? <span aria-hidden="true" className={cn("inline-block w-[2ch] select-none", kind === "added" ? "text-success-primary" : kind === "removed" ? "text-error-primary" : "text-tertiary")}>{kind === "added" ? "+" : kind === "removed" ? "−" : " "}</span> : null}
                {kind === "added" || kind === "removed" ? <span className="sr-only">{kind === "added" ? "Added: " : "Removed: "}</span> : null}
                <span>{highlight ? highlight(body, language) : highlightLine(body, diff ? diffLanguage : language)}</span>
                {"\n"}
              </span>
            );
          })}
        </code>
      </pre>
      {maxLines && lines.length > maxLines ? (
        <div className="flex justify-center border-t border-secondary p-xxs font-primary">
          <Button variant="ghost" size="sm" aria-expanded={more} rightIcon={more ? <ChevronUpGlyph /> : <ChevronDownGlyph />} onClick={() => setMore(!more)}>
            {more ? "Show less" : `Show ${lines.length - maxLines} more lines`}
          </Button>
        </div>
      ) : null}
    </div>
  );
});
