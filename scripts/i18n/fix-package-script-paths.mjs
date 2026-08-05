#!/usr/bin/env node
/**
 * Disable package.json scripts whose target files are missing after cleanup moves.
 * Replaces command with an explicit exit stub so `npm run` does not point at ghosts.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const pkgPath = path.join(ROOT, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const changed = [];

for (const [name, cmd] of Object.entries(pkg.scripts || {})) {
  const matches = String(cmd).matchAll(
    /(?:node|tsx)(?:\s+--[^\s]+)*\s+((?:scripts|lib|tests)\/[^\s]+\.(?:mjs|js|cjs|ts))/g
  );
  let broken = false;
  let missing = null;
  for (const m of matches) {
    const p = m[1].replace(/\\/g, "/");
    if (!fs.existsSync(path.join(ROOT, p))) {
      broken = true;
      missing = p;
      break;
    }
  }
  if (!broken) continue;
  pkg.scripts[name] =
    `node -e "console.error('SCRIPT_RELOCATED_OUTSIDE_GLOBAL: ${missing}'); process.exit(1)"`;
  changed.push({ name, missing });
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(JSON.stringify({ changed: changed.length, changed }, null, 2));
