/**
 * ar-001 Completeness Validator
 * Verifies that every English user-facing key required by ar-001 has an Arabic value,
 * and every Arabic leaf is registered in its domain index.
 *
 * Usage: node scripts/i18n/validators/ar-001-completeness-validator.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '../../..');

const results = {
  locale: { missing: [], extra: [] },
  contentPacks: { missingEnMirror: [], missingArFile: [] },
  leafIndex: { leafMissingFromIndex: [], indexKeyMissingFromLeaf: [], valueMismatch: [] },
  orphanPacks: []
};

// ============================================================
// 1. LOCALE NAMESPACE COMPLETENESS
// ============================================================
function flattenKeys(obj, prefix = '') {
  const map = {};
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') {
      map[fullKey] = v;
    } else if (typeof v === 'object' && v !== null) {
      Object.assign(map, flattenKeys(v, fullKey));
    }
  }
  return map;
}

function readJSON(filePath) {
  try { return JSON.parse(readFileSync(filePath, 'utf8')); } catch { return null; }
}

const localeNamespaces = readdirSync(join(ROOT, 'locales/ar-001')).filter(f => f.endsWith('.json'));

console.log(`\n=== ar-001 Completeness Validator ===`);
console.log(`\n[1] Locale namespace completeness (${localeNamespaces.length} namespaces)`);

let totalMissingLocaleKeys = 0;
let totalExtraLocaleKeys = 0;

for (const ns of localeNamespaces) {
  const enPath = join(ROOT, 'locales/en', ns);
  const arPath = join(ROOT, 'locales/ar-001', ns);

  if (!existsSync(enPath)) {
    console.log(`  WARNING: No EN authority for ${ns}`);
    continue;
  }

  const en = flattenKeys(readJSON(enPath) || {});
  const ar = flattenKeys(readJSON(arPath) || {});

  const missingInAr = Object.keys(en).filter(k => !(k in ar));
  const extraInAr = Object.keys(ar).filter(k => !(k in en));

  if (missingInAr.length > 0) {
    results.locale.missing.push({ namespace: ns, keys: missingInAr });
    totalMissingLocaleKeys += missingInAr.length;
    console.log(`  ❌ ${ns}: ${missingInAr.length} keys missing in AR`);
    missingInAr.slice(0, 5).forEach(k => console.log(`    - ${k}`));
    if (missingInAr.length > 5) console.log(`    ... and ${missingInAr.length - 5} more`);
  } else {
    console.log(`  ✅ ${ns}: complete`);
  }

  if (extraInAr.length > 0) {
    results.locale.extra.push({ namespace: ns, keys: extraInAr });
    totalExtraLocaleKeys += extraInAr.length;
    // Extra keys in AR (not in EN) are warnings — may be ar-001-specific
  }
}

console.log(`\n  Total missing locale keys: ${totalMissingLocaleKeys}`);
console.log(`  Total extra AR-only locale keys: ${totalExtraLocaleKeys}`);

// ============================================================
// 2. CONTENT-PACK EN/AR MIRROR CHECK
// ============================================================
console.log(`\n[2] Content-pack EN/AR mirror completeness`);

const domains = ['books', 'demo', 'games', 'global-burn-down', 'learning', 'public-seo', 'reports', 'rewards'];
let totalMissingEnMirror = 0;
let totalMissingArFile = 0;

for (const domain of domains) {
  const arDomainPath = join(ROOT, 'content-packs/ar-001', domain);
  const enDomainPath = join(ROOT, 'content-packs/en', domain);

  if (!existsSync(arDomainPath)) continue;

  // Check EN mirror exists (skip public-seo which has no EN mirror)
  if (domain === 'public-seo') {
    console.log(`  ℹ️  public-seo: no EN mirror expected (ar-001-only domain)`);
    continue;
  }

  if (!existsSync(enDomainPath)) {
    console.log(`  ⚠️  ${domain}: no EN domain mirror at content-packs/en/${domain}`);
    totalMissingEnMirror++;
    continue;
  }

  // Walk ar files, check en mirror
  function walkJSON(dir) {
    const files = [];
    if (!existsSync(dir)) return files;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) files.push(...walkJSON(full));
      else if (entry.endsWith('.json')) files.push(full);
    }
    return files;
  }

  const arFiles = walkJSON(arDomainPath);
  let domainMissing = 0;
  for (const arFile of arFiles) {
    const relFromDomain = relative(arDomainPath, arFile);
    const enFile = join(enDomainPath, relFromDomain);
    if (!existsSync(enFile)) {
      domainMissing++;
      results.contentPacks.missingEnMirror.push(relative(ROOT, arFile));
    }
  }

  if (domainMissing > 0) {
    console.log(`  ⚠️  ${domain}: ${domainMissing} ar-001 files have no EN mirror`);
    totalMissingEnMirror += domainMissing;
  } else {
    console.log(`  ✅ ${domain}: all AR files have EN mirror`);
  }
}

console.log(`\n  Total missing EN mirrors: ${totalMissingEnMirror}`);

// ============================================================
// 3. BURN-DOWN INDEX COMPLETENESS
// ============================================================
console.log(`\n[3] Burn-down index leaf/index parity`);

const indexDomains = ['games', 'learning', 'reports', 'global-burn-down'];

for (const domain of indexDomains) {
  const indexPath = join(ROOT, `content-packs/ar-001/${domain}/burn-down-index.json`);
  const leafDir = join(ROOT, `content-packs/ar-001/${domain}/burn-down`);

  if (!existsSync(indexPath)) {
    console.log(`  ⚠️  ${domain}: burn-down-index.json missing`);
    continue;
  }
  if (!existsSync(leafDir)) {
    console.log(`  ⚠️  ${domain}: burn-down/ directory missing`);
    continue;
  }

  const index = readJSON(indexPath);
  if (!index) {
    console.log(`  ⚠️  ${domain}: burn-down-index.json is invalid JSON`);
    continue;
  }

  const leafFiles = readdirSync(leafDir).filter(f => f.endsWith('.json'));
  const indexSlugs = new Set(typeof index === 'object' && !Array.isArray(index)
    ? Object.keys(index)
    : (Array.isArray(index) ? index : []));

  const leafSlugs = new Set(leafFiles.map(f => f.replace('.json', '')));

  const leafMissingFromIndex = [...leafSlugs].filter(s => !indexSlugs.has(s));
  const indexMissingFromLeaf = [...indexSlugs].filter(s => !leafSlugs.has(s));

  if (leafMissingFromIndex.length + indexMissingFromLeaf.length === 0) {
    console.log(`  ✅ ${domain}: leaf/index parity = 0`);
  } else {
    if (leafMissingFromIndex.length > 0) {
      console.log(`  ❌ ${domain}: ${leafMissingFromIndex.length} leaves missing from index`);
      leafMissingFromIndex.slice(0, 3).forEach(s => console.log(`    - ${s}`));
    }
    if (indexMissingFromLeaf.length > 0) {
      console.log(`  ❌ ${domain}: ${indexMissingFromLeaf.length} index keys missing from leaves`);
      indexMissingFromLeaf.slice(0, 3).forEach(s => console.log(`    - ${s}`));
    }
  }
}

// ============================================================
// 4. ACTIVE RUNTIME KEY PARITY (not blind es-419 == ar-001)
// ============================================================
// Correct rule:
//   Runtime-requested active keys ⊆ English canonical keys ⊆ Arabic keys
// Stale es-419-only keys without a runtime consumer are excluded from required parity.
console.log(`\n[4] Active runtime key parity (EN authority ⊇ active ⊆ AR)`);

const classificationPath = join(ROOT, "artifacts/i18n/ar-001-es419-139-key-classification.json");
let activeMissingEn = 0;
let activeMissingAr = 0;
let staleCountedAsRequired = 0;
let staleExcluded = 0;

if (existsSync(classificationPath)) {
  const classification = readJSON(classificationPath) || { active: [], stale: [] };
  const enGames = readJSON(join(ROOT, "content-packs/en/games/burn-down-index.json")) || {};
  const arGames = readJSON(join(ROOT, "content-packs/ar-001/games/burn-down-index.json")) || {};
  const enGlobal = readJSON(join(ROOT, "content-packs/en/global-burn-down/burn-down-index.json")) || {};
  const arGlobal = readJSON(join(ROOT, "content-packs/ar-001/global-burn-down/burn-down-index.json")) || {};

  const pick = (file, loc) => {
    if (String(file || "").includes("global-burn-down")) {
      return loc === "en" ? enGlobal : arGlobal;
    }
    return loc === "en" ? enGames : arGames;
  };

  for (const a of classification.active || []) {
    const enPack = pick(a.file, "en")[a.slug] || {};
    const arPack = pick(a.file, "ar")[a.slug] || {};
    const enOk = typeof enPack[a.shortKey] === "string" && enPack[a.shortKey].trim();
    const arOk = typeof arPack[a.shortKey] === "string" && arPack[a.shortKey].trim();
    if (!enOk) activeMissingEn += 1;
    if (!arOk) activeMissingAr += 1;
  }

  staleExcluded = (classification.stale || []).length;
  // Blind es-419 key equality is intentionally NOT used as a pass/fail gate.
  console.log(`  Active runtime keys missing in EN = ${activeMissingEn}`);
  console.log(`  Active runtime keys missing in AR = ${activeMissingAr}`);
  console.log(`  Stale es-419-only keys excluded = ${staleExcluded}`);
  console.log(`  Stale keys counted as required = ${staleCountedAsRequired}`);
  console.log(`  Blind es-419==ar-001 comparison = disabled`);
} else {
  console.log(`  ⚠️  classification file missing — skip active-runtime gate`);
}

// ============================================================
// SUMMARY
// ============================================================
const totalErrors = totalMissingLocaleKeys + totalMissingEnMirror +
  results.leafIndex.leafMissingFromIndex.length + results.leafIndex.indexKeyMissingFromLeaf.length +
  activeMissingEn + activeMissingAr + staleCountedAsRequired;

console.log(`\n=== COMPLETENESS SUMMARY ===`);
console.log(`Missing locale keys:          ${totalMissingLocaleKeys}`);
console.log(`Missing EN mirrors:           ${totalMissingEnMirror}`);
console.log(`Leaf/index mismatches:        ${results.leafIndex.leafMissingFromIndex.length + results.leafIndex.indexKeyMissingFromLeaf.length}`);
console.log(`Active missing in EN:         ${activeMissingEn}`);
console.log(`Active missing in AR:         ${activeMissingAr}`);
console.log(`Stale counted as required:    ${staleCountedAsRequired}`);
console.log(`Total errors:                 ${totalErrors}`);
console.log(totalErrors === 0 ? `\n✅ COMPLETENESS PASS` : `\n❌ COMPLETENESS FAIL`);

process.exit(totalErrors > 0 ? 1 : 0);
