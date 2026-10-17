import { cn } from "./cn.js";

/** The surface every floating panel shares: elevated, hairline border, grows from where it opens. */
export const floatingPanel = cn(
  "z-50 border border-secondary bg-elevated text-primary shadow-elevation-lg font-primary rounded-lg outline-none",
  "data-[state=open]:animate-seed-grow data-[state=closed]:animate-seed-shrink motion-reduce:animate-none",
);

/** One row in a menu or a list of options. */
export const menuItem = cn(
  "relative flex min-h-control-sm cursor-pointer select-none items-center gap-xs rounded-md px-xs text-primary body-body-3-regular outline-none",
  "data-[highlighted]:bg-tertiary data-[disabled]:cursor-not-allowed data-[disabled]:text-disabled data-[disabled]:data-[highlighted]:bg-transparent",
);
export const menuIcon = "inline-flex shrink-0 leading-none text-icon-secondary";
export const menuShortcut = "ml-auto pl-base font-mono text-tertiary body-body-4-regular";
export const menuLabel = "px-xs pt-xs pb-xxs mono-label-medium uppercase text-tertiary";
export const menuSeparator = "-mx-xxs my-xxs h-px bg-(--border-secondary)";
