---
"@flinbu/seed-tokens": minor
"@flinbu/seed": minor
---

Tables stack into cards on phones, so their text never shrinks. Below 768px (the `md` breakpoint) every row of a `Table`, `DataTable` or `PropsTable` becomes a full-width card: the first cell is the card's title (in `PropsTable`, the prop's name in mono, with required marked as before), and every other value sits under its column's header, small and muted, at the normal text size. No sideways scrolling and nothing squeezed. `DataTable` keeps its sort buttons and select all in a bar above the cards, and a row's checkbox moves to the card's corner. It stays accessible: rows keep table roles, so screen readers still read each value with its header, and the visible label is hidden from them so it isn't read twice. Headers come from the header row on their own; `TableCell` takes a `label` to set one by hand. Above 768px nothing changes. A table that has to stay a table on phones takes `stackOnMobile={false}` and scrolls sideways inside its frame, as before. The docs' own Props tables now use `PropsTable`.
