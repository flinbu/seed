"use client";
import * as React from "react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Breadcrumb, Button, Combobox, Field, Input, Pagination,
  Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, Toaster, toast,
} from "@flinbu/seed";
import { Component, Palette, Ruler, Type } from "lucide-react";

const OPTIONS = [
  { value: "bg-primary", label: "bg-primary", description: "Page and cards", icon: <Palette />, keywords: ["background", "surface"] },
  { value: "bg-secondary", label: "bg-secondary", description: "Sidebars and table headers", icon: <Palette />, keywords: ["background"] },
  { value: "text-primary", label: "text-primary", description: "Headings and body copy", icon: <Type /> },
  { value: "space-base", label: "space-base", description: "16px", icon: <Ruler />, keywords: ["padding", "gap"] },
  { value: "radius-control", label: "radius-control", description: "4px, every control", icon: <Component /> },
  { value: "radius-petal", label: "radius-petal", description: "Deprecated", icon: <Component />, disabled: true },
];

export function ComboboxBasic() {
  const [v, setV] = React.useState<string | null>("bg-primary");
  return (
    <div className="w-full max-w-xs">
      <Field label="Token" hint="Type to search by name or use.">
        <Combobox options={OPTIONS} value={v} onValueChange={setV} placeholder="Search tokens" clearable />
      </Field>
    </div>
  );
}

export function SheetBasic() {
  return (
    <div className="flex gap-xs">
      <Sheet>
        <SheetTrigger asChild><Button variant="secondary">Token details</Button></SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>bg-accent-solid</SheetTitle>
            <SheetDescription>The primary action and controls that are on.</SheetDescription>
          </SheetHeader>
          <Field label="Light"><Input defaultValue="#2563EB" /></Field>
          <Field label="Dark"><Input defaultValue="#2563EB" /></Field>
          <SheetFooter>
            <SheetClose asChild><Button variant="tertiary">Cancel</Button></SheetClose>
            <Button>Save changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger asChild><Button variant="secondary">From the bottom</Button></SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader><SheetTitle>Share v2.4</SheetTitle><SheetDescription>Anyone with the link can view it.</SheetDescription></SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function ToastBasic() {
  return (
    <div className="flex flex-wrap gap-xs">
      <Button variant="secondary" onClick={() => toast("12 tokens published")}>Neutral</Button>
      <Button variant="secondary" onClick={() => toast.success({ title: "Token renamed", action: { label: "Undo", onClick: () => toast("Rename undone") } })}>With Undo</Button>
      <Button variant="secondary" onClick={() => toast.error({ title: "Figma didn’t respond", description: "Nothing was synced. Your changes are safe here." })}>Error</Button>
      <Toaster />
    </div>
  );
}

export function AccordionBasic() {
  return (
    <Accordion type="single" collapsible defaultValue="tokens" className="w-full max-w-lg">
      <AccordionItem value="tokens">
        <AccordionTrigger>What is a token?</AccordionTrigger>
        <AccordionContent>A named design decision, like bg-primary. Components use tokens, never raw values.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="modes">
        <AccordionTrigger>How do Light and Dark work?</AccordionTrigger>
        <AccordionContent>Semantic tokens have a value per mode and switch with data-theme.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="brand">
        <AccordionTrigger>Can I use my brand color?</AccordionTrigger>
        <AccordionContent>Yes. npx seed theme builds a full scale and checks every accent against WCAG AA.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function BreadcrumbBasic() {
  return (
    <div className="flex flex-col gap-base">
      <Breadcrumb items={[{ label: "Acme DS", href: "#" }, { label: "Tokens", href: "#" }, { label: "Color" }]} />
      <Breadcrumb maxItems={3} items={[{ label: "Workspace", href: "#" }, { label: "Systems", href: "#" }, { label: "Acme DS", href: "#" }, { label: "Components", href: "#" }, { label: "Button" }]} />
    </div>
  );
}

export function PaginationBasic() {
  const [page, setPage] = React.useState(3);
  const from = (page - 1) * 20 + 1, to = Math.min(page * 20, 446);
  return (
    <div className="w-full max-w-xl">
      <Pagination page={page} count={23} onPageChange={setPage} summary={<>{from}–{to} of 446 tokens <Badge className="ml-xs">Color</Badge></>} />
    </div>
  );
}
