/**
 * Phase 4C — merge dicts, apply to EN leaf packs → id-ID, rebuild indexes, validate.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ART = path.join(ROOT, "artifacts/id-ID-phase4c");

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function loadCopy(raw) {
  if (raw && typeof raw === "object" && raw.copy && typeof raw.copy === "object") return raw.copy;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
  return null;
}

/** Simple ICU/mustache placeholders: {name} but not nested ICU body braces. */
function placeholders(s) {
  if (typeof s !== "string") return "";
  // Capture {token} and {token, plural, ...} outer heads; ignore nested one/other bodies.
  const simple = [];
  const re = /\{([a-zA-Z_][a-zA-Z0-9_]*)(?:,|\})/g;
  let m;
  while ((m = re.exec(s))) simple.push(m[1]);
  // Also preserve literal # inside ICU plurals as structural marker
  const hasHash = /#/.test(s);
  const hasPlural = /,\s*plural\s*,/.test(s);
  return `${[...simple].sort().join("|")}|plural=${hasPlural}|hash=${hasHash}`;
}

// --- merge dict ---
const dict = {};
for (let i = 0; i < 4; i++) {
  const part = JSON.parse(fs.readFileSync(path.join(ART, `dict-chunk-${i}.json`), "utf8"));
  Object.assign(dict, part);
}
const mergedPath = path.join(ART, "dict-merged.json");
if (fs.existsSync(mergedPath)) {
  // Prefer patched merged dict when present
  Object.assign(dict, JSON.parse(fs.readFileSync(mergedPath, "utf8")));
}
const unique = JSON.parse(fs.readFileSync(path.join(ART, "unique-strings.json"), "utf8")).map((x) => x.en);
const missing = unique.filter((s) => !(s in dict));
const empty = unique.filter((s) => s in dict && String(dict[s]).trim() === "");
console.log("dict keys", Object.keys(dict).length, "unique", unique.length, "missing", missing.length, "empty", empty.length);
if (missing.length || empty.length) {
  fs.writeFileSync(path.join(ART, "dict-gaps.json"), JSON.stringify({ missing, empty }, null, 2));
  throw new Error("Dictionary incomplete");
}
fs.writeFileSync(path.join(ART, "dict-merged.json"), JSON.stringify(dict, null, 2));

function translateValue(en) {
  if (typeof en !== "string") return en;
  if (!(en in dict)) throw new Error(`Missing dict for: ${JSON.stringify(en).slice(0, 120)}`);
  const id = dict[en];
  if (placeholders(en) !== placeholders(id)) {
    throw new Error(`Placeholder mismatch:\nEN ${en}\nID ${id}`);
  }
  return id;
}

function translateFile(enPath, idPath) {
  const raw = JSON.parse(fs.readFileSync(enPath, "utf8"));
  let out;
  if (raw && typeof raw === "object" && raw.copy && typeof raw.copy === "object") {
    const copy = {};
    for (const [k, v] of Object.entries(raw.copy)) {
      copy[k] = translateValue(v);
    }
    out = { copy };
  } else if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    // index-style or bare object — translate string leaves only at top level groups
    out = {};
    for (const [slug, body] of Object.entries(raw)) {
      if (body && typeof body === "object" && !Array.isArray(body)) {
        const next = {};
        for (const [k, v] of Object.entries(body)) next[k] = translateValue(v);
        out[slug] = next;
      } else {
        out[slug] = translateValue(body);
      }
    }
  } else {
    throw new Error(`Unsupported shape ${enPath}`);
  }
  fs.mkdirSync(path.dirname(idPath), { recursive: true });
  fs.writeFileSync(idPath, JSON.stringify(out, null, 2) + "\n");
}

function rebuildLeafDir(leafDir, canonicalIndexPath) {
  /** @type {Record<string, Record<string, string>>} */
  const index = {};
  for (const name of fs.readdirSync(leafDir)) {
    if (!name.endsWith(".json") || name === "burn-down-index.json") continue;
    const slug = name.slice(0, -".json".length);
    const copy = loadCopy(JSON.parse(fs.readFileSync(path.join(leafDir, name), "utf8")));
    if (!copy) continue;
    index[slug] = copy;
  }
  fs.mkdirSync(path.dirname(canonicalIndexPath), { recursive: true });
  fs.writeFileSync(canonicalIndexPath, JSON.stringify(index, null, 2) + "\n");
  return Object.keys(index).length;
}

// --- apply families (leaf files only; rebuild indexes after) ---
const families = [
  { name: "global-burn-down", enRoot: "content-packs/en/global-burn-down", idRoot: "content-packs/id-ID/global-burn-down", layout: "flat" },
  { name: "reports", enRoot: "content-packs/en/reports", idRoot: "content-packs/id-ID/reports", layout: "subdir" },
];

const applyStats = {};
for (const fam of families) {
  const enFiles = walk(path.join(ROOT, fam.enRoot)).filter((f) => !f.endsWith(`${path.sep}burn-down-index.json`) && !f.endsWith("/burn-down-index.json"));
  let n = 0;
  for (const enPath of enFiles) {
    const rel = path.relative(path.join(ROOT, fam.enRoot), enPath);
    const idPath = path.join(ROOT, fam.idRoot, rel);
    translateFile(enPath, idPath);
    n++;
  }
  applyStats[fam.name] = { leafFiles: n };
}

// rebuild indexes
const gbdPacks = rebuildLeafDir(
  path.join(ROOT, "content-packs/id-ID/global-burn-down"),
  path.join(ROOT, "content-packs/id-ID/global-burn-down/burn-down-index.json")
);
const repPacks = rebuildLeafDir(
  path.join(ROOT, "content-packs/id-ID/reports/burn-down"),
  path.join(ROOT, "content-packs/id-ID/reports/burn-down-index.json")
);
applyStats["global-burn-down"].indexPacks = gbdPacks;
applyStats.reports.indexPacks = repPacks;

console.log(JSON.stringify(applyStats, null, 2));
fs.writeFileSync(path.join(ART, "apply-stats.json"), JSON.stringify(applyStats, null, 2));
