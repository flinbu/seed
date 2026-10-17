import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger, Breadcrumb, Button, Combobox, Field, Pagination, pageRange,
  Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger, Toaster, toast,
} from "../src/index.js";
import { violations } from "./a11y.js";

const OPTIONS = [
  { value: "button", label: "Button", keywords: ["action"] },
  { value: "badge", label: "Badge" },
  { value: "card", label: "Card" },
  { value: "dialog", label: "Dialog", disabled: true },
];

describe("batch 2 renders accessibly", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <Breadcrumb items={[{ label: "Acme DS", href: "/" }, { label: "Tokens", href: "/tokens" }, { label: "Color" }]} />
        <Pagination page={3} count={12} onPageChange={() => {}} summary="41–60 of 446" />
        <Accordion type="single" collapsible defaultValue="a"><AccordionItem value="a"><AccordionTrigger>What is a token?</AccordionTrigger><AccordionContent>A named value.</AccordionContent></AccordionItem></Accordion>
        <Field label="Component"><Combobox options={OPTIONS} /></Field>
      </main>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("Combobox", () => {
  it("filters, skips disabled options, and picks with Enter", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field label="Component"><Combobox options={OPTIONS} onValueChange={onChange} clearable /></Field>);
    const input = screen.getByRole("combobox", { name: "Component" });
    await user.click(input);
    expect(input.getAttribute("aria-expanded")).toBe("true");
    await user.type(input, "act");
    const list = screen.getByRole("listbox");
    expect(within(list).getAllByRole("option").map((o) => o.textContent)).toEqual(["Button"]);
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("button");
    expect((input as HTMLInputElement).value).toBe("Button");
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
  it("moves the active option with arrows and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Combobox aria-label="Component" options={OPTIONS} />);
    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    expect(input.getAttribute("aria-activedescendant")).toMatch(/card$/);
    await user.keyboard("{Escape}");
    expect(input.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("Pagination", () => {
  it("builds page ranges with gaps", () => {
    expect(pageRange(1, 3)).toEqual([1, 2, 3]);
    expect(pageRange(6, 12)).toEqual([1, "gap", 5, 6, 7, "gap", 12]);
    expect(pageRange(3, 12)).toEqual([1, 2, 3, 4, "gap", 12]);
  });
  it("marks the current page and moves", async () => {
    const user = userEvent.setup();
    const go = vi.fn();
    render(<Pagination page={1} count={5} onPageChange={go} />);
    expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("button", { name: "Previous page" }).hasAttribute("disabled")).toBe(true);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(go).toHaveBeenCalledWith(2);
  });
});

describe("Breadcrumb", () => {
  it("marks the current page and collapses the middle into a menu", async () => {
    const user = userEvent.setup();
    render(<Breadcrumb maxItems={3} items={[{ label: "Home", href: "/" }, { label: "Systems", href: "/s" }, { label: "Acme", href: "/s/acme" }, { label: "Tokens" }]} />);
    expect(screen.getByText("Tokens").getAttribute("aria-current")).toBe("page");
    expect(screen.queryByRole("link", { name: "Systems" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "2 more" }));
    expect(await screen.findByRole("menuitem", { name: "Systems" })).toBeTruthy();
  });
});

describe("Accordion", () => {
  it("opens sections under real headings", async () => {
    const user = userEvent.setup();
    render(<Accordion type="multiple"><AccordionItem value="a"><AccordionTrigger level={2}>Modes</AccordionTrigger><AccordionContent>Light and Dark</AccordionContent></AccordionItem></Accordion>);
    const btn = screen.getByRole("button", { name: "Modes" });
    expect(btn.closest("h2")).toBeTruthy();
    await user.click(btn);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("region", { name: "Modes" }).textContent).toBe("Light and Dark");
  });
});

describe("Sheet", () => {
  it("opens as a named dialog and closes", async () => {
    const user = userEvent.setup();
    render(<Sheet><SheetTrigger asChild><Button>Details</Button></SheetTrigger><SheetContent><SheetTitle>bg-primary</SheetTitle><SheetDescription>Page and cards.</SheetDescription></SheetContent></Sheet>);
    await user.click(screen.getByRole("button", { name: "Details" }));
    expect(screen.getByRole("dialog", { name: "bg-primary" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("toast", () => {
  it("shows, runs its action, and dismisses", async () => {
    const user = userEvent.setup();
    const undo = vi.fn();
    render(<Toaster />);
    act(() => { toast.success({ title: "Token renamed", action: { label: "Undo", onClick: undo } }); });
    expect(await screen.findByText("Token renamed")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(undo).toHaveBeenCalled();
    act(() => { toast.dismiss(); });
  });
});
