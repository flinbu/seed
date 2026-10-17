// After tsc: mark client components, copy styles.css and build compiled.css for apps without Tailwind.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const dist = path.join(root, "dist");
// Components with state, context or Radix need the client and get "use client". The rest stay server components.
const SERVER_SAFE = new Set(["icon.js", "spinner.js", "badge.js", "card.js", "skeleton.js", "kbd.js", "empty-state.js"]);
for (const f of fs.readdirSync(path.join(dist, "components"))) {
  if (!f.endsWith(".js") || SERVER_SAFE.has(f)) continue;
  const p = path.join(dist, "components", f), s = fs.readFileSync(p, "utf8");
  if (!s.startsWith('"use client"')) fs.writeFileSync(p, '"use client";\n' + s);
}
fs.copyFileSync(path.join(root, "src/styles.css"), path.join(dist, "styles.css"));
// compiled.css: tokens + every class Seed's components use, prebuilt with Tailwind.
const src = path.join(dist, ".compiled-src.css");
fs.writeFileSync(src, '@import "tailwindcss";\n@import "./styles.css";\n');
const require = createRequire(import.meta.url);
const cli = path.join(path.dirname(require.resolve("@tailwindcss/cli/package.json")), "dist/index.mjs");
execFileSync(process.execPath, [cli, "-i", src, "-o", path.join(dist, "compiled.css"), "--minify"], { cwd: dist, stdio: "inherit" });
fs.rmSync(src);
// Fonts referenced by compiled.css live in the tokens package; copy them next to it.
const tok = path.dirname(require.resolve("@flinbu/seed-tokens/package.json"));
fs.cpSync(path.join(tok, "dist/fonts"), path.join(dist, "fonts"), { recursive: true });
console.log("seed: dist ready");
