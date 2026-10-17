# @flinbu/seed

Seed is a calm, neutral-first design system for React and Tailwind CSS v4. Its surfaces are true gray, it has one accent you can make your own, and its contrast passes WCAG AA in Light and Dark. The interactive parts are built on [Radix Primitives](https://www.radix-ui.com/primitives), so keyboard, focus and screen readers are handled for you.

**Docs and live theme builder:** [seed-lyart.vercel.app](https://seed-lyart.vercel.app)

```bash
npm i @flinbu/seed @flinbu/seed-tokens lucide-react
```

`lucide-react` is optional: Seed takes any icon, and the examples use Lucide.

## Setup

### With Tailwind CSS v4

```css
/* app.css */
@import "tailwindcss";
@import "@flinbu/seed/styles.css";
```

That one line brings in Seed's tokens, fonts and type styles, and tells Tailwind to scan Seed's components for their classes. Every token is now a utility you can use in your own code: `bg-primary`, `text-secondary`, `border-primary`, `p-base`, `gap-xs`, `rounded-control`, `shadow-elevation-md`, `label-label-2-medium`.

### Without Tailwind

```ts
import "@flinbu/seed/compiled.css";
```

## Use it

```tsx
import { Button, Field, Input, ThemeProvider, ThemeScript } from "@flinbu/seed";
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

Icons are passed as elements (`leftIcon={<Plus />}`), so they also work from React Server Components.

### Light, Dark and system

```tsx
// app/layout.tsx (Next.js App Router)
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

`ThemeScript` sets the theme before the page paints, so it never flashes. `useTheme()` reads it and changes it.

## Make it yours

The theme builder runs one command. It turns your brand color into a full scale for Light and Dark, checks every accent against WCAG AA, and moves any token that fails until it passes:

```bash
npx seed theme --brand "#0d9488" --name acme --radius round --out src/acme.css
```

```css
@import "tailwindcss";
@import "@flinbu/seed/styles.css";
@import "./acme.css";
```

Then set `data-brand="acme"` on `<html>`, or on any element to theme just that part of the page. You can also try themes live on the [theming page](https://seed-lyart.vercel.app/docs/theming).

## Components

- **Actions:** Button, ButtonGroup, Toggle, ToggleGroup.
- **Forms:** Input, Textarea, Field, Label, Checkbox, RadioGroup, Switch, Select, Combobox, Slider, OtpInput, Calendar, DatePicker, DateRangePicker, FileUpload, CopyField + CopyButton, InputGroup.
- **Overlays:** Dialog, AlertDialog, Sheet, Drawer, Popover, HoverCard, CommandPalette (⌘K), ContextMenu, DropdownMenu (with checkbox, radio and sub menus), Tooltip.
- **Navigation:** Tabs (line and pill, with counts), Breadcrumb, Pagination, Stepper, Sidebar (collapses to icons), Menubar, Link.
- **Display:** Badge, Avatar, Icon, Kbd, Card, Separator, Table (sortable headers, selected rows), Accordion, FileTree, Tag, DescriptionList, Timeline.
- **Feedback:** Alert, Banner, toast + Toaster, Progress, Skeleton, Spinner, EmptyState.
- **Layout:** Stack, Inline, Grid, Container, VisuallyHidden, PageHeader, Collapsible, ScrollArea.
- **Theme:** ThemeProvider, ThemeScript, useTheme.

More are coming from the Seed design system: TagInput, PasswordInput, AvatarGroup, Toolbar, Meter, chat parts, design system tools and charts.

## Related

- [`@flinbu/seed-tokens`](https://www.npmjs.com/package/@flinbu/seed-tokens): the tokens on their own, as CSS variables, a Tailwind theme and DTCG JSON, plus `createTheme()` and the `seed` CLI.
- [GitHub](https://github.com/flinbu/seed)

Seed is the UI of [Fenly](https://fenly.io), open for everyone. MIT © Felipe Linares.
