/**
 * Sync EN authority keys for geometry-explanations from pre-extraction English source.
 * Does not mutate utils/geometry-explanations.js or Arabic values.
 */
import fs from "node:fs";
import crypto from "node:crypto";
import { execSync } from "node:child_process";

const SLUG = "utils__geometry-explanations";
const EN_LEAF = `content-packs/en/learning/burn-down/${SLUG}.json`;
const AR_LEAF = `content-packs/ar-001/learning/burn-down/${SLUG}.json`;

function keyFor(en) {
  const base = String(en)
    .toLowerCase()
    .replace(/\{m\d+\}/g, "m")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  return `${base || "geo"}_${crypto.createHash("sha1").update(en).digest("hex").slice(0, 8)}`;
}

function unescapeJsString(raw) {
  return raw
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\`/g, "`")
    .replace(/\\\\/g, "\\");
}

function loadCopy(path) {
  const raw = JSON.parse(fs.readFileSync(path, "utf8"));
  if (raw?.copy && typeof raw.copy === "object") return { wrap: "copy", pack: raw.copy };
  if (raw?.[SLUG] && typeof raw[SLUG] === "object") return { wrap: "slug", pack: raw[SLUG] };
  return { wrap: "flat", pack: raw };
}

function writeCopy(path, wrap, pack) {
  if (wrap === "copy") fs.writeFileSync(path, JSON.stringify({ copy: pack }, null, 2) + "\n");
  else if (wrap === "slug") fs.writeFileSync(path, JSON.stringify({ [SLUG]: pack }, null, 2) + "\n");
  else fs.writeFileSync(path, JSON.stringify(pack, null, 2) + "\n");
}

const old = execSync("git show e19bbd669:utils/geometry-explanations.js", {
  encoding: "utf8",
  maxBuffer: 20e6,
});

const recovered = new Map();
function register(en) {
  if (typeof en !== "string" || en.length < 8) return;
  recovered.set(keyFor(en), en);
}

// return "..." / return '...'
for (const m of old.matchAll(/\breturn\s+"((?:\\.|[^"\\])*)"/g)) {
  register(unescapeJsString(m[1]));
}
for (const m of old.matchAll(/\breturn\s+'((?:\\.|[^'\\])*)'/g)) {
  register(unescapeJsString(m[1]));
}
// return mix`...`
for (const m of old.matchAll(/\breturn\s+mix`((?:\\.|[^`\\]|\$\{[^}]*\})*)`/g)) {
  let i = 0;
  const template = unescapeJsString(m[1]).replace(/\$\{[^}]*\}/g, () => `{m${i++}}`);
  register(template);
}
// toSpan(mix`...`) and similar push patterns
for (const m of old.matchAll(/\bmix`((?:\\.|[^`\\]|\$\{[^}]*\})*)`/g)) {
  let i = 0;
  const template = unescapeJsString(m[1]).replace(/\$\{[^}]*\}/g, () => `{m${i++}}`);
  register(template);
}
// Array string literals in return [ "..." ]
for (const m of old.matchAll(/\[\s*"((?:\\.|[^"\\]){12,})"\s*[,\]\)]/g)) {
  register(unescapeJsString(m[1]));
}
for (const m of old.matchAll(/,\s*"((?:\\.|[^"\\]){12,})"\s*[,\]\)]/g)) {
  register(unescapeJsString(m[1]));
}

// AR_EXACT English sides from wire script
const wire = fs.readFileSync("scripts/i18n/wire-geometry-explanations-locale.mjs", "utf8");
for (const m of wire.matchAll(/\[\s*\n\s*"((?:\\.|[^"\\])+)",\s*\n\s*"/g)) {
  register(unescapeJsString(m[1]));
}

const enLoaded = loadCopy(EN_LEAF);
const arLoaded = loadCopy(AR_LEAF);
const en = { ...enLoaded.pack };
const ar = arLoaded.pack;

let added = 0;
const stillMissing = [];
for (const k of Object.keys(ar)) {
  if (en[k]) continue;
  if (recovered.has(k)) {
    en[k] = recovered.get(k);
    added += 1;
  } else {
    stillMissing.push(k);
  }
}

writeCopy(EN_LEAF, enLoaded.wrap, en);
console.log(
  JSON.stringify(
    {
      enBefore: Object.keys(enLoaded.pack).length,
      enAfter: Object.keys(en).length,
      arKeys: Object.keys(ar).length,
      recoveredMap: recovered.size,
      added,
      stillMissing: stillMissing.length,
      stillMissingSample: stillMissing.slice(0, 20),
    },
    null,
    2
  )
);
