import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* Seed's type styles are single utilities (label-label-2-medium, body-body-3-regular …): the last one wins. */
const TYPE = /^(display|title|heading|label|body|caption|reading|mono)-[a-z0-9-]+$/;
/* Seed's named scales, so className="px-xs" replaces px-base instead of stacking on it. */
const SPACE = ["xxxs", "xxs", "xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "control-sm", "control-md", "control-lg"];
const twMerge = extendTailwindMerge<"seed-type">({
  extend: {
    theme: {
      spacing: SPACE,
      radius: ["control", "petal", "petal-tip", "none", "full", "5xl"],
      shadow: [(v: string) => /^(elevation|button-focus)-/.test(v)],
      font: ["primary", "titles", "display", "reading", "mono"],
    },
    classGroups: { "seed-type": [(v: string) => TYPE.test(v)] },
  },
});

/** Joins class names and lets later Tailwind classes override earlier ones (className always wins). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
