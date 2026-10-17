import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { XGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";

type Variant = "info" | "neutral" | "success" | "warning" | "error" | "offer" | "inverse";
const TONE: Record<Variant, [string, string]> = {
  info: ["bg-info-primary border-info-secondary", "text-icon-info-primary"],
  neutral: ["bg-secondary border-secondary", "text-icon-secondary"],
  success: ["bg-success-primary border-success-secondary", "text-icon-success-primary-hover"],
  warning: ["bg-warning-primary border-warning-secondary", "text-icon-warning-primary-hover"],
  error: ["bg-error-primary border-error-secondary", "text-icon-error-primary"],
  offer: ["bg-offer-primary border-offer-secondary", "text-icon-offer-primary-hover"],
  inverse: ["bg-black-solid border-transparent text-on-dark-color", "text-on-dark-color"],
};
const svg = (d: React.ReactNode) => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
const ICON: Record<Variant, React.ReactElement | null> = {
  info: svg(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>), neutral: svg(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>),
  success: svg(<><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>), error: svg(<><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>),
  warning: svg(<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4M12 17h.01" /></>), offer: null, inverse: null,
};

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: Variant;
  /** A bold lead-in, ending with a period. */
  title?: React.ReactNode;
  icon?: IconProp | false;
  /** One small secondary Button. */
  action?: React.ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  /** Stays at the top while the page scrolls. */
  sticky?: boolean;
}

/** One message about the whole app or page, edge to edge: a paused sync, a read-only version, a trial ending. */
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(function Banner({ variant = "info", title, icon, action, onDismiss, dismissLabel = "Dismiss", sticky, className, children, role, ...rest }, ref) {
  const [box, ic] = TONE[variant];
  const shown = icon === false ? null : icon ? renderIcon(icon, "sm") : ICON[variant];
  return (
    <div ref={ref} role={role ?? (variant === "error" || variant === "warning" ? "alert" : "status")}
      className={cn("flex min-h-control-md w-full items-center gap-xs border-b py-xs pr-xs pl-base text-primary font-primary", box, sticky && "sticky top-0 z-30", className)} {...rest}>
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-sm gap-y-xs text-center">
        {shown ? <span className={cn("inline-flex leading-none", ic)}>{shown}</span> : null}
        <p className="m-0 body-body-3-regular">{title ? <strong className="label-label-2-semibold">{title} </strong> : null}{children}</p>
        {action ? <div className="flex gap-xs">{action}</div> : null}
      </div>
      {onDismiss ? <Button variant="ghost" size="sm" icon={<XGlyph />} aria-label={dismissLabel} onClick={onDismiss} className={variant === "inverse" ? "text-on-dark-color" : undefined} /> : null}
    </div>
  );
});
