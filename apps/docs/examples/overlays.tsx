"use client";
import * as React from "react";
import {
  Badge, Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
  Field, Input, Popover, PopoverClose, PopoverContent, PopoverTrigger, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger,
  Switch, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsList, TabsTrigger, Tooltip,
} from "@flinbu/seed";
import { Copy, Ellipsis, Moon, Palette, Pencil, Redo2, Ruler, Share, SlidersHorizontal, Sun, Trash2, Undo2 } from "lucide-react";

export function SelectBasic() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-base">
      <Field label="Mode" hint="New tokens get a value in this mode first.">
        <Select defaultValue="light">
          <SelectTrigger />
          <SelectContent>
            <SelectItem value="light" icon={<Sun />}>Light</SelectItem>
            <SelectItem value="dark" icon={<Moon />}>Dark</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Collection" error="Pick where the token goes.">
        <Select>
          <SelectTrigger placeholder="Choose a collection" />
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Semantic</SelectLabel>
              <SelectItem value="color" icon={<Palette />} description="148 tokens">Color</SelectItem>
              <SelectItem value="space" icon={<Ruler />} description="24 tokens">Spacing</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectItem value="primitives" disabled>Primitives (read only)</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

export function DropdownBasic() {
  const [dark, setDark] = React.useState(true);
  const [sort, setSort] = React.useState("name");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="secondary" icon={<Ellipsis />} aria-label="Token actions" /></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>bg-accent-solid</DropdownMenuLabel>
        <DropdownMenuItem icon={<Pencil />} shortcut="R">Rename</DropdownMenuItem>
        <DropdownMenuItem icon={<Copy />} shortcut="⌘D">Duplicate</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon={<Share />}>Copy as</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>CSS variable</DropdownMenuItem>
            <DropdownMenuItem>Tailwind class</DropdownMenuItem>
            <DropdownMenuItem>Hex value</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={dark} onCheckedChange={setDark}>Show Dark value</DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="name">Sort by name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="uses">Sort by uses</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={<Trash2 />} destructive>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DialogBasic() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button>Rename token</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename token</DialogTitle>
          <DialogDescription>14 components use bg-accent-solid. They all follow the new name.</DialogDescription>
        </DialogHeader>
        <Field label="Name" hint="Lowercase, with dashes."><Input defaultValue="bg-accent-solid" /></Field>
        <DialogFooter>
          <DialogClose asChild><Button variant="tertiary">Cancel</Button></DialogClose>
          <Button>Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PopoverBasic() {
  return (
    <Popover>
      <PopoverTrigger asChild><Button variant="secondary" leftIcon={<SlidersHorizontal />}>Filters</Button></PopoverTrigger>
      <PopoverContent aria-label="Filters" className="flex flex-col gap-base">
        <p className="m-0 label-label-2-semibold text-primary">Show tokens</p>
        <Switch label="With a Dark value" defaultChecked />
        <Switch label="Used by components" />
        <div className="flex justify-end"><PopoverClose asChild><Button size="sm">Done</Button></PopoverClose></div>
      </PopoverContent>
    </Popover>
  );
}

export function TooltipBasic() {
  return (
    <div className="flex gap-xxs">
      <Tooltip content="Undo" shortcut="⌘Z"><Button variant="ghost" icon={<Undo2 />} aria-label="Undo" /></Tooltip>
      <Tooltip content="Redo" shortcut="⇧⌘Z"><Button variant="ghost" icon={<Redo2 />} aria-label="Redo" /></Tooltip>
      <Tooltip content="Copy CSS variable" side="bottom"><Button variant="ghost" icon={<Copy />} aria-label="Copy CSS variable" /></Tooltip>
    </div>
  );
}

export function TabsLine() {
  return (
    <Tabs defaultValue="all" className="w-full max-w-lg">
      <TabsList aria-label="Token views">
        <TabsTrigger value="all" count={446}>All</TabsTrigger>
        <TabsTrigger value="semantic" count={148}>Semantic</TabsTrigger>
        <TabsTrigger value="primitives">Primitives</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="text-secondary body-body-3-regular">Every token in Light and Dark.</TabsContent>
      <TabsContent value="semantic" className="text-secondary body-body-3-regular">Tokens that switch with the theme.</TabsContent>
      <TabsContent value="primitives" className="text-secondary body-body-3-regular">Raw scales for charts and illustration.</TabsContent>
    </Tabs>
  );
}

export function TabsPill() {
  return (
    <Tabs defaultValue="preview">
      <TabsList variant="pill" aria-label="View">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="text-secondary body-body-3-regular">The live component.</TabsContent>
      <TabsContent value="code" className="text-secondary body-body-3-regular">Its source.</TabsContent>
    </Tabs>
  );
}

const ROWS = [
  { name: "bg-accent-solid", value: "#2563EB", uses: 14, status: "Published" },
  { name: "text-secondary", value: "#525252", uses: 52, status: "Published" },
  { name: "border-focus", value: "#2563EB", uses: 0, status: "Draft" },
];
export function TableBasic() {
  const [dir, setDir] = React.useState<"ascending" | "descending">("ascending");
  const rows = [...ROWS].sort((a, b) => (dir === "ascending" ? 1 : -1) * a.name.localeCompare(b.name));
  return (
    <Table frameClassName="max-w-xl">
      <TableCaption>3 of 446 tokens</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead sort={dir} onSort={() => setDir(dir === "ascending" ? "descending" : "ascending")}>Token</TableHead>
          <TableHead>Light</TableHead>
          <TableHead align="right">Uses</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.name} selected={r.name === "text-secondary"}>
            <TableCell className="font-mono">{r.name}</TableCell>
            <TableCell className="font-mono text-secondary">{r.value}</TableCell>
            <TableCell align="right">{r.uses}</TableCell>
            <TableCell><Badge variant={r.status === "Draft" ? "warning" : "success"} dot>{r.status}</Badge></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
