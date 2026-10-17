import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { House, Palette, Settings } from "lucide-react";
import { Field, HoverCard, OtpInput, Sidebar, Slider, Stepper } from "../src/index.js";
import { violations } from "./a11y.js";

const NAV = [
  { label: "Home", icon: <House />, href: "/", active: true },
  { type: "section" as const, label: "System" },
  { label: "Tokens", icon: <Palette />, items: [{ label: "Color", href: "/c" }, { label: "Spacing", href: "/s" }] },
  { label: "Settings", icon: <Settings />, href: "/settings", badge: 2 },
];

describe("batch 3 renders accessibly", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <Field label="Opacity"><Slider defaultValue={40} showValue formatValue={(v) => `${v}%`} /></Field>
        <Slider aria-label="Range" defaultValue={[20, 80]} />
        <Field label="Code" hint="We sent it to your email."><OtpInput /></Field>
        <Stepper steps={["Brief", "Tokens", { label: "Components", optional: true }, "Docs"]} current={1} onStepClick={() => {}} />
        <Sidebar items={NAV} header="Acme" collapsible />
        <HoverCard content="Ana Ruiz, design lead"><a href="/people/ana">Ana</a></HoverCard>
      </main>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("Slider", () => {
  it("moves with arrow keys and reports the formatted value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field label="Opacity"><Slider defaultValue={40} step={10} onValueChange={onChange} formatValue={(v) => `${v}%`} showValue /></Field>);
    const thumb = screen.getByRole("slider", { name: "Opacity" });
    expect(thumb.getAttribute("aria-valuetext")).toBe("40%");
    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith(50);
    expect(screen.getByText("50%")).toBeTruthy();
  });
  it("names both thumbs of a range", () => {
    render(<Slider defaultValue={[10, 90]} />);
    expect(screen.getByRole("slider", { name: "Minimum" })).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Maximum" })).toBeTruthy();
  });
});

describe("OtpInput", () => {
  it("fills from a paste, completes, and goes back with Backspace", async () => {
    const user = userEvent.setup();
    const done = vi.fn(), change = vi.fn();
    render(<OtpInput length={4} onComplete={done} onChange={change} />);
    const cells = screen.getAllByRole("textbox");
    expect(cells[0].getAttribute("autocomplete")).toBe("one-time-code");
    fireEvent.paste(cells[0], { clipboardData: { getData: () => "12-34" } });
    expect(change).toHaveBeenLastCalledWith("1234");
    expect(done).toHaveBeenCalledWith("1234");
    cells[3].focus();
    await user.keyboard("{Backspace}");
    expect(change).toHaveBeenLastCalledWith("123");
  });
  it("ignores letters unless alphanumeric", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<OtpInput length={4} onChange={change} />);
    await user.type(screen.getAllByRole("textbox")[0], "a7");
    expect(change).toHaveBeenLastCalledWith("7");
  });
});

describe("Stepper", () => {
  it("marks the current step and lets finished steps go back", async () => {
    const user = userEvent.setup();
    const go = vi.fn();
    render(<Stepper steps={["Brief", "Tokens", "Docs"]} current={2} onStepClick={go} />);
    const items = screen.getAllByRole("listitem");
    expect(items[2].getAttribute("aria-current")).toBe("step");
    await user.click(screen.getByRole("button", { name: /Tokens/ }));
    expect(go).toHaveBeenCalledWith(1);
    expect(screen.queryByRole("button", { name: /Docs/ })).toBeNull();
  });
});

describe("Sidebar", () => {
  it("marks the active page, opens groups, and collapses to icons", async () => {
    const user = userEvent.setup();
    const onCollapse = vi.fn();
    render(<Sidebar items={NAV} collapsible onCollapsedChange={onCollapse} />);
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("aria-current")).toBe("page");
    expect(screen.queryByRole("link", { name: "Color" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Tokens" }));
    expect(screen.getByRole("link", { name: "Color" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(onCollapse).toHaveBeenCalledWith(true);
    expect(screen.getByRole("link", { name: "Settings" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Expand sidebar" }).getAttribute("aria-expanded")).toBe("false");
  });
});
