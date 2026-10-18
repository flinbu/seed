import * as React from "react";
import { cn } from "../lib/cn.js";
import { ToggleGroup, ToggleGroupItem } from "./toggle.js";

const glyph = (d: React.ReactNode) => function G() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
};
const MonitorGlyph = glyph(<><rect width="20" height="14" x="2" y="3" rx="2" /><path d="M8 21h8M12 17v4" /></>);
const TabletGlyph = glyph(<><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M12 18h.01" /></>);
const PhoneGlyph = glyph(<><rect width="14" height="20" x="5" y="2" rx="2" /><path d="M12 18h.01" /></>);
const SunGlyph = glyph(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>);
const MoonGlyph = glyph(<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />);

export type StageWidth = "full" | "desktop" | "tablet" | "mobile";
const WIDTHS: Record<StageWidth, { px: number | null; label: string; icon: React.ReactElement }> = {
  full: { px: null, label: "Full width", icon: <MonitorGlyph /> },
  desktop: { px: 1024, label: "Desktop, 1024px", icon: <MonitorGlyph /> },
  tablet: { px: 768, label: "Tablet, 768px", icon: <TabletGlyph /> },
  mobile: { px: 375, label: "Phone, 375px", icon: <PhoneGlyph /> },
};

export interface StageProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  /** Ghost Buttons, such as Show code. */
  actions?: React.ReactNode;
  theme?: "light" | "dark";
  defaultTheme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
  width?: StageWidth;
  defaultWidth?: StageWidth;
  onWidthChange?: (width: StageWidth) => void;
  /** Which preview widths to offer. Default full, tablet, mobile. */
  widths?: StageWidth[];
  /** plain drops the checkerboard. */
  background?: "checker" | "plain";
  /** Minimum height of the canvas. */
  height?: number | string;
  align?: "center" | "start";
  toolbar?: boolean;
}

/** The frame where a component or a customer's design is shown, with a Light and Dark switch that themes only the frame. */
export const Stage = React.forwardRef<HTMLElement, StageProps>(function Stage(
  { title, actions, theme, defaultTheme = "light", onThemeChange, width, defaultWidth = "full", onWidthChange, widths = ["full", "tablet", "mobile"], background = "checker", height, align = "center", toolbar = true, className, children, "aria-label": label, ...rest }, ref) {
  const [innerTheme, setTheme] = React.useState(defaultTheme);
  const [innerWidth, setWidth] = React.useState<StageWidth>(defaultWidth);
  const th = theme ?? innerTheme;
  const w = width ?? innerWidth;
  const px = WIDTHS[w].px;
  return (
    <section ref={ref} aria-label={label ?? (typeof title === "string" ? title : undefined)}
      className={cn("flex flex-col overflow-hidden rounded-petal rounded-tl-petal-tip border border-secondary bg-primary font-primary", className)} {...rest}>
      {toolbar ? (
        <div className="flex min-h-(--size-5xl) flex-wrap items-center justify-between gap-sm border-b border-secondary py-xxs pr-xs pl-base">
          <span className="min-w-0 truncate text-primary label-label-2-medium">{title}</span>
          <span className="inline-flex flex-wrap items-center gap-xs">
            {actions}
            {widths.length > 1 ? (
              <ToggleGroup type="single" size="sm" variant="outline" aria-label="Preview width" allowEmpty={false} value={w}
                onValueChange={(v) => { const n = v as StageWidth; if (width === undefined) setWidth(n); onWidthChange?.(n); }}>
                {widths.map((k) => <ToggleGroupItem key={k} value={k} aria-label={WIDTHS[k].label} icon={WIDTHS[k].icon} />)}
              </ToggleGroup>
            ) : null}
            <ToggleGroup type="single" size="sm" variant="outline" aria-label="Preview theme" allowEmpty={false} value={th}
              onValueChange={(v) => { const n = v as "light" | "dark"; if (theme === undefined) setTheme(n); onThemeChange?.(n); }}>
              <ToggleGroupItem value="light" aria-label="Light" icon={<SunGlyph />} />
              <ToggleGroupItem value="dark" aria-label="Dark" icon={<MoonGlyph />} />
            </ToggleGroup>
          </span>
        </div>
      ) : null}
      <div data-theme={th} style={{ minHeight: height }}
        className={cn("flex flex-1 justify-center overflow-auto p-xl text-primary", background === "plain" ? "bg-stage" : "seed-checker")}>
        <div style={px ? { width: px } : undefined}
          className={cn("flex w-full flex-wrap gap-sm transition-[width] duration-(--duration-slow) motion-reduce:transition-none",
            align === "start" ? "items-start justify-start" : "items-center justify-center",
            px && "max-w-full rounded-lg border border-dashed border-primary bg-primary p-base")}>
          {children}
        </div>
      </div>
    </section>
  );
});
