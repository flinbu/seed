"use client";
import * as React from "react";
import { Avatar, Button, CommentThread, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Field, Heading, MentionInput, NavigationMenu, TableOfContents, Text, TimePicker, Tour, Typography, type ThreadComment } from "@flinbu/seed";
import { BookOpen, Component, Download, Ellipsis, Map, Palette, Sun, Trash2 } from "lucide-react";

export function TypographyBasic() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-lg">
      <div className="flex flex-col gap-xs">
        <Text variant="label">Collection</Text>
        <Heading level={2} size={4}>Color</Heading>
        <Text variant="lead">446 tokens in Light and Dark.</Text>
      </div>
      <Typography>
        <h2>How modes work</h2>
        <p>Semantic tokens have a value per mode and switch with <code>data-theme</code>. Primitives are <a href="#">raw ingredients</a> for charts and illustration.</p>
        <ul><li>Use <strong>bg-primary</strong> for pages and cards.</li><li>Show customer colors on <code>bg-stage</code>.</li></ul>
        <blockquote>Selection is neutral. Blue is for the primary action, focus and links.</blockquote>
      </Typography>
    </div>
  );
}

export function NavigationMenuBasic() {
  return (
    <div className="flex min-h-80 w-full justify-center">
      <NavigationMenu items={[
        { label: "Product", links: [
          { label: "Tokens", href: "#", description: "Every value, in Light and Dark", icon: <Palette /> },
          { label: "Components", href: "#", description: "Synced with Figma", icon: <Component /> },
          { label: "Docs", href: "#", description: "Written with Pluto", icon: <BookOpen /> },
          { label: "Export", href: "#", description: "CSS, Tailwind, iOS, Android", icon: <Download /> },
        ], columns: 2, footer: "New: themes with one command." },
        { label: "Pricing", href: "#" },
        { label: "Docs", href: "#", current: true },
      ]} />
    </div>
  );
}

const PEOPLE = [
  { value: "ana", label: "Ana Ruiz", description: "Design lead", icon: <Avatar name="Ana Ruiz" size="xs" /> },
  { value: "mei", label: "Mei Chen", description: "Engineer", icon: <Avatar name="Mei Chen" size="xs" /> },
];
const TOKENS = ["bg-accent-solid", "text-primary", "border-secondary", "radius-petal"].map((t) => ({ value: t, label: t, icon: <Palette /> }));
export function MentionBasic() {
  return (
    <div className="w-full max-w-md">
      <Field label="Comment" hint="Type @ to mention someone or # to link a token. ⌘ Enter sends.">
        <MentionInput sources={{ "@": PEOPLE, "#": TOKENS }} placeholder="Leave a comment" defaultValue="Can you check the hover state on " />
      </Field>
    </div>
  );
}

export function TimePickerBasic() {
  const [t, setT] = React.useState<string | null>("09:30");
  return (
    <div className="grid w-full max-w-md gap-base sm:grid-cols-2">
      <Field label="Publish at" hint="Type 2:15pm or 1415."><TimePicker value={t} onValueChange={setT} /></Field>
      <Field label="Quiet hours start"><TimePicker defaultValue="22:00" hourCycle={24} step={30} /></Field>
    </div>
  );
}

export function TourBasic() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex w-full max-w-lg flex-col gap-base">
      <div className="flex items-center justify-between rounded-lg border border-secondary p-xs">
        <div className="flex gap-xs"><Button id="tour-import" variant="secondary" size="sm" leftIcon={<Download />}>Import</Button><Button id="tour-theme" variant="ghost" size="sm" icon={<Sun />} aria-label="Theme" /></div>
        <Button id="tour-publish" size="sm">Publish</Button>
      </div>
      <Button variant="tertiary" size="sm" leftIcon={<Map />} className="self-start" onClick={() => setOpen(true)}>Start tour</Button>
      <Tour open={open} onOpenChange={setOpen} steps={[
        { target: "#tour-import", title: "Bring your tokens in", body: "Import from Figma or a JSON file. Nothing changes until you review it." },
        { target: "#tour-theme", title: "Check both modes", body: "Switch between Light and Dark to see every token in context." },
        { target: "#tour-publish", title: "Publish when ready", body: "Publishing creates a version your team can install.", align: "end" },
      ]} />
    </div>
  );
}

const SECS = [["principles", "Design principles", 2], ["calm", "Calm by default", 3], ["clear", "Clear over clever", 3], ["voice", "Voice and tone", 2], ["writing", "Writing guidelines", 2]] as const;
export function TocBasic() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-[1fr_12rem] items-start gap-lg">
      <div id="toc-scroll" className="h-60 overflow-y-auto pr-sm">
        {SECS.map(([id, label, l]) => (
          <section key={id} className="min-h-36">
            {React.createElement(l === 2 ? "h3" : "h4", { id, className: "m-0 mb-xs text-primary label-label-1-semibold" }, label)}
            <p className="m-0 text-secondary body-body-3-regular">Scroll this column. The list follows along.</p>
          </section>
        ))}
      </div>
      <TableOfContents root="#toc-scroll" offset={8} items={SECS.map(([id, label, level]) => ({ id, label, level }))} />
    </div>
  );
}

export function CommentThreadBasic() {
  const now = new Date();
  const [c, setC] = React.useState<ThreadComment[]>([
    { id: 1, author: { name: "Ana Ruiz", role: "Design lead" }, body: "The hover state on secondary feels too close to rest in Dark. One step lighter?", time: new Date(now.getTime() - 3 * 36e5) },
    { id: 2, author: { name: "Mei Chen" }, body: "Agreed. bg-secondary-hover is 1.1:1 against bg-secondary.", time: new Date(now.getTime() - 2 * 36e5) },
  ]);
  return (
    <CommentThread className="w-full max-w-md" anchor="button/secondary · Dark" comments={c}
      commentActions={() => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" icon={<Ellipsis />} aria-label="More actions" /></DropdownMenuTrigger>
          <DropdownMenuContent align="end"><DropdownMenuItem icon={<Trash2 />} destructive>Delete</DropdownMenuItem></DropdownMenuContent>
        </DropdownMenu>
      )}
      onReply={(t) => setC([...c, { id: Date.now(), author: { name: "Felipe Linares" }, body: t, time: new Date() }])} />
  );
}
