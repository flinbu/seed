# Seed accessibility (WCAG 2.2 AA, Light and Dark)

## Seed handles

Contrast of semantic text and icon tokens; a visible 2px `border-accent-primary` focus ring (never remove it); keyboard patterns in menus, tabs, listboxes, dialogs (focus trap and return), Escape closes floating things; ARIA roles and states; reduced motion; RTL mirroring with `DirectionProvider`.

## The builder handles

- Name everything: `aria-label` on icon-only buttons (matching the tooltip), alt text (empty for decoration), a label on every field (visually hidden if needed).
- One H1 per page, headings in order; pick the level for structure and the style for size.
- Never color alone: icon or word for status, legend or direct labels for charts, + and − for diffs.
- Targets at least 24×24px; controls default 40px, never smaller than 32px.
- 300-weight text only at `text-primary` or `text-secondary`; `text-tertiary` at 14px and up.
- Announce async results (live regions); toasts are polite.
- Don't auto-dismiss anything that needs action; no autoplay.
- Reflow at 320px wide and 200% text without horizontal scroll (tables and code may scroll inside).

## Checklist before shipping a screen

1. Tab through it: everything reachable, focus visible, logical order, no traps.
2. Screen reader: every control has a name, role and state.
3. Dark: nothing disappears, contrast holds.
4. Reduced motion: nothing essential depends on animation.
5. Zoom 200%: nothing cut off.
6. Grayscale: status and charts still read.
