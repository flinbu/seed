"use client";
import * as React from "react";
import { Button, Calendar, CommandPalette, DatePicker, DateRangePicker, Field, FileTree, FileUpload, Kbd, type DateRange, type UploadFile } from "@flinbu/seed";
import { Component, FileJson, Palette, Plus, Search, Settings, Sun } from "lucide-react";

export function CalendarSingle() {
  const [d, setD] = React.useState<Date | null>(new Date());
  return <Calendar value={d} onValueChange={setD} isDateDisabled={(x) => x.getDay() === 0} />;
}

export function CalendarRange() {
  const t = new Date();
  const [r, setR] = React.useState<DateRange | null>({ from: new Date(t.getFullYear(), t.getMonth(), 3), to: new Date(t.getFullYear(), t.getMonth(), 9) });
  return <Calendar mode="range" months={2} value={r} onValueChange={setR} />;
}

export function DatePickerBasic() {
  return (
    <div className="grid w-full max-w-lg gap-base sm:grid-cols-2">
      <Field label="Publish on"><DatePicker defaultValue={new Date()} /></Field>
      <Field label="Release window" hint="Presets apply at once."><DateRangePicker /></Field>
    </div>
  );
}

export function CommandPaletteBasic() {
  return (
    <div className="flex items-center gap-xs">
      <CommandPalette
        trigger={<Button variant="secondary" leftIcon={<Search />}>Search</Button>}
        groups={[
          { label: "Create", items: [{ label: "New token", icon: <Plus />, shortcut: ["⌘", "N"], keywords: ["add"] }, { label: "New component", icon: <Component /> }] },
          { label: "Go to", items: [{ label: "Color tokens", icon: <Palette />, description: "148 tokens" }, { label: "Settings", icon: <Settings />, shortcut: ["⌘", ","] }] },
          { label: "Preferences", items: [{ label: "Switch to Dark", icon: <Sun />, keywords: ["theme", "mode"] }] },
        ]} />
      <span className="text-tertiary body-body-3-regular">or press <Kbd>⌘</Kbd> <Kbd>K</Kbd></span>
    </div>
  );
}

export function FileUploadBasic() {
  const [files, setFiles] = React.useState<UploadFile[]>([{ id: "a", name: "tokens.json", size: 38400 }, { id: "b", name: "figma-export.json", size: 412000, progress: 64 }]);
  return (
    <div className="w-full max-w-md">
      <FileUpload files={files} onFilesChange={setFiles} accept=".json" maxSize={2 * 1024 * 1024} title="Drop a tokens file or browse" hint="DTCG or Tokens Studio JSON, up to 2 MB." />
    </div>
  );
}

export function FileTreeBasic() {
  const [sel, setSel] = React.useState<string | null>("css/tokens.css");
  return (
    <div className="w-full max-w-xs rounded-xl border border-secondary bg-primary p-xs">
      <FileTree expandAll selected={sel} onSelect={setSel} aria-label="Export"
        items={[
          { name: "css", children: [{ name: "tokens.css", meta: "14 KB" }, { name: "tokens.dark.css", meta: "9 KB" }] },
          { name: "tailwind", children: [{ name: "theme.css", meta: "6 KB" }] },
          { name: "tokens.json", meta: "38 KB", icon: <FileJson /> },
        ]} />
    </div>
  );
}
