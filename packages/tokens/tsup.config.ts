import { defineConfig } from "tsup";

export default defineConfig([
  { entry: { index: "src/index.ts" }, format: ["esm"], dts: true, clean: true, target: "es2022", sourcemap: true },
  { entry: { cli: "src/cli.ts" }, format: ["esm"], target: "node20", banner: { js: "#!/usr/bin/env node" }, clean: false },
]);
