"use client";
import * as React from "react";
import {
  AspectRatio, Avatar, AvatarGroup, Badge, Button, Field, Item, ItemGroup, Meter, PasswordInput, ProgressRing, TagInput,
  Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem,
} from "@flinbu/seed";
import { AlignCenter, AlignLeft, AlignRight, GitPullRequest, MessageSquare, PenTool, Redo2, Share, Undo2 } from "lucide-react";

const PEOPLE = [{ name: "Ana Ruiz", status: "online" as const }, { name: "Felipe Linares", status: "online" as const }, { name: "Mei Chen", status: "away" as const }, { name: "Tomás Gil", status: "busy" as const }, { name: "Priya Nair" }, { name: "Jon Berg" }, { name: "Sara Kim" }];

export function AvatarGroupBasic() {
  return (
    <div className="flex flex-col items-center gap-base">
      <div className="flex items-center gap-sm"><AvatarGroup people={PEOPLE} max={5} label="Editing now" /><span className="text-secondary body-body-3-regular">7 people in this file</span></div>
      <div className="flex items-center gap-base"><Avatar name="Ana Ruiz" status="online" /><Avatar name="Mei Chen" status="away" /><Avatar name="Tomás Gil" status="busy" /><Avatar name="Jon Berg" status="offline" /></div>
    </div>
  );
}

export function PasswordBasic() {
  return (
    <div className="w-full max-w-xs">
      <Field label="New password">
        <PasswordInput autoComplete="new-password" defaultValue="seedling1" requirements={[
          { label: "At least 12 characters", test: (v) => v.length >= 12 },
          { label: "A number", test: (v) => /\d/.test(v) },
          { label: "Not your email", test: (v) => !!v && !v.includes("@") },
        ]} />
      </Field>
    </div>
  );
}

export function TagInputBasic() {
  const [v, setV] = React.useState(["button", "input", "select"]);
  return (
    <div className="w-full max-w-md">
      <Field label="Components in this release" hint="Enter or a comma adds one. Paste a list to add many.">
        <TagInput value={v} onValueChange={setV} placeholder="Add a component" suggestions={["badge", "card", "checkbox", "combobox", "dialog", "tabs", "tooltip"]}
          validate={(t) => (/^[a-z][a-z0-9-]*$/.test(t) ? true : "Use lowercase letters, numbers and dashes.")} />
      </Field>
    </div>
  );
}

export function ToolbarBasic() {
  return (
    <Toolbar aria-label="Canvas tools">
      <ToolbarButton asChild><Button variant="ghost" size="sm" icon={<Undo2 />} aria-label="Undo" /></ToolbarButton>
      <ToolbarButton asChild><Button variant="ghost" size="sm" icon={<Redo2 />} aria-label="Redo" /></ToolbarButton>
      <ToolbarSeparator />
      <ToolbarToggleGroup type="single" defaultValue="left" aria-label="Align">
        <ToolbarToggleItem value="left" aria-label="Align left"><AlignLeft size={16} /></ToolbarToggleItem>
        <ToolbarToggleItem value="center" aria-label="Align center"><AlignCenter size={16} /></ToolbarToggleItem>
        <ToolbarToggleItem value="right" aria-label="Align right"><AlignRight size={16} /></ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton asChild><Button size="sm" leftIcon={<Share />}>Share</Button></ToolbarButton>
    </Toolbar>
  );
}

export function MeterBasic() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-base">
      <Meter label="Credits used" value={182} max={200} high={160} optimum={0} valueText="182 of 200" />
      <Meter label="Token adoption" value={94} low={60} high={90} optimum={100} />
      <Meter label="Storage" value={41} valueText="4.1 of 10 GB" />
      <div className="flex items-center gap-base">
        <ProgressRing value={40} size="sm" label="Importing" />
        <ProgressRing value={72} showValue label="Sync" />
        <ProgressRing value={94} size="lg" showValue tone="success" label="Health score" />
        <ProgressRing label="Loading" />
      </div>
    </div>
  );
}

export function ItemBasic() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-base">
      <ItemGroup className="rounded-xl border border-secondary bg-primary">
        <Item media={<PenTool />} title="Figma" description="Acme UI Library · synced 2 hours ago" href="#" actions={<Badge variant="success" dot>Connected</Badge>} />
        <Item media={<GitPullRequest />} title="GitHub" description="acme/design-tokens" href="#" actions={<Button size="sm" variant="secondary">Sync</Button>} />
        <Item media={<MessageSquare />} title="Slack" description="Post releases to a channel" actions={<Button size="sm">Connect</Button>} />
      </ItemGroup>
      <Item variant="outline" media={<Avatar name="Ana Ruiz" status="online" />} title="Ana Ruiz" description="Design lead" actions={<Badge appearance="outline">Admin</Badge>} />
    </div>
  );
}

export function AspectRatioBasic() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-sm">
      <AspectRatio><div className="flex size-full items-center justify-center text-tertiary body-body-4-regular">16:9</div></AspectRatio>
      <AspectRatio ratio={1}><div className="flex size-full items-center justify-center text-tertiary body-body-4-regular">1:1</div></AspectRatio>
    </div>
  );
}
