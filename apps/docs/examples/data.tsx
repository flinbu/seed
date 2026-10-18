"use client";
import * as React from "react";
import { Badge, Button, Card, Carousel, Chart, DataTable, DirectionProvider, Field, Resizable, ResizablePanel, RichTextEditor, StatTile, type DataTableColumn } from "@flinbu/seed";
import { Archive, Boxes, CircleAlert, Coins, Plus } from "lucide-react";

const WEEKS = [
  { x: "Jul 7", tokens: 210, raw: 88 }, { x: "Jul 14", tokens: 244, raw: 80 }, { x: "Jul 21", tokens: 268, raw: 71 }, { x: "Jul 28", tokens: 290, raw: 66 },
  { x: "Aug 4", tokens: 312, raw: 54 }, { x: "Aug 11", tokens: 380, raw: 41 }, { x: "Aug 18", tokens: 446, raw: 22 },
];

export function ChartBar() {
  return <Chart className="w-full" title="Token references" description="Tokens vs raw values in code, by week" data={WEEKS} series={[{ key: "tokens", label: "Tokens" }, { key: "raw", label: "Raw values" }]} />;
}
export function ChartStacked() {
  return <Chart className="w-full" type="stacked" title="Components by status" data={[
    { x: "Web", published: 42, draft: 8, deprecated: 3 }, { x: "iOS", published: 31, draft: 12, deprecated: 1 }, { x: "Android", published: 28, draft: 9, deprecated: 4 }, { x: "Email", published: 12, draft: 3, deprecated: 0 },
  ]} series={[{ key: "published", label: "Published" }, { key: "draft", label: "Draft" }, { key: "deprecated", label: "Deprecated" }]} />;
}
export function ChartLine() {
  return <Chart className="w-full" type="line" labels="end" title="Adoption" description="Share of components using tokens" valueFormat={(v) => `${v}%`}
    data={[{ x: "Mar", web: 61, ios: 48 }, { x: "Apr", web: 70, ios: 55 }, { x: "May", web: 76, ios: 63 }, { x: "Jun", web: 84, ios: 70 }, { x: "Jul", web: 90, ios: 78 }, { x: "Aug", web: 94, ios: 86 }]}
    series={[{ key: "web", label: "Web" }, { key: "ios", label: "iOS" }]} />;
}
export function ChartArea() {
  return <Chart className="w-full" type="area" title="Pluto credits used" data={WEEKS.map((w) => ({ x: w.x, credits: w.tokens * 4 }))} series={[{ key: "credits", label: "Credits" }]} height={200} />;
}

export function StatTiles() {
  return (
    <div className="grid w-full grid-cols-1 gap-sm sm:grid-cols-3">
      <StatTile icon={<Boxes />} label="Components using tokens" value={94} format={(v) => `${v}%`} delta={{ value: 3, period: "last month" }} trend={[78, 82, 85, 88, 90, 94]} />
      <StatTile icon={<CircleAlert />} label="Open contrast issues" value={3} delta={{ value: -5, unit: "", goodWhen: "down", period: "last week" }} />
      <StatTile icon={<Coins />} label="Credits left" value={1820} delta={{ value: -12, period: "last month" }} />
    </div>
  );
}

type Row = { id: number; name: string; status: "Published" | "Draft" | "Deprecated"; owner: string; uses: number; updated: string };
const OWNERS = ["Ana Ruiz", "Mei Chen", "Tomás Gil", "Jon Berg"];
const NAMES = ["accordion", "alert", "avatar", "badge", "banner", "button", "card", "checkbox", "combobox", "dialog", "drawer", "input", "menu", "popover", "select", "sheet", "slider", "switch", "tabs", "toast", "tooltip"];
const ROWS: Row[] = NAMES.map((n, i) => ({ id: i + 1, name: n, status: i % 5 === 0 ? "Draft" : i % 7 === 0 ? "Deprecated" : "Published", owner: OWNERS[i % 4]!, uses: (i * 53) % 240, updated: `Aug ${(i % 20) + 1}` }));
const COLUMNS: DataTableColumn<Row>[] = [
  { key: "name", header: "Component", hideable: false, render: (r) => <span className="font-mono text-primary">{r.name}</span> },
  { key: "status", header: "Status", render: (r) => <Badge variant={r.status === "Published" ? "success" : r.status === "Draft" ? "neutral" : "warning"}>{r.status}</Badge> },
  { key: "owner", header: "Owner" },
  { key: "uses", header: "Uses", align: "right", className: "tabular-nums" },
  { key: "updated", header: "Updated", sortable: false },
];
export function DataTableBasic() {
  return (
    <DataTable<Row> className="w-full" aria-label="Components" columns={COLUMNS} rows={ROWS} pageSize={6} noun={["component", "components"]} selectable
      defaultSort={{ key: "uses", dir: "desc" }}
      toolbar={<Button size="sm" leftIcon={<Plus />}>New component</Button>}
      bulkActions={(rows, clear) => <Button size="sm" variant="secondary" leftIcon={<Archive />} onClick={clear}>Archive {rows.length}</Button>} />
  );
}

const PRESETS = [
  { name: "Seed", colors: ["#2563eb", "#171717", "#f5f5f5"] }, { name: "Meadow", colors: ["#16a34a", "#14532d", "#f0fdf4"] }, { name: "Dusk", colors: ["#7c3aed", "#1e1b4b", "#f5f3ff"] },
  { name: "Ember", colors: ["#ea580c", "#431407", "#fff7ed"] }, { name: "Tide", colors: ["#0891b2", "#164e63", "#ecfeff"] }, { name: "Rose", colors: ["#db2777", "#500724", "#fdf2f8"] },
];
export function CarouselBasic() {
  return (
    <Carousel className="w-full max-w-xl" aria-label="Theme presets" slidesPerView={2.5} items={PRESETS.map((p) => (
      <Card key={p.name} className="flex flex-col gap-sm p-sm">
        <div className="flex h-(--size-5xl) overflow-hidden rounded-md">{p.colors.map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}</div>
        <span className="text-primary label-label-2-medium">{p.name}</span>
      </Card>
    ))} />
  );
}

export function ResizableBasic() {
  return (
    <div className="h-80 w-full overflow-hidden rounded-lg border border-secondary bg-primary">
      <Resizable withHandle>
        <ResizablePanel label="list" defaultSize={24} minSize={16}><div className="p-sm text-secondary body-body-3-regular">Tokens</div></ResizablePanel>
        <ResizablePanel label="canvas" minSize={30}>
          <Resizable direction="vertical">
            <ResizablePanel label="preview" defaultSize={65}><div className="seed-checker flex h-full items-center justify-center"><Button>Preview</Button></div></ResizablePanel>
            <ResizablePanel label="code"><pre className="m-0 p-sm font-mono text-secondary body-body-4-regular">{'<Button>Preview</Button>'}</pre></ResizablePanel>
          </Resizable>
        </ResizablePanel>
        <ResizablePanel label="inspector" defaultSize={26} minSize={18}><div className="p-sm text-secondary body-body-3-regular">Inspector</div></ResizablePanel>
      </Resizable>
    </div>
  );
}

export function DirectionBasic() {
  return (
    <DirectionProvider dir="rtl">
      <div className="flex w-full max-w-xl flex-col gap-base">
        <Carousel aria-label="قوالب" items={["١", "٢", "٣", "٤"].map((n) => <Card key={n} className="flex h-24 items-center justify-center text-primary heading-h4-semibold">{n}</Card>)} slidesPerView={2} />
        <div className="h-32 overflow-hidden rounded-lg border border-secondary">
          <Resizable><ResizablePanel label="القائمة" defaultSize={35}><div className="p-sm text-secondary body-body-3-regular">القائمة</div></ResizablePanel><ResizablePanel><div className="p-sm text-secondary body-body-3-regular">المحتوى</div></ResizablePanel></Resizable>
        </div>
      </div>
    </DirectionProvider>
  );
}

export function RichTextBasic() {
  const [html, setHtml] = React.useState("");
  return (
    <div className="flex w-full max-w-xl flex-col gap-sm">
      <Field label="Release notes" hint="Pluto can draft these from the changes.">
        <RichTextEditor placeholder="What changed in this version?" showCount onChange={setHtml}
          defaultValue="<h2>v2.4</h2><p>The accent ramp is <b>one step lighter</b> in Dark.</p><ul><li>Renamed <code>radius-lg</code> to <code>radius-petal</code></li><li>New tokens for charts</li></ul>" />
      </Field>
      {html ? <pre className="m-0 overflow-x-auto rounded-md bg-inset p-sm font-mono text-tertiary body-body-4-regular">{html}</pre> : null}
    </div>
  );
}
export function RichTextComment() {
  return <Field label="Comment"><RichTextEditor toolbar={["bold", "italic", "code", "|", "link", "ul"]} minHeight={80} maxLength={280} placeholder="Add a comment…" /></Field>;
}
