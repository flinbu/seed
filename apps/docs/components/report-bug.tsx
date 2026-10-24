"use client";
import * as React from "react";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Field, Input, Textarea } from "@flinbu/seed";
import { Bug, Check } from "lucide-react";

/* Report a bug from the docs: the header button (any bug) and the link on each component page (that component).
   Posts to /api/report-bug, which sends it to the team's Slack. Board B of the "Report a bug" canvas. */

function browserOf(ua: string) {
  const name = /Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const version = new RegExp(`${name === "Edge" ? "Edg" : name === "Safari" ? "Version" : name}/(\\d+)`).exec(ua)?.[1];
  const os = /Mac OS X/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Linux/.test(ua) ? "Linux" : "";
  return `${name}${version ? ` ${version}` : ""}${os ? ` on ${os}` : ""}`;
}

export function ReportBug({ component, variant = "button" }: { component?: string; variant?: "button" | "link" }) {
  const [open, setOpen] = React.useState(false);
  const [what, setWhat] = React.useState("");
  const [expected, setExpected] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [state, setState] = React.useState<"form" | "sending" | "done">("form");
  const [error, setError] = React.useState<string | null>(null);
  const [where, setWhere] = React.useState<{ page: string; browser: string }>({ page: "", browser: "" });
  React.useEffect(() => { if (open) setWhere({ page: window.location.href, browser: browserOf(navigator.userAgent) }); }, [open]);

  const reset = () => { setWhat(""); setExpected(""); setEmail(""); setState("form"); setError(null); };
  const change = (v: boolean) => { setOpen(v); if (!v && state === "done") reset(); };
  const send = async () => {
    setState("sending"); setError(null);
    try {
      const res = await fetch("/api/report-bug", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ what, expected, email, component, website, ...where }) });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "We couldn't send it just now. Try again in a moment.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send it just now.");
      setState("form");
    }
  };
  const context: [string, string][] = [...(component ? [["Component", component] as [string, string]] : []), ["Seed", process.env.NEXT_PUBLIC_SEED_VERSION ?? ""], ["Page", where.page.replace(/^https?:\/\//, "")], ["Browser", where.browser]];

  return (
    <>
      {variant === "link"
        ? <Button variant="link" size="sm" className="self-start px-0" onClick={() => setOpen(true)}>Found a bug in {component}? Report it</Button>
        : <Button size="sm" variant="ghost" leftIcon={<Bug />} onClick={() => setOpen(true)} className="hidden sm:inline-flex">Report a bug</Button>}
      <Dialog open={open} onOpenChange={change}>
        <DialogContent className="w-[min(520px,calc(100vw-32px))]">
          {state === "done" ? (
            <div className="flex flex-col items-start gap-sm py-xs">
              <span aria-hidden="true" className="inline-flex size-(--size-4xl) items-center justify-center rounded-full bg-success-primary text-success-primary"><Check size={20} /></span>
              <DialogTitle>Thanks, the team has it</DialogTitle>
              <DialogDescription>{email ? "We'll write to you when it's fixed." : "If it's unclear, we'll look into it from what you wrote."}</DialogDescription>
              <Button className="mt-xs" onClick={() => change(false)}>Done</Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{component ? `Report a bug in ${component}` : "Report a bug in Seed"}</DialogTitle>
                <DialogDescription>It goes straight to the team. No account needed.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-base">
                <Field label="What happened?"><Textarea rows={4} value={what} autoFocus placeholder="The menu opens under the dialog when Select is inside one." onChange={(e) => setWhat(e.target.value)} /></Field>
                <Field label="What did you expect?" labelAside="Optional"><Input value={expected} placeholder="The menu to show above the dialog." onChange={(e) => setExpected(e.target.value)} /></Field>
                <Field label="Your email" labelAside="Optional, so we can tell you when it's fixed"><Input type="email" value={email} placeholder="you@company.com" onChange={(e) => setEmail(e.target.value)} /></Field>
                {/* People never see this field; bots fill it in. */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px] h-px w-px opacity-0" />
                <dl className="m-0 grid grid-cols-[96px_minmax(0,1fr)] gap-x-sm gap-y-xxs rounded-tl-(--radius-petal-tip) rounded-tr-(--radius-petal) rounded-b-(--radius-petal) border border-secondary bg-secondary p-sm">
                  {context.filter(([, v]) => v).map(([k, v]) => (
                    <React.Fragment key={k}><dt className="mono-label-medium uppercase text-tertiary">{k}</dt><dd className="m-0 break-all body-body-4-regular text-secondary">{v}</dd></React.Fragment>
                  ))}
                </dl>
                {error ? <p role="alert" className="m-0 body-body-3-regular text-error-primary">{error}</p> : null}
              </div>
              <DialogFooter>
                <Button variant="secondary" onClick={() => change(false)}>Cancel</Button>
                <Button loading={state === "sending"} disabled={what.trim().length < 3} onClick={send}>Send report</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
