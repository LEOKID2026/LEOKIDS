/**
 * Deterministic English copy for fast diagnosis (no LLM).
 * Display labels live in content-packs/en/learning/fast-diagnostic-tag-labels.json.
 */

import tagLabelsEn from "../../content-packs/en/learning/fast-diagnostic-tag-labels.json" with { type: "json" };

/** @type {Record<string, string>} */
export const TAG_LABEL_EN = tagLabelsEn.tagLabels;

/** @deprecated alias — values are US English */
export const TAG_LABEL_HE = TAG_LABEL_EN;

/**
 * @param {string[]} suspectedTags
 * @returns {string}
 */
export function tagsSummaryEn(suspectedTags) {
  const labels = suspectedTags
    .map((t) => TAG_LABEL_EN[t] || "")
    .filter(Boolean)
    .slice(0, 3);
  if (!labels.length) return "";
  return labels.join(" · ");
}

/** @deprecated alias */
export const tagsSummaryHe = tagsSummaryEn;
