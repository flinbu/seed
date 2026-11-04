import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { LOUD_BORDER, TONE_LABEL, liveRole, type Emphasis, type MessageTone } from "../lib/tone.js";
import { Button } from "./button.js";

type Variant = MessageTone;
/** Only the icon carries the tone; the surface, title and body stay neutral. */
const ICON_TONE: Record<Variant, string> = {
  neutral: "text-icon-secondary",
  info: "text-icon-info-primary",
  success: "text-icon-success-primary-hover",
  warning: "text-icon-warning-primary-hover",
  error: "text-icon-error-primary",
  offer: "text-icon-offer-primary-hover",
};
const svg = (d: React.ReactNode) => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
const DEFAULT_ICON: Record<Variant, React.ReactElement> = {
  neutral: svg(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>),
  info: svg(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>),
  success: svg(<><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>),
  warning: svg(<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4M12 17h.01" /></>),
  error: svg(<><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>),
  offer: svg(<><path d="M12 2 15 8.5 22 9.5 17 14.5 18 21.5 12 18 6 21.5 7 14.5 2 9.5 9 8.5z" /></>),
};

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Default 'info'. */
  variant?: Variant;
  /** subtle (default): a neutral surface, only the icon is in color. loud: the same surface with a hairline in the tone, for the few alerts that must stand out. */
  emphasis?: Emphasis;
  title?: React.ReactNode;
  /** Defaults to the variant's icon; false hides it. */
  icon?: IconProp | false;
  /** Usually one or two small Buttons. */
  action?: React.ReactNode;
  /** Shows a close button. */
  onDismiss?: () => void;
  /** Label of the close button. Default 'Dismiss'. */
  dismissLabel?: string;
  /** Set when the alert appears after the page has loaded (after an action, a sync, a failed request): it's announced as a status, or as an alert for errors. Alerts rendered with the page have no live role. */
  live?: boolean;
  /** Visually hidden word read before the message: 'Info', 'Success', 'Warning' or 'Error' by default (none for neutral and offer). Translate it here, or pass false to leave it out. */
  toneLabel?: string | false;
}

/** A message in the page: what happened and what to do. Quiet by default; loud for the few that must stand out. */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert({ variant = "info", emphasis = "subtle", title, icon, action, onDismiss, dismissLabel = "Dismiss", live, toneLabel, className, children, role, ...rest }, ref) {
  const shown = icon === false ? null : icon ? renderIcon(icon, "md") : DEFAULT_ICON[variant];
  const label = toneLabel === false ? null : toneLabel ?? TONE_LABEL[variant] ?? null;
  return (
    <div ref={ref} role={role ?? liveRole(variant, live)} data-variant={variant} data-emphasis={emphasis}
      className={cn("flex items-start gap-sm border bg-primary p-base text-primary rounded-petal rounded-tl-petal-tip", emphasis === "loud" ? LOUD_BORDER[variant] : "border-secondary", className)} {...rest}>
      {shown ? <span className={cn("inline-flex leading-none", ICON_TONE[variant])}>{shown}</span> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-xxs pt-xxxs">
        {title ? <p className="m-0 text-primary label-label-2-semibold">{label ? <span className="sr-only">{label}: </span> : null}{title}</p> : null}
        {children ? <div className="text-secondary body-body-3-regular [&_a]:text-accent-primary [&_a:hover]:text-accent-primary-hover">{label && !title ? <span className="sr-only">{label}: </span> : null}{children}</div> : null}
        {action ? <div className="mt-xs flex gap-xs">{action}</div> : null}
      </div>
      {onDismiss ? (
        <Button variant="ghost" size="sm" aria-label={dismissLabel} onClick={onDismiss} className="-mt-xxs -mr-xxs"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>} />
      ) : null}
    </div>
  );
});
