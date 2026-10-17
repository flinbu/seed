import * as React from "react";
import { Menubar as M } from "radix-ui";
import { cn } from "../lib/cn.js";
import { floatingPanel, menuIcon, menuItem, menuLabel, menuSeparator, menuShortcut } from "../lib/floating.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { CheckGlyph, ChevronRightGlyph, DotGlyph } from "../lib/glyphs.js";

/** Desktop-style menus in a row: File, Edit, View. Arrow keys move between menus. Keep it for editors and canvases. */
export const Menubar = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.Root>>(function Menubar({ className, ...rest }, ref) {
  return <M.Root ref={ref} className={cn("inline-flex h-control-md items-center gap-px rounded-lg border border-secondary bg-primary p-xxxs", className)} {...rest} />;
});
export const MenubarMenu: React.FC<React.ComponentProps<typeof M.Menu>> = M.Menu;
export const MenubarTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof M.Trigger>>(function MenubarTrigger({ className, ...rest }, ref) {
  return <M.Trigger ref={ref} className={cn("inline-flex h-control-sm cursor-pointer items-center rounded-md border-0 bg-transparent px-sm font-primary text-primary label-label-2-medium outline-none",
    "hover:bg-tertiary data-[state=open]:bg-tertiary data-[highlighted]:bg-tertiary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-primary", className)} {...rest} />;
});
export const MenubarGroup = M.Group;
export const MenubarRadioGroup = M.RadioGroup;
export const MenubarSub = M.Sub;

export interface MenubarContentProps extends React.ComponentPropsWithoutRef<typeof M.Content> {}
export const MenubarContent = React.forwardRef<HTMLDivElement, MenubarContentProps>(function MenubarContent({ className, align = "start", sideOffset = 6, alignOffset = -2, collisionPadding = 8, ...rest }, ref) {
  return (
    <M.Portal>
      <M.Content ref={ref} align={align} sideOffset={sideOffset} alignOffset={alignOffset} collisionPadding={collisionPadding}
        className={cn(floatingPanel, "min-w-48 max-h-(--radix-menubar-content-available-height) overflow-y-auto p-xxs origin-(--radix-menubar-content-transform-origin)", className)} {...rest} />
    </M.Portal>
  );
});

export interface MenubarItemProps extends React.ComponentPropsWithoutRef<typeof M.Item> {
  icon?: IconProp;
  /** Shown at the end, like "⌘D". Display only: wire the shortcut yourself. */
  shortcut?: React.ReactNode;
  /** Red, for actions that delete or can't be undone. */
  destructive?: boolean;
}
export const MenubarItem = React.forwardRef<HTMLDivElement, MenubarItemProps>(function MenubarItem({ icon, shortcut, destructive, className, children, asChild, ...rest }, ref) {
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

export const MenubarCheckboxItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.CheckboxItem>>(function MenubarCheckboxItem({ className, children, ...rest }, ref) {
  return (
    <M.CheckboxItem ref={ref} className={cn(menuItem, className)} {...rest}>
      <span className="inline-flex size-(--size-lg) shrink-0 items-center justify-center text-icon-accent-primary-hover"><M.ItemIndicator><CheckGlyph /></M.ItemIndicator></span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </M.CheckboxItem>
  );
});

export const MenubarRadioItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.RadioItem>>(function MenubarRadioItem({ className, children, ...rest }, ref) {
  return (
    <M.RadioItem ref={ref} className={cn(menuItem, className)} {...rest}>
      <span className="inline-flex size-(--size-lg) shrink-0 items-center justify-center text-icon-accent-primary-hover"><M.ItemIndicator><DotGlyph size={12} /></M.ItemIndicator></span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </M.RadioItem>
  );
});

export const MenubarLabel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.Label>>(function MenubarLabel({ className, ...rest }, ref) {
  return <M.Label ref={ref} className={cn(menuLabel, className)} {...rest} />;
});
export const MenubarSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.Separator>>(function MenubarSeparator({ className, ...rest }, ref) {
  return <M.Separator ref={ref} className={cn(menuSeparator, className)} {...rest} />;
});

export interface MenubarSubTriggerProps extends React.ComponentPropsWithoutRef<typeof M.SubTrigger> { icon?: IconProp }
export const MenubarSubTrigger = React.forwardRef<HTMLDivElement, MenubarSubTriggerProps>(function MenubarSubTrigger({ icon, className, children, ...rest }, ref) {
  return (
    <M.SubTrigger ref={ref} className={cn(menuItem, "data-[state=open]:bg-tertiary", className)} {...rest}>
      {icon ? <span className={menuIcon}>{renderIcon(icon, "sm")}</span> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      <ChevronRightGlyph className="ml-auto text-icon-tertiary rtl:-scale-x-100" />
    </M.SubTrigger>
  );
});
export const MenubarSubContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof M.SubContent>>(function MenubarSubContent({ className, sideOffset = 4, collisionPadding = 8, ...rest }, ref) {
  return (
    <M.Portal>
      <M.SubContent ref={ref} sideOffset={sideOffset} collisionPadding={collisionPadding}
        className={cn(floatingPanel, "min-w-48 p-xxs origin-(--radix-menubar-content-transform-origin)", className)} {...rest} />
    </M.Portal>
  );
});
