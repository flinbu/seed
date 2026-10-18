import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  ColorPicker, ColorScale, ColorSwatch, ContrastPair, Field, NumberInput, PropsTable, Stage, TokenInput, TokenPreview, TypeSpecimen,
  contrastRatio, formatOklch, formatRatio, parseColor,
} from "../src/index.js";
import { violations } from "./a11y.js";

const BLUE = { "50": "#eff6ff", "500": "#3b82f6", "900": "#1e3a8a" };

describe("design system tools render accessibly", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <Stage title="Button">
          <ColorSwatch color="#2563eb" name="bg-accent-solid" alias="blue-600" usage="Primary actions" />
          <ColorSwatch color="#2563eb" name="bg-accent-solid" layout="row" />
        </Stage>
        <ColorScale name="blue" colors={BLUE} anchor="500" showValues />
        <ColorScale name="pick" colors={BLUE} defaultValue="500" onValueChange={() => {}} />
        <TokenPreview kind="radius" name="radius-md" value="8px" />
        <TokenPreview kind="duration" name="duration-base" value="200ms" layout="tile" />
        <TypeSpecimen styleName="heading-h5-semibold" sample="Save changes" specs={{ family: "Plus Jakarta Sans", size: "18px", lineHeight: "26px", weight: 600 }} />
        <ContrastPair label="Primary button" fg="#ffffff" bg="#2563eb" themes={["light", "dark"]} />
        <Field label="Brand color"><ColorPicker /></Field>
        <ColorPicker inline aria-label="Accent" swatches={["#2563eb", { color: "#16a34a", name: "Green" }]} />
        <Field label="Background"><TokenInput tokens={[{ name: "bg-primary", value: "#ffffff" }, { name: "space-base", value: "16px", kind: "space" }]} /></Field>
        <Field label="Radius"><NumberInput unit="px" defaultValue={8} min={0} /></Field>
        <PropsTable component="Button" props={[{ name: "variant", type: "'primary' | 'secondary'", default: "'primary'", description: "Look." }, { name: "children", required: true }]} />
      </main>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("color math", () => {
  it("parses, measures contrast and rounds down", () => {
    expect(parseColor("#fff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor("rgba(0, 0, 0, 50%)")!.a).toBe(0.5);
    expect(parseColor("nope")).toBeNull();
    const r = contrastRatio(parseColor("#767676")!, parseColor("#ffffff")!);
    expect(formatRatio(r)).toBe("4.5:1");
    expect(formatRatio(4.4999)).toBe("4.4:1");
    expect(formatOklch(parseColor("#ffffff")!)).toBe("oklch(100.0% 0.000 0.0)");
    // Translucent black at 50% over white blends to mid gray before measuring.
    expect(contrastRatio({ r: 0, g: 0, b: 0, a: 0.5 }, { r: 255, g: 255, b: 255, a: 1 })).toBeLessThan(5);
  });
});

describe("ColorSwatch, ColorScale, PropsTable", () => {
  it("copies the token name and reads the value", async () => {
    const user = userEvent.setup();
    render(<ColorSwatch color="rgb(37, 99, 235)" name="bg-accent-solid" />);
    expect(screen.getByText("#2563eb")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Copy bg-accent-solid" }));
    expect(await navigator.clipboard.readText()).toBe("bg-accent-solid");
  });
  it("selects steps as a radio group with arrows", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<ColorScale name="blue" colors={BLUE} anchor="500" defaultValue="500" onValueChange={change} />);
    const step = screen.getByRole("radio", { name: "blue 500, brand color" });
    expect(step.getAttribute("aria-checked")).toBe("true");
    step.focus();
    await user.keyboard("{ArrowRight}");
    expect(change).toHaveBeenLastCalledWith("900");
    expect(document.activeElement?.getAttribute("aria-label")).toBe("blue 900");
  });
  it("splits union types into chips and marks required props", () => {
    render(<PropsTable component="Button" props={[{ name: "size", type: "'sm' | 'md'", default: "'md'" }, { name: "children", required: true }]} />);
    expect(screen.getByRole("table", { name: "Button props" })).toBeTruthy();
    expect(screen.getByText("'sm'")).toBeTruthy();
    expect(screen.getByText("required")).toBeTruthy();
    expect(screen.getByLabelText("No default")).toBeTruthy();
  });
});

describe("ContrastPair", () => {
  it("says a failing pair fails in words", () => {
    render(<><ContrastPair fg="#9ca3af" bg="#ffffff" /><ContrastPair fg="#ffffff" bg="#1d4ed8" kind="large" /></>);
    expect(screen.getByText("Fails 4.5:1")).toBeTruthy();
    expect(screen.getByText("AAA")).toBeTruthy();
  });
});

describe("ColorPicker", () => {
  it("takes a pasted hex and moves the area with arrows", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<ColorPicker inline defaultValue="#808080" onValueChange={change} swatches={["#16a34a"]} />);
    const hex = screen.getByRole("textbox", { name: "Hex" });
    await user.clear(hex);
    await user.type(hex, "#ff0000");
    expect(change).toHaveBeenLastCalledWith("#ff0000");
    const area = screen.getByRole("slider", { name: "Saturation and brightness" });
    fireEvent.keyDown(area, { key: "ArrowDown", shiftKey: true });
    expect(change).toHaveBeenLastCalledWith("#e60000");
    await user.click(screen.getByRole("button", { name: "#16a34a" }));
    expect(change).toHaveBeenLastCalledWith("#16a34a");
  });
});

describe("NumberInput and TokenInput", () => {
  it("steps, clamps and follows the step's decimals", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<NumberInput aria-label="Opacity" defaultValue={0.5} min={0} max={1} step={0.1} onValueChange={change} />);
    const input = screen.getByRole("spinbutton", { name: "Opacity" });
    await user.click(input);
    await user.keyboard("{ArrowUp}");
    expect(change).toHaveBeenLastCalledWith(0.6);
    await user.keyboard("{Shift>}{ArrowUp}{/Shift}");
    expect(change).toHaveBeenLastCalledWith(1);
    await user.clear(input);
    await user.type(input, "-3{Enter}");
    expect(change).toHaveBeenLastCalledWith(0);
    expect(screen.getByRole("button", { name: "Decrease" }).hasAttribute("disabled")).toBe(true);
  });
  it("finds tokens by value", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<TokenInput aria-label="Token" onValueChange={change} tokens={[{ name: "bg-primary", value: "#ffffff" }, { name: "bg-accent-solid", value: "#2563eb" }]} />);
    await user.type(screen.getByRole("combobox", { name: "Token" }), "2563");
    await user.keyboard("{Enter}");
    expect(change).toHaveBeenLastCalledWith("bg-accent-solid");
  });
});

describe("Stage, TokenPreview, TypeSpecimen", () => {
  it("themes only the frame and switches widths", async () => {
    const user = userEvent.setup();
    const { container } = render(<Stage title="Card"><p>Inside</p></Stage>);
    expect(screen.getByRole("region", { name: "Card" })).toBeTruthy();
    const canvas = container.querySelector("[data-theme]")!;
    expect(canvas.getAttribute("data-theme")).toBe("light");
    await user.click(screen.getByRole("radio", { name: "Dark" }));
    expect(canvas.getAttribute("data-theme")).toBe("dark");
    await user.click(screen.getByRole("radio", { name: "Phone, 375px" }));
    expect((screen.getByText("Inside").parentElement as HTMLElement).style.width).toBe("375px");
  });
  it("shows given specs and token values", () => {
    render(<><TokenPreview name="space-base" value="var(--space-base)" display="16px" /><TypeSpecimen styleName="label-label-2-medium" specs={{ family: "Plus Jakarta Sans", size: "14px", lineHeight: "20px", weight: 500, tracking: "0" }} /></>);
    expect(screen.getByText("16px")).toBeTruthy();
    expect(screen.getByText("Plus Jakarta Sans · 14px / 20px · 500")).toBeTruthy();
  });
});
