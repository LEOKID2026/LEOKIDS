/**
 * Bulk-update Parent Copilot / parent-report HE module imports for Global.
 * Skips pages/admin, pages/dev, prototypes, lib/admin*, data/admin*, lib/auth/*.he.js
 * Symbol renames skip the defining modules (which keep deprecated aliases).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const PATH_REPLACEMENTS = [
  [/utterance-normalize(\.js)?/g, "utterance-normalize$1"],
  [/conversational-reply-class(\.js)?/g, "conversational-reply-class$1"],
  [/contextual-follow-up(\.js)?/g, "contextual-follow-up$1"],
  [/parent-facing-normalize(\.js)?/g, "parent-facing-normalize$1"],
  [/history-scope(\.js)?/g, "history-scope$1"],
  [/pedagogy-glossary(\.js)?/g, "pedagogy-glossary$1"],
];

const SYMBOL_REPLACEMENTS = [
  [/\bfoldUtteranceForHeMatch\b/g, "foldUtteranceForMatch"],
  [/\bnormalizeFreeformParentUtteranceHe\b/g, "normalizeFreeformParentUtterance"],
  [/\bclassifyShortParentReplyClassHe\b/g, "classifyShortParentReplyClass"],
  [/\bnormalizeParentFacingHe\b/g, "normalizeParentFacing"],
  [/\bnormalizePedagogyForParentReportHe\b/g, "normalizePedagogyForParentReport"],
];

/** Defining modules keep deprecated *He aliases — do not rename symbols there. */
const SKIP_SYMBOL_RENAME = new Set(
  [
    "utils/parent-copilot/utterance-normalize.js",
    "utils/parent-copilot/conversational-reply-class.js",
    "utils/parent-report-language/parent-facing-normalize.js",
    "utils/parent-report-language/pedagogy-glossary.js",
  ].map((p) => path.normalize(p))
);

const SKIP_DIR_PARTS = [
  `${path.sep}pages${path.sep}admin${path.sep}`,
  `${path.sep}pages${path.sep}dev${path.sep}`,
  `${path.sep}prototypes${path.sep}`,
  `${path.sep}lib${path.sep}admin`,
  `${path.sep}data${path.sep}admin`,
  `${path.sep}lib${path.sep}auth${path.sep}`,
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}.git${path.sep}`,
];

function shouldSkip(abs) {
  const n = abs.toLowerCase();
  return SKIP_DIR_PARTS.some((p) => n.includes(p.toLowerCase()));
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (shouldSkip(abs)) continue;
    if (ent.isDirectory()) walk(abs, out);
    else if (/\.(js|jsx|mjs|cjs|ts|tsx)$/.test(ent.name)) out.push(abs);
  }
  return out;
}

const files = walk(ROOT);
let changed = 0;
for (const abs of files) {
  let t = fs.readFileSync(abs, "utf8");
  const orig = t;
  const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
  for (const [re, rep] of PATH_REPLACEMENTS) t = t.replace(re, rep);
  if (!SKIP_SYMBOL_RENAME.has(path.normalize(rel))) {
    for (const [re, rep] of SYMBOL_REPLACEMENTS) t = t.replace(re, rep);
  }
  t = t.replace(/normalizeParentFacing\s+as\s+normalizeParentFacing\b/g, "normalizeParentFacing");
  if (t !== orig) {
    fs.writeFileSync(abs, t, "utf8");
    changed++;
    console.log("updated", rel);
  }
}
console.log("changed", changed);
