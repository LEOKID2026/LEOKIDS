/**
 * ar-001 Terminology Validator (EN-authority + semantic key classification)
 *
 * Catches:
 *   - academic Subject → موضوع (should be مادة)
 *   - academic Grade → الدرجات (should be الصفوف / الصف)
 *   - class group → طبقة / درس in wrong context
 *
 * Avoids FPs for: message/email subject, grammatical subject, physical matter,
 * geological layer, score/mark, Topic.
 *
 * Exceptions = exact key + reason only (no directory/substring allowlists).
 *
 * Usage: node scripts/i18n/validators/ar-001-terminology-validator.mjs
 */

import { existsSync } from 'fs';
import { join } from 'path';
import {
  ROOT,
  readJSON,
  rel,
  flattenStrings,
  walkFiles,
  toEnAuthorityPath,
  classifyKeySemantics,
  printFindings,
  exitCodeFor,
} from './lib/ar-001-validator-common.mjs';

/**
 * Exact-key exceptions only. Each must include a reason.
 * Add entries only when a true non-violation would otherwise fail.
 */
const EXACT_KEY_EXCEPTIONS = [
  {
    file: 'locales/ar-001/ui.json',
    key: 'public.contact.form.subjectLabel',
    reason: 'Contact form message subject — موضوع is correct (not academic Subject)',
  },
  {
    file: 'locales/ar-001/school.json',
    key: 'portal.composeFieldSubject',
    reason: 'School inbox message subject field — موضوع is correct',
  },
  {
    file: 'locales/ar-001/worksheets.json',
    key: 'coloringUploadPhaseSegment',
    reason: 'Image foreground/subject separation — not academic Subject',
  },
];

const exceptionSet = new Map(
  EXACT_KEY_EXCEPTIONS.map((e) => [`${e.file}::${e.key}`, e.reason])
);

const findings = [];

/** Canonical content / naturalness assertions from current audit finding families. */
const CANONICAL_CONTENT_RULES = [
  {
    ruleId: 'content-tic-tac-toe-title',
    file: 'content-packs/ar-001/games/tic-tac-toe.json',
    key: 'title',
    expectEquals: 'إكس أو',
    reason: 'Tic-Tac-Toe title must be إكس أو',
  },
  {
    ruleId: 'content-books-audio-stop',
    file: 'content-packs/ar-001/books/ui.json',
    key: 'shell.audioStop',
    expectEquals: 'إيقاف',
    reason: 'Books audio stop label must be إيقاف',
  },
  {
    ruleId: 'content-demo-leo-number',
    file: 'content-packs/ar-001/demo/ui.json',
    key: 'friends.demoUnavailable',
    mustInclude: ['رقم Leo'],
    mustNotMatch: [/رقم\s*الأسد/, /ليو/],
    reason: 'Demo friends copy must use رقم Leo (Latin Leo)',
  },
  {
    ruleId: 'content-school-subject-operator',
    file: 'locales/ar-001/school.json',
    key: 'portal.operatorNoTeaching',
    enMustMatch: /\bsubject\b/i,
    mustIncludeAny: ['مادة', 'المادة'],
    mustNotMatch: [/موضوع/],
    reason: 'School operatorNoTeaching: academic subject → مادة not موضوع',
  },
  {
    ruleId: 'content-public-subject-kids-benefit',
    file: 'locales/ar-001/ui.json',
    key: 'public.homepage.kids.benefits.2.text',
    enMustMatch: /\bsubject\b/i,
    mustIncludeAny: ['مادة', 'المادة'],
    mustNotMatch: [/موضوع/],
    reason: 'Public kids benefit: academic subject → مادة',
  },
  {
    ruleId: 'content-public-grade-phase',
    file: 'locales/ar-001/ui.json',
    key: 'public.about.siteFeatures.1.phase',
    enMustMatch: /\bgrades?\b/i,
    mustIncludeAny: ['صف', 'الصف', 'صفوف', 'الصفوف'],
    mustNotMatch: [/الدرجات/],
    reason: 'Public about phase: Grade year level → الصفوف not الدرجات',
  },
];

function isExcepted(fileRel, key) {
  return exceptionSet.has(`${fileRel}::${key}`);
}

function getByPath(obj, dotted) {
  return dotted.split('.').reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), obj);
}

function checkCanonicalRules() {
  for (const rule of CANONICAL_CONTENT_RULES) {
    const abs = join(ROOT, rule.file);
    const data = readJSON(abs);
    if (!data) {
      findings.push({
        severity: 'error',
        file: rule.file,
        key: rule.key,
        reason: `Canonical content file missing/invalid — ${rule.reason}`,
        ruleId: rule.ruleId,
      });
      continue;
    }
    const arValue = getByPath(data, rule.key);
    const enPath = toEnAuthorityPath(abs);
    const enData = existsSync(enPath) ? readJSON(enPath) : null;
    const enValue = enData ? getByPath(enData, rule.key) : '';

    if (rule.enMustMatch && typeof enValue === 'string' && !rule.enMustMatch.test(enValue)) {
      continue; // EN authority no longer matches finding premise
    }

    if (typeof arValue !== 'string') {
      findings.push({
        severity: 'error',
        file: rule.file,
        key: rule.key,
        value: String(arValue),
        enValue,
        reason: rule.reason,
        ruleId: rule.ruleId,
      });
      continue;
    }

    if (rule.expectEquals && arValue !== rule.expectEquals) {
      findings.push({
        severity: 'error',
        file: rule.file,
        key: rule.key,
        value: arValue,
        enValue,
        reason: `${rule.reason} (expected "${rule.expectEquals}")`,
        ruleId: rule.ruleId,
      });
    }
    if (rule.mustInclude) {
      for (const frag of rule.mustInclude) {
        if (!arValue.includes(frag)) {
          findings.push({
            severity: 'error',
            file: rule.file,
            key: rule.key,
            value: arValue,
            enValue,
            reason: `${rule.reason} (missing "${frag}")`,
            ruleId: rule.ruleId,
          });
        }
      }
    }
    if (rule.mustIncludeAny && !rule.mustIncludeAny.some((f) => arValue.includes(f))) {
      findings.push({
        severity: 'error',
        file: rule.file,
        key: rule.key,
        value: arValue,
        enValue,
        reason: `${rule.reason} (expected one of ${rule.mustIncludeAny.join('|')})`,
        ruleId: rule.ruleId,
      });
    }
    if (rule.mustNotMatch) {
      for (const re of rule.mustNotMatch) {
        if (re.test(arValue)) {
          findings.push({
            severity: 'error',
            file: rule.file,
            key: rule.key,
            value: arValue,
            enValue,
            reason: `${rule.reason} (forbidden pattern ${re})`,
            ruleId: rule.ruleId,
          });
        }
      }
    }
  }
}

function checkPair(arPath) {
  const enPath = toEnAuthorityPath(arPath);
  if (!existsSync(enPath)) return;
  const arData = readJSON(arPath);
  const enData = readJSON(enPath);
  if (!arData || !enData) return;

  const arFlat = flattenStrings(arData);
  const enFlat = flattenStrings(enData);
  const fileRel = rel(arPath);

  for (const [key, enValue] of Object.entries(enFlat)) {
    const arValue = arFlat[key];
    if (typeof arValue !== 'string' || typeof enValue !== 'string') continue;
    if (isExcepted(fileRel, key)) continue;

    const sem = classifyKeySemantics(key, enValue, fileRel);

    // Hebrew / Arabic-Indic always
    if (/[\u05D0-\u05EA\u05F0-\u05F4\uFB1D-\uFB4E]/.test(arValue)) {
      findings.push({
        severity: 'critical',
        file: fileRel,
        key,
        value: arValue.slice(0, 80),
        reason: 'Hebrew characters in ar-001 string',
        ruleId: 'term-hebrew',
      });
    }
    if (/[٠١٢٣٤٥٦٧٨٩]/.test(arValue)) {
      findings.push({
        severity: 'error',
        file: fileRel,
        key,
        value: arValue.slice(0, 80),
        reason: 'Arabic-Indic digits forbidden — use Western 0-9',
        ruleId: 'term-arabic-indic',
      });
    }

    if (sem === 'academic_subject') {
      // Subject rendered as موضوع without مادة/مواد
      if (/موضوع|مواضيع|موضوعات/.test(arValue) && !/مادة|مواد/.test(arValue)) {
        // Skip if EN clearly means topic / discourse "on the subject of"
        if (/\btopics?\b/i.test(enValue) && !/\bsubjects?\b/i.test(enValue)) continue;
        if (/\b(?:on|in)\s+the\s+subject\s+of\b/i.test(enValue)) continue;
        if (/\bon the subject:/i.test(enValue)) continue;
        if (/\ba little more on the subject\b/i.test(enValue)) continue;
        findings.push({
          severity: 'error',
          file: fileRel,
          key,
          value: arValue.slice(0, 100),
          enValue: enValue.slice(0, 100),
          reason: 'Academic Subject translated as موضوع — must be مادة/مواد',
          ruleId: 'term-academic-subject-mawdu',
        });
      }
    }

    if (sem === 'academic_grade') {
      if (/الدرجات/.test(arValue) && !/صف/.test(arValue)) {
        findings.push({
          severity: 'error',
          file: fileRel,
          key,
          value: arValue.slice(0, 100),
          enValue: enValue.slice(0, 100),
          reason: 'Academic Grade/year level translated as الدرجات — must be الصف/الصفوف',
          ruleId: 'term-academic-grade-darajat',
        });
      }
    }

    if (sem === 'class_group') {
      if (/طبقة/.test(arValue) || (/(^|[^\u0600-\u06FF])درس([^\u0600-\u06FF]|$)/.test(arValue) && !/دروس/.test(arValue))) {
        // درس alone as class-group label is wrong; allow in longer pedagogical phrases carefully
        if (/طبقة/.test(arValue) || (/^درس$/.test(arValue.trim()) || /class group|physical class/i.test(enValue) && /درس/.test(arValue) && !/فصل/.test(arValue))) {
          findings.push({
            severity: 'error',
            file: fileRel,
            key,
            value: arValue.slice(0, 100),
            enValue: enValue.slice(0, 100),
            reason: 'Class group translated as طبقة/درس — must be الفصل/فصول',
            ruleId: 'term-class-group-wrong',
          });
        }
      }
    }

    // Topic must not be مادة when key/value are topic-classified
    if (sem === 'topic') {
      if (/\btopics?\b/i.test(enValue) && /مادة|مواد/.test(arValue) && !/موضوع/.test(arValue)) {
        findings.push({
          severity: 'error',
          file: fileRel,
          key,
          value: arValue.slice(0, 100),
          enValue: enValue.slice(0, 100),
          reason: 'Topic translated as مادة — must be موضوع',
          ruleId: 'term-topic-as-subject',
        });
      }
    }
  }
}

console.log('\n=== ar-001 Terminology Validator ===');
console.log(`Exact-key exceptions: ${EXACT_KEY_EXCEPTIONS.length}`);

checkCanonicalRules();

const localeFiles = walkFiles(join(ROOT, 'locales/ar-001'), ['.json']);
const packFiles = walkFiles(join(ROOT, 'content-packs/ar-001'), ['.json']);
for (const f of [...localeFiles, ...packFiles]) checkPair(f);

// Document unexplained exceptions = 0
for (const e of EXACT_KEY_EXCEPTIONS) {
  if (!e.reason || e.reason.length < 8) {
    findings.push({
      severity: 'error',
      file: e.file,
      key: e.key,
      reason: 'Exact-key exception missing reason',
      ruleId: 'term-exception-unexplained',
    });
  }
}

printFindings('Terminology results', findings);
const code = exitCodeFor(findings, ['critical', 'error']);
console.log(code === 0 ? '\n✅ Terminology validator PASS' : '\n❌ Terminology validator FAIL');
console.log(`EXACT_KEY_EXCEPTIONS_COUNT=${EXACT_KEY_EXCEPTIONS.length}`);
process.exit(code);
