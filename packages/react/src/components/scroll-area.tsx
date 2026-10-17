import * as React from "react";
import { ScrollArea as S } from "radix-ui";
import { cn } from "../lib/cn.js";

export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<typeof S.Root> {
  /** Which scrollbars to show. Default 'vertical'. */
  orientation?: "vertical" | "horizontal" | "both";
  /** Classes for the scrolling viewport (set its max height here or on the root). */
  viewportClassName?: string;
  /** Names the region so keyboard users can find it. */
  "aria-label"?: string;
}

/** Native scrolling with Seed's thin scrollbars. The viewport is focusable so it scrolls with the keyboard. */
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea({ orientation = "vertical", viewportClassName, className, children, "aria-label": label, ...rest }, ref) {
  const bar = (o: "vertical" | "horizontal") => (
    <S.Scrollbar orientation={o} className={cn("flex touch-none p-px transition-colors duration-(--duration-fast) select-none", o === "vertical" ? "h-full w-(--size-sm)" : "h-(--size-sm) flex-col")}>
      <S.Thumb className="relative flex-1 rounded-full bg-(--border-primary) hover:bg-(--icon-tertiary)" />
    </S.Scrollbar>
  );
  return (
    <S.Root ref={ref} type="hover" className={cn("relative overflow-hidden", className)} {...rest}>
      <S.Viewport tabIndex={0} role={label ? "region" : undefined} aria-label={label}
        className={cn("size-full rounded-[inherit] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-primary [&>div]:block!", viewportClassName)}>{children}</S.Viewport>
      {orientation !== "horizontal" ? bar("vertical") : null}
      {orientation !== "vertical" ? bar("horizontal") : null}
      <S.Corner />
    </S.Root>
  );
});
