import * as React from "react";
import { AspectRatio as AR } from "radix-ui";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";

export interface ItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** An icon (drawn in a tile) or an element such as an Avatar. */
  media?: IconProp | React.ReactNode;
  /** Buttons at the end; they stay separate targets from the row link. */
  actions?: React.ReactNode;
  /** Makes the title a link that covers the row. */
  href?: string;
  variant?: "plain" | "outline" | "muted";
  size?: "sm" | "md";
  selected?: boolean;
}

const InGroup = React.createContext(false);

/** One row for one thing: an integration, a member, a file, a setting. */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>(function Item({ title, description, media, actions, href, variant = "plain", size = "md", selected, className, ...rest }, ref) {
  const inGroup = React.useContext(InGroup);
  const isIcon = media && (typeof media === "function" || (React.isValidElement(media) && typeof (media as any).type !== "string" && !(media as any).props?.name && !(media as any).props?.src));
  return (
    <div ref={ref} role={inGroup ? "listitem" : undefined} className={cn("group relative flex min-w-0 items-center rounded-lg font-primary", size === "sm" ? "gap-sm px-sm py-xs" : "gap-base p-base",
      variant === "outline" && "border border-secondary bg-primary", variant === "muted" && "bg-secondary",
      href && "hover:bg-secondary-hover has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent-primary", selected && "bg-selected", className)} {...rest}>
      {media ? (isIcon
        ? <span className={cn("inline-flex shrink-0 items-center justify-center rounded-md border border-secondary bg-secondary text-icon-secondary", size === "sm" ? "size-control-sm" : "size-control-md")}>{renderIcon(media as IconProp, size === "sm" ? "sm" : "md")}</span>
        : <span className="inline-flex shrink-0">{media as React.ReactNode}</span>) : null}
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        {href ? <a href={href} className="truncate text-primary no-underline outline-none label-label-2-medium after:absolute after:inset-0 after:rounded-lg">{title}</a>
          : <span className="truncate text-primary label-label-2-medium">{title}</span>}
        {description ? <span className="text-secondary body-body-3-regular">{description}</span> : null}
      </div>
      {actions ? <div className="relative z-[1] flex shrink-0 items-center gap-xs">{actions}</div> : null}
    </div>
  );
});

export const ItemGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { divided?: boolean }>(function ItemGroup({ divided = true, className, ...rest }, ref) {
  return <InGroup.Provider value><div ref={ref} role="list" className={cn("flex flex-col", divided && "divide-y divide-(--border-secondary)", "[&>*]:rounded-none", className)} {...rest} /></InGroup.Provider>;
});

export interface AspectRatioProps extends React.ComponentPropsWithoutRef<typeof AR.Root> {}
/** Keeps media at a fixed shape while it loads: thumbnails, previews, embeds. Default 16/9. */
export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio({ ratio = 16 / 9, className, ...rest }, ref) {
  return <AR.Root ref={ref} ratio={ratio} className={cn("overflow-hidden rounded-lg bg-secondary", className)} {...rest} />;
});
