---
"@flinbu/seed": patch
---

Match the reference design in six places:

- CommandPalette: the search row keeps its 48px height, the list stops at 320px, rows are the regular menu height, and a footer shows the keys (↑ ↓ to navigate, ↵ to select, Esc to close). It's as wide as a medium Dialog.
- Menu group labels read as written ("Go to"), not in uppercase mono, in every menu.
- Sidebar: the active item is a raised white row, not a gray one.
- Stepper: each step reads number, then name, with the line running to the next step.
- Checkbox, Radio and Switch descriptions use body 3, like the label.
- Progress: without a visible label, its aria-label names the bar itself.
- Table headers and Sidebar counts use the mono spec voice: uppercase mono headers in the tertiary color, plain mono counts.
