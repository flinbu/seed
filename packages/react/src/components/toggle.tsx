import * as React from "react";
import { Toggle as RadixToggle, ToggleGroup as RadixToggleGroup } from "radix-ui";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";

type Size = "sm" | "md" | "lg";
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-xs shrink-0 whitespace-nowrap rounded-control cursor-pointer select-none font-primary text-icon-secondary bg-transparent transition-colors duration-(--duration-fast) hover:not-disabled:bg-secondary-hover hover:not-disabled:text-icon-primary data-[state=on]:bg-selected data-[state=on]:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:cursor-not-allowed disabled:text-disabled",
  {
    variants: {
      size: { sm: "h-control-sm px-sm label-label-3-medium", md: "h-control-md px-base label-label-2-medium", lg: "h-control-lg px-lg label-label-1-medium" },
      iconOnly: { true: "px-0", false: "" },
    },
    compoundVariants: [
      { iconOnly: true, size: "sm", className: "w-control-sm" },
      { iconOnly: true, size: "md", className: "w-control-md" },
      { iconOnly: true, size: "lg", className: "w-control-lg" },
    ],
    defaultVariants: { size: "md", iconOnly: false },
  },
);
const GroupSize = React.createContext<Size | null>(null);

interface ToggleLook { size?: Size; icon?: IconProp; leftIcon?: IconProp }
const inner = (icon: IconProp | undefined, leftIcon: IconProp | undefined, children: React.ReactNode) => (
  <>{icon ? renderIcon(icon, "sm") : <>{leftIcon ? renderIcon(leftIcon, "sm") : null}{children}</>}</>
);

export interface ToggleProps extends React.ComponentPropsWithoutRef<typeof RadixToggle.Root>, ToggleLook {}
/** A button that stays pressed: bold, view switches, filters. */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle({ size = "md", icon, leftIcon, className, children, ...rest }, ref) {
  return <RadixToggle.Root ref={ref} className={cn(toggleVariants({ size, iconOnly: !!icon }), className)} {...rest}>{inner(icon, leftIcon, children)}</RadixToggle.Root>;
});

type GroupBase = { size?: Size; variant?: "ghost" | "outline"; className?: string; children?: React.ReactNode; disabled?: boolean; orientation?: "horizontal" | "vertical"; "aria-label"?: string };
export type ToggleGroupProps = GroupBase & (
  | { type: "single"; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; allowEmpty?: boolean }
  | { type: "multiple"; value?: string[]; defaultValue?: string[]; onValueChange?: (value: string[]) => void }
);
/** A set of Toggles: one or many pressed at a time. Single groups keep one selected unless allowEmpty. */
export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(props, ref) {
  const { size = "md", variant = "ghost", className, children, ...rest } = props;
  const groupCls = cn("inline-flex items-center gap-xxxs", variant === "outline" && "gap-0 p-xxxs rounded-[calc(var(--radius-control)+var(--space-xxxs))] border border-primary bg-primary", className);
  if (rest.type === "single") {
    const { allowEmpty = true, onValueChange, value, defaultValue, ...r } = rest;
    const [inner, setInner] = React.useState(defaultValue ?? "");
    const current = value ?? inner;
    return (
      <GroupSize.Provider value={size}>
        <RadixToggleGroup.Root ref={ref} {...r} type="single" value={current} className={groupCls}
          onValueChange={(v: string) => { if (!v && !allowEmpty) return; if (value === undefined) setInner(v); onValueChange?.(v); }}>{children}</RadixToggleGroup.Root>
      </GroupSize.Provider>
    );
  }
  return (
    <GroupSize.Provider value={size}>
      <RadixToggleGroup.Root ref={ref} {...(rest as any)} className={groupCls}>{children}</RadixToggleGroup.Root>
    </GroupSize.Provider>
  );
});

export interface ToggleGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadixToggleGroup.Item>, ToggleLook {}
export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(function ToggleGroupItem({ size, icon, leftIcon, className, children, ...rest }, ref) {
  const gs = React.useContext(GroupSize);
  return <RadixToggleGroup.Item ref={ref} className={cn(toggleVariants({ size: size ?? gs ?? "md", iconOnly: !!icon }), className)} {...rest}>{inner(icon, leftIcon, children)}</RadixToggleGroup.Item>;
});
