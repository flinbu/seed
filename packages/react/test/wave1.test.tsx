import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
  Button, ButtonGroup, ButtonGroupText, Collapsible, CollapsibleContent, CollapsibleTrigger, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger,
  Drawer, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger, Field, InputGroup, Kbd, Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger, ScrollArea,
} from "../src/index.js";
import { violations } from "./a11y.js";

describe("wave 1 renders accessibly", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <main>
        <ButtonGroup aria-label="History"><Button variant="secondary">Undo</Button><Button variant="secondary">Redo</Button></ButtonGroup>
        <ButtonGroup aria-label="Zoom"><Button variant="secondary" aria-label="Zoom out">−</Button><ButtonGroupText>100%</ButtonGroupText><Button variant="secondary" aria-label="Zoom in">+</Button></ButtonGroup>
        <Field label="Site"><InputGroup start="https://" end=".fenly.io" /></Field>
        <Field label="Message"><InputGroup multiline bottom={<><Kbd>⌘</Kbd><Button size="sm">Send</Button></>} /></Field>
        <Collapsible><CollapsibleTrigger asChild><Button variant="ghost">Advanced</Button></CollapsibleTrigger><CollapsibleContent>Body</CollapsibleContent></Collapsible>
        <ScrollArea aria-label="Changelog" className="h-40"><p>Long text</p></ScrollArea>
        <Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarItem>New</MenubarItem></MenubarContent></MenubarMenu></Menubar>
      </main>,
    );
    expect(await violations(container)).toEqual([]);
  });
});

describe("AlertDialog", () => {
  it("has no close button, focuses Cancel, and runs the action", async () => {
    const user = userEvent.setup();
    const del = vi.fn();
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild><Button variant="destructive">Delete</Button></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete brand-500?</AlertDialogTitle><AlertDialogDescription>8 tokens point to it.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel /><AlertDialogAction onClick={del}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dlg = screen.getByRole("alertdialog", { name: "Delete brand-500?" });
    expect(document.activeElement).toBe(within(dlg).getByRole("button", { name: "Cancel" }));
    expect(within(dlg).queryByRole("button", { name: "Close" })).toBeNull();
    await user.click(within(dlg).getByRole("button", { name: "Delete" }));
    expect(del).toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });
});

describe("Drawer", () => {
  it("opens as a named dialog and closes with Escape", async () => {
    const user = userEvent.setup();
    render(<Drawer><DrawerTrigger asChild><Button>Filters</Button></DrawerTrigger><DrawerContent><DrawerTitle>Filters</DrawerTitle><DrawerDescription>Narrow the list.</DrawerDescription></DrawerContent></Drawer>);
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("ContextMenu and Menubar", () => {
  it("opens on right-click", async () => {
    const sel = vi.fn();
    render(<ContextMenu><ContextMenuTrigger><div>Token row</div></ContextMenuTrigger><ContextMenuContent><ContextMenuItem onSelect={sel}>Duplicate</ContextMenuItem></ContextMenuContent></ContextMenu>);
    fireEvent.contextMenu(screen.getByText("Token row"));
    const item = await screen.findByRole("menuitem", { name: "Duplicate" });
    fireEvent.click(item);
    expect(sel).toHaveBeenCalled();
  });
  it("menubar opens a menu and moves between menus with arrows", async () => {
    const user = userEvent.setup();
    render(<Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarItem>New</MenubarItem></MenubarContent></MenubarMenu>
      <MenubarMenu><MenubarTrigger>Edit</MenubarTrigger><MenubarContent><MenubarItem>Undo</MenubarItem></MenubarContent></MenubarMenu></Menubar>);
    expect(screen.getByRole("menubar")).toBeTruthy();
    await user.click(screen.getByRole("menuitem", { name: "File" }));
    expect(await screen.findByRole("menuitem", { name: "New" })).toBeTruthy();
    await user.keyboard("{ArrowRight}");
    expect(await screen.findByRole("menuitem", { name: "Undo" })).toBeTruthy();
  });
});

describe("Collapsible, ButtonGroup, InputGroup", () => {
  it("collapsible toggles", async () => {
    const user = userEvent.setup();
    render(<Collapsible><CollapsibleTrigger>Advanced</CollapsibleTrigger><CollapsibleContent>Hidden settings</CollapsibleContent></Collapsible>);
    const t = screen.getByRole("button", { name: "Advanced" });
    expect(t.getAttribute("aria-expanded")).toBe("false");
    await user.click(t);
    expect(t.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByText("Hidden settings")).toBeTruthy();
  });
  it("button group is a group; input group wires its Field", () => {
    render(<><ButtonGroup aria-label="History"><Button>Undo</Button></ButtonGroup><Field label="Site" error="Use letters only."><InputGroup start="https://" /></Field></>);
    expect(screen.getByRole("group", { name: "History" })).toBeTruthy();
    const input = screen.getByRole("textbox", { name: "Site" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("https://")).toBeTruthy();
  });
});
