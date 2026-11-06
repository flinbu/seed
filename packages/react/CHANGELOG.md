# @flinbu/seed

## 0.6.0

### Minor Changes

- c68817a: Tables stack into cards on phones, so their text never shrinks. Below 768px (the `md` breakpoint) every row of a `Table`, `DataTable` or `PropsTable` becomes a full-width card: the first cell is the card's title (in `PropsTable`, the prop's name in mono, with required marked as before), and every other value sits under its column's header, small and muted, at the normal text size. No sideways scrolling and nothing squeezed. `DataTable` keeps its sort buttons and select all in a bar above the cards, and a row's checkbox moves to the card's corner. It stays accessible: rows keep table roles, so screen readers still read each value with its header, and the visible label is hidden from them so it isn't read twice. Headers come from the header row on their own; `TableCell` takes a `label` to set one by hand. Above 768px nothing changes. A table that has to stay a table on phones takes `stackOnMobile={false}` and scrolls sideways inside its frame, as before. The docs' own Props tables now use `PropsTable`.

### Patch Changes

- Updated dependencies [c68817a]
  - @flinbu/seed-tokens@0.6.0

## 0.5.1

### Patch Changes

- Updated dependencies [56622a6]
  - @flinbu/seed-tokens@0.5.1

## 0.5.0

### Minor Changes

- a0c334b: Alerts and banners are calmer. Both now sit on the page's own surface (`bg-primary`) with the neutral card hairline, and only the icon carries the tone, so every existing `<Alert>` and `<Banner>` turns quiet with no code changes. The saturated tinted fills and strong borders are gone. When one alert really has to stand out, use the new `emphasis="loud"`: the same surface with a 1px hairline in the tone, from the new `border-info-subtle`, `border-success-subtle`, `border-warning-subtle`, `border-error-subtle` and `border-offer-subtle` tokens (the -300 step in Light, the -400 step at 40% over `bg-primary` in Dark). Announcements change too: an alert or banner rendered with the page has no live role, and one that appears later takes the new `live` prop to become `role="status"`, or `role="alert"` for errors only, so warnings no longer interrupt. Every alert and banner reads a visually hidden "Info:", "Success:", "Warning:" or "Error:" first (translate it with `toneLabel`), and links inside them use `text-accent-primary`.

### Patch Changes

- Updated dependencies [a0c334b]
  - @flinbu/seed-tokens@0.5.0

## 0.4.1

### Patch Changes

- bc8b60b: Placeholders, helper text and loading buttons meet WCAG AA contrast (FEN-202). `text-placeholder` now uses the tertiary text color (`neutral-600` in Light, `neutral-400` in Dark, was 2.5:1 and 3.7:1), and `text-tertiary` holds 4.5:1 on every neutral surface, `bg-tertiary` and `bg-selected` included (`neutral-600` in Light, was `neutral-500` at 4.3:1 and 4.0:1 there). `icon-placeholder` matches `icon-tertiary`. A disabled checkbox, radio or switch keeps its description in `text-tertiary`; `text-disabled` is only for the labels of disabled controls. A loading Button keeps its colors, focus and spinner, is `aria-busy` and `aria-disabled` instead of `disabled`, and ignores clicks and form submits until it's done.
- Updated dependencies [bc8b60b]
  - @flinbu/seed-tokens@0.4.1

## 0.4.0

### Patch Changes

- Updated dependencies [9b03a3d]
- Updated dependencies [89e242e]
  - @flinbu/seed-tokens@0.4.0

## 0.3.2

### Patch Changes

- Updated dependencies [e241b49]
  - @flinbu/seed-tokens@0.3.2

## 0.3.1

### Patch Changes

- Updated dependencies [cd55042]
  - @flinbu/seed-tokens@0.3.1

## 0.3.0

### Minor Changes

- aee72a8: Fenly Serif is Seed's serif: display titles and reading text use it, with Domine and Noto Serif as fallbacks. It's Seed's own variable font (weight 200 to 900, roman and italic), built from Literata under the SIL Open Font License; `scripts/fenly-serif` rebuilds it. Type sizes don't change.

### Patch Changes

- Updated dependencies [aee72a8]
  - @flinbu/seed-tokens@0.3.0

## 0.2.1

### Patch Changes

- 2df2eca: Match the reference design in six places:
  
  - CommandPalette: the search row keeps its 48px height, the list stops at 320px, rows are the regular menu height, and a footer shows the keys (↑ ↓ to navigate, ↵ to select, Esc to close). It's as wide as a medium Dialog.
  - Menu group labels read as written ("Go to"), not in uppercase mono, in every menu.
  - Sidebar: the active item is a raised white row, not a gray one.
  - Stepper: each step reads number, then name, with the line running to the next step.
  - Checkbox, Radio and Switch descriptions use body 3, like the label.
  - Progress: without a visible label, its aria-label names the bar itself.
  - Table headers and Sidebar counts use the mono spec voice: uppercase mono headers in the tertiary color, plain mono counts.
- @flinbu/seed-tokens@0.2.1

## 0.2.0

### Minor Changes

- ff512a3: Add the AI chat parts: Message and MessageGroup, Bubble and BubbleGroup, MessageScroller, Attachment and AttachmentGroup, CodeBlock (with a built-in highlighter and diffs), Marker, Trace and Questionnaire.
- ef22190: Add content and navigation components: Typography, Heading and Text, NavigationMenu, TableOfContents, MentionInput, TimePicker (with parseTime and formatTime), Tour and CommentThread.
- d727631: Add the last Seed design system components: DataTable, Chart (bar, stacked, line and area, with a validated palette and a table view), StatTile, Carousel, Resizable, DirectionProvider and RichTextEditor. Every component in the Seed design system is now in the package.
- b700a49: Add the design system tools: ColorSwatch, ColorScale, TokenPreview, TypeSpecimen, ContrastPair, ColorPicker, TokenInput, NumberInput, Stage and PropsTable, and export the color math they use (parseColor, toHex, formatColor, contrastRatio, formatRatio, toOklch, formatOklch, blend).
- 9f2f7dc: Layout and product pieces: Stack, Inline, Grid (fixed columns or auto-fill), Container, VisuallyHidden (skip links), PageHeader, Banner, Tag (toggle, remove, color chip), CopyField and CopyButton (with useCopy), DescriptionList, Timeline (with formatRelative) and Link (external links say they open a new tab).
- f7abade: AlertDialog (Cancel first, no close button), Drawer (bottom panel with a drag handle), ContextMenu and Menubar (the same rows as DropdownMenu), Collapsible, ScrollArea (focusable, thin scrollbars), ButtonGroup (split buttons, steppers) and InputGroup (prefixes, units, and a multiline prompt with toolbars).
- 91a72a8: TagInput (suggestions, validation, paste a list), PasswordInput (Show/Hide, live requirements), AvatarGroup and Avatar presence (status is part of the name), Toolbar (one tab stop, arrow keys), Meter and ProgressRing, Item and ItemGroup, and AspectRatio.
- 1683ec7: Phase 2, second batch: Combobox (search with keywords, clearable), Sheet (right, left, bottom), toast and Toaster (one action, errors stay), Accordion (real headings), Breadcrumb (collapses into a menu) and Pagination (page ranges, compact on phones). DropdownMenuItem now supports asChild for links.
- 28bdbd1: Phase 2, third batch: Slider (single and range, formatted values), OtpInput (paste, one-time-code autofill, groups), Stepper (horizontal and vertical, go back to finished steps), Sidebar (sections, nested groups, badges, collapses to icons with tooltips) and HoverCard. Field now gives its label an id, so controls that aren't inputs (Slider, OtpInput) are named by it.
- 997e83f: Phase 2, first batch: Select, Dialog, Popover, DropdownMenu (checkbox, radio and sub menus), Tooltip, Tabs (line and pill, with counts) and Table (sortable headers, selected rows, density). All built on Radix, styled with Seed tokens, tested with axe.
- 5ef143e: Phase 3: Calendar (single or range, one or two months, keyboard grid), DatePicker, DateRangePicker (presets, Apply), CommandPalette (⌘K, groups, keywords, shortcuts), FileUpload (type and size checks, progress) and FileTree (the ARIA tree pattern).

### Patch Changes

- @flinbu/seed-tokens@0.2.0

## 0.1.2

### Patch Changes

- 6635cb6: Both packages link to the docs site as their homepage. First release staged by the GitHub workflow through trusted publishing.
- Updated dependencies [6635cb6]
  - @flinbu/seed-tokens@0.1.2
