import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { XGlyph } from "../lib/glyphs.js";
import { LOUD_BORDER, TONE_LABEL, liveRole, type Emphasis, type MessageTone } from "../lib/tone.js";
import { Button } from "./button.js";

type Variant = MessageTone | "inverse";
/** Only the icon carries the tone; the bar stays on the page's neutral surface. inverse is a black bar for product news. */
const ICON_TONE: Record<Variant, string> = {
  info: "text-icon-info-primary",
  neutral: "text-icon-secondary",
  success: "text-icon-success-primary-hover",
  warning: "text-icon-warning-primary-hover",
  error: "text-icon-error-primary",
  offer: "text-icon-offer-primary-hover",
  inverse: "text-on-dark-color",
};
const svg = (d: React.ReactNode) => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
const ICON: Record<Variant, React.ReactElement | null> = {
  info: svg(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>), neutral: svg(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>),
  success: svg(<><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>), error: svg(<><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>),
  warning: svg(<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4M12 17h.01" /></>), offer: null, inverse: null,
};

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: Variant;
  /** subtle (default): the page's neutral surface, only the icon is in color. loud: the bottom hairline takes the tone, for a sync that failed or a blocking error. inverse ignores it. */
  emphasis?: Emphasis;
  /** A bold lead-in, ending with a period. */
  title?: React.ReactNode;
  icon?: IconProp | false;
  /** One small secondary Button. */
  action?: React.ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Stays at the top while the page scrolls. */
  sticky?: boolean;
  /** Set when the banner appears after the page has loaded: it's announced as a status, or as an alert for errors. Banners rendered with the page have no live role. */
  live?: boolean;
  /** Visually hidden word read before the message: 'Info', 'Success', 'Warning' or 'Error' by default (none for neutral, offer and inverse). Translate it here, or pass false to leave it out. */
  toneLabel?: string | false;
}

/** One message about the whole app or page, edge to edge: a paused sync, a read-only version, a trial ending. Quiet by default; loud when it must stand out. */
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(function Banner({ variant = "info", emphasis = "subtle", title, icon, action, onDismiss, dismissLabel = "Dismiss", sticky, live, toneLabel, className, children, role, ...rest }, ref) {
  const inverse = variant === "inverse";
  const shown = icon === false ? null : icon ? renderIcon(icon, "sm") : ICON[variant];
  const label = toneLabel === false ? null : toneLabel ?? (inverse ? undefined : TONE_LABEL[variant]) ?? null;
  const box = inverse ? "bg-black-solid border-transparent text-on-dark-color" : cn("bg-primary text-primary", emphasis === "loud" ? LOUD_BORDER[variant] : "border-secondary");
  return (
    <div ref={ref} role={role ?? liveRole(variant, live)} data-variant={variant} data-emphasis={emphasis}
      className={cn("flex min-h-control-md w-full items-center gap-xs border-b py-xs pr-xs pl-base font-primary", box, sticky && "sticky top-0 z-30", className)} {...rest}>
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-sm gap-y-xs text-center">
        {shown ? <span className={cn("inline-flex leading-none", ICON_TONE[variant])}>{shown}</span> : null}
        <p className={cn("m-0 body-body-3-regular", !inverse && "[&_a]:text-accent-primary [&_a:hover]:text-accent-primary-hover")}>{label ? <span className="sr-only">{label}: </span> : null}{title ? <strong className="label-label-2-semibold">{title} </strong> : null}{children}</p>
        {action ? <div className="flex gap-xs">{action}</div> : null}
      </div>
      {onDismiss ? <Button variant="ghost" size="sm" icon={<XGlyph />} aria-label={dismissLabel} onClick={onDismiss} className={inverse ? "text-on-dark-color" : undefined} /> : null}
    </div>
  );
});
