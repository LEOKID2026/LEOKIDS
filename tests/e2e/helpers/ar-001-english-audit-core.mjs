/**
 * Context-aware forbidden English detection for ar-001 runtime audits (JS core).
 * Consumed by unit tests and re-exported by the TS helper for Playwright.
 */

const BRAND_ALLOW = /\b(Leo Kids|LEO KIDS|LEO K|LEO)\b/i;
const EMAIL_ALLOW = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
const URL_ALLOW = /https?:\/\/[^\s]+/i;
const FILE_EXT_ALLOW = /\.(pdf|png|jpe?g|gif|webp|mp3|mp4|json|js|css)\b/i;
const HEBREW = /[\u0590-\u05FF]/;
const ARABIC = /[\u0600-\u06FF]/;

/** Dotted i18n paths visible in UI (missing translation fallback). */
const RAW_DOTTED_KEY = /\b[a-z][a-z0-9]*(?:\.[a-z][a-z0-9_]*){1,}\b/g;
/** snake_case keys with 2+ underscores (e.g. waiting_for_the_teacher). */
const RAW_SNAKE_KEY = /\b[a-z][a-z0-9]*(?:_[a-z0-9]+){2,}\b/g;

/** High-signal English chrome phrases — immediate failure. */
export const FORBIDDEN_CHROME_PHRASES = [
  "Back to dashboard",
  "School management",
  "Last updated:",
  "Additional documents",
  "Terms, privacy & accessibility",
  "Terms, privacy, and accessibility",
  "Practice areas and parent guides",
  "Want to explore Leo Kids practice areas?",
  "Parent login / sign up",
  "Explore the parent portal",
  "Home practice routine",
  "Loading…",
  "Loading...",
  "Contact:",
  "Questions:",
  "Full document:",
  "Math at home",
  "Reading at home",
  "Ready to start?",
  "Open a parent account",
  "Waiting for the teacher",
  "Help center",
  "Updated:",
  "Sign in",
  "Log in",
  "Log out",
  "Try again",
  "Something went wrong",
  "Page not found",
  "Create account",
  "Sign up",
  "Back home",
  "Could not start",
  "Next question",
  "Submit answer",
  "Type your answer",
];

/**
 * Split visible text into candidate English tokens (words with Latin letters).
 * @param {string} text
 * @returns {string[]}
 */
function extractLatinWords(text) {
  return text.match(/\b[A-Za-z][A-Za-z'’\-]*\b/g) || [];
}

/**
 * @param {string} token
 * @param {string} context
 */
function isAllowedToken(token, context) {
  if (!token || token.length < 2) return true;
  if (BRAND_ALLOW.test(token)) return true;
  if (/^(KIDS|PIN|PDF|OK|ID|URL|HTML|CSS|API|HUD|ar)$/i.test(token)) return true;
  if (/^g[1-6]$/i.test(token)) return true;
  if (/^Grade\s?\d$/i.test(token)) return true;
  if (EMAIL_ALLOW.test(context) && context.includes("@")) return true;
  if (URL_ALLOW.test(context)) return true;
  if (FILE_EXT_ALLOW.test(token)) return true;
  if (/^(Noam|Maya|Ari|Dan|Michal|Liron|iPhone|iPad|Android|Chrome|Safari|Windows)$/i.test(token)) {
    return true;
  }
  return false;
}

/**
 * @param {string} text
 * @returns {string[]}
 */
function collectRawKeyFindings(text) {
  const findings = [];
  const scrubbed = text.replace(URL_ALLOW, " ").replace(EMAIL_ALLOW, " ");

  for (const match of scrubbed.match(RAW_DOTTED_KEY) || []) {
    if (/^(leo\.kids)$/i.test(match)) continue;
    findings.push(`rawKey:${match}`);
    if (findings.length > 8) break;
  }
  for (const match of scrubbed.match(RAW_SNAKE_KEY) || []) {
    if (/^(en_us|ar_001|pt_br|zh_cn|es_419)$/i.test(match)) continue;
    findings.push(`rawKey:${match}`);
    if (findings.length > 12) break;
  }
  return findings;
}

/**
 * @param {string} text
 * @param {{ allowEnglishLearningBody?: boolean, skipPhrases?: boolean }} [opts]
 * @returns {string[]} forbidden English findings (empty = pass)
 */
export function auditVisibleEnglish(text, opts = {}) {
  const findings = [];

  if (HEBREW.test(text)) {
    findings.push("Hebrew residue detected");
  }
  if (/\bIsrael\b/i.test(text) || /ישראל/.test(text)) {
    if (!opts.allowEnglishLearningBody) {
      findings.push("Israeli residue detected");
    }
  }

  findings.push(...collectRawKeyFindings(text));

  if (!opts.skipPhrases) {
    for (const phrase of FORBIDDEN_CHROME_PHRASES) {
      if (text.includes(phrase)) findings.push(`phrase:${phrase}`);
    }
  }

  if (!opts.allowEnglishLearningBody) {
    const words = extractLatinWords(text);
    for (const word of words) {
      if (isAllowedToken(word, text)) continue;
      if (word.length <= 3 && /^[A-Z]+$/.test(word)) continue;
      findings.push(`word:${word}`);
      if (findings.length > 20) break;
    }
  }

  return [...new Set(findings)];
}

/**
 * @param {string|null} lang
 * @param {string|null} dir
 * @returns {string[]}
 */
export function assertArabicDocumentShell(lang, dir) {
  const issues = [];
  if (lang !== "ar" && lang !== "ar-001") issues.push(`html lang=${lang}`);
  if (dir !== "rtl") issues.push(`html dir=${dir}`);
  return issues;
}

/**
 * @param {string} text
 */
export function hasArabicContent(text) {
  return ARABIC.test(text);
}

/**
 * @param {string} text
 */
export function stripLocalePickerFromText(text) {
  return text;
}

/**
 * Assert HTTP success — 404/3xx/5xx must never pass as a successful audit surface.
 * @param {number|null|undefined} status
 * @param {string} url
 */
export function assertHttpOk(status, url) {
  const code = status ?? 0;
  if (code < 200 || code >= 400) {
    throw new Error(`${url} HTTP ${code || "navigation-failed"} (404/error must not pass)`);
  }
}

/** All ar-001 help article paths (40). */
export const AR_001_HELP_ARTICLE_PATHS = [
  "/help/parents/welcome-and-overview",
  "/help/parents/create-parent-account",
  "/help/parents/parent-dashboard-tour",
  "/help/parents/add-students",
  "/help/parents/student-pin-and-credentials",
  "/help/parents/edit-or-delete-student",
  "/help/parents/how-to-read-report",
  "/help/parents/parent-copilot",
  "/help/parents/monthly-rewards",
  "/help/parents/install-as-app",
  "/help/parents/mobile-and-offline",
  "/help/parents/troubleshooting-login",
  "/help/parents/privacy-and-data",
  "/help/students/student-login",
  "/help/students/student-home-tour",
  "/help/students/choose-subject-and-grade",
  "/help/students/answering-questions",
  "/help/students/hints-and-explanations",
  "/help/students/daily-missions",
  "/help/students/monthly-persistence",
  "/help/students/coins-and-arcade",
  "/help/students/avatar-and-profile",
  "/help/students/offline-games",
  "/help/students/tips-for-good-practice",
  "/help/parent-report/report-overview",
  "/help/parent-report/summary-card",
  "/help/parent-report/data-presence",
  "/help/parent-report/trends-and-confidence",
  "/help/parent-report/strengths-and-improvements",
  "/help/parent-report/topics-and-buckets",
  "/help/parent-report/subjects-overview",
  "/help/parent-report/recommendations",
  "/help/parent-report/challenges-section",
  "/help/parent-report/detailed-report",
  "/help/parent-report/printing-and-pdf",
  "/help/parent-report/understanding-the-disclaimer",
  "/help/subjects/math",
  "/help/subjects/geometry",
  "/help/subjects/english",
  "/help/subjects/science",
];

export const AR_001_PREFIX = "/ar-001";

export const AR_001_LEARNING_SUBJECT_PATHS = [
  "/student/learning/math-master",
  "/student/learning/geometry-master",
  "/student/learning/science-master",
  "/student/learning/english-master",
];
