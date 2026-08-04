/**
 * Context-aware forbidden English detection for ar-001 runtime audits.
 * Core logic lives in ar-001-english-audit-core.mjs (shared with unit tests).
 */
export {
  FORBIDDEN_CHROME_PHRASES,
  auditVisibleEnglish,
  assertArabicDocumentShell,
  hasArabicContent,
  stripLocalePickerFromText,
  assertHttpOk,
  AR_001_HELP_ARTICLE_PATHS,
  AR_001_PREFIX,
  AR_001_LEARNING_SUBJECT_PATHS,
} from "./ar-001-english-audit-core.mjs";

export type EnglishAuditOptions = {
  /** Page allows English-learning body content (e.g. /learning/english). */
  allowEnglishLearningBody?: boolean;
  /** Skip phrase scan (body-only heuristic). */
  skipPhrases?: boolean;
};

export async function collectAuditableBodyText(page: import("@playwright/test").Page): Promise<string> {
  return page.evaluate(() => {
    const clone = document.body.cloneNode(true) as HTMLElement;
    clone
      .querySelectorAll(
        'select, [data-language-switcher="hud"] ul, script, style, noscript, [aria-hidden="true"]',
      )
      .forEach((el) => el.remove());
    return clone.innerText || "";
  });
}
