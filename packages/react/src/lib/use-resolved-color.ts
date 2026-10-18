import * as React from "react";
import { parseColor, type RGBA } from "./color.js";

/* Re-measures when a theme changes anywhere on the page (data-theme, data-brand or class), even outside React. */
let subs: Array<() => void> = [];
let observer: MutationObserver | null = null;
export function useThemeTick(): number {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const bump = () => setTick((n) => n + 1);
    subs.push(bump);
    if (!observer && typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(() => subs.forEach((f) => f()));
      observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ["data-theme", "data-brand", "class"] });
    }
    return () => { subs = subs.filter((f) => f !== bump); if (!subs.length && observer) { observer.disconnect(); observer = null; } };
  }, []);
  return tick;
}

/** The color the browser actually paints for an element, so token values follow the theme they sit in. */
export function useResolvedColor(ref: React.RefObject<HTMLElement | null>, prop: "backgroundColor" | "color" = "backgroundColor"): RGBA | null {
  const [c, setC] = React.useState<RGBA | null>(null);
  const tick = useThemeTick();
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const next = parseColor(getComputedStyle(el)[prop]);
    setC((p) => (p && next && p.r === next.r && p.g === next.g && p.b === next.b && p.a === next.a ? p : next));
  });
  void tick;
  return c;
}
