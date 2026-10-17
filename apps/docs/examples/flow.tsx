"use client";
import * as React from "react";
import { Avatar, Badge, Button, Field, HoverCard, OtpInput, Sidebar, Slider, Stepper } from "@flinbu/seed";
import { BookOpen, Component, House, Palette, Settings, Users } from "lucide-react";

export function SliderBasic() {
  const [range, setRange] = React.useState<number | number[]>([4, 24]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-base">
      <Field label="Opacity"><Slider defaultValue={64} step={4} showValue formatValue={(v) => `${v}%`} /></Field>
      <Field label="Spacing scale" hint="The smallest and largest steps, in px."><Slider value={range} onValueChange={setRange} min={0} max={64} step={2} showValue formatValue={(v) => `${v}px`} /></Field>
    </div>
  );
}

export function OtpBasic() {
  const [code, setCode] = React.useState("");
  return (
    <div className="flex flex-col gap-base">
      <Field label="Verification code" hint="We sent 6 digits to felipe@example.com." error={code.length === 6 && code !== "246810" ? "That code didn’t match. Check the latest email." : undefined}>
        <OtpInput value={code} onChange={setCode} groupSize={3} />
      </Field>
      <span className="text-tertiary body-body-4-regular">Try 246810.</span>
    </div>
  );
}

export function StepperBasic() {
  const [step, setStep] = React.useState(2);
  const steps = ["Brief", "Tokens", { label: "Components", description: "12 drafted" }, { label: "Docs", optional: true }];
  return (
    <div className="flex w-full max-w-xl flex-col gap-lg">
      <Stepper steps={steps} current={step} onStepClick={setStep} />
      <div className="flex justify-center gap-xs">
        <Button variant="tertiary" size="sm" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
        <Button size="sm" disabled={step === steps.length} onClick={() => setStep(step + 1)}>{step >= steps.length - 1 ? "Finish" : "Next"}</Button>
      </div>
    </div>
  );
}

export function StepperVertical() {
  return <Stepper orientation="vertical" size="sm" current={1} steps={[{ label: "Connect Figma", description: "Acme UI Library" }, { label: "Map modes", description: "Light, Dark" }, { label: "Review import" }]} />;
}

export function SidebarBasic() {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <div className="flex h-[30rem] w-full max-w-2xl overflow-hidden rounded-xl border border-secondary bg-primary">
      <Sidebar collapsible collapsed={collapsed} onCollapsedChange={setCollapsed}
        header={<span className="label-label-1-semibold text-primary">Acme DS</span>}
        items={[
          { label: "Home", icon: <House />, href: "#" },
          { type: "section", label: "System" },
          { label: "Tokens", icon: <Palette />, defaultOpen: true, items: [{ label: "Color", href: "#", active: true }, { label: "Spacing", href: "#" }, { label: "Type", href: "#" }] },
          { label: "Components", icon: <Component />, href: "#", badge: 31 },
          { label: "Docs", icon: <BookOpen />, href: "#" },
          { type: "section", label: "Workspace" },
          { label: "Members", icon: <Users />, href: "#" },
          { label: "Settings", icon: <Settings />, href: "#" },
        ]}
        footer={(small) => <div className="flex items-center gap-xs px-xxs"><Avatar name="Felipe Linares" size="xs" />{small ? null : <span className="truncate text-primary label-label-3-medium">Felipe Linares</span>}</div>} />
      <div className="flex-1 p-lg text-secondary body-body-3-regular">Page content</div>
    </div>
  );
}

export function HoverCardBasic() {
  return (
    <p className="m-0 text-secondary body-body-3-regular">
      Approved by{" "}
      <HoverCard content={
        <div className="flex gap-sm">
          <Avatar name="Ana Ruiz" />
          <div className="flex flex-col gap-xxxs">
            <span className="text-primary label-label-2-semibold">Ana Ruiz</span>
            <span className="text-secondary body-body-4-regular">Design lead · Acme</span>
            <span className="mt-xxs"><Badge variant="success" dot>Online</Badge></span>
          </div>
        </div>}>
        <a href="#" className="text-link underline underline-offset-3">Ana Ruiz</a>
      </HoverCard>{" "}2 hours ago.
    </p>
  );
}
