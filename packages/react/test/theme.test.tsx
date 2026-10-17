import * as React from "react";
import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { ThemeProvider, ThemeScript, useTheme } from "../src/index.js";

function Probe() {
  const { theme, setTheme } = useTheme();
  return <button onClick={() => setTheme("dark")}>{theme}</button>;
}
describe("ThemeProvider", () => {
  it("sets data-theme and data-brand on <html> and remembers the choice", async () => {
    localStorage.clear();
    render(<ThemeProvider brand="acme"><Probe /></ThemeProvider>);
    expect(document.documentElement.getAttribute("data-theme")).toBe("system");
    expect(document.documentElement.getAttribute("data-brand")).toBe("acme");
    await act(async () => screen.getByRole("button").click());
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("seed-theme")).toBe("dark");
  });
  it("ThemeScript sets the theme before React runs", () => {
    const { container } = render(<ThemeScript defaultTheme="dark" />);
    expect(container.querySelector("script")!.innerHTML).toContain('localStorage.getItem("seed-theme")');
  });
});
