import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  Button, Carousel, Chart, DataTable, DirectionProvider, Field, Resizable, ResizablePanel, RichTextEditor, StatTile, compactNumber, niceTicks, useDirection,
} from "../src/index.js";
import { violations } from "./a11y.js";

const USAGE = [{ x: "Aug 4", usage: 312, raw: 54 }, { x: "Aug 11", usage: 380, raw: 41 }, { x: "Aug 18", usage: 446, raw: 22 }];
const ROWS = Array.from({ length: 16 }, (_, i) => ({ id: i + 1, name: `component-${String(i + 1).padStart(2, "0")}`, status: i % 3 ? "Published" : "Draft", uses: (i * 37) % 100 }));
const COLS = [{ key: "name", header: "Name" }, { key: "status", header: "Status" }, { key: "uses", header: "Uses", align: "right" as const }];

describe("data and media render accessibly", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <Chart title="Token usage" data={USAGE} series={[{ key: "usage", label: "Tokens" }, { key: "raw", label: "Raw values" }]} />
        <Chart type="line" title="Adoption" data={USAGE} series={[{ key: "usage" }]} labels="end" />
        <StatTile label="Adoption" value={94} format={(v) => `${v}%`} delta={{ value: 3, period: "last month" }} trend={[80, 84, 90, 94]} />
        <DataTable aria-label="Components" columns={COLS} rows={ROWS} noun={["component", "components"]} selectable bulkActions={() => <Button size="sm">Archive</Button>} />
        <Carousel aria-label="Theme presets" items={["One", "Two", "Three"]} />
        <div style={{ height: 200 }}><Resizable><ResizablePanel label="list" defaultSize={30}>List</ResizablePanel><ResizablePanel label="canvas">Canvas</ResizablePanel></Resizable></div>
        <Field label="Description"><RichTextEditor defaultValue="<p>Hello</p>" showCount /></Field>
      </main>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("Chart", () => {
  it("formats compactly, reads points with arrows and has a table view", async () => {
    expect(compactNumber(1234)).toBe("1.2K");
    expect(compactNumber(4_500_000)).toBe("4.5M");
    expect(niceTicks(446)).toEqual([0, 200, 400, 600]);
    expect(niceTicks(90)).toEqual([0, 25, 50, 75, 100]);
    const user = userEvent.setup();
    render(<Chart title="Token usage" data={USAGE} series={[{ key: "usage", label: "Tokens" }, { key: "raw", label: "Raw values" }]} />);
    expect(screen.getByRole("list", { name: "Legend" }).textContent).toContain("Raw values");
    const plot = screen.getByRole("group", { name: /Token usage/ });
    plot.focus();
    await user.keyboard("{End}");
    expect(plot.querySelector("[aria-live]")!.textContent).toBe("Aug 18: Tokens 446, Raw values 22");
    await user.click(screen.getByRole("button", { name: "Show as table" }));
    const table = screen.getByRole("table", { name: "Token usage data" });
    expect(within(table).getAllByRole("row").length).toBe(4);
  });
  it("gives one series no legend", () => {
    render(<Chart title="Adoption" data={USAGE} series={[{ key: "usage" }]} />);
    expect(screen.queryByRole("list", { name: "Legend" })).toBeNull();
  });
});

describe("StatTile", () => {
  it("colors by good or bad and says so", () => {
    render(<><StatTile label="Open issues" value={12} delta={{ value: -4, unit: "", goodWhen: "down", period: "last week" }} /><StatTile label="Credits" value={1820} delta={-3} /></>);
    expect(screen.getByText("1,820")).toBeTruthy();
    expect(screen.getByText("−4").className).toContain("text-success-primary");
    expect(screen.getByText(", better")).toBeTruthy();
    expect(screen.getByText(", worse")).toBeTruthy();
    expect(screen.getByText("vs last week", { exact: false })).toBeTruthy();
  });
});

describe("DataTable", () => {
  it("searches, sorts across pages, paginates and selects", async () => {
    const user = userEvent.setup();
    const sel = vi.fn();
    render(<DataTable aria-label="Components" columns={COLS} rows={ROWS} pageSize={5} noun={["component", "components"]} selectable onSelectedChange={sel}
      bulkActions={(rows) => <Button size="sm">Archive {rows.length}</Button>} />);
    expect(screen.getByText("1–5 of 16 components")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Uses" }));
    await user.click(screen.getByRole("button", { name: "Uses" }));
    const first = screen.getAllByRole("row")[1]!;
    expect(within(first).getByText("96")).toBeTruthy();
    await user.type(screen.getByRole("textbox", { name: "Search" }), "draft");
    expect(screen.getByText("1–5 of 6 components")).toBeTruthy();
    await user.click(screen.getByRole("checkbox", { name: "Select all on this page" }));
    expect(sel.mock.lastCall![0]).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Archive 5" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Clear" }));
    await user.clear(screen.getByRole("textbox", { name: "Search" }));
    await user.type(screen.getByRole("textbox", { name: "Search" }), "zzz");
    expect(screen.getByText("Nothing matches “zzz”.")).toBeTruthy();
  });
});

describe("Carousel, Resizable, DirectionProvider", () => {
  it("names slides and disables Previous at the start", async () => {
    const user = userEvent.setup();
    render(<Carousel aria-label="Presets" items={["A", "B", "C"]} />);
    expect(screen.getByRole("group", { name: "1 of 3" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Previous slide" }).hasAttribute("disabled")).toBe(true);
    await user.click(screen.getByRole("button", { name: "Go to slide 3" }));
    expect(screen.getByRole("button", { name: "Next slide" }).hasAttribute("disabled")).toBe(true);
  });
  it("moves handles with the keyboard, within limits, and follows rtl", () => {
    const change = vi.fn();
    render(<DirectionProvider dir="rtl"><Resizable onSizesChange={change}><ResizablePanel label="list" defaultSize={30} minSize={20}>L</ResizablePanel><ResizablePanel>R</ResizablePanel></Resizable></DirectionProvider>);
    const h = screen.getByRole("separator", { name: "Resize list" });
    fireEvent.keyDown(h, { key: "ArrowLeft" });
    expect(change).toHaveBeenLastCalledWith([32, 68]);
    fireEvent.keyDown(h, { key: "Home" });
    expect(change).toHaveBeenLastCalledWith([20, 80]);
  });
  it("provides the direction", () => {
    const Show = () => <span>{useDirection()}</span>;
    render(<DirectionProvider dir="rtl"><Show /></DirectionProvider>);
    expect(screen.getByText("rtl").closest("[dir]")!.getAttribute("dir")).toBe("rtl");
  });
});

describe("RichTextEditor", () => {
  it("is a labelled textbox that emits clean HTML and counts", () => {
    const change = vi.fn();
    render(<Field label="Release notes"><RichTextEditor defaultValue='<p style="color:red">Hi <span>there</span></p>' maxLength={5} onChange={change} /></Field>);
    const box = screen.getByRole("textbox", { name: "Release notes" });
    expect(box.querySelector("p")!.className).toBe("reading-body-light");
    expect(box.querySelector("[style]")).toBeNull();
    fireEvent.input(box);
    expect(change).toHaveBeenLastCalledWith("<p>Hi there</p>");
    expect(screen.getByText("8 / 5").className).toContain("text-error-primary");
    expect(box.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("toolbar", { name: "Formatting" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Bold" })).toBeTruthy();
  });
  it("trims the toolbar and hides it when read-only", () => {
    const { rerender } = render(<RichTextEditor aria-label="Comment" toolbar={["bold", "italic", "|", "link"]} />);
    expect(within(screen.getByRole("toolbar")).getAllByRole("button").length).toBe(3);
    rerender(<RichTextEditor aria-label="Comment" readOnly />);
    expect(screen.queryByRole("toolbar")).toBeNull();
  });
});
