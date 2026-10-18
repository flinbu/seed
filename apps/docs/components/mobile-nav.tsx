"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { Button, Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@flinbu/seed";
import { ExternalLink, Menu } from "lucide-react";
import { SeedLogo } from "./logo";
import { Sidebar } from "./sidebar";

/** The docs navigation on screens without the sidebar: a menu button that opens it in a sheet. */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const path = usePathname();
  React.useEffect(() => { setOpen(false); }, [path]);
  // Bring the current page into view, so a deep component page isn't hidden below the fold.
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => document.querySelector('[role="dialog"] [aria-current="page"]')?.scrollIntoView({ block: "center" }), 50);
    return () => clearTimeout(t);
  }, [open]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" icon={<Menu />} aria-label="Open menu" className="-ml-xs lg:hidden" />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-[min(85vw,var(--container-xs))] flex-col gap-lg overflow-y-auto">
        <div className="flex items-center gap-xs pr-3xl">
          <SeedLogo size={22} />
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Every page in the Seed docs.</SheetDescription>
        </div>
        <Sidebar />
        <Button variant="secondary" size="sm" href="https://github.com/flinbu/seed" rightIcon={<ExternalLink />} className="self-start">GitHub</Button>
      </SheetContent>
    </Sheet>
  );
}
