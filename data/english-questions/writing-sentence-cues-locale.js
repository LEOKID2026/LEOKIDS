import { WRITING_SENTENCE_CUES_ES_419 } from "./writing-sentence-cues/es-419.js";

function isSpanish(locale) {
  const tag = String(locale || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  return tag === "es" || tag.startsWith("es-") || tag === "es419";
}

/**
 * @param {string} sentenceEn stable English sentence ID
 * @param {string} fallbackCue English cue
 * @param {{ instructionLocale?: string|null }} [opts]
 */
export function resolveWritingSentenceCue(sentenceEn, fallbackCue, opts = {}) {
  const en = String(sentenceEn || "").trim();
  const fallback = String(fallbackCue || "").trim();
  if (isSpanish(opts.instructionLocale)) {
    const es = WRITING_SENTENCE_CUES_ES_419[en];
    if (typeof es === "string" && es.trim()) return es.trim();
  }
  return fallback || en;
}
