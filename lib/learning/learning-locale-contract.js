/**
 * Learning content locale contract — taxonomy, diagnostics, animations, pattern copy.
 */
import { loadContentPack } from "../content/locale.server.js";
import { resolveContentLocale } from "../content/locale.js";

/**
 * @param {string|null|undefined} contentLocale
 * @param {...string} segments
 */
export function loadLearningContentPack(contentLocale, ...segments) {
  const locale = resolveContentLocale({ contentLocale });
  return loadContentPack(locale, "learning", ...segments);
}

/**
 * @param {string} subject
 * @param {string|null|undefined} contentLocale
 */
export function loadTaxonomyBundle(subject, contentLocale) {
  const locale = resolveContentLocale({ contentLocale });
  const structure = loadContentPack(locale, "learning", "taxonomy", `${subject}.structure.json`);
  const content = loadContentPack(locale, "learning", "taxonomy", `${subject}.content.json`);
  return { structure, content };
}

/**
 * @param {string|null|undefined} contentLocale
 */
export function loadFastDiagnosticProbes(contentLocale) {
  return loadLearningContentPack(contentLocale, "fast-diagnostic-probes.json");
}

/**
 * @param {string|null|undefined} contentLocale
 */
export function loadMathAnimationTitles(contentLocale) {
  return loadLearningContentPack(contentLocale, "math-animation-titles.json");
}
