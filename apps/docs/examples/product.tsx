"use client";
import * as React from "react";
import {
  Badge, Banner, Breadcrumb, Button, Card, Container, CopyButton, CopyField, DescriptionList, Field, Grid, Inline, Link, PageHeader, Stack, Tabs, TabsList, TabsTrigger, Tag, Timeline, VisuallyHidden,
} from "@flinbu/seed";
import { Check, Download, GitCompare, PenTool, Plus, Rocket, Terminal } from "lucide-react";

const box = "rounded-md border border-dashed border-primary px-sm py-xs text-secondary body-body-3-regular";

export function StackInline() {
  return (
    <Grid columns={2} gap="lg" className="w-full max-w-xl">
      <Stack gap="xs"><div className={box}>Token name</div><div className={box}>Value</div><div className={box}>Description</div></Stack>
      <Stack gap="sm" divider><div className={box}>Light</div><div className={box}>Dark</div></Stack>
      <Inline justify="between" className="col-span-full rounded-lg border border-secondary p-sm">
        <span className="text-primary label-label-2-medium">3 changes ready</span>
        <Inline><Button variant="tertiary" size="sm">Discard</Button><Button size="sm">Publish</Button></Inline>
      </Inline>
    </Grid>
  );
}

export function GridAuto() {
  return (
    <Grid minChild="xs" gap="sm" className="w-full max-w-2xl">
      {["Button", "Input", "Select", "Dialog", "Tabs", "Toast"].map((n) => (
        <Card key={n} className="p-base"><span className="text-primary label-label-2-medium">{n}</span><span className="text-tertiary body-body-4-regular">Up to date</span></Card>
      ))}
    </Grid>
  );
}

export function ContainerSizes() {
  return (
    <Stack gap="xs" className="w-full">
      {(["sm", "md", "prose"] as const).map((s) => <Container key={s} size={s} padding={false}><div className="rounded-md border border-secondary bg-secondary px-sm py-xs font-mono mono-value-regular">{s}</div></Container>)}
    </Stack>
  );
}

export function VisuallyHiddenBasic() {
  return (
    <Stack gap="sm">
      <VisuallyHidden as="a" href="#content" focusable>Skip to content</VisuallyHidden>
      <span className="text-secondary body-body-3-regular">Press Tab: a skip link appears in the corner.</span>
      <span className="text-primary heading-h5-semibold">94%<VisuallyHidden> of components use tokens</VisuallyHidden></span>
    </Stack>
  );
}

export function PageHeaderBasic() {
  return (
    <div className="w-full">
      <PageHeader
        breadcrumbs={<Breadcrumb items={[{ label: "Acme DS", href: "#" }, { label: "Tokens", href: "#" }, { label: "Color" }]} />}
        eyebrow="Collection" title="Color" meta={<><Badge variant="success" dot>Published</Badge><Badge appearance="outline">v2.4</Badge></>}
        description="446 tokens in two modes. Semantic tokens switch between Light and Dark; primitives are raw ingredients."
        actions={<><Button variant="secondary" leftIcon={<Download />}>Export</Button><Button leftIcon={<Plus />}>New token</Button></>}
        tabs={<Tabs defaultValue="all"><TabsList aria-label="Token views"><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="sem">Semantic</TabsTrigger><TabsTrigger value="prim">Primitives</TabsTrigger></TabsList></Tabs>} />
    </div>
  );
}

export function BannerVariants() {
  const [open, setOpen] = React.useState(true);
  return (
    <Stack gap="sm" className="w-full">
      {open ? <Banner action={<Button size="sm" variant="secondary">See what’s new</Button>} onDismiss={() => setOpen(false)}>Seed 0.2 adds 24 components.</Banner> : null}
      <Banner variant="warning" title="Figma sync paused." action={<Button size="sm" variant="secondary">Reconnect</Button>}>Your token changes are saved here.</Banner>
      <Banner variant="neutral">You’re viewing v2.3. Changes go into a new draft.</Banner>
      <Banner variant="error">We couldn’t reach GitHub, so nothing was published.</Banner>
    </Stack>
  );
}

export function TagBasic() {
  const [on, setOn] = React.useState(["Color"]);
  const [tags, setTags] = React.useState([["brand-500", "#2563EB"], ["neutral-900", "#171717"], ["success-600", "#16A34A"]]);
  return (
    <Stack gap="sm">
      <Inline><Tag>Draft</Tag><Tag icon={<PenTool />}>From Figma</Tag><Tag variant="accent">v2.4</Tag><Tag variant="success" icon={<Check />}>Published</Tag><Tag variant="warning">Drift</Tag><Tag variant="error">Broken alias</Tag></Inline>
      <Inline role="group" aria-label="Filter by type">
        {["Color", "Spacing", "Typography"].map((t) => <Tag key={t} selected={on.includes(t)} onClick={() => setOn(on.includes(t) ? on.filter((x) => x !== t) : [...on, t])}>{t}</Tag>)}
      </Inline>
      <Inline>{tags.map(([n, c]) => <Tag key={n} size="sm" swatch={c} onRemove={() => setTags(tags.filter((x) => x[0] !== n))}>{n}</Tag>)}</Inline>
    </Stack>
  );
}

export function CopyBasic() {
  return (
    <Stack gap="base" className="w-full max-w-md">
      <Field label="Install"><CopyField value="npm i @flinbu/seed @flinbu/seed-tokens" /></Field>
      <Field label="API key" hint="Anyone with this key can publish to your design system."><CopyField value="sk_live_51Hq8f2kLmN0pQrStUvWx" secret revealPrefix={8} /></Field>
      <Inline><code className="font-mono mono-value-regular text-primary">--bg-accent-solid</code><CopyButton value="var(--bg-accent-solid)" label="Copy CSS variable" /></Inline>
    </Stack>
  );
}

export function DescriptionListBasic() {
  return (
    <Stack gap="lg" className="w-full max-w-xl">
      <DescriptionList items={[{ term: "Token", description: "bg-accent-solid", mono: true, copy: true }, { term: "Light", description: "#2563EB", mono: true, copy: true }, { term: "Used by", description: "14 components" }, { term: "Owner" }]} />
      <DescriptionList layout="grid" items={[{ term: "Version", description: "v2.4.0" }, { term: "Published", description: "Oct 17, 2026" }, { term: "Tokens", description: "446" }]} />
    </Stack>
  );
}

export function TimelineBasic() {
  const now = new Date();
  const ago = (m: number) => new Date(now.getTime() - m * 60000);
  return (
    <Timeline className="w-full max-w-md" now={now} items={[
      { title: "v2.4 published", description: "12 tokens and 3 components went live.", time: ago(4), status: "success", icon: <Rocket /> },
      { title: "Ana approved Pluto’s proposal", description: "Darken text-tertiary in Light.", time: ago(52), status: "accent", icon: <Check /> },
      { title: "Figma sync found drift", description: "button/primary differs in 2 places.", time: ago(300), status: "warning", icon: <GitCompare /> },
      { title: "Draft created", time: ago(1560) },
    ]} />
  );
}

export function LinkBasic() {
  return (
    <Stack gap="sm" className="max-w-md">
      <p className="m-0 text-primary body-body-2-regular">Seed follows <Link href="#">WCAG 2.2 AA</Link> in Light and Dark. Read the <Link href="https://www.w3.org/WAI/WCAG22/quickref/" external>quick reference</Link>.</p>
      <Inline gap="base"><Link href="#" variant="standalone">View the changelog</Link><Link href="#" variant="subtle">Back to tokens</Link></Inline>
    </Stack>
  );
}
