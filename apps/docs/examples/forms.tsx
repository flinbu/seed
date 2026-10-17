"use client";
import { Field, Input, Textarea, Label } from "@flinbu/seed";
import { Search, Mail } from "lucide-react";

export function InputSizes() {
  return (
    <div className="flex w-full min-w-72 max-w-sm flex-col gap-sm">
      <Input size="sm" placeholder="Small" />
      <Input placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  );
}

export function InputIcons() {
  return (
    <div className="flex w-full min-w-72 max-w-sm flex-col gap-sm">
      <Input leftIcon={<Search />} placeholder="Search tokens" />
      <Input leftIcon={<Mail />} type="email" defaultValue="ana@flinbu.co" invalid />
      <Input placeholder="Disabled" disabled />
    </div>
  );
}

export function FieldStates() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-base sm:grid-cols-2">
      <Field label="Workspace name" hint="Shown to your team and clients." required>
        <Input defaultValue="flinbu" />
      </Field>
      <Field label="Email" error="Enter an email like name@company.com.">
        <Input type="email" defaultValue="ana@" />
      </Field>
      <Field label="Website" labelAside="Optional">
        <Input placeholder="https://" />
      </Field>
      <Field label="Notes" hint="Markdown works.">
        <Textarea placeholder="What changed and why" />
      </Field>
    </div>
  );
}

export function TextareaBasic() {
  return (
    <div className="w-full max-w-sm">
      <Textarea placeholder="Describe the change" rows={4} />
    </div>
  );
}

export function LabelBasic() {
  return (
    <div className="flex flex-col gap-xxs">
      <Label htmlFor="org" required>Organization</Label>
      <input id="org" className="sr-only" />
      <Label size="sm">Small label</Label>
    </div>
  );
}
