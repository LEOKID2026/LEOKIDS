/**
 * Global compatibility shim for legacy `*He` import paths.
 * Authority for Global parent-facing labels is `diagnostic-labels.js` (content-pack EN).
 * Hebrew prose is no longer the runtime source of truth on the Global product.
 */

import {
  GENERIC_WEAKNESS_EN,
  GENERIC_POINT_EN,
  GENERIC_REINFORCE_EN,
  PARENT_TOPIC_FALLBACK_EN,
  englishLabelFromSlug,
  humanizeTopicKey,
  topicBucketLabel,
  weaknessLabelEn,
  sessionRowLabelEn,
  parentFacingWeaknessPracticePhraseEn,
} from "./diagnostic-labels.js";

export const GENERIC_WEAKNESS_HE = GENERIC_WEAKNESS_EN;
export const GENERIC_POINT_HE = GENERIC_POINT_EN;
export const GENERIC_REINFORCE_HE = GENERIC_REINFORCE_EN;
export const PARENT_TOPIC_FALLBACK_HE = PARENT_TOPIC_FALLBACK_EN;

/** @deprecated Use englishLabelFromSlug — name retained for call-site compatibility. */
export function hebrewFromEnglishSlug(slug) {
  return englishLabelFromSlug(slug) || humanizeTopicKey(slug);
}

export function englishWeaknessFallbackHe(topicKey) {
  const label = topicBucketLabel("english", topicKey);
  if (label && label !== topicKey) return `In ${label}`;
  return "In practice topics";
}

export function topicBucketLabelHe(subjectId, bucketKey) {
  return topicBucketLabel(subjectId, bucketKey);
}

export function weaknessLabelHe(subjectId, sampleEv) {
  return weaknessLabelEn(subjectId, sampleEv);
}

export function sessionRowLabelHe(subjectId, row) {
  return sessionRowLabelEn(subjectId, row);
}

export function parentFacingWeaknessPracticePhraseHe(labelHe) {
  return parentFacingWeaknessPracticePhraseEn(labelHe);
}

export function rewriteTaxonomySubstringsOnlyHe(raw) {
  return englishLabelFromSlug(raw) || humanizeTopicKey(raw) || String(raw || "");
}

export function rewriteEngineTaxonomySnippetForParentHe(raw) {
  return rewriteTaxonomySubstringsOnlyHe(raw);
}

/** No-op logs retained for API compatibility. */
export function getBlockedTopicLabelLog() {
  return [];
}

export function clearBlockedTopicLabelLog() {}
