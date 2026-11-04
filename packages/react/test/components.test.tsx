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
        <Alert live emphasis="loud" variant="error" title="Sync failed" action={<Button size="sm" variant="secondary">Try again</Button>}>Figma didn’t respond. <a href="/status">See status</a></Alert>
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
  it("is a button by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveProperty("type", "button");
  });
  it("stays readable and focusable while loading, and ignores clicks", async () => {
    const click = vi.fn(), submit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const { container } = render(<form onSubmit={submit}><Button type="submit" loading onClick={click}>Applying</Button></form>);
    const b = screen.getByRole("button", { name: "Applying" });
    // Not the native disabled attribute: that would grey the label out (1.48:1) and drop it from the tab order.
    expect(b.hasAttribute("disabled")).toBe(false);
    expect(b.getAttribute("aria-disabled")).toBe("true");
    expect(b.getAttribute("aria-busy")).toBe("true");
    expect(b.className).toContain("bg-button-primary");
    expect(b.querySelector("svg.motion-safe\\:animate-spin")).toBeTruthy();
    await userEvent.tab();
    expect(document.activeElement).toBe(b);
    await userEvent.click(b);
    await userEvent.keyboard("{Enter}");
    expect(click).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
    expect(await violations(container)).toEqual([]);
  });
  it("clicks again once loading ends", async () => {
    const click = vi.fn();
    const { rerender } = render(<Button loading onClick={click}>Save</Button>);
    rerender(<Button onClick={click}>Save</Button>);
    const b = screen.getByRole("button", { name: "Save" });
    expect(b.hasAttribute("aria-disabled")).toBe(false);
    expect(b.hasAttribute("aria-busy")).toBe(false);
    await userEvent.click(b);
    expect(click).toHaveBeenCalledTimes(1);
  });
  it("keeps the native disabled attribute for disabled buttons", async () => {
    const click = vi.fn();
    render(<Button disabled loading onClick={click}>Save</Button>);
    const b = screen.getByRole("button", { name: "Save" });
    expect(b.hasAttribute("disabled")).toBe(true);
    expect(b.hasAttribute("aria-disabled")).toBe(false);
    await userEvent.click(b);
    expect(click).not.toHaveBeenCalled();
  });
  it("ignores clicks on a loading link", async () => {
    const click = vi.fn();
    render(<Button href="/x" loading onClick={click}>Go</Button>);
    const a = screen.getByText("Go").closest("a")!;
    expect(a.getAttribute("aria-disabled")).toBe("true");
    expect(a.getAttribute("aria-busy")).toBe("true");
    await userEvent.click(a);
    expect(click).not.toHaveBeenCalled();
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
  it("keeps a disabled control's description readable", () => {
    render(<><Checkbox label="Audit in the background" description="Needs a Pro plan." disabled /><Switch label="Sync" description="Needs a release." disabled /></>);
    for (const text of ["Needs a Pro plan.", "Needs a release."]) {
      const d = screen.getByText(text);
      expect(d.className).toContain("text-tertiary");
      expect(d.className).not.toContain("text-disabled");
    }
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
  it("Alert rendered with the page has no live role", () => {
    const { container } = render(<><Alert variant="error" title="Failed" /><Alert variant="warning" title="Low" /></>);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
    expect(container.querySelectorAll("[role]").length).toBe(0);
  });
  it("live Alert is a status, or an alert for errors only", () => {
    render(<><Alert live variant="error" title="Failed" /><Alert live variant="warning" title="Low" /><Alert live variant="success" title="Saved" /><Alert live variant="info" title="New" /></>);
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(screen.getByRole("alert").textContent).toContain("Failed");
    expect(screen.getAllByRole("status").map((s) => s.textContent)).toEqual(["Warning: Low", "Success: Saved", "Info: New"]);
  });
  it("Alert reads its tone before the message, never by color alone", () => {
    render(<><Alert variant="warning" title="Contrast below AA">Four fail.</Alert><Alert variant="error">Nothing synced.</Alert><Alert variant="neutral" title="Note" /></>);
    expect(screen.getByText("Warning:", { exact: false }).className).toContain("sr-only");
    expect(screen.getByText("Contrast below AA").textContent).toBe("Warning: Contrast below AA");
    expect(screen.getByText("Nothing synced.", { exact: false }).textContent).toBe("Error: Nothing synced.");
    expect(screen.getByText("Note").textContent).toBe("Note");
  });
  it("Alert's tone label can be translated or left out", () => {
    render(<><Alert variant="error" title="Falló" toneLabel="Error" /><Alert variant="success" title="Listo" toneLabel="Éxito" /><Alert variant="info" title="Plain" toneLabel={false} /></>);
    expect(screen.getByText("Listo").textContent).toBe("Éxito: Listo");
    expect(screen.getByText("Plain").textContent).toBe("Plain");
  });
  it("Alert is subtle by default: neutral surface and hairline, the icon in the tone", () => {
    const { container } = render(<Alert variant="warning" title="Low credits">Add more.</Alert>);
    const box = container.firstElementChild as HTMLElement;
    expect(box.dataset.emphasis).toBe("subtle");
    expect(box.className).toContain("bg-primary");
    expect(box.className).toContain("border-secondary");
    expect(box.className).not.toMatch(/bg-warning|border-warning/);
    expect(box.querySelector("svg")!.parentElement!.className).toContain("text-icon-warning-primary-hover");
    expect(screen.getByText("Low credits", { exact: false }).className).toContain("text-primary");
  });
  it("loud Alert keeps the surface and takes the tone's hairline", () => {
    const tones = ["info", "success", "warning", "error", "offer"] as const;
    const { container } = render(<>{tones.map((t) => <Alert key={t} variant={t} emphasis="loud" title={t} />)}<Alert variant="neutral" emphasis="loud" title="n" /></>);
    const boxes = Array.from(container.children) as HTMLElement[];
    tones.forEach((t, i) => {
      expect(boxes[i].className).toContain(`border-${t}-subtle`);
      expect(boxes[i].className).toContain("bg-primary");
      expect(boxes[i].className).not.toContain("border-secondary");
    });
    expect(boxes[5].className).toContain("border-primary");
  });
  it("links in an Alert use the accent text color", () => {
    const { container } = render(<Alert title="New">Read <a href="/x">the guide</a>.</Alert>);
    expect(container.querySelector("a")!.parentElement!.className).toContain("[&_a]:text-accent-primary");
  });
  it("Progress exposes its value", () => {
    render(<Progress value={30} max={60} label="Upload" />);
    const p = screen.getByRole("progressbar");
    expect(p.getAttribute("aria-valuenow")).toBe("30");
    expect(p.getAttribute("aria-valuetext")).toBe("50%");
  });
  it("Progress without a visible label takes its aria-label on the bar", () => {
    render(<Progress value={8} max={10} aria-label="8 of 10 credits left" />);
    expect(screen.getByRole("progressbar", { name: "8 of 10 credits left" })).toBeTruthy();
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
