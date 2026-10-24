import { readFileSync } from "node:fs";
import createMDX from "@next/mdx";

// Plugins are named as strings so they work with Turbopack.
const withMDX = createMDX({ options: { remarkPlugins: [["remark-gfm"]] } });
// Seed's version, for bug reports.
const seed = JSON.parse(readFileSync(new URL("../../packages/react/package.json", import.meta.url), "utf8"));
/** @type {import('next').NextConfig} */
export default withMDX({
  pageExtensions: ["ts", "tsx", "mdx"],
  reactStrictMode: true,
  env: { NEXT_PUBLIC_SEED_VERSION: seed.version },
});
