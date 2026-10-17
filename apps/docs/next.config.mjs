import createMDX from "@next/mdx";

// Plugins are named as strings so they work with Turbopack.
const withMDX = createMDX({ options: { remarkPlugins: [["remark-gfm"]] } });
/** @type {import('next').NextConfig} */
export default withMDX({
  pageExtensions: ["ts", "tsx", "mdx"],
  reactStrictMode: true,
});
