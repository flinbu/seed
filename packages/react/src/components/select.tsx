import * as React from "react";
import { Select as S } from "radix-ui";
import { cn } from "../lib/cn.js";
import { floatingPanel, menuIcon, menuItem, menuLabel, menuSeparator } from "../lib/floating.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { CheckGlyph, ChevronDownGlyph, ChevronUpGlyph } from "../lib/glyphs.js";
import { fieldFrame } from "./input.js";
import { useField } from "./field.js";

const SIZE = { sm: "h-control-sm px-xs body-body-3-regular", md: "h-control-md px-sm body-body-3-regular", lg: "h-control-lg px-base body-body-2-regular" } as const;

/** Picks one value from a list. Seed's replacement for the native select; use Combobox when people need to search. */
export const Select = S.Root;
export const SelectGroup = S.Group;

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof S.Trigger> {
  /** sm 32, md 40 (default), lg 48 px tall. */
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  leftIcon?: IconProp;
  /** Shown when nothing is selected. */
  placeholder?: React.ReactNode;
}

/** The field-shaped button that opens the list. Inside Field it gets the label, hint and error wiring. */
export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger({ size = "md", invalid, leftIcon, placeholder, className, children, id, disabled, ...rest }, ref) {
  const f = useField();
  const bad = invalid ?? f?.invalid, off = disabled ?? f?.disabled;
  return (
    <S.Trigger ref={ref} id={id ?? f?.id} disabled={off} aria-invalid={bad || undefined} aria-describedby={f?.describedBy}
      className={cn("group flex w-full cursor-pointer items-center gap-xs text-left font-primary outline-none", fieldFrame, SIZE[size],
        "focus-visible:border-accent-primary focus-visible:shadow-button-focus-primary data-[state=open]:border-accent-primary data-[state=open]:shadow-button-focus-primary",
        bad && "border-error-primary hover:border-error-primary focus-visible:border-error-primary focus-visible:shadow-button-focus-destructive",
        "disabled:cursor-not-allowed disabled:border-disabled-alt disabled:bg-disabled-alt disabled:text-disabled disabled:shadow-none",
        "data-[placeholder]:text-placeholder", className)} {...rest}>
      {leftIcon ? <span className="inline-flex leading-none text-icon-tertiary">{renderIcon(leftIcon, "sm")}</span> : null}
      <span className="min-w-0 flex-1 truncate"><S.Value placeholder={placeholder}>{children}</S.Value></span>
      <S.Icon asChild><ChevronDownGlyph className="shrink-0 text-icon-tertiary transition-transform duration-(--duration-fast) group-data-[state=open]:rotate-180" /></S.Icon>
    </S.Trigger>
  );
});

export const SelectContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof S.Content>>(function SelectContent({ className, children, position = "popper", sideOffset = 4, collisionPadding = 8, ...rest }, ref) {
  return (
    <S.Portal>
      <S.Content ref={ref} position={position} sideOffset={sideOffset} collisionPadding={collisionPadding}
        className={cn(floatingPanel, "relative max-h-(--radix-select-content-available-height) overflow-hidden",
          position === "popper" && "w-(--radix-select-trigger-width) min-w-48 origin-(--radix-select-content-transform-origin)", className)} {...rest}>
        <S.ScrollUpButton className="flex h-control-sm items-center justify-center text-icon-tertiary"><ChevronUpGlyph /></S.ScrollUpButton>
        <S.Viewport className="p-xxs">{children}</S.Viewport>
        <S.ScrollDownButton className="flex h-control-sm items-center justify-center text-icon-tertiary"><ChevronDownGlyph /></S.ScrollDownButton>
      </S.Content>
    </S.Portal>
  );
});

export interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof S.Item> {
  icon?: IconProp;
  /** A second line under the label. */
  description?: React.ReactNode;
}
export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem({ icon, description, className, children, ...rest }, ref) {
  return (
    <S.Item ref={ref} className={cn(menuItem, "pr-2xl", description && "items-start py-xs", className)} {...rest}>
      {icon ? <span className={cn(menuIcon, description && "pt-xxxs")}>{renderIcon(icon, "sm")}</span> : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <S.ItemText>{children}</S.ItemText>
        {description ? <span className="whitespace-normal text-tertiary body-body-4-regular">{description}</span> : null}
      </span>
      <S.ItemIndicator className="absolute right-xs inline-flex text-icon-accent-primary-hover"><CheckGlyph /></S.ItemIndicator>
    </S.Item>
  );
});

export const SelectLabel = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof S.Label>>(function SelectLabel({ className, ...rest }, ref) {
  return <S.Label ref={ref} className={cn(menuLabel, className)} {...rest} />;
});
export const SelectSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof S.Separator>>(function SelectSeparator({ className, ...rest }, ref) {
  return <S.Separator ref={ref} className={cn(menuSeparator, className)} {...rest} />;
});
