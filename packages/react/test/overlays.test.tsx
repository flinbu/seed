import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Copy, Trash2 } from "lucide-react";
import {
  Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose,
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  Field, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Tooltip,
} from "../src/index.js";
import { violations } from "./a11y.js";

describe("Phase 2 renders accessibly", () => {
  it("has no axe violations closed", async () => {
    const { container } = render(
      <main>
        <Field label="Mode" hint="Applies to every token."><Select defaultValue="light"><SelectTrigger /><SelectContent><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem></SelectContent></Select></Field>
        <Tabs defaultValue="all"><TabsList aria-label="Token views"><TabsTrigger value="all" count={446}>All</TabsTrigger><TabsTrigger value="sem">Semantic</TabsTrigger></TabsList><TabsContent value="all">All tokens</TabsContent><TabsContent value="sem">Semantic</TabsContent></Tabs>
        <Table aria-label="Tokens"><TableHeader><TableRow><TableHead sort="ascending" onSort={() => {}}>Name</TableHead><TableHead align="right">Uses</TableHead></TableRow></TableHeader>
          <TableBody><TableRow selected><TableCell>bg-primary</TableCell><TableCell align="right">14</TableCell></TableRow></TableBody></Table>
        <Tooltip content="Copy" shortcut="⌘C"><Button icon={<Copy />} aria-label="Copy" variant="ghost" /></Tooltip>
      </main>,
    );
    expect(await violations(container)).toEqual([]);
  });
  it("has no axe violations open", async () => {
    render(
      <Dialog defaultOpen><DialogContent><DialogHeader><DialogTitle>Rename token</DialogTitle><DialogDescription>Every alias follows the new name.</DialogDescription></DialogHeader>
        <DialogFooter><DialogClose asChild><Button variant="tertiary">Cancel</Button></DialogClose><Button>Rename</Button></DialogFooter></DialogContent></Dialog>,
    );
    expect(await violations(document.body)).toEqual([]);
  });
});

describe("Select", () => {
  it("is wired to its Field and picks with the keyboard", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Field label="Mode" error="Pick a mode."><Select onValueChange={onChange}><SelectTrigger placeholder="Choose" /><SelectContent><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem></SelectContent></Select></Field>);
    const trigger = screen.getByRole("combobox", { name: "Mode" });
    expect(trigger.getAttribute("aria-invalid")).toBe("true");
    expect(trigger.getAttribute("aria-describedby")).toMatch(/error/);
    expect(trigger.textContent).toContain("Choose");
    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "Dark" }));
    expect(onChange).toHaveBeenCalledWith("dark");
    expect(trigger.textContent).toContain("Dark");
  });
});

describe("DropdownMenu", () => {
  it("opens from its trigger and runs an item", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="secondary">More</Button></DropdownMenuTrigger>
        <DropdownMenuContent><DropdownMenuLabel>Token</DropdownMenuLabel><DropdownMenuItem icon={<Copy />} shortcut="⌘D">Duplicate</DropdownMenuItem>
          <DropdownMenuCheckboxItem checked>Show in Dark</DropdownMenuCheckboxItem><DropdownMenuSeparator />
          <DropdownMenuItem icon={<Trash2 />} destructive onSelect={onDelete}>Delete</DropdownMenuItem></DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByRole("button", { name: "More" }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("menuitemcheckbox", { name: "Show in Dark" }).getAttribute("aria-checked")).toBe("true");
    await user.click(within(menu).getByRole("menuitem", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalled();
    expect(screen.queryByRole("menu")).toBeNull();
  });
});

describe("Dialog", () => {
  it("opens, is named by its title, and closes with Escape back to the trigger", async () => {
    const user = userEvent.setup();
    render(<Dialog><DialogTrigger asChild><Button>Rename</Button></DialogTrigger><DialogContent><DialogTitle>Rename token</DialogTitle><DialogDescription>Aliases follow.</DialogDescription></DialogContent></Dialog>);
    const trigger = screen.getByRole("button", { name: "Rename" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Rename token" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});

describe("Tabs", () => {
  it("moves with arrow keys and shows counts", async () => {
    const user = userEvent.setup();
    render(<Tabs defaultValue="a"><TabsList aria-label="Views" variant="pill"><TabsTrigger value="a" count={3}>All</TabsTrigger><TabsTrigger value="b">Color</TabsTrigger></TabsList><TabsContent value="a">A</TabsContent><TabsContent value="b">B</TabsContent></Tabs>);
    await user.click(screen.getByRole("tab", { name: /All/ }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Color" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toBe("B");
  });
});

describe("Table", () => {
  it("reports sort state and sorts on click", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(<Table><TableHeader><TableRow><TableHead sort="descending" onSort={onSort}>Name</TableHead><TableHead>Value</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>a</TableCell><TableCell>1</TableCell></TableRow></TableBody></Table>);
    const th = screen.getByRole("columnheader", { name: "Name" });
    expect(th.getAttribute("aria-sort")).toBe("descending");
    expect(screen.getByRole("columnheader", { name: "Value" }).getAttribute("aria-sort")).toBeNull();
    await user.click(within(th).getByRole("button"));
    expect(onSort).toHaveBeenCalled();
  });
});

describe("Popover and Tooltip", () => {
  it("Popover opens a dialog and closes with Escape", async () => {
    const user = userEvent.setup();
    render(<Popover><PopoverTrigger asChild><Button variant="secondary">Filters</Button></PopoverTrigger><PopoverContent aria-label="Filters">Body</PopoverContent></Popover>);
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("Tooltip shows on focus", async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Copy token" shortcut="⌘C"><Button icon={<Copy />} aria-label="Copy" variant="ghost" /></Tooltip>);
    await user.tab();
    expect((await screen.findByRole("tooltip")).textContent).toContain("Copy token");
  });
});
