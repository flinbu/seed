"use client";
import * as React from "react";

export type ThemeMode = "light" | "dark" | "system";
interface ThemeContextValue {
  /** What the person picked: light, dark or system. */
  theme: ThemeMode;
  /** What's on screen now: light or dark. */
  resolvedTheme: "light" | "dark";
  setTheme: (t: ThemeMode) => void;
  /** The active createTheme name (data-brand), if any. */
  brand: string | null;
  setBrand: (b: string | null) => void;
}
const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children?: React.ReactNode;
  /** Default 'system'. */
  defaultTheme?: ThemeMode;
  /** Controlled theme. */
  theme?: ThemeMode;
  onThemeChange?: (t: ThemeMode) => void;
  /** A theme made with createTheme({ name }). Sets data-brand on <html>. */
  brand?: string | null;
  /** Where the choice is remembered. Default 'seed-theme'; null turns storage off. */
  storageKey?: string | null;
}

const prefersDark = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
function read(key: string | null): ThemeMode | null {
  if (!key) return null;
  try { const v = localStorage.getItem(key); return v === "light" || v === "dark" || v === "system" ? v : null; } catch { return null; }
}

/** Light, Dark or system for the whole page, plus the brand theme. Pair it with <ThemeScript /> in <head> to avoid a flash. */
export function ThemeProvider({ children, defaultTheme = "system", theme: controlled, onThemeChange, brand: brandProp = null, storageKey = "seed-theme" }: ThemeProviderProps) {
  const [inner, setInner] = React.useState<ThemeMode>(defaultTheme);
  const [brand, setBrand] = React.useState<string | null>(brandProp);
  const [systemDark, setSystemDark] = React.useState(false);
  const theme = controlled ?? inner;
  React.useEffect(() => { const s = read(storageKey); if (s && controlled === undefined) setInner(s); }, [storageKey, controlled]);
  React.useEffect(() => { setBrand(brandProp); }, [brandProp]);
  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    setSystemDark(!!mq?.matches);
    const on = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq?.addEventListener?.("change", on);
    return () => mq?.removeEventListener?.("change", on);
  }, []);
  React.useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-theme", theme);
    if (brand) el.setAttribute("data-brand", brand); else el.removeAttribute("data-brand");
  }, [theme, brand]);
  const setTheme = React.useCallback((t: ThemeMode) => {
    if (controlled === undefined) setInner(t);
    if (storageKey) { try { localStorage.setItem(storageKey, t); } catch { /* private mode */ } }
    onThemeChange?.(t);
  }, [controlled, storageKey, onThemeChange]);
  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;
  const value = React.useMemo(() => ({ theme, resolvedTheme, setTheme, brand, setBrand } as ThemeContextValue), [theme, resolvedTheme, setTheme, brand]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (ctx) return ctx;
  return { theme: "system", resolvedTheme: prefersDark() ? "dark" : "light", setTheme: () => {}, brand: null, setBrand: () => {} };
}

/** Put it in <head>: it sets data-theme before the first paint, so a dark page never flashes white. */
export function ThemeScript({ storageKey = "seed-theme", defaultTheme = "system", brand, nonce }: { storageKey?: string; defaultTheme?: ThemeMode; brand?: string; nonce?: string }) {
  const js = `(function(){try{var t=localStorage.getItem(${JSON.stringify(storageKey)})||${JSON.stringify(defaultTheme)};document.documentElement.setAttribute("data-theme",t);${brand ? `document.documentElement.setAttribute("data-brand",${JSON.stringify(brand)});` : ""}}catch(e){}})();`;
  return <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: js }} />;
}
