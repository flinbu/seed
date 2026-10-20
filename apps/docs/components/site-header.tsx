"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, Button, ToggleGroup, ToggleGroupItem, useTheme, cn } from "@flinbu/seed";
import { Monitor, Moon, Sun, ExternalLink } from "lucide-react";
import { SeedLogo } from "./logo";
import { useSiteTheme } from "./site-theme";
import { MobileNav } from "./mobile-nav";

const NAV = [{ href: "/docs/getting-started", label: "Get started" }, { href: "/docs/theming", label: "Theming" }, { href: "/docs/components/button", label: "Components", match: "/docs/components" }, { href: "/docs/tokens", label: "Tokens" }, { href: "/fenly-serif", label: "Fenly Serif" }];

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const { saved, apply } = useSiteTheme();
  const path = usePathname();
  return (
    <header className="sticky top-0 z-20 flex h-(--space-5xl) items-center gap-sm border-b md:gap-lg border-secondary bg-primary/90 px-lg backdrop-blur">
      <MobileNav />
      <Link href="/" aria-label="Seed home" className="inline-flex items-center text-primary no-underline"><SeedLogo size={26} /></Link>
      <nav aria-label="Main" className="hidden items-center gap-xxs md:flex">
        {NAV.map((n) => {
          const on = path?.startsWith(n.match ?? n.href);
          return <Link key={n.href} href={n.href} aria-current={on ? "page" : undefined}
            className={cn("rounded-control px-sm py-xxs label-label-2-medium no-underline transition-colors", on ? "bg-selected text-primary" : "text-secondary hover:bg-secondary-hover hover:text-primary")}>{n.label}</Link>;
        })}
      </nav>
      <div className="ml-auto flex items-center gap-xs">
        {saved ? <Badge variant="accent" className="hidden sm:inline-flex">Your theme</Badge> : null}
        {saved ? <Button size="sm" variant="ghost" onClick={() => apply(null)}>Reset</Button> : null}
        <Button size="sm" variant="ghost" href="/docs/figma" aria-current={path?.startsWith("/docs/figma") ? "page" : undefined} className="hidden sm:inline-flex">Figma</Button>
        <Button size="sm" variant="ghost" href="https://github.com/flinbu/seed" rightIcon={<ExternalLink />} className="hidden sm:inline-flex">GitHub</Button>
        <ToggleGroup type="single" size="sm" variant="outline" value={theme} allowEmpty={false} onValueChange={(v) => setTheme(v as "light" | "dark" | "system")} aria-label="Theme">
          <ToggleGroupItem value="light" icon={<Sun />} aria-label="Light" />
          <ToggleGroupItem value="dark" icon={<Moon />} aria-label="Dark" />
          <ToggleGroupItem value="system" icon={<Monitor />} aria-label="Match system" />
        </ToggleGroup>
      </div>
    </header>
  );
}
