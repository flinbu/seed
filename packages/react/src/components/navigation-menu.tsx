import * as React from "react";
import { NavigationMenu as N } from "radix-ui";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { ChevronDownGlyph } from "../lib/glyphs.js";

export interface NavigationLink { label: React.ReactNode; href: string; description?: React.ReactNode; icon?: IconProp }
export type NavigationItem =
  | { label: React.ReactNode; value?: string; href: string; current?: boolean }
  | { label: React.ReactNode; value?: string; links: NavigationLink[]; columns?: 1 | 2; footer?: React.ReactNode };
export interface NavigationMenuProps extends Omit<React.ComponentPropsWithoutRef<typeof N.Root>, "children"> {
  items: NavigationItem[];
  /** Renders links: pass your router's Link. Default <a>. */
  linkAs?: React.ElementType;
}

const trigger = cn("group inline-flex h-control-sm cursor-pointer items-center gap-xxs rounded-control border-0 bg-transparent px-sm font-primary text-secondary no-underline label-label-2-medium outline-none",
  "transition-colors duration-(--duration-fast) hover:bg-tertiary hover:text-primary data-[state=open]:bg-tertiary data-[state=open]:text-primary data-[active]:text-primary",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary");

/** Site navigation: links and panels of links, like a marketing header. In the app, use the Sidebar. */
export const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(function NavigationMenu({ items, linkAs: L = "a", className, "aria-label": label = "Main", ...rest }, ref) {
  return (
    <N.Root ref={ref} aria-label={label} className={cn("relative z-10 flex", className)} {...rest}>
      <N.List className="m-0 flex list-none items-center gap-xxxs p-0">
        {items.map((it, i) => (
          <N.Item key={it.value ?? i} value={it.value}>
            {"links" in it ? (
              <>
                <N.Trigger className={trigger}>{it.label}<ChevronDownGlyph size={12} className="text-icon-tertiary transition-transform duration-(--duration-fast) group-data-[state=open]:rotate-180" /></N.Trigger>
                <N.Content className="absolute top-0 left-0 w-full data-[motion]:animate-seed-fade-in motion-reduce:animate-none sm:w-auto">
                  <ul className={cn("m-0 grid list-none gap-xxs p-xs", it.columns === 2 ? "sm:w-[calc(var(--container-md)+var(--space-2xl))] sm:grid-cols-2" : "sm:w-(--container-xs)")}>
                    {it.links.map((l, k) => (
                      <li key={k}>
                        <N.Link asChild>
                          <L href={l.href} className="flex gap-sm rounded-md p-sm text-primary no-underline outline-none hover:bg-secondary-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-primary">
                            {l.icon ? <span className="inline-flex size-control-sm shrink-0 items-center justify-center rounded-md border border-secondary bg-secondary text-icon-secondary">{renderIcon(l.icon, "sm")}</span> : null}
                            <span className="flex min-w-0 flex-col gap-px"><span className="label-label-2-medium">{l.label}</span>{l.description ? <span className="text-secondary body-body-4-regular">{l.description}</span> : null}</span>
                          </L>
                        </N.Link>
                      </li>
                    ))}
                  </ul>
                  {it.footer ? <div className="border-t border-secondary bg-secondary px-base py-sm text-secondary body-body-4-regular">{it.footer}</div> : null}
                </N.Content>
              </>
            ) : (
              <N.Link asChild active={it.current}><L href={it.href} aria-current={it.current ? "page" : undefined} className={trigger}>{it.label}</L></N.Link>
            )}
          </N.Item>
        ))}
      </N.List>
      <div className="absolute top-full left-0 flex justify-center pt-xs">
        <N.Viewport className="relative h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-lg border border-secondary bg-elevated shadow-elevation-lg transition-[width,height] duration-(--duration-base) data-[state=open]:animate-seed-grow motion-reduce:animate-none sm:w-(--radix-navigation-menu-viewport-width)" />
      </div>
    </N.Root>
  );
});
