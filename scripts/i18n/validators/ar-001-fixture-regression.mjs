/**
 * ar-001 Fixture Regression Runner
 * Verifies fail-before / pass-after detection for all 32 finding-family fixtures.
 *
 * Usage: node scripts/i18n/validators/ar-001-fixture-regression.mjs
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import {
  LEO_EN_PATTERN,
  containsForbiddenLeoTransliteration,
  arHasLatinLeo,
  classifyKeySemantics,
} from './lib/ar-001-validator-common.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const FIXTURES = join(__dirname, 'fixtures');
const manifest = JSON.parse(readFileSync(join(FIXTURES, 'fixture-manifest.json'), 'utf8'));
const coverage = JSON.parse(
  readFileSync(join(__dirname, 'ar-001-findings-coverage.json'), 'utf8')
);

function load(rel) {
  const p = join(FIXTURES, rel);
  const raw = readFileSync(p, 'utf8');
  if (rel.endsWith('.json')) return JSON.parse(raw);
  return raw;
}

function detectBrandLeoPair(en, ar) {
  const hits = [];
  if (!LEO_EN_PATTERN.test(en)) return hits;
  if (!arHasLatinLeo(ar)) hits.push('missing-latin-leo');
  if (/الأسد|برج\s*الأسد/.test(ar)) hits.push('lion-as-brand');
  if (containsForbiddenLeoTransliteration(ar)) hits.push('leo-transliteration');
  return hits;
}

function detectDemoLeoNumber(ar) {
  const hits = [];
  if (!ar.includes('رقم Leo')) hits.push('missing-leo-number');
  const stripped = ar.replace(/اليوم|اليومي|يوليو/g, '');
  if (/رقم\s*الأسد/.test(ar) || /ليو/.test(stripped)) hits.push('lion-number');
  return hits;
}

function detectAcademicSubject(key, en, ar) {
  const sem = classifyKeySemantics(key, en, 'locales/ar-001/fixture.json');
  const hits = [];
  if (sem === 'academic_subject' || /\bsubjects?\b/i.test(en)) {
    if ((/موضوع|مواضيع|موضوعات/.test(ar)) && !/مادة|مواد/.test(ar)) {
      hits.push('academic-subject-mawdu');
    }
  }
  return hits;
}

function detectAcademicGrade(key, en, ar) {
  const hits = [];
  if (/\bgrades?\b/i.test(en) || classifyKeySemantics(key, en) === 'academic_grade') {
    if (/الدرجات/.test(ar) && !/صف/.test(ar)) hits.push('academic-grade-darajat');
  }
  return hits;
}

function detectClassGroup(key, en, ar) {
  const sem = classifyKeySemantics(key, en, 'locales/ar-001/school.json');
  const hits = [];
  if (sem === 'class_group' || /class\s*group/i.test(en) || /classgroup|physicalclass/i.test(key)) {
    if (/طبقة/.test(ar) || ar.trim() === 'درس' || (/درس/.test(ar) && !/فصل/.test(ar))) {
      hits.push('class-group-wrong');
    }
  }
  return hits;
}

function detectSubjectVsTopic(pairs) {
  const all = [];
  for (const p of pairs) {
    if (/\bsubject\b/i.test(p.en) && !/_by_topic|by_topic/.test(p.key)) {
      if (/موضوع/.test(p.ar) && !/مادة|مواد/.test(p.ar)) all.push('academic-subject-mawdu');
    }
    if (/\btopic\b/i.test(p.en) || /_by_topic|by_topic/.test(p.key)) {
      if (/مادة|مواد/.test(p.ar) && !/موضوع/.test(p.ar)) all.push('topic-as-subject');
    }
  }
  return all;
}

function detectInterstitial(src) {
  const hits = [];
  if (/Great job/i.test(src)) hits.push('great-job');
  if (/Game over/i.test(src)) hits.push('game-over');
  if (/Calculating your score/i.test(src)) hits.push('calculating');
  if (/>\s*Skip\s*</.test(src)) hits.push('skip');
  if (/dir=["']ltr["']/.test(src)) hits.push('dir-ltr');
  return hits;
}

function detectFinishKeys(data) {
  return data.requestedKeys.filter((k) => typeof data.leafCopy[k] !== 'string');
}

function detectWorksheetPdf(src) {
  return />\s*PDF\s*</.test(src) ? ['standalone-pdf'] : [];
}

function detectLeafIndex(data) {
  const leaf = data.leaf.copy || data.leaf;
  const index = data.index;
  return Object.keys(leaf).filter((k) => index[k] !== leaf[k]);
}

function detectLeafIndexStale(data) {
  const leaf = data.leaf.copy || data.leaf;
  const index = data.index;
  return Object.keys(index).filter((k) => !(k in leaf));
}

function runCheck(check, data) {
  switch (check) {
    case 'brand-leo-pair':
      return detectBrandLeoPair(data.en, data.ar);
    case 'demo-leo-number':
      return detectDemoLeoNumber(data.ar);
    case 'academic-subject':
      return detectAcademicSubject(data.key, data.en, data.ar);
    case 'academic-grade':
      return detectAcademicGrade(data.key, data.en, data.ar);
    case 'class-group':
      return detectClassGroup(data.key, data.en, data.ar);
    case 'subject-vs-topic':
      return detectSubjectVsTopic(data.pairs);
    case 'equals-title':
      return data.ar === data.expectEquals ? [] : ['title-mismatch'];
    case 'equals-audio-stop':
      return data.ar === data.expectEquals ? [] : ['audio-stop-mismatch'];
    case 'interstitial-en':
      return detectInterstitial(data);
    case 'finish-keys':
      return detectFinishKeys(data).map((k) => `missing:${k}`);
    case 'worksheet-pdf':
      return detectWorksheetPdf(data);
    case 'leaf-index-values':
      return detectLeafIndex(data).map((k) => `mismatch:${k}`);
    case 'leaf-index-stale':
      return detectLeafIndexStale(data).map((k) => `stale:${k}`);
    default:
      throw new Error(`Unknown check ${check}`);
  }
}

let failures = 0;
console.log('\n=== ar-001 Fixture Regression (fail-before / pass-after) ===');

const expected = (coverage.linguistic?.length || 0) + (coverage.runtime?.length || 0);
console.log(`Coverage registry findings: ${expected} (linguistic ${coverage.linguistic.length} + runtime ${coverage.runtime.length})`);
console.log(`Fixture pairs: ${manifest.pairs.length}`);

if (manifest.pairs.length !== 32) {
  console.log(`❌ Expected 32 fixture pairs, found ${manifest.pairs.length}`);
  failures++;
}

const ids = new Set(manifest.pairs.map((p) => p.id));
for (const f of [...coverage.linguistic, ...coverage.runtime]) {
  if (!ids.has(f.id)) {
    console.log(`❌ Coverage finding ${f.id} missing fixture pair`);
    failures++;
  }
}

for (const pair of manifest.pairs) {
  const failData = load(pair.fail);
  const passData = load(pair.pass);
  const failHits = runCheck(pair.check, failData);
  const passHits = runCheck(pair.check, passData);

  const failOk = failHits.length > 0;
  const passOk = passHits.length === 0;

  if (!failOk || !passOk) {
    failures++;
    console.log(`\n❌ ${pair.id} ${pair.family} (${pair.ruleId})`);
    if (!failOk) console.log(`   FAIL fixture produced 0 detections — rule too weak`);
    if (!passOk) console.log(`   PASS fixture still detected: ${passHits.join(', ')} — false positive`);
  } else {
    console.log(`✅ ${pair.id} ${pair.family}: fail(${failHits.length}) pass(0)`);
  }
}

console.log(`\nFixture pairs verified: ${manifest.pairs.length}`);
console.log(failures === 0 ? '✅ Fixture regression PASS' : `❌ Fixture regression FAIL (${failures})`);
process.exit(failures === 0 ? 0 : 1);
