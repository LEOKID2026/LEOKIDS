/**
 * ar-001 Duplicate/Stale Validator
 * Detects the same English key with conflicting Arabic translations
 * across locale, leaf, index, catalog, and accessibility mirror files.
 *
 * Usage: node scripts/i18n/validators/ar-001-duplicate-stale-validator.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '../../..');

// Map: englishKey → Set of { arValue, sourcePath }
const keyValueMap = new Map();
const conflicts = [];
let filesChecked = 0;
let keysChecked = 0;

function flattenKeys(obj, prefix = '') {
  const map = {};
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') map[fullKey] = v;
    else if (typeof v === 'object' && v !== null) Object.assign(map, flattenKeys(v, fullKey));
  }
  return map;
}

function readJSON(p) {
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

function registerFile(filePath, arData, enData) {
  if (!arData) return;
  const relPath = relative(ROOT, filePath);
  const arFlat = flattenKeys(arData);

  if (enData) {
    // Compare with EN authority — stale check
    const enFlat = flattenKeys(enData);
    for (const [key, arVal] of Object.entries(arFlat)) {
      keysChecked++;
      const enVal = enFlat[key];
      if (!enVal) continue; // ar-only key

      // Register for cross-file conflict detection
      const mapKey = `${key}::EN::${enVal}`;
      if (!keyValueMap.has(mapKey)) {
        keyValueMap.set(mapKey, []);
      }
      keyValueMap.get(mapKey).push({ arVal, source: relPath });
    }
  }
}

function walkJSON(dir) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry)) continue;
      files.push(...walkJSON(full));
    } else if (entry.endsWith('.json')) {
      files.push(full);
    }
  }
  return files;
}

console.log(`\n=== ar-001 Duplicate/Stale Validator ===`);

// Scan locale files
const namespaces = readdirSync(join(ROOT, 'locales/ar-001')).filter(f => f.endsWith('.json'));
for (const ns of namespaces) {
  const arPath = join(ROOT, 'locales/ar-001', ns);
  const enPath = join(ROOT, 'locales/en', ns);
  const arData = readJSON(arPath);
  const enData = existsSync(enPath) ? readJSON(enPath) : null;
  registerFile(arPath, arData, enData);
  filesChecked++;
}

// Scan content-packs
const arPackFiles = walkJSON(join(ROOT, 'content-packs/ar-001'));
for (const arFile of arPackFiles) {
  const enFile = arFile.replace('/ar-001/', '/en/');
  const arData = readJSON(arFile);
  const enData = existsSync(enFile) ? readJSON(enFile) : null;
  registerFile(arFile, arData, enData);
  filesChecked++;
}

console.log(`Files checked: ${filesChecked}`);
console.log(`Keys checked: ${keysChecked}`);

// Find conflicts: same EN key → different AR values in different files
for (const [mapKey, entries] of keyValueMap.entries()) {
  if (entries.length < 2) continue;
  const uniqueArValues = new Set(entries.map(e => e.arVal));
  if (uniqueArValues.size > 1) {
    const [keyPart, , enVal] = mapKey.split('::EN::');
    conflicts.push({
      key: keyPart,
      enValue: enVal,
      arTranslations: entries.map(e => ({ value: e.arVal, source: e.source }))
    });
  }
}

if (conflicts.length === 0) {
  console.log(`\n✅ Duplicate/stale conflicts = 0`);
} else {
  console.log(`\n❌ Conflicting translations = ${conflicts.length}`);
  for (const c of conflicts.slice(0, 20)) {
    console.log(`\n  Key:  ${c.key}`);
    console.log(`  EN:   ${c.enValue}`);
    for (const t of c.arTranslations) {
      console.log(`  AR "${t.value}" in ${t.source}`);
    }
  }
  if (conflicts.length > 20) {
    console.log(`\n  ... and ${conflicts.length - 20} more conflicts`);
  }
}

process.exit(conflicts.length > 0 ? 1 : 0);
