# Setting up Seed

## Install

```bash
npm i @flinbu/seed @flinbu/seed-tokens lucide-react
```

`lucide-react` is optional; Seed takes any icon element.

## With Tailwind CSS v4

```css
/* app.css */
@import "tailwindcss";
@import "@flinbu/seed/styles.css";
```

This brings tokens, fonts and type styles, and tells Tailwind to scan Seed's components. Every token becomes a utility.

## Without Tailwind

```ts
import "@flinbu/seed/compiled.css";
```

## Light, Dark and system (Next.js App Router)

```tsx
import { ThemeProvider, ThemeScript } from "@flinbu/seed";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
```

`ThemeScript` sets the theme before paint (no flash). `useTheme()` reads and changes it. Without the provider, set `data-theme="light"` or `"dark"` on `<html>`.

## Server components

Display parts (Badge, Card, Skeleton, Kbd, EmptyState, Icon, Spinner) are server-safe. Interactive parts ship `"use client"`. Pass icons as elements so they work from server components.

## Example

```tsx
import { Button, Field, Input } from "@flinbu/seed";
import { Plus } from "lucide-react";

export function Invite() {
  return (
    <form className="flex flex-col gap-base">
      <Field label="Email" hint="They get a link that works for 7 days.">
        <Input type="email" placeholder="name@company.com" />
      </Field>
      <Button leftIcon={<Plus />}>Send invite</Button>
    </form>
  );
}
```
