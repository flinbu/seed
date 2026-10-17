import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  Badge, Banner, Button, Container, CopyButton, CopyField, DescriptionList, Field, Grid, Inline, Link, PageHeader, Stack, Tag, Timeline, VisuallyHidden, formatRelative,
} from "../src/index.js";
import { violations } from "./a11y.js";

describe("product pieces render accessibly", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <div>
        <Banner variant="warning" title="Figma sync paused." action={<Button size="sm" variant="secondary">Reconnect</Button>} onDismiss={() => {}}>Your changes are saved here.</Banner>
        <main>
          <Container size="md">
            <PageHeader eyebrow="Collection" title="Color" meta={<Badge>v2.4</Badge>} description="446 tokens." actions={<Button>New token</Button>} back={{ href: "/tokens", label: "Tokens" }} />
            <Stack divider>
              <Inline><Tag>Draft</Tag><Tag variant="success" onClick={() => {}} selected>Published</Tag><Tag swatch="#2563EB" onRemove={() => {}}>brand-500</Tag></Inline>
              <Grid columns={3}><div>a</div><div>b</div><div>c</div></Grid>
              <Field label="Install"><CopyField value="npm i @flinbu/seed" /></Field>
              <DescriptionList items={[{ term: "Token", description: "bg-primary", mono: true, copy: true }, { term: "Owner" }]} />
              <Timeline items={[{ title: "v2.4 published", time: new Date(Date.now() - 300000), status: "success" }, { title: "Draft created" }]} />
              <p>Read the <Link href="/docs">docs</Link> or the <Link href="https://w3.org" external>WCAG reference</Link>.</p>
              <p>94%<VisuallyHidden> of components use tokens</VisuallyHidden></p>
            </Stack>
          </Container>
        </main>
      </div>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("layout", () => {
  it("uses token gaps and puts dividers between children", () => {
    const { container } = render(<Stack gap="xs" divider><span>a</span><span>b</span><span>c</span></Stack>);
    const el = container.firstElementChild!;
    expect(el.className).toContain("gap-xs");
    expect(el.querySelectorAll("[role=none]").length).toBe(2);
    expect(render(<Inline as="ul" />).container.querySelector("ul")!.className).toContain("flex-wrap");
    expect(render(<Grid minChild="sm" />).container.firstElementChild!.className).toContain("auto-fill");
  });
});

describe("Tag", () => {
  it("toggles and removes", async () => {
    const user = userEvent.setup();
    const click = vi.fn(), remove = vi.fn();
    render(<><Tag onClick={click} selected={false}>Color</Tag><Tag onRemove={remove}>brand-500</Tag></>);
    const t = screen.getByRole("button", { name: "Color" });
    expect(t.getAttribute("aria-pressed")).toBe("false");
    await user.click(t);
    await user.click(screen.getByRole("button", { name: "Remove brand-500" }));
    expect(click).toHaveBeenCalled();
    expect(remove).toHaveBeenCalled();
  });
});

describe("CopyField", () => {
  it("masks secrets, reveals them, and copies", async () => {
    const user = userEvent.setup();
    const copied = vi.fn();
    render(<CopyField value="sk_live_123456789" secret revealPrefix={8} onCopy={copied} />);
    expect(screen.getByText(/^sk_live_•+$/)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Show" }));
    expect(screen.getByText("sk_live_123456789")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(copied).toHaveBeenCalledWith("sk_live_123456789");
    expect(await navigator.clipboard.readText()).toBe("sk_live_123456789");
    expect(screen.getAllByText("Copied").length).toBeGreaterThan(0);
  });
});

describe("Banner, PageHeader, Link, Timeline", () => {
  it("announces warnings and dismisses", async () => {
    const user = userEvent.setup();
    const off = vi.fn();
    render(<Banner variant="error" onDismiss={off}>Nothing was published.</Banner>);
    expect(screen.getByRole("alert").textContent).toContain("Nothing was published.");
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(off).toHaveBeenCalled();
  });
  it("has one h1 and a back link", () => {
    render(<PageHeader title="Color" back={{ href: "/t", label: "Tokens" }} />);
    expect(screen.getByRole("heading", { level: 1, name: "Color" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Tokens" }).getAttribute("href")).toBe("/t");
  });
  it("opens external links in a new tab and says so", () => {
    render(<Link href="https://x.dev" external>Spec</Link>);
    const a = screen.getByRole("link", { name: /^Spec\s*\(opens in a new tab\)$/ });
    expect(a.getAttribute("target")).toBe("_blank");
    expect(a.getAttribute("rel")).toContain("noopener");
  });
  it("formats relative times", () => {
    const now = new Date(2026, 9, 17, 12);
    expect(formatRelative(new Date(2026, 9, 17, 11, 8), now, "en")).toBe("52 minutes ago");
    expect(formatRelative(new Date(2026, 9, 16, 12), now, "en")).toBe("yesterday");
    expect(formatRelative(now, now, "en")).toBe("just now");
  });
});
