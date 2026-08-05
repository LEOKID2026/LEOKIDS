#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const deleted = execSync("git diff --name-only --diff-filter=D HEAD", {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "ignore"],
})
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .map((p) => p.replace(/\\/g, "/"));

const productDeleted = deleted.filter((p) =>
  /^(lib|pages|components|hooks|content-packs|locales)\//.test(p)
);

const SKIP_DIR = new Set([".git", "node_modules", ".next", "coverage", "tmp", "exports"]);
const scanRoots = ["lib", "pages", "components", "hooks", "scripts", "tests", "package.json"];
const files = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const st = fs.statSync(dir);
  if (st.isFile()) {
    files.push(dir);
    return;
  }
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full);
    else if (/\.(js|jsx|mjs|ts|tsx|json|md)$/i.test(ent.name)) files.push(full);
  }
}
for (const r of scanRoots) walk(path.join(ROOT, r));

const broken = [];
for (const abs of files) {
  const rel = path.relative(ROOT, abs).split(path.sep).join("/");
  let text;
  try {
    text = fs.readFileSync(abs, "utf8");
  } catch {
    continue;
  }
  for (const del of productDeleted) {
    const base = path.posix.basename(del);
    // skip self-references in audits/guards that assert absence
    if (/hebrew-ui-guard|check-zero-hebrew|no-hebrew|deleted|removed/i.test(rel)) continue;
    if (text.includes(del) || (base.endsWith(".he.js") && text.includes(base) && /from ["'].*\.he\.js["']/.test(text))) {
      // live import of deleted path
      if (
        new RegExp(`from\\s+["'][^"']*${base.replace(/\./g, "\\.")}["']`).test(text) ||
        text.includes(`"${del}"`) ||
        text.includes(`'${del}'`)
      ) {
        if (/assert\.|existsSync|!.*he\.js|removed|must not|absent/i.test(text) && base.endsWith(".he.js")) {
          continue;
        }
        broken.push({ file: rel, deleted: del });
      }
    }
  }
}

// package.json script path checks for obvious missing files
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const scriptBroken = [];
for (const [name, cmd] of Object.entries(pkg.scripts || {})) {
  const c = String(cmd);
  if (c.includes("SCRIPT_RELOCATED_OUTSIDE_GLOBAL")) continue;
  const m = c.match(/node(?:\s+[^\s]+)*\s+((?:scripts|lib|tests)\/[^\s]+\.(?:mjs|js))/);
  if (!m) continue;
  const p = m[1].replace(/\\/g, "/");
  if (!fs.existsSync(path.join(ROOT, p))) scriptBroken.push({ script: name, path: p });
}

const out = {
  deletedTrackedTotal: deleted.length,
  productDeletedCount: productDeleted.length,
  productDeletedSample: productDeleted.slice(0, 40),
  brokenReferences: broken.slice(0, 100),
  brokenReferenceCount: broken.length,
  packageScriptBroken: scriptBroken,
};
const outPath = path.join(
  process.env.TEMP || ROOT,
  "leo-kids-global-audits",
  "deleted-file-refs.json"
);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ ...out, brokenReferences: undefined, outPath }, null, 2));
process.exit(broken.length || scriptBroken.length ? 1 : 0);
