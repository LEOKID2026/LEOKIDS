/**
 * Child-facing English speech script for learning book sections (browser TTS).
 */

import { flattenBookSectionVisibleLines } from "../book-visible-text-render.js";

const TECHNICAL_LINE =
  /(?:learning_page_id|skill_id|approval_status|page_type|age_band|docs\/|data\/|\.md\b|\.json\b)/i;

const SKIP_LINE_PREFIX = /^(?:Hint:|Note:|Source references)/i;

/**
 * @param {{
 *   sections?: { number: number, title?: string, body: string }[],
 * }} pageData
 * @param {number} sectionNumber 1-based section.number
 * @returns {string}
 */
export function prepareGlobalBookSectionSpeechText(pageData, sectionNumber) {
  const sections = Array.isArray(pageData?.sections) ? pageData.sections : [];
  const sec = sections.find((s) => s.number === sectionNumber);
  if (!sec?.body) return "";

  const { lines } = flattenBookSectionVisibleLines(sec.body);
  /** @type {string[]} */
  const spoken = [];

  for (const row of lines) {
    const t = String(row.rendered || "").trim();
    if (!t || TECHNICAL_LINE.test(t) || SKIP_LINE_PREFIX.test(t)) continue;
    spoken.push(t);
  }

  return spoken.join(". ").replace(/\s+/g, " ").trim();
}
