/**
 * Registered content-pack catalog (client + server safe).
 *
 * Locale packs are registered here. Consumers must resolve through
 * `resolveRegisteredContentPack` / `loadContentPack` — do not import
 * `content-packs/{locale}/...` from feature modules.
 *
 * Platform UI chrome lives in locales/{locale}/platform.json — there is no
 * content-packs/{locale}/platform/ tree. Burn-down / learning / reports /
 * games / books / rewards packs are registered below; filesystem packs under
 * content-packs/{locale}/ still resolve via loadContentPack for paths not
 * listed here.
 *
 * Fallback walks `getContentFallbackChain` inside the resolver.
 */

import booksUiEn from "../../content-packs/en/books/ui.json" with { type: "json" };
import booksRegistryTitlesEn from "../../content-packs/en/books/registry-titles.json" with { type: "json" };
import booksEnglishPageSkillsEn from "../../content-packs/en/books/english-page-skills.json" with { type: "json" };
import demoUiEn from "../../content-packs/en/demo/ui.json" with { type: "json" };
import gamesBurnDownIndexEn from "../../content-packs/en/games/burn-down-index.json" with { type: "json" };
import gamesUiPackIndexEn from "../../content-packs/en/games/ui-pack-index.json" with { type: "json" };
import globalBurnDownIndexEn from "../../content-packs/en/global-burn-down/burn-down-index.json" with { type: "json" };
import learningBurnDownIndexEn from "../../content-packs/en/learning/burn-down-index.json" with { type: "json" };
import learningDiagnosticDefaultsEn from "../../content-packs/en/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };
import learningDiagnosticFrameworkEn from "../../content-packs/en/learning/diagnostic-framework-v1.json" with { type: "json" };
import learningDiagnosticLabelsEn from "../../content-packs/en/learning/diagnostic-labels.json" with { type: "json" };
import learningExamplePatternPayloadEn from "../../content-packs/en/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import learningFastDiagnosticProbesEn from "../../content-packs/en/learning/fast-diagnostic-probes.json" with { type: "json" };
import learningFastDiagnosticTagLabelsEn from "../../content-packs/en/learning/fast-diagnostic-tag-labels.json" with { type: "json" };
import learningGeometryContentEn from "../../content-packs/en/learning/geometry-content.json" with { type: "json" };
import learningPatternsCopyEn from "../../content-packs/en/learning/learning-patterns-copy.json" with { type: "json" };
import learningMathAnimationTitlesEn from "../../content-packs/en/learning/math-animation-titles.json" with { type: "json" };
import taxonomyEnglishStructureEn from "../../content-packs/en/learning/taxonomy/english.structure.json" with { type: "json" };
import taxonomyEnglishContentEn from "../../content-packs/en/learning/taxonomy/english.content.json" with { type: "json" };
import taxonomyGeometryStructureEn from "../../content-packs/en/learning/taxonomy/geometry.structure.json" with { type: "json" };
import taxonomyGeometryContentEn from "../../content-packs/en/learning/taxonomy/geometry.content.json" with { type: "json" };
import taxonomyMathStructureEn from "../../content-packs/en/learning/taxonomy/math.structure.json" with { type: "json" };
import taxonomyMathContentEn from "../../content-packs/en/learning/taxonomy/math.content.json" with { type: "json" };
import taxonomyScienceStructureEn from "../../content-packs/en/learning/taxonomy/science.structure.json" with { type: "json" };
import taxonomyScienceContentEn from "../../content-packs/en/learning/taxonomy/science.content.json" with { type: "json" };
import reportsBurnDownIndexEn from "../../content-packs/en/reports/burn-down-index.json" with { type: "json" };
import rewardsCardCatalogEn from "../../content-packs/en/rewards/card-catalog.json" with { type: "json" };
import rewardsUiEn from "../../content-packs/en/rewards/ui.json" with { type: "json" };

import booksUiEs419 from "../../content-packs/es-419/books/ui.json" with { type: "json" };
import booksRegistryTitlesEs419 from "../../content-packs/es-419/books/registry-titles.json" with { type: "json" };
import booksEnglishPageSkillsEs419 from "../../content-packs/es-419/books/english-page-skills.json" with { type: "json" };
import demoUiEs419 from "../../content-packs/es-419/demo/ui.json" with { type: "json" };
import gamesBurnDownIndexEs419 from "../../content-packs/es-419/games/burn-down-index.json" with { type: "json" };
import gamesUiPackIndexEs419 from "../../content-packs/es-419/games/ui-pack-index.json" with { type: "json" };
import globalBurnDownIndexEs419 from "../../content-packs/es-419/global-burn-down/burn-down-index.json" with { type: "json" };
import learningBurnDownIndexEs419 from "../../content-packs/es-419/learning/burn-down-index.json" with { type: "json" };
import learningDiagnosticDefaultsEs419 from "../../content-packs/es-419/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };
import learningDiagnosticFrameworkEs419 from "../../content-packs/es-419/learning/diagnostic-framework-v1.json" with { type: "json" };
import learningDiagnosticLabelsEs419 from "../../content-packs/es-419/learning/diagnostic-labels.json" with { type: "json" };
import learningExamplePatternPayloadEs419 from "../../content-packs/es-419/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import learningFastDiagnosticProbesEs419 from "../../content-packs/es-419/learning/fast-diagnostic-probes.json" with { type: "json" };
import learningFastDiagnosticTagLabelsEs419 from "../../content-packs/es-419/learning/fast-diagnostic-tag-labels.json" with { type: "json" };
import learningGeometryContentEs419 from "../../content-packs/es-419/learning/geometry-content.json" with { type: "json" };
import learningPatternsCopyEs419 from "../../content-packs/es-419/learning/learning-patterns-copy.json" with { type: "json" };
import learningMathAnimationTitlesEs419 from "../../content-packs/es-419/learning/math-animation-titles.json" with { type: "json" };
import taxonomyEnglishStructureEs419 from "../../content-packs/es-419/learning/taxonomy/english.structure.json" with { type: "json" };
import taxonomyEnglishContentEs419 from "../../content-packs/es-419/learning/taxonomy/english.content.json" with { type: "json" };
import taxonomyGeometryStructureEs419 from "../../content-packs/es-419/learning/taxonomy/geometry.structure.json" with { type: "json" };
import taxonomyGeometryContentEs419 from "../../content-packs/es-419/learning/taxonomy/geometry.content.json" with { type: "json" };
import taxonomyMathStructureEs419 from "../../content-packs/es-419/learning/taxonomy/math.structure.json" with { type: "json" };
import taxonomyMathContentEs419 from "../../content-packs/es-419/learning/taxonomy/math.content.json" with { type: "json" };
import taxonomyScienceStructureEs419 from "../../content-packs/es-419/learning/taxonomy/science.structure.json" with { type: "json" };
import taxonomyScienceContentEs419 from "../../content-packs/es-419/learning/taxonomy/science.content.json" with { type: "json" };
import reportsBurnDownIndexEs419 from "../../content-packs/es-419/reports/burn-down-index.json" with { type: "json" };
import rewardsCardCatalogEs419 from "../../content-packs/es-419/rewards/card-catalog.json" with { type: "json" };
import rewardsUiEs419 from "../../content-packs/es-419/rewards/ui.json" with { type: "json" };

/**
 * @typedef {Record<string, unknown>} ContentPackJson
 * @typedef {Record<string, ContentPackJson>} LocalePackMap
 */

/**
 * Top-level map is mutable so tests / future locales can register packs.
 * Per-locale maps for shipping locales are frozen.
 * @type {Record<string, LocalePackMap>}
 */
export const CONTENT_PACK_CATALOG = {
  en: Object.freeze({
    "books/ui.json": booksUiEn,
    "books/registry-titles.json": booksRegistryTitlesEn,
    "books/english-page-skills.json": booksEnglishPageSkillsEn,
    "demo/ui.json": demoUiEn,
    "games/burn-down-index.json": gamesBurnDownIndexEn,
    "games/ui-pack-index.json": gamesUiPackIndexEn,
    "global-burn-down/burn-down-index.json": globalBurnDownIndexEn,
    "learning/burn-down-index.json": learningBurnDownIndexEn,
    "learning/diagnostic-engine-v2-defaults.json": learningDiagnosticDefaultsEn,
    "learning/diagnostic-framework-v1.json": learningDiagnosticFrameworkEn,
    "learning/diagnostic-labels.json": learningDiagnosticLabelsEn,
    "learning/example-pattern-diagnostics-payload.json": learningExamplePatternPayloadEn,
    "learning/fast-diagnostic-probes.json": learningFastDiagnosticProbesEn,
    "learning/fast-diagnostic-tag-labels.json": learningFastDiagnosticTagLabelsEn,
    "learning/geometry-content.json": learningGeometryContentEn,
    "learning/learning-patterns-copy.json": learningPatternsCopyEn,
    "learning/math-animation-titles.json": learningMathAnimationTitlesEn,
    "learning/taxonomy/english.structure.json": taxonomyEnglishStructureEn,
    "learning/taxonomy/english.content.json": taxonomyEnglishContentEn,
    "learning/taxonomy/geometry.structure.json": taxonomyGeometryStructureEn,
    "learning/taxonomy/geometry.content.json": taxonomyGeometryContentEn,
    "learning/taxonomy/math.structure.json": taxonomyMathStructureEn,
    "learning/taxonomy/math.content.json": taxonomyMathContentEn,
    "learning/taxonomy/science.structure.json": taxonomyScienceStructureEn,
    "learning/taxonomy/science.content.json": taxonomyScienceContentEn,
    "reports/burn-down-index.json": reportsBurnDownIndexEn,
    "rewards/card-catalog.json": rewardsCardCatalogEn,
    "rewards/ui.json": rewardsUiEn,
  }),
  // Platform chrome: locales/*/platform.json (no content-packs/*/platform/).
  "es-419": Object.freeze({
    "books/ui.json": booksUiEs419,
    "books/registry-titles.json": booksRegistryTitlesEs419,
    "books/english-page-skills.json": booksEnglishPageSkillsEs419,
    "demo/ui.json": demoUiEs419,
    "games/burn-down-index.json": gamesBurnDownIndexEs419,
    "games/ui-pack-index.json": gamesUiPackIndexEs419,
    "global-burn-down/burn-down-index.json": globalBurnDownIndexEs419,
    "learning/burn-down-index.json": learningBurnDownIndexEs419,
    "learning/diagnostic-engine-v2-defaults.json": learningDiagnosticDefaultsEs419,
    "learning/diagnostic-framework-v1.json": learningDiagnosticFrameworkEs419,
    "learning/diagnostic-labels.json": learningDiagnosticLabelsEs419,
    "learning/example-pattern-diagnostics-payload.json": learningExamplePatternPayloadEs419,
    "learning/fast-diagnostic-probes.json": learningFastDiagnosticProbesEs419,
    "learning/fast-diagnostic-tag-labels.json": learningFastDiagnosticTagLabelsEs419,
    "learning/geometry-content.json": learningGeometryContentEs419,
    "learning/learning-patterns-copy.json": learningPatternsCopyEs419,
    "learning/math-animation-titles.json": learningMathAnimationTitlesEs419,
    "learning/taxonomy/english.structure.json": taxonomyEnglishStructureEs419,
    "learning/taxonomy/english.content.json": taxonomyEnglishContentEs419,
    "learning/taxonomy/geometry.structure.json": taxonomyGeometryStructureEs419,
    "learning/taxonomy/geometry.content.json": taxonomyGeometryContentEs419,
    "learning/taxonomy/math.structure.json": taxonomyMathStructureEs419,
    "learning/taxonomy/math.content.json": taxonomyMathContentEs419,
    "learning/taxonomy/science.structure.json": taxonomyScienceStructureEs419,
    "learning/taxonomy/science.content.json": taxonomyScienceContentEs419,
    "reports/burn-down-index.json": reportsBurnDownIndexEs419,
    "rewards/card-catalog.json": rewardsCardCatalogEs419,
    "rewards/ui.json": rewardsUiEs419,
  }),
};

/**
 * Register additional locale packs (tests / future locales).
 * @param {string} localeId
 * @param {LocalePackMap} packs
 */
export function registerContentPackLocale(localeId, packs) {
  const id = String(localeId || "").trim();
  if (!id) return;
  CONTENT_PACK_CATALOG[id] = Object.freeze({ ...(CONTENT_PACK_CATALOG[id] || {}), ...packs });
}

/**
 * @param {string} localeId
 * @param {string} relativePath e.g. "learning/burn-down-index.json"
 */
export function getCatalogPackExact(localeId, relativePath) {
  const loc = String(localeId || "").trim();
  const key = String(relativePath || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");
  if (!loc || !key) return null;
  const pack = CONTENT_PACK_CATALOG[loc]?.[key];
  return pack == null ? null : pack;
}
