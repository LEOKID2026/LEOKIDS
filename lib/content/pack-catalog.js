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

// Spain (es-ES) sparse overlays — registered for catalog deep-merge via resolveRegisteredContentPack.
import booksUiEsEs from "../../content-packs/es-ES/books/ui.json" with { type: "json" };
import booksRegistryTitlesEsEs from "../../content-packs/es-ES/books/registry-titles.json" with { type: "json" };
import demoUiEsEs from "../../content-packs/es-ES/demo/ui.json" with { type: "json" };
import rewardsUiEsEs from "../../content-packs/es-ES/rewards/ui.json" with { type: "json" };
import learningDiagnosticLabelsEsEs from "../../content-packs/es-ES/learning/diagnostic-labels.json" with { type: "json" };
import reportsBurnDownDetailedSurfaceEsEs from "../../content-packs/es-ES/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import reportsBurnDownGradeAwareOutOfGradeGuardsEsEs from "../../content-packs/es-ES/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__out-of-grade-guards.json" with { type: "json" };
import reportsBurnDownGradeAwareWeeklyFocusEsEs from "../../content-packs/es-ES/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__weekly-focus.json" with { type: "json" };
import reportsBurnDownGradeAwarePracticePromptsEsEs from "../../content-packs/es-ES/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__practice-prompts.json" with { type: "json" };
import reportsBurnDownGradeAwareCourseLabelsEsEs from "../../content-packs/es-ES/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__course-labels.json" with { type: "json" };
import reportsBurnDownOutOfGradeTransparencyEsEs from "../../content-packs/es-ES/reports/burn-down/utils__parent-report-out-of-grade-transparency.json" with { type: "json" };
import reportsBurnDownParentTopicTierEsEs from "../../content-packs/es-ES/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import learningBurnDownParentCurriculumEsEs from "../../content-packs/es-ES/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import learningBurnDownEnglishMasterEsEs from "../../content-packs/es-ES/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import learningBurnDownTopicNextStepEsEs from "../../content-packs/es-ES/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import learningBurnDownCurriculumMapEsEs from "../../content-packs/es-ES/learning/burn-down/utils__curriculum-audit__israeli-primary-curriculum-map.json" with { type: "json" };
import learningBurnDownCurriculumSpineEsEs from "../../content-packs/es-ES/learning/burn-down/utils__curriculum-audit__official-primary-curriculum-spine.json" with { type: "json" };
import gamesBurnDownLeoWordTrainEsEs from "../../content-packs/es-ES/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import gamesBurnDownLeoLabEsEs from "../../content-packs/es-ES/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import gamesBurnDownLeoWordDetectiveEsEs from "../../content-packs/es-ES/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import globalBurnDownPromoMobileEsEs from "../../content-packs/es-ES/global-burn-down/components__promo__PromoMobileCompareVideo.json" with { type: "json" };
import globalBurnDownSchoolDrillDownEsEs from "../../content-packs/es-ES/global-burn-down/components__school-portal__SchoolDrillDown.json" with { type: "json" };
import globalBurnDownSubjectAccessEsEs from "../../content-packs/es-ES/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import globalBurnDownPublicPageSeoEsEs from "../../content-packs/es-ES/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import globalBurnDownTeacherClassGradeEsEs from "../../content-packs/es-ES/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import globalBurnDownTeacherDashboardEsEs from "../../content-packs/es-ES/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import globalBurnDownWorksheetMetaEsEs from "../../content-packs/es-ES/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import globalBurnDownWorksheetPayloadEsEs from "../../content-packs/es-ES/global-burn-down/lib__worksheets__worksheet-payload-build.server.json" with { type: "json" };
import globalBurnDownWorksheetUiEsEs from "../../content-packs/es-ES/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import globalBurnDownCreateStudentEsEs from "../../content-packs/es-ES/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import globalBurnDownSchoolClassesEsEs from "../../content-packs/es-ES/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import globalBurnDownSchoolStudentsEsEs from "../../content-packs/es-ES/global-burn-down/pages__school__students__index.json" with { type: "json" };
import globalBurnDownStudentWorksheetEsEs from "../../content-packs/es-ES/global-burn-down/pages__student__worksheet__[worksheetId].json" with { type: "json" };
import globalBurnDownTeacherClassGradeStudentEsEs from "../../content-packs/es-ES/global-burn-down/pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import globalBurnDownTeacherWorksheetGradeEsEs from "../../content-packs/es-ES/global-burn-down/pages__teacher__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import globalBurnDownTeacherWorksheetReportEsEs from "../../content-packs/es-ES/global-burn-down/pages__teacher__worksheets__[worksheetId]__report.json" with { type: "json" };
import globalBurnDownAppEsEs from "../../content-packs/es-ES/global-burn-down/pages___app.json" with { type: "json" };

/**
 * Extract string copy map from a burn-down leaf pack.
 * @param {{ copy?: Record<string, string> } | Record<string, string> | null | undefined} pack
 * @returns {Record<string, string>}
 */
function burnDownLeafCopy(pack) {
  if (pack && typeof pack === "object" && "copy" in pack && pack.copy && typeof pack.copy === "object") {
    return /** @type {Record<string, string>} */ (pack.copy);
  }
  return /** @type {Record<string, string>} */ (pack || {});
}

/**
 * Compose sparse burn-down-index overlay from leaf packs shaped as `{ copy: { key: value } }`.
 * Slug = leaf filename without `.json` (matches build-*-burn-down-index scripts).
 * A slug may map to one leaf or an array of semantic fragment leaves merged in order.
 * @param {Record<string, { copy?: Record<string, string> } | Record<string, string> | Array<{ copy?: Record<string, string> } | Record<string, string>>>} leaves
 * @returns {Readonly<Record<string, Record<string, string>>>}
 */
function composeBurnDownIndexOverlay(leaves) {
  /** @type {Record<string, Record<string, string>>} */
  const out = {};
  for (const [slug, packOrPacks] of Object.entries(leaves)) {
    const packs = Array.isArray(packOrPacks) ? packOrPacks : [packOrPacks];
    /** @type {Record<string, string>} */
    const merged = {};
    for (const pack of packs) {
      Object.assign(merged, burnDownLeafCopy(pack));
    }
    out[slug] = merged;
  }
  return Object.freeze(out);
}

const learningBurnDownIndexEsEs = composeBurnDownIndexOverlay({
  "components__parent__ParentCurriculumContent": learningBurnDownParentCurriculumEsEs,
  "pages__learning__english-master": learningBurnDownEnglishMasterEsEs,
  "utils__topic-next-step-engine": learningBurnDownTopicNextStepEsEs,
  "utils__curriculum-audit__israeli-primary-curriculum-map": learningBurnDownCurriculumMapEsEs,
  "utils__curriculum-audit__official-primary-curriculum-spine": learningBurnDownCurriculumSpineEsEs,
});

const gamesBurnDownIndexEsEs = composeBurnDownIndexOverlay({
  "components__educational-games__leo-word-train__leo-word-train-data": gamesBurnDownLeoWordTrainEsEs,
  "components__educational-games__leo-lab__leo-lab-data": gamesBurnDownLeoLabEsEs,
  "components__educational-games__leo-word-detective__leo-word-detective-data": gamesBurnDownLeoWordDetectiveEsEs,
});

const globalBurnDownIndexEsEs = composeBurnDownIndexOverlay({
  "components__promo__PromoMobileCompareVideo": globalBurnDownPromoMobileEsEs,
  "components__school-portal__SchoolDrillDown": globalBurnDownSchoolDrillDownEsEs,
  "lib__learning__subject-permissions__subject-access.server": globalBurnDownSubjectAccessEsEs,
  "lib__site__public-page-seo": globalBurnDownPublicPageSeoEsEs,
  "lib__teacher-portal__teacher-class-grade": globalBurnDownTeacherClassGradeEsEs,
  "lib__teacher-server__teacher-dashboard.server": globalBurnDownTeacherDashboardEsEs,
  "lib__worksheets__worksheet-meta-labels-en.server": globalBurnDownWorksheetMetaEsEs,
  "lib__worksheets__worksheet-payload-build.server": globalBurnDownWorksheetPayloadEsEs,
  "lib__worksheets__worksheet-ui": globalBurnDownWorksheetUiEsEs,
  "pages__api__parent__create-student": globalBurnDownCreateStudentEsEs,
  "pages__school__classes__index": globalBurnDownSchoolClassesEsEs,
  "pages__school__students__index": globalBurnDownSchoolStudentsEsEs,
  "pages__student__worksheet__[worksheetId]": globalBurnDownStudentWorksheetEsEs,
  "pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId]":
    globalBurnDownTeacherClassGradeStudentEsEs,
  "pages__teacher__worksheets__[worksheetId]__grade__[studentId]": globalBurnDownTeacherWorksheetGradeEsEs,
  "pages__teacher__worksheets__[worksheetId]__report": globalBurnDownTeacherWorksheetReportEsEs,
  "pages___app": globalBurnDownAppEsEs,
});

const reportsBurnDownIndexEsEs = composeBurnDownIndexOverlay({
  "components__parent-report-detailed-surface": reportsBurnDownDetailedSurfaceEsEs,
  "utils__parent-report-language__grade-aware-recommendation-templates": [
    reportsBurnDownGradeAwareOutOfGradeGuardsEsEs,
    reportsBurnDownGradeAwareWeeklyFocusEsEs,
    reportsBurnDownGradeAwarePracticePromptsEsEs,
    reportsBurnDownGradeAwareCourseLabelsEsEs,
  ],
  "utils__parent-report-out-of-grade-transparency": reportsBurnDownOutOfGradeTransparencyEsEs,
  "utils__parent-report-surface__parent-topic-tier": reportsBurnDownParentTopicTierEsEs,
});

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
  "es-ES": Object.freeze({
    "books/ui.json": booksUiEsEs,
    "books/registry-titles.json": booksRegistryTitlesEsEs,
    "demo/ui.json": demoUiEsEs,
    "games/burn-down-index.json": gamesBurnDownIndexEsEs,
    "global-burn-down/burn-down-index.json": globalBurnDownIndexEsEs,
    "learning/burn-down-index.json": learningBurnDownIndexEsEs,
    "learning/diagnostic-labels.json": learningDiagnosticLabelsEsEs,
    "reports/burn-down-index.json": reportsBurnDownIndexEsEs,
    "rewards/ui.json": rewardsUiEsEs,
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
