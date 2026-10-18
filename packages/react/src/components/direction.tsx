import * as React from "react";
import { cn } from "../lib/cn.js";

export type Direction = "ltr" | "rtl";
const DirCtx = React.createContext<Direction>("ltr");

export interface DirectionProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ltr (default) or rtl. */
  dir?: Direction;
  /** false sets the context without a wrapper; put dir on <html> yourself. */
  wrap?: boolean;
}

/** Sets the reading direction for everything inside it. */
export function DirectionProvider({ dir = "ltr", wrap = true, className, children, ...rest }: DirectionProviderProps) {
  return <DirCtx.Provider value={dir}>{wrap ? <div dir={dir} className={cn("contents", className)} {...rest}>{children}</div> : children}</DirCtx.Provider>;
}
/** The current reading direction, for your own components. */
export const useDirection = () => React.useContext(DirCtx);
/** The direction an element actually sits in: its nearest dir attribute, else the context. */
export function directionOf(el: Element | null | undefined, fallback: Direction = "ltr"): Direction {
  const d = el?.closest?.("[dir]");
  return d ? (d.getAttribute("dir") === "rtl" ? "rtl" : "ltr") : fallback;
}
