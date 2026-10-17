"use client";
import * as React from "react";
import { Alert, Button, Progress, EmptyState } from "@flinbu/seed";
import { Component } from "lucide-react";

export function AlertVariants() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-sm">
      <Alert title="Seed 1.2.0 is out">Focus ring tokens and a pill Tabs variant.</Alert>
      <Alert variant="success" title="cs_204 applied">Figma updates on the next sync.</Alert>
      <Alert variant="warning" title="4 text colors fail contrast in Light" action={<Button size="sm" variant="secondary">Fix them</Button>}>
        They sit below 4.5:1 on bg-primary since yesterday’s sync.
      </Alert>
      <Alert variant="error" title="We couldn’t sync to Figma" onDismiss={() => {}}>Figma didn’t respond. Your changes are safe.</Alert>
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
