import * as React from "react";
import { Accordion as A } from "radix-ui";
import { cn } from "../lib/cn.js";
import { ChevronDownGlyph } from "../lib/glyphs.js";

/** Sections that open and close in place: FAQs, settings groups, long specs. Content stays findable with the browser's search. */
export const Accordion = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof A.Root>>(function Accordion({ className, ...rest }, ref) {
  return <A.Root ref={ref} className={cn("flex flex-col", className)} {...(rest as any)} />;
}) as typeof A.Root;

export const AccordionItem = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof A.Item>>(function AccordionItem({ className, ...rest }, ref) {
  return <A.Item ref={ref} className={cn("border-b border-secondary", className)} {...rest} />;
});

export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof A.Trigger> {
  /** Heading level of the section title. Default 3. */
  level?: 2 | 3 | 4 | 5 | 6;
}
export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(function AccordionTrigger({ level = 3, className, children, ...rest }, ref) {
  return (
    <A.Header asChild>
      {React.createElement(`h${level}`, { className: "m-0 flex" },
        <A.Trigger ref={ref} className={cn("group flex flex-1 cursor-pointer items-center justify-between gap-base border-0 bg-transparent py-base text-left font-primary text-primary label-label-1-medium",
          "hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:cursor-not-allowed disabled:text-disabled", className)} {...rest}>
          {children}
          <ChevronDownGlyph className="shrink-0 text-icon-tertiary transition-transform duration-(--duration-base) group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
        </A.Trigger>)}
    </A.Header>
  );
});

export const AccordionContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof A.Content>>(function AccordionContent({ className, children, ...rest }, ref) {
  return (
    <A.Content ref={ref} className="overflow-hidden text-secondary body-body-3-regular data-[state=open]:animate-seed-accordion-open data-[state=closed]:animate-seed-accordion-close motion-reduce:animate-none" {...rest}>
      <div className={cn("pb-base", className)}>{children}</div>
    </A.Content>
  );
});
