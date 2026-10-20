# Seed

A calm, neutral-first design system for React and Tailwind CSS: true-gray surfaces, one accent you can theme, and accessible contrast checked in CI.

| Package | What it is |
|---|---|
| [`@flinbu/seed-tokens`](packages/tokens) | Tokens as CSS variables, a Tailwind v4 theme, DTCG JSON, `createTheme()` and the `seed` CLI |
| `@flinbu/seed` | React components (coming next) |

## Figma

The Seed library on the Figma Community: [figma.com/community/file/1694480861909658527](https://www.figma.com/community/file/1694480861909658527). Variables (primitives, and semantics in Light and Dark), styles and components, named like the code. Setup: [seed-lyart.vercel.app/docs/figma](https://seed-lyart.vercel.app/docs/figma).

## Develop

```bash
pnpm install
pnpm build
pnpm test
```

`packages/tokens/src/source/tokens.json` is the single source of truth. `pnpm build` regenerates everything from it.

## Release

1. With your change, run `pnpm changeset`: pick patch, minor or major and write one line for the changelog. Commit the file it creates.
2. On `main`, the Release workflow opens a "Version packages" pull request that bumps both packages (they share one version) and writes the changelogs.
3. Merging it builds, tests and stages both packages on npm through trusted publishing: no npm token is stored anywhere.
4. Approve each one with 2FA in npm's Staged Packages tab (`@flinbu/seed-tokens` first). Only then is the release public.

## License

MIT © Felipe Linares. Fonts are under the SIL Open Font License. [Fenly Serif](fonts/fenly-serif), Seed's own serif, is there to download and install.

## Use with AI

- **Claude plugin**: [`plugin/`](plugin) packages the Seed skill (components, tokens, voice and writing, accessibility). In Claude Code: `/plugin marketplace add flinbu/seed`, then `/plugin install seed@seed`. In Claude, add `plugin/seed.plugin` from the plugin settings.
- **Design system in Claude**: every component with live previews, the tokens and the guides, at [this link](https://claude.ai/artifact/3EcyStkY8yCeAxSM7a1biz).
- **llms.txt**: [seed-lyart.vercel.app/llms.txt](https://seed-lyart.vercel.app/llms.txt).
