/**
 * Apply merged EN→ID string maps to content-packs/en/{games,rewards,demo}
 * and write content-packs/id-ID/** with structural parity.
 */
import fs from "node:fs";
import path from "node:path";
import {
  shouldPreserveString,
  deepMapStrings,
  enToIdPath,
  ensureDirFor,
  placeholders,
  walkLeaves,
} from "./helpers.mjs";

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, acc);
    else if (e.name.endsWith(".json")) acc.push(p);
  }
  return acc;
}

function loadMaps() {
  const map = Object.create(null);
  for (let i = 0; i < 16; i++) {
    const p = path.join("artifacts/id-ID-phase4b", `map-chunk-${i}.json`);
    if (!fs.existsSync(p)) continue;
    const chunk = JSON.parse(fs.readFileSync(p, "utf8"));
    Object.assign(map, chunk);
  }
  return map;
}

const map = loadMaps();
const mapKeys = Object.keys(map).length;
console.log("loaded map keys", mapKeys);

const missingTranslations = [];
const placeholderMismatches = [];
let translated = 0;
let preserved = 0;
let identicalRetained = 0;

function translateValue(value, key, keyPath, relPath) {
  if (typeof value !== "string") return value;
  if (shouldPreserveString(key, value, keyPath, relPath)) {
    preserved += 1;
    return value;
  }
  if (Object.prototype.hasOwnProperty.call(map, value)) {
    const id = map[value];
    if (typeof id !== "string" || id.trim() === "") {
      missingTranslations.push({ relPath, keyPath, value, reason: "empty" });
      return value;
    }
    const pe = placeholders(value);
    const pi = placeholders(id);
    if (JSON.stringify(pe) !== JSON.stringify(pi)) {
      placeholderMismatches.push({ relPath, keyPath, en: pe, id: pi, value, idValue: id });
    }
    if (id === value) identicalRetained += 1;
    else translated += 1;
    return id;
  }
  missingTranslations.push({ relPath, keyPath, value, reason: "unmapped" });
  return value;
}

const families = ["games", "rewards", "demo"];
const summary = {};

for (const fam of families) {
  const files = walkFiles(path.join("content-packs/en", fam));
  let fileCount = 0;
  let leafCount = 0;
  for (const f of files) {
    const rel = f.split(path.sep).join("/");
    const en = JSON.parse(fs.readFileSync(f, "utf8"));
    leafCount += walkLeaves(en).length;
    const idObj = deepMapStrings(en, translateValue, [], rel);
    const out = enToIdPath(rel);
    ensureDirFor(out);
    fs.writeFileSync(out, JSON.stringify(idObj, null, 2) + "\n", "utf8");
    fileCount += 1;
  }
  summary[fam] = { files: fileCount, leaves: leafCount };
}

const report = {
  summary,
  mapKeys,
  translated,
  preserved,
  identicalRetained,
  missingTranslations: missingTranslations.length,
  placeholderMismatches: placeholderMismatches.length,
  missingSample: missingTranslations.slice(0, 40),
  phSample: placeholderMismatches.slice(0, 20),
};

fs.writeFileSync(
  "artifacts/id-ID-phase4b/apply-report.json",
  JSON.stringify(report, null, 2),
  "utf8"
);
console.log(JSON.stringify(report, null, 2));
if (missingTranslations.length || placeholderMismatches.length) {
  process.exitCode = 1;
}
