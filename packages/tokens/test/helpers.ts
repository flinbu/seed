import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { compile } from "tailwindcss";

const require = createRequire(import.meta.url);
const tw = path.dirname(require.resolve("tailwindcss/package.json"));
export const dist = path.resolve(__dirname, "../dist");
export const read = (f: string) => fs.readFileSync(path.join(dist, f), "utf8");

/** Compiles the given class names with Tailwind v4 + Seed and returns the CSS. */
export async function tailwind(candidates: string[], extra = ""): Promise<string> {
  const c = await compile(`@import "tailwindcss";\n@import "./tailwind.css";\n${extra}`, {
    base: dist,
    loadStylesheet: async (id: string, base: string) => {
      const p = id === "tailwindcss" ? path.join(tw, "index.css") : path.resolve(base, id);
      return { path: p, base: path.dirname(p), content: fs.readFileSync(p, "utf8") };
    },
  });
  return c.build(candidates);
}
/** The declarations of one utility class in compiled CSS. */
export function rule(css: string, cls: string): string | null {
  const esc = cls.replace(/[:\[\]()/.]/g, (m) => "\\" + m);
  const m = new RegExp("\\." + esc + "(?![\\w-])[^{]*\\{([^}]*)\\}").exec(css);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}
