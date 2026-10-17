import * as React from "react";
import { DropdownMenu as M } from "radix-ui";
import { cn } from "../lib/cn.js";
import { floatingPanel, menuIcon, menuItem, menuLabel, menuSeparator, menuShortcut } from "../lib/floating.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { CheckGlyph, ChevronRightGlyph, DotGlyph } from "../lib/glyphs.js";

/** A list of commands that opens from a button: row actions, overflow menus, "More". Use Select to pick a value. */
export const DropdownMenu = M.Root;
/** Wraps your trigger (usually a Seed Button) with asChild. */
export const DropdownMenuTrigger = M.Trigger;
export const DropdownMenuGroup = M.Group;
export const DropdownMenuRadioGroup = M.RadioGroup;
export const DropdownMenuSub = M.Sub;

export interface DropdownMenuContentProps extends React.ComponentPropsWithoutRef<typeof M.Content> {}
export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(function DropdownMenuContent({ className, align = "start", sideOffset = 6, collisionPadding = 8, ...rest }, ref) {
  return (
    <M.Portal>
      <M.Content ref={ref} align={align} sideOffset={sideOffset} collisionPadding={collisionPadding}
        className={cn(floatingPanel, "min-w-48 max-h-(--radix-dropdown-menu-content-available-height) overflow-y-auto p-xxs origin-(--radix-dropdown-menu-content-transform-origin)", className)} {...rest} />
    </M.Portal>
  );
});

export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<typeof M.Item> {
  icon?: IconProp;
  /** Shown at the end, like "⌘D". Display only: wire the shortcut yourself. */
  shortcut?: React.ReactNode;
  /** Red, for actions that delete or can't be undone. */
  destructive?: boolean;
}
export const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(function DropdownMenuItem({ icon, shortcut, destructive, className, children, ...rest }, ref) {
  return (
    <M.Item ref={ref} className={cn(menuItem, destructive && "text-error-primary data-[highlighted]:bg-error-primary", className)} {...rest}>
      {icon ? <span className={cn(menuIcon, destructive && "text-icon-error-primary")}>{renderIcon(icon, "sm")}</span> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {shortcut ? <span className={menuShortcut}>{shortcut}</span> : null}
    </M.Item>
  );
});

export const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.CheckboxItem>>(function DropdownMenuCheckboxItem({ className, children, ...rest }, ref) {
  return (
    <M.CheckboxItem ref={ref} className={cn(menuItem, className)} {...rest}>
      <span className="inline-flex size-(--size-lg) shrink-0 items-center justify-center text-icon-accent-primary-hover"><M.ItemIndicator><CheckGlyph /></M.ItemIndicator></span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </M.CheckboxItem>
  );
});

export const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.RadioItem>>(function DropdownMenuRadioItem({ className, children, ...rest }, ref) {
  return (
    <M.RadioItem ref={ref} className={cn(menuItem, className)} {...rest}>
      <span className="inline-flex size-(--size-lg) shrink-0 items-center justify-center text-icon-accent-primary-hover"><M.ItemIndicator><DotGlyph size={12} /></M.ItemIndicator></span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </M.RadioItem>
  );
});

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.Label>>(function DropdownMenuLabel({ className, ...rest }, ref) {
  return <M.Label ref={ref} className={cn(menuLabel, className)} {...rest} />;
});
export const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.Separator>>(function DropdownMenuSeparator({ className, ...rest }, ref) {
  return <M.Separator ref={ref} className={cn(menuSeparator, className)} {...rest} />;
});

export interface DropdownMenuSubTriggerProps extends React.ComponentPropsWithoutRef<typeof M.SubTrigger> { icon?: IconProp }
export const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, DropdownMenuSubTriggerProps>(function DropdownMenuSubTrigger({ icon, className, children, ...rest }, ref) {
  return (
    <M.SubTrigger ref={ref} className={cn(menuItem, "data-[state=open]:bg-tertiary", className)} {...rest}>
      {icon ? <span className={menuIcon}>{renderIcon(icon, "sm")}</span> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ChevronRightGlyph className="ml-auto text-icon-tertiary rtl:-scale-x-100" />
    </M.SubTrigger>
  );
});
export const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.SubContent>>(function DropdownMenuSubContent({ className, sideOffset = 4, collisionPadding = 8, ...rest }, ref) {
  return (
    <M.Portal>
      <M.SubContent ref={ref} sideOffset={sideOffset} collisionPadding={collisionPadding}
        className={cn(floatingPanel, "min-w-48 p-xxs origin-(--radix-dropdown-menu-content-transform-origin)", className)} {...rest} />
    </M.Portal>
  );
});
