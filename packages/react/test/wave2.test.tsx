import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Bold, Italic, Plug } from "lucide-react";
import {
  AspectRatio, Avatar, AvatarGroup, Button, Field, Item, ItemGroup, Meter, PasswordInput, ProgressRing, TagInput, Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleGroup, ToolbarToggleItem, meterTone,
} from "../src/index.js";
import { violations } from "./a11y.js";

const PEOPLE = [{ name: "Ana Ruiz", status: "online" as const }, { name: "Mei Chen", status: "away" as const }, { name: "Tomás Gil" }, { name: "Jon Berg" }, { name: "Sara Kim" }];

describe("wave 2 renders accessibly", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <AvatarGroup people={PEOPLE} max={3} label="Editing now" />
        <Field label="Password"><PasswordInput requirements={[{ label: "At least 12 characters", test: (v) => v.length >= 12 }]} /></Field>
        <Field label="Components"><TagInput defaultValue={["button"]} suggestions={["badge", "card"]} /></Field>
        <Toolbar aria-label="Format"><ToolbarToggleGroup type="multiple" aria-label="Style"><ToolbarToggleItem value="b" aria-label="Bold"><Bold size={16} /></ToolbarToggleItem></ToolbarToggleGroup><ToolbarSeparator /><ToolbarButton asChild><Button size="sm">Share</Button></ToolbarButton></Toolbar>
        <Meter label="Credits used" value={182} max={200} high={160} optimum={0} valueText="182 of 200" />
        <ProgressRing value={72} showValue label="Sync" />
        <ItemGroup><Item media={<Plug />} title="Figma" description="Connected" href="/f" actions={<Button size="sm" variant="secondary">Sync</Button>} /></ItemGroup>
        <AspectRatio><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Preview" /></AspectRatio>
      </main>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("Avatar and AvatarGroup", () => {
  it("reads presence in the name and collapses extras", () => {
    render(<><Avatar name="Ana Ruiz" status="away" /><AvatarGroup people={PEOPLE} max={3} /></>);
    expect(screen.getAllByRole("img", { name: "Ana Ruiz, away" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("img", { name: "3 more: Tomás Gil, Jon Berg, Sara Kim" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "5 people" })).toBeTruthy();
  });
});

describe("PasswordInput", () => {
  it("shows and hides, and marks requirements", async () => {
    const user = userEvent.setup();
    render(<Field label="Password"><PasswordInput requirements={[{ label: "A number", test: (v) => /\d/.test(v) }]} /></Field>);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(input.type).toBe("text");
    await user.type(input, "seed1");
    expect(screen.getByText(", done")).toBeTruthy();
  });
});

describe("TagInput", () => {
  it("adds with Enter and commas, refuses duplicates, removes with Backspace", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<TagInput aria-label="Components" defaultValue={["button"]} onValueChange={change} validate={(t) => (/^[a-z-]+$/.test(t) ? true : "Use lowercase letters and dashes.")} />);
    const input = screen.getByLabelText("Components");
    await user.type(input, "card{Enter}");
    expect(change).toHaveBeenLastCalledWith(["button", "card"]);
    await user.type(input, "dialog,tabs,");
    expect(change).toHaveBeenLastCalledWith(["button", "card", "dialog", "tabs"]);
    await user.type(input, "card{Enter}");
    expect(screen.getByText('"card" is already added.')).toBeTruthy();
    await user.type(input, "Bad{Enter}");
    expect(screen.getByText("Use lowercase letters and dashes.")).toBeTruthy();
    await user.clear(input);
    await user.keyboard("{Backspace}");
    expect(change).toHaveBeenLastCalledWith(["button", "card", "dialog"]);
  });
});

describe("Toolbar", () => {
  it("has one tab stop and arrow keys", async () => {
    const user = userEvent.setup();
    render(<><Toolbar aria-label="Format"><ToolbarToggleGroup type="multiple" aria-label="Style"><ToolbarToggleItem value="b" aria-label="Bold"><Bold size={16} /></ToolbarToggleItem><ToolbarToggleItem value="i" aria-label="Italic"><Italic size={16} /></ToolbarToggleItem></ToolbarToggleGroup>
      <ToolbarButton asChild><Button size="sm">Share</Button></ToolbarButton></Toolbar><button>After</button></>);
    await user.tab();
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Bold");
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Italic");
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement?.textContent).toBe("Share");
    await user.tab();
    expect(document.activeElement?.textContent).toBe("After");
  });
});

describe("Meter and ProgressRing", () => {
  it("picks tones like <meter>", () => {
    expect(meterTone(182, 0, 200, undefined, 160, 0)).toBe("warning");
    expect(meterTone(94, 0, 100, 60, 90, 100)).toBe("success");
    expect(meterTone(40, 0, 100, 60, 90, 100)).toBe("error");
    render(<><Meter label="Storage" value={41} valueText="4.1 of 10 GB" /><ProgressRing value={30} label="Import" /></>);
    expect(screen.getByRole("meter", { name: "Storage" }).getAttribute("aria-valuetext")).toBe("4.1 of 10 GB");
    expect(screen.getByRole("progressbar", { name: "Import" }).getAttribute("aria-valuenow")).toBe("30");
  });
});
