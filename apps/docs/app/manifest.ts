import type { MetadataRoute } from "next";

/* The web app manifest: the name and icons a phone or desktop uses when Seed's docs are installed or pinned.
   favicon.ico, icon.svg and apple-icon.png in this folder are linked by Next.js from their file names. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Seed · A calm design system for React and Tailwind",
    short_name: "Seed",
    description:
      "Seed is a neutral-first design system for React and Tailwind CSS: accessible components on Radix, tokens as Tailwind utilities, and brand themes that pass WCAG AA.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
      { src: "/icon-maskable-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
