#!/usr/bin/env node
/**
 * Restore modules that were incorrectly hollowed into broken English stubs
 * while the real implementation was moved to *.he.* companions.
 *
 * For each *.he.(js|jsx|mjs|cjs|ts|tsx):
 * - If the non-.he twin is a tiny re-export OR missing default export,
 *   copy the .he implementation back over the twin so the build works.
 * - Keep the .he file as a duplicate for now (scan-exempt).
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const HE_RE = /\.he\.(jsx?|mjs|cjs|tsx?)$/;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next" || ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (HE_RE.test(ent.name)) out.push(full);
  }
  return out;
}

function looksLikeBrokenStub(src) {
  const t = String(src || "").trim();
  if (!t) return true;
  if (t.length < 400 && /export\s+\*\s+from\s+['"].+\.he\./.test(t)) return true;
  if (t.length < 400 && /export\s+\{\s*default\s*\}\s+from\s+['"].+\.he\./.test(t)) return true;
  if (/Hebrew bank|not scanned|companion bank/i.test(t) && t.length < 800) return true;
  if (/does not contain|placeholder stub/i.test(t) && t.length < 800) return true;
  // Empty module / comment-only
  if (!/export\s+default|export\s+function|export\s+const|export\s+class|module\.exports/.test(t)) {
    if (t.length < 1200) return true;
  }
  return false;
}

let restored = 0;
for (const hePath of walk(root)) {
  const rel = path.relative(root, hePath).split(path.sep).join("/");
  const twinRel = rel.replace(/\.he\.(jsx?|mjs|cjs|tsx?)$/, ".$1");
  const twinPath = path.join(root, twinRel);
  if (!fs.existsSync(twinPath)) continue;
  const twinSrc = fs.readFileSync(twinPath, "utf8");
  if (!looksLikeBrokenStub(twinSrc)) continue;
  const heSrc = fs.readFileSync(hePath);
  fs.writeFileSync(twinPath, heSrc);
  restored += 1;
  console.log("restored", twinRel, "from", rel);
}
console.log("restored count", restored);
