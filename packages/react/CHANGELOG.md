# @flinbu/seed

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
