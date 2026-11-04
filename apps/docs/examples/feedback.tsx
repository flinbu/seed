"use client";
import * as React from "react";
import { Alert, Button, Link, Progress, EmptyState } from "@flinbu/seed";
import { Component } from "lucide-react";

export function AlertVariants() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-sm">
      <Alert title="Seed 1.2.0 is out">Focus ring tokens and a pill Tabs variant. <Link href="#">See what’s new</Link></Alert>
      <Alert variant="success" title="cs_204 applied">Figma updates on the next sync.</Alert>
      <Alert variant="warning" title="4 text colors fail contrast in Light" action={<Button size="sm" variant="secondary">Fix them</Button>}>
        They sit below 4.5:1 on bg-primary since yesterday’s sync.
      </Alert>
      <Alert variant="error" title="We couldn’t sync to Figma" onDismiss={() => {}}>Figma didn’t respond. Your changes are safe.</Alert>
    </div>
  );
}

export function AlertLoud() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-sm">
      <Alert emphasis="loud" title="Seed 2.0 needs a migration">Token names change on March 3. <Link href="#">Read the guide</Link></Alert>
      <Alert emphasis="loud" variant="success" title="Your system is healthy again">All 446 tokens pass AA in Light and Dark.</Alert>
      <Alert emphasis="loud" variant="warning" title="You’re out of credits" action={<Button size="sm" variant="secondary">Add credits</Button>}>
        Pluto pauses until the 1st, or until you add more.
      </Alert>
      <Alert emphasis="loud" variant="error" title="Sync to Figma failed" action={<Button size="sm" variant="secondary">Try again</Button>}>
        Figma didn’t respond three times in a row. Your changes are safe here.
      </Alert>
    </div>
  );
}

export function AlertThemes() {
  return (
    <div className="grid w-full gap-base md:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <div key={theme} data-theme={theme} className="flex flex-col gap-sm rounded-xl border border-secondary bg-primary p-base">
          <span className="mono-label-medium text-tertiary">{theme === "light" ? "Light" : "Dark"}</span>
          {(["info", "success", "warning", "error"] as const).map((v) => <Alert key={v} variant={v} title={`Subtle ${v}`}>Only the icon is in color. <Link href="#">A link</Link></Alert>)}
          {(["info", "success", "warning", "error"] as const).map((v) => <Alert key={v} variant={v} emphasis="loud" title={`Loud ${v}`}>The hairline takes the tone.</Alert>)}
        </div>
      ))}
    </div>
  );
}

export function AlertLive() {
  const [failed, setFailed] = React.useState(false);
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-sm">
      <Button variant="secondary" onClick={() => setFailed(true)}>Sync to Figma</Button>
      {failed ? (
        <Alert live emphasis="loud" variant="error" title="Sync to Figma failed" onDismiss={() => setFailed(false)} className="w-full">
          Figma didn’t respond. Your changes are safe here.
        </Alert>
      ) : null}
    </div>
  );
}

export function ProgressStates() {
  const [v, setV] = React.useState(40);
  return (
    <div className="flex w-full max-w-sm flex-col gap-base">
      <Progress value={v} label="Uploading tokens" showValue />
      <Progress value={9.2} max={10} label="Storage" showValue valueText="9.2 of 10 GB" variant="warning" />
      <Progress label="Syncing with Figma" size="sm" />
      <Button size="sm" variant="secondary" onClick={() => setV((x) => (x >= 100 ? 0 : x + 20))}>Add 20%</Button>
    </div>
  );
}

export function EmptyStateBasic() {
  return (
    <div className="w-full max-w-md rounded-xl border border-secondary bg-primary">
      <EmptyState icon={<Component />} title="No components yet" description="Import them from Figma, or ask Pluto to draft the first ones from your tokens."
        actions={<><Button variant="secondary">Import from Figma</Button><Button>Draft with Pluto</Button></>} />
    </div>
  );
}

export function EmptyStateSmall() {
  return (
    <div className="w-full max-w-xs rounded-xl border border-secondary bg-primary">
      <EmptyState size="sm" title="No results" description="Try fewer filters." actions={<Button size="sm" variant="secondary">Clear filters</Button>} />
    </div>
  );
}
