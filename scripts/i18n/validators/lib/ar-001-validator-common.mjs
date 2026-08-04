/**
 * Shared helpers for ar-001 closure validators.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, sep } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
export const ROOT = join(__dirname, '../../../..');

export function readJSON(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

export function readText(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

export function rel(filePath) {
  return relative(ROOT, filePath).split(sep).join('/');
}

export function flattenStrings(obj, prefix = '', out = {}) {
  if (typeof obj === 'string') {
    out[prefix] = obj;
    return out;
  }
  if (!obj || typeof obj !== 'object') return out;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flattenStrings(v, prefix ? `${prefix}.${i}` : String(i), out));
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    flattenStrings(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

export function walkFiles(dir, extensions = ['.json'], skipDirs = ['node_modules', '.next', '.git', 'tmp']) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    if (skipDirs.includes(entry)) continue;
    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) files.push(...walkFiles(full, extensions, skipDirs));
    else if (extensions.some((ext) => entry.endsWith(ext))) files.push(full);
  }
  return files;
}

export function toEnAuthorityPath(arPath) {
  const norm = arPath.split(sep).join('/');
  return norm
    .replace('/locales/ar-001/', '/locales/en/')
    .replace('/content-packs/ar-001/', '/content-packs/en/')
    .replace('/data/help-center/ar-001/', '/data/help-center/en/')
    .replace('/utils/learning-content-ar-001/', '/utils/learning-content-en/')
    .replaceAll('ar-001', 'en');
}

/** Load Group A exact-key brand false positives (30). */
export function loadBrandExactKeyAllowlist() {
  const decisionsPath = join(ROOT, 'artifacts/i18n/ar-001-brand-decisions.json');
  const data = readJSON(decisionsPath);
  if (!data?.group_A_approved_exact_keys) return new Map();
  const map = new Map();
  for (const entry of data.group_A_approved_exact_keys) {
    const file = String(entry.file || '').split(/[/\\]/).join('/');
    const key = String(entry.key || '');
    const reason = entry.reason_approved || entry.reason || 'approved brand false positive';
    map.set(`${file}::${key}`, { file, key, reason });
  }
  return map;
}

export function isAllowlistedExact(allowMap, fileRel, key) {
  const norm = String(fileRel || '').split(/[/\\]/).join('/');
  return allowMap.has(`${norm}::${key}`);
}

/** Leo brand token in English authority (word boundary, case-sensitive Leo). */
export const LEO_EN_PATTERN = /\bLeo(?:\s+Kids)?\b/;

/** Forbidden Arabic brand forms for Leo entity. */
export const FORBIDDEN_LEO_AR = [
  { pattern: /برج\s*الأسد/, reason: 'برج الأسد used for Leo brand/character' },
  { pattern: /أطفال\s*ليو/, reason: 'أطفال ليو transliteration of Leo Kids' },
  { pattern: /ليو\s*كيدز/, reason: 'ليو كيدز transliteration' },
  // Standalone ليو — not اليوم/يوليو/اليومي
  { pattern: /(?<![\u0600-\u06FF])ليو(?![\u0600-\u06FF])/, reason: 'ليو transliteration of Leo — use Latin Leo' },
  { pattern: /(?:^|[^\u0600-\u06FF])ليو(?:$|[^\u0600-\u06FF])/, reason: 'ليو transliteration of Leo — use Latin Leo' },
];

/**
 * Detect standalone ليو that is NOT part of اليوم/يوليو/اليومي.
 * Uses negative lookaround around Arabic letters carefully.
 */
export function containsForbiddenLeoTransliteration(arValue) {
  if (!arValue || typeof arValue !== 'string') return false;
  // Strip known incidental substrings before testing
  const stripped = arValue
    .replace(/اليومي[ةه]?/g, '')
    .replace(/اليوم/g, '')
    .replace(/يوليو/g, '')
    .replace(/يوم(?:ي|ية|اً|ا)?/g, '');
  return /ليو/.test(stripped);
}

export function containsForbiddenLionBrand(arValue) {
  if (!arValue || typeof arValue !== 'string') return false;
  return /برج\s*الأسد/.test(arValue) || /الأسد/.test(arValue);
}

export function arHasLatinLeo(arValue) {
  return typeof arValue === 'string' && /\bLeo\b/.test(arValue);
}

/**
 * Extract template string literals from JS learning-content modules.
 * Returns [{ line, value, quote }]
 */
export function extractJsStringTemplates(source) {
  if (!source) return [];
  const out = [];
  const re = /`([^`]*?)`|'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const value = m[1] ?? m[2] ?? m[3] ?? '';
    if (!value || value.length < 3) continue;
    // Skip imports/paths
    if (/^(?:\.\/|\.\.\/|node:|https?:)/.test(value)) continue;
    if (!/[\u0600-\u06FFA-Za-z]/.test(value)) continue;
    const line = source.slice(0, m.index).split('\n').length;
    out.push({ line, value, index: m.index });
  }
  return out;
}

/**
 * Semantic key classifiers for terminology.
 */
export function classifyKeySemantics(key, enValue = '', fileRel = '') {
  const k = String(key || '');
  const kl = k.toLowerCase();
  const en = String(enValue || '');
  const enl = en.toLowerCase();
  const fl = String(fileRel || '').toLowerCase();

  // Message / email subject
  if (
    /composefieldsubject|emailsubject|messagesubject|mail\.subject|contact\.form\.subject|form\.subjectlabel|subjectline|email.*subject|subject.*email/.test(
      kl
    ) ||
    (/subjectlabel/.test(kl) && /contact|email|message|form/.test(kl + fl))
  ) {
    return 'message_subject';
  }

  // Grammatical subject (English grammar pedagogy)
  if (
    /grammar|tense|verb_form|subject_verb|subject–verb|subject-verb|agreement|be_present|sentence_structure|singular\/plural subjects|matching verb|pronoun.?subject|explicit subject|subject.?pronoun|taxonomy\/english|chain with subject/.test(
      kl + ' ' + enl + ' ' + fl
    ) ||
    /\b(verb form to the subject|subject.?verb agreement|plural subjects|with the subject|pronoun–subject|pronoun-subject)\b/i.test(
      en
    )
  ) {
    return 'grammatical_subject';
  }

  // Discourse "on/in the subject of X" / "on the subject:" (= regarding topic), not academic Subject
  if (
    /\b(?:on|in)\s+the\s+subject\s+of\b/i.test(en) ||
    /\bon the subject:/i.test(en) ||
    /\ba little more on the subject\b/i.test(en)
  ) {
    return 'topic';
  }

  // Physical matter / image subject / geological layer
  if (
    /states?\s+of\s+matter|from the background|geological|rock layer|sediment/.test(enl) ||
    /matter|geology|background|segment|layer/.test(kl) && /coloring|science|matter/.test(fl + kl)
  ) {
    return 'physical_or_image_subject';
  }

  // Score / mark (not school year)
  if (
    /gradePoint|gradescore|scoregrade|mark|accuracy|percent/.test(kl) ||
    (/\bgrade\b/.test(enl) && /\b(score|mark|points?|percent|accuracy)\b/.test(enl))
  ) {
    return 'score_mark';
  }

  // Topic (must not be rewritten as مادة)
  if (/(^|[._-])topics?([._-]|$)/.test(kl) || /\btopics?\b/.test(kl)) {
    // Exception: subject_and_topic compound keys still need subject handling separately
    if (!/\bsubjects?\b/.test(kl) && !/\bsubjects?\b/.test(enl)) {
      return 'topic';
    }
  }

  // Class group
  if (/class[_-]?group|physicalclass|classgroup|classroom_group/.test(kl)) {
    return 'class_group';
  }

  // Academic grade / year level
  if (
    (/(^|[._-])grades?([._-]|$)/.test(kl) || /\bgrades?\b/.test(enl)) &&
    !/score_mark/.test(kl)
  ) {
    if (
      /year level|all grades|choose a grade|back to grades|grade\s*[1-6]|grades and/i.test(en) ||
      /gradefilter|choosegrade|backgrades|colgrade|createStudentGrade|classMgmtGrade|assignCurrentGrade|assignTargetGrade|audienceGrade|detailsFieldGrade|siteFeatures.*phase/i.test(
        kl + k
      ) ||
      (/\bgrades?\b/.test(enl) && !/\b(score|mark|points)\b/.test(enl))
    ) {
      return 'academic_grade';
    }
  }

  // Academic subject
  if (
    (/(^|[._-])subjects?([._-]|$)/.test(kl) || /\bsubjects?\b/.test(enl)) &&
    !/\btopics?\b/.test(kl)
  ) {
    // Positive academic cues
    const academicCue =
      /\b(across|by|in this|each|all|learning|school|class|coverage|permissions?|wide|practice|report|teachers?|focus|breakdown|curriculum|materials?)\b/.test(
        enl
      ) ||
      /subjectpermissions|managesubjects|colsubject|choosesubject|subjectlabel|subjectreport|subjectadd|subjectremove|series\.subjects|subject_questions|subject_wide|cross.subject|subject.level|operatorNoTeaching|quickTeachersDesc|quickClassesDesc/i.test(
        k
      ) ||
      /school|teacher|learning|reports|worksheets|rewards|copilot|ui\.json|portal/i.test(fl);

    if (academicCue) return 'academic_subject';
  }

  return 'other';
}

export function summarizeFindings(findings) {
  const by = { critical: 0, error: 0, warning: 0, info: 0 };
  for (const f of findings) {
    by[f.severity] = (by[f.severity] || 0) + 1;
  }
  return by;
}

export function exitCodeFor(findings, blockSeverities = ['critical', 'error']) {
  return findings.some((f) => blockSeverities.includes(f.severity)) ? 1 : 0;
}

export function printFindings(title, findings) {
  const by = summarizeFindings(findings);
  console.log(`\n=== ${title} ===`);
  console.log(`  Critical: ${by.critical || 0}`);
  console.log(`  Errors:   ${by.error || 0}`);
  console.log(`  Warnings: ${by.warning || 0}`);
  console.log(`  Info:     ${by.info || 0}`);
  const blockers = findings.filter((f) => f.severity === 'critical' || f.severity === 'error');
  for (const f of blockers.slice(0, 80)) {
    console.log(`\n  [${f.severity.toUpperCase()}] ${f.file}${f.key ? ` :: ${f.key}` : ''}`);
    if (f.value) console.log(`    Value:  ${String(f.value).slice(0, 120)}`);
    if (f.enValue) console.log(`    EN:     ${String(f.enValue).slice(0, 120)}`);
    console.log(`    Reason: ${f.reason}`);
    if (f.ruleId) console.log(`    Rule:   ${f.ruleId}`);
  }
  if (blockers.length > 80) console.log(`\n  ... and ${blockers.length - 80} more blockers`);
  return by;
}
