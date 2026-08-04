/**
 * ar-001 Runtime-Copy Validator
 *
 * Targeted product-defect checks:
 *   1. Hardcoded English in SoloGameEndInterstitialOverlay.jsx
 *   2. All requested SoloGameFinishScreen keys present in AR pack (+ index)
 *   3. Standalone PDF label in WorksheetPreviewActions.jsx
 *   4. Raw-key fallback paths for finish screen (missing keys → key echoed)
 *
 * Also keeps light Hebrew / Arabic-Indic source scans.
 *
 * Usage: node scripts/i18n/validators/ar-001-hardcoded-runtime-validator.mjs
 */

import { existsSync } from 'fs';
import { join } from 'path';
import {
  ROOT,
  readJSON,
  readText,
  flattenStrings,
  printFindings,
  exitCodeFor,
} from './lib/ar-001-validator-common.mjs';

const findings = [];

const INTERSTITIAL = 'components/solo-games/SoloGameEndInterstitialOverlay.jsx';
const FINISH_SCREEN = 'components/solo-games/SoloGameFinishScreen.jsx';
const FINISH_SLUG = 'components__solo-games__SoloGameFinishScreen';
const FINISH_LEAF = `content-packs/ar-001/games/burn-down/${FINISH_SLUG}.json`;
const FINISH_INDEX = 'content-packs/ar-001/games/burn-down-index.json';
const WORKSHEET_ACTIONS = 'components/worksheets/WorksheetPreviewActions.jsx';

/** Only flag quoted/JSX text literals — not identifiers like lose_title. */
const FORBIDDEN_INTERSTITIAL_EN = [
  { re: /["'`]Great job!?["'`]/, reason: 'Hardcoded English win copy in interstitial' },
  { re: /["'`]Game over["'`]/i, reason: 'Hardcoded English lose copy in interstitial' },
  { re: /["'`]Calculating your score\.\.\.["'`]/i, reason: 'Hardcoded English calculating copy in interstitial' },
  { re: />\s*Skip\s*</, reason: 'Hardcoded English Skip button in interstitial' },
  { re: /(?:=\s*|:\s*|>\s*)["'`]Skip["'`]/, reason: 'Hardcoded English Skip string in interstitial' },
  // Static dir="ltr" attribute only (not ternary locale branches containing "ltr")
  { re: /\bdir=["']ltr["']/, reason: 'Hardcoded dir=ltr on interstitial (must derive from locale)' },
];

function checkInterstitial() {
  const src = readText(join(ROOT, INTERSTITIAL));
  if (!src) {
    findings.push({
      severity: 'error',
      file: INTERSTITIAL,
      reason: 'SoloGameEndInterstitialOverlay.jsx missing',
      ruleId: 'runtime-interstitial-missing-file',
    });
    return;
  }
  for (const rule of FORBIDDEN_INTERSTITIAL_EN) {
    if (rule.re.test(src)) {
      findings.push({
        severity: 'error',
        file: INTERSTITIAL,
        value: String(rule.re),
        reason: rule.reason,
        ruleId: 'runtime-interstitial-hardcoded-en',
      });
    }
  }
  // Must be wired to i18n/pack (not ar-001-only literal branch)
  const wired =
    /gamePackCopy|useTranslation|\.t\(|useI18n|burnDownCopy|createGamePackCopy/.test(src);
  if (!wired && FORBIDDEN_INTERSTITIAL_EN.some((r) => r.re.test(src))) {
    findings.push({
      severity: 'error',
      file: INTERSTITIAL,
      reason: 'Interstitial not wired to locale/pack copy source',
      ruleId: 'runtime-interstitial-not-wired',
    });
  }
}

function extractFinishRequestedKeys(src) {
  const keys = new Set();
  const re = /gamePackCopy\(\s*["']components__solo-games__SoloGameFinishScreen["']\s*,\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src)) !== null) keys.add(m[1]);
  return [...keys];
}

function checkFinishKeys() {
  const src = readText(join(ROOT, FINISH_SCREEN));
  if (!src) {
    findings.push({
      severity: 'error',
      file: FINISH_SCREEN,
      reason: 'SoloGameFinishScreen.jsx missing',
      ruleId: 'runtime-finish-missing-file',
    });
    return;
  }

  const requested = extractFinishRequestedKeys(src);
  if (requested.length === 0) {
    findings.push({
      severity: 'error',
      file: FINISH_SCREEN,
      reason: 'No gamePackCopy finish keys detected — extractor/regression failure',
      ruleId: 'runtime-finish-no-keys-detected',
    });
    return;
  }

  const leaf = readJSON(join(ROOT, FINISH_LEAF));
  const leafMap = leaf?.copy ? flattenStrings(leaf.copy) : flattenStrings(leaf || {});
  const index = readJSON(join(ROOT, FINISH_INDEX)) || {};
  const indexMap = flattenStrings(index[FINISH_SLUG] || {});

  for (const key of requested) {
    const inLeaf = typeof leafMap[key] === 'string' && leafMap[key].trim().length > 0;
    const inIndex = typeof indexMap[key] === 'string' && indexMap[key].trim().length > 0;

    if (!inLeaf) {
      findings.push({
        severity: 'error',
        file: FINISH_LEAF,
        key,
        reason: `Finish screen requested key missing from AR leaf — raw-key fallback risk`,
        ruleId: 'runtime-finish-key-missing-leaf',
      });
    }
    if (!inIndex) {
      findings.push({
        severity: 'error',
        file: FINISH_INDEX,
        key: `${FINISH_SLUG}.${key}`,
        reason: `Finish screen requested key missing from games burn-down-index — runtime resolves via index`,
        ruleId: 'runtime-finish-key-missing-index',
      });
    }

    // Raw-key fallback: lookup returns the key string itself when missing
    if (!inIndex) {
      findings.push({
        severity: 'error',
        file: FINISH_SCREEN,
        key,
        value: key,
        reason: 'Visible raw-key fallback path: gamePackCopy returns key when pack value missing',
        ruleId: 'runtime-finish-raw-key-fallback',
      });
    } else if (indexMap[key] === key) {
      findings.push({
        severity: 'error',
        file: FINISH_INDEX,
        key: `${FINISH_SLUG}.${key}`,
        value: key,
        reason: 'Pack value equals raw key — user-visible raw-key fallback',
        ruleId: 'runtime-finish-raw-key-value',
      });
    }
  }

  console.log(`  Finish requested keys: ${requested.join(', ')}`);
}

function checkWorksheetPdf() {
  const src = readText(join(ROOT, WORKSHEET_ACTIONS));
  if (!src) {
    findings.push({
      severity: 'error',
      file: WORKSHEET_ACTIONS,
      reason: 'WorksheetPreviewActions.jsx missing',
      ruleId: 'runtime-pdf-missing-file',
    });
    return;
  }

  // Standalone user-facing PDF label: JSX text node that is only "PDF"
  const standalonePdf =
    />\s*PDF\s*</.test(src) ||
    /children\s*:\s*["']PDF["']/.test(src) ||
    /\{["']PDF["']\}/.test(src);

  if (standalonePdf) {
    findings.push({
      severity: 'error',
      file: WORKSHEET_ACTIONS,
      value: 'PDF',
      reason: 'Standalone English PDF button label — must use localized worksheet UI label (e.g. تنزيل PDF)',
      ruleId: 'runtime-worksheet-pdf-standalone',
    });
  }

  // If still literal PDF and not using ui.* copy
  if (standalonePdf && !/ui\.(pdf|downloadPdf|exportPdf|printPdf)/i.test(src)) {
    findings.push({
      severity: 'error',
      file: WORKSHEET_ACTIONS,
      reason: 'PDF action not bound to worksheet UI locale pack key',
      ruleId: 'runtime-worksheet-pdf-not-wired',
    });
  }
}

function lightSourceScans() {
  for (const relPath of [INTERSTITIAL, FINISH_SCREEN, WORKSHEET_ACTIONS]) {
    const src = readText(join(ROOT, relPath));
    if (!src) continue;
    if (/[\u05D0-\u05EA]/.test(src)) {
      findings.push({
        severity: 'critical',
        file: relPath,
        reason: 'Hebrew character in runtime source file',
        ruleId: 'runtime-hebrew',
      });
    }
  }
}

console.log('\n=== ar-001 Runtime-Copy Validator ===');
checkInterstitial();
checkFinishKeys();
checkWorksheetPdf();
lightSourceScans();

printFindings('Runtime-copy results', findings);
const code = exitCodeFor(findings, ['critical', 'error']);
console.log(code === 0 ? '\n✅ Runtime-copy PASS' : '\n❌ Runtime-copy FAIL');
process.exit(code);
