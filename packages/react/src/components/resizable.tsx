import * as React from "react";
import { cn } from "../lib/cn.js";
import { directionOf, useDirection } from "./direction.js";

const Grip = ({ vertical }: { vertical: boolean }) => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" className={vertical ? "rotate-90" : undefined}>
    <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
  </svg>
);

export interface ResizablePanelProps {
  /** Percent; panels without one share the rest. */
  defaultSize?: number;
  /** Default 10. */
  minSize?: number;
  /** Default 90. */
  maxSize?: number;
  /** Names the handle after this panel: "Resize inspector". */
  label?: string;
  id?: string;
  className?: string;
  children?: React.ReactNode;
}
/** One panel of a Resizable group. */
export function ResizablePanel(_: ResizablePanelProps): React.ReactElement | null { return null; }

export interface ResizableProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
  sizes?: number[];
  onSizesChange?: (sizes: number[]) => void;
  /** Shows a grip on each handle. */
  withHandle?: boolean;
}

/** Panels split by handles people drag, or move with arrow keys. */
export const Resizable = React.forwardRef<HTMLDivElement, ResizableProps>(function Resizable(
  { direction = "horizontal", sizes, onSizesChange, withHandle, className, children, ...rest }, ref) {
  const vertical = direction === "vertical";
  const panels = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<ResizablePanelProps>[];
  const [inner, setInner] = React.useState<number[]>(() => {
    const d = panels.map((p) => p.props.defaultSize);
    const free = 100 - d.reduce<number>((s, x) => s + (x ?? 0), 0);
    const unset = d.filter((x) => x == null).length;
    return d.map((x) => x ?? free / Math.max(1, unset));
  });
  const s = sizes ?? inner;
  const set = (next: number[]) => { if (sizes === undefined) setInner(next); onSizesChange?.(next); };
  const root = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => root.current!);
  const ctxDir = useDirection();
  const lim = (i: number): [number, number] => [panels[i]!.props.minSize ?? 10, panels[i]!.props.maxSize ?? 90];
  const pair = (i: number, a: number, b: number) => { const next = [...s]; next[i] = +a.toFixed(2); next[i + 1] = +b.toFixed(2); set(next); };
  const move = (i: number, delta: number) => {
    let a = s[i]! + delta, b = s[i + 1]! - delta;
    const la = lim(i), lb = lim(i + 1);
    if (a < la[0]) { b -= la[0] - a; a = la[0]; } if (b < lb[0]) { a -= lb[0] - b; b = lb[0]; }
    if (a > la[1]) { b += a - la[1]; a = la[1]; } if (b > lb[1]) { a += b - lb[1]; b = lb[1]; }
    pair(i, a, b);
  };
  const drag = (i: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = root.current!, r = el.getBoundingClientRect(), total = vertical ? r.height : r.width;
    const rtl = !vertical && directionOf(el, ctxDir) === "rtl";
    const start = vertical ? e.clientY : e.clientX, base = [...s];
    const handle = e.currentTarget; handle.setPointerCapture?.(e.pointerId); handle.focus();
    const sum = base[i]! + base[i + 1]!;
    const mv = (ev: PointerEvent) => {
      const d = (((vertical ? ev.clientY : ev.clientX) - start) / total) * 100 * (rtl ? -1 : 1);
      const la = lim(i), lb = lim(i + 1);
      let a = Math.max(la[0], Math.min(la[1], base[i]! + d)), b = sum - a;
      if (b < lb[0]) { b = lb[0]; a = sum - b; } if (b > lb[1]) { b = lb[1]; a = sum - b; }
      pair(i, a, b);
    };
    const up = () => { handle.removeEventListener("pointermove", mv); handle.removeEventListener("pointerup", up); handle.removeEventListener("pointercancel", up); };
    handle.addEventListener("pointermove", mv); handle.addEventListener("pointerup", up); handle.addEventListener("pointercancel", up);
  };
  const kids: React.ReactNode[] = [];
  panels.forEach((p, i) => {
    kids.push(<div key={`p${i}`} id={p.props.id} className={cn("min-h-0 min-w-0 shrink-0 grow-0 overflow-auto", p.props.className)} style={{ flexBasis: `${s[i]}%` }}>{p.props.children}</div>);
    if (i < panels.length - 1) {
      const la = lim(i);
      kids.push(
        <div key={`h${i}`} role="separator" tabIndex={0} aria-orientation={vertical ? "horizontal" : "vertical"}
          aria-valuenow={Math.round(s[i]!)} aria-valuemin={la[0]} aria-valuemax={la[1]} aria-label={p.props.label ? `Resize ${p.props.label}` : "Resize panels"}
          onPointerDown={drag(i)} onDoubleClick={() => move(i, (s[i]! + s[i + 1]!) / 2 - s[i]!)}
          onKeyDown={(e) => {
            const rtl = !vertical && directionOf(e.currentTarget, ctxDir) === "rtl";
            const grow = vertical ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight", shrink = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
            const step = e.shiftKey ? 10 : 2;
            if (e.key === grow) { e.preventDefault(); move(i, step); }
            else if (e.key === shrink) { e.preventDefault(); move(i, -step); }
            else if (e.key === "Home") { e.preventDefault(); move(i, la[0] - s[i]!); }
            else if (e.key === "End") { e.preventDefault(); move(i, Math.min(la[1], s[i]! + s[i + 1]! - lim(i + 1)[0]) - s[i]!); }
          }}
          className={cn("relative z-1 flex-none basis-px bg-(--border-secondary) outline-0 hover:bg-(--border-accent-primary) focus-visible:bg-(--border-accent-primary) focus-visible:outline-1 focus-visible:outline-accent-primary",
            "before:absolute before:content-['']", vertical ? "cursor-row-resize before:inset-x-0 before:-inset-y-(--size-xs)" : "cursor-col-resize before:inset-y-0 before:-inset-x-(--size-xs)")}>
          {withHandle ? (
            <span aria-hidden="true" className={cn("absolute top-1/2 left-1/2 inline-flex -translate-1/2 items-center justify-center rounded-sm border border-secondary bg-primary text-icon-tertiary",
              vertical ? "h-(--size-md) w-(--size-xl)" : "h-(--size-xl) w-(--size-md)")}><Grip vertical={vertical} /></span>
          ) : null}
        </div>,
      );
    }
  });
  return <div ref={root} className={cn("flex size-full min-h-0 overflow-hidden", vertical && "flex-col", className)} {...rest}>{kids}</div>;
});
