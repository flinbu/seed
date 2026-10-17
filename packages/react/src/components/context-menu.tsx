import * as React from "react";
import { ContextMenu as M } from "radix-ui";
import { cn } from "../lib/cn.js";
import { floatingPanel, menuIcon, menuItem, menuLabel, menuSeparator, menuShortcut } from "../lib/floating.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { CheckGlyph, ChevronRightGlyph, DotGlyph } from "../lib/glyphs.js";

/** Commands on right-click (or long press). Only repeat commands that are reachable elsewhere: many people never right-click. */
export const ContextMenu = M.Root;
/** The area that opens the menu on right-click. */
export const ContextMenuTrigger = M.Trigger;
export const ContextMenuGroup = M.Group;
export const ContextMenuRadioGroup = M.RadioGroup;
export const ContextMenuSub = M.Sub;

export interface ContextMenuContentProps extends React.ComponentPropsWithoutRef<typeof M.Content> {}
export const ContextMenuContent = React.forwardRef<HTMLDivElement, ContextMenuContentProps>(function ContextMenuContent({ className, collisionPadding = 8, ...rest }, ref) {
  return (
    <M.Portal>
      <M.Content ref={ref} collisionPadding={collisionPadding}
        className={cn(floatingPanel, "min-w-48 max-h-(--radix-context-menu-content-available-height) overflow-y-auto p-xxs origin-(--radix-context-menu-content-transform-origin)", className)} {...rest} />
    </M.Portal>
  );
});

export interface ContextMenuItemProps extends React.ComponentPropsWithoutRef<typeof M.Item> {
  icon?: IconProp;
  /** Shown at the end, like "⌘D". Display only: wire the shortcut yourself. */
  shortcut?: React.ReactNode;
  /** Red, for actions that delete or can't be undone. */
  destructive?: boolean;
}
export const ContextMenuItem = React.forwardRef<HTMLDivElement, ContextMenuItemProps>(function ContextMenuItem({ icon, shortcut, destructive, className, children, asChild, ...rest }, ref) {
  const cls = cn(menuItem, "no-underline", destructive && "text-error-primary data-[highlighted]:bg-error-primary", className);
  // asChild: your element (a link) becomes the row; it keeps the row's look but brings its own content.
  if (asChild) return <M.Item ref={ref} asChild className={cls} {...rest}>{children}</M.Item>;
  return (
    <M.Item ref={ref} className={cls} {...rest}>
      {icon ? <span className={cn(menuIcon, destructive && "text-icon-error-primary")}>{renderIcon(icon, "sm")}</span> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut ? <span className={menuShortcut}>{shortcut}</span> : null}
    </M.Item>
  );
});

export const ContextMenuCheckboxItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.CheckboxItem>>(function ContextMenuCheckboxItem({ className, children, ...rest }, ref) {
  return (
    <M.CheckboxItem ref={ref} className={cn(menuItem, className)} {...rest}>
      <span className="inline-flex size-(--size-lg) shrink-0 items-center justify-center text-icon-accent-primary-hover"><M.ItemIndicator><CheckGlyph /></M.ItemIndicator></span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </M.CheckboxItem>
  );
});

export const ContextMenuRadioItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.RadioItem>>(function ContextMenuRadioItem({ className, children, ...rest }, ref) {
  return (
    <M.RadioItem ref={ref} className={cn(menuItem, className)} {...rest}>
      <span className="inline-flex size-(--size-lg) shrink-0 items-center justify-center text-icon-accent-primary-hover"><M.ItemIndicator><DotGlyph size={12} /></M.ItemIndicator></span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </M.RadioItem>
  );
});

export const ContextMenuLabel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.Label>>(function ContextMenuLabel({ className, ...rest }, ref) {
  return <M.Label ref={ref} className={cn(menuLabel, className)} {...rest} />;
});
export const ContextMenuSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.Separator>>(function ContextMenuSeparator({ className, ...rest }, ref) {
  return <M.Separator ref={ref} className={cn(menuSeparator, className)} {...rest} />;
});

export interface ContextMenuSubTriggerProps extends React.ComponentPropsWithoutRef<typeof M.SubTrigger> { icon?: IconProp }
export const ContextMenuSubTrigger = React.forwardRef<HTMLDivElement, ContextMenuSubTriggerProps>(function ContextMenuSubTrigger({ icon, className, children, ...rest }, ref) {
  return (
    <M.SubTrigger ref={ref} className={cn(menuItem, "data-[state=open]:bg-tertiary", className)} {...rest}>
      {icon ? <span className={menuIcon}>{renderIcon(icon, "sm")}</span> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ChevronRightGlyph className="ml-auto text-icon-tertiary rtl:-scale-x-100" />
    </M.SubTrigger>
  );
});
export const ContextMenuSubContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.SubContent>>(function ContextMenuSubContent({ className, sideOffset = 4, collisionPadding = 8, ...rest }, ref) {
  return (
    <M.Portal>
      <M.SubContent ref={ref} sideOffset={sideOffset} collisionPadding={collisionPadding}
        className={cn(floatingPanel, "min-w-48 p-xxs origin-(--radix-context-menu-content-transform-origin)", className)} {...rest} />
    </M.Portal>
  );
});
