import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Search, Plus } from "lucide-react";
import {
  Alert, Avatar, Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, EmptyState, Field, Icon, Input, Kbd, Label,
  Progress, Radio, RadioGroup, Separator, Skeleton, Spinner, Switch, Textarea, Toggle, ToggleGroup, ToggleGroupItem, cn, initials,
} from "../src/index.js";
import { violations } from "./a11y.js";

describe("every component renders accessibly", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <Button>Save changes</Button>
        <Button variant="secondary" leftIcon={Plus}>New token</Button>
        <Button icon={Search} aria-label="Search" variant="ghost" />
        <Button href="/docs" variant="link">Read the docs</Button>
        <Field label="Email" hint="We never share it." error="Enter an email like name@company.com."><Input type="email" leftIcon={Search} /></Field>
        <Field label="Notes"><Textarea /></Field>
        <Checkbox label="Include Dark" description="Adds a Dark value to every token." />
        <RadioGroup aria-label="Billing" defaultValue="m"><Radio value="m" label="Monthly" /><Radio value="y" label="Yearly" /></RadioGroup>
        <Switch label="Sync with Figma" />
        <Toggle aria-label="Bold">B</Toggle>
        <ToggleGroup type="single" aria-label="View" defaultValue="grid"><ToggleGroupItem value="grid">Grid</ToggleGroupItem><ToggleGroupItem value="list">List</ToggleGroupItem></ToggleGroup>
        <Badge variant="success" dot>Live</Badge>
        <Avatar name="Ana Ruiz" />
        <Card><CardHeader><CardTitle>Tokens</CardTitle><CardDescription>435 tokens</CardDescription></CardHeader><CardContent>Body</CardContent><CardFooter><Button size="sm">Open</Button></CardFooter></Card>
        <Alert variant="warning" title="Contrast below AA" onDismiss={() => {}}>Four text colors fail in Light.</Alert>
        <Progress value={40} label="Uploading" showValue />
        <Progress label="Syncing" />
        <Skeleton width={120} />
        <Spinner />
        <Kbd>⌘</Kbd>
        <Separator />
        <EmptyState title="No components yet" description="Import them from Figma." actions={<Button>Import</Button>} />
        <Icon as={Search} label="Search" />
        <Label htmlFor="x">Plain label</Label><input id="x" />
      </main>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("Button", () => {
  it("is a button by default and disables while loading", () => {
    render(<Button loading>Save</Button>);
    const b = screen.getByRole("button", { name: /save/i });
    expect(b).toHaveProperty("type", "button");
    expect(b.hasAttribute("disabled")).toBe(true);
    expect(b.getAttribute("aria-busy")).toBe("true");
  });
  it("renders a link with href", () => {
    render(<Button href="/x">Go</Button>);
    expect(screen.getByRole("link", { name: "Go" }).getAttribute("href")).toBe("/x");
  });
  it("lets className override its classes", () => {
    render(<Button className="px-xs">x</Button>);
    expect(screen.getByRole("button").className).toContain("px-xs");
    expect(screen.getByRole("button").className).not.toContain("px-base");
  });
  it("supports asChild", () => {
    render(<Button asChild><a href="/y">Router link</a></Button>);
    expect(screen.getByRole("link").className).toContain("bg-button-primary");
  });
});

describe("Field", () => {
  it("links the label, hint and error to the control", () => {
    render(<Field label="Email" hint="Work email" error="Required" required><Input /></Field>);
    const input = screen.getByLabelText(/Email/);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.hasAttribute("required")).toBe(true);
    const ids = input.getAttribute("aria-describedby")!.split(" ");
    expect(ids.map((i) => document.getElementById(i)!.textContent)).toEqual(["Work email", expect.stringContaining("Required")]);
  });
});

describe("choices", () => {
  it("Checkbox reports checked as a boolean", async () => {
    const on = vi.fn();
    render(<Checkbox label="Include Dark" onCheckedChange={on} />);
    await userEvent.click(screen.getByLabelText("Include Dark"));
    expect(on).toHaveBeenCalledWith(true);
    expect(screen.getByRole("checkbox").getAttribute("data-state")).toBe("checked");
  });
  it("Checkbox shows indeterminate", () => {
    render(<Checkbox aria-label="All" indeterminate />);
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe("mixed");
  });
  it("RadioGroup selects one", async () => {
    const on = vi.fn();
    render(<RadioGroup aria-label="Plan" defaultValue="a" onValueChange={on}><Radio value="a" label="A" /><Radio value="b" label="B" /></RadioGroup>);
    await userEvent.click(screen.getByLabelText("B"));
    expect(on).toHaveBeenCalledWith("b");
  });
  it("Switch toggles", async () => {
    render(<Switch label="Sync" />);
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("true");
  });
  it("ToggleGroup keeps one selected when allowEmpty is false", async () => {
    render(<ToggleGroup type="single" defaultValue="a" allowEmpty={false} aria-label="v"><ToggleGroupItem value="a">A</ToggleGroupItem><ToggleGroupItem value="b">B</ToggleGroupItem></ToggleGroup>);
    const a = screen.getByRole("radio", { name: "A" });
    await userEvent.click(a);
    expect(a.getAttribute("aria-checked")).toBe("true");
  });
});

describe("display", () => {
  it("Alert is announced for errors and warnings only", () => {
    render(<><Alert variant="error" title="Failed" /><Alert variant="success" title="Saved" /></>);
    expect(screen.getByRole("alert").textContent).toContain("Failed");
    expect(screen.getByRole("status").textContent).toContain("Saved");
  });
  it("Progress exposes its value", () => {
    render(<Progress value={30} max={60} label="Upload" />);
    const p = screen.getByRole("progressbar");
    expect(p.getAttribute("aria-valuenow")).toBe("30");
    expect(p.getAttribute("aria-valuetext")).toBe("50%");
  });
  it("Avatar falls back to initials", () => {
    expect(initials("Felipe Linares")).toBe("FL");
    render(<Avatar name="Ana Ruiz" />);
    expect(screen.getByRole("img", { name: "Ana Ruiz" }).textContent).toBe("AR");
  });
  it("cn lets the last Seed type style win", () => {
    expect(cn("label-label-2-medium", "body-body-3-regular")).toBe("body-body-3-regular");
    expect(cn("bg-primary", "bg-secondary")).toBe("bg-secondary");
  });
});

describe("icons", () => {
  it("sizes and hides icon elements", () => {
    render(<Button leftIcon={<Plus />}>New</Button>);
    const svg = screen.getByRole("button").querySelector("svg")!;
    expect(svg.getAttribute("width")).toBe("16");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
  });
});
