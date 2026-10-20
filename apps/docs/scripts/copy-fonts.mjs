// Copies Fenly Serif and its license from @flinbu/seed-tokens into public/fonts, so the Fenly Serif page can offer downloads.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const from = path.resolve(here, "../../../packages/tokens/src/fonts");
const to = path.resolve(here, "../public/fonts");
fs.mkdirSync(to, { recursive: true });
for (const f of fs.readdirSync(from).filter((f) => f.startsWith("FenlySerif-"))) fs.copyFileSync(path.join(from, f), path.join(to, f));
