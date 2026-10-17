# Seed for Claude

Teaches Claude to build and review UI with [Seed](https://seed-lyart.vercel.app), Fenly's open design system for React and Tailwind CSS v4.

## What it does

One skill, `seed`, that Claude uses whenever you build or review UI with Seed. It:

- sets up `@flinbu/seed` in a project (Tailwind v4 or plain CSS, Light and Dark),
- picks Seed components before writing markup, and tells you when a part exists in the design system but not in the npm package yet,
- styles only with Seed tokens and type styles, never raw values,
- writes UI copy in Seed's voice (sentence case, specific errors, no em dashes),
- checks accessibility (WCAG 2.2 AA in both themes) before calling the work done,
- rebrands Seed with the `seed theme` command.

Try: "Build a settings page with Seed", "Review this form against Seed", "Write the empty state for the tokens list in Seed's voice", "Make a teal Seed theme".

## Links

- Docs: https://seed-lyart.vercel.app
- Design system with live previews: https://claude.ai/artifact/3EcyStkY8yCeAxSM7a1biz
- Code: https://github.com/flinbu/seed

MIT © Felipe Linares
