/**
 * ar-001 Brand Validator (EN-authority comparison)
 *
 * When English authority contains Leo as brand/character:
 *   - Arabic must contain Latin `Leo`
 *   - Arabic must NOT contain الأسد / برج الأسد / ليو for that entity
 *
 * Coverage: locale JSON, content-packs, help, learning JS templates,
 * leafs, indexes, catalogs. Exact-key allowlist = 30 Group A FPs only.
 *
 * Usage: node scripts/i18n/validators/ar-001-brand-validator.mjs
 */

import { existsSync } from 'fs';
import { join } from 'path';
import {
  ROOT,
  readJSON,
  readText,
  rel,
  flattenStrings,
  walkFiles,
  toEnAuthorityPath,
  loadBrandExactKeyAllowlist,
  isAllowlistedExact,
  LEO_EN_PATTERN,
  containsForbiddenLeoTransliteration,
  arHasLatinLeo,
  printFindings,
  exitCodeFor,
} from './lib/ar-001-validator-common.mjs';

const findings = [];
const allowMap = loadBrandExactKeyAllowlist();
let pairsCompared = 0;
let leoEnKeys = 0;

function pushFinding(partial) {
  findings.push({ severity: 'error', ruleId: 'brand-leo-en-authority', ...partial });
}

function checkLeoPair({ fileRel, key, enValue, arValue }) {
  if (!LEO_EN_PATTERN.test(enValue)) return;
  leoEnKeys++;

  if (isAllowlistedExact(allowMap, fileRel, key)) return;

  const missingLeo = !arHasLatinLeo(arValue);
  const hasLeoTranslit = containsForbiddenLeoTransliteration(arValue);
  const hasLionAsBrand = /برج\s*الأسد/.test(arValue) ||
    // الأسد only when EN has Leo (brand/character) — not educational lion-only EN
    (/الأسد/.test(arValue) && LEO_EN_PATTERN.test(enValue));

  if (missingLeo) {
    pushFinding({
      file: fileRel,
      key,
      enValue,
      value: arValue,
      reason: 'EN contains Leo brand/character but AR lacks Latin Leo',
      ruleId: 'brand-leo-missing-latin',
    });
  }
  if (hasLeoTranslit) {
    pushFinding({
      file: fileRel,
      key,
      enValue,
      value: arValue,
      reason: 'EN Leo entity translated/transliterated as ليو — must use Latin Leo',
      ruleId: 'brand-leo-transliteration',
    });
  }
  if (hasLionAsBrand) {
    pushFinding({
      file: fileRel,
      key,
      enValue,
      value: arValue,
      reason: 'EN Leo entity rendered as الأسد/برج الأسد — must use Latin Leo',
      ruleId: 'brand-leo-lion-translation',
      severity: /برج\s*الأسد/.test(arValue) ? 'critical' : 'error',
    });
  }
}

function compareJsonPair(arPath) {
  const enPath = toEnAuthorityPath(arPath);
  if (!existsSync(enPath)) return;
  const arData = readJSON(arPath);
  const enData = readJSON(enPath);
  if (!arData || !enData) return;

  const arFlat = flattenStrings(arData);
  const enFlat = flattenStrings(enData);
  const fileRel = rel(arPath);

  for (const [key, enValue] of Object.entries(enFlat)) {
    if (typeof enValue !== 'string') continue;
    if (!LEO_EN_PATTERN.test(enValue)) continue;
    pairsCompared++;
    const arValue = arFlat[key];
    if (typeof arValue !== 'string') {
      pushFinding({
        file: fileRel,
        key,
        enValue,
        value: '(missing)',
        reason: 'EN Leo key missing in AR',
        ruleId: 'brand-leo-key-missing',
      });
      continue;
    }
    checkLeoPair({ fileRel, key, enValue, arValue });
  }
}

function compareJsLearningTemplates(arJsPath) {
  const enJsPath = toEnAuthorityPath(arJsPath);
  const arSrc = readText(arJsPath);
  const enSrc = readText(enJsPath);
  if (!arSrc || !enSrc) return;

  const fileRel = rel(arJsPath);
  // Pair by occurrence order of Leo-containing templates in EN vs AR return templates
  const enTemplates = [...enSrc.matchAll(/return\s*`([^`]*)`/g)].map((m) => m[1]);
  const arTemplates = [...arSrc.matchAll(/return\s*`([^`]*)`/g)].map((m) => m[1]);

  const enLeo = enTemplates.filter((t) => LEO_EN_PATTERN.test(t));
  // Also scan AR for forbidden forms even if pairing is imperfect
  arTemplates.forEach((arValue, idx) => {
    const enValue = enTemplates[idx] || '';
    if (LEO_EN_PATTERN.test(enValue) || LEO_EN_PATTERN.test(arValue) || /الأسد|ليو/.test(arValue)) {
      // Only enforce when EN side (same index or any EN Leo template set) has Leo
      const pairedEn = LEO_EN_PATTERN.test(enValue)
        ? enValue
        : enLeo.find((t) => {
            // heuristic: similar non-Leo skeleton
            const norm = (s) => s.replace(/\$\{[^}]+\}/g, '#').replace(/\bLeo\b/g, '#').replace(/الأسد|ليو/g, '#');
            return norm(t) === norm(arValue);
          });
      if (!pairedEn && !LEO_EN_PATTERN.test(enValue)) {
        // AR has Leo/forbidden without EN pair at index — still check if any EN Leo template exists and AR uses الأسد/ليو
        if ((/الأسد/.test(arValue) || containsForbiddenLeoTransliteration(arValue)) && enLeo.length > 0) {
          checkLeoPair({
            fileRel,
            key: `template[${idx}]`,
            enValue: enLeo[0],
            arValue,
          });
        }
        return;
      }
      checkLeoPair({
        fileRel,
        key: `template[${idx}]`,
        enValue: pairedEn || enValue,
        arValue,
      });
    }
  });

  // Global AR file scan for forbidden Leo forms when EN file contains Leo
  if (LEO_EN_PATTERN.test(enSrc)) {
    if (containsForbiddenLeoTransliteration(arSrc) || /برج\s*الأسد/.test(arSrc)) {
      // Already reported per-template; add file-level if templates missed
      const perTemplateHit = findings.some((f) => f.file === fileRel);
      if (!perTemplateHit) {
        pushFinding({
          file: fileRel,
          key: '(file)',
          enValue: '(EN learning template contains Leo)',
          value: '(AR source)',
          reason: 'Learning template file: EN has Leo but AR contains forbidden brand forms',
          ruleId: 'brand-leo-learning-template-file',
        });
      }
    }
    // Ensure at least one Latin Leo appears when EN has Leo templates
    if (enLeo.length > 0 && !arHasLatinLeo(arSrc)) {
      pushFinding({
        file: fileRel,
        key: '(file)',
        enValue: enLeo[0],
        value: '(AR source lacks Leo)',
        reason: 'Learning templates: EN Leo authority but AR file has no Latin Leo',
        ruleId: 'brand-leo-learning-template-missing',
      });
    }
  }
}

// --- Scan ---
console.log('\n=== ar-001 Brand Validator (EN-authority) ===');
console.log(`Exact-key brand allowlist entries: ${allowMap.size}`);

const localeFiles = walkFiles(join(ROOT, 'locales/ar-001'), ['.json']);
const packFiles = walkFiles(join(ROOT, 'content-packs/ar-001'), ['.json']);
const helpFiles = walkFiles(join(ROOT, 'data/help-center/ar-001'), ['.js', '.json']);
const learningJs = walkFiles(join(ROOT, 'utils/learning-content-ar-001'), ['.js', '.jsx', '.ts', '.tsx']);

for (const f of [...localeFiles, ...packFiles, ...helpFiles.filter((f) => f.endsWith('.json'))]) {
  compareJsonPair(f);
}
for (const f of learningJs) {
  compareJsLearningTemplates(f);
}
// Help JS: light Leo scan vs EN help when present
for (const f of helpFiles.filter((f) => f.endsWith('.js'))) {
  compareJsLearningTemplates(f);
}

console.log(`JSON Leo pairs considered: ${leoEnKeys}`);
console.log(`Learning template files scanned: ${learningJs.length}`);
console.log(`Allowlisted exact keys loaded: ${allowMap.size} (expected 30)`);

if (allowMap.size !== 30) {
  findings.push({
    severity: 'warning',
    file: 'artifacts/i18n/ar-001-brand-decisions.json',
    key: 'group_A_approved_exact_keys',
    reason: `Expected 30 Group A exact keys, found ${allowMap.size}`,
    ruleId: 'brand-allowlist-count',
  });
}

printFindings('Brand results', findings);
const code = exitCodeFor(findings, ['critical', 'error']);
console.log(code === 0 ? '\n✅ Brand validator PASS' : '\n❌ Brand validator FAIL');
process.exit(code);
