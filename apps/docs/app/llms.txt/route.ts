import { COMPONENTS } from "@/lib/registry";

export const dynamic = "force-static";
/** A plain-text summary for AI coding tools, so they use Seed's real API. */
export function GET() {
  const lines = [
    "# Seed", "", "> A calm, neutral-first design system for React and Tailwind CSS v4. Packages: @flinbu/seed (React components on Radix) and @flinbu/seed-tokens (tokens, Tailwind theme, createTheme, seed CLI).", "",
    "## Setup", "- npm i @flinbu/seed @flinbu/seed-tokens lucide-react", "- CSS: @import \"tailwindcss\"; @import \"@flinbu/seed/styles.css\";", "- Without Tailwind: import \"@flinbu/seed/compiled.css\"", "- Theme: <ThemeProvider> and <ThemeScript /> in <head>; useTheme() gives theme, resolvedTheme, setTheme.", "",
    "## Rules", "- Use semantic token utilities only: bg-primary, text-secondary, border-primary, text-icon-secondary, p-base, gap-xs, rounded-control, shadow-elevation-raised, h-control-md, and Seed type styles like label-label-2-medium or body-body-3-regular. Never raw hex or px.", "- Icons are components: leftIcon={<Plus />} from lucide-react.", "- Brand themes: npx seed theme --brand \"#hex\" --name acme --out acme.css, then <ThemeProvider brand=\"acme\">.", "",
    "## Components",
    ...COMPONENTS.flatMap((c) => [`### ${c.name}`, c.description, ...c.props.map((p) => `- ${p.name}: ${p.type}${p.default ? ` (default ${p.default})` : ""}. ${p.description}`), ""]),
  ];
  return new Response(lines.join("\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
