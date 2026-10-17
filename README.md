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

Add a changeset to every pull request that changes a package (`pnpm changeset`). Merging to `main` and running `pnpm release` publishes to npm.

## License

MIT © Felipe Linares. Fonts are under the SIL Open Font License.
