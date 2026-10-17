import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Defaults to an inbox; false hides it. */
  icon?: IconProp | false;
  /** What is missing. */
  title?: React.ReactNode;
  /** Why, or how to fill it. */
  description?: React.ReactNode;
  /** One primary Button, optionally a secondary one. */
  actions?: React.ReactNode;
  /** md for pages and cards, sm inside tables, popovers and narrow panels. */
  size?: "sm" | "md";
}
const INBOX = <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>;

export function EmptyState({ icon, title, description, actions, size = "md", className, ...rest }: EmptyStateProps) {
  const sm = size === "sm";
  return (
    <div className={cn("flex flex-col items-center text-center", sm ? "gap-xxs px-base py-lg" : "gap-xs px-lg py-3xl", className)} {...rest}>
      {icon === false ? null : (
        <span className={cn("inline-flex items-center justify-center rounded-full bg-tertiary text-icon-secondary", sm ? "mb-xxs size-(--size-4xl)" : "mb-xs size-(--size-5xl)")}>
          {icon ? renderIcon(icon, sm ? "md" : "lg") : INBOX}
        </span>
      )}
      {title ? <p className={cn("m-0 text-primary text-balance", sm ? "label-label-1-semibold" : "display-headline-regular")}>{title}</p> : null}
      {description ? <p className="m-0 max-w-[40ch] text-secondary body-body-3-regular">{description}</p> : null}
      {actions ? <div className="mt-xs flex flex-wrap justify-center gap-xs">{actions}</div> : null}
    </div>
  );
}
