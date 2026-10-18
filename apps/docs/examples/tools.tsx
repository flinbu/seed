"use client";
import * as React from "react";
import { Button, ColorPicker, ColorScale, ColorSwatch, ContrastPair, Field, NumberInput, PropsTable, Stage, TokenInput, TokenPreview, TypeSpecimen, Badge, Card } from "@flinbu/seed";
import { Code } from "lucide-react";

const BLUE = { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" };

export function SwatchLayouts() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-lg">
      <div className="flex flex-wrap gap-sm">
        <ColorSwatch color="var(--bg-accent-solid)" name="bg-accent-solid" alias="blue-600" usage="Primary actions" />
        <ColorSwatch color="var(--bg-error-primary)" name="bg-error-primary" alias="red-50" usage="Error surfaces" />
        <ColorSwatch color="var(--bg-overlay-alpha-primary)" name="overlay-alpha-primary" usage="Behind dialogs" />
      </div>
      <div className="flex flex-col">
        <ColorSwatch layout="row" color="var(--text-primary)" name="text-primary" alias="neutral-900" />
        <ColorSwatch layout="row" color="var(--text-secondary)" name="text-secondary" alias="neutral-600" />
        <ColorSwatch layout="row" color="var(--text-tertiary)" name="text-tertiary" alias="neutral-500" />
      </div>
    </div>
  );
}

export function ScaleBasic() {
  const [step, setStep] = React.useState("600");
  return (
    <div className="flex w-full max-w-2xl flex-col gap-lg">
      <ColorScale name="blue" colors={BLUE} anchor="600" showValues />
      <ColorScale name="Pick a step" colors={BLUE} value={step} onValueChange={setStep} />
      <p className="m-0 text-secondary body-body-3-regular">Picked blue-{step}.</p>
    </div>
  );
}

export function TokenPreviewKinds() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-sm">
      <TokenPreview name="space-xs" value="var(--space-xs)" display="8px" usage="Inside controls" />
      <TokenPreview name="space-base" value="var(--space-base)" display="16px" />
      <TokenPreview name="space-2xl" value="var(--space-2xl)" display="32px" />
      <div className="flex flex-wrap gap-sm pt-sm">
        <TokenPreview layout="tile" kind="radius" name="radius-petal" value="var(--radius-petal)" display="12px" />
        <TokenPreview layout="tile" kind="shadow" name="elevation-md" value="var(--elevation-md)" display="elevation-md" />
        <TokenPreview layout="tile" kind="border" name="border-thick" value="2px" />
        <TokenPreview layout="tile" kind="opacity" name="opacity-disabled" value="0.4" />
        <TokenPreview layout="tile" kind="duration" name="duration-slow" value="var(--duration-slow)" display="320ms" />
      </div>
    </div>
  );
}

export function TypeSpecimenBasic() {
  return (
    <div className="flex w-full max-w-2xl flex-col">
      <TypeSpecimen styleName="display-headline-regular" sample="Tokens, in sync" usage="Marketing headlines" />
      <TypeSpecimen styleName="heading-h5-semibold" sample="Color tokens" />
      <TypeSpecimen styleName="body-body-3-regular" sample="Semantic tokens switch with the theme." />
      <TypeSpecimen styleName="label-label-2-medium" sample="Save changes" usage="Buttons and labels" />
      <TypeSpecimen styleName="mono-value-regular" sample="bg-accent-solid" />
    </div>
  );
}

export function ContrastPairs() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-lg">
      <ContrastPair label="Primary button" fg="var(--button-primary-text)" bg="var(--button-primary)" themes={["light", "dark"]} />
      <ContrastPair label="Tertiary text on secondary" fg="var(--text-tertiary)" bg="var(--bg-secondary)" themes={["light", "dark"]} />
      <ContrastPair label="Focus ring" kind="ui" fg="var(--border-accent-primary)" bg="var(--bg-primary)" themes={["light", "dark"]} />
    </div>
  );
}

export function ColorPickerBasic() {
  const [color, setColor] = React.useState("#2563eb");
  return (
    <div className="flex w-full max-w-xl flex-col gap-lg">
      <Field label="Brand color" hint="Pluto builds the ramp from it."><ColorPicker value={color} onValueChange={setColor} swatches={["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2"]} /></Field>
      <div className="flex flex-wrap items-start gap-lg">
        <ColorPicker inline value={color} onValueChange={setColor} aria-label="Brand color, inline" />
        <ColorSwatch color={color} name="brand-500" />
      </div>
    </div>
  );
}

const TOKENS = [
  { name: "bg-primary", value: "#ffffff", color: "var(--bg-primary)", group: "Semantic" },
  { name: "bg-secondary", value: "#fafafa", color: "var(--bg-secondary)", group: "Semantic" },
  { name: "bg-accent-solid", value: "#2563eb", color: "var(--bg-accent-solid)", group: "Semantic" },
  { name: "text-tertiary", value: "#737373", color: "var(--text-tertiary)", group: "Semantic" },
  { name: "space-base", value: "16px", kind: "space" },
  { name: "radius-petal", value: "12px", kind: "radius" },
  { name: "blue-600", value: "#2563eb", group: "Primitive" },
];
export function TokenInputBasic() {
  const [v, setV] = React.useState<string | null>("bg-accent-solid");
  return (
    <div className="flex w-full max-w-sm flex-col gap-sm">
      <Field label="Background" hint="Prefer semantic tokens."><TokenInput tokens={TOKENS} value={v} onValueChange={setV} clearable /></Field>
    </div>
  );
}

export function NumberInputBasic() {
  return (
    <div className="grid w-full max-w-xl grid-cols-1 gap-base sm:grid-cols-3">
      <Field label="Radius"><NumberInput unit="px" defaultValue={12} min={0} max={48} /></Field>
      <Field label="Duration"><NumberInput unit="ms" defaultValue={200} min={0} step={20} /></Field>
      <Field label="Opacity"><NumberInput unit="%" defaultValue={40} min={0} max={100} stepper={false} /></Field>
    </div>
  );
}

export function StageBasic() {
  return (
    <Stage className="w-full" title="Card" height="16rem" widths={["full", "tablet", "mobile"]} actions={<Button variant="ghost" size="sm" leftIcon={<Code />}>Show code</Button>}>
      <Card className="w-full max-w-sm p-base">
        <div className="flex items-center justify-between gap-sm">
          <span className="text-primary label-label-1-medium">Color</span>
          <Badge variant="success">Published</Badge>
        </div>
        <p className="mt-xs mb-base text-secondary body-body-3-regular">446 tokens in Light and Dark.</p>
        <Button size="sm">Open</Button>
      </Card>
    </Stage>
  );
}

export function PropsTableBasic() {
  return (
    <PropsTable className="w-full" component="Button" props={[
      { name: "variant", type: "'primary' | 'secondary' | 'ghost' | 'tertiary' | 'destructive'", default: "'primary'", description: "How much the action stands out." },
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "32, 40 or 48 px tall." },
      { name: "loading", type: "boolean", default: "false", description: "Shows a spinner and blocks clicks." },
      { name: "children", type: "ReactNode", required: true, description: "The label, a verb." },
    ]} />
  );
}
