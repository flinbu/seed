// Stages every public package whose current version isn't on npm yet.
// Runs in GitHub Actions with npm trusted publishing (OIDC): no tokens.
// Each release lands in npm's Staged Packages and goes live when a maintainer approves it with 2FA.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ORDER = ["packages/tokens", "packages/react"]; // tokens first: seed depends on it
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", ...opts });

for (const dir of ORDER) {
  const { name, version, private: priv } = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  if (priv) continue;
  let exists = false;
  try { exists = run("npm", ["view", `${name}@${version}`, "version"]).trim() === version; } catch {}
  if (exists) { console.log(`${name}@${version} is already on npm, skipping`); continue; }

  // pnpm pack rewrites workspace:* to real versions; npm stages the packed result.
  const out = mkdtempSync(join(tmpdir(), "seed-"));
  run("pnpm", ["pack", "--pack-destination", out], { cwd: dir });
  const tgz = readdirSync(out).find((f) => f.endsWith(".tgz"));
  run("tar", ["xzf", tgz], { cwd: out });
  try {
    const log = run("npm", ["stage", "publish", "--access", "public", "--provenance"], { cwd: join(out, "package") });
    process.stdout.write(log);
    console.log(`Staged ${name}@${version}: approve it in npm's Staged Packages tab.`);
    console.log(`New tag: ${name}@${version}`); // lets the Changesets action create the git tag
  } catch (e) {
    const msg = `${e.stdout ?? ""}${e.stderr ?? ""}`;
    if (/already|exists|cannot publish over|previously published/i.test(msg)) {
      console.log(`${name}@${version} is already staged, waiting for approval`);
      continue;
    }
    console.error(msg);
    process.exit(1);
  }
}
