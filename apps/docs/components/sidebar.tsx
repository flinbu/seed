"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@flinbu/seed";
import { COMPONENTS, GROUPS } from "@/lib/registry";

const START = [{ href: "/docs", label: "Introduction" }, { href: "/docs/getting-started", label: "Get started" }, { href: "/docs/theming", label: "Theming" }, { href: "/docs/tokens", label: "Tokens" }, { href: "/fenly-serif", label: "Fenly Serif" }, { href: "/docs/figma", label: "Figma" }, { href: "/docs/ai", label: "Use with AI" }];

function Item({ href, label }: { href: string; label: string }) {
  const on = usePathname() === href;
  return <li><Link href={href} aria-current={on ? "page" : undefined}
    className={cn("block rounded-control px-sm py-xxs label-label-2-regular no-underline transition-colors", on ? "bg-selected text-primary label-label-2-medium" : "text-secondary hover:bg-secondary-hover hover:text-primary")}>{label}</Link></li>;
}
export function Sidebar() {
  return (
    <nav aria-label="Docs" className="flex flex-col gap-lg">
      <div className="flex flex-col gap-xxs"><span className="px-sm mono-label-medium text-tertiary">Foundations</span><ul className="m-0 flex list-none flex-col gap-px p-0">{START.map((s) => <Item key={s.href} {...s} />)}</ul></div>
      {GROUPS.map((g) => (
        <div key={g} className="flex flex-col gap-xxs">
          <span className="px-sm mono-label-medium text-tertiary">{g}</span>
          <ul className="m-0 flex list-none flex-col gap-px p-0">{COMPONENTS.filter((c) => c.group === g).map((c) => <Item key={c.slug} href={`/docs/components/${c.slug}`} label={c.name} />)}</ul>
        </div>
      ))}
    </nav>
  );
}
