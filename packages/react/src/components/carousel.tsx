import * as React from "react";
import { cn } from "../lib/cn.js";
import { ChevronLeftGlyph, ChevronRightGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";
import { directionOf, useDirection } from "./direction.js";

export interface CarouselProps extends React.HTMLAttributes<HTMLElement> {
  items?: React.ReactNode[];
  /** Default 1; fractions such as 2.5 show that more is there. */
  slidesPerView?: number;
  loop?: boolean;
  /** false shows "2 / 6" instead of dots. */
  showDots?: boolean;
}

/** A row of slides that scrolls sideways, with Previous and Next. No autoplay. */
export const Carousel = React.forwardRef<HTMLElement, CarouselProps>(function Carousel(
  { items: given, slidesPerView: per = 1, loop, showDots = true, className, children, "aria-label": label = "Carousel", ...rest }, ref) {
  const items = given ?? React.Children.toArray(children);
  const track = React.useRef<HTMLDivElement>(null);
  const [idx, setIdx] = React.useState(0);
  const ctxDir = useDirection();
  const id = React.useId();
  const n = items.length, last = Math.max(0, n - Math.floor(per));
  const rtl = () => directionOf(track.current, ctxDir) === "rtl";
  const go = (target: number) => {
    const t = track.current; if (!t) return;
    const i = loop ? (target + last + 1) % (last + 1) : Math.max(0, Math.min(last, target));
    const slide = t.children[i] as HTMLElement | undefined; if (!slide) return;
    const first = t.children[0] as HTMLElement;
    const left = rtl() ? -(t.clientWidth - slide.offsetLeft - slide.offsetWidth) : slide.offsetLeft - first.offsetLeft;
    t.scrollTo?.({ left, behavior: "smooth" });
    setIdx(i);
  };
  const onScroll = () => {
    const t = track.current; if (!t || !t.children.length) return;
    const first = t.children[0] as HTMLElement;
    const gap = Number.parseFloat(getComputedStyle(t).columnGap) || 0;
    const i = Math.round(Math.abs(t.scrollLeft) / (first.offsetWidth + gap));
    if (i !== idx) setIdx(Math.max(0, Math.min(last, i)));
  };
  return (
    <section ref={ref} aria-roledescription="carousel" aria-label={label} className={cn("flex min-w-0 flex-col gap-sm", className)} {...rest}>
      <div ref={track} id={id} tabIndex={0} onScroll={onScroll} aria-live="polite"
        style={{ "--seed-per": per } as React.CSSProperties}
        onKeyDown={(e) => {
          const fwd = rtl() ? "ArrowLeft" : "ArrowRight", back = rtl() ? "ArrowRight" : "ArrowLeft";
          if (e.key === fwd) { e.preventDefault(); go(idx + 1); } else if (e.key === back) { e.preventDefault(); go(idx - 1); }
        }}
        className="flex snap-x snap-mandatory gap-sm overflow-x-auto overscroll-x-contain rounded-lg outline-0 [scrollbar-width:none] motion-safe:scroll-smooth focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary [&::-webkit-scrollbar]:hidden">
        {items.map((it, i) => (
          <div key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`}
            className="min-w-0 flex-[0_0_calc((100%-var(--space-sm)*(var(--seed-per)-1))/var(--seed-per))] snap-start">{it}</div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-sm">
        <Button variant="secondary" size="sm" icon={<ChevronLeftGlyph className="rtl:-scale-x-100" />} aria-label="Previous slide" aria-controls={id} disabled={!loop && idx <= 0} onClick={() => go(idx - 1)} />
        {showDots && last > 0 ? (
          <div role="group" aria-label="Choose slide" className="inline-flex gap-xxs">
            {Array.from({ length: last + 1 }, (_, i) => (
              <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} aria-current={i === idx ? "true" : undefined} onClick={() => go(i)}
                className={cn("relative h-(--size-sm) cursor-pointer rounded-full border-0 p-0 transition-[width,background-color] duration-(--duration-base) after:absolute after:-inset-(--size-sm) after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-primary motion-reduce:transition-none",
                  i === idx ? "w-(--size-xl) bg-(--text-primary)" : "w-(--size-sm) bg-(--border-primary)")} />
            ))}
          </div>
        ) : <span className="text-secondary tabular-nums label-label-3-medium">{idx + 1} / {last + 1}</span>}
        <Button variant="secondary" size="sm" icon={<ChevronRightGlyph className="rtl:-scale-x-100" />} aria-label="Next slide" aria-controls={id} disabled={!loop && idx >= last} onClick={() => go(idx + 1)} />
      </div>
    </section>
  );
});
