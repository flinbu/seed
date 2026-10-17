import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { Button } from "./button.js";

type Variant = "neutral" | "info" | "success" | "warning" | "error" | "offer";
const TONE: Record<Variant, [string, string]> = {
  neutral: ["bg-secondary border-secondary", "text-icon-secondary"],
  info: ["bg-info-primary border-info-secondary", "text-icon-info-primary"],
  success: ["bg-success-primary border-success-secondary", "text-icon-success-primary-hover"],
  warning: ["bg-warning-primary border-warning-secondary", "text-icon-warning-primary-hover"],
  error: ["bg-error-primary border-error-secondary", "text-icon-error-primary"],
  offer: ["bg-offer-primary border-offer-secondary", "text-icon-offer-primary-hover"],
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
  title?: React.ReactNode;
  /** Defaults to the variant's icon; false hides it. */
  icon?: IconProp | false;
  /** Usually one or two small Buttons. */
  action?: React.ReactNode;
  /** Shows a close button. */
  onDismiss?: () => void;
  /** Label of the close button. Default 'Dismiss'. */
  dismissLabel?: string;
}

/** A message in the page: what happened and what to do. Errors and warnings are announced. */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert({ variant = "info", title, icon, action, onDismiss, dismissLabel = "Dismiss", className, children, role, ...rest }, ref) {
  const [box, ic] = TONE[variant];
  const shown = icon === false ? null : icon ? renderIcon(icon, "md") : DEFAULT_ICON[variant];
  return (
    <div ref={ref} role={role ?? (variant === "error" || variant === "warning" ? "alert" : "status")}
      className={cn("flex items-start gap-sm border p-base text-primary rounded-petal rounded-tl-petal-tip", box, className)} {...rest}>
      {shown ? <span className={cn("inline-flex leading-none", ic)}>{shown}</span> : null}
      <div className="flex min-w-0 flex-1 flex-col gap-xxs pt-xxxs">
        {title ? <p className="m-0 text-primary label-label-2-semibold">{title}</p> : null}
        {children ? <div className="text-secondary body-body-3-regular">{children}</div> : null}
        {action ? <div className="mt-xs flex gap-xs">{action}</div> : null}
      </div>
      {onDismiss ? (
        <Button variant="ghost" size="sm" aria-label={dismissLabel} onClick={onDismiss} className="-mt-xxs -mr-xxs"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>} />
      ) : null}
    </div>
  );
});
