# Seed

A calm, neutral-first design system for React and Tailwind CSS: true-gray surfaces, one accent you can theme, and accessible contrast checked in CI.

| Package | What it is |
|---|---|
| [`@flinbu/seed-tokens`](packages/tokens) | Tokens as CSS variables, a Tailwind v4 theme, DTCG JSON, `createTheme()` and the `seed` CLI |
| `@flinbu/seed` | React components (coming next) |

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

MIT © Felipe Linares. Fonts are under the SIL Open Font License.
