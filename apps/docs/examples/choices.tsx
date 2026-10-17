"use client";
import * as React from "react";
import { Checkbox, RadioGroup, Radio, Switch, Toggle, ToggleGroup, ToggleGroupItem } from "@flinbu/seed";
import { Bold, Italic, Underline, LayoutGrid, List } from "lucide-react";

export function CheckboxStates() {
  return (
    <div className="flex flex-col gap-sm">
      <Checkbox label="Include Dark" defaultChecked />
      <Checkbox label="Sync with Figma" description="Changes go to the Seed Library file." />
      <Checkbox label="Some components" indeterminate />
      <Checkbox label="Disabled" disabled />
    </div>
  );
}

export function RadioBasic() {
  return (
    <RadioGroup aria-label="Billing" defaultValue="monthly">
      <Radio value="monthly" label="Monthly" description="$39 per editor" />
      <Radio value="yearly" label="Yearly" description="2 months free" />
      <Radio value="later" label="Decide later" disabled />
    </RadioGroup>
  );
}

export function RadioHorizontal() {
  return (
    <RadioGroup aria-label="Density" orientation="horizontal" defaultValue="default">
      <Radio value="compact" label="Compact" />
      <Radio value="default" label="Default" />
      <Radio value="comfortable" label="Comfortable" />
    </RadioGroup>
  );
}

export function SwitchStates() {
  return (
    <div className="flex flex-col gap-sm">
      <Switch label="Sync with Figma" defaultChecked />
      <Switch label="Email me when Pluto proposes a change" description="One email per change request." />
      <Switch size="sm" label="Small" />
      <Switch label="Disabled" disabled />
    </div>
  );
}

export function ToggleBasic() {
  return (
    <>
      <Toggle aria-label="Bold" icon={<Bold />} />
      <Toggle defaultPressed leftIcon={<Italic />}>Italic</Toggle>
    </>
  );
}

export function ToggleGroups() {
  return (
    <>
      <ToggleGroup type="single" variant="outline" defaultValue="grid" allowEmpty={false} aria-label="View">
        <ToggleGroupItem value="grid" icon={<LayoutGrid />} aria-label="Grid" />
        <ToggleGroupItem value="list" icon={<List />} aria-label="List" />
      </ToggleGroup>
      <ToggleGroup type="multiple" aria-label="Text style" defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" icon={<Bold />} aria-label="Bold" />
        <ToggleGroupItem value="italic" icon={<Italic />} aria-label="Italic" />
        <ToggleGroupItem value="underline" icon={<Underline />} aria-label="Underline" />
      </ToggleGroup>
      <ToggleGroup type="single" variant="outline" size="sm" defaultValue="light" aria-label="Theme">
        <ToggleGroupItem value="light">Light</ToggleGroupItem>
        <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
        <ToggleGroupItem value="system">System</ToggleGroupItem>
      </ToggleGroup>
    </>
  );
}
