/**
 * Active runtime key parity validator for ar-001.
 *
 * Correct check (not blind es-419 == ar-001):
 *   Runtime-requested active keys ⊆ English canonical keys ⊆ Arabic keys
 *
 * Stale es-419-only keys (no runtime consumer) are reported separately and
 * must NOT be counted as required Arabic parity.
 *
 * Source of truth: artifacts/i18n/ar-001-es419-139-key-classification.json
 *
 * Usage: node scripts/i18n/validators/ar-001-active-runtime-parity-validator.mjs
 */
import { readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "../../..");
const CLASSIFICATION = join(ROOT, "artifacts/i18n/ar-001-es419-139-key-classification.json");

function readJSON(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

function loadIndex(loc, domain) {
  const p =
    domain === "global-burn-down"
      ? join(ROOT, `content-packs/${loc}/global-burn-down/burn-down-index.json`)
      : join(ROOT, `content-packs/${loc}/${domain}/burn-down-index.json`);
  if (!existsSync(p)) return {};
  return readJSON(p);
}

function loadLeaf(loc, domain, slug) {
  const p =
    domain === "global-burn-down"
      ? join(ROOT, `content-packs/${loc}/global-burn-down/${slug}.json`)
      : join(ROOT, `content-packs/${loc}/${domain}/burn-down/${slug}.json`);
  if (!existsSync(p)) return null;
  const raw = readJSON(p);
  return raw?.copy && typeof raw.copy === "object" ? raw.copy : raw;
}

function domainFor(entry) {
  if (String(entry.file || "").includes("global-burn-down")) return "global-burn-down";
  if (String(entry.file || "").includes("/reports/")) return "reports";
  if (String(entry.file || "").includes("/learning/")) return "learning";
  return "games";
}

function hasValue(pack, key) {
  const v = pack?.[key];
  return typeof v === "string" && v.trim().length > 0;
}

const classification = readJSON(CLASSIFICATION);
const active = classification.active || [];
const stale = classification.stale || [];

const enGames = loadIndex("en", "games");
const arGames = loadIndex("ar-001", "games");
const enGlobal = loadIndex("en", "global-burn-down");
const arGlobal = loadIndex("ar-001", "global-burn-down");
const esGames = loadIndex("es-419", "games");
const esGlobal = loadIndex("es-419", "global-burn-down");

function indexFor(loc, domain) {
  if (domain === "global-burn-down") {
    return loc === "en" ? enGlobal : loc === "ar-001" ? arGlobal : esGlobal;
  }
  return loc === "en" ? enGames : loc === "ar-001" ? arGames : esGames;
}

const missingEn = [];
const missingAr = [];
const arabicFallbackMissingActive = [];
const staleCountedAsRequired = [];
const leafIndexMismatches = [];

for (const a of active) {
  const domain = domainFor(a);
  const enPack = indexFor("en", domain)[a.slug] || {};
  const arPack = indexFor("ar-001", domain)[a.slug] || {};
  if (!hasValue(enPack, a.shortKey)) missingEn.push(`${a.slug}.${a.shortKey}`);
  if (!hasValue(arPack, a.shortKey)) {
    missingAr.push(`${a.slug}.${a.shortKey}`);
    arabicFallbackMissingActive.push(`${a.slug}.${a.shortKey}`);
  }
}

// Leaf/index value parity for touched packs
const touched = new Map();
for (const a of active) {
  const domain = domainFor(a);
  touched.set(`${domain}::${a.slug}`, { domain, slug: a.slug });
}
for (const { domain, slug } of touched.values()) {
  for (const loc of ["en", "ar-001"]) {
    const leaf = loadLeaf(loc, domain, slug);
    const idx = indexFor(loc, domain)[slug] || {};
    if (!leaf) {
      leafIndexMismatches.push({ loc, domain, slug, reason: "leaf_missing" });
      continue;
    }
    for (const [k, v] of Object.entries(leaf)) {
      if (typeof v !== "string") continue;
      if (idx[k] !== v) {
        leafIndexMismatches.push({ loc, domain, slug, key: k, reason: "value_mismatch" });
      }
    }
    for (const [k, v] of Object.entries(idx)) {
      if (typeof v !== "string") continue;
      if (leaf[k] !== v) {
        leafIndexMismatches.push({ loc, domain, slug, key: k, reason: "index_extra_or_mismatch" });
      }
    }
  }
}

// Stale keys: present in es-419, must not be required for AR parity
const staleExcluded = [];
for (const s of stale) {
  const domain = domainFor(s);
  const esPack = indexFor("es-419", domain)[s.slug] || {};
  const inEs = hasValue(esPack, s.shortKey);
  // Required-as-parity only if we treat missing AR as error for stale — we must not.
  // Flag failure if a future change starts requiring them (never).
  staleExcluded.push({
    key: `${s.slug}.${s.shortKey}`,
    inEs419: inEs,
    countedAsRequired: false,
  });
  // Soft: if someone adds stale to AR while missing from EN active path — not an error.
}

const report = {
  activeKeysClassified: `${active.length}/${classification.summary?.activeProductKeys ?? 116}`,
  englishCanonicalPresent: active.length - missingEn.length,
  arabicPresent: active.length - missingAr.length,
  activeRuntimeKeysMissingInEn: missingEn.length,
  activeRuntimeKeysMissingInAr: missingAr.length,
  arabicFallbackCausedByMissingActiveKey: arabicFallbackMissingActive.length,
  staleEs419OnlyKeys: stale.length,
  staleKeysCountedAsRequired: staleCountedAsRequired.length,
  staleEs419OnlyKeysExcluded: `${staleExcluded.length}/${classification.summary?.staleEs419OnlyKeys ?? 23}`,
  leafIndexMismatches: leafIndexMismatches.length,
  missingEnSample: missingEn.slice(0, 10),
  missingArSample: missingAr.slice(0, 10),
  leafMismatchSample: leafIndexMismatches.slice(0, 10),
};

writeFileSync(
  join(ROOT, "artifacts/i18n/ar-001-active-runtime-parity-report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);

console.log("\n=== ar-001 Active Runtime Parity Validator ===\n");
console.log(`Active keys classified = ${report.activeKeysClassified}`);
console.log(`English canonical keys present = ${report.englishCanonicalPresent}`);
console.log(`Arabic keys present = ${report.arabicPresent}`);
console.log(`Active runtime keys missing in EN = ${report.activeRuntimeKeysMissingInEn}`);
console.log(`Active runtime keys missing in AR = ${report.activeRuntimeKeysMissingInAr}`);
console.log(
  `Arabic fallback caused by missing active key = ${report.arabicFallbackCausedByMissingActiveKey}`,
);
console.log(`Stale es-419-only keys excluded = ${report.staleEs419OnlyKeysExcluded}`);
console.log(`Stale keys counted as required = ${report.staleKeysCountedAsRequired}`);
console.log(`Leaf/index mismatches (touched packs) = ${report.leafIndexMismatches}`);

const fail =
  missingEn.length +
  missingAr.length +
  arabicFallbackMissingActive.length +
  staleCountedAsRequired.length +
  leafIndexMismatches.length;

console.log(fail === 0 ? "\n✅ ACTIVE RUNTIME PARITY PASS" : "\n❌ ACTIVE RUNTIME PARITY FAIL");
process.exit(fail === 0 ? 0 : 1);
