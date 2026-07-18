/**
 * Per-finding classification for hardcoded UI scan burn-down.
 */
import { isAllowlistedFinding } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";

/** @typedef {typeof FINDING_CLASSIFICATIONS[number]} FindingClassification */

export const FINDING_CLASSIFICATIONS = [
  "user_visible_ui",
  "learning_content",
  "report_copy",
  "game_content",
  "accessibility",
  "api_user_error",
  "developer_only",
  "test_fixture",
  "dead_code",
  "false_positive",
  "technical_identifier",
  "brand",
];

const BRAND_PATTERNS = [/^LEO KIDS$/i, /^Leo Kids$/i];

/**
 * @param {string} file
 * @param {string} text
 * @param {number} line
 * @returns {FindingClassification}
 */
export function classifyFindingKind(file, text, line) {
  const f = file.replace(/\\/g, "/");
  const t = String(text || "").trim();

  if (isAllowlistedFinding(f, line, t)) {
    if (BRAND_PATTERNS.some((re) => re.test(t))) return "brand";
    return "technical_identifier";
  }

  if (BRAND_PATTERNS.some((re) => re.test(t))) return "brand";

  if (
    /\/dev-student-simulator\/|\/learning\/dev\/|pages\/learning\/dev\/|pages\/learning\/dev-/.test(f) ||
    /components\/ai-hybrid-internal-reviewer-panel/.test(f) ||
    /pages\/student\/pwa-debug\.js/.test(f) ||
    /\/mock\/|mock-fixtures|feature-flag/.test(f)
  ) {
    return "developer_only";
  }

  if (/\.test\.|\.spec\.|__tests__|fixtures\/|test-fixture/.test(f)) {
    return "test_fixture";
  }

  if (/parent-report|report-generator|report-language|detailed-parent-report|parent-report-ui-explain/.test(f)) {
    return "report_copy";
  }

  if (/educational-games|solo-games|arcade|offline-games|leo-miners|leo-pizzeria|leo-word/.test(f)) {
    return "game_content";
  }

  if (/diagnostic-|taxonomy-|probe-map|learning-patterns|math-animations|diagnostic-labels/.test(f)) {
    return "learning_content";
  }

  if (/hebrew-display-labels|apiError|validation\.json|api_user/.test(f)) {
    return "api_user_error";
  }

  if (/aria-|a11y|accessibility/.test(f)) {
    return "accessibility";
  }

  if (/learning-book|english-page-skill/.test(f)) {
    return "learning_content";
  }

  if (/reward-card|rewards\//.test(f)) {
    return "user_visible_ui";
  }

  if (/pages\/|components\//.test(f) && !/\.server\./.test(f)) {
    return "user_visible_ui";
  }

  if (/utils\/|lib\//.test(f)) {
    if (/^[A-Z][a-z]+(?:[A-Z][a-z0-9]+)+$/.test(t) && t.length < 24) {
      return "technical_identifier";
    }
    if (t.length <= 3 || /^[A-Z0-9_]+$/.test(t)) {
      return "technical_identifier";
    }
  }

  return "user_visible_ui";
}

/** Classifications excluded from real user/content debt. */
export const NON_DEBT_CLASSIFICATIONS = new Set([
  "developer_only",
  "test_fixture",
  "dead_code",
  "false_positive",
  "technical_identifier",
  "brand",
]);

/** Classifications counted as content debt (not generic UI chrome). */
export const CONTENT_DEBT_CLASSIFICATIONS = new Set([
  "learning_content",
  "report_copy",
  "game_content",
]);

/**
 * @param {FindingClassification} kind
 */
export function isRealDebtClassification(kind) {
  return !NON_DEBT_CLASSIFICATIONS.has(kind);
}

/**
 * @param {{ file: string, line: number, text: string, kind?: string }[]} findings
 */
export function summarizeClassifiedFindings(findings) {
  /** @type {Record<string, number>} */
  const byKind = {};
  for (const f of findings) {
    const kind = f.kind || classifyFindingKind(f.file, f.text, f.line);
    byKind[kind] = (byKind[kind] || 0) + 1;
  }

  const scannerTotal = findings.length;
  const authorizedTechnicalExceptions = findings.filter((f) => {
    const kind = f.kind || classifyFindingKind(f.file, f.text, f.line);
    return kind === "brand" || (kind === "technical_identifier" && isAllowlistedFinding(f.file, f.line, f.text));
  }).length;

  const realDebt = findings.filter((f) => {
    const kind = f.kind || classifyFindingKind(f.file, f.text, f.line);
    return isRealDebtClassification(kind);
  });

  const realUserVisibleDebt = realDebt.filter((f) => {
    const kind = f.kind || classifyFindingKind(f.file, f.text, f.line);
    return ["user_visible_ui", "accessibility", "api_user_error"].includes(kind);
  }).length;

  const realContentDebt = realDebt.filter((f) => {
    const kind = f.kind || classifyFindingKind(f.file, f.text, f.line);
    return CONTENT_DEBT_CLASSIFICATIONS.has(kind);
  }).length;

  const realTotalDebt = realDebt.length;
  const excludedFromDebt = scannerTotal - realTotalDebt;

  return {
    scannerTotal,
    authorizedTechnicalExceptions,
    /** Total real debt (UI + content). Same value used by debt test. */
    realTotalDebt,
    /** @deprecated Legacy alias for realTotalDebt — NOT excluded-from-debt count. */
    unauthorizedUserVisible: realTotalDebt,
    realUserVisibleDebt,
    realContentDebt,
    excludedFromDebt,
    developerOnly: byKind.developer_only || 0,
    falsePositives: byKind.false_positive || 0,
    technicalExceptions: (byKind.technical_identifier || 0) + (byKind.brand || 0),
    byKind,
  };
}
