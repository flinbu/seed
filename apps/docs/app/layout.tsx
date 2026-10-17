import type { Metadata } from "next";
import { ThemeProvider, ThemeScript } from "@flinbu/seed";
import { SiteHeader } from "@/components/site-header";
import { SiteThemeProvider } from "@/components/site-theme";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Seed · A calm design system for React and Tailwind", template: "%s · Seed" },
  description: "Seed is a neutral-first design system for React and Tailwind CSS: accessible components on Radix, tokens as Tailwind utilities, and brand themes that pass WCAG AA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body className="min-h-dvh bg-primary">
        <ThemeProvider>
          <SiteThemeProvider>
            <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-base focus:top-base focus:z-50 focus:rounded-control focus:bg-primary focus:p-xs">Skip to content</a>
            <SiteHeader />
            {children}
          </SiteThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
