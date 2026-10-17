import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn.js";
import { XGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";

export interface TourStep {
  /** A selector, ref or element. Leave it out to center the card. */
  target?: string | React.RefObject<HTMLElement | null> | HTMLElement | null;
  title: React.ReactNode;
  body?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  /** Space around the spotlight. Default 4. */
  padding?: number;
}
export interface TourProps {
  steps: TourStep[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  onFinish?: () => void;
  onSkip?: () => void;
  doneLabel?: string;
  skipLabel?: string;
}
type Rect = { top: number; left: number; width: number; height: number };
const resolve = (t: TourStep["target"]) => (typeof t === "string" ? document.querySelector<HTMLElement>(t) : t && "current" in t ? t.current : (t as HTMLElement | null | undefined) ?? null);

/** A short guided walk through a screen: a spotlight on one element and a card that explains it. Escape ends it. */
export function Tour({ steps, open, defaultOpen = false, onOpenChange, step, defaultStep = 0, onStepChange, onFinish, onSkip, doneLabel = "Done", skipLabel = "Skip" }: TourProps) {
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
  const isOpen = open ?? innerOpen;
  const [innerStep, setInnerStep] = React.useState(defaultStep);
  const i = Math.min(step ?? innerStep, steps.length - 1);
  const s = steps[i];
  const setOpen = (o: boolean) => { if (open === undefined) setInnerOpen(o); onOpenChange?.(o); };
  const go = (n: number) => { if (step === undefined) setInnerStep(n); onStepChange?.(n); };
  const [rect, setRect] = React.useState<Rect | null>(null);
  const [pos, setPos] = React.useState({ top: -9999, left: -9999 });
  const card = React.useRef<HTMLDivElement>(null);
  const back = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();

  React.useLayoutEffect(() => {
    if (!isOpen || !s) return;
    const el = resolve(s.target);
    if (el) { const r = el.getBoundingClientRect(); if (r.top < 0 || r.bottom > window.innerHeight) el.scrollIntoView({ block: "center" }); }
    const upd = () => {
      const t = resolve(s.target);
      if (!t) return setRect(null);
      const r = t.getBoundingClientRect(), p = s.padding ?? 4;
      setRect({ top: r.top - p, left: r.left - p, width: r.width + p * 2, height: r.height + p * 2 });
    };
    upd();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(upd) : null;
    ro?.observe(document.body); if (el) ro?.observe(el);
    window.addEventListener("resize", upd); window.addEventListener("scroll", upd, true);
    return () => { ro?.disconnect(); window.removeEventListener("resize", upd); window.removeEventListener("scroll", upd, true); };
  }, [isOpen, i]);

  React.useLayoutEffect(() => {
    if (!isOpen || !rect || !card.current) return;
    const f = card.current, fw = f.offsetWidth, fh = f.offsetHeight, vw = window.innerWidth, vh = window.innerHeight, off = 12;
    let side = s.side ?? "bottom"; const align = s.align ?? "center";
    const bottom = rect.top + rect.height, right = rect.left + rect.width;
    if (side === "bottom" && bottom + off + fh > vh && rect.top - off - fh > 0) side = "top";
    else if (side === "top" && rect.top - off - fh < 0) side = "bottom";
    else if (side === "right" && right + off + fw > vw) side = "left";
    else if (side === "left" && rect.left - off - fw < 0) side = "right";
    let top: number, left: number;
    if (side === "top" || side === "bottom") { top = side === "bottom" ? bottom + off : rect.top - off - fh; left = align === "start" ? rect.left : align === "end" ? right - fw : rect.left + (rect.width - fw) / 2; }
    else { left = side === "right" ? right + off : rect.left - off - fw; top = align === "start" ? rect.top : align === "end" ? bottom - fh : rect.top + (rect.height - fh) / 2; }
    setPos({ top: Math.max(8, Math.min(top, vh - fh - 8)), left: Math.max(8, Math.min(left, vw - fw - 8)) });
  }, [isOpen, rect?.top, rect?.left, rect?.width, rect?.height, i]);

  React.useEffect(() => {
    if (!isOpen) return;
    if (!back.current) back.current = document.activeElement as HTMLElement;
    const raf = requestAnimationFrame(() => card.current?.focus());
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); end(false); } };
    document.addEventListener("keydown", key);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("keydown", key); };
  }, [isOpen, i]);

  function end(done: boolean) {
    setOpen(false);
    (done ? onFinish : onSkip)?.();
    const r = back.current; back.current = null; setTimeout(() => r?.focus?.(), 0);
  }
  if (!isOpen || !s || typeof document === "undefined") return null;
  const last = i === steps.length - 1;
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[60] font-primary">
      {rect ? <div aria-hidden="true" className="fixed rounded-lg shadow-[0_0_0_9999px_var(--bg-overlay-alpha-primary),0_0_0_2px_var(--border-accent-primary)] transition-all duration-(--duration-base) motion-reduce:transition-none" style={rect} />
        : <div aria-hidden="true" className="fixed inset-0 bg-overlay-alpha-primary" />}
      <div key={i} ref={card} role="dialog" aria-modal="false" aria-labelledby={titleId} tabIndex={-1}
        className={cn("pointer-events-auto fixed flex w-80 max-w-[calc(100%-var(--space-base))] flex-col gap-xs rounded-xl border border-secondary bg-elevated p-base text-primary shadow-elevation-xl outline-none",
          rect ? "animate-seed-grow motion-reduce:animate-none" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2")}
        style={rect ? pos : undefined}>
        <div className="-mt-xxs -mr-xxs flex items-center justify-between">
          <span className="mono-label-medium uppercase text-tertiary">{i + 1} of {steps.length}</span>
          <Button variant="ghost" size="sm" icon={<XGlyph />} aria-label="Close tour" onClick={() => end(false)} />
        </div>
        <p id={titleId} className="m-0 label-label-1-semibold">{s.title}</p>
        {s.body ? <div className="text-secondary body-body-3-regular">{s.body}</div> : null}
        <div className="mt-xs flex items-center justify-between gap-sm">
          <div aria-hidden="true" className="flex gap-xxs">{steps.map((_, k) => <span key={k} className={cn("h-(--size-xs) rounded-full transition-[width] duration-(--duration-base)", k === i ? "w-(--size-lg) bg-accent-solid" : "w-(--size-xs) bg-(--border-primary)")} />)}</div>
          <div className="flex gap-xs">
            {i > 0 ? <Button variant="tertiary" size="sm" onClick={() => go(i - 1)}>Back</Button> : <Button variant="ghost" size="sm" onClick={() => end(false)}>{skipLabel}</Button>}
            <Button size="sm" onClick={() => (last ? end(true) : go(i + 1))}>{last ? doneLabel : "Next"}</Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
