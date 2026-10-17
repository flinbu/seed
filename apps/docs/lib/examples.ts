import fs from "node:fs";
import path from "node:path";

const cache = new Map<string, string>();
/** The JSX an example returns, plus the imports it needs, read from /examples at build time. */
export function exampleSource(file: string, fn: string): string {
  const key = file;
  if (!cache.has(key)) cache.set(key, fs.readFileSync(path.join(process.cwd(), "examples", `${file}.tsx`), "utf8"));
  const src = cache.get(key)!;
  const m = new RegExp(`export function ${fn}\\(\\) \\{\\n([\\s\\S]*?)\\n\\}`).exec(src);
  if (!m) return `// ${fn} not found`;
  let body = m[1];
  const ret = /^ {2}return \(\n([\s\S]*?)\n {2}\);$/m.exec(body);
  const pre = ret ? body.slice(0, ret.index).trimEnd() : "";
  let jsx = ret ? ret[1] : body;
  jsx = jsx.split("\n").map((l) => l.replace(/^ {4}/, "")).join("\n");
  if (/^<>\n/.test(jsx)) jsx = jsx.replace(/^<>\n/, "").replace(/\n<\/>$/, "").split("\n").map((l) => l.replace(/^ {2}/, "")).join("\n");
  const used = (n: string) => new RegExp(`<${n}[\\s>/]|\\b${n}\\b`).test(pre + jsx);
  const seedImport = /import \{([^}]+)\} from "@flinbu\/seed";/.exec(src)?.[1].split(",").map((s) => s.trim()).filter(used) ?? [];
  const lucide = /import \{([^}]+)\} from "lucide-react";/.exec(src)?.[1].split(",").map((s) => s.trim()).filter(used) ?? [];
  const head = [seedImport.length ? `import { ${seedImport.join(", ")} } from "@flinbu/seed";` : "", lucide.length ? `import { ${lucide.join(", ")} } from "lucide-react";` : ""].filter(Boolean).join("\n");
  const state = pre ? pre.split("\n").map((l) => l.replace(/^ {2}/, "")).join("\n") + "\n\n" : "";
  return `${head}\n\n${state}${jsx}`;
}
