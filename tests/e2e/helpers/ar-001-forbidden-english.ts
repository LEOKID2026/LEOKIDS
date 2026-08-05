/**
 * Shared forbidden-English heuristics for ar-001 runtime crawls.
 * Delegates raw-key + chrome phrase detection to the shared auditor core.
 */
import {
  auditVisibleEnglish,
  FORBIDDEN_CHROME_PHRASES,
} from "./ar-001-english-audit-core.mjs";

/** @deprecated Prefer auditVisibleEnglish; kept for older call sites. */
export const FORBIDDEN_CHROME_SNIPPETS = FORBIDDEN_CHROME_PHRASES;

/**
 * @param {string} text
 * @returns {string[]}
 */
export function findForbiddenChromeSnippets(text) {
  return auditVisibleEnglish(text, { allowEnglishLearningBody: false });
}

/**
 * @param {string} text
 * @returns {boolean}
 */
export function hasHebrewOrIsraeliResidue(text) {
  return /[\u0590-\u05FF]/.test(text) || /\bIsrael\b/i.test(text) || //.test(text);
}

/**
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string>}
 */
export async function getVisibleBodyText(page) {
  return page.locator("body").innerText();
}

/**
 * @param {import('@playwright/test').Page} page
 */
export async function readDocumentLang(page) {
  return page.locator("html").getAttribute("lang");
}
