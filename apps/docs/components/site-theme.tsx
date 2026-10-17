"use client";
import * as React from "react";
import { createTheme, type ThemeOptions } from "@flinbu/seed-tokens";
import { useTheme } from "@flinbu/seed";

/* The theme builder can re-theme the whole docs site. The choice is kept in this browser only. */
const KEY = "seed-docs-theme";
type Saved = Omit<ThemeOptions, "name">;
const SiteThemeContext = React.createContext<{ saved: Saved | null; apply: (o: Saved | null) => void }>({ saved: null, apply: () => {} });
export const useSiteTheme = () => React.useContext(SiteThemeContext);

export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  const { setBrand } = useTheme();
  const [saved, setSaved] = React.useState<Saved | null>(null);
  React.useEffect(() => { try { const s = localStorage.getItem(KEY); if (s) setSaved(JSON.parse(s)); } catch { /* ignore */ } }, []);
  React.useEffect(() => {
    let el = document.getElementById("seed-site-theme") as HTMLStyleElement | null;
    if (!saved) { el?.remove(); setBrand(null); return; }
    if (!el) { el = document.createElement("style"); el.id = "seed-site-theme"; document.head.appendChild(el); }
    el.textContent = createTheme({ ...saved, name: "site" }).css;
    setBrand("site");
  }, [saved, setBrand]);
  const apply = React.useCallback((o: Saved | null) => {
    setSaved(o);
    try { if (o) localStorage.setItem(KEY, JSON.stringify(o)); else localStorage.removeItem(KEY); } catch { /* ignore */ }
  }, []);
  return <SiteThemeContext.Provider value={{ saved, apply }}>{children}</SiteThemeContext.Provider>;
}
