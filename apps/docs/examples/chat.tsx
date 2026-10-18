"use client";
import * as React from "react";
import { Attachment, AttachmentGroup, Bubble, BubbleGroup, Button, CodeBlock, InputGroup, Marker, Message, MessageScroller, Questionnaire, Trace } from "@flinbu/seed";
import { ArrowUp, Copy, FileSearch, Palette, RotateCcw, ThumbsUp } from "lucide-react";

const actions = (
  <>
    <Button variant="ghost" size="sm" icon={<Copy />} aria-label="Copy" />
    <Button variant="ghost" size="sm" icon={<ThumbsUp />} aria-label="Helpful" />
    <Button variant="ghost" size="sm" icon={<RotateCcw />} aria-label="Try again" />
  </>
);

export function MessageBasic() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-lg">
      <Message from="user">Check my Dark theme for contrast.</Message>
      <Message from="assistant" actions={actions}>Three pairs fall below AA in Dark. The worst is text-accent-primary on bg-accent-primary at 3.1:1. I drafted a fix that moves it one step lighter.</Message>
      <Message from="user" status="error" footer={<Button variant="ghost" size="sm">Retry</Button>}>And Light?</Message>
    </div>
  );
}

export function BubbleVariants() {
  const [liked, setLiked] = React.useState(false);
  return (
    <div className="flex w-full max-w-xl flex-col gap-base">
      <BubbleGroup align="end">
        <Bubble align="end">Can you rename brand-500?</Bubble>
        <Bubble align="end">To accent-500, everywhere.</Bubble>
      </BubbleGroup>
      <Bubble variant="outline">Outline, for quoted content.</Bubble>
      <Bubble variant="muted">Muted, for a system note.</Bubble>
      <Bubble variant="accent" reactions={[{ icon: <ThumbsUp />, label: "Helpful", count: liked ? 3 : 2, pressed: liked, onPressedChange: setLiked }]}>Accent, for the one note that must stand out.</Bubble>
      <Bubble variant="error">That file couldn't be read. Try a JSON export.</Bubble>
    </div>
  );
}

const STEPS = [
  { title: "Read tokens.json", description: "435 tokens", icon: <FileSearch /> },
  { title: "Checked contrast in Dark", description: "3 below AA", icon: <Palette />, detail: "text-accent-primary on bg-accent-primary 3.1:1 · text-tertiary on bg-secondary 4.1:1 · text-on-accent on bg-accent-solid 4.3:1" },
  { title: "Drafting a proposal", status: "running" as const },
];

export function ConversationBasic() {
  const [turns, setTurns] = React.useState<{ id: number; from: "user" | "assistant"; text: string }[]>([
    { id: 1, from: "user", text: "What changed in v2.4?" },
    { id: 2, from: "assistant", text: "Eight tokens moved: the accent ramp is one step lighter in Dark, and two radius tokens were renamed. Nothing was removed." },
  ]);
  const [draft, setDraft] = React.useState("");
  const send = () => {
    const t = draft.trim(); if (!t) return;
    const id = turns.length + 1;
    setTurns((p) => [...p, { id, from: "user", text: t }]);
    setDraft("");
    setTimeout(() => setTurns((p) => [...p, { id: id + 1, from: "assistant", text: "I'll check that and propose a change for you to approve." }]), 600);
  };
  return (
    <div className="flex h-[min(32rem,80dvh)] w-full max-w-xl flex-col overflow-hidden rounded-petal rounded-tl-petal-tip border border-secondary bg-primary">
      <MessageScroller className="flex-1">
        <Marker variant="separator">Today</Marker>
        {turns.map((t) => <Message key={t.id} from={t.from} actions={t.from === "assistant" ? actions : undefined}>{t.text}</Message>)}
        <Trace summary="Pluto checked your Dark theme · 6s" steps={STEPS} />
        <Marker status="running">Checking 435 tokens</Marker>
      </MessageScroller>
      <div className="border-t border-secondary p-sm">
        <InputGroup multiline rows={2} aria-label="Message Pluto" placeholder="Ask Pluto…" value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          bottom={<Button size="sm" icon={<ArrowUp />} aria-label="Send" disabled={!draft.trim()} onClick={send} />} />
      </div>
    </div>
  );
}

export function AttachmentStates() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-sm">
      <Attachment name="tokens.json" description="JSON · 48 KB" href="#" onRemove={() => {}} />
      <Attachment name="brand-kit.fig" state="uploading" progress={64} onRemove={() => {}} />
      <Attachment name="export.zip" state="processing" />
      <Attachment name="logo.svg" state="error" description="Too large. Use a file under 5 MB." actions={<Button variant="ghost" size="sm">Retry</Button>} onRemove={() => {}} />
      <AttachmentGroup>
        <Attachment name="dark.json" size="sm" />
        <Attachment name="light.json" size="sm" />
        <Attachment name="type-scale.css" size="sm" />
        <Attachment name="spacing.json" size="sm" />
      </AttachmentGroup>
    </div>
  );
}

export function CodeBlockBasic() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-base">
      <CodeBlock title="button.tsx" lineNumbers highlightLines={[4]} code={`import { Button } from "@flinbu/seed";

export function Save() {
  return <Button variant="primary">Save changes</Button>;
}`} />
      <CodeBlock language="bash" code="npm i @flinbu/seed @flinbu/seed-tokens" />
    </div>
  );
}

export function CodeBlockDiff() {
  return (
    <CodeBlock className="w-full max-w-xl" title="tokens.css · Dark" language="diff" diffLanguage="css" code={`  --bg-accent-primary: var(--blue-900);
-  --text-accent-primary: var(--blue-400);
+  --text-accent-primary: var(--blue-300);
  --border-accent-primary: var(--blue-500);`} />
  );
}

export function MarkerVariants() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-base">
      <Marker variant="separator">Today</Marker>
      <Marker icon={<FileSearch />}>Opened tokens.json</Marker>
      <Marker status="running">Checking 435 tokens for contrast</Marker>
      <Marker status="error">Couldn't reach Figma. Your tokens are saved.</Marker>
      <Marker variant="border" href="#">Proposal #12 opened</Marker>
    </div>
  );
}

export function TraceBasic() {
  return <Trace className="w-full max-w-xl" summary="Pluto checked your Dark theme · 6s" steps={[...STEPS.slice(0, 2), { title: "Opened proposal #12", href: "#" }, { title: "Ask for review", status: "pending" }]} />;
}

export function QuestionnaireBasic() {
  const [sent, setSent] = React.useState<string | null>(null);
  return (
    <div className="flex w-full max-w-xl flex-col gap-sm rounded-petal rounded-tl-petal-tip border border-secondary bg-primary p-base">
      <Questionnaire onCancel={() => setSent("Not now")} onSubmit={(a) => setSent(JSON.stringify(a))} items={[
        { name: "scope", prompt: "Which themes should I check?", required: true, multiple: true, choices: [
          { value: "light", label: "Light" }, { value: "dark", label: "Dark", description: "3 pairs were flagged last week" }, { value: "hc", label: "High contrast" }] },
        { name: "level", prompt: "Which level?", required: true, choices: [{ value: "aa", label: "AA", description: "4.5:1 for body text" }, { value: "aaa", label: "AAA", description: "7:1 for body text" }] },
        { name: "note", prompt: "Anything I should skip?", input: { label: "What to skip", placeholder: "For example, illustration colors" } },
      ]} />
      {sent ? <p className="m-0 text-tertiary body-body-4-regular">Sent: {sent}</p> : null}
    </div>
  );
}
