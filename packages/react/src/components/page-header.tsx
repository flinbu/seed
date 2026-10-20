import * as React from "react";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { ArrowLeftGlyph } from "../lib/glyphs.js";
import { Link } from "./link.js";

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** The page's one h1. A noun: "Color", "Settings". */
  title: React.ReactNode;
  /** Mono, uppercase, above the title. */
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  /** Badges next to the title. */
  meta?: React.ReactNode;
  /** At most one primary Button. */
  actions?: React.ReactNode;
  /** A Breadcrumb above. */
  breadcrumbs?: React.ReactNode;
  /** A back link instead of breadcrumbs. */
  back?: { label?: string; href?: string; onClick?: (e: React.MouseEvent) => void };
  /** A TabsList under the header. */
  tabs?: React.ReactNode;
  icon?: IconProp;
  /** Sets the title in Fenly Serif, for hero screens and onboarding only. */
  display?: boolean;
}

/** The top of a page: where you are, what this is, and the main actions. */
export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(function PageHeader({ title, eyebrow, description, meta, actions, breadcrumbs, back, tabs, icon, display, className, children, ...rest }, ref) {
  return (
    <header ref={ref} className={cn("flex flex-col gap-sm font-primary", tabs ? "pb-0" : "pb-lg", className)} {...rest}>
      {breadcrumbs}
      {back ? <div><Link href={back.href} onClick={back.onClick} variant="subtle" className="inline-flex items-center gap-xxs body-body-3-regular"><ArrowLeftGlyph size={14} className="rtl:-scale-x-100" />{back.label ?? "Back"}</Link></div> : null}
      <div className="flex flex-wrap items-start gap-base">
        {icon ? <span className="inline-flex size-control-md shrink-0 items-center justify-center rounded-lg border border-secondary bg-primary text-icon-secondary">{renderIcon(icon, "md")}</span> : null}
        <div className="flex min-w-0 flex-[1_1_var(--container-xs)] flex-col gap-xxs">
          {eyebrow ? <p className="m-0 mono-label-medium uppercase text-tertiary">{eyebrow}</p> : null}
          <div className="flex flex-wrap items-center gap-x-sm gap-y-xs">
            <h1 className={cn("m-0 text-primary [overflow-wrap:anywhere]", display ? "display-headline-regular" : "heading-h5-semibold")}>{title}</h1>
            {meta ? <div className="flex flex-wrap items-center gap-xs">{meta}</div> : null}
          </div>
          {description ? <p className="m-0 max-w-prose text-secondary body-body-3-regular">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-xs">{actions}</div> : null}
      </div>
      {children}
      {tabs ? <div className="mt-xs">{tabs}</div> : null}
    </header>
  );
});
