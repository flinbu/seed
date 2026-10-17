"use client";
import * as React from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
  Button, ButtonGroup, ButtonGroupText, Collapsible, CollapsibleContent, CollapsibleTrigger,
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,
  Field, InputGroup, Kbd, Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger, ScrollArea, Switch,
} from "@flinbu/seed";
import { ArrowUp, ChevronDown, ChevronsUpDown, Copy, Minus, Paperclip, Pencil, Plus, Redo2, Search, Trash2, Undo2 } from "lucide-react";

export function AlertDialogBasic() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild><Button variant="destructive" leftIcon={<Trash2 />}>Delete token</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete brand-500?</AlertDialogTitle>
          <AlertDialogDescription>8 tokens point to it and will lose their value. You can’t undo this.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel /><AlertDialogAction>Delete</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DrawerBasic() {
  return (
    <Drawer>
      <DrawerTrigger asChild><Button variant="secondary">Filters</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader><DrawerTitle>Filters</DrawerTitle><DrawerDescription>Drag the handle down or press Escape to close.</DrawerDescription></DrawerHeader>
        <Switch label="With a Dark value" defaultChecked />
        <Switch label="Used by components" />
        <DrawerFooter><DrawerClose asChild><Button>Show 148 tokens</Button></DrawerClose></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function ContextMenuBasic() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-32 w-full max-w-sm items-center justify-center rounded-xl border border-dashed border-primary text-secondary body-body-3-regular">Right-click a token here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<Pencil />} shortcut="R">Rename</ContextMenuItem>
        <ContextMenuItem icon={<Copy />} shortcut="⌘D">Duplicate</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<Trash2 />} destructive>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function MenubarBasic() {
  const [grid, setGrid] = React.useState(true);
  return (
    <Menubar>
      <MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarItem shortcut="⌘N">New token</MenubarItem><MenubarItem shortcut="⌘I">Import…</MenubarItem><MenubarSeparator /><MenubarItem>Export</MenubarItem></MenubarContent></MenubarMenu>
      <MenubarMenu><MenubarTrigger>Edit</MenubarTrigger><MenubarContent><MenubarItem shortcut="⌘Z">Undo</MenubarItem><MenubarItem shortcut="⇧⌘Z">Redo</MenubarItem></MenubarContent></MenubarMenu>
      <MenubarMenu><MenubarTrigger>View</MenubarTrigger><MenubarContent><MenubarCheckboxItem checked={grid} onCheckedChange={setGrid}>Show grid</MenubarCheckboxItem></MenubarContent></MenubarMenu>
    </Menubar>
  );
}

export function CollapsibleBasic() {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-sm rounded-xl border border-secondary bg-primary p-sm">
      <CollapsibleTrigger asChild><Button variant="ghost" size="sm" rightIcon={<ChevronsUpDown />} className="w-full justify-between">Advanced settings</Button></CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-sm px-xs pt-sm"><Switch label="Keep aliases when renaming" defaultChecked /><Switch label="Sync descriptions to Figma" /></div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ScrollAreaBasic() {
  return (
    <ScrollArea aria-label="Changelog" className="h-48 w-full max-w-sm rounded-xl border border-secondary bg-primary">
      <ol className="m-0 flex list-none flex-col gap-sm p-base">
        {Array.from({ length: 12 }, (_, i) => <li key={i} className="text-secondary body-body-3-regular"><span className="font-mono text-primary">v2.{12 - i}.0</span>: tokens and components updated.</li>)}
      </ol>
    </ScrollArea>
  );
}

export function ButtonGroupBasic() {
  return (
    <div className="flex flex-wrap items-center gap-base">
      <ButtonGroup aria-label="History"><Button variant="secondary" leftIcon={<Undo2 />}>Undo</Button><Button variant="secondary" leftIcon={<Redo2 />}>Redo</Button></ButtonGroup>
      <ButtonGroup aria-label="Publish">
        <Button>Publish</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button icon={<ChevronDown />} aria-label="More publish options" /></DropdownMenuTrigger>
          <DropdownMenuContent align="end"><DropdownMenuItem>Publish as draft</DropdownMenuItem><DropdownMenuItem>Schedule…</DropdownMenuItem></DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <ButtonGroup aria-label="Zoom"><Button variant="secondary" icon={<Minus />} aria-label="Zoom out" /><ButtonGroupText>100%</ButtonGroupText><Button variant="secondary" icon={<Plus />} aria-label="Zoom in" /></ButtonGroup>
    </div>
  );
}

export function InputGroupBasic() {
  return (
    <div className="flex w-full max-w-md flex-col gap-base">
      <Field label="Docs address"><InputGroup start="https://" end=".fenly.io" defaultValue="acme" /></Field>
      <Field label="Search"><InputGroup start={<Search size={16} />} end={<Kbd>⌘K</Kbd>} placeholder="Tokens, components…" /></Field>
      <Field label="Ask Pluto"><InputGroup multiline placeholder="Which text colors fail contrast in Light?"
        bottom={<><Button variant="ghost" size="sm" icon={<Paperclip />} aria-label="Attach a file" /><Button size="sm" icon={<ArrowUp />} aria-label="Send" /></>} /></Field>
    </div>
  );
}
