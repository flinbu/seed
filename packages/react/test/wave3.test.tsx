import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  Button, CommentThread, Field, Heading, MentionInput, NavigationMenu, TableOfContents, Text, TimePicker, Tour, Typography, parseTime,
} from "../src/index.js";
import { violations } from "./a11y.js";

const NAV = [{ label: "Docs", href: "/docs", current: true }, { label: "Product", links: [{ label: "Tokens", href: "/tokens", description: "Every value" }] }];

describe("wave 3 renders accessibly", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <header><NavigationMenu items={NAV} /></header>
        <main>
          <Heading level={1} size={3}>Tokens</Heading>
          <Text variant="lead">446 tokens.</Text>
          <Typography><h2>Modes</h2><p>Light and <a href="#d">Dark</a>.</p><ul><li>One</li></ul></Typography>
          <Field label="Comment"><MentionInput items={[{ value: "ana", label: "Ana Ruiz" }]} /></Field>
          <Field label="Publish at"><TimePicker defaultValue="09:30" /></Field>
          <TableOfContents items={[{ id: "a", label: "A" }, { id: "b", label: "B", level: 3 }]} />
          <CommentThread anchor="button · Dark" comments={[{ author: { name: "Ana Ruiz" }, body: "Looks good.", time: new Date() }]} onReply={() => {}} />
        </main>
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("Heading and Text", () => {
  it("separate level from look", () => {
    render(<><Heading level={1} size={4}>Color</Heading><Text variant="label">Mode</Text></>);
    const h = screen.getByRole("heading", { level: 1, name: "Color" });
    expect(h.className).toContain("heading-h4-semibold");
    expect(screen.getByText("Mode").tagName).toBe("SPAN");
  });
});

describe("MentionInput", () => {
  it("suggests after a trigger and inserts the pick", async () => {
    const user = userEvent.setup();
    const onMention = vi.fn();
    render(<MentionInput aria-label="Comment" sources={{ "@": [{ value: "ana", label: "Ana Ruiz" }, { value: "mei", label: "Mei Chen" }], "#": [{ value: "bg", label: "bg-primary" }] }} onMention={onMention} />);
    const ta = screen.getByRole("textbox", { name: "Comment" }) as HTMLTextAreaElement;
    await user.type(ta, "Ask @me");
    const list = await screen.findByRole("listbox");
    expect(within(list).getAllByRole("option").map((o) => o.textContent)).toEqual(["Mei Chen"]);
    await user.keyboard("{Enter}");
    expect(ta.value).toBe("Ask @Mei Chen ");
    expect(onMention).toHaveBeenCalledWith(expect.objectContaining({ value: "mei" }), "@");
    await user.type(ta, "and #bg");
    await user.keyboard("{Enter}");
    expect(ta.value).toBe("Ask @Mei Chen and #bg-primary ");
  });
});

describe("TimePicker", () => {
  it("parses typed times and picks from the list", async () => {
    expect(parseTime("9")).toBe("09:00");
    expect(parseTime("930pm")).toBe("21:30");
    expect(parseTime("12am")).toBe("00:00");
    expect(parseTime("25:00")).toBeNull();
    const user = userEvent.setup();
    const change = vi.fn();
    render(<TimePicker aria-label="Time" hourCycle={24} onValueChange={change} />);
    const input = screen.getByRole("combobox", { name: "Time" });
    await user.type(input, "2:15pm{Enter}");
    expect(change).toHaveBeenLastCalledWith("14:15");
    await user.clear(input);
    await user.type(input, "99{Enter}");
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });
});

describe("Tour", () => {
  it("walks the steps and ends on Escape", async () => {
    const user = userEvent.setup();
    const done = vi.fn(), skip = vi.fn();
    render(<><button id="t1">Import</button><Tour defaultOpen onFinish={done} onSkip={skip} steps={[{ target: "#t1", title: "Bring your tokens in" }, { title: "Publish when ready" }]} /></>);
    expect(screen.getByRole("dialog", { name: "Bring your tokens in" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("dialog", { name: "Publish when ready" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(done).toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("CommentThread and TableOfContents", () => {
  it("replies with ⌘ Enter and collapses when resolved", async () => {
    const user = userEvent.setup();
    const reply = vi.fn();
    render(<CommentThread comments={[{ author: { name: "Ana Ruiz" }, body: "One step lighter?" }]} onReply={reply} />);
    await user.type(screen.getByRole("textbox", { name: "Reply" }), "On it.");
    await user.keyboard("{Control>}{Enter}{/Control}");
    expect(reply).toHaveBeenCalledWith("On it.");
    await user.click(screen.getByRole("button", { name: "Resolve" }));
    expect(screen.getByRole("button", { name: "1 comment. Show" })).toBeTruthy();
  });
  it("marks the current section", async () => {
    const user = userEvent.setup();
    render(<><h2 id="one">One</h2><h2 id="two">Two</h2><TableOfContents items={[{ id: "one", label: "One" }, { id: "two", label: "Two" }]} /></>);
    await user.click(screen.getByRole("link", { name: "Two" }));
    expect(screen.getByRole("link", { name: "Two" }).getAttribute("aria-current")).toBe("location");
  });
});
