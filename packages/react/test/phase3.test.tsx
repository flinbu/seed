import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Button, Calendar, CommandPalette, DatePicker, DateRangePicker, Field, FileTree, FileUpload, formatRange } from "../src/index.js";
import { violations } from "./a11y.js";

const D = (m: number, d: number) => new Date(2026, m, d);
const TREE = [{ name: "css", children: [{ name: "tokens.css", meta: "14 KB" }, { name: "dark.css" }] }, { name: "tokens.json", meta: "38 KB" }];

describe("phase 3 renders accessibly", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <Calendar defaultValue={D(9, 17)} />
        <Calendar mode="range" months={2} defaultValue={{ from: D(9, 5), to: D(9, 12) }} />
        <Field label="Due date"><DatePicker /></Field>
        <Field label="Period"><DateRangePicker /></Field>
        <Field label="Tokens file" hint="JSON, up to 1 MB."><FileUpload accept=".json" /></Field>
        <FileTree items={TREE} expandAll defaultSelected="css/tokens.css" />
      </main>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("Calendar", () => {
  it("moves with the keyboard and picks", async () => {
    const user = userEvent.setup();
    const pick = vi.fn();
    render(<Calendar defaultValue={D(9, 17)} onValueChange={pick} />);
    const cur = screen.getByRole("button", { name: /October 17, 2026/ });
    expect(cur.getAttribute("tabindex")).toBe("0");
    cur.focus();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement?.getAttribute("aria-label")).toMatch(/October 24, 2026/);
    await user.keyboard("{PageDown}");
    expect(document.activeElement?.getAttribute("aria-label")).toMatch(/November 24, 2026/);
    await user.keyboard("{Enter}");
    expect(pick.mock.calls[0][0].getDate()).toBe(24);
  });
  it("picks a range in two clicks, in either order", async () => {
    const user = userEvent.setup();
    const pick = vi.fn();
    render(<Calendar mode="range" defaultValue={null} onValueChange={pick} />);
    const now = new Date();
    const name = (d: number) => new RegExp(`${new Date(now.getFullYear(), now.getMonth(), d).toLocaleDateString(undefined, { month: "long" })} ${d},`);
    await user.click(screen.getByRole("button", { name: name(20) }));
    await user.click(screen.getByRole("button", { name: name(10) }));
    const r = pick.mock.calls[1][0];
    expect([r.from.getDate(), r.to.getDate()]).toEqual([10, 20]);
  });
  it("formats ranges", () => {
    expect(formatRange({ from: D(9, 5), to: D(9, 12) }, "en-US")).toBe("Oct 5 – Oct 12, 2026");
    expect(formatRange({ from: D(9, 5), to: D(9, 5) }, "en-US")).toBe("Oct 5, 2026");
  });
});

describe("DatePicker", () => {
  it("opens a calendar and closes on pick", async () => {
    const user = userEvent.setup();
    const pick = vi.fn();
    render(<Field label="Due date"><DatePicker defaultValue={D(9, 17)} onValueChange={pick} locale="en-US" /></Field>);
    const trigger = screen.getByRole("button", { name: "Due date" });
    expect(trigger.textContent).toContain("Oct 17, 2026");
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: /October 20, 2026/ }));
    expect(pick).toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger.textContent).toContain("Oct 20, 2026");
  });
});

describe("DateRangePicker", () => {
  it("applies a preset at once and shows its name", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<DateRangePicker aria-label="Period" onValueChange={change} />);
    await user.click(screen.getByRole("button", { name: "Period" }));
    await user.click(screen.getByRole("button", { name: "Last 7 days" }));
    const r = change.mock.calls[0][0];
    expect(Math.round((r.to - r.from) / 864e5)).toBe(6);
    expect(screen.getByRole("button", { name: "Period" }).textContent).toContain("Last 7 days");
  });
});

describe("CommandPalette", () => {
  it("opens with ⌘K, filters, and runs with Enter", async () => {
    const user = userEvent.setup();
    const run = vi.fn();
    render(<CommandPalette groups={[{ label: "Create", items: [{ label: "New token", keywords: ["add"], onSelect: run }, { label: "New component" }] }, { label: "Go to", items: [{ label: "Settings" }] }]} />);
    await user.keyboard("{Control>}k{/Control}");
    const dialog = screen.getByRole("dialog", { name: "Command palette" });
    await user.keyboard("add");
    expect(within(dialog).getAllByRole("option").map((o) => o.textContent)).toEqual(["New token"]);
    await user.keyboard("{Enter}");
    expect(run).toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("FileUpload", () => {
  it("adds files, flags the wrong type, and removes", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { container } = render(<FileUpload accept=".json" maxSize={1000} onFilesChange={change} />);
    const input = container.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [new File(["{}"], "tokens.json", { type: "application/json" }), new File(["x"], "logo.png", { type: "image/png" })] } });
    expect(screen.getByText("tokens.json")).toBeTruthy();
    expect(screen.getByText("This file type isn't allowed.")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Remove logo.png" }));
    expect(screen.queryByText("logo.png")).toBeNull();
    expect(change).toHaveBeenCalledTimes(2);
  });
});

describe("FileTree", () => {
  it("follows the tree pattern", async () => {
    const user = userEvent.setup();
    const sel = vi.fn();
    render(<FileTree items={TREE} onSelect={sel} />);
    const css = screen.getByRole("treeitem", { name: /css/ });
    expect(css.getAttribute("aria-expanded")).toBe("false");
    css.focus();
    await user.keyboard("{ArrowRight}");
    expect(css.getAttribute("aria-expanded")).toBe("true");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(sel).toHaveBeenCalledWith("css/tokens.css");
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(css);
  });
});
