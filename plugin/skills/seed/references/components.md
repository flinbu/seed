# Seed components

*package*: import from `@flinbu/seed` today. *design system*: specified in the Seed design system (live previews and props at https://claude.ai/artifact/3EcyStkY8yCeAxSM7a1biz); not in the npm package yet, so compose it from package parts and tokens following that spec.

## AI and chat

- **Message** (design system): One turn in a conversation: who said it, when, what, and what you can do with it
- **Bubble** (design system): The framed surface of one chat turn
- **MessageScroller** (design system): The scrolling transcript of a conversation
- **Attachment** (design system): A file or image in a conversation or an upload list: its icon or preview, name, details, upload state and actions
- **CodeBlock** (design system): Code, terminal commands, logs and diffs: in docs, in Pluto's answers, and in token change proposals
- **Marker** (design system): A small inline line in a conversation: what is happening now, a system note, or a labeled divider such as a date
- **Trace** (design system): The steps behind an answer: what Pluto read, checked, found and is doing now
- **Questionnaire** (design system): A short set of questions asked one at a time, for when Pluto needs a decision before it can help: what to check, which themes, what to name something

## Actions

- **Button** (package): The one button in Seed
- **Toggle** (package): A Button that stays pressed: formatting tools, view switches, filters that apply instantly
- **ButtonGroup** (package): Joins related Buttons into one control: a split button with its menu, Undo and Redo, a zoom stepper, an Input with its action
- **Toolbar** (package): A row of related controls with one Tab stop: canvas tools, editor formatting, preview options

## Data display

- **Badge** (package): A short status or category label: one or two words, optionally with a dot or an icon
- **Avatar** (package): A person's or workspace's picture, falling back to initials, then to the `user` icon
- **Kbd** (package): A keyboard key, for shortcuts in menus, tooltips and help text
- **Table** (package): Displays rows of structured data with sorting, selection, loading and empty states
- **Item** (package): A row for one thing, with media, a title, a description and actions: integrations, members, files, settings entries
- **DataTable** (design system): A list of records with everything around it: search, sorting across all pages, column visibility, pagination, selection and bulk actions
- **Chart** (design system): Bar, stacked bar, line and area charts drawn in Seed's chart palette, with a tooltip, keyboard reading and a table view built in
- **StatTile** (design system): One number that answers a question at a glance: adoption, open issues, components, credits
- **Tag** (package): A small label people can act on: filter by it, remove it, or read a token's color at a glance
- **DescriptionList** (package): Pairs of labels and values: a token's details, a version's metadata, account settings to read
- **Timeline** (package): Events in order: a version history, an activity feed, the steps of a sync
- **AvatarGroup** (package): A stack of people: who's in a file, who reviewed a change, who's online
- **CommentThread** (design system): A conversation between people pinned to something: a token, a component, a proposal

## Design system

- **ColorSwatch** (design system): One color token: its color on the checkerboard (so transparency reads as transparency), its name, value and alias, and a copy Button
- **ColorScale** (design system): A color ramp from 50 to 950 in one row: to read a primitive scale, see where the brand color sits, or pick a step
- **TokenPreview** (design system): Shows what a non-color token does: spacing as a bar, a radius as a corner, a shadow on a card, a border width, an opacity, a duration as motion
- **TypeSpecimen** (design system): One text style: its name, its specs (family, size and line height, weight, tracking) and a sample set in it
- **ContrastPair** (design system): A contrast check for one pair of colors: the pair drawn as a sample, the WCAG ratio, and whether it passes, in Light and Dark side by side
- **ColorPicker** (design system): Pick a color by eye or by value: a saturation and brightness area, a hue slider, a hex field, the OKLCH reading, and suggested swatches
- **TokenInput** (design system): A field to point at a token instead of a raw value: search by name or value, see each color or kind beside it
- **NumberInput** (design system): A number field with a unit and steppers: radii, spacing, durations, opacity
- **Stage** (design system): The frame where a component or a customer's design is shown: the checkerboard stage, a Light and Dark switch that themes only the frame, and preview widths
- **PropsTable** (design system): A component's API as a table: each prop's name, type, default and description

## Disclosure

- **Accordion** (package): Stacked sections that expand and collapse, for FAQs, settings groups and long forms split into steps
- **Collapsible** (package): One section that shows and hides its content: "Show more" lists, advanced settings, the reasoning behind a suggestion

## Feedback

- **Spinner** (package): An indeterminate loading indicator built on `Icon`
- **Skeleton** (package): A pulsing placeholder that holds the shape of content while it loads
- **Alert** (package): An inline message about the state of a page or section that stays until the situation changes
- **Toast** (package): A short, temporary notification about something that just happened, shown in a stack at a corner of the screen
- **Progress** (package): A horizontal bar showing how far a task has progressed, or that it is running when the amount is unknown
- **EmptyState** (package): Fills a space that has no content yet, explains why, and offers the next step
- **Banner** (package): A full-width message about the whole app or page: a paused sync, a read-only version, a trial ending
- **Meter** (package): A measured amount within a known range: credits used, adoption, storage

## Forms

- **Label** (package): A form label used by every Seed control that has a visible caption (`Checkbox`, `Radio`, `Switch`, and later `Field`)
- **Input** (package): A single-line text field with optional leading and trailing icons
- **Textarea** (package): A multi-line text field that shares `Input`'s styling
- **Checkbox** (package): A checkbox for independent on/off choices and multi-select lists, with an optional built-in label and description
- **RadioGroup** (package): A group of mutually exclusive options
- **Radio** (package): One option inside a `RadioGroup`
- **Switch** (package): A toggle for a setting that takes effect immediately
- **Field** (package): Wraps one form control with its label, hint and error, and wires them together
- **Select** (package): A single-choice dropdown for picking one value from a list too long for `RadioGroup` (about seven or more, or where space is tight)
- **Combobox** (package): A searchable single-choice list: type to filter, then pick
- **Slider** (package): Picks a number from a range by dragging, for values where the feel matters more than the exact number (volume, opacity, radius)
- **Calendar** (package): A month grid for picking a single date or a range
- **DatePicker** (package): A date field: an Input-style trigger that opens a `Calendar` in a `Popover`
- **FileUpload** (package): Lets people add files by dropping them or browsing, and shows each file's state
- **RichTextEditor** (design system): A WYSIWYG editor for formatted text: descriptions, comments, release notes, help articles
- **OtpInput** (package): A one-time code split into one cell per character: email codes, authenticator apps, SMS
- **InputGroup** (package): An Input with add-ons inside its frame: a fixed prefix or suffix, an icon, a Button (copy, clear, show password), a `Kbd` hint, or toolbars above and below a multiline field such as Pluto's prompt
- **TagInput** (package): A field that turns typed text into tags: components in a release, keywords, aliases, people to notify
- **CopyField** (package): A read-only value with a copy button: install commands, API keys, token names, URLs
- **PasswordInput** (package): A password field with a Show/Hide toggle and, when creating a password, a live list of requirements
- **MentionInput** (design system): A text area that suggests people, tokens or components as you type a trigger: `@` to mention, `#` to link a token
- **DateRangePicker** (package): Picks a start and end date, with presets for the common ranges
- **TimePicker** (design system): Picks a time of day from a list or by typing

## Foundations

- **Icon** (package): The single source of icons in Seed: the full Lucide set (version 1.49.0, 1,857 icons, ISC license), drawn through one component
- **Typography** (design system): Seed's type for reading: `Typography` styles rendered rich text and Markdown (headings, paragraphs, lists, quotes, code, tables), and `Heading` and `Text` set single pieces of copy with the right type style
- **DirectionProvider** (design system): Sets the reading direction for everything inside it: right-to-left for Arabic, Hebrew or Persian, left-to-right otherwise
- **VisuallyHidden** (package): Hides content on screen but keeps it for screen readers: extra context on a number, a label for a field whose purpose is visible, a skip link

## Layout

- **Separator** (package): A 1px rule that divides content, horizontal or vertical
- **Card** (package): A bordered container that groups related content and actions
- **Tabs** (package): Switches between views in the same context without leaving the page
- **ScrollArea** (package): A scrolling region with Seed's thin scrollbars on every operating system, for lists and panels with a fixed height: sidebars, menus of results, a long token list in a card
- **AspectRatio** (package): Keeps media at a fixed shape while its width changes: thumbnails, video embeds, component previews, cover images
- **Carousel** (design system): A row of slides that scrolls sideways: theme presets, templates, screenshots, onboarding cards
- **Resizable** (design system): Panels split by handles people drag: an editor with a list, a canvas and an inspector
- **PageHeader** (package): The top of a page: where you are, what this is, and the main actions
- **Stack** (package): Vertical layout with token gaps
- **Inline** (package): Horizontal layout that wraps: badges, button rows, a title with its actions
- **Grid** (package): Columns of equal width: cards, swatches, settings
- **Container** (package): Centers content at a readable width with side gutters that grow with the screen (16, 24, then 40px)

## Navigation

- **Breadcrumb** (package): Shows where a page sits in the hierarchy and links back up it
- **Pagination** (package): Moves through pages of a long list or table
- **Sidebar** (package): The app's main navigation column: sections of links, nested groups, a header and a footer, collapsible to icons
- **Stepper** (package): Numbered steps for a flow people move through in order: onboarding, an import, a release
- **FileTree** (package): A folder tree for generated files: export bundles, a GitHub sync, a component's source
- **Menubar** (package): A horizontal row of menus, as in a desktop app (File, Edit, View), for editors with many commands
- **NavigationMenu** (design system): The main navigation of a site: plain links and menus that drop a panel of links with short descriptions (Product, Resources, Pricing)
- **TableOfContents** (design system): An "On this page" list that follows the reader as they scroll and jumps to a section on click
- **Link** (package): Text that goes somewhere

## Overlays

- **Tooltip** (package): A short label that appears on hover or focus, mainly to name icon-only buttons and show shortcuts
- **Popover** (package): A floating panel anchored to a trigger, for small forms, filters and details that belong to one control
- **DropdownMenu** (package): A menu of commands opened from a trigger: row actions, "More" menus, account menus
- **Dialog** (package): A modal window for focused tasks and confirmations that must be finished or dismissed before going back to the page
- **Sheet** (package): A panel that slides in from the edge of the screen for secondary tasks that need more room than a popover but should keep the page in view: filters, details, edit forms, mobile navigation
- **HoverCard** (package): A rich preview that appears when hovering or focusing a link: a person, a page, a record
- **CommandPalette** (package): A keyboard-first search for commands and pages, opened with Cmd/Ctrl+K
- **AlertDialog** (package): A modal that asks for one decision and waits for it: confirming a delete, discarding unsaved changes, leaving a flow halfway
- **Drawer** (package): A panel that rises from the bottom of the screen with a grab handle, for short tasks on touch screens: picking an option, a quick form, the actions for one item
- **ContextMenu** (package): A menu that opens where you right-click, holding the commands for the thing under the pointer: a canvas, a row, a file, a token
- **Tour** (design system): A short guided walk through a screen: a spotlight on one element at a time with a card that explains it

Also in the design system: `Seed.format` (numbers, percents, dates, relative times, ranges) and `Seed.color` (parse, contrast, OKLCH). The package adds `ThemeProvider`, `ThemeScript`, `useTheme` and `cn`.
