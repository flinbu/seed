import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  Attachment, AttachmentGroup, Bubble, Button, CodeBlock, Marker, Message, MessageScroller, Questionnaire, Trace, highlightLine,
} from "../src/index.js";
import { violations } from "./a11y.js";

const QUESTIONS = [
  { name: "scope", prompt: "What should I check?", required: true, choices: [{ value: "dark", label: "Dark theme" }, { value: "all", label: "Every theme" }] },
  { name: "name", prompt: "Name the proposal", input: { label: "Proposal name" } },
];

describe("chat parts render accessibly", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <MessageScroller height={400}>
          <Marker variant="separator">Today</Marker>
          <Message from="user" time="9:41">Check my Dark theme for contrast.</Message>
          <Trace summary="Pluto checked your Dark theme · 6s" steps={[{ title: "Read tokens.json", description: "435 tokens" }, { title: "Found 3 pairs below AA", detail: "bg-accent-solid on text-on-accent" }, { title: "Drafting a proposal", status: "running" }]} />
          <Message from="assistant" actions={<Button variant="ghost" size="sm" aria-label="Copy">C</Button>}>Three pairs fall below AA.</Message>
          <Marker status="running">Checking 435 tokens</Marker>
        </MessageScroller>
        <AttachmentGroup>
          <Attachment name="tokens.json" description="JSON · 48 KB" onRemove={() => {}} />
          <Attachment name="brand.fig" state="uploading" progress={40} />
          <Attachment name="logo.svg" state="error" description="Too large. Use a file under 5 MB." />
        </AttachmentGroup>
        <CodeBlock title="button.tsx" code={'const a = 1;\nexport function B() { return <Button /> }'} lineNumbers highlightLines={[2]} />
        <CodeBlock language="diff" code={"-  --bg: #fff;\n+  --bg: var(--bg-primary);\n   color: red;"} />
        <Bubble variant="accent" reactions={[{ label: "Helpful", count: 2, icon: <span>+</span> }]}>Pinned note</Bubble>
        <Questionnaire items={QUESTIONS} />
      </main>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("Message and Bubble", () => {
  it("puts user strings in a neutral bubble on the end and marks failed sends", () => {
    const { container } = render(<><Message from="user" status="error">Hello</Message><Message from="assistant">Hi</Message></>);
    const [user, assistant] = container.querySelectorAll("[data-from]");
    expect(user!.className).toContain("flex-row-reverse");
    expect(user!.querySelector(".bg-tertiary")?.textContent).toBe("Hello");
    expect(screen.getByText("Not sent")).toBeTruthy();
    expect(assistant!.querySelector(".font-reading")?.textContent).toBe("Hi");
  });
  it("names reactions with their count", async () => {
    const user = userEvent.setup();
    const press = vi.fn();
    render(<Bubble reactions={[{ label: "Helpful", count: 3, onPressedChange: press }]}>Nice</Bubble>);
    await user.click(screen.getByRole("button", { name: "Helpful, 3" }));
    expect(press).toHaveBeenCalledWith(true);
  });
});

describe("MessageScroller", () => {
  it("is a polite log and marks user turns as anchors", () => {
    const { container } = render(<MessageScroller><Message from="user">Q</Message><Message>A</Message><Message from="user" scrollAnchor={false}>Q2</Message></MessageScroller>);
    expect(screen.getByRole("log", { name: "Conversation" }).getAttribute("aria-live")).toBe("polite");
    expect(container.querySelectorAll("[data-scroll-anchor]").length).toBe(1);
  });
});

describe("Attachment", () => {
  it("writes the upload state and removes by name", async () => {
    const user = userEvent.setup();
    const remove = vi.fn();
    const { container } = render(<><Attachment name="tokens.json" state="uploading" progress={42.4} onRemove={remove} /><Attachment name="a.png" state="error" /></>);
    expect(screen.getByText("Uploading · 42%")).toBeTruthy();
    expect(container.querySelector("[aria-busy=true]")).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toBe("Upload failed");
    await user.click(screen.getByRole("button", { name: "Remove tokens.json" }));
    expect(remove).toHaveBeenCalled();
  });
});

describe("CodeBlock", () => {
  it("copies the code without diff signs and says what changed", async () => {
    const user = userEvent.setup();
    render(<CodeBlock language="diff" title="tokens.css" code={"-a\n+b\n c"} />);
    expect(screen.getByText("Removed:", { exact: false })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Copy code" }));
    expect(await navigator.clipboard.readText()).toBe("a\nb\nc");
    expect(screen.getByRole("button", { name: "Copied" })).toBeTruthy();
  });
  it("collapses long code and highlights", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code={"1\n2\n3\n4\n5"} maxLines={2} />);
    await user.click(screen.getByRole("button", { name: "Show 3 more lines" }));
    expect(screen.getByRole("button", { name: "Show less" }).getAttribute("aria-expanded")).toBe("true");
    const parts = highlightLine('const x = "a";', "ts");
    expect(parts.length).toBeGreaterThan(2);
  });
});

describe("Trace and Marker", () => {
  it("folds under the summary, expands detail and reads status", async () => {
    const user = userEvent.setup();
    render(<Trace summary="Checked · 6s" defaultOpen={false} steps={[{ title: "Read tokens.json" }, { title: "Contrast check", status: "error", detail: "Retry with Dark only." }]} />);
    const summary = screen.getByRole("button", { name: "Checked · 6s" });
    expect(screen.getByText("Read tokens.json").closest("ol")!.hidden).toBe(true);
    await user.click(summary);
    expect(screen.getByText(", Failed")).toBeTruthy();
    const step = screen.getByRole("button", { name: /Contrast check/ });
    await user.click(step);
    expect(step.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Retry with Dark only.")).toBeTruthy();
  });
  it("announces running markers", () => {
    render(<Marker status="running">Checking</Marker>);
    expect(screen.getByRole("status").textContent).toContain("Checking");
  });
});

describe("Questionnaire", () => {
  it("requires an answer, picks with number keys and submits", async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(<Questionnaire items={QUESTIONS} onSubmit={submit} />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("alert").textContent).toContain("Choose an answer to continue.");
    await user.click(screen.getByRole("radio", { name: /Dark theme/ }));
    await user.keyboard("2");
    expect((screen.getByRole("radio", { name: /Every theme/ }) as HTMLInputElement).checked).toBe(true);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Question 2 of 2")).toBeTruthy();
    await user.type(within(screen.getByRole("group", { name: /Name the proposal/ })).getByRole("textbox", { name: "Proposal name" }), "Dark fixes");
    await user.click(screen.getByRole("button", { name: "Send answers" }));
    expect(submit).toHaveBeenCalledWith({ scope: { choice: "all", text: "" }, name: { choice: null, text: "Dark fixes" } });
  });
});
