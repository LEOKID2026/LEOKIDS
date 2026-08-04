/**
 * ar-001 Leaf/Index Value Parity Validator
 *
 * Compares VALUES (not just key existence):
 *   - Leaf key exists in index
 *   - Index key exists in leaf
 *   - Leaf value == index value
 *   - No stale index values
 *
 * Domains with burn-down-index.json:
 *   games, reports, learning (burn-down/ leaves)
 *   global-burn-down (sibling leaf JSON files)
 *
 * Usage: node scripts/i18n/validators/ar-001-leaf-index-parity-validator.mjs
 */

import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import {
  ROOT,
  readJSON,
  flattenStrings,
  printFindings,
  exitCodeFor,
} from './lib/ar-001-validator-common.mjs';

const findings = [];

const DOMAINS = [
  {
    id: 'games',
    index: 'content-packs/ar-001/games/burn-down-index.json',
    leafDir: 'content-packs/ar-001/games/burn-down',
    layout: 'burn-down-subdir',
  },
  {
    id: 'reports',
    index: 'content-packs/ar-001/reports/burn-down-index.json',
    leafDir: 'content-packs/ar-001/reports/burn-down',
    layout: 'burn-down-subdir',
  },
  {
    id: 'learning',
    index: 'content-packs/ar-001/learning/burn-down-index.json',
    leafDir: 'content-packs/ar-001/learning/burn-down',
    layout: 'burn-down-subdir',
  },
  {
    id: 'global-burn-down',
    index: 'content-packs/ar-001/global-burn-down/burn-down-index.json',
    leafDir: 'content-packs/ar-001/global-burn-down',
    layout: 'sibling-leaves',
  },
];

/** Normalize leaf JSON to the flat copy map stored in indexes. */
function leafCopyMap(leafData) {
  if (!leafData || typeof leafData !== 'object') return {};
  if (leafData.copy && typeof leafData.copy === 'object') {
    return flattenStrings(leafData.copy);
  }
  // Some leaves are already flat string maps (or mixed)
  const flat = flattenStrings(leafData);
  // Drop non-copy metadata keys if present at top-level alongside copy-less packs
  return flat;
}

function indexEntryMap(entry) {
  if (!entry || typeof entry !== 'object') return {};
  if (entry.copy && typeof entry.copy === 'object') return flattenStrings(entry.copy);
  return flattenStrings(entry);
}

function listLeafSlugs(domain) {
  const abs = join(ROOT, domain.leafDir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => f.endsWith('.json') && f !== 'burn-down-index.json')
    .map((f) => f.replace(/\.json$/, ''));
}

function checkDomain(domain) {
  const indexPath = join(ROOT, domain.index);
  if (!existsSync(indexPath)) {
    findings.push({
      severity: 'error',
      file: domain.index,
      key: '(index)',
      reason: `burn-down-index.json missing for domain ${domain.id}`,
      ruleId: 'leaf-index-missing-index',
    });
    return;
  }

  const index = readJSON(indexPath);
  if (!index || typeof index !== 'object' || Array.isArray(index)) {
    findings.push({
      severity: 'error',
      file: domain.index,
      key: '(index)',
      reason: 'burn-down-index.json is not a slug→object map',
      ruleId: 'leaf-index-invalid',
    });
    return;
  }

  const leafSlugs = listLeafSlugs(domain);
  const indexSlugs = Object.keys(index);

  for (const slug of leafSlugs) {
    if (!(slug in index)) {
      findings.push({
        severity: 'error',
        file: `${domain.leafDir}/${slug}.json`,
        key: slug,
        reason: `Leaf missing from ${domain.id} burn-down-index`,
        ruleId: 'leaf-missing-from-index',
      });
      continue;
    }

    const leafPath = join(ROOT, domain.leafDir, `${slug}.json`);
    const leafData = readJSON(leafPath);
    const leafMap = leafCopyMap(leafData);
    const indexMap = indexEntryMap(index[slug]);

    // Leaf keys must exist in index with equal values
    for (const [k, leafVal] of Object.entries(leafMap)) {
      if (!(k in indexMap)) {
        findings.push({
          severity: 'error',
          file: domain.index,
          key: `${slug}.${k}`,
          value: leafVal,
          reason: `Leaf key missing from ${domain.id} index (stale/incomplete index)`,
          ruleId: 'leaf-key-missing-in-index',
        });
        continue;
      }
      if (indexMap[k] !== leafVal) {
        findings.push({
          severity: 'error',
          file: domain.index,
          key: `${slug}.${k}`,
          value: indexMap[k],
          enValue: leafVal,
          reason: `Leaf/index VALUE mismatch in ${domain.id} (index stale vs leaf)`,
          ruleId: 'leaf-index-value-mismatch',
        });
      }
    }

    // Index keys must exist in leaf (no stale index-only keys)
    for (const [k, indexVal] of Object.entries(indexMap)) {
      if (!(k in leafMap)) {
        findings.push({
          severity: 'error',
          file: domain.index,
          key: `${slug}.${k}`,
          value: indexVal,
          reason: `Index key missing from leaf in ${domain.id} (stale index entry)`,
          ruleId: 'index-key-missing-in-leaf',
        });
      }
    }
  }

  for (const slug of indexSlugs) {
    if (!leafSlugs.includes(slug)) {
      findings.push({
        severity: 'error',
        file: domain.index,
        key: slug,
        reason: `Index slug has no leaf file in ${domain.id}`,
        ruleId: 'index-slug-missing-leaf',
      });
    }
  }

  const mismatchCount = findings.filter(
    (f) => f.ruleId === 'leaf-index-value-mismatch' && f.file === domain.index
  ).length;
  const keyIssues = findings.filter(
    (f) =>
      (f.ruleId === 'leaf-missing-from-index' ||
        f.ruleId === 'index-slug-missing-leaf' ||
        f.ruleId === 'leaf-key-missing-in-index' ||
        f.ruleId === 'index-key-missing-in-leaf') &&
      (f.file.includes(domain.id) || f.key?.startsWith)
  ).length;

  console.log(
    `  ${domain.id}: leaves=${leafSlugs.length} index=${indexSlugs.length} valueMismatches≈${mismatchCount}`
  );
}

console.log('\n=== ar-001 Leaf/Index Value Parity Validator ===');
for (const d of DOMAINS) checkDomain(d);

printFindings('Leaf/Index parity results', findings);
const code = exitCodeFor(findings, ['critical', 'error']);
console.log(code === 0 ? '\n✅ Leaf/Index parity PASS' : '\n❌ Leaf/Index parity FAIL');
process.exit(code);
