import * as React from "react";
import { Toast as T } from "radix-ui";
import { cn } from "../lib/cn.js";
import { renderIcon, type IconProp } from "../lib/icon.js";
import { XGlyph } from "../lib/glyphs.js";
import { Button } from "./button.js";

type Variant = "neutral" | "success" | "error" | "warning" | "info";
export interface ToastOptions {
  id?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: Variant;
  /** One action, like Undo. The toast closes after it runs. */
  action?: { label: string; onClick: () => void };
  icon?: IconProp | false;
  /** ms on screen. Default 5000; errors stay until dismissed. Infinity keeps any toast. */
  duration?: number;
}
type Item = ToastOptions & { id: string; open: boolean };

let seq = 0;
let items: Item[] = [];
const subs = new Set<(i: Item[]) => void>();
const emit = () => subs.forEach((f) => f(items));

/** Shows a short message about something that just happened. Put a <Toaster /> once near the root. */
export function toast(opts: ToastOptions | string): string {
  const o = typeof opts === "string" ? { title: opts } : opts;
  const id = o.id ?? `t${++seq}`;
  items = [...items.filter((t) => t.id !== id), { ...o, id, open: true }];
  emit();
  return id;
}
toast.success = (o: Omit<ToastOptions, "variant"> | string) => toast({ ...(typeof o === "string" ? { title: o } : o), variant: "success" });
toast.error = (o: Omit<ToastOptions, "variant"> | string) => toast({ ...(typeof o === "string" ? { title: o } : o), variant: "error" });
toast.warning = (o: Omit<ToastOptions, "variant"> | string) => toast({ ...(typeof o === "string" ? { title: o } : o), variant: "warning" });
toast.info = (o: Omit<ToastOptions, "variant"> | string) => toast({ ...(typeof o === "string" ? { title: o } : o), variant: "info" });
toast.dismiss = (id?: string) => { items = items.map((t) => (!id || t.id === id ? { ...t, open: false } : t)); emit(); };

const svg = (d: React.ReactNode) => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
const ICON: Record<Variant, React.ReactElement | null> = {
  neutral: null,
  success: svg(<><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></>),
  error: svg(<><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>),
  warning: svg(<><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4M12 17h.01" /></>),
  info: svg(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>),
};
const TONE: Record<Variant, string> = { neutral: "", success: "text-icon-success-primary-hover", error: "text-icon-error-primary", warning: "text-icon-warning-primary-hover", info: "text-icon-info-primary" };

const POS = {
  "bottom-right": "bottom-0 right-0", "bottom-left": "bottom-0 left-0", "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
  "top-right": "top-0 right-0", "top-left": "top-0 left-0", "top-center": "top-0 left-1/2 -translate-x-1/2",
} as const;

export interface ToasterProps {
  /** Default 'bottom-right'. */
  position?: keyof typeof POS;
  /** Label for the region, read by screen readers. Default 'Notifications'. */
  label?: string;
}

/** Where toasts appear. F8 moves focus to them. */
export function Toaster({ position = "bottom-right", label = "Notifications" }: ToasterProps) {
  const [list, setList] = React.useState(items);
  React.useEffect(() => { subs.add(setList); return () => { subs.delete(setList); }; }, []);
  const remove = (id: string) => { items = items.filter((t) => t.id !== id); emit(); };
  return (
    <T.Provider swipeDirection={position.endsWith("left") ? "left" : "right"} label={label}>
      {list.map((t) => {
        const v = t.variant ?? "neutral";
        const icon = t.icon === false ? null : t.icon ? renderIcon(t.icon, "md") : ICON[v];
        return (
          <T.Root key={t.id} open={t.open} type={v === "error" ? "foreground" : "background"}
            duration={t.duration ?? (v === "error" ? Infinity : 5000)}
            onOpenChange={(o) => { if (!o) { toast.dismiss(t.id); setTimeout(() => remove(t.id), 200); } }}
            className={cn("pointer-events-auto relative flex w-full items-start gap-sm rounded-lg border border-secondary bg-elevated p-base pr-2xl text-primary shadow-elevation-lg font-primary",
              "data-[state=open]:animate-seed-rise data-[state=closed]:animate-seed-fade-out data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=end]:animate-seed-fade-out motion-reduce:animate-none")}>
            {icon ? <span className={cn("inline-flex leading-none", TONE[v])}>{icon}</span> : null}
            <div className="flex min-w-0 flex-1 flex-col gap-xxxs pt-xxxs">
              <T.Title className="text-primary label-label-2-semibold">{t.title}</T.Title>
              {t.description ? <T.Description className="text-secondary body-body-3-regular">{t.description}</T.Description> : null}
              {t.action ? (
                <T.Action altText={t.action.label} asChild>
                  <Button size="sm" variant="secondary" className="mt-xs self-start" onClick={t.action.onClick}>{t.action.label}</Button>
                </T.Action>
              ) : null}
            </div>
            <T.Close asChild><Button variant="ghost" size="sm" icon={<XGlyph />} aria-label="Dismiss notification" className="absolute top-xs right-xs" /></T.Close>
          </T.Root>
        );
      })}
      <T.Viewport className={cn("fixed z-[70] m-0 flex w-full max-w-sm list-none flex-col gap-xs p-base outline-none", POS[position])} />
    </T.Provider>
  );
}
