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
 * listed here (DISK_FALLBACK_CONTENT_PACK_AUTHORITY — see locale.server.js).
 * Per-game slug JSON (e.g. games/bingo.json) is intentionally disk-authoritative
 * while games/burn-down-index.json + games/ui-pack-index.json stay cataloged.
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

import booksUiPtBr from "../../content-packs/pt-BR/books/ui.json" with { type: "json" };
import booksRegistryTitlesPtBr from "../../content-packs/pt-BR/books/registry-titles.json" with { type: "json" };
import booksEnglishPageSkillsPtBr from "../../content-packs/pt-BR/books/english-page-skills.json" with { type: "json" };
import demoUiPtBr from "../../content-packs/pt-BR/demo/ui.json" with { type: "json" };
import gamesBurnDownIndexPtBr from "../../content-packs/pt-BR/games/burn-down-index.json" with { type: "json" };
import gamesUiPackIndexPtBr from "../../content-packs/pt-BR/games/ui-pack-index.json" with { type: "json" };
import globalBurnDownIndexPtBr from "../../content-packs/pt-BR/global-burn-down/burn-down-index.json" with { type: "json" };
import learningBurnDownIndexPtBr from "../../content-packs/pt-BR/learning/burn-down-index.json" with { type: "json" };
import learningDiagnosticDefaultsPtBr from "../../content-packs/pt-BR/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };
import learningDiagnosticFrameworkPtBr from "../../content-packs/pt-BR/learning/diagnostic-framework-v1.json" with { type: "json" };
import learningDiagnosticLabelsPtBr from "../../content-packs/pt-BR/learning/diagnostic-labels.json" with { type: "json" };
import learningExamplePatternPayloadPtBr from "../../content-packs/pt-BR/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import learningFastDiagnosticProbesPtBr from "../../content-packs/pt-BR/learning/fast-diagnostic-probes.json" with { type: "json" };
import learningFastDiagnosticTagLabelsPtBr from "../../content-packs/pt-BR/learning/fast-diagnostic-tag-labels.json" with { type: "json" };
import learningGeometryContentPtBr from "../../content-packs/pt-BR/learning/geometry-content.json" with { type: "json" };
import learningPatternsCopyPtBr from "../../content-packs/pt-BR/learning/learning-patterns-copy.json" with { type: "json" };
import learningMathAnimationTitlesPtBr from "../../content-packs/pt-BR/learning/math-animation-titles.json" with { type: "json" };
import taxonomyEnglishStructurePtBr from "../../content-packs/pt-BR/learning/taxonomy/english.structure.json" with { type: "json" };
import taxonomyEnglishContentPtBr from "../../content-packs/pt-BR/learning/taxonomy/english.content.json" with { type: "json" };
import taxonomyGeometryStructurePtBr from "../../content-packs/pt-BR/learning/taxonomy/geometry.structure.json" with { type: "json" };
import taxonomyGeometryContentPtBr from "../../content-packs/pt-BR/learning/taxonomy/geometry.content.json" with { type: "json" };
import taxonomyMathStructurePtBr from "../../content-packs/pt-BR/learning/taxonomy/math.structure.json" with { type: "json" };
import taxonomyMathContentPtBr from "../../content-packs/pt-BR/learning/taxonomy/math.content.json" with { type: "json" };
import taxonomyScienceStructurePtBr from "../../content-packs/pt-BR/learning/taxonomy/science.structure.json" with { type: "json" };
import taxonomyScienceContentPtBr from "../../content-packs/pt-BR/learning/taxonomy/science.content.json" with { type: "json" };
import reportsBurnDownIndexPtBr from "../../content-packs/pt-BR/reports/burn-down-index.json" with { type: "json" };
import rewardsCardCatalogPtBr from "../../content-packs/pt-BR/rewards/card-catalog.json" with { type: "json" };
import rewardsUiPtBr from "../../content-packs/pt-BR/rewards/ui.json" with { type: "json" };

import BooksUiJsonAr001 from "../../content-packs/ar-001/books/ui.json" with { type: "json" };
import BooksRegistryTitlesJsonAr001 from "../../content-packs/ar-001/books/registry-titles.json" with { type: "json" };
import BooksEnglishPageSkillsJsonAr001 from "../../content-packs/ar-001/books/english-page-skills.json" with { type: "json" };
import DemoUiJsonAr001 from "../../content-packs/ar-001/demo/ui.json" with { type: "json" };
import GamesBurnDownIndexJsonAr001 from "../../content-packs/ar-001/games/burn-down-index.json" with { type: "json" };
import GamesUiPackIndexJsonAr001 from "../../content-packs/ar-001/games/ui-pack-index.json" with { type: "json" };
import GlobalBurnDownBurnDownIndexJsonAr001 from "../../content-packs/ar-001/global-burn-down/burn-down-index.json" with { type: "json" };
import LearningBurnDownIndexJsonAr001 from "../../content-packs/ar-001/learning/burn-down-index.json" with { type: "json" };
import LearningDiagnosticEngineV2DefaultsJsonAr001 from "../../content-packs/ar-001/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };
import LearningDiagnosticFrameworkV1JsonAr001 from "../../content-packs/ar-001/learning/diagnostic-framework-v1.json" with { type: "json" };
import LearningDiagnosticLabelsJsonAr001 from "../../content-packs/ar-001/learning/diagnostic-labels.json" with { type: "json" };
import LearningExamplePatternDiagnosticsPayloadJsonAr001 from "../../content-packs/ar-001/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import LearningFastDiagnosticProbesJsonAr001 from "../../content-packs/ar-001/learning/fast-diagnostic-probes.json" with { type: "json" };
import LearningFastDiagnosticTagLabelsJsonAr001 from "../../content-packs/ar-001/learning/fast-diagnostic-tag-labels.json" with { type: "json" };
import LearningGeometryContentJsonAr001 from "../../content-packs/ar-001/learning/geometry-content.json" with { type: "json" };
import LearningLearningPatternsCopyJsonAr001 from "../../content-packs/ar-001/learning/learning-patterns-copy.json" with { type: "json" };
import LearningMathAnimationTitlesJsonAr001 from "../../content-packs/ar-001/learning/math-animation-titles.json" with { type: "json" };
import LearningTaxonomyEnglishStructureJsonAr001 from "../../content-packs/ar-001/learning/taxonomy/english.structure.json" with { type: "json" };
import LearningTaxonomyEnglishContentJsonAr001 from "../../content-packs/ar-001/learning/taxonomy/english.content.json" with { type: "json" };
import LearningTaxonomyGeometryStructureJsonAr001 from "../../content-packs/ar-001/learning/taxonomy/geometry.structure.json" with { type: "json" };
import LearningTaxonomyGeometryContentJsonAr001 from "../../content-packs/ar-001/learning/taxonomy/geometry.content.json" with { type: "json" };
import LearningTaxonomyMathStructureJsonAr001 from "../../content-packs/ar-001/learning/taxonomy/math.structure.json" with { type: "json" };
import LearningTaxonomyMathContentJsonAr001 from "../../content-packs/ar-001/learning/taxonomy/math.content.json" with { type: "json" };
import LearningTaxonomyScienceStructureJsonAr001 from "../../content-packs/ar-001/learning/taxonomy/science.structure.json" with { type: "json" };
import LearningTaxonomyScienceContentJsonAr001 from "../../content-packs/ar-001/learning/taxonomy/science.content.json" with { type: "json" };
import ReportsBurnDownIndexJsonAr001 from "../../content-packs/ar-001/reports/burn-down-index.json" with { type: "json" };
import RewardsCardCatalogJsonAr001 from "../../content-packs/ar-001/rewards/card-catalog.json" with { type: "json" };
import RewardsUiJsonAr001 from "../../content-packs/ar-001/rewards/ui.json" with { type: "json" };

import booksUiPtPt from "../../content-packs/pt-PT/books/ui.json" with { type: "json" };
import booksRegistryTitlesPtPt from "../../content-packs/pt-PT/books/registry-titles.json" with { type: "json" };
import booksEnglishPageSkillsPtPt from "../../content-packs/pt-PT/books/english-page-skills.json" with { type: "json" };
import demoUiPtPt from "../../content-packs/pt-PT/demo/ui.json" with { type: "json" };
import gamesBurnDownIndexPtPt from "../../content-packs/pt-PT/games/burn-down-index.json" with { type: "json" };
import gamesUiPackIndexPtPt from "../../content-packs/pt-PT/games/ui-pack-index.json" with { type: "json" };
import globalBurnDownIndexPtPt from "../../content-packs/pt-PT/global-burn-down/burn-down-index.json" with { type: "json" };
import learningBurnDownIndexPtPt from "../../content-packs/pt-PT/learning/burn-down-index.json" with { type: "json" };
import learningDiagnosticLabelsPtPt from "../../content-packs/pt-PT/learning/diagnostic-labels.json" with { type: "json" };
import learningExamplePatternPayloadPtPt from "../../content-packs/pt-PT/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import learningFastDiagnosticProbesPtPt from "../../content-packs/pt-PT/learning/fast-diagnostic-probes.json" with { type: "json" };
import learningFastDiagnosticTagLabelsPtPt from "../../content-packs/pt-PT/learning/fast-diagnostic-tag-labels.json" with { type: "json" };
import learningMathAnimationTitlesPtPt from "../../content-packs/pt-PT/learning/math-animation-titles.json" with { type: "json" };
import taxonomyEnglishContentPtPt from "../../content-packs/pt-PT/learning/taxonomy/english.content.json" with { type: "json" };
import taxonomyMathContentPtPt from "../../content-packs/pt-PT/learning/taxonomy/math.content.json" with { type: "json" };
import reportsBurnDownIndexPtPt from "../../content-packs/pt-PT/reports/burn-down-index.json" with { type: "json" };
import rewardsCardCatalogPtPt from "../../content-packs/pt-PT/rewards/card-catalog.json" with { type: "json" };
import rewardsUiPtPt from "../../content-packs/pt-PT/rewards/ui.json" with { type: "json" };

import booksUiItIt from "../../content-packs/it-IT/books/ui.json" with { type: "json" };
import booksRegistryTitlesItIt from "../../content-packs/it-IT/books/registry-titles.json" with { type: "json" };
import booksEnglishPageSkillsItIt from "../../content-packs/it-IT/books/english-page-skills.json" with { type: "json" };
import demoUiItIt from "../../content-packs/it-IT/demo/ui.json" with { type: "json" };
import gamesBurnDownIndexItIt from "../../content-packs/it-IT/games/burn-down-index.json" with { type: "json" };
import gamesUiPackIndexItIt from "../../content-packs/it-IT/games/ui-pack-index.json" with { type: "json" };
import globalBurnDownIndexItIt from "../../content-packs/it-IT/global-burn-down/burn-down-index.json" with { type: "json" };
import learningBurnDownIndexItIt from "../../content-packs/it-IT/learning/burn-down-index.json" with { type: "json" };
import learningDiagnosticDefaultsItIt from "../../content-packs/it-IT/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };
import learningDiagnosticFrameworkItIt from "../../content-packs/it-IT/learning/diagnostic-framework-v1.json" with { type: "json" };
import learningDiagnosticLabelsItIt from "../../content-packs/it-IT/learning/diagnostic-labels.json" with { type: "json" };
import learningExamplePatternPayloadItIt from "../../content-packs/it-IT/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import learningFastDiagnosticProbesItIt from "../../content-packs/it-IT/learning/fast-diagnostic-probes.json" with { type: "json" };
import learningFastDiagnosticTagLabelsItIt from "../../content-packs/it-IT/learning/fast-diagnostic-tag-labels.json" with { type: "json" };
import learningGeometryContentItIt from "../../content-packs/it-IT/learning/geometry-content.json" with { type: "json" };
import learningPatternsCopyItIt from "../../content-packs/it-IT/learning/learning-patterns-copy.json" with { type: "json" };
import learningMathAnimationTitlesItIt from "../../content-packs/it-IT/learning/math-animation-titles.json" with { type: "json" };
import taxonomyEnglishStructureItIt from "../../content-packs/it-IT/learning/taxonomy/english.structure.json" with { type: "json" };
import taxonomyEnglishContentItIt from "../../content-packs/it-IT/learning/taxonomy/english.content.json" with { type: "json" };
import taxonomyGeometryStructureItIt from "../../content-packs/it-IT/learning/taxonomy/geometry.structure.json" with { type: "json" };
import taxonomyGeometryContentItIt from "../../content-packs/it-IT/learning/taxonomy/geometry.content.json" with { type: "json" };
import taxonomyMathStructureItIt from "../../content-packs/it-IT/learning/taxonomy/math.structure.json" with { type: "json" };
import taxonomyMathContentItIt from "../../content-packs/it-IT/learning/taxonomy/math.content.json" with { type: "json" };
import taxonomyScienceStructureItIt from "../../content-packs/it-IT/learning/taxonomy/science.structure.json" with { type: "json" };
import taxonomyScienceContentItIt from "../../content-packs/it-IT/learning/taxonomy/science.content.json" with { type: "json" };
import reportsBurnDownIndexItIt from "../../content-packs/it-IT/reports/burn-down-index.json" with { type: "json" };
import rewardsCardCatalogItIt from "../../content-packs/it-IT/rewards/card-catalog.json" with { type: "json" };
import rewardsUiItIt from "../../content-packs/it-IT/rewards/ui.json" with { type: "json" };

import booksUiFrFr from "../../content-packs/fr-FR/books/ui.json" with { type: "json" };
import booksRegistryTitlesFrFr from "../../content-packs/fr-FR/books/registry-titles.json" with { type: "json" };
import booksEnglishPageSkillsFrFr from "../../content-packs/fr-FR/books/english-page-skills.json" with { type: "json" };
import demoUiFrFr from "../../content-packs/fr-FR/demo/ui.json" with { type: "json" };
import gamesBurnDownIndexFrFr from "../../content-packs/fr-FR/games/burn-down-index.json" with { type: "json" };
import gamesUiPackIndexFrFr from "../../content-packs/fr-FR/games/ui-pack-index.json" with { type: "json" };
import globalBurnDownIndexFrFr from "../../content-packs/fr-FR/global-burn-down/burn-down-index.json" with { type: "json" };
import learningBurnDownIndexFrFr from "../../content-packs/fr-FR/learning/burn-down-index.json" with { type: "json" };
import learningDiagnosticDefaultsFrFr from "../../content-packs/fr-FR/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };
import learningDiagnosticFrameworkFrFr from "../../content-packs/fr-FR/learning/diagnostic-framework-v1.json" with { type: "json" };
import learningDiagnosticLabelsFrFr from "../../content-packs/fr-FR/learning/diagnostic-labels.json" with { type: "json" };
import learningExamplePatternPayloadFrFr from "../../content-packs/fr-FR/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import learningFastDiagnosticProbesFrFr from "../../content-packs/fr-FR/learning/fast-diagnostic-probes.json" with { type: "json" };
import learningFastDiagnosticTagLabelsFrFr from "../../content-packs/fr-FR/learning/fast-diagnostic-tag-labels.json" with { type: "json" };
import learningGeometryContentFrFr from "../../content-packs/fr-FR/learning/geometry-content.json" with { type: "json" };
import learningPatternsCopyFrFr from "../../content-packs/fr-FR/learning/learning-patterns-copy.json" with { type: "json" };
import learningMathAnimationTitlesFrFr from "../../content-packs/fr-FR/learning/math-animation-titles.json" with { type: "json" };
import taxonomyEnglishStructureFrFr from "../../content-packs/fr-FR/learning/taxonomy/english.structure.json" with { type: "json" };
import taxonomyEnglishContentFrFr from "../../content-packs/fr-FR/learning/taxonomy/english.content.json" with { type: "json" };
import taxonomyGeometryStructureFrFr from "../../content-packs/fr-FR/learning/taxonomy/geometry.structure.json" with { type: "json" };
import taxonomyGeometryContentFrFr from "../../content-packs/fr-FR/learning/taxonomy/geometry.content.json" with { type: "json" };
import taxonomyMathStructureFrFr from "../../content-packs/fr-FR/learning/taxonomy/math.structure.json" with { type: "json" };
import taxonomyMathContentFrFr from "../../content-packs/fr-FR/learning/taxonomy/math.content.json" with { type: "json" };
import taxonomyScienceStructureFrFr from "../../content-packs/fr-FR/learning/taxonomy/science.structure.json" with { type: "json" };
import taxonomyScienceContentFrFr from "../../content-packs/fr-FR/learning/taxonomy/science.content.json" with { type: "json" };
import reportsBurnDownIndexFrFr from "../../content-packs/fr-FR/reports/burn-down-index.json" with { type: "json" };
import rewardsCardCatalogFrFr from "../../content-packs/fr-FR/rewards/card-catalog.json" with { type: "json" };
import rewardsUiFrFr from "../../content-packs/fr-FR/rewards/ui.json" with { type: "json" };

import booksUiNlNl from "../../content-packs/nl-NL/books/ui.json" with { type: "json" };
import booksRegistryTitlesNlNl from "../../content-packs/nl-NL/books/registry-titles.json" with { type: "json" };
import booksEnglishPageSkillsNlNl from "../../content-packs/nl-NL/books/english-page-skills.json" with { type: "json" };
import demoUiNlNl from "../../content-packs/nl-NL/demo/ui.json" with { type: "json" };
import gamesBurnDownIndexNlNl from "../../content-packs/nl-NL/games/burn-down-index.json" with { type: "json" };
import gamesUiPackIndexNlNl from "../../content-packs/nl-NL/games/ui-pack-index.json" with { type: "json" };
import globalBurnDownIndexNlNl from "../../content-packs/nl-NL/global-burn-down/burn-down-index.json" with { type: "json" };
import learningBurnDownIndexNlNl from "../../content-packs/nl-NL/learning/burn-down-index.json" with { type: "json" };
import learningDiagnosticDefaultsNlNl from "../../content-packs/nl-NL/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };
import learningDiagnosticFrameworkNlNl from "../../content-packs/nl-NL/learning/diagnostic-framework-v1.json" with { type: "json" };
import learningDiagnosticLabelsNlNl from "../../content-packs/nl-NL/learning/diagnostic-labels.json" with { type: "json" };
import learningExamplePatternPayloadNlNl from "../../content-packs/nl-NL/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import learningFastDiagnosticProbesNlNl from "../../content-packs/nl-NL/learning/fast-diagnostic-probes.json" with { type: "json" };
import learningFastDiagnosticTagLabelsNlNl from "../../content-packs/nl-NL/learning/fast-diagnostic-tag-labels.json" with { type: "json" };
import learningGeometryContentNlNl from "../../content-packs/nl-NL/learning/geometry-content.json" with { type: "json" };
import learningPatternsCopyNlNl from "../../content-packs/nl-NL/learning/learning-patterns-copy.json" with { type: "json" };
import learningMathAnimationTitlesNlNl from "../../content-packs/nl-NL/learning/math-animation-titles.json" with { type: "json" };
import taxonomyEnglishStructureNlNl from "../../content-packs/nl-NL/learning/taxonomy/english.structure.json" with { type: "json" };
import taxonomyEnglishContentNlNl from "../../content-packs/nl-NL/learning/taxonomy/english.content.json" with { type: "json" };
import taxonomyGeometryStructureNlNl from "../../content-packs/nl-NL/learning/taxonomy/geometry.structure.json" with { type: "json" };
import taxonomyGeometryContentNlNl from "../../content-packs/nl-NL/learning/taxonomy/geometry.content.json" with { type: "json" };
import taxonomyMathStructureNlNl from "../../content-packs/nl-NL/learning/taxonomy/math.structure.json" with { type: "json" };
import taxonomyMathContentNlNl from "../../content-packs/nl-NL/learning/taxonomy/math.content.json" with { type: "json" };
import taxonomyScienceStructureNlNl from "../../content-packs/nl-NL/learning/taxonomy/science.structure.json" with { type: "json" };
import taxonomyScienceContentNlNl from "../../content-packs/nl-NL/learning/taxonomy/science.content.json" with { type: "json" };
import reportsBurnDownIndexNlNl from "../../content-packs/nl-NL/reports/burn-down-index.json" with { type: "json" };
import rewardsCardCatalogNlNl from "../../content-packs/nl-NL/rewards/card-catalog.json" with { type: "json" };
import rewardsUiNlNl from "../../content-packs/nl-NL/rewards/ui.json" with { type: "json" };
import booksUiDeDe from "../../content-packs/de-DE/books/ui.json" with { type: "json" };
import booksRegistryTitlesDeDe from "../../content-packs/de-DE/books/registry-titles.json" with { type: "json" };
import booksEnglishPageSkillsDeDe from "../../content-packs/de-DE/books/english-page-skills.json" with { type: "json" };
import demoUiDeDe from "../../content-packs/de-DE/demo/ui.json" with { type: "json" };
import gamesBurnDownIndexDeDe from "../../content-packs/de-DE/games/burn-down-index.json" with { type: "json" };
import gamesUiPackIndexDeDe from "../../content-packs/de-DE/games/ui-pack-index.json" with { type: "json" };
import globalBurnDownIndexDeDe from "../../content-packs/de-DE/global-burn-down/burn-down-index.json" with { type: "json" };
import learningBurnDownIndexDeDe from "../../content-packs/de-DE/learning/burn-down-index.json" with { type: "json" };
import learningDiagnosticDefaultsDeDe from "../../content-packs/de-DE/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };
import learningDiagnosticFrameworkDeDe from "../../content-packs/de-DE/learning/diagnostic-framework-v1.json" with { type: "json" };
import learningDiagnosticLabelsDeDe from "../../content-packs/de-DE/learning/diagnostic-labels.json" with { type: "json" };
import learningExamplePatternPayloadDeDe from "../../content-packs/de-DE/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import learningFastDiagnosticProbesDeDe from "../../content-packs/de-DE/learning/fast-diagnostic-probes.json" with { type: "json" };
import learningFastDiagnosticTagLabelsDeDe from "../../content-packs/de-DE/learning/fast-diagnostic-tag-labels.json" with { type: "json" };
import learningGeometryContentDeDe from "../../content-packs/de-DE/learning/geometry-content.json" with { type: "json" };
import learningPatternsCopyDeDe from "../../content-packs/de-DE/learning/learning-patterns-copy.json" with { type: "json" };
import learningMathAnimationTitlesDeDe from "../../content-packs/de-DE/learning/math-animation-titles.json" with { type: "json" };
import taxonomyEnglishStructureDeDe from "../../content-packs/de-DE/learning/taxonomy/english.structure.json" with { type: "json" };
import taxonomyEnglishContentDeDe from "../../content-packs/de-DE/learning/taxonomy/english.content.json" with { type: "json" };
import taxonomyGeometryStructureDeDe from "../../content-packs/de-DE/learning/taxonomy/geometry.structure.json" with { type: "json" };
import taxonomyGeometryContentDeDe from "../../content-packs/de-DE/learning/taxonomy/geometry.content.json" with { type: "json" };
import taxonomyMathStructureDeDe from "../../content-packs/de-DE/learning/taxonomy/math.structure.json" with { type: "json" };
import taxonomyMathContentDeDe from "../../content-packs/de-DE/learning/taxonomy/math.content.json" with { type: "json" };
import taxonomyScienceStructureDeDe from "../../content-packs/de-DE/learning/taxonomy/science.structure.json" with { type: "json" };
import taxonomyScienceContentDeDe from "../../content-packs/de-DE/learning/taxonomy/science.content.json" with { type: "json" };
import reportsBurnDownIndexDeDe from "../../content-packs/de-DE/reports/burn-down-index.json" with { type: "json" };
import rewardsCardCatalogDeDe from "../../content-packs/de-DE/rewards/card-catalog.json" with { type: "json" };
import rewardsUiDeDe from "../../content-packs/de-DE/rewards/ui.json" with { type: "json" };
import booksUiRuRu from "../../content-packs/ru-RU/books/ui.json" with { type: "json" };
import booksRegistryTitlesRuRu from "../../content-packs/ru-RU/books/registry-titles.json" with { type: "json" };
import booksEnglishPageSkillsRuRu from "../../content-packs/ru-RU/books/english-page-skills.json" with { type: "json" };
import demoUiRuRu from "../../content-packs/ru-RU/demo/ui.json" with { type: "json" };
import gamesBurnDownIndexRuRu from "../../content-packs/ru-RU/games/burn-down-index.json" with { type: "json" };
import gamesUiPackIndexRuRu from "../../content-packs/ru-RU/games/ui-pack-index.json" with { type: "json" };
import globalBurnDownIndexRuRu from "../../content-packs/ru-RU/global-burn-down/burn-down-index.json" with { type: "json" };
import learningBurnDownIndexRuRu from "../../content-packs/ru-RU/learning/burn-down-index.json" with { type: "json" };
import learningDiagnosticDefaultsRuRu from "../../content-packs/ru-RU/learning/diagnostic-engine-v2-defaults.json" with { type: "json" };
import learningDiagnosticFrameworkRuRu from "../../content-packs/ru-RU/learning/diagnostic-framework-v1.json" with { type: "json" };
import learningDiagnosticLabelsRuRu from "../../content-packs/ru-RU/learning/diagnostic-labels.json" with { type: "json" };
import learningExamplePatternPayloadRuRu from "../../content-packs/ru-RU/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import learningFastDiagnosticProbesRuRu from "../../content-packs/ru-RU/learning/fast-diagnostic-probes.json" with { type: "json" };
import learningFastDiagnosticTagLabelsRuRu from "../../content-packs/ru-RU/learning/fast-diagnostic-tag-labels.json" with { type: "json" };
import learningGeometryContentRuRu from "../../content-packs/ru-RU/learning/geometry-content.json" with { type: "json" };
import learningPatternsCopyRuRu from "../../content-packs/ru-RU/learning/learning-patterns-copy.json" with { type: "json" };
import learningMathAnimationTitlesRuRu from "../../content-packs/ru-RU/learning/math-animation-titles.json" with { type: "json" };
import taxonomyEnglishStructureRuRu from "../../content-packs/ru-RU/learning/taxonomy/english.structure.json" with { type: "json" };
import taxonomyEnglishContentRuRu from "../../content-packs/ru-RU/learning/taxonomy/english.content.json" with { type: "json" };
import taxonomyGeometryStructureRuRu from "../../content-packs/ru-RU/learning/taxonomy/geometry.structure.json" with { type: "json" };
import taxonomyGeometryContentRuRu from "../../content-packs/ru-RU/learning/taxonomy/geometry.content.json" with { type: "json" };
import taxonomyMathStructureRuRu from "../../content-packs/ru-RU/learning/taxonomy/math.structure.json" with { type: "json" };
import taxonomyMathContentRuRu from "../../content-packs/ru-RU/learning/taxonomy/math.content.json" with { type: "json" };
import taxonomyScienceStructureRuRu from "../../content-packs/ru-RU/learning/taxonomy/science.structure.json" with { type: "json" };
import taxonomyScienceContentRuRu from "../../content-packs/ru-RU/learning/taxonomy/science.content.json" with { type: "json" };
import reportsBurnDownIndexRuRu from "../../content-packs/ru-RU/reports/burn-down-index.json" with { type: "json" };
import rewardsCardCatalogRuRu from "../../content-packs/ru-RU/rewards/card-catalog.json" with { type: "json" };
import rewardsUiRuRu from "../../content-packs/ru-RU/rewards/ui.json" with { type: "json" };

// Spain (es-ES) sparse overlays — registered for catalog deep-merge via resolveRegisteredContentPack.
import booksUiEsEs from "../../content-packs/es-ES/books/ui.json" with { type: "json" };
import booksRegistryTitlesEsEs from "../../content-packs/es-ES/books/registry-titles.json" with { type: "json" };
import demoUiEsEs from "../../content-packs/es-ES/demo/ui.json" with { type: "json" };
import rewardsUiEsEs from "../../content-packs/es-ES/rewards/ui.json" with { type: "json" };
import learningDiagnosticLabelsEsEs from "../../content-packs/es-ES/learning/diagnostic-labels.json" with { type: "json" };
import reportsBurnDownDetailedSurfaceEsEs from "../../content-packs/es-ES/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import reportsBurnDownGradeAwareOutOfGradeGuardsEsEs from "../../content-packs/es-ES/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__out-of-grade-guards.json" with { type: "json" };
import reportsBurnDownGradeAwareWeeklyFocusEsEs from "../../content-packs/es-ES/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__weekly-focus.json" with { type: "json" };
import reportsBurnDownGradeAwareCourseLabelsEsEs from "../../content-packs/es-ES/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__course-labels.json" with { type: "json" };
import reportsBurnDownOutOfGradeTransparencyEsEs from "../../content-packs/es-ES/reports/burn-down/utils__parent-report-out-of-grade-transparency.json" with { type: "json" };
import reportsBurnDownParentTopicTierEsEs from "../../content-packs/es-ES/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import learningBurnDownParentCurriculumEsEs from "../../content-packs/es-ES/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import learningBurnDownEnglishMasterEsEs from "../../content-packs/es-ES/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import learningBurnDownTopicNextStepEsEs from "../../content-packs/es-ES/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
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

import books_EnglishPageSkills_PtAo from "../../content-packs/pt-AO/books/english-page-skills.json" with { type: "json" };
import books_RegistryTitles_PtAo from "../../content-packs/pt-AO/books/registry-titles.json" with { type: "json" };
import books_Ui_PtAo from "../../content-packs/pt-AO/books/ui.json" with { type: "json" };
import demo_Ui_PtAo from "../../content-packs/pt-AO/demo/ui.json" with { type: "json" };
import global_burn_down_BurnDownIndex_PtAo from "../../content-packs/pt-AO/global-burn-down/burn-down-index.json" with { type: "json" };
import global_burn_down_Lib_Learning_SubjectPermissions_SubjectAccessServer_PtAo from "../../content-packs/pt-AO/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import global_burn_down_Lib_Site_PublicPageSeo_PtAo from "../../content-packs/pt-AO/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_burn_down_Lib_TeacherPortal_TeacherClassGrade_PtAo from "../../content-packs/pt-AO/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import global_burn_down_Lib_TeacherServer_TeacherDashboardServer_PtAo from "../../content-packs/pt-AO/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import global_burn_down_Lib_Worksheets_WorksheetMetaLabelsEnServer_PtAo from "../../content-packs/pt-AO/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import global_burn_down_Lib_Worksheets_WorksheetUi_PtAo from "../../content-packs/pt-AO/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import global_burn_down_Pages_App_PtAo from "../../content-packs/pt-AO/global-burn-down/pages___app.json" with { type: "json" };
import reports_BurnDownIndex_PtAo from "../../content-packs/pt-AO/reports/burn-down-index.json" with { type: "json" };
import reports_BurnDown_Utils_ParentReportLanguage_GradeAwareRecommendationTemplates_PtAo from "../../content-packs/pt-AO/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import rewards_Ui_PtAo from "../../content-packs/pt-AO/rewards/ui.json" with { type: "json" };
import books_EnglishPageSkills_EnNg from "../../content-packs/en-NG/books/english-page-skills.json" with { type: "json" };
import books_RegistryTitles_EnNg from "../../content-packs/en-NG/books/registry-titles.json" with { type: "json" };
import books_Ui_EnNg from "../../content-packs/en-NG/books/ui.json" with { type: "json" };
import demo_Ui_EnNg from "../../content-packs/en-NG/demo/ui.json" with { type: "json" };
import games_BurnDownIndex_EnNg from "../../content-packs/en-NG/games/burn-down-index.json" with { type: "json" };
import games_BurnDown_Components_EducationalGames_LeoLab_LeoLabData_EnNg from "../../content-packs/en-NG/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import games_BurnDown_Components_EducationalGames_LeoLab_LeoLabExperimentsClean_EnNg from "../../content-packs/en-NG/games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json" with { type: "json" };
import games_BurnDown_Components_EducationalGames_LeoWordDetective_LeoWordDetectiveData_EnNg from "../../content-packs/en-NG/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import games_BurnDown_Components_EducationalGames_LeoWordTrain_LeoWordTrainData_EnNg from "../../content-packs/en-NG/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import games_BurnDown_Components_SoloGames_Prototypes_Dev_ConnectColorsPrototype_EnNg from "../../content-packs/en-NG/games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json" with { type: "json" };
import games_BurnDown_Lib_EducationalGames_EducationalGameRegistry_EnNg from "../../content-packs/en-NG/games/burn-down/lib__educational-games__educational-game-registry.json" with { type: "json" };
import games_BurnDown_Lib_SoloGames_SoloGameRegistry_EnNg from "../../content-packs/en-NG/games/burn-down/lib__solo-games__solo-game-registry.json" with { type: "json" };
import games_SortShapes_EnNg from "../../content-packs/en-NG/games/sort-shapes.json" with { type: "json" };
import games_UiPackIndex_EnNg from "../../content-packs/en-NG/games/ui-pack-index.json" with { type: "json" };
import global_burn_down_BurnDownIndex_EnNg from "../../content-packs/en-NG/global-burn-down/burn-down-index.json" with { type: "json" };
import global_burn_down_Lib_Learning_SubjectPermissions_SubjectAccessServer_EnNg from "../../content-packs/en-NG/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import global_burn_down_Lib_Site_PublicPageSeo_EnNg from "../../content-packs/en-NG/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_burn_down_Lib_TeacherPortal_TeacherClassGrade_EnNg from "../../content-packs/en-NG/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import global_burn_down_Lib_TeacherServer_TeacherDashboardServer_EnNg from "../../content-packs/en-NG/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import global_burn_down_Lib_Worksheets_WorksheetMetaLabelsEnServer_EnNg from "../../content-packs/en-NG/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import global_burn_down_Lib_Worksheets_WorksheetUi_EnNg from "../../content-packs/en-NG/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import global_burn_down_Pages_App_EnNg from "../../content-packs/en-NG/global-burn-down/pages___app.json" with { type: "json" };
import global_burn_down_Pages_Api_Parent_CreateStudent_EnNg from "../../content-packs/en-NG/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import global_burn_down_Pages_School_Classes_Index_EnNg from "../../content-packs/en-NG/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import global_burn_down_Pages_School_Students_Index_EnNg from "../../content-packs/en-NG/global-burn-down/pages__school__students__index.json" with { type: "json" };
import global_burn_down_Utils_QuestionMetadataQa_QuestionBankDiscovery_EnNg from "../../content-packs/en-NG/global-burn-down/utils__question-metadata-qa__question-bank-discovery.json" with { type: "json" };
import learning_BurnDownIndex_EnNg from "../../content-packs/en-NG/learning/burn-down-index.json" with { type: "json" };
import learning_BurnDown_Components_Parent_ParentCurriculumContent_EnNg from "../../content-packs/en-NG/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import learning_BurnDown_Pages_Learning_EnglishMaster_EnNg from "../../content-packs/en-NG/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import learning_BurnDown_Utils_TopicNextStepEngine_EnNg from "../../content-packs/en-NG/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import learning_DiagnosticLabels_EnNg from "../../content-packs/en-NG/learning/diagnostic-labels.json" with { type: "json" };
import learning_ExamplePatternDiagnosticsPayload_EnNg from "../../content-packs/en-NG/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import reports_BurnDownIndex_EnNg from "../../content-packs/en-NG/reports/burn-down-index.json" with { type: "json" };
import reports_BurnDown_Components_ParentReportDetailedSurface_EnNg from "../../content-packs/en-NG/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import reports_BurnDown_Utils_ParentReportLanguage_GradeAwareRecommendationTemplates_EnNg from "../../content-packs/en-NG/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import reports_BurnDown_Utils_ParentReportOutOfGradeTransparency_EnNg from "../../content-packs/en-NG/reports/burn-down/utils__parent-report-out-of-grade-transparency.json" with { type: "json" };
import reports_BurnDown_Utils_ParentReportOutputIntegrity_ZeroEvidencePolicyTests_EnNg from "../../content-packs/en-NG/reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json" with { type: "json" };
import reports_BurnDown_Utils_ParentReportSurface_ParentTopicTier_EnNg from "../../content-packs/en-NG/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import rewards_CardCatalog_EnNg from "../../content-packs/en-NG/rewards/card-catalog.json" with { type: "json" };
import rewards_Ui_EnNg from "../../content-packs/en-NG/rewards/ui.json" with { type: "json" };
import books_EnglishPageSkills_FrCi from "../../content-packs/fr-CI/books/english-page-skills.json" with { type: "json" };
import books_RegistryTitles_FrCi from "../../content-packs/fr-CI/books/registry-titles.json" with { type: "json" };
import books_Ui_FrCi from "../../content-packs/fr-CI/books/ui.json" with { type: "json" };
import demo_Ui_FrCi from "../../content-packs/fr-CI/demo/ui.json" with { type: "json" };
import games_BurnDownIndex_FrCi from "../../content-packs/fr-CI/games/burn-down-index.json" with { type: "json" };
import games_BurnDown_Components_EducationalGames_LeoLab_LeoLabData_FrCi from "../../content-packs/fr-CI/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import games_BurnDown_Components_EducationalGames_LeoWordDetective_LeoWordDetectiveData_FrCi from "../../content-packs/fr-CI/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import games_BurnDown_Components_EducationalGames_LeoWordTrain_LeoWordTrainData_FrCi from "../../content-packs/fr-CI/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import global_burn_down_BurnDownIndex_FrCi from "../../content-packs/fr-CI/global-burn-down/burn-down-index.json" with { type: "json" };
import global_burn_down_Lib_Site_PublicPageSeo_FrCi from "../../content-packs/fr-CI/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_burn_down_Lib_TeacherPortal_TeacherClassGrade_FrCi from "../../content-packs/fr-CI/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import global_burn_down_Lib_TeacherServer_TeacherDashboardServer_FrCi from "../../content-packs/fr-CI/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import global_burn_down_Lib_Worksheets_WorksheetMetaLabelsEnServer_FrCi from "../../content-packs/fr-CI/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import reports_BurnDownIndex_FrCi from "../../content-packs/fr-CI/reports/burn-down-index.json" with { type: "json" };
import reports_BurnDown_Utils_ParentReportLanguage_GradeAwareRecommendationTemplates_FrCi from "../../content-packs/fr-CI/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import rewards_Ui_FrCi from "../../content-packs/fr-CI/rewards/ui.json" with { type: "json" };
import books_EnglishPageSkills_DeAt from "../../content-packs/de-AT/books/english-page-skills.json" with { type: "json" };
import books_RegistryTitles_DeAt from "../../content-packs/de-AT/books/registry-titles.json" with { type: "json" };
import books_Ui_DeAt from "../../content-packs/de-AT/books/ui.json" with { type: "json" };
import demo_Ui_DeAt from "../../content-packs/de-AT/demo/ui.json" with { type: "json" };
import games_BurnDownIndex_DeAt from "../../content-packs/de-AT/games/burn-down-index.json" with { type: "json" };
import games_BurnDown_Components_EducationalGames_LeoLab_LeoLabData_DeAt from "../../content-packs/de-AT/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import games_BurnDown_Components_EducationalGames_LeoWordDetective_LeoWordDetectiveData_DeAt from "../../content-packs/de-AT/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import games_BurnDown_Components_EducationalGames_LeoWordTrain_LeoWordTrainData_DeAt from "../../content-packs/de-AT/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import global_burn_down_BurnDownIndex_DeAt from "../../content-packs/de-AT/global-burn-down/burn-down-index.json" with { type: "json" };
import global_burn_down_Components_SchoolPortal_SchoolDrillDown_DeAt from "../../content-packs/de-AT/global-burn-down/components__school-portal__SchoolDrillDown.json" with { type: "json" };
import global_burn_down_Lib_Learning_SubjectPermissions_SubjectAccessServer_DeAt from "../../content-packs/de-AT/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import global_burn_down_Lib_Site_PublicPageSeo_DeAt from "../../content-packs/de-AT/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_burn_down_Lib_TeacherPortal_TeacherClassGrade_DeAt from "../../content-packs/de-AT/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import global_burn_down_Lib_TeacherServer_TeacherDashboardServer_DeAt from "../../content-packs/de-AT/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import global_burn_down_Lib_Worksheets_WorksheetMetaLabelsEnServer_DeAt from "../../content-packs/de-AT/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import global_burn_down_Lib_Worksheets_WorksheetUi_DeAt from "../../content-packs/de-AT/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import global_burn_down_Pages_App_DeAt from "../../content-packs/de-AT/global-burn-down/pages___app.json" with { type: "json" };
import global_burn_down_Pages_Api_Parent_CreateStudent_DeAt from "../../content-packs/de-AT/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import global_burn_down_Pages_School_Classes_Index_DeAt from "../../content-packs/de-AT/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import global_burn_down_Pages_School_Students_Index_DeAt from "../../content-packs/de-AT/global-burn-down/pages__school__students__index.json" with { type: "json" };
import learning_BurnDownIndex_DeAt from "../../content-packs/de-AT/learning/burn-down-index.json" with { type: "json" };
import learning_BurnDown_Components_Parent_ParentCurriculumContent_DeAt from "../../content-packs/de-AT/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import learning_BurnDown_Pages_Learning_EnglishMaster_DeAt from "../../content-packs/de-AT/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import learning_BurnDown_Utils_TopicNextStepEngine_DeAt from "../../content-packs/de-AT/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import learning_DiagnosticLabels_DeAt from "../../content-packs/de-AT/learning/diagnostic-labels.json" with { type: "json" };
import reports_BurnDownIndex_DeAt from "../../content-packs/de-AT/reports/burn-down-index.json" with { type: "json" };
import reports_BurnDown_Components_ParentReportDetailedSurface_DeAt from "../../content-packs/de-AT/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import reports_BurnDown_Utils_ParentReportLanguage_GradeAwareRecommendationTemplates_DeAt from "../../content-packs/de-AT/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import reports_BurnDown_Utils_ParentReportLanguage_ParentReportDisplayLabels_DeAt from "../../content-packs/de-AT/reports/burn-down/utils__parent-report-language__parent-report-display-labels.json" with { type: "json" };
import reports_BurnDown_Utils_ParentReportOutOfGradeTransparency_DeAt from "../../content-packs/de-AT/reports/burn-down/utils__parent-report-out-of-grade-transparency.json" with { type: "json" };
import reports_BurnDown_Utils_ParentReportSurface_ParentTopicTier_DeAt from "../../content-packs/de-AT/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import rewards_Ui_DeAt from "../../content-packs/de-AT/rewards/ui.json" with { type: "json" };
import books_English_Page_Skills_FrCa from "../../content-packs/fr-CA/books/english-page-skills.json" with { type: "json" };
import books_Registry_Titles_FrCa from "../../content-packs/fr-CA/books/registry-titles.json" with { type: "json" };
import books_Ui_FrCa from "../../content-packs/fr-CA/books/ui.json" with { type: "json" };
import demo_Ui_FrCa from "../../content-packs/fr-CA/demo/ui.json" with { type: "json" };
import games_Burn_Down_Index_FrCa from "../../content-packs/fr-CA/games/burn-down-index.json" with { type: "json" };
import games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_FrCa from "../../content-packs/fr-CA/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_FrCa from "../../content-packs/fr-CA/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_FrCa from "../../content-packs/fr-CA/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import global_Burn_Down_Burn_Down_Index_FrCa from "../../content-packs/fr-CA/global-burn-down/burn-down-index.json" with { type: "json" };
import global_Burn_Down_Lib_Site_Public_Page_Seo_FrCa from "../../content-packs/fr-CA/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_FrCa from "../../content-packs/fr-CA/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_FrCa from "../../content-packs/fr-CA/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_FrCa from "../../content-packs/fr-CA/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import reports_Burn_Down_Index_FrCa from "../../content-packs/fr-CA/reports/burn-down-index.json" with { type: "json" };
import reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_FrCa from "../../content-packs/fr-CA/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import rewards_Ui_FrCa from "../../content-packs/fr-CA/rewards/ui.json" with { type: "json" };
import books_English_Page_Skills_PtMz from "../../content-packs/pt-MZ/books/english-page-skills.json" with { type: "json" };
import books_Registry_Titles_PtMz from "../../content-packs/pt-MZ/books/registry-titles.json" with { type: "json" };
import books_Ui_PtMz from "../../content-packs/pt-MZ/books/ui.json" with { type: "json" };
import demo_Ui_PtMz from "../../content-packs/pt-MZ/demo/ui.json" with { type: "json" };
import games_Burn_Down_Index_PtMz from "../../content-packs/pt-MZ/games/burn-down-index.json" with { type: "json" };
import games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_PtMz from "../../content-packs/pt-MZ/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_PtMz from "../../content-packs/pt-MZ/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_PtMz from "../../content-packs/pt-MZ/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import global_Burn_Down_Burn_Down_Index_PtMz from "../../content-packs/pt-MZ/global-burn-down/burn-down-index.json" with { type: "json" };
import global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_PtMz from "../../content-packs/pt-MZ/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import global_Burn_Down_Lib_Site_Public_Page_Seo_PtMz from "../../content-packs/pt-MZ/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_PtMz from "../../content-packs/pt-MZ/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_PtMz from "../../content-packs/pt-MZ/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_PtMz from "../../content-packs/pt-MZ/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import global_Burn_Down_Lib_Worksheets_Worksheet_Ui_PtMz from "../../content-packs/pt-MZ/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import global_Burn_Down_Pages_App_PtMz from "../../content-packs/pt-MZ/global-burn-down/pages___app.json" with { type: "json" };
import learning_Burn_Down_Index_PtMz from "../../content-packs/pt-MZ/learning/burn-down-index.json" with { type: "json" };
import reports_Burn_Down_Index_PtMz from "../../content-packs/pt-MZ/reports/burn-down-index.json" with { type: "json" };
import reports_Burn_Down_Components_Parent_Report_Detailed_Surface_PtMz from "../../content-packs/pt-MZ/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_PtMz from "../../content-packs/pt-MZ/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_PtMz from "../../content-packs/pt-MZ/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import rewards_Ui_PtMz from "../../content-packs/pt-MZ/rewards/ui.json" with { type: "json" };
import books_Registry_Titles_EnKe from "../../content-packs/en-KE/books/registry-titles.json" with { type: "json" };
import books_Ui_EnKe from "../../content-packs/en-KE/books/ui.json" with { type: "json" };
import demo_Ui_EnKe from "../../content-packs/en-KE/demo/ui.json" with { type: "json" };
import games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_EnKe from "../../content-packs/en-KE/games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json" with { type: "json" };
import games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_EnKe from "../../content-packs/en-KE/games/burn-down/lib__solo-games__solo-game-registry.json" with { type: "json" };
import games_Sort_Shapes_EnKe from "../../content-packs/en-KE/games/sort-shapes.json" with { type: "json" };
import games_Ui_Pack_Index_EnKe from "../../content-packs/en-KE/games/ui-pack-index.json" with { type: "json" };
import global_Burn_Down_Lib_Site_Public_Page_Seo_EnKe from "../../content-packs/en-KE/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_Burn_Down_Pages_App_EnKe from "../../content-packs/en-KE/global-burn-down/pages___app.json" with { type: "json" };
import reports_Burn_Down_Index_EnKe from "../../content-packs/en-KE/reports/burn-down-index.json" with { type: "json" };
import reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_EnKe from "../../content-packs/en-KE/reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json" with { type: "json" };
import rewards_Ui_EnKe from "../../content-packs/en-KE/rewards/ui.json" with { type: "json" };
import books_English_Page_Skills_DeCh from "../../content-packs/de-CH/books/english-page-skills.json" with { type: "json" };
import books_Ui_DeCh from "../../content-packs/de-CH/books/ui.json" with { type: "json" };
import demo_Ui_DeCh from "../../content-packs/de-CH/demo/ui.json" with { type: "json" };
import games_Burn_Down_Index_DeCh from "../../content-packs/de-CH/games/burn-down-index.json" with { type: "json" };
import games_Burn_Down_Components_Arcade_Fourline_FourlineScreen_DeCh from "../../content-packs/de-CH/games/burn-down/components__arcade__fourline__FourlineScreen.json" with { type: "json" };
import games_Burn_Down_Components_Leo_Miners_LeoMinersGame_DeCh from "../../content-packs/de-CH/games/burn-down/components__leo-miners__LeoMinersGame.json" with { type: "json" };
import games_Burn_Down_Components_Solo_Games_SoloGameHelpModal_DeCh from "../../content-packs/de-CH/games/burn-down/components__solo-games__SoloGameHelpModal.json" with { type: "json" };
import games_Burn_Down_Components_Solo_Games_Engines_MleoPicturePuzzleEngine_DeCh from "../../content-packs/de-CH/games/burn-down/components__solo-games__engines__MleoPicturePuzzleEngine.json" with { type: "json" };
import global_Burn_Down_Burn_Down_Index_DeCh from "../../content-packs/de-CH/global-burn-down/burn-down-index.json" with { type: "json" };
import global_Burn_Down_Components_Promo_PromoVideoModal_DeCh from "../../content-packs/de-CH/global-burn-down/components__promo__PromoVideoModal.json" with { type: "json" };
import global_Burn_Down_Components_Student_StudentAssignedActivityQuestionStage_DeCh from "../../content-packs/de-CH/global-burn-down/components__student__StudentAssignedActivityQuestionStage.json" with { type: "json" };
import global_Burn_Down_Components_Teacher_Portal_TeacherActivityStudentAnswersModal_DeCh from "../../content-packs/de-CH/global-burn-down/components__teacher-portal__TeacherActivityStudentAnswersModal.json" with { type: "json" };
import global_Burn_Down_Lib_Site_Public_Page_Seo_DeCh from "../../content-packs/de-CH/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_Burn_Down_Lib_Worksheets_Worksheet_Ui_DeCh from "../../content-packs/de-CH/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import global_Burn_Down_Pages_App_DeCh from "../../content-packs/de-CH/global-burn-down/pages___app.json" with { type: "json" };
import global_Burn_Down_Pages_Student_Activity_ActivityId_DeCh from "../../content-packs/de-CH/global-burn-down/pages__student__activity__[activityId].json" with { type: "json" };
import learning_Diagnostic_Labels_DeCh from "../../content-packs/de-CH/learning/diagnostic-labels.json" with { type: "json" };
import rewards_Ui_DeCh from "../../content-packs/de-CH/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_nlBE from "../../content-packs/nl-BE/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_nlBE from "../../content-packs/nl-BE/books/registry-titles.json" with { type: "json" };
import Books_Ui_nlBE from "../../content-packs/nl-BE/books/ui.json" with { type: "json" };
import Demo_Ui_nlBE from "../../content-packs/nl-BE/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_nlBE from "../../content-packs/nl-BE/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_nlBE from "../../content-packs/nl-BE/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_nlBE from "../../content-packs/nl-BE/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_nlBE from "../../content-packs/nl-BE/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_nlBE from "../../content-packs/nl-BE/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_nlBE from "../../content-packs/nl-BE/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_nlBE from "../../content-packs/nl-BE/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_nlBE from "../../content-packs/nl-BE/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_nlBE from "../../content-packs/nl-BE/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_nlBE from "../../content-packs/nl-BE/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_nlBE from "../../content-packs/nl-BE/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import Global_Burn_Down_Pages_App_nlBE from "../../content-packs/nl-BE/global-burn-down/pages___app.json" with { type: "json" };
import Global_Burn_Down_Pages_Api_Parent_Create_Student_nlBE from "../../content-packs/nl-BE/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Classes_Index_nlBE from "../../content-packs/nl-BE/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Students_Index_nlBE from "../../content-packs/nl-BE/global-burn-down/pages__school__students__index.json" with { type: "json" };
import Reports_Burn_Down_Index_nlBE from "../../content-packs/nl-BE/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_nlBE from "../../content-packs/nl-BE/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_nlBE from "../../content-packs/nl-BE/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_nlBE from "../../content-packs/nl-BE/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_frBE from "../../content-packs/fr-BE/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_frBE from "../../content-packs/fr-BE/books/registry-titles.json" with { type: "json" };
import Books_Ui_frBE from "../../content-packs/fr-BE/books/ui.json" with { type: "json" };
import Demo_Ui_frBE from "../../content-packs/fr-BE/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_frBE from "../../content-packs/fr-BE/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frBE from "../../content-packs/fr-BE/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frBE from "../../content-packs/fr-BE/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frBE from "../../content-packs/fr-BE/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_frBE from "../../content-packs/fr-BE/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_frBE from "../../content-packs/fr-BE/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frBE from "../../content-packs/fr-BE/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frBE from "../../content-packs/fr-BE/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frBE from "../../content-packs/fr-BE/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Reports_Burn_Down_Index_frBE from "../../content-packs/fr-BE/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frBE from "../../content-packs/fr-BE/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frBE from "../../content-packs/fr-BE/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_frBE from "../../content-packs/fr-BE/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_frCH from "../../content-packs/fr-CH/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_frCH from "../../content-packs/fr-CH/books/registry-titles.json" with { type: "json" };
import Books_Ui_frCH from "../../content-packs/fr-CH/books/ui.json" with { type: "json" };
import Demo_Ui_frCH from "../../content-packs/fr-CH/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_frCH from "../../content-packs/fr-CH/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frCH from "../../content-packs/fr-CH/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frCH from "../../content-packs/fr-CH/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frCH from "../../content-packs/fr-CH/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_frCH from "../../content-packs/fr-CH/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_frCH from "../../content-packs/fr-CH/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frCH from "../../content-packs/fr-CH/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frCH from "../../content-packs/fr-CH/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frCH from "../../content-packs/fr-CH/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Reports_Burn_Down_Index_frCH from "../../content-packs/fr-CH/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frCH from "../../content-packs/fr-CH/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frCH from "../../content-packs/fr-CH/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_frCH from "../../content-packs/fr-CH/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_itCH from "../../content-packs/it-CH/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_itCH from "../../content-packs/it-CH/books/registry-titles.json" with { type: "json" };
import Books_Ui_itCH from "../../content-packs/it-CH/books/ui.json" with { type: "json" };
import Demo_Ui_itCH from "../../content-packs/it-CH/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_itCH from "../../content-packs/it-CH/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_itCH from "../../content-packs/it-CH/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_itCH from "../../content-packs/it-CH/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_itCH from "../../content-packs/it-CH/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_itCH from "../../content-packs/it-CH/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_itCH from "../../content-packs/it-CH/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_itCH from "../../content-packs/it-CH/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_itCH from "../../content-packs/it-CH/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_itCH from "../../content-packs/it-CH/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Reports_Burn_Down_Index_itCH from "../../content-packs/it-CH/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_itCH from "../../content-packs/it-CH/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_itCH from "../../content-packs/it-CH/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_enIN from "../../content-packs/en-IN/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_enIN from "../../content-packs/en-IN/books/registry-titles.json" with { type: "json" };
import Books_Ui_enIN from "../../content-packs/en-IN/books/ui.json" with { type: "json" };
import Demo_Ui_enIN from "../../content-packs/en-IN/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_enIN from "../../content-packs/en-IN/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enIN from "../../content-packs/en-IN/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enIN from "../../content-packs/en-IN/games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enIN from "../../content-packs/en-IN/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enIN from "../../content-packs/en-IN/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enIN from "../../content-packs/en-IN/games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json" with { type: "json" };
import Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enIN from "../../content-packs/en-IN/games/burn-down/lib__educational-games__educational-game-registry.json" with { type: "json" };
import Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enIN from "../../content-packs/en-IN/games/burn-down/lib__solo-games__solo-game-registry.json" with { type: "json" };
import Games_Sort_Shapes_enIN from "../../content-packs/en-IN/games/sort-shapes.json" with { type: "json" };
import Games_Ui_Pack_Index_enIN from "../../content-packs/en-IN/games/ui-pack-index.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_enIN from "../../content-packs/en-IN/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_enIN from "../../content-packs/en-IN/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_enIN from "../../content-packs/en-IN/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_enIN from "../../content-packs/en-IN/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_enIN from "../../content-packs/en-IN/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_enIN from "../../content-packs/en-IN/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enIN from "../../content-packs/en-IN/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import Global_Burn_Down_Pages_App_enIN from "../../content-packs/en-IN/global-burn-down/pages___app.json" with { type: "json" };
import Global_Burn_Down_Pages_Api_Parent_Create_Student_enIN from "../../content-packs/en-IN/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Classes_Index_enIN from "../../content-packs/en-IN/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Students_Index_enIN from "../../content-packs/en-IN/global-burn-down/pages__school__students__index.json" with { type: "json" };
import Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enIN from "../../content-packs/en-IN/global-burn-down/utils__question-metadata-qa__question-bank-discovery.json" with { type: "json" };
import Learning_Burn_Down_Index_enIN from "../../content-packs/en-IN/learning/burn-down-index.json" with { type: "json" };
import Learning_Burn_Down_Components_Parent_ParentCurriculumContent_enIN from "../../content-packs/en-IN/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import Learning_Burn_Down_Pages_Learning_English_Master_enIN from "../../content-packs/en-IN/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import Learning_Burn_Down_Utils_Topic_Next_Step_Engine_enIN from "../../content-packs/en-IN/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import Learning_Diagnostic_Labels_enIN from "../../content-packs/en-IN/learning/diagnostic-labels.json" with { type: "json" };
import Learning_Example_Pattern_Diagnostics_Payload_enIN from "../../content-packs/en-IN/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import Reports_Burn_Down_Index_enIN from "../../content-packs/en-IN/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_enIN from "../../content-packs/en-IN/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enIN from "../../content-packs/en-IN/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Out_Of_Grade_Transparency_enIN from "../../content-packs/en-IN/reports/burn-down/utils__parent-report-out-of-grade-transparency.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enIN from "../../content-packs/en-IN/reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enIN from "../../content-packs/en-IN/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import Rewards_Card_Catalog_enIN from "../../content-packs/en-IN/rewards/card-catalog.json" with { type: "json" };
import Rewards_Ui_enIN from "../../content-packs/en-IN/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_enGH from "../../content-packs/en-GH/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_enGH from "../../content-packs/en-GH/books/registry-titles.json" with { type: "json" };
import Books_Ui_enGH from "../../content-packs/en-GH/books/ui.json" with { type: "json" };
import Demo_Ui_enGH from "../../content-packs/en-GH/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_enGH from "../../content-packs/en-GH/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enGH from "../../content-packs/en-GH/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enGH from "../../content-packs/en-GH/games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enGH from "../../content-packs/en-GH/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enGH from "../../content-packs/en-GH/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enGH from "../../content-packs/en-GH/games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json" with { type: "json" };
import Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enGH from "../../content-packs/en-GH/games/burn-down/lib__educational-games__educational-game-registry.json" with { type: "json" };
import Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enGH from "../../content-packs/en-GH/games/burn-down/lib__solo-games__solo-game-registry.json" with { type: "json" };
import Games_Sort_Shapes_enGH from "../../content-packs/en-GH/games/sort-shapes.json" with { type: "json" };
import Games_Ui_Pack_Index_enGH from "../../content-packs/en-GH/games/ui-pack-index.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_enGH from "../../content-packs/en-GH/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_enGH from "../../content-packs/en-GH/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_enGH from "../../content-packs/en-GH/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_enGH from "../../content-packs/en-GH/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_enGH from "../../content-packs/en-GH/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_enGH from "../../content-packs/en-GH/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enGH from "../../content-packs/en-GH/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import Global_Burn_Down_Pages_App_enGH from "../../content-packs/en-GH/global-burn-down/pages___app.json" with { type: "json" };
import Global_Burn_Down_Pages_Api_Parent_Create_Student_enGH from "../../content-packs/en-GH/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Classes_Index_enGH from "../../content-packs/en-GH/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Students_Index_enGH from "../../content-packs/en-GH/global-burn-down/pages__school__students__index.json" with { type: "json" };
import Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enGH from "../../content-packs/en-GH/global-burn-down/utils__question-metadata-qa__question-bank-discovery.json" with { type: "json" };
import Learning_Burn_Down_Index_enGH from "../../content-packs/en-GH/learning/burn-down-index.json" with { type: "json" };
import Learning_Burn_Down_Components_Parent_ParentCurriculumContent_enGH from "../../content-packs/en-GH/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import Learning_Burn_Down_Pages_Learning_English_Master_enGH from "../../content-packs/en-GH/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import Learning_Burn_Down_Utils_Topic_Next_Step_Engine_enGH from "../../content-packs/en-GH/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import Learning_Diagnostic_Labels_enGH from "../../content-packs/en-GH/learning/diagnostic-labels.json" with { type: "json" };
import Learning_Example_Pattern_Diagnostics_Payload_enGH from "../../content-packs/en-GH/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import Reports_Burn_Down_Index_enGH from "../../content-packs/en-GH/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_enGH from "../../content-packs/en-GH/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enGH from "../../content-packs/en-GH/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Out_Of_Grade_Transparency_enGH from "../../content-packs/en-GH/reports/burn-down/utils__parent-report-out-of-grade-transparency.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enGH from "../../content-packs/en-GH/reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enGH from "../../content-packs/en-GH/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import Rewards_Card_Catalog_enGH from "../../content-packs/en-GH/rewards/card-catalog.json" with { type: "json" };
import Rewards_Ui_enGH from "../../content-packs/en-GH/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_frSN from "../../content-packs/fr-SN/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_frSN from "../../content-packs/fr-SN/books/registry-titles.json" with { type: "json" };
import Books_Ui_frSN from "../../content-packs/fr-SN/books/ui.json" with { type: "json" };
import Demo_Ui_frSN from "../../content-packs/fr-SN/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_frSN from "../../content-packs/fr-SN/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frSN from "../../content-packs/fr-SN/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frSN from "../../content-packs/fr-SN/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frSN from "../../content-packs/fr-SN/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_frSN from "../../content-packs/fr-SN/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_frSN from "../../content-packs/fr-SN/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frSN from "../../content-packs/fr-SN/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frSN from "../../content-packs/fr-SN/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frSN from "../../content-packs/fr-SN/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Reports_Burn_Down_Index_frSN from "../../content-packs/fr-SN/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frSN from "../../content-packs/fr-SN/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frSN from "../../content-packs/fr-SN/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_frSN from "../../content-packs/fr-SN/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_frCD from "../../content-packs/fr-CD/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_frCD from "../../content-packs/fr-CD/books/registry-titles.json" with { type: "json" };
import Books_Ui_frCD from "../../content-packs/fr-CD/books/ui.json" with { type: "json" };
import Demo_Ui_frCD from "../../content-packs/fr-CD/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_frCD from "../../content-packs/fr-CD/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frCD from "../../content-packs/fr-CD/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frCD from "../../content-packs/fr-CD/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frCD from "../../content-packs/fr-CD/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_frCD from "../../content-packs/fr-CD/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_frCD from "../../content-packs/fr-CD/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frCD from "../../content-packs/fr-CD/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frCD from "../../content-packs/fr-CD/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frCD from "../../content-packs/fr-CD/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Reports_Burn_Down_Index_frCD from "../../content-packs/fr-CD/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frCD from "../../content-packs/fr-CD/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frCD from "../../content-packs/fr-CD/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_frCD from "../../content-packs/fr-CD/rewards/ui.json" with { type: "json" };
import Books_Registry_titles_esUS from "../../content-packs/es-US/books/registry-titles.json" with { type: "json" };
import Books_Ui_esUS from "../../content-packs/es-US/books/ui.json" with { type: "json" };
import Demo_Ui_esUS from "../../content-packs/es-US/demo/ui.json" with { type: "json" };
import Global_burn_down_Components_Promo_PromoMobileCompareVideo_esUS from "../../content-packs/es-US/global-burn-down/components__promo__PromoMobileCompareVideo.json" with { type: "json" };
import Global_burn_down_Lib_Site_Public_page_seo_esUS from "../../content-packs/es-US/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_burn_down_Lib_Teacher_portal_Teacher_class_grade_esUS from "../../content-packs/es-US/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_burn_down_Lib_Teacher_server_Teacher_dashboard_server_esUS from "../../content-packs/es-US/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_burn_down_Lib_Worksheets_Worksheet_meta_labels_en_server_esUS from "../../content-packs/es-US/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_burn_down_Lib_Worksheets_Worksheet_ui_esUS from "../../content-packs/es-US/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import Global_burn_down_Pages_App_esUS from "../../content-packs/es-US/global-burn-down/pages___app.json" with { type: "json" };
import Rewards_Ui_esUS from "../../content-packs/es-US/rewards/ui.json" with { type: "json" };
import Global_burn_down_Burn_down_index_ruKZ from "../../content-packs/ru-KZ/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_burn_down_Lib_Site_Public_page_seo_ruKZ from "../../content-packs/ru-KZ/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_burn_down_Pages_School_Classes_Index_ruKZ from "../../content-packs/ru-KZ/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_burn_down_Burn_down_index_ruUZ from "../../content-packs/ru-UZ/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_burn_down_Components_Teacher_portal_TeacherDashboardClient_ruUZ from "../../content-packs/ru-UZ/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import Global_burn_down_Lib_Site_Public_page_seo_ruUZ from "../../content-packs/ru-UZ/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_burn_down_Pages_School_Classes_Index_ruUZ from "../../content-packs/ru-UZ/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_burn_down_Burn_down_index_ruKG from "../../content-packs/ru-KG/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_burn_down_Components_Teacher_portal_TeacherDashboardClient_ruKG from "../../content-packs/ru-KG/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import Global_burn_down_Lib_Site_Public_page_seo_ruKG from "../../content-packs/ru-KG/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_burn_down_Pages_School_Classes_Index_ruKG from "../../content-packs/ru-KG/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_burn_down_Pages_School_Students_Index_ruKG from "../../content-packs/ru-KG/global-burn-down/pages__school__students__index.json" with { type: "json" };
import Global_burn_down_Burn_down_index_ruBY from "../../content-packs/ru-BY/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_burn_down_Lib_Site_Public_page_seo_ruBY from "../../content-packs/ru-BY/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_burn_down_Pages_School_Classes_Index_ruBY from "../../content-packs/ru-BY/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Books_English_page_skills_enRW from "../../content-packs/en-RW/books/english-page-skills.json" with { type: "json" };
import Books_Registry_titles_enRW from "../../content-packs/en-RW/books/registry-titles.json" with { type: "json" };
import Books_Ui_enRW from "../../content-packs/en-RW/books/ui.json" with { type: "json" };
import Demo_Ui_enRW from "../../content-packs/en-RW/demo/ui.json" with { type: "json" };
import Games_Burn_down_index_enRW from "../../content-packs/en-RW/games/burn-down-index.json" with { type: "json" };
import Games_Burn_down_Components_Educational_games_Leo_lab_Leo_lab_data_enRW from "../../content-packs/en-RW/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_down_Components_Educational_games_Leo_lab_Leo_lab_experiments_clean_enRW from "../../content-packs/en-RW/games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json" with { type: "json" };
import Games_Burn_down_Components_Educational_games_Leo_word_detective_Leo_word_detective_data_enRW from "../../content-packs/en-RW/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_down_Components_Educational_games_Leo_word_train_Leo_word_train_data_enRW from "../../content-packs/en-RW/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Games_Burn_down_Components_Solo_games_Prototypes_Dev_ConnectColorsPrototype_enRW from "../../content-packs/en-RW/games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json" with { type: "json" };
import Games_Burn_down_Lib_Educational_games_Educational_game_registry_enRW from "../../content-packs/en-RW/games/burn-down/lib__educational-games__educational-game-registry.json" with { type: "json" };
import Games_Burn_down_Lib_Solo_games_Solo_game_registry_enRW from "../../content-packs/en-RW/games/burn-down/lib__solo-games__solo-game-registry.json" with { type: "json" };
import Games_Sort_shapes_enRW from "../../content-packs/en-RW/games/sort-shapes.json" with { type: "json" };
import Games_Ui_pack_index_enRW from "../../content-packs/en-RW/games/ui-pack-index.json" with { type: "json" };
import Global_burn_down_Burn_down_index_enRW from "../../content-packs/en-RW/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_burn_down_Lib_Learning_Subject_permissions_Subject_access_server_enRW from "../../content-packs/en-RW/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import Global_burn_down_Lib_Site_Public_page_seo_enRW from "../../content-packs/en-RW/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_burn_down_Lib_Teacher_portal_Teacher_class_grade_enRW from "../../content-packs/en-RW/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_burn_down_Lib_Teacher_server_Teacher_dashboard_server_enRW from "../../content-packs/en-RW/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_burn_down_Lib_Worksheets_Worksheet_meta_labels_en_server_enRW from "../../content-packs/en-RW/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_burn_down_Lib_Worksheets_Worksheet_ui_enRW from "../../content-packs/en-RW/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import Global_burn_down_Pages_App_enRW from "../../content-packs/en-RW/global-burn-down/pages___app.json" with { type: "json" };
import Global_burn_down_Pages_Api_Parent_Create_student_enRW from "../../content-packs/en-RW/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import Global_burn_down_Pages_School_Classes_Index_enRW from "../../content-packs/en-RW/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_burn_down_Pages_School_Students_Index_enRW from "../../content-packs/en-RW/global-burn-down/pages__school__students__index.json" with { type: "json" };
import Global_burn_down_Utils_Question_metadata_qa_Question_bank_discovery_enRW from "../../content-packs/en-RW/global-burn-down/utils__question-metadata-qa__question-bank-discovery.json" with { type: "json" };
import Learning_Burn_down_index_enRW from "../../content-packs/en-RW/learning/burn-down-index.json" with { type: "json" };
import Learning_Burn_down_Components_Parent_ParentCurriculumContent_enRW from "../../content-packs/en-RW/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import Learning_Burn_down_Pages_Learning_English_master_enRW from "../../content-packs/en-RW/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import Learning_Burn_down_Utils_Topic_next_step_engine_enRW from "../../content-packs/en-RW/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import Learning_Diagnostic_labels_enRW from "../../content-packs/en-RW/learning/diagnostic-labels.json" with { type: "json" };
import Learning_Example_pattern_diagnostics_payload_enRW from "../../content-packs/en-RW/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import Reports_Burn_down_index_enRW from "../../content-packs/en-RW/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_down_Components_Parent_report_detailed_surface_enRW from "../../content-packs/en-RW/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_down_Utils_Parent_report_language_Grade_aware_recommendation_templates_enRW from "../../content-packs/en-RW/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Reports_Burn_down_Utils_Parent_report_out_of_grade_transparency_enRW from "../../content-packs/en-RW/reports/burn-down/utils__parent-report-out-of-grade-transparency.json" with { type: "json" };
import Reports_Burn_down_Utils_Parent_report_output_integrity_Zero_evidence_policy_tests_enRW from "../../content-packs/en-RW/reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json" with { type: "json" };
import Reports_Burn_down_Utils_Parent_report_surface_Parent_topic_tier_enRW from "../../content-packs/en-RW/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import Rewards_Card_catalog_enRW from "../../content-packs/en-RW/rewards/card-catalog.json" with { type: "json" };
import Rewards_Ui_enRW from "../../content-packs/en-RW/rewards/ui.json" with { type: "json" };
import Books_English_page_skills_frCM from "../../content-packs/fr-CM/books/english-page-skills.json" with { type: "json" };
import Books_Registry_titles_frCM from "../../content-packs/fr-CM/books/registry-titles.json" with { type: "json" };
import Books_Ui_frCM from "../../content-packs/fr-CM/books/ui.json" with { type: "json" };
import Demo_Ui_frCM from "../../content-packs/fr-CM/demo/ui.json" with { type: "json" };
import Games_Burn_down_index_frCM from "../../content-packs/fr-CM/games/burn-down-index.json" with { type: "json" };
import Games_Burn_down_Components_Educational_games_Leo_lab_Leo_lab_data_frCM from "../../content-packs/fr-CM/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_down_Components_Educational_games_Leo_word_detective_Leo_word_detective_data_frCM from "../../content-packs/fr-CM/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_down_Components_Educational_games_Leo_word_train_Leo_word_train_data_frCM from "../../content-packs/fr-CM/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_burn_down_Burn_down_index_frCM from "../../content-packs/fr-CM/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_burn_down_Components_School_portal_SchoolTeacherClassStudentsModal_frCM from "../../content-packs/fr-CM/global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json" with { type: "json" };
import Global_burn_down_Components_Teacher_portal_TeacherClassReportModal_frCM from "../../content-packs/fr-CM/global-burn-down/components__teacher-portal__TeacherClassReportModal.json" with { type: "json" };
import Global_burn_down_Components_Teacher_portal_TeacherDashboardClient_frCM from "../../content-packs/fr-CM/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import Global_burn_down_Components_Worksheet_activities_TeacherWorksheetReport_frCM from "../../content-packs/fr-CM/global-burn-down/components__worksheet-activities__TeacherWorksheetReport.json" with { type: "json" };
import Global_burn_down_Lib_Site_Public_page_seo_frCM from "../../content-packs/fr-CM/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_burn_down_Lib_Teacher_portal_Teacher_class_grade_frCM from "../../content-packs/fr-CM/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_burn_down_Lib_Teacher_portal_Teacher_smoke_artifacts_frCM from "../../content-packs/fr-CM/global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json" with { type: "json" };
import Global_burn_down_Lib_Teacher_server_Teacher_dashboard_server_frCM from "../../content-packs/fr-CM/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_burn_down_Lib_Worksheets_Worksheet_meta_labels_en_server_frCM from "../../content-packs/fr-CM/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_burn_down_Pages_Teacher_Class_ClassId_frCM from "../../content-packs/fr-CM/global-burn-down/pages__teacher__class__[classId].json" with { type: "json" };
import Global_burn_down_Pages_Teacher_Class_ClassId_Activities_Index_frCM from "../../content-packs/fr-CM/global-burn-down/pages__teacher__class__[classId]__activities__index.json" with { type: "json" };
import Global_burn_down_Pages_Teacher_Class_ClassId_Worksheets_WorksheetId_Grade_StudentId_frCM from "../../content-packs/fr-CM/global-burn-down/pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import Global_burn_down_Pages_Teacher_Worksheets_WorksheetId_Grade_StudentId_frCM from "../../content-packs/fr-CM/global-burn-down/pages__teacher__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import Reports_Burn_down_index_frCM from "../../content-packs/fr-CM/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_down_Components_Parent_report_detailed_surface_frCM from "../../content-packs/fr-CM/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_down_Utils_Parent_report_language_Grade_aware_recommendation_templates_frCM from "../../content-packs/fr-CM/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_frCM from "../../content-packs/fr-CM/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_enCM from "../../content-packs/en-CM/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_enCM from "../../content-packs/en-CM/books/registry-titles.json" with { type: "json" };
import Books_Ui_enCM from "../../content-packs/en-CM/books/ui.json" with { type: "json" };
import Demo_Ui_enCM from "../../content-packs/en-CM/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_enCM from "../../content-packs/en-CM/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enCM from "../../content-packs/en-CM/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enCM from "../../content-packs/en-CM/games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enCM from "../../content-packs/en-CM/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enCM from "../../content-packs/en-CM/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enCM from "../../content-packs/en-CM/games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json" with { type: "json" };
import Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enCM from "../../content-packs/en-CM/games/burn-down/lib__educational-games__educational-game-registry.json" with { type: "json" };
import Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enCM from "../../content-packs/en-CM/games/burn-down/lib__solo-games__solo-game-registry.json" with { type: "json" };
import Games_Sort_Shapes_enCM from "../../content-packs/en-CM/games/sort-shapes.json" with { type: "json" };
import Games_Ui_Pack_Index_enCM from "../../content-packs/en-CM/games/ui-pack-index.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_enCM from "../../content-packs/en-CM/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_enCM from "../../content-packs/en-CM/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_enCM from "../../content-packs/en-CM/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_enCM from "../../content-packs/en-CM/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_enCM from "../../content-packs/en-CM/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_enCM from "../../content-packs/en-CM/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enCM from "../../content-packs/en-CM/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import Global_Burn_Down_Pages_App_enCM from "../../content-packs/en-CM/global-burn-down/pages___app.json" with { type: "json" };
import Global_Burn_Down_Pages_Api_Parent_Create_Student_enCM from "../../content-packs/en-CM/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Classes_Index_enCM from "../../content-packs/en-CM/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Students_Index_enCM from "../../content-packs/en-CM/global-burn-down/pages__school__students__index.json" with { type: "json" };
import Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enCM from "../../content-packs/en-CM/global-burn-down/utils__question-metadata-qa__question-bank-discovery.json" with { type: "json" };
import Learning_Burn_Down_Index_enCM from "../../content-packs/en-CM/learning/burn-down-index.json" with { type: "json" };
import Learning_Burn_Down_Components_Parent_ParentCurriculumContent_enCM from "../../content-packs/en-CM/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import Learning_Burn_Down_Pages_Learning_English_Master_enCM from "../../content-packs/en-CM/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import Learning_Burn_Down_Utils_Topic_Next_Step_Engine_enCM from "../../content-packs/en-CM/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import Learning_Diagnostic_Labels_enCM from "../../content-packs/en-CM/learning/diagnostic-labels.json" with { type: "json" };
import Learning_Example_Pattern_Diagnostics_Payload_enCM from "../../content-packs/en-CM/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import Reports_Burn_Down_Index_enCM from "../../content-packs/en-CM/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_enCM from "../../content-packs/en-CM/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enCM from "../../content-packs/en-CM/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Out_Of_Grade_Transparency_enCM from "../../content-packs/en-CM/reports/burn-down/utils__parent-report-out-of-grade-transparency.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enCM from "../../content-packs/en-CM/reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enCM from "../../content-packs/en-CM/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import Rewards_Card_Catalog_enCM from "../../content-packs/en-CM/rewards/card-catalog.json" with { type: "json" };
import Rewards_Ui_enCM from "../../content-packs/en-CM/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_frBJ from "../../content-packs/fr-BJ/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_frBJ from "../../content-packs/fr-BJ/books/registry-titles.json" with { type: "json" };
import Books_Ui_frBJ from "../../content-packs/fr-BJ/books/ui.json" with { type: "json" };
import Demo_Ui_frBJ from "../../content-packs/fr-BJ/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_frBJ from "../../content-packs/fr-BJ/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frBJ from "../../content-packs/fr-BJ/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frBJ from "../../content-packs/fr-BJ/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frBJ from "../../content-packs/fr-BJ/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_frBJ from "../../content-packs/fr-BJ/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_frBJ from "../../content-packs/fr-BJ/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frBJ from "../../content-packs/fr-BJ/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frBJ from "../../content-packs/fr-BJ/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frBJ from "../../content-packs/fr-BJ/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Reports_Burn_Down_Index_frBJ from "../../content-packs/fr-BJ/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frBJ from "../../content-packs/fr-BJ/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frBJ from "../../content-packs/fr-BJ/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_frBJ from "../../content-packs/fr-BJ/rewards/ui.json" with { type: "json" };
import Books_Registry_Titles_enMU from "../../content-packs/en-MU/books/registry-titles.json" with { type: "json" };
import Books_Ui_enMU from "../../content-packs/en-MU/books/ui.json" with { type: "json" };
import Demo_Ui_enMU from "../../content-packs/en-MU/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_enMU from "../../content-packs/en-MU/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enMU from "../../content-packs/en-MU/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enMU from "../../content-packs/en-MU/games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enMU from "../../content-packs/en-MU/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enMU from "../../content-packs/en-MU/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enMU from "../../content-packs/en-MU/games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json" with { type: "json" };
import Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enMU from "../../content-packs/en-MU/games/burn-down/lib__educational-games__educational-game-registry.json" with { type: "json" };
import Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enMU from "../../content-packs/en-MU/games/burn-down/lib__solo-games__solo-game-registry.json" with { type: "json" };
import Games_Sort_Shapes_enMU from "../../content-packs/en-MU/games/sort-shapes.json" with { type: "json" };
import Games_Ui_Pack_Index_enMU from "../../content-packs/en-MU/games/ui-pack-index.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_enMU from "../../content-packs/en-MU/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_enMU from "../../content-packs/en-MU/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enMU from "../../content-packs/en-MU/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import Global_Burn_Down_Pages_App_enMU from "../../content-packs/en-MU/global-burn-down/pages___app.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Classes_Index_enMU from "../../content-packs/en-MU/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enMU from "../../content-packs/en-MU/global-burn-down/utils__question-metadata-qa__question-bank-discovery.json" with { type: "json" };
import Learning_Burn_Down_Index_enMU from "../../content-packs/en-MU/learning/burn-down-index.json" with { type: "json" };
import Learning_Burn_Down_Pages_Learning_English_Master_enMU from "../../content-packs/en-MU/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import Learning_Example_Pattern_Diagnostics_Payload_enMU from "../../content-packs/en-MU/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import Reports_Burn_Down_Index_enMU from "../../content-packs/en-MU/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enMU from "../../content-packs/en-MU/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enMU from "../../content-packs/en-MU/reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enMU from "../../content-packs/en-MU/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import Rewards_Card_Catalog_enMU from "../../content-packs/en-MU/rewards/card-catalog.json" with { type: "json" };
import Rewards_Ui_enMU from "../../content-packs/en-MU/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_frGN from "../../content-packs/fr-GN/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_frGN from "../../content-packs/fr-GN/books/registry-titles.json" with { type: "json" };
import Books_Ui_frGN from "../../content-packs/fr-GN/books/ui.json" with { type: "json" };
import Demo_Ui_frGN from "../../content-packs/fr-GN/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_frGN from "../../content-packs/fr-GN/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frGN from "../../content-packs/fr-GN/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frGN from "../../content-packs/fr-GN/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frGN from "../../content-packs/fr-GN/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_frGN from "../../content-packs/fr-GN/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_frGN from "../../content-packs/fr-GN/global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_frGN from "../../content-packs/fr-GN/global-burn-down/components__teacher-portal__TeacherClassReportModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_frGN from "../../content-packs/fr-GN/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import Global_Burn_Down_Components_Worksheet_Activities_TeacherWorksheetReport_frGN from "../../content-packs/fr-GN/global-burn-down/components__worksheet-activities__TeacherWorksheetReport.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_frGN from "../../content-packs/fr-GN/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frGN from "../../content-packs/fr-GN/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_frGN from "../../content-packs/fr-GN/global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frGN from "../../content-packs/fr-GN/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frGN from "../../content-packs/fr-GN/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_frGN from "../../content-packs/fr-GN/global-burn-down/pages__teacher__class__[classId].json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_frGN from "../../content-packs/fr-GN/global-burn-down/pages__teacher__class__[classId]__activities__index.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_Worksheets_WorksheetId_Grade_StudentId_frGN from "../../content-packs/fr-GN/global-burn-down/pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Worksheets_WorksheetId_Grade_StudentId_frGN from "../../content-packs/fr-GN/global-burn-down/pages__teacher__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import Reports_Burn_Down_Index_frGN from "../../content-packs/fr-GN/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frGN from "../../content-packs/fr-GN/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frGN from "../../content-packs/fr-GN/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_frGN from "../../content-packs/fr-GN/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_frTG from "../../content-packs/fr-TG/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_frTG from "../../content-packs/fr-TG/books/registry-titles.json" with { type: "json" };
import Books_Ui_frTG from "../../content-packs/fr-TG/books/ui.json" with { type: "json" };
import Demo_Ui_frTG from "../../content-packs/fr-TG/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_frTG from "../../content-packs/fr-TG/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frTG from "../../content-packs/fr-TG/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frTG from "../../content-packs/fr-TG/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frTG from "../../content-packs/fr-TG/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_frTG from "../../content-packs/fr-TG/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_frTG from "../../content-packs/fr-TG/global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_frTG from "../../content-packs/fr-TG/global-burn-down/components__teacher-portal__TeacherClassReportModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_frTG from "../../content-packs/fr-TG/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import Global_Burn_Down_Components_Worksheet_Activities_TeacherWorksheetReport_frTG from "../../content-packs/fr-TG/global-burn-down/components__worksheet-activities__TeacherWorksheetReport.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_frTG from "../../content-packs/fr-TG/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frTG from "../../content-packs/fr-TG/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_frTG from "../../content-packs/fr-TG/global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frTG from "../../content-packs/fr-TG/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frTG from "../../content-packs/fr-TG/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_frTG from "../../content-packs/fr-TG/global-burn-down/pages__teacher__class__[classId].json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_frTG from "../../content-packs/fr-TG/global-burn-down/pages__teacher__class__[classId]__activities__index.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_Worksheets_WorksheetId_Grade_StudentId_frTG from "../../content-packs/fr-TG/global-burn-down/pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Worksheets_WorksheetId_Grade_StudentId_frTG from "../../content-packs/fr-TG/global-burn-down/pages__teacher__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import Reports_Burn_Down_Index_frTG from "../../content-packs/fr-TG/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frTG from "../../content-packs/fr-TG/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frTG from "../../content-packs/fr-TG/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_frTG from "../../content-packs/fr-TG/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_frGA from "../../content-packs/fr-GA/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_frGA from "../../content-packs/fr-GA/books/registry-titles.json" with { type: "json" };
import Books_Ui_frGA from "../../content-packs/fr-GA/books/ui.json" with { type: "json" };
import Demo_Ui_frGA from "../../content-packs/fr-GA/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_frGA from "../../content-packs/fr-GA/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frGA from "../../content-packs/fr-GA/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frGA from "../../content-packs/fr-GA/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frGA from "../../content-packs/fr-GA/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_frGA from "../../content-packs/fr-GA/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_frGA from "../../content-packs/fr-GA/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frGA from "../../content-packs/fr-GA/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frGA from "../../content-packs/fr-GA/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frGA from "../../content-packs/fr-GA/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Reports_Burn_Down_Index_frGA from "../../content-packs/fr-GA/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frGA from "../../content-packs/fr-GA/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frGA from "../../content-packs/fr-GA/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_frGA from "../../content-packs/fr-GA/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_frCG from "../../content-packs/fr-CG/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_frCG from "../../content-packs/fr-CG/books/registry-titles.json" with { type: "json" };
import Books_Ui_frCG from "../../content-packs/fr-CG/books/ui.json" with { type: "json" };
import Demo_Ui_frCG from "../../content-packs/fr-CG/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_frCG from "../../content-packs/fr-CG/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frCG from "../../content-packs/fr-CG/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frCG from "../../content-packs/fr-CG/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frCG from "../../content-packs/fr-CG/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_frCG from "../../content-packs/fr-CG/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_frCG from "../../content-packs/fr-CG/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frCG from "../../content-packs/fr-CG/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frCG from "../../content-packs/fr-CG/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frCG from "../../content-packs/fr-CG/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Reports_Burn_Down_Index_frCG from "../../content-packs/fr-CG/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frCG from "../../content-packs/fr-CG/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frCG from "../../content-packs/fr-CG/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_frCG from "../../content-packs/fr-CG/rewards/ui.json" with { type: "json" };
import Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_enCM from "../../content-packs/en-CM/global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_enCM from "../../content-packs/en-CM/global-burn-down/components__teacher-portal__TeacherClassReportModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_enCM from "../../content-packs/en-CM/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_enCM from "../../content-packs/en-CM/global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_enCM from "../../content-packs/en-CM/global-burn-down/pages__teacher__class__[classId].json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_enCM from "../../content-packs/en-CM/global-burn-down/pages__teacher__class__[classId]__activities__index.json" with { type: "json" };
import Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_frBJ from "../../content-packs/fr-BJ/global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_frBJ from "../../content-packs/fr-BJ/global-burn-down/components__teacher-portal__TeacherClassReportModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_frBJ from "../../content-packs/fr-BJ/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import Global_Burn_Down_Components_Worksheet_Activities_TeacherWorksheetReport_frBJ from "../../content-packs/fr-BJ/global-burn-down/components__worksheet-activities__TeacherWorksheetReport.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_frBJ from "../../content-packs/fr-BJ/global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_frBJ from "../../content-packs/fr-BJ/global-burn-down/pages__teacher__class__[classId].json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_frBJ from "../../content-packs/fr-BJ/global-burn-down/pages__teacher__class__[classId]__activities__index.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_Worksheets_WorksheetId_Grade_StudentId_frBJ from "../../content-packs/fr-BJ/global-burn-down/pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Worksheets_WorksheetId_Grade_StudentId_frBJ from "../../content-packs/fr-BJ/global-burn-down/pages__teacher__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_frGA from "../../content-packs/fr-GA/global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_frGA from "../../content-packs/fr-GA/global-burn-down/components__teacher-portal__TeacherClassReportModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_frGA from "../../content-packs/fr-GA/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import Global_Burn_Down_Components_Worksheet_Activities_TeacherWorksheetReport_frGA from "../../content-packs/fr-GA/global-burn-down/components__worksheet-activities__TeacherWorksheetReport.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_frGA from "../../content-packs/fr-GA/global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_frGA from "../../content-packs/fr-GA/global-burn-down/pages__teacher__class__[classId].json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_frGA from "../../content-packs/fr-GA/global-burn-down/pages__teacher__class__[classId]__activities__index.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_Worksheets_WorksheetId_Grade_StudentId_frGA from "../../content-packs/fr-GA/global-burn-down/pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Worksheets_WorksheetId_Grade_StudentId_frGA from "../../content-packs/fr-GA/global-burn-down/pages__teacher__worksheets__[worksheetId]__grade__[studentId].json" with { type: "json" };
import Books_English_Page_Skills_nlSR from "../../content-packs/nl-SR/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_nlSR from "../../content-packs/nl-SR/books/registry-titles.json" with { type: "json" };
import Books_Ui_nlSR from "../../content-packs/nl-SR/books/ui.json" with { type: "json" };
import Demo_Ui_nlSR from "../../content-packs/nl-SR/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_nlSR from "../../content-packs/nl-SR/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_nlSR from "../../content-packs/nl-SR/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_nlSR from "../../content-packs/nl-SR/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_nlSR from "../../content-packs/nl-SR/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_nlSR from "../../content-packs/nl-SR/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_nlSR from "../../content-packs/nl-SR/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_nlSR from "../../content-packs/nl-SR/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_nlSR from "../../content-packs/nl-SR/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_nlSR from "../../content-packs/nl-SR/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_nlSR from "../../content-packs/nl-SR/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_nlSR from "../../content-packs/nl-SR/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import Global_Burn_Down_Pages_App_nlSR from "../../content-packs/nl-SR/global-burn-down/pages___app.json" with { type: "json" };
import Global_Burn_Down_Pages_Api_Parent_Create_Student_nlSR from "../../content-packs/nl-SR/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Classes_Index_nlSR from "../../content-packs/nl-SR/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Students_Index_nlSR from "../../content-packs/nl-SR/global-burn-down/pages__school__students__index.json" with { type: "json" };
import Reports_Burn_Down_Index_nlSR from "../../content-packs/nl-SR/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_nlSR from "../../content-packs/nl-SR/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_nlSR from "../../content-packs/nl-SR/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Rewards_Ui_nlSR from "../../content-packs/nl-SR/rewards/ui.json" with { type: "json" };
import Demo_Ui_ptCV from "../../content-packs/pt-CV/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_ptCV from "../../content-packs/pt-CV/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_ptCV from "../../content-packs/pt-CV/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_ptCV from "../../content-packs/pt-CV/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_ptCV from "../../content-packs/pt-CV/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_ptCV from "../../content-packs/pt-CV/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_ptCV from "../../content-packs/pt-CV/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Pages_App_ptCV from "../../content-packs/pt-CV/global-burn-down/pages___app.json" with { type: "json" };
import Learning_Burn_Down_Index_ptCV from "../../content-packs/pt-CV/learning/burn-down-index.json" with { type: "json" };
import Learning_Burn_Down_Components_Parent_ParentCurriculumContent_ptCV from "../../content-packs/pt-CV/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import Rewards_Ui_ptCV from "../../content-packs/pt-CV/rewards/ui.json" with { type: "json" };
import Books_Registry_Titles_esGQ from "../../content-packs/es-GQ/books/registry-titles.json" with { type: "json" };
import Books_Ui_esGQ from "../../content-packs/es-GQ/books/ui.json" with { type: "json" };
import Demo_Ui_esGQ from "../../content-packs/es-GQ/demo/ui.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_esGQ from "../../content-packs/es-GQ/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_esGQ from "../../content-packs/es-GQ/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_esGQ from "../../content-packs/es-GQ/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_esGQ from "../../content-packs/es-GQ/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_Burn_Down_Pages_App_esGQ from "../../content-packs/es-GQ/global-burn-down/pages___app.json" with { type: "json" };
import Rewards_Ui_esGQ from "../../content-packs/es-GQ/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_enSL from "../../content-packs/en-SL/books/english-page-skills.json" with { type: "json" };
import Books_Registry_Titles_enSL from "../../content-packs/en-SL/books/registry-titles.json" with { type: "json" };
import Books_Ui_enSL from "../../content-packs/en-SL/books/ui.json" with { type: "json" };
import Demo_Ui_enSL from "../../content-packs/en-SL/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_enSL from "../../content-packs/en-SL/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enSL from "../../content-packs/en-SL/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enSL from "../../content-packs/en-SL/games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enSL from "../../content-packs/en-SL/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enSL from "../../content-packs/en-SL/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enSL from "../../content-packs/en-SL/games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json" with { type: "json" };
import Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enSL from "../../content-packs/en-SL/games/burn-down/lib__educational-games__educational-game-registry.json" with { type: "json" };
import Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enSL from "../../content-packs/en-SL/games/burn-down/lib__solo-games__solo-game-registry.json" with { type: "json" };
import Games_Sort_Shapes_enSL from "../../content-packs/en-SL/games/sort-shapes.json" with { type: "json" };
import Games_Ui_Pack_Index_enSL from "../../content-packs/en-SL/games/ui-pack-index.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_enSL from "../../content-packs/en-SL/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_enSL from "../../content-packs/en-SL/global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_enSL from "../../content-packs/en-SL/global-burn-down/components__teacher-portal__TeacherClassReportModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_enSL from "../../content-packs/en-SL/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_enSL from "../../content-packs/en-SL/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_enSL from "../../content-packs/en-SL/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_enSL from "../../content-packs/en-SL/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_enSL from "../../content-packs/en-SL/global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_enSL from "../../content-packs/en-SL/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_enSL from "../../content-packs/en-SL/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enSL from "../../content-packs/en-SL/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import Global_Burn_Down_Pages_App_enSL from "../../content-packs/en-SL/global-burn-down/pages___app.json" with { type: "json" };
import Global_Burn_Down_Pages_Api_Parent_Create_Student_enSL from "../../content-packs/en-SL/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Classes_Index_enSL from "../../content-packs/en-SL/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Students_Index_enSL from "../../content-packs/en-SL/global-burn-down/pages__school__students__index.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_enSL from "../../content-packs/en-SL/global-burn-down/pages__teacher__class__[classId].json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_enSL from "../../content-packs/en-SL/global-burn-down/pages__teacher__class__[classId]__activities__index.json" with { type: "json" };
import Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enSL from "../../content-packs/en-SL/global-burn-down/utils__question-metadata-qa__question-bank-discovery.json" with { type: "json" };
import Learning_Burn_Down_Index_enSL from "../../content-packs/en-SL/learning/burn-down-index.json" with { type: "json" };
import Learning_Burn_Down_Components_Parent_ParentCurriculumContent_enSL from "../../content-packs/en-SL/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import Learning_Burn_Down_Pages_Learning_English_Master_enSL from "../../content-packs/en-SL/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import Learning_Burn_Down_Utils_Topic_Next_Step_Engine_enSL from "../../content-packs/en-SL/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import Learning_Diagnostic_Labels_enSL from "../../content-packs/en-SL/learning/diagnostic-labels.json" with { type: "json" };
import Learning_Example_Pattern_Diagnostics_Payload_enSL from "../../content-packs/en-SL/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import Reports_Burn_Down_Index_enSL from "../../content-packs/en-SL/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_enSL from "../../content-packs/en-SL/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enSL from "../../content-packs/en-SL/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Out_Of_Grade_Transparency_enSL from "../../content-packs/en-SL/reports/burn-down/utils__parent-report-out-of-grade-transparency.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enSL from "../../content-packs/en-SL/reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enSL from "../../content-packs/en-SL/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import Rewards_Card_Catalog_enSL from "../../content-packs/en-SL/rewards/card-catalog.json" with { type: "json" };
import Rewards_Ui_enSL from "../../content-packs/en-SL/rewards/ui.json" with { type: "json" };
import Games_Burn_Down_Index_enLR from "../../content-packs/en-LR/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enLR from "../../content-packs/en-LR/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enLR from "../../content-packs/en-LR/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enLR from "../../content-packs/en-LR/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_enLR from "../../content-packs/en-LR/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_enLR from "../../content-packs/en-LR/global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_enLR from "../../content-packs/en-LR/global-burn-down/components__teacher-portal__TeacherClassReportModal.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_enLR from "../../content-packs/en-LR/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_enLR from "../../content-packs/en-LR/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_enLR from "../../content-packs/en-LR/global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enLR from "../../content-packs/en-LR/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import Global_Burn_Down_Pages_App_enLR from "../../content-packs/en-LR/global-burn-down/pages___app.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Classes_Index_enLR from "../../content-packs/en-LR/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_enLR from "../../content-packs/en-LR/global-burn-down/pages__teacher__class__[classId].json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_enLR from "../../content-packs/en-LR/global-burn-down/pages__teacher__class__[classId]__activities__index.json" with { type: "json" };
import Learning_Burn_Down_Index_enLR from "../../content-packs/en-LR/learning/burn-down-index.json" with { type: "json" };
import Learning_Burn_Down_Pages_Learning_English_Master_enLR from "../../content-packs/en-LR/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import Rewards_Ui_enLR from "../../content-packs/en-LR/rewards/ui.json" with { type: "json" };
import Books_Registry_Titles_enGM from "../../content-packs/en-GM/books/registry-titles.json" with { type: "json" };
import Books_Ui_enGM from "../../content-packs/en-GM/books/ui.json" with { type: "json" };
import Demo_Ui_enGM from "../../content-packs/en-GM/demo/ui.json" with { type: "json" };
import Games_Burn_Down_Index_enGM from "../../content-packs/en-GM/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enGM from "../../content-packs/en-GM/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enGM from "../../content-packs/en-GM/games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enGM from "../../content-packs/en-GM/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enGM from "../../content-packs/en-GM/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enGM from "../../content-packs/en-GM/games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json" with { type: "json" };
import Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enGM from "../../content-packs/en-GM/games/burn-down/lib__educational-games__educational-game-registry.json" with { type: "json" };
import Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enGM from "../../content-packs/en-GM/games/burn-down/lib__solo-games__solo-game-registry.json" with { type: "json" };
import Games_Sort_Shapes_enGM from "../../content-packs/en-GM/games/sort-shapes.json" with { type: "json" };
import Games_Ui_Pack_Index_enGM from "../../content-packs/en-GM/games/ui-pack-index.json" with { type: "json" };
import Global_Burn_Down_Burn_Down_Index_enGM from "../../content-packs/en-GM/global-burn-down/burn-down-index.json" with { type: "json" };
import Global_Burn_Down_Lib_Site_Public_Page_Seo_enGM from "../../content-packs/en-GM/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enGM from "../../content-packs/en-GM/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import Global_Burn_Down_Pages_App_enGM from "../../content-packs/en-GM/global-burn-down/pages___app.json" with { type: "json" };
import Global_Burn_Down_Pages_School_Classes_Index_enGM from "../../content-packs/en-GM/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enGM from "../../content-packs/en-GM/global-burn-down/utils__question-metadata-qa__question-bank-discovery.json" with { type: "json" };
import Learning_Burn_Down_Index_enGM from "../../content-packs/en-GM/learning/burn-down-index.json" with { type: "json" };
import Learning_Burn_Down_Pages_Learning_English_Master_enGM from "../../content-packs/en-GM/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import Learning_Example_Pattern_Diagnostics_Payload_enGM from "../../content-packs/en-GM/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import Reports_Burn_Down_Index_enGM from "../../content-packs/en-GM/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enGM from "../../content-packs/en-GM/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enGM from "../../content-packs/en-GM/reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enGM from "../../content-packs/en-GM/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import Rewards_Card_Catalog_enGM from "../../content-packs/en-GM/rewards/card-catalog.json" with { type: "json" };
import Rewards_Ui_enGM from "../../content-packs/en-GM/rewards/ui.json" with { type: "json" };
import Books_English_Page_Skills_ptCV from "../../content-packs/pt-CV/books/english-page-skills.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_ptCV from "../../content-packs/pt-CV/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import Global_Burn_Down_Lib_School_Portal_Operator_Grant_Labels_ptCV from "../../content-packs/pt-CV/global-burn-down/lib__school-portal__operator-grant-labels.json" with { type: "json" };
import Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_ptCV from "../../content-packs/pt-CV/global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Math_Practice_Format_ptCV from "../../content-packs/pt-CV/global-burn-down/lib__worksheets__worksheet-math-practice-format.json" with { type: "json" };
import Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_ptCV from "../../content-packs/pt-CV/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import Global_Burn_Down_Pages_Teacher_Class_ClassId_ptCV from "../../content-packs/pt-CV/global-burn-down/pages__teacher__class__[classId].json" with { type: "json" };
import Learning_Burn_Down_Pages_Learning_English_Master_ptCV from "../../content-packs/pt-CV/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import Learning_Diagnostic_Labels_ptCV from "../../content-packs/pt-CV/learning/diagnostic-labels.json" with { type: "json" };
import Reports_Burn_Down_Index_ptCV from "../../content-packs/pt-CV/reports/burn-down-index.json" with { type: "json" };
import Reports_Burn_Down_Utils_Math_Report_Generator_ptCV from "../../content-packs/pt-CV/reports/burn-down/utils__math-report-generator.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Insights_Normalize_Parent_Facing_Labels_ptCV from "../../content-packs/pt-CV/reports/burn-down/utils__parent-report-insights__normalize-parent-facing-labels.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Language_Parent_Report_Copy_Spec_ptCV from "../../content-packs/pt-CV/reports/burn-down/utils__parent-report-language__parent-report-copy-spec.json" with { type: "json" };
import Reports_Burn_Down_Utils_Parent_Report_Out_Of_Grade_Transparency_ptCV from "../../content-packs/pt-CV/reports/burn-down/utils__parent-report-out-of-grade-transparency.json" with { type: "json" };
import Games_Burn_Down_Index_esGQ from "../../content-packs/es-GQ/games/burn-down-index.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_esGQ from "../../content-packs/es-GQ/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_esGQ from "../../content-packs/es-GQ/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_esGQ from "../../content-packs/es-GQ/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_enGM from "../../content-packs/en-GM/global-burn-down/components__teacher-portal__TeacherDashboardClient.json" with { type: "json" };
import books_ui_EnAu from "../../content-packs/en-AU/books/ui.json" with { type: "json" };
import demo_ui_EnAu from "../../content-packs/en-AU/demo/ui.json" with { type: "json" };
import learning_diagnostic_labels_EnAu from "../../content-packs/en-AU/learning/diagnostic-labels.json" with { type: "json" };
import rewards_ui_EnAu from "../../content-packs/en-AU/rewards/ui.json" with { type: "json" };
import games_burn_down_index_EnAu from "../../content-packs/en-AU/games/burn-down-index.json" with { type: "json" };
import learning_burn_down_index_EnAu from "../../content-packs/en-AU/learning/burn-down-index.json" with { type: "json" };
import global_burn_down_burn_down_index_EnAu from "../../content-packs/en-AU/global-burn-down/burn-down-index.json" with { type: "json" };
import reports_burn_down_index_EnAu from "../../content-packs/en-AU/reports/burn-down-index.json" with { type: "json" };
import books_ui_EnNz from "../../content-packs/en-NZ/books/ui.json" with { type: "json" };
import books_registry_titles_EnNz from "../../content-packs/en-NZ/books/registry-titles.json" with { type: "json" };
import books_english_page_skills_EnNz from "../../content-packs/en-NZ/books/english-page-skills.json" with { type: "json" };
import demo_ui_EnNz from "../../content-packs/en-NZ/demo/ui.json" with { type: "json" };
import games_ui_pack_index_EnNz from "../../content-packs/en-NZ/games/ui-pack-index.json" with { type: "json" };
import games_sort_shapes_EnNz from "../../content-packs/en-NZ/games/sort-shapes.json" with { type: "json" };
import learning_diagnostic_labels_EnNz from "../../content-packs/en-NZ/learning/diagnostic-labels.json" with { type: "json" };
import learning_example_pattern_diagnostics_payload_EnNz from "../../content-packs/en-NZ/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import rewards_ui_EnNz from "../../content-packs/en-NZ/rewards/ui.json" with { type: "json" };
import rewards_card_catalog_EnNz from "../../content-packs/en-NZ/rewards/card-catalog.json" with { type: "json" };
import games_burn_down_index_EnNz from "../../content-packs/en-NZ/games/burn-down-index.json" with { type: "json" };
import learning_burn_down_index_EnNz from "../../content-packs/en-NZ/learning/burn-down-index.json" with { type: "json" };
import global_burn_down_burn_down_index_EnNz from "../../content-packs/en-NZ/global-burn-down/burn-down-index.json" with { type: "json" };
import reports_burn_down_index_EnNz from "../../content-packs/en-NZ/reports/burn-down-index.json" with { type: "json" };
import books_ui_EnIe from "../../content-packs/en-IE/books/ui.json" with { type: "json" };
import books_registry_titles_EnIe from "../../content-packs/en-IE/books/registry-titles.json" with { type: "json" };
import demo_ui_EnIe from "../../content-packs/en-IE/demo/ui.json" with { type: "json" };
import games_ui_pack_index_EnIe from "../../content-packs/en-IE/games/ui-pack-index.json" with { type: "json" };
import games_sort_shapes_EnIe from "../../content-packs/en-IE/games/sort-shapes.json" with { type: "json" };
import learning_diagnostic_labels_EnIe from "../../content-packs/en-IE/learning/diagnostic-labels.json" with { type: "json" };
import rewards_ui_EnIe from "../../content-packs/en-IE/rewards/ui.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_lab_leo_lab_data_EnIe from "../../content-packs/en-IE/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_lab_leo_lab_experiments_clean_EnIe from "../../content-packs/en-IE/games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_word_detective_leo_word_detective_data_EnIe from "../../content-packs/en-IE/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_word_train_leo_word_train_data_EnIe from "../../content-packs/en-IE/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import learning_burn_down_components_parent_ParentCurriculumContent_EnIe from "../../content-packs/en-IE/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import learning_burn_down_pages_learning_english_master_EnIe from "../../content-packs/en-IE/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import learning_burn_down_utils_topic_next_step_engine_EnIe from "../../content-packs/en-IE/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import global_burn_down_components_school_portal_SchoolDrillDown_EnIe from "../../content-packs/en-IE/global-burn-down/components__school-portal__SchoolDrillDown.json" with { type: "json" };
import global_burn_down_lib_learning_subject_permissions_subject_access_server_EnIe from "../../content-packs/en-IE/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import global_burn_down_lib_site_public_page_seo_EnIe from "../../content-packs/en-IE/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_burn_down_lib_teacher_portal_teacher_class_grade_EnIe from "../../content-packs/en-IE/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import global_burn_down_lib_teacher_server_teacher_dashboard_server_EnIe from "../../content-packs/en-IE/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import global_burn_down_lib_worksheets_worksheet_meta_labels_en_server_EnIe from "../../content-packs/en-IE/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import global_burn_down_lib_worksheets_worksheet_ui_EnIe from "../../content-packs/en-IE/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import global_burn_down_pages_app_EnIe from "../../content-packs/en-IE/global-burn-down/pages___app.json" with { type: "json" };
import global_burn_down_pages_api_parent_create_student_EnIe from "../../content-packs/en-IE/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import global_burn_down_pages_school_classes_index_EnIe from "../../content-packs/en-IE/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import global_burn_down_pages_school_students_index_EnIe from "../../content-packs/en-IE/global-burn-down/pages__school__students__index.json" with { type: "json" };
import reports_burn_down_components_parent_report_detailed_surface_EnIe from "../../content-packs/en-IE/reports/burn-down/components__parent-report-detailed-surface.json" with { type: "json" };
import reports_burn_down_utils_parent_report_language_grade_aware_recommendation_templates_course_labels_EnIe from "../../content-packs/en-IE/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__course-labels.json" with { type: "json" };
import reports_burn_down_utils_parent_report_language_grade_aware_recommendation_templates_out_of_grade_guards_EnIe from "../../content-packs/en-IE/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__out-of-grade-guards.json" with { type: "json" };

import reports_burn_down_utils_parent_report_language_grade_aware_recommendation_templates_weekly_focus_EnIe from "../../content-packs/en-IE/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__weekly-focus.json" with { type: "json" };
import reports_burn_down_utils_parent_report_out_of_grade_transparency_EnIe from "../../content-packs/en-IE/reports/burn-down/utils__parent-report-out-of-grade-transparency.json" with { type: "json" };
import reports_burn_down_utils_parent_report_output_integrity_zero_evidence_policy_tests_EnIe from "../../content-packs/en-IE/reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json" with { type: "json" };
import reports_burn_down_utils_parent_report_surface_parent_topic_tier_EnIe from "../../content-packs/en-IE/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json" with { type: "json" };
import books_ui_EnGb from "../../content-packs/en-GB/books/ui.json" with { type: "json" };
import books_registry_titles_EnGb from "../../content-packs/en-GB/books/registry-titles.json" with { type: "json" };
import books_english_page_skills_EnGb from "../../content-packs/en-GB/books/english-page-skills.json" with { type: "json" };
import demo_ui_EnGb from "../../content-packs/en-GB/demo/ui.json" with { type: "json" };
import learning_diagnostic_labels_EnGb from "../../content-packs/en-GB/learning/diagnostic-labels.json" with { type: "json" };
import learning_example_pattern_diagnostics_payload_EnGb from "../../content-packs/en-GB/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import rewards_ui_EnGb from "../../content-packs/en-GB/rewards/ui.json" with { type: "json" };
import rewards_card_catalog_EnGb from "../../content-packs/en-GB/rewards/card-catalog.json" with { type: "json" };
import reports_burn_down_index_EnGb from "../../content-packs/en-GB/reports/burn-down-index.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_lab_leo_lab_data_EnGb from "../../content-packs/en-GB/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_word_detective_leo_word_detective_data_EnGb from "../../content-packs/en-GB/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_word_train_leo_word_train_data_EnGb from "../../content-packs/en-GB/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import learning_burn_down_components_parent_ParentCurriculumContent_EnGb from "../../content-packs/en-GB/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import learning_burn_down_pages_learning_english_master_EnGb from "../../content-packs/en-GB/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import learning_burn_down_utils_topic_next_step_engine_EnGb from "../../content-packs/en-GB/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import global_burn_down_components_school_portal_SchoolDrillDown_EnGb from "../../content-packs/en-GB/global-burn-down/components__school-portal__SchoolDrillDown.json" with { type: "json" };
import global_burn_down_lib_learning_subject_permissions_subject_access_server_EnGb from "../../content-packs/en-GB/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import global_burn_down_lib_site_public_page_seo_EnGb from "../../content-packs/en-GB/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_burn_down_lib_teacher_portal_teacher_class_grade_EnGb from "../../content-packs/en-GB/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import global_burn_down_lib_teacher_server_teacher_dashboard_server_EnGb from "../../content-packs/en-GB/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import global_burn_down_lib_worksheets_worksheet_meta_labels_en_server_EnGb from "../../content-packs/en-GB/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import global_burn_down_lib_worksheets_worksheet_ui_EnGb from "../../content-packs/en-GB/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import global_burn_down_pages_app_EnGb from "../../content-packs/en-GB/global-burn-down/pages___app.json" with { type: "json" };
import global_burn_down_pages_api_parent_create_student_EnGb from "../../content-packs/en-GB/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import global_burn_down_pages_school_classes_index_EnGb from "../../content-packs/en-GB/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import global_burn_down_pages_school_students_index_EnGb from "../../content-packs/en-GB/global-burn-down/pages__school__students__index.json" with { type: "json" };
import games_burn_down_index_EnCa from "../../content-packs/en-CA/games/burn-down-index.json" with { type: "json" };
import games_sort_shapes_EnCa from "../../content-packs/en-CA/games/sort-shapes.json" with { type: "json" };
import global_burn_down_burn_down_index_EnCa from "../../content-packs/en-CA/global-burn-down/burn-down-index.json" with { type: "json" };
import learning_taxonomy_math_content_EnCa from "../../content-packs/en-CA/learning/taxonomy/math.content.json" with { type: "json" };
import books_ui_EnSg from "../../content-packs/en-SG/books/ui.json" with { type: "json" };
import books_registry_titles_EnSg from "../../content-packs/en-SG/books/registry-titles.json" with { type: "json" };
import books_english_page_skills_EnSg from "../../content-packs/en-SG/books/english-page-skills.json" with { type: "json" };
import demo_ui_EnSg from "../../content-packs/en-SG/demo/ui.json" with { type: "json" };
import games_burn_down_index_EnSg from "../../content-packs/en-SG/games/burn-down-index.json" with { type: "json" };
import games_sort_shapes_EnSg from "../../content-packs/en-SG/games/sort-shapes.json" with { type: "json" };
import games_ui_pack_index_EnSg from "../../content-packs/en-SG/games/ui-pack-index.json" with { type: "json" };
import global_burn_down_burn_down_index_EnSg from "../../content-packs/en-SG/global-burn-down/burn-down-index.json" with { type: "json" };
import learning_burn_down_index_EnSg from "../../content-packs/en-SG/learning/burn-down-index.json" with { type: "json" };
import learning_diagnostic_labels_EnSg from "../../content-packs/en-SG/learning/diagnostic-labels.json" with { type: "json" };
import learning_example_pattern_diagnostics_payload_EnSg from "../../content-packs/en-SG/learning/example-pattern-diagnostics-payload.json" with { type: "json" };
import reports_burn_down_index_EnSg from "../../content-packs/en-SG/reports/burn-down-index.json" with { type: "json" };
import rewards_ui_EnSg from "../../content-packs/en-SG/rewards/ui.json" with { type: "json" };
import rewards_card_catalog_EnSg from "../../content-packs/en-SG/rewards/card-catalog.json" with { type: "json" };
import books_ui_EnZa from "../../content-packs/en-ZA/books/ui.json" with { type: "json" };
import books_registry_titles_EnZa from "../../content-packs/en-ZA/books/registry-titles.json" with { type: "json" };
import demo_ui_EnZa from "../../content-packs/en-ZA/demo/ui.json" with { type: "json" };
import games_sort_shapes_EnZa from "../../content-packs/en-ZA/games/sort-shapes.json" with { type: "json" };
import games_ui_pack_index_EnZa from "../../content-packs/en-ZA/games/ui-pack-index.json" with { type: "json" };
import games_burn_down_leo_lab_experiments_EnZa from "../../content-packs/en-ZA/games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json" with { type: "json" };
import games_burn_down_solo_game_registry_EnZa from "../../content-packs/en-ZA/games/burn-down/lib__solo-games__solo-game-registry.json" with { type: "json" };
import global_burn_down_lib_site_public_page_seo_EnZa from "../../content-packs/en-ZA/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_burn_down_pages_app_EnZa from "../../content-packs/en-ZA/global-burn-down/pages___app.json" with { type: "json" };
import reports_burn_down_index_EnZa from "../../content-packs/en-ZA/reports/burn-down-index.json" with { type: "json" };
import rewards_ui_EnZa from "../../content-packs/en-ZA/rewards/ui.json" with { type: "json" };
import books_ui_EnSct from "../../content-packs/en-SCT/books/ui.json" with { type: "json" };
import books_registry_titles_EnSct from "../../content-packs/en-SCT/books/registry-titles.json" with { type: "json" };
import books_english_page_skills_EnSct from "../../content-packs/en-SCT/books/english-page-skills.json" with { type: "json" };
import demo_ui_EnSct from "../../content-packs/en-SCT/demo/ui.json" with { type: "json" };
import learning_diagnostic_labels_EnSct from "../../content-packs/en-SCT/learning/diagnostic-labels.json" with { type: "json" };
import rewards_ui_EnSct from "../../content-packs/en-SCT/rewards/ui.json" with { type: "json" };
import reports_burn_down_index_EnSct from "../../content-packs/en-SCT/reports/burn-down-index.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_lab_leo_lab_data_EnSct from "../../content-packs/en-SCT/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_word_detective_leo_word_detective_data_EnSct from "../../content-packs/en-SCT/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_word_train_leo_word_train_data_EnSct from "../../content-packs/en-SCT/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import learning_burn_down_components_parent_ParentCurriculumContent_EnSct from "../../content-packs/en-SCT/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import learning_burn_down_pages_learning_english_master_EnSct from "../../content-packs/en-SCT/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import learning_burn_down_utils_topic_next_step_engine_EnSct from "../../content-packs/en-SCT/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import global_burn_down_components_school_portal_SchoolDrillDown_EnSct from "../../content-packs/en-SCT/global-burn-down/components__school-portal__SchoolDrillDown.json" with { type: "json" };
import global_burn_down_lib_learning_subject_permissions_subject_access_server_EnSct from "../../content-packs/en-SCT/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import global_burn_down_lib_site_public_page_seo_EnSct from "../../content-packs/en-SCT/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_burn_down_lib_teacher_portal_teacher_class_grade_EnSct from "../../content-packs/en-SCT/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import global_burn_down_lib_teacher_server_teacher_dashboard_server_EnSct from "../../content-packs/en-SCT/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import global_burn_down_lib_worksheets_worksheet_meta_labels_en_server_EnSct from "../../content-packs/en-SCT/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import global_burn_down_lib_worksheets_worksheet_ui_EnSct from "../../content-packs/en-SCT/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import global_burn_down_pages_api_parent_create_student_EnSct from "../../content-packs/en-SCT/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import global_burn_down_pages_school_classes_index_EnSct from "../../content-packs/en-SCT/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import global_burn_down_pages_school_students_index_EnSct from "../../content-packs/en-SCT/global-burn-down/pages__school__students__index.json" with { type: "json" };
import books_ui_EnNir from "../../content-packs/en-NIR/books/ui.json" with { type: "json" };
import books_registry_titles_EnNir from "../../content-packs/en-NIR/books/registry-titles.json" with { type: "json" };
import books_english_page_skills_EnNir from "../../content-packs/en-NIR/books/english-page-skills.json" with { type: "json" };
import demo_ui_EnNir from "../../content-packs/en-NIR/demo/ui.json" with { type: "json" };
import learning_diagnostic_labels_EnNir from "../../content-packs/en-NIR/learning/diagnostic-labels.json" with { type: "json" };
import rewards_ui_EnNir from "../../content-packs/en-NIR/rewards/ui.json" with { type: "json" };
import reports_burn_down_index_EnNir from "../../content-packs/en-NIR/reports/burn-down-index.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_lab_leo_lab_data_EnNir from "../../content-packs/en-NIR/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_word_detective_leo_word_detective_data_EnNir from "../../content-packs/en-NIR/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json" with { type: "json" };
import games_burn_down_components_educational_games_leo_word_train_leo_word_train_data_EnNir from "../../content-packs/en-NIR/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json" with { type: "json" };
import learning_burn_down_components_parent_ParentCurriculumContent_EnNir from "../../content-packs/en-NIR/learning/burn-down/components__parent__ParentCurriculumContent.json" with { type: "json" };
import learning_burn_down_pages_learning_english_master_EnNir from "../../content-packs/en-NIR/learning/burn-down/pages__learning__english-master.json" with { type: "json" };
import learning_burn_down_utils_topic_next_step_engine_EnNir from "../../content-packs/en-NIR/learning/burn-down/utils__topic-next-step-engine.json" with { type: "json" };
import global_burn_down_components_school_portal_SchoolDrillDown_EnNir from "../../content-packs/en-NIR/global-burn-down/components__school-portal__SchoolDrillDown.json" with { type: "json" };
import global_burn_down_lib_learning_subject_permissions_subject_access_server_EnNir from "../../content-packs/en-NIR/global-burn-down/lib__learning__subject-permissions__subject-access.server.json" with { type: "json" };
import global_burn_down_lib_site_public_page_seo_EnNir from "../../content-packs/en-NIR/global-burn-down/lib__site__public-page-seo.json" with { type: "json" };
import global_burn_down_lib_teacher_portal_teacher_class_grade_EnNir from "../../content-packs/en-NIR/global-burn-down/lib__teacher-portal__teacher-class-grade.json" with { type: "json" };
import global_burn_down_lib_teacher_server_teacher_dashboard_server_EnNir from "../../content-packs/en-NIR/global-burn-down/lib__teacher-server__teacher-dashboard.server.json" with { type: "json" };
import global_burn_down_lib_worksheets_worksheet_meta_labels_en_server_EnNir from "../../content-packs/en-NIR/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json" with { type: "json" };
import global_burn_down_lib_worksheets_worksheet_ui_EnNir from "../../content-packs/en-NIR/global-burn-down/lib__worksheets__worksheet-ui.json" with { type: "json" };
import global_burn_down_pages_api_parent_create_student_EnNir from "../../content-packs/en-NIR/global-burn-down/pages__api__parent__create-student.json" with { type: "json" };
import global_burn_down_pages_school_classes_index_EnNir from "../../content-packs/en-NIR/global-burn-down/pages__school__classes__index.json" with { type: "json" };
import global_burn_down_pages_school_students_index_EnNir from "../../content-packs/en-NIR/global-burn-down/pages__school__students__index.json" with { type: "json" };

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
    reportsBurnDownGradeAwareCourseLabelsEsEs,
  ],
  "utils__parent-report-out-of-grade-transparency": reportsBurnDownOutOfGradeTransparencyEsEs,
  "utils__parent-report-surface__parent-topic-tier": reportsBurnDownParentTopicTierEsEs,
});

const gamesBurnDownIndex_EnIe = composeBurnDownIndexOverlay({
  "components__educational-games__leo-lab__leo-lab-data": games_burn_down_components_educational_games_leo_lab_leo_lab_data_EnIe,
  "components__educational-games__leo-lab__leo-lab-experiments-clean": games_burn_down_components_educational_games_leo_lab_leo_lab_experiments_clean_EnIe,
  "components__educational-games__leo-word-detective__leo-word-detective-data": games_burn_down_components_educational_games_leo_word_detective_leo_word_detective_data_EnIe,
  "components__educational-games__leo-word-train__leo-word-train-data": games_burn_down_components_educational_games_leo_word_train_leo_word_train_data_EnIe,
});
const learningBurnDownIndex_EnIe = composeBurnDownIndexOverlay({
  "components__parent__ParentCurriculumContent": learning_burn_down_components_parent_ParentCurriculumContent_EnIe,
  "pages__learning__english-master": learning_burn_down_pages_learning_english_master_EnIe,
  "utils__topic-next-step-engine": learning_burn_down_utils_topic_next_step_engine_EnIe,
});
const global_burn_downBurnDownIndex_EnIe = composeBurnDownIndexOverlay({
  "components__school-portal__SchoolDrillDown": global_burn_down_components_school_portal_SchoolDrillDown_EnIe,
  "lib__learning__subject-permissions__subject-access.server": global_burn_down_lib_learning_subject_permissions_subject_access_server_EnIe,
  "lib__site__public-page-seo": global_burn_down_lib_site_public_page_seo_EnIe,
  "lib__teacher-portal__teacher-class-grade": global_burn_down_lib_teacher_portal_teacher_class_grade_EnIe,
  "lib__teacher-server__teacher-dashboard.server": global_burn_down_lib_teacher_server_teacher_dashboard_server_EnIe,
  "lib__worksheets__worksheet-meta-labels-en.server": global_burn_down_lib_worksheets_worksheet_meta_labels_en_server_EnIe,
  "lib__worksheets__worksheet-ui": global_burn_down_lib_worksheets_worksheet_ui_EnIe,
  "pages___app": global_burn_down_pages_app_EnIe,
  "pages__api__parent__create-student": global_burn_down_pages_api_parent_create_student_EnIe,
  "pages__school__classes__index": global_burn_down_pages_school_classes_index_EnIe,
  "pages__school__students__index": global_burn_down_pages_school_students_index_EnIe,
});
const reportsBurnDownIndex_EnIe = composeBurnDownIndexOverlay({
  "components__parent-report-detailed-surface": reports_burn_down_components_parent_report_detailed_surface_EnIe,
  "utils__parent-report-language__grade-aware-recommendation-templates": [
    reports_burn_down_utils_parent_report_language_grade_aware_recommendation_templates_course_labels_EnIe,
    reports_burn_down_utils_parent_report_language_grade_aware_recommendation_templates_out_of_grade_guards_EnIe,
    reports_burn_down_utils_parent_report_language_grade_aware_recommendation_templates_weekly_focus_EnIe,
  ],
  "utils__parent-report-out-of-grade-transparency": reports_burn_down_utils_parent_report_out_of_grade_transparency_EnIe,
  "utils__parent-report-output-integrity__zero-evidence-policy-tests": reports_burn_down_utils_parent_report_output_integrity_zero_evidence_policy_tests_EnIe,
  "utils__parent-report-surface__parent-topic-tier": reports_burn_down_utils_parent_report_surface_parent_topic_tier_EnIe,
});
const gamesBurnDownIndex_EnGb = composeBurnDownIndexOverlay({
  "components__educational-games__leo-lab__leo-lab-data": games_burn_down_components_educational_games_leo_lab_leo_lab_data_EnGb,
  "components__educational-games__leo-word-detective__leo-word-detective-data": games_burn_down_components_educational_games_leo_word_detective_leo_word_detective_data_EnGb,
  "components__educational-games__leo-word-train__leo-word-train-data": games_burn_down_components_educational_games_leo_word_train_leo_word_train_data_EnGb,
});

const gamesBurnDownIndex_EnZa = composeBurnDownIndexOverlay({
  "components__educational-games__leo-lab__leo-lab-experiments-clean": games_burn_down_leo_lab_experiments_EnZa,
  "lib__solo-games__solo-game-registry": games_burn_down_solo_game_registry_EnZa,
});

const global_burn_downBurnDownIndex_EnZa = composeBurnDownIndexOverlay({
  "lib__site__public-page-seo": global_burn_down_lib_site_public_page_seo_EnZa,
  "pages___app": global_burn_down_pages_app_EnZa,
});
const gamesBurnDownIndex_EnSct = composeBurnDownIndexOverlay({
  "components__educational-games__leo-lab__leo-lab-data": games_burn_down_components_educational_games_leo_lab_leo_lab_data_EnSct,
  "components__educational-games__leo-word-detective__leo-word-detective-data": games_burn_down_components_educational_games_leo_word_detective_leo_word_detective_data_EnSct,
  "components__educational-games__leo-word-train__leo-word-train-data": games_burn_down_components_educational_games_leo_word_train_leo_word_train_data_EnSct,
});
const learningBurnDownIndex_EnSct = composeBurnDownIndexOverlay({
  "components__parent__ParentCurriculumContent": learning_burn_down_components_parent_ParentCurriculumContent_EnSct,
  "pages__learning__english-master": learning_burn_down_pages_learning_english_master_EnSct,
  "utils__topic-next-step-engine": learning_burn_down_utils_topic_next_step_engine_EnSct,
});
const global_burn_downBurnDownIndex_EnSct = composeBurnDownIndexOverlay({
  "components__school-portal__SchoolDrillDown": global_burn_down_components_school_portal_SchoolDrillDown_EnSct,
  "lib__learning__subject-permissions__subject-access.server": global_burn_down_lib_learning_subject_permissions_subject_access_server_EnSct,
  "lib__site__public-page-seo": global_burn_down_lib_site_public_page_seo_EnSct,
  "lib__teacher-portal__teacher-class-grade": global_burn_down_lib_teacher_portal_teacher_class_grade_EnSct,
  "lib__teacher-server__teacher-dashboard.server": global_burn_down_lib_teacher_server_teacher_dashboard_server_EnSct,
  "lib__worksheets__worksheet-meta-labels-en.server": global_burn_down_lib_worksheets_worksheet_meta_labels_en_server_EnSct,
  "lib__worksheets__worksheet-ui": global_burn_down_lib_worksheets_worksheet_ui_EnSct,
  "pages__api__parent__create-student": global_burn_down_pages_api_parent_create_student_EnSct,
  "pages__school__classes__index": global_burn_down_pages_school_classes_index_EnSct,
  "pages__school__students__index": global_burn_down_pages_school_students_index_EnSct,
});
const gamesBurnDownIndex_EnNir = composeBurnDownIndexOverlay({
  "components__educational-games__leo-lab__leo-lab-data": games_burn_down_components_educational_games_leo_lab_leo_lab_data_EnNir,
  "components__educational-games__leo-word-detective__leo-word-detective-data": games_burn_down_components_educational_games_leo_word_detective_leo_word_detective_data_EnNir,
  "components__educational-games__leo-word-train__leo-word-train-data": games_burn_down_components_educational_games_leo_word_train_leo_word_train_data_EnNir,
});
const learningBurnDownIndex_EnNir = composeBurnDownIndexOverlay({
  "components__parent__ParentCurriculumContent": learning_burn_down_components_parent_ParentCurriculumContent_EnNir,
  "pages__learning__english-master": learning_burn_down_pages_learning_english_master_EnNir,
  "utils__topic-next-step-engine": learning_burn_down_utils_topic_next_step_engine_EnNir,
});
const global_burn_downBurnDownIndex_EnNir = composeBurnDownIndexOverlay({
  "components__school-portal__SchoolDrillDown": global_burn_down_components_school_portal_SchoolDrillDown_EnNir,
  "lib__learning__subject-permissions__subject-access.server": global_burn_down_lib_learning_subject_permissions_subject_access_server_EnNir,
  "lib__site__public-page-seo": global_burn_down_lib_site_public_page_seo_EnNir,
  "lib__teacher-portal__teacher-class-grade": global_burn_down_lib_teacher_portal_teacher_class_grade_EnNir,
  "lib__teacher-server__teacher-dashboard.server": global_burn_down_lib_teacher_server_teacher_dashboard_server_EnNir,
  "lib__worksheets__worksheet-meta-labels-en.server": global_burn_down_lib_worksheets_worksheet_meta_labels_en_server_EnNir,
  "lib__worksheets__worksheet-ui": global_burn_down_lib_worksheets_worksheet_ui_EnNir,
  "pages__api__parent__create-student": global_burn_down_pages_api_parent_create_student_EnNir,
  "pages__school__classes__index": global_burn_down_pages_school_classes_index_EnNir,
  "pages__school__students__index": global_burn_down_pages_school_students_index_EnNir,
});
const learningBurnDownIndex_EnGb = composeBurnDownIndexOverlay({
  "components__parent__ParentCurriculumContent": learning_burn_down_components_parent_ParentCurriculumContent_EnGb,
  "pages__learning__english-master": learning_burn_down_pages_learning_english_master_EnGb,
  "utils__topic-next-step-engine": learning_burn_down_utils_topic_next_step_engine_EnGb,
});
const global_burn_downBurnDownIndex_EnGb = composeBurnDownIndexOverlay({
  "components__school-portal__SchoolDrillDown": global_burn_down_components_school_portal_SchoolDrillDown_EnGb,
  "lib__learning__subject-permissions__subject-access.server": global_burn_down_lib_learning_subject_permissions_subject_access_server_EnGb,
  "lib__site__public-page-seo": global_burn_down_lib_site_public_page_seo_EnGb,
  "lib__teacher-portal__teacher-class-grade": global_burn_down_lib_teacher_portal_teacher_class_grade_EnGb,
  "lib__teacher-server__teacher-dashboard.server": global_burn_down_lib_teacher_server_teacher_dashboard_server_EnGb,
  "lib__worksheets__worksheet-meta-labels-en.server": global_burn_down_lib_worksheets_worksheet_meta_labels_en_server_EnGb,
  "lib__worksheets__worksheet-ui": global_burn_down_lib_worksheets_worksheet_ui_EnGb,
  "pages___app": global_burn_down_pages_app_EnGb,
  "pages__api__parent__create-student": global_burn_down_pages_api_parent_create_student_EnGb,
  "pages__school__classes__index": global_burn_down_pages_school_classes_index_EnGb,
  "pages__school__students__index": global_burn_down_pages_school_students_index_EnGb,
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
  "pt-BR": Object.freeze({
    "books/ui.json": booksUiPtBr,
    "books/registry-titles.json": booksRegistryTitlesPtBr,
    "books/english-page-skills.json": booksEnglishPageSkillsPtBr,
    "demo/ui.json": demoUiPtBr,
    "games/burn-down-index.json": gamesBurnDownIndexPtBr,
    "games/ui-pack-index.json": gamesUiPackIndexPtBr,
    "global-burn-down/burn-down-index.json": globalBurnDownIndexPtBr,
    "learning/burn-down-index.json": learningBurnDownIndexPtBr,
    "learning/diagnostic-engine-v2-defaults.json": learningDiagnosticDefaultsPtBr,
    "learning/diagnostic-framework-v1.json": learningDiagnosticFrameworkPtBr,
    "learning/diagnostic-labels.json": learningDiagnosticLabelsPtBr,
    "learning/example-pattern-diagnostics-payload.json": learningExamplePatternPayloadPtBr,
    "learning/fast-diagnostic-probes.json": learningFastDiagnosticProbesPtBr,
    "learning/fast-diagnostic-tag-labels.json": learningFastDiagnosticTagLabelsPtBr,
    "learning/geometry-content.json": learningGeometryContentPtBr,
    "learning/learning-patterns-copy.json": learningPatternsCopyPtBr,
    "learning/math-animation-titles.json": learningMathAnimationTitlesPtBr,
    "learning/taxonomy/english.structure.json": taxonomyEnglishStructurePtBr,
    "learning/taxonomy/english.content.json": taxonomyEnglishContentPtBr,
    "learning/taxonomy/geometry.structure.json": taxonomyGeometryStructurePtBr,
    "learning/taxonomy/geometry.content.json": taxonomyGeometryContentPtBr,
    "learning/taxonomy/math.structure.json": taxonomyMathStructurePtBr,
    "learning/taxonomy/math.content.json": taxonomyMathContentPtBr,
    "learning/taxonomy/science.structure.json": taxonomyScienceStructurePtBr,
    "learning/taxonomy/science.content.json": taxonomyScienceContentPtBr,
    "reports/burn-down-index.json": reportsBurnDownIndexPtBr,
    "rewards/card-catalog.json": rewardsCardCatalogPtBr,
    "rewards/ui.json": rewardsUiPtBr,
  }),
  "ar-001": Object.freeze({
    "books/ui.json": BooksUiJsonAr001,
    "books/registry-titles.json": BooksRegistryTitlesJsonAr001,
    "books/english-page-skills.json": BooksEnglishPageSkillsJsonAr001,
    "demo/ui.json": DemoUiJsonAr001,
    "games/burn-down-index.json": GamesBurnDownIndexJsonAr001,
    "games/ui-pack-index.json": GamesUiPackIndexJsonAr001,
    "global-burn-down/burn-down-index.json": GlobalBurnDownBurnDownIndexJsonAr001,
    "learning/burn-down-index.json": LearningBurnDownIndexJsonAr001,
    "learning/diagnostic-engine-v2-defaults.json": LearningDiagnosticEngineV2DefaultsJsonAr001,
    "learning/diagnostic-framework-v1.json": LearningDiagnosticFrameworkV1JsonAr001,
    "learning/diagnostic-labels.json": LearningDiagnosticLabelsJsonAr001,
    "learning/example-pattern-diagnostics-payload.json": LearningExamplePatternDiagnosticsPayloadJsonAr001,
    "learning/fast-diagnostic-probes.json": LearningFastDiagnosticProbesJsonAr001,
    "learning/fast-diagnostic-tag-labels.json": LearningFastDiagnosticTagLabelsJsonAr001,
    "learning/geometry-content.json": LearningGeometryContentJsonAr001,
    "learning/learning-patterns-copy.json": LearningLearningPatternsCopyJsonAr001,
    "learning/math-animation-titles.json": LearningMathAnimationTitlesJsonAr001,
    "learning/taxonomy/english.structure.json": LearningTaxonomyEnglishStructureJsonAr001,
    "learning/taxonomy/english.content.json": LearningTaxonomyEnglishContentJsonAr001,
    "learning/taxonomy/geometry.structure.json": LearningTaxonomyGeometryStructureJsonAr001,
    "learning/taxonomy/geometry.content.json": LearningTaxonomyGeometryContentJsonAr001,
    "learning/taxonomy/math.structure.json": LearningTaxonomyMathStructureJsonAr001,
    "learning/taxonomy/math.content.json": LearningTaxonomyMathContentJsonAr001,
    "learning/taxonomy/science.structure.json": LearningTaxonomyScienceStructureJsonAr001,
    "learning/taxonomy/science.content.json": LearningTaxonomyScienceContentJsonAr001,
    "reports/burn-down-index.json": ReportsBurnDownIndexJsonAr001,
    "rewards/card-catalog.json": RewardsCardCatalogJsonAr001,
    "rewards/ui.json": RewardsUiJsonAr001,
  }),
  "pt-PT": Object.freeze({
    "books/ui.json": booksUiPtPt,
    "books/registry-titles.json": booksRegistryTitlesPtPt,
    "books/english-page-skills.json": booksEnglishPageSkillsPtPt,
    "demo/ui.json": demoUiPtPt,
    "games/burn-down-index.json": gamesBurnDownIndexPtPt,
    "games/ui-pack-index.json": gamesUiPackIndexPtPt,
    "global-burn-down/burn-down-index.json": globalBurnDownIndexPtPt,
    "learning/burn-down-index.json": learningBurnDownIndexPtPt,
    "learning/diagnostic-labels.json": learningDiagnosticLabelsPtPt,
    "learning/example-pattern-diagnostics-payload.json": learningExamplePatternPayloadPtPt,
    "learning/fast-diagnostic-probes.json": learningFastDiagnosticProbesPtPt,
    "learning/fast-diagnostic-tag-labels.json": learningFastDiagnosticTagLabelsPtPt,
    "learning/math-animation-titles.json": learningMathAnimationTitlesPtPt,
    "learning/taxonomy/english.content.json": taxonomyEnglishContentPtPt,
    "learning/taxonomy/math.content.json": taxonomyMathContentPtPt,
    "reports/burn-down-index.json": reportsBurnDownIndexPtPt,
    "rewards/card-catalog.json": rewardsCardCatalogPtPt,
    "rewards/ui.json": rewardsUiPtPt,
  }),
  "it-IT": Object.freeze({
    "books/ui.json": booksUiItIt,
    "books/registry-titles.json": booksRegistryTitlesItIt,
    "books/english-page-skills.json": booksEnglishPageSkillsItIt,
    "demo/ui.json": demoUiItIt,
    "games/burn-down-index.json": gamesBurnDownIndexItIt,
    "games/ui-pack-index.json": gamesUiPackIndexItIt,
    "global-burn-down/burn-down-index.json": globalBurnDownIndexItIt,
    "learning/burn-down-index.json": learningBurnDownIndexItIt,
    "learning/diagnostic-engine-v2-defaults.json": learningDiagnosticDefaultsItIt,
    "learning/diagnostic-framework-v1.json": learningDiagnosticFrameworkItIt,
    "learning/diagnostic-labels.json": learningDiagnosticLabelsItIt,
    "learning/example-pattern-diagnostics-payload.json": learningExamplePatternPayloadItIt,
    "learning/fast-diagnostic-probes.json": learningFastDiagnosticProbesItIt,
    "learning/fast-diagnostic-tag-labels.json": learningFastDiagnosticTagLabelsItIt,
    "learning/geometry-content.json": learningGeometryContentItIt,
    "learning/learning-patterns-copy.json": learningPatternsCopyItIt,
    "learning/math-animation-titles.json": learningMathAnimationTitlesItIt,
    "learning/taxonomy/english.structure.json": taxonomyEnglishStructureItIt,
    "learning/taxonomy/english.content.json": taxonomyEnglishContentItIt,
    "learning/taxonomy/geometry.structure.json": taxonomyGeometryStructureItIt,
    "learning/taxonomy/geometry.content.json": taxonomyGeometryContentItIt,
    "learning/taxonomy/math.structure.json": taxonomyMathStructureItIt,
    "learning/taxonomy/math.content.json": taxonomyMathContentItIt,
    "learning/taxonomy/science.structure.json": taxonomyScienceStructureItIt,
    "learning/taxonomy/science.content.json": taxonomyScienceContentItIt,
    "reports/burn-down-index.json": reportsBurnDownIndexItIt,
    "rewards/card-catalog.json": rewardsCardCatalogItIt,
    "rewards/ui.json": rewardsUiItIt,
  }),
  "fr-FR": Object.freeze({
    "books/ui.json": booksUiFrFr,
    "books/registry-titles.json": booksRegistryTitlesFrFr,
    "books/english-page-skills.json": booksEnglishPageSkillsFrFr,
    "demo/ui.json": demoUiFrFr,
    "games/burn-down-index.json": gamesBurnDownIndexFrFr,
    "games/ui-pack-index.json": gamesUiPackIndexFrFr,
    "global-burn-down/burn-down-index.json": globalBurnDownIndexFrFr,
    "learning/burn-down-index.json": learningBurnDownIndexFrFr,
    "learning/diagnostic-engine-v2-defaults.json": learningDiagnosticDefaultsFrFr,
    "learning/diagnostic-framework-v1.json": learningDiagnosticFrameworkFrFr,
    "learning/diagnostic-labels.json": learningDiagnosticLabelsFrFr,
    "learning/example-pattern-diagnostics-payload.json": learningExamplePatternPayloadFrFr,
    "learning/fast-diagnostic-probes.json": learningFastDiagnosticProbesFrFr,
    "learning/fast-diagnostic-tag-labels.json": learningFastDiagnosticTagLabelsFrFr,
    "learning/geometry-content.json": learningGeometryContentFrFr,
    "learning/learning-patterns-copy.json": learningPatternsCopyFrFr,
    "learning/math-animation-titles.json": learningMathAnimationTitlesFrFr,
    "learning/taxonomy/english.structure.json": taxonomyEnglishStructureFrFr,
    "learning/taxonomy/english.content.json": taxonomyEnglishContentFrFr,
    "learning/taxonomy/geometry.structure.json": taxonomyGeometryStructureFrFr,
    "learning/taxonomy/geometry.content.json": taxonomyGeometryContentFrFr,
    "learning/taxonomy/math.structure.json": taxonomyMathStructureFrFr,
    "learning/taxonomy/math.content.json": taxonomyMathContentFrFr,
    "learning/taxonomy/science.structure.json": taxonomyScienceStructureFrFr,
    "learning/taxonomy/science.content.json": taxonomyScienceContentFrFr,
    "reports/burn-down-index.json": reportsBurnDownIndexFrFr,
    "rewards/card-catalog.json": rewardsCardCatalogFrFr,
    "rewards/ui.json": rewardsUiFrFr,
  }),
  "nl-NL": Object.freeze({
    "books/ui.json": booksUiNlNl,
    "books/registry-titles.json": booksRegistryTitlesNlNl,
    "books/english-page-skills.json": booksEnglishPageSkillsNlNl,
    "demo/ui.json": demoUiNlNl,
    "games/burn-down-index.json": gamesBurnDownIndexNlNl,
    "games/ui-pack-index.json": gamesUiPackIndexNlNl,
    "global-burn-down/burn-down-index.json": globalBurnDownIndexNlNl,
    "learning/burn-down-index.json": learningBurnDownIndexNlNl,
    "learning/diagnostic-engine-v2-defaults.json": learningDiagnosticDefaultsNlNl,
    "learning/diagnostic-framework-v1.json": learningDiagnosticFrameworkNlNl,
    "learning/diagnostic-labels.json": learningDiagnosticLabelsNlNl,
    "learning/example-pattern-diagnostics-payload.json": learningExamplePatternPayloadNlNl,
    "learning/fast-diagnostic-probes.json": learningFastDiagnosticProbesNlNl,
    "learning/fast-diagnostic-tag-labels.json": learningFastDiagnosticTagLabelsNlNl,
    "learning/geometry-content.json": learningGeometryContentNlNl,
    "learning/learning-patterns-copy.json": learningPatternsCopyNlNl,
    "learning/math-animation-titles.json": learningMathAnimationTitlesNlNl,
    "learning/taxonomy/english.structure.json": taxonomyEnglishStructureNlNl,
    "learning/taxonomy/english.content.json": taxonomyEnglishContentNlNl,
    "learning/taxonomy/geometry.structure.json": taxonomyGeometryStructureNlNl,
    "learning/taxonomy/geometry.content.json": taxonomyGeometryContentNlNl,
    "learning/taxonomy/math.structure.json": taxonomyMathStructureNlNl,
    "learning/taxonomy/math.content.json": taxonomyMathContentNlNl,
    "learning/taxonomy/science.structure.json": taxonomyScienceStructureNlNl,
    "learning/taxonomy/science.content.json": taxonomyScienceContentNlNl,
    "reports/burn-down-index.json": reportsBurnDownIndexNlNl,
    "rewards/card-catalog.json": rewardsCardCatalogNlNl,
    "rewards/ui.json": rewardsUiNlNl,
  }),
  "de-DE": Object.freeze({
    "books/ui.json": booksUiDeDe,
    "books/registry-titles.json": booksRegistryTitlesDeDe,
    "books/english-page-skills.json": booksEnglishPageSkillsDeDe,
    "demo/ui.json": demoUiDeDe,
    "games/burn-down-index.json": gamesBurnDownIndexDeDe,
    "games/ui-pack-index.json": gamesUiPackIndexDeDe,
    "global-burn-down/burn-down-index.json": globalBurnDownIndexDeDe,
    "learning/burn-down-index.json": learningBurnDownIndexDeDe,
    "learning/diagnostic-engine-v2-defaults.json": learningDiagnosticDefaultsDeDe,
    "learning/diagnostic-framework-v1.json": learningDiagnosticFrameworkDeDe,
    "learning/diagnostic-labels.json": learningDiagnosticLabelsDeDe,
    "learning/example-pattern-diagnostics-payload.json": learningExamplePatternPayloadDeDe,
    "learning/fast-diagnostic-probes.json": learningFastDiagnosticProbesDeDe,
    "learning/fast-diagnostic-tag-labels.json": learningFastDiagnosticTagLabelsDeDe,
    "learning/geometry-content.json": learningGeometryContentDeDe,
    "learning/learning-patterns-copy.json": learningPatternsCopyDeDe,
    "learning/math-animation-titles.json": learningMathAnimationTitlesDeDe,
    "learning/taxonomy/english.structure.json": taxonomyEnglishStructureDeDe,
    "learning/taxonomy/english.content.json": taxonomyEnglishContentDeDe,
    "learning/taxonomy/geometry.structure.json": taxonomyGeometryStructureDeDe,
    "learning/taxonomy/geometry.content.json": taxonomyGeometryContentDeDe,
    "learning/taxonomy/math.structure.json": taxonomyMathStructureDeDe,
    "learning/taxonomy/math.content.json": taxonomyMathContentDeDe,
    "learning/taxonomy/science.structure.json": taxonomyScienceStructureDeDe,
    "learning/taxonomy/science.content.json": taxonomyScienceContentDeDe,
    "reports/burn-down-index.json": reportsBurnDownIndexDeDe,
    "rewards/card-catalog.json": rewardsCardCatalogDeDe,
    "rewards/ui.json": rewardsUiDeDe,
  }),
  "ru-RU": Object.freeze({
    "books/ui.json": booksUiRuRu,
    "books/registry-titles.json": booksRegistryTitlesRuRu,
    "books/english-page-skills.json": booksEnglishPageSkillsRuRu,
    "demo/ui.json": demoUiRuRu,
    "games/burn-down-index.json": gamesBurnDownIndexRuRu,
    "games/ui-pack-index.json": gamesUiPackIndexRuRu,
    "global-burn-down/burn-down-index.json": globalBurnDownIndexRuRu,
    "learning/burn-down-index.json": learningBurnDownIndexRuRu,
    "learning/diagnostic-engine-v2-defaults.json": learningDiagnosticDefaultsRuRu,
    "learning/diagnostic-framework-v1.json": learningDiagnosticFrameworkRuRu,
    "learning/diagnostic-labels.json": learningDiagnosticLabelsRuRu,
    "learning/example-pattern-diagnostics-payload.json": learningExamplePatternPayloadRuRu,
    "learning/fast-diagnostic-probes.json": learningFastDiagnosticProbesRuRu,
    "learning/fast-diagnostic-tag-labels.json": learningFastDiagnosticTagLabelsRuRu,
    "learning/geometry-content.json": learningGeometryContentRuRu,
    "learning/learning-patterns-copy.json": learningPatternsCopyRuRu,
    "learning/math-animation-titles.json": learningMathAnimationTitlesRuRu,
    "learning/taxonomy/english.structure.json": taxonomyEnglishStructureRuRu,
    "learning/taxonomy/english.content.json": taxonomyEnglishContentRuRu,
    "learning/taxonomy/geometry.structure.json": taxonomyGeometryStructureRuRu,
    "learning/taxonomy/geometry.content.json": taxonomyGeometryContentRuRu,
    "learning/taxonomy/math.structure.json": taxonomyMathStructureRuRu,
    "learning/taxonomy/math.content.json": taxonomyMathContentRuRu,
    "learning/taxonomy/science.structure.json": taxonomyScienceStructureRuRu,
    "learning/taxonomy/science.content.json": taxonomyScienceContentRuRu,
    "reports/burn-down-index.json": reportsBurnDownIndexRuRu,
    "rewards/card-catalog.json": rewardsCardCatalogRuRu,
    "rewards/ui.json": rewardsUiRuRu,
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
  "pt-AO": Object.freeze({
    "books/english-page-skills.json": books_EnglishPageSkills_PtAo,
    "books/registry-titles.json": books_RegistryTitles_PtAo,
    "books/ui.json": books_Ui_PtAo,
    "demo/ui.json": demo_Ui_PtAo,
    "global-burn-down/burn-down-index.json": global_burn_down_BurnDownIndex_PtAo,
    "global-burn-down/lib__learning__subject-permissions__subject-access.server.json": global_burn_down_Lib_Learning_SubjectPermissions_SubjectAccessServer_PtAo,
    "global-burn-down/lib__site__public-page-seo.json": global_burn_down_Lib_Site_PublicPageSeo_PtAo,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": global_burn_down_Lib_TeacherPortal_TeacherClassGrade_PtAo,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": global_burn_down_Lib_TeacherServer_TeacherDashboardServer_PtAo,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": global_burn_down_Lib_Worksheets_WorksheetMetaLabelsEnServer_PtAo,
    "global-burn-down/lib__worksheets__worksheet-ui.json": global_burn_down_Lib_Worksheets_WorksheetUi_PtAo,
    "global-burn-down/pages___app.json": global_burn_down_Pages_App_PtAo,
    "reports/burn-down-index.json": reports_BurnDownIndex_PtAo,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": reports_BurnDown_Utils_ParentReportLanguage_GradeAwareRecommendationTemplates_PtAo,
    "rewards/ui.json": rewards_Ui_PtAo,
  }),
  "en-NG": Object.freeze({
    "books/english-page-skills.json": books_EnglishPageSkills_EnNg,
    "books/registry-titles.json": books_RegistryTitles_EnNg,
    "books/ui.json": books_Ui_EnNg,
    "demo/ui.json": demo_Ui_EnNg,
    "games/burn-down-index.json": games_BurnDownIndex_EnNg,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": games_BurnDown_Components_EducationalGames_LeoLab_LeoLabData_EnNg,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json": games_BurnDown_Components_EducationalGames_LeoLab_LeoLabExperimentsClean_EnNg,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": games_BurnDown_Components_EducationalGames_LeoWordDetective_LeoWordDetectiveData_EnNg,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": games_BurnDown_Components_EducationalGames_LeoWordTrain_LeoWordTrainData_EnNg,
    "games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json": games_BurnDown_Components_SoloGames_Prototypes_Dev_ConnectColorsPrototype_EnNg,
    "games/burn-down/lib__educational-games__educational-game-registry.json": games_BurnDown_Lib_EducationalGames_EducationalGameRegistry_EnNg,
    "games/burn-down/lib__solo-games__solo-game-registry.json": games_BurnDown_Lib_SoloGames_SoloGameRegistry_EnNg,
    "games/sort-shapes.json": games_SortShapes_EnNg,
    "games/ui-pack-index.json": games_UiPackIndex_EnNg,
    "global-burn-down/burn-down-index.json": global_burn_down_BurnDownIndex_EnNg,
    "global-burn-down/lib__learning__subject-permissions__subject-access.server.json": global_burn_down_Lib_Learning_SubjectPermissions_SubjectAccessServer_EnNg,
    "global-burn-down/lib__site__public-page-seo.json": global_burn_down_Lib_Site_PublicPageSeo_EnNg,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": global_burn_down_Lib_TeacherPortal_TeacherClassGrade_EnNg,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": global_burn_down_Lib_TeacherServer_TeacherDashboardServer_EnNg,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": global_burn_down_Lib_Worksheets_WorksheetMetaLabelsEnServer_EnNg,
    "global-burn-down/lib__worksheets__worksheet-ui.json": global_burn_down_Lib_Worksheets_WorksheetUi_EnNg,
    "global-burn-down/pages___app.json": global_burn_down_Pages_App_EnNg,
    "global-burn-down/pages__api__parent__create-student.json": global_burn_down_Pages_Api_Parent_CreateStudent_EnNg,
    "global-burn-down/pages__school__classes__index.json": global_burn_down_Pages_School_Classes_Index_EnNg,
    "global-burn-down/pages__school__students__index.json": global_burn_down_Pages_School_Students_Index_EnNg,
    "global-burn-down/utils__question-metadata-qa__question-bank-discovery.json": global_burn_down_Utils_QuestionMetadataQa_QuestionBankDiscovery_EnNg,
    "learning/burn-down-index.json": learning_BurnDownIndex_EnNg,
    "learning/burn-down/components__parent__ParentCurriculumContent.json": learning_BurnDown_Components_Parent_ParentCurriculumContent_EnNg,
    "learning/burn-down/pages__learning__english-master.json": learning_BurnDown_Pages_Learning_EnglishMaster_EnNg,
    "learning/burn-down/utils__topic-next-step-engine.json": learning_BurnDown_Utils_TopicNextStepEngine_EnNg,
    "learning/diagnostic-labels.json": learning_DiagnosticLabels_EnNg,
    "learning/example-pattern-diagnostics-payload.json": learning_ExamplePatternDiagnosticsPayload_EnNg,
    "reports/burn-down-index.json": reports_BurnDownIndex_EnNg,
    "reports/burn-down/components__parent-report-detailed-surface.json": reports_BurnDown_Components_ParentReportDetailedSurface_EnNg,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": reports_BurnDown_Utils_ParentReportLanguage_GradeAwareRecommendationTemplates_EnNg,
    "reports/burn-down/utils__parent-report-out-of-grade-transparency.json": reports_BurnDown_Utils_ParentReportOutOfGradeTransparency_EnNg,
    "reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json": reports_BurnDown_Utils_ParentReportOutputIntegrity_ZeroEvidencePolicyTests_EnNg,
    "reports/burn-down/utils__parent-report-surface__parent-topic-tier.json": reports_BurnDown_Utils_ParentReportSurface_ParentTopicTier_EnNg,
    "rewards/card-catalog.json": rewards_CardCatalog_EnNg,
    "rewards/ui.json": rewards_Ui_EnNg,
  }),
  "fr-CI": Object.freeze({
    "books/english-page-skills.json": books_EnglishPageSkills_FrCi,
    "books/registry-titles.json": books_RegistryTitles_FrCi,
    "books/ui.json": books_Ui_FrCi,
    "demo/ui.json": demo_Ui_FrCi,
    "games/burn-down-index.json": games_BurnDownIndex_FrCi,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": games_BurnDown_Components_EducationalGames_LeoLab_LeoLabData_FrCi,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": games_BurnDown_Components_EducationalGames_LeoWordDetective_LeoWordDetectiveData_FrCi,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": games_BurnDown_Components_EducationalGames_LeoWordTrain_LeoWordTrainData_FrCi,
    "global-burn-down/burn-down-index.json": global_burn_down_BurnDownIndex_FrCi,
    "global-burn-down/lib__site__public-page-seo.json": global_burn_down_Lib_Site_PublicPageSeo_FrCi,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": global_burn_down_Lib_TeacherPortal_TeacherClassGrade_FrCi,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": global_burn_down_Lib_TeacherServer_TeacherDashboardServer_FrCi,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": global_burn_down_Lib_Worksheets_WorksheetMetaLabelsEnServer_FrCi,
    "reports/burn-down-index.json": reports_BurnDownIndex_FrCi,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": reports_BurnDown_Utils_ParentReportLanguage_GradeAwareRecommendationTemplates_FrCi,
    "rewards/ui.json": rewards_Ui_FrCi,
  }),
  "de-AT": Object.freeze({
    "books/english-page-skills.json": books_EnglishPageSkills_DeAt,
    "books/registry-titles.json": books_RegistryTitles_DeAt,
    "books/ui.json": books_Ui_DeAt,
    "demo/ui.json": demo_Ui_DeAt,
    "games/burn-down-index.json": games_BurnDownIndex_DeAt,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": games_BurnDown_Components_EducationalGames_LeoLab_LeoLabData_DeAt,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": games_BurnDown_Components_EducationalGames_LeoWordDetective_LeoWordDetectiveData_DeAt,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": games_BurnDown_Components_EducationalGames_LeoWordTrain_LeoWordTrainData_DeAt,
    "global-burn-down/burn-down-index.json": global_burn_down_BurnDownIndex_DeAt,
    "global-burn-down/components__school-portal__SchoolDrillDown.json": global_burn_down_Components_SchoolPortal_SchoolDrillDown_DeAt,
    "global-burn-down/lib__learning__subject-permissions__subject-access.server.json": global_burn_down_Lib_Learning_SubjectPermissions_SubjectAccessServer_DeAt,
    "global-burn-down/lib__site__public-page-seo.json": global_burn_down_Lib_Site_PublicPageSeo_DeAt,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": global_burn_down_Lib_TeacherPortal_TeacherClassGrade_DeAt,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": global_burn_down_Lib_TeacherServer_TeacherDashboardServer_DeAt,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": global_burn_down_Lib_Worksheets_WorksheetMetaLabelsEnServer_DeAt,
    "global-burn-down/lib__worksheets__worksheet-ui.json": global_burn_down_Lib_Worksheets_WorksheetUi_DeAt,
    "global-burn-down/pages___app.json": global_burn_down_Pages_App_DeAt,
    "global-burn-down/pages__api__parent__create-student.json": global_burn_down_Pages_Api_Parent_CreateStudent_DeAt,
    "global-burn-down/pages__school__classes__index.json": global_burn_down_Pages_School_Classes_Index_DeAt,
    "global-burn-down/pages__school__students__index.json": global_burn_down_Pages_School_Students_Index_DeAt,
    "learning/burn-down-index.json": learning_BurnDownIndex_DeAt,
    "learning/burn-down/components__parent__ParentCurriculumContent.json": learning_BurnDown_Components_Parent_ParentCurriculumContent_DeAt,
    "learning/burn-down/pages__learning__english-master.json": learning_BurnDown_Pages_Learning_EnglishMaster_DeAt,
    "learning/burn-down/utils__topic-next-step-engine.json": learning_BurnDown_Utils_TopicNextStepEngine_DeAt,
    "learning/diagnostic-labels.json": learning_DiagnosticLabels_DeAt,
    "reports/burn-down-index.json": reports_BurnDownIndex_DeAt,
    "reports/burn-down/components__parent-report-detailed-surface.json": reports_BurnDown_Components_ParentReportDetailedSurface_DeAt,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": reports_BurnDown_Utils_ParentReportLanguage_GradeAwareRecommendationTemplates_DeAt,
    "reports/burn-down/utils__parent-report-language__parent-report-display-labels.json": reports_BurnDown_Utils_ParentReportLanguage_ParentReportDisplayLabels_DeAt,
    "reports/burn-down/utils__parent-report-out-of-grade-transparency.json": reports_BurnDown_Utils_ParentReportOutOfGradeTransparency_DeAt,
    "reports/burn-down/utils__parent-report-surface__parent-topic-tier.json": reports_BurnDown_Utils_ParentReportSurface_ParentTopicTier_DeAt,
    "rewards/ui.json": rewards_Ui_DeAt,
  }),
  "fr-CA": Object.freeze({
    "books/english-page-skills.json": books_English_Page_Skills_FrCa,
    "books/registry-titles.json": books_Registry_Titles_FrCa,
    "books/ui.json": books_Ui_FrCa,
    "demo/ui.json": demo_Ui_FrCa,
    "games/burn-down-index.json": games_Burn_Down_Index_FrCa,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_FrCa,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_FrCa,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_FrCa,
    "global-burn-down/burn-down-index.json": global_Burn_Down_Burn_Down_Index_FrCa,
    "global-burn-down/lib__site__public-page-seo.json": global_Burn_Down_Lib_Site_Public_Page_Seo_FrCa,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_FrCa,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_FrCa,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_FrCa,
    "reports/burn-down-index.json": reports_Burn_Down_Index_FrCa,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_FrCa,
    "rewards/ui.json": rewards_Ui_FrCa,
  }),
  "pt-MZ": Object.freeze({
    "books/english-page-skills.json": books_English_Page_Skills_PtMz,
    "books/registry-titles.json": books_Registry_Titles_PtMz,
    "books/ui.json": books_Ui_PtMz,
    "demo/ui.json": demo_Ui_PtMz,
    "games/burn-down-index.json": games_Burn_Down_Index_PtMz,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_PtMz,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_PtMz,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_PtMz,
    "global-burn-down/burn-down-index.json": global_Burn_Down_Burn_Down_Index_PtMz,
    "global-burn-down/lib__learning__subject-permissions__subject-access.server.json": global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_PtMz,
    "global-burn-down/lib__site__public-page-seo.json": global_Burn_Down_Lib_Site_Public_Page_Seo_PtMz,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_PtMz,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_PtMz,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_PtMz,
    "global-burn-down/lib__worksheets__worksheet-ui.json": global_Burn_Down_Lib_Worksheets_Worksheet_Ui_PtMz,
    "global-burn-down/pages___app.json": global_Burn_Down_Pages_App_PtMz,
    "learning/burn-down-index.json": learning_Burn_Down_Index_PtMz,
    "reports/burn-down-index.json": reports_Burn_Down_Index_PtMz,
    "reports/burn-down/components__parent-report-detailed-surface.json": reports_Burn_Down_Components_Parent_Report_Detailed_Surface_PtMz,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_PtMz,
    "reports/burn-down/utils__parent-report-surface__parent-topic-tier.json": reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_PtMz,
    "rewards/ui.json": rewards_Ui_PtMz,
  }),
  "en-KE": Object.freeze({
    "books/registry-titles.json": books_Registry_Titles_EnKe,
    "books/ui.json": books_Ui_EnKe,
    "demo/ui.json": demo_Ui_EnKe,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json": games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_EnKe,
    "games/burn-down/lib__solo-games__solo-game-registry.json": games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_EnKe,
    "games/sort-shapes.json": games_Sort_Shapes_EnKe,
    "games/ui-pack-index.json": games_Ui_Pack_Index_EnKe,
    "global-burn-down/lib__site__public-page-seo.json": global_Burn_Down_Lib_Site_Public_Page_Seo_EnKe,
    "global-burn-down/pages___app.json": global_Burn_Down_Pages_App_EnKe,
    "reports/burn-down-index.json": reports_Burn_Down_Index_EnKe,
    "reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json": reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_EnKe,
    "rewards/ui.json": rewards_Ui_EnKe,
  }),
  "de-CH": Object.freeze({
    "books/english-page-skills.json": books_English_Page_Skills_DeCh,
    "books/ui.json": books_Ui_DeCh,
    "demo/ui.json": demo_Ui_DeCh,
    "games/burn-down-index.json": games_Burn_Down_Index_DeCh,
    "games/burn-down/components__arcade__fourline__FourlineScreen.json": games_Burn_Down_Components_Arcade_Fourline_FourlineScreen_DeCh,
    "games/burn-down/components__leo-miners__LeoMinersGame.json": games_Burn_Down_Components_Leo_Miners_LeoMinersGame_DeCh,
    "games/burn-down/components__solo-games__SoloGameHelpModal.json": games_Burn_Down_Components_Solo_Games_SoloGameHelpModal_DeCh,
    "games/burn-down/components__solo-games__engines__MleoPicturePuzzleEngine.json": games_Burn_Down_Components_Solo_Games_Engines_MleoPicturePuzzleEngine_DeCh,
    "global-burn-down/burn-down-index.json": global_Burn_Down_Burn_Down_Index_DeCh,
    "global-burn-down/components__promo__PromoVideoModal.json": global_Burn_Down_Components_Promo_PromoVideoModal_DeCh,
    "global-burn-down/components__student__StudentAssignedActivityQuestionStage.json": global_Burn_Down_Components_Student_StudentAssignedActivityQuestionStage_DeCh,
    "global-burn-down/components__teacher-portal__TeacherActivityStudentAnswersModal.json": global_Burn_Down_Components_Teacher_Portal_TeacherActivityStudentAnswersModal_DeCh,
    "global-burn-down/lib__site__public-page-seo.json": global_Burn_Down_Lib_Site_Public_Page_Seo_DeCh,
    "global-burn-down/lib__worksheets__worksheet-ui.json": global_Burn_Down_Lib_Worksheets_Worksheet_Ui_DeCh,
    "global-burn-down/pages___app.json": global_Burn_Down_Pages_App_DeCh,
    "global-burn-down/pages__student__activity__[activityId].json": global_Burn_Down_Pages_Student_Activity_ActivityId_DeCh,
    "learning/diagnostic-labels.json": learning_Diagnostic_Labels_DeCh,
    "rewards/ui.json": rewards_Ui_DeCh,
  }),
  "nl-BE": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_nlBE,
    "books/registry-titles.json": Books_Registry_Titles_nlBE,
    "books/ui.json": Books_Ui_nlBE,
    "demo/ui.json": Demo_Ui_nlBE,
    "games/burn-down-index.json": Games_Burn_Down_Index_nlBE,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_nlBE,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_nlBE,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_nlBE,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_nlBE,
    "global-burn-down/lib__learning__subject-permissions__subject-access.server.json": Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_nlBE,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_nlBE,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_nlBE,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_nlBE,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_nlBE,
    "global-burn-down/lib__worksheets__worksheet-ui.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_nlBE,
    "global-burn-down/pages___app.json": Global_Burn_Down_Pages_App_nlBE,
    "global-burn-down/pages__api__parent__create-student.json": Global_Burn_Down_Pages_Api_Parent_Create_Student_nlBE,
    "global-burn-down/pages__school__classes__index.json": Global_Burn_Down_Pages_School_Classes_Index_nlBE,
    "global-burn-down/pages__school__students__index.json": Global_Burn_Down_Pages_School_Students_Index_nlBE,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_nlBE,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_nlBE,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_nlBE,
    "rewards/ui.json": Rewards_Ui_nlBE,
  }),
  "fr-BE": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_frBE,
    "books/registry-titles.json": Books_Registry_Titles_frBE,
    "books/ui.json": Books_Ui_frBE,
    "demo/ui.json": Demo_Ui_frBE,
    "games/burn-down-index.json": Games_Burn_Down_Index_frBE,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frBE,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frBE,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frBE,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_frBE,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_frBE,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frBE,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frBE,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frBE,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_frBE,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frBE,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frBE,
    "rewards/ui.json": Rewards_Ui_frBE,
  }),
  "fr-CH": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_frCH,
    "books/registry-titles.json": Books_Registry_Titles_frCH,
    "books/ui.json": Books_Ui_frCH,
    "demo/ui.json": Demo_Ui_frCH,
    "games/burn-down-index.json": Games_Burn_Down_Index_frCH,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frCH,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frCH,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frCH,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_frCH,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_frCH,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frCH,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frCH,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frCH,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_frCH,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frCH,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frCH,
    "rewards/ui.json": Rewards_Ui_frCH,
  }),
  "it-CH": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_itCH,
    "books/registry-titles.json": Books_Registry_Titles_itCH,
    "books/ui.json": Books_Ui_itCH,
    "demo/ui.json": Demo_Ui_itCH,
    "games/burn-down-index.json": Games_Burn_Down_Index_itCH,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_itCH,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_itCH,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_itCH,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_itCH,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_itCH,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_itCH,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_itCH,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_itCH,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_itCH,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_itCH,
    "rewards/ui.json": Rewards_Ui_itCH,
  }),
  "en-IN": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_enIN,
    "books/registry-titles.json": Books_Registry_Titles_enIN,
    "books/ui.json": Books_Ui_enIN,
    "demo/ui.json": Demo_Ui_enIN,
    "games/burn-down-index.json": Games_Burn_Down_Index_enIN,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enIN,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enIN,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enIN,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enIN,
    "games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json": Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enIN,
    "games/burn-down/lib__educational-games__educational-game-registry.json": Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enIN,
    "games/burn-down/lib__solo-games__solo-game-registry.json": Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enIN,
    "games/sort-shapes.json": Games_Sort_Shapes_enIN,
    "games/ui-pack-index.json": Games_Ui_Pack_Index_enIN,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_enIN,
    "global-burn-down/lib__learning__subject-permissions__subject-access.server.json": Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_enIN,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_enIN,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_enIN,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_enIN,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_enIN,
    "global-burn-down/lib__worksheets__worksheet-ui.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enIN,
    "global-burn-down/pages___app.json": Global_Burn_Down_Pages_App_enIN,
    "global-burn-down/pages__api__parent__create-student.json": Global_Burn_Down_Pages_Api_Parent_Create_Student_enIN,
    "global-burn-down/pages__school__classes__index.json": Global_Burn_Down_Pages_School_Classes_Index_enIN,
    "global-burn-down/pages__school__students__index.json": Global_Burn_Down_Pages_School_Students_Index_enIN,
    "global-burn-down/utils__question-metadata-qa__question-bank-discovery.json": Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enIN,
    "learning/burn-down-index.json": Learning_Burn_Down_Index_enIN,
    "learning/burn-down/components__parent__ParentCurriculumContent.json": Learning_Burn_Down_Components_Parent_ParentCurriculumContent_enIN,
    "learning/burn-down/pages__learning__english-master.json": Learning_Burn_Down_Pages_Learning_English_Master_enIN,
    "learning/burn-down/utils__topic-next-step-engine.json": Learning_Burn_Down_Utils_Topic_Next_Step_Engine_enIN,
    "learning/diagnostic-labels.json": Learning_Diagnostic_Labels_enIN,
    "learning/example-pattern-diagnostics-payload.json": Learning_Example_Pattern_Diagnostics_Payload_enIN,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_enIN,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_enIN,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enIN,
    "reports/burn-down/utils__parent-report-out-of-grade-transparency.json": Reports_Burn_Down_Utils_Parent_Report_Out_Of_Grade_Transparency_enIN,
    "reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json": Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enIN,
    "reports/burn-down/utils__parent-report-surface__parent-topic-tier.json": Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enIN,
    "rewards/card-catalog.json": Rewards_Card_Catalog_enIN,
    "rewards/ui.json": Rewards_Ui_enIN,
  }),
  "en-GH": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_enGH,
    "books/registry-titles.json": Books_Registry_Titles_enGH,
    "books/ui.json": Books_Ui_enGH,
    "demo/ui.json": Demo_Ui_enGH,
    "games/burn-down-index.json": Games_Burn_Down_Index_enGH,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enGH,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enGH,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enGH,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enGH,
    "games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json": Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enGH,
    "games/burn-down/lib__educational-games__educational-game-registry.json": Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enGH,
    "games/burn-down/lib__solo-games__solo-game-registry.json": Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enGH,
    "games/sort-shapes.json": Games_Sort_Shapes_enGH,
    "games/ui-pack-index.json": Games_Ui_Pack_Index_enGH,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_enGH,
    "global-burn-down/lib__learning__subject-permissions__subject-access.server.json": Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_enGH,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_enGH,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_enGH,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_enGH,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_enGH,
    "global-burn-down/lib__worksheets__worksheet-ui.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enGH,
    "global-burn-down/pages___app.json": Global_Burn_Down_Pages_App_enGH,
    "global-burn-down/pages__api__parent__create-student.json": Global_Burn_Down_Pages_Api_Parent_Create_Student_enGH,
    "global-burn-down/pages__school__classes__index.json": Global_Burn_Down_Pages_School_Classes_Index_enGH,
    "global-burn-down/pages__school__students__index.json": Global_Burn_Down_Pages_School_Students_Index_enGH,
    "global-burn-down/utils__question-metadata-qa__question-bank-discovery.json": Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enGH,
    "learning/burn-down-index.json": Learning_Burn_Down_Index_enGH,
    "learning/burn-down/components__parent__ParentCurriculumContent.json": Learning_Burn_Down_Components_Parent_ParentCurriculumContent_enGH,
    "learning/burn-down/pages__learning__english-master.json": Learning_Burn_Down_Pages_Learning_English_Master_enGH,
    "learning/burn-down/utils__topic-next-step-engine.json": Learning_Burn_Down_Utils_Topic_Next_Step_Engine_enGH,
    "learning/diagnostic-labels.json": Learning_Diagnostic_Labels_enGH,
    "learning/example-pattern-diagnostics-payload.json": Learning_Example_Pattern_Diagnostics_Payload_enGH,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_enGH,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_enGH,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enGH,
    "reports/burn-down/utils__parent-report-out-of-grade-transparency.json": Reports_Burn_Down_Utils_Parent_Report_Out_Of_Grade_Transparency_enGH,
    "reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json": Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enGH,
    "reports/burn-down/utils__parent-report-surface__parent-topic-tier.json": Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enGH,
    "rewards/card-catalog.json": Rewards_Card_Catalog_enGH,
    "rewards/ui.json": Rewards_Ui_enGH,
  }),
  "fr-SN": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_frSN,
    "books/registry-titles.json": Books_Registry_Titles_frSN,
    "books/ui.json": Books_Ui_frSN,
    "demo/ui.json": Demo_Ui_frSN,
    "games/burn-down-index.json": Games_Burn_Down_Index_frSN,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frSN,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frSN,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frSN,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_frSN,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_frSN,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frSN,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frSN,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frSN,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_frSN,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frSN,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frSN,
    "rewards/ui.json": Rewards_Ui_frSN,
  }),
  "fr-CD": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_frCD,
    "books/registry-titles.json": Books_Registry_Titles_frCD,
    "books/ui.json": Books_Ui_frCD,
    "demo/ui.json": Demo_Ui_frCD,
    "games/burn-down-index.json": Games_Burn_Down_Index_frCD,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frCD,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frCD,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frCD,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_frCD,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_frCD,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frCD,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frCD,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frCD,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_frCD,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frCD,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frCD,
    "rewards/ui.json": Rewards_Ui_frCD,
  }),
  "es-US": Object.freeze({
    "books/registry-titles.json": Books_Registry_titles_esUS,
    "books/ui.json": Books_Ui_esUS,
    "demo/ui.json": Demo_Ui_esUS,
    "global-burn-down/components__promo__PromoMobileCompareVideo.json": Global_burn_down_Components_Promo_PromoMobileCompareVideo_esUS,
    "global-burn-down/lib__site__public-page-seo.json": Global_burn_down_Lib_Site_Public_page_seo_esUS,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_burn_down_Lib_Teacher_portal_Teacher_class_grade_esUS,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_burn_down_Lib_Teacher_server_Teacher_dashboard_server_esUS,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_burn_down_Lib_Worksheets_Worksheet_meta_labels_en_server_esUS,
    "global-burn-down/lib__worksheets__worksheet-ui.json": Global_burn_down_Lib_Worksheets_Worksheet_ui_esUS,
    "global-burn-down/pages___app.json": Global_burn_down_Pages_App_esUS,
    "rewards/ui.json": Rewards_Ui_esUS,
  }),
  "ru-KZ": Object.freeze({
    "global-burn-down/burn-down-index.json": Global_burn_down_Burn_down_index_ruKZ,
    "global-burn-down/lib__site__public-page-seo.json": Global_burn_down_Lib_Site_Public_page_seo_ruKZ,
    "global-burn-down/pages__school__classes__index.json": Global_burn_down_Pages_School_Classes_Index_ruKZ,
  }),
  "ru-UZ": Object.freeze({
    "global-burn-down/burn-down-index.json": Global_burn_down_Burn_down_index_ruUZ,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_burn_down_Components_Teacher_portal_TeacherDashboardClient_ruUZ,
    "global-burn-down/lib__site__public-page-seo.json": Global_burn_down_Lib_Site_Public_page_seo_ruUZ,
    "global-burn-down/pages__school__classes__index.json": Global_burn_down_Pages_School_Classes_Index_ruUZ,
  }),
  "ru-KG": Object.freeze({
    "global-burn-down/burn-down-index.json": Global_burn_down_Burn_down_index_ruKG,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_burn_down_Components_Teacher_portal_TeacherDashboardClient_ruKG,
    "global-burn-down/lib__site__public-page-seo.json": Global_burn_down_Lib_Site_Public_page_seo_ruKG,
    "global-burn-down/pages__school__classes__index.json": Global_burn_down_Pages_School_Classes_Index_ruKG,
    "global-burn-down/pages__school__students__index.json": Global_burn_down_Pages_School_Students_Index_ruKG,
  }),
  "ru-BY": Object.freeze({
    "global-burn-down/burn-down-index.json": Global_burn_down_Burn_down_index_ruBY,
    "global-burn-down/lib__site__public-page-seo.json": Global_burn_down_Lib_Site_Public_page_seo_ruBY,
    "global-burn-down/pages__school__classes__index.json": Global_burn_down_Pages_School_Classes_Index_ruBY,
  }),
  "en-RW": Object.freeze({
    "books/english-page-skills.json": Books_English_page_skills_enRW,
    "books/registry-titles.json": Books_Registry_titles_enRW,
    "books/ui.json": Books_Ui_enRW,
    "demo/ui.json": Demo_Ui_enRW,
    "games/burn-down-index.json": Games_Burn_down_index_enRW,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_down_Components_Educational_games_Leo_lab_Leo_lab_data_enRW,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json": Games_Burn_down_Components_Educational_games_Leo_lab_Leo_lab_experiments_clean_enRW,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_down_Components_Educational_games_Leo_word_detective_Leo_word_detective_data_enRW,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_down_Components_Educational_games_Leo_word_train_Leo_word_train_data_enRW,
    "games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json": Games_Burn_down_Components_Solo_games_Prototypes_Dev_ConnectColorsPrototype_enRW,
    "games/burn-down/lib__educational-games__educational-game-registry.json": Games_Burn_down_Lib_Educational_games_Educational_game_registry_enRW,
    "games/burn-down/lib__solo-games__solo-game-registry.json": Games_Burn_down_Lib_Solo_games_Solo_game_registry_enRW,
    "games/sort-shapes.json": Games_Sort_shapes_enRW,
    "games/ui-pack-index.json": Games_Ui_pack_index_enRW,
    "global-burn-down/burn-down-index.json": Global_burn_down_Burn_down_index_enRW,
    "global-burn-down/lib__learning__subject-permissions__subject-access.server.json": Global_burn_down_Lib_Learning_Subject_permissions_Subject_access_server_enRW,
    "global-burn-down/lib__site__public-page-seo.json": Global_burn_down_Lib_Site_Public_page_seo_enRW,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_burn_down_Lib_Teacher_portal_Teacher_class_grade_enRW,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_burn_down_Lib_Teacher_server_Teacher_dashboard_server_enRW,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_burn_down_Lib_Worksheets_Worksheet_meta_labels_en_server_enRW,
    "global-burn-down/lib__worksheets__worksheet-ui.json": Global_burn_down_Lib_Worksheets_Worksheet_ui_enRW,
    "global-burn-down/pages___app.json": Global_burn_down_Pages_App_enRW,
    "global-burn-down/pages__api__parent__create-student.json": Global_burn_down_Pages_Api_Parent_Create_student_enRW,
    "global-burn-down/pages__school__classes__index.json": Global_burn_down_Pages_School_Classes_Index_enRW,
    "global-burn-down/pages__school__students__index.json": Global_burn_down_Pages_School_Students_Index_enRW,
    "global-burn-down/utils__question-metadata-qa__question-bank-discovery.json": Global_burn_down_Utils_Question_metadata_qa_Question_bank_discovery_enRW,
    "learning/burn-down-index.json": Learning_Burn_down_index_enRW,
    "learning/burn-down/components__parent__ParentCurriculumContent.json": Learning_Burn_down_Components_Parent_ParentCurriculumContent_enRW,
    "learning/burn-down/pages__learning__english-master.json": Learning_Burn_down_Pages_Learning_English_master_enRW,
    "learning/burn-down/utils__topic-next-step-engine.json": Learning_Burn_down_Utils_Topic_next_step_engine_enRW,
    "learning/diagnostic-labels.json": Learning_Diagnostic_labels_enRW,
    "learning/example-pattern-diagnostics-payload.json": Learning_Example_pattern_diagnostics_payload_enRW,
    "reports/burn-down-index.json": Reports_Burn_down_index_enRW,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_down_Components_Parent_report_detailed_surface_enRW,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_down_Utils_Parent_report_language_Grade_aware_recommendation_templates_enRW,
    "reports/burn-down/utils__parent-report-out-of-grade-transparency.json": Reports_Burn_down_Utils_Parent_report_out_of_grade_transparency_enRW,
    "reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json": Reports_Burn_down_Utils_Parent_report_output_integrity_Zero_evidence_policy_tests_enRW,
    "reports/burn-down/utils__parent-report-surface__parent-topic-tier.json": Reports_Burn_down_Utils_Parent_report_surface_Parent_topic_tier_enRW,
    "rewards/card-catalog.json": Rewards_Card_catalog_enRW,
    "rewards/ui.json": Rewards_Ui_enRW,
  }),
  "fr-CM": Object.freeze({
    "books/english-page-skills.json": Books_English_page_skills_frCM,
    "books/registry-titles.json": Books_Registry_titles_frCM,
    "books/ui.json": Books_Ui_frCM,
    "demo/ui.json": Demo_Ui_frCM,
    "games/burn-down-index.json": Games_Burn_down_index_frCM,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_down_Components_Educational_games_Leo_lab_Leo_lab_data_frCM,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_down_Components_Educational_games_Leo_word_detective_Leo_word_detective_data_frCM,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_down_Components_Educational_games_Leo_word_train_Leo_word_train_data_frCM,
    "global-burn-down/burn-down-index.json": Global_burn_down_Burn_down_index_frCM,
    "global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json": Global_burn_down_Components_School_portal_SchoolTeacherClassStudentsModal_frCM,
    "global-burn-down/components__teacher-portal__TeacherClassReportModal.json": Global_burn_down_Components_Teacher_portal_TeacherClassReportModal_frCM,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_burn_down_Components_Teacher_portal_TeacherDashboardClient_frCM,
    "global-burn-down/components__worksheet-activities__TeacherWorksheetReport.json": Global_burn_down_Components_Worksheet_activities_TeacherWorksheetReport_frCM,
    "global-burn-down/lib__site__public-page-seo.json": Global_burn_down_Lib_Site_Public_page_seo_frCM,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_burn_down_Lib_Teacher_portal_Teacher_class_grade_frCM,
    "global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json": Global_burn_down_Lib_Teacher_portal_Teacher_smoke_artifacts_frCM,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_burn_down_Lib_Teacher_server_Teacher_dashboard_server_frCM,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_burn_down_Lib_Worksheets_Worksheet_meta_labels_en_server_frCM,
    "global-burn-down/pages__teacher__class__[classId].json": Global_burn_down_Pages_Teacher_Class_ClassId_frCM,
    "global-burn-down/pages__teacher__class__[classId]__activities__index.json": Global_burn_down_Pages_Teacher_Class_ClassId_Activities_Index_frCM,
    "global-burn-down/pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId].json": Global_burn_down_Pages_Teacher_Class_ClassId_Worksheets_WorksheetId_Grade_StudentId_frCM,
    "global-burn-down/pages__teacher__worksheets__[worksheetId]__grade__[studentId].json": Global_burn_down_Pages_Teacher_Worksheets_WorksheetId_Grade_StudentId_frCM,
    "reports/burn-down-index.json": Reports_Burn_down_index_frCM,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_down_Components_Parent_report_detailed_surface_frCM,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_down_Utils_Parent_report_language_Grade_aware_recommendation_templates_frCM,
    "rewards/ui.json": Rewards_Ui_frCM,
  }),
  "en-CM": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_enCM,
    "books/registry-titles.json": Books_Registry_Titles_enCM,
    "books/ui.json": Books_Ui_enCM,
    "demo/ui.json": Demo_Ui_enCM,
    "games/burn-down-index.json": Games_Burn_Down_Index_enCM,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enCM,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enCM,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enCM,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enCM,
    "games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json": Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enCM,
    "games/burn-down/lib__educational-games__educational-game-registry.json": Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enCM,
    "games/burn-down/lib__solo-games__solo-game-registry.json": Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enCM,
    "games/sort-shapes.json": Games_Sort_Shapes_enCM,
    "games/ui-pack-index.json": Games_Ui_Pack_Index_enCM,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_enCM,
    "global-burn-down/lib__learning__subject-permissions__subject-access.server.json": Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_enCM,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_enCM,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_enCM,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_enCM,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_enCM,
    "global-burn-down/lib__worksheets__worksheet-ui.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enCM,
    "global-burn-down/pages___app.json": Global_Burn_Down_Pages_App_enCM,
    "global-burn-down/pages__api__parent__create-student.json": Global_Burn_Down_Pages_Api_Parent_Create_Student_enCM,
    "global-burn-down/pages__school__classes__index.json": Global_Burn_Down_Pages_School_Classes_Index_enCM,
    "global-burn-down/pages__school__students__index.json": Global_Burn_Down_Pages_School_Students_Index_enCM,
    "global-burn-down/utils__question-metadata-qa__question-bank-discovery.json": Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enCM,
    "learning/burn-down-index.json": Learning_Burn_Down_Index_enCM,
    "learning/burn-down/components__parent__ParentCurriculumContent.json": Learning_Burn_Down_Components_Parent_ParentCurriculumContent_enCM,
    "learning/burn-down/pages__learning__english-master.json": Learning_Burn_Down_Pages_Learning_English_Master_enCM,
    "learning/burn-down/utils__topic-next-step-engine.json": Learning_Burn_Down_Utils_Topic_Next_Step_Engine_enCM,
    "learning/diagnostic-labels.json": Learning_Diagnostic_Labels_enCM,
    "learning/example-pattern-diagnostics-payload.json": Learning_Example_Pattern_Diagnostics_Payload_enCM,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_enCM,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_enCM,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enCM,
    "reports/burn-down/utils__parent-report-out-of-grade-transparency.json": Reports_Burn_Down_Utils_Parent_Report_Out_Of_Grade_Transparency_enCM,
    "reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json": Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enCM,
    "reports/burn-down/utils__parent-report-surface__parent-topic-tier.json": Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enCM,
    "rewards/card-catalog.json": Rewards_Card_Catalog_enCM,
    "rewards/ui.json": Rewards_Ui_enCM,
    "global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json": Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_enCM,
    "global-burn-down/components__teacher-portal__TeacherClassReportModal.json": Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_enCM,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_enCM,
    "global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_enCM,
    "global-burn-down/pages__teacher__class__[classId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_enCM,
    "global-burn-down/pages__teacher__class__[classId]__activities__index.json": Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_enCM,
  }),
  "fr-BJ": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_frBJ,
    "books/registry-titles.json": Books_Registry_Titles_frBJ,
    "books/ui.json": Books_Ui_frBJ,
    "demo/ui.json": Demo_Ui_frBJ,
    "games/burn-down-index.json": Games_Burn_Down_Index_frBJ,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frBJ,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frBJ,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frBJ,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_frBJ,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_frBJ,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frBJ,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frBJ,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frBJ,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_frBJ,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frBJ,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frBJ,
    "rewards/ui.json": Rewards_Ui_frBJ,
    "global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json": Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_frBJ,
    "global-burn-down/components__teacher-portal__TeacherClassReportModal.json": Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_frBJ,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_frBJ,
    "global-burn-down/components__worksheet-activities__TeacherWorksheetReport.json": Global_Burn_Down_Components_Worksheet_Activities_TeacherWorksheetReport_frBJ,
    "global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_frBJ,
    "global-burn-down/pages__teacher__class__[classId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_frBJ,
    "global-burn-down/pages__teacher__class__[classId]__activities__index.json": Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_frBJ,
    "global-burn-down/pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_Worksheets_WorksheetId_Grade_StudentId_frBJ,
    "global-burn-down/pages__teacher__worksheets__[worksheetId]__grade__[studentId].json": Global_Burn_Down_Pages_Teacher_Worksheets_WorksheetId_Grade_StudentId_frBJ,
  }),
  "en-MU": Object.freeze({
    "books/registry-titles.json": Books_Registry_Titles_enMU,
    "books/ui.json": Books_Ui_enMU,
    "demo/ui.json": Demo_Ui_enMU,
    "games/burn-down-index.json": Games_Burn_Down_Index_enMU,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enMU,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enMU,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enMU,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enMU,
    "games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json": Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enMU,
    "games/burn-down/lib__educational-games__educational-game-registry.json": Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enMU,
    "games/burn-down/lib__solo-games__solo-game-registry.json": Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enMU,
    "games/sort-shapes.json": Games_Sort_Shapes_enMU,
    "games/ui-pack-index.json": Games_Ui_Pack_Index_enMU,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_enMU,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_enMU,
    "global-burn-down/lib__worksheets__worksheet-ui.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enMU,
    "global-burn-down/pages___app.json": Global_Burn_Down_Pages_App_enMU,
    "global-burn-down/pages__school__classes__index.json": Global_Burn_Down_Pages_School_Classes_Index_enMU,
    "global-burn-down/utils__question-metadata-qa__question-bank-discovery.json": Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enMU,
    "learning/burn-down-index.json": Learning_Burn_Down_Index_enMU,
    "learning/burn-down/pages__learning__english-master.json": Learning_Burn_Down_Pages_Learning_English_Master_enMU,
    "learning/example-pattern-diagnostics-payload.json": Learning_Example_Pattern_Diagnostics_Payload_enMU,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_enMU,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enMU,
    "reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json": Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enMU,
    "reports/burn-down/utils__parent-report-surface__parent-topic-tier.json": Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enMU,
    "rewards/card-catalog.json": Rewards_Card_Catalog_enMU,
    "rewards/ui.json": Rewards_Ui_enMU,
  }),
  "fr-GN": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_frGN,
    "books/registry-titles.json": Books_Registry_Titles_frGN,
    "books/ui.json": Books_Ui_frGN,
    "demo/ui.json": Demo_Ui_frGN,
    "games/burn-down-index.json": Games_Burn_Down_Index_frGN,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frGN,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frGN,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frGN,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_frGN,
    "global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json": Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_frGN,
    "global-burn-down/components__teacher-portal__TeacherClassReportModal.json": Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_frGN,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_frGN,
    "global-burn-down/components__worksheet-activities__TeacherWorksheetReport.json": Global_Burn_Down_Components_Worksheet_Activities_TeacherWorksheetReport_frGN,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_frGN,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frGN,
    "global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_frGN,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frGN,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frGN,
    "global-burn-down/pages__teacher__class__[classId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_frGN,
    "global-burn-down/pages__teacher__class__[classId]__activities__index.json": Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_frGN,
    "global-burn-down/pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_Worksheets_WorksheetId_Grade_StudentId_frGN,
    "global-burn-down/pages__teacher__worksheets__[worksheetId]__grade__[studentId].json": Global_Burn_Down_Pages_Teacher_Worksheets_WorksheetId_Grade_StudentId_frGN,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_frGN,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frGN,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frGN,
    "rewards/ui.json": Rewards_Ui_frGN,
  }),
  "fr-TG": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_frTG,
    "books/registry-titles.json": Books_Registry_Titles_frTG,
    "books/ui.json": Books_Ui_frTG,
    "demo/ui.json": Demo_Ui_frTG,
    "games/burn-down-index.json": Games_Burn_Down_Index_frTG,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frTG,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frTG,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frTG,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_frTG,
    "global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json": Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_frTG,
    "global-burn-down/components__teacher-portal__TeacherClassReportModal.json": Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_frTG,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_frTG,
    "global-burn-down/components__worksheet-activities__TeacherWorksheetReport.json": Global_Burn_Down_Components_Worksheet_Activities_TeacherWorksheetReport_frTG,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_frTG,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frTG,
    "global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_frTG,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frTG,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frTG,
    "global-burn-down/pages__teacher__class__[classId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_frTG,
    "global-burn-down/pages__teacher__class__[classId]__activities__index.json": Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_frTG,
    "global-burn-down/pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_Worksheets_WorksheetId_Grade_StudentId_frTG,
    "global-burn-down/pages__teacher__worksheets__[worksheetId]__grade__[studentId].json": Global_Burn_Down_Pages_Teacher_Worksheets_WorksheetId_Grade_StudentId_frTG,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_frTG,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frTG,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frTG,
    "rewards/ui.json": Rewards_Ui_frTG,
  }),
  "fr-GA": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_frGA,
    "books/registry-titles.json": Books_Registry_Titles_frGA,
    "books/ui.json": Books_Ui_frGA,
    "demo/ui.json": Demo_Ui_frGA,
    "games/burn-down-index.json": Games_Burn_Down_Index_frGA,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frGA,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frGA,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frGA,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_frGA,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_frGA,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frGA,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frGA,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frGA,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_frGA,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frGA,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frGA,
    "rewards/ui.json": Rewards_Ui_frGA,
    "global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json": Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_frGA,
    "global-burn-down/components__teacher-portal__TeacherClassReportModal.json": Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_frGA,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_frGA,
    "global-burn-down/components__worksheet-activities__TeacherWorksheetReport.json": Global_Burn_Down_Components_Worksheet_Activities_TeacherWorksheetReport_frGA,
    "global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_frGA,
    "global-burn-down/pages__teacher__class__[classId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_frGA,
    "global-burn-down/pages__teacher__class__[classId]__activities__index.json": Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_frGA,
    "global-burn-down/pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_Worksheets_WorksheetId_Grade_StudentId_frGA,
    "global-burn-down/pages__teacher__worksheets__[worksheetId]__grade__[studentId].json": Global_Burn_Down_Pages_Teacher_Worksheets_WorksheetId_Grade_StudentId_frGA,
  }),
  "fr-CG": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_frCG,
    "books/registry-titles.json": Books_Registry_Titles_frCG,
    "books/ui.json": Books_Ui_frCG,
    "demo/ui.json": Demo_Ui_frCG,
    "games/burn-down-index.json": Games_Burn_Down_Index_frCG,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_frCG,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_frCG,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_frCG,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_frCG,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_frCG,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_frCG,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_frCG,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_frCG,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_frCG,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_frCG,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_frCG,
    "rewards/ui.json": Rewards_Ui_frCG,
  }),
  "nl-SR": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_nlSR,
    "books/registry-titles.json": Books_Registry_Titles_nlSR,
    "books/ui.json": Books_Ui_nlSR,
    "demo/ui.json": Demo_Ui_nlSR,
    "games/burn-down-index.json": Games_Burn_Down_Index_nlSR,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_nlSR,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_nlSR,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_nlSR,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_nlSR,
    "global-burn-down/lib__learning__subject-permissions__subject-access.server.json": Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_nlSR,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_nlSR,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_nlSR,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_nlSR,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_nlSR,
    "global-burn-down/lib__worksheets__worksheet-ui.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_nlSR,
    "global-burn-down/pages___app.json": Global_Burn_Down_Pages_App_nlSR,
    "global-burn-down/pages__api__parent__create-student.json": Global_Burn_Down_Pages_Api_Parent_Create_Student_nlSR,
    "global-burn-down/pages__school__classes__index.json": Global_Burn_Down_Pages_School_Classes_Index_nlSR,
    "global-burn-down/pages__school__students__index.json": Global_Burn_Down_Pages_School_Students_Index_nlSR,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_nlSR,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_nlSR,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_nlSR,
    "rewards/ui.json": Rewards_Ui_nlSR,
  }),
  "pt-CV": Object.freeze({
    "demo/ui.json": Demo_Ui_ptCV,
    "games/burn-down-index.json": Games_Burn_Down_Index_ptCV,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_ptCV,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_ptCV,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_ptCV,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_ptCV,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_ptCV,
    "global-burn-down/pages___app.json": Global_Burn_Down_Pages_App_ptCV,
    "learning/burn-down-index.json": Learning_Burn_Down_Index_ptCV,
    "learning/burn-down/components__parent__ParentCurriculumContent.json": Learning_Burn_Down_Components_Parent_ParentCurriculumContent_ptCV,
    "rewards/ui.json": Rewards_Ui_ptCV,
    "books/english-page-skills.json": Books_English_Page_Skills_ptCV,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_ptCV,
    "global-burn-down/lib__school-portal__operator-grant-labels.json": Global_Burn_Down_Lib_School_Portal_Operator_Grant_Labels_ptCV,
    "global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_ptCV,
    "global-burn-down/lib__worksheets__worksheet-math-practice-format.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Math_Practice_Format_ptCV,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_ptCV,
    "global-burn-down/pages__teacher__class__[classId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_ptCV,
    "learning/burn-down/pages__learning__english-master.json": Learning_Burn_Down_Pages_Learning_English_Master_ptCV,
    "learning/diagnostic-labels.json": Learning_Diagnostic_Labels_ptCV,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_ptCV,
    "reports/burn-down/utils__math-report-generator.json": Reports_Burn_Down_Utils_Math_Report_Generator_ptCV,
    "reports/burn-down/utils__parent-report-insights__normalize-parent-facing-labels.json": Reports_Burn_Down_Utils_Parent_Report_Insights_Normalize_Parent_Facing_Labels_ptCV,
    "reports/burn-down/utils__parent-report-language__parent-report-copy-spec.json": Reports_Burn_Down_Utils_Parent_Report_Language_Parent_Report_Copy_Spec_ptCV,
    "reports/burn-down/utils__parent-report-out-of-grade-transparency.json": Reports_Burn_Down_Utils_Parent_Report_Out_Of_Grade_Transparency_ptCV,
  }),
  "es-GQ": Object.freeze({
    "books/registry-titles.json": Books_Registry_Titles_esGQ,
    "books/ui.json": Books_Ui_esGQ,
    "demo/ui.json": Demo_Ui_esGQ,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_esGQ,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_esGQ,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_esGQ,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_esGQ,
    "global-burn-down/pages___app.json": Global_Burn_Down_Pages_App_esGQ,
    "rewards/ui.json": Rewards_Ui_esGQ,
    "games/burn-down-index.json": Games_Burn_Down_Index_esGQ,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_esGQ,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_esGQ,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_esGQ,
  }),
  "en-SL": Object.freeze({
    "books/english-page-skills.json": Books_English_Page_Skills_enSL,
    "books/registry-titles.json": Books_Registry_Titles_enSL,
    "books/ui.json": Books_Ui_enSL,
    "demo/ui.json": Demo_Ui_enSL,
    "games/burn-down-index.json": Games_Burn_Down_Index_enSL,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enSL,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enSL,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enSL,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enSL,
    "games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json": Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enSL,
    "games/burn-down/lib__educational-games__educational-game-registry.json": Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enSL,
    "games/burn-down/lib__solo-games__solo-game-registry.json": Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enSL,
    "games/sort-shapes.json": Games_Sort_Shapes_enSL,
    "games/ui-pack-index.json": Games_Ui_Pack_Index_enSL,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_enSL,
    "global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json": Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_enSL,
    "global-burn-down/components__teacher-portal__TeacherClassReportModal.json": Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_enSL,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_enSL,
    "global-burn-down/lib__learning__subject-permissions__subject-access.server.json": Global_Burn_Down_Lib_Learning_Subject_Permissions_Subject_Access_Server_enSL,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_enSL,
    "global-burn-down/lib__teacher-portal__teacher-class-grade.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Class_Grade_enSL,
    "global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_enSL,
    "global-burn-down/lib__teacher-server__teacher-dashboard.server.json": Global_Burn_Down_Lib_Teacher_Server_Teacher_Dashboard_Server_enSL,
    "global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Meta_Labels_En_Server_enSL,
    "global-burn-down/lib__worksheets__worksheet-ui.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enSL,
    "global-burn-down/pages___app.json": Global_Burn_Down_Pages_App_enSL,
    "global-burn-down/pages__api__parent__create-student.json": Global_Burn_Down_Pages_Api_Parent_Create_Student_enSL,
    "global-burn-down/pages__school__classes__index.json": Global_Burn_Down_Pages_School_Classes_Index_enSL,
    "global-burn-down/pages__school__students__index.json": Global_Burn_Down_Pages_School_Students_Index_enSL,
    "global-burn-down/pages__teacher__class__[classId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_enSL,
    "global-burn-down/pages__teacher__class__[classId]__activities__index.json": Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_enSL,
    "global-burn-down/utils__question-metadata-qa__question-bank-discovery.json": Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enSL,
    "learning/burn-down-index.json": Learning_Burn_Down_Index_enSL,
    "learning/burn-down/components__parent__ParentCurriculumContent.json": Learning_Burn_Down_Components_Parent_ParentCurriculumContent_enSL,
    "learning/burn-down/pages__learning__english-master.json": Learning_Burn_Down_Pages_Learning_English_Master_enSL,
    "learning/burn-down/utils__topic-next-step-engine.json": Learning_Burn_Down_Utils_Topic_Next_Step_Engine_enSL,
    "learning/diagnostic-labels.json": Learning_Diagnostic_Labels_enSL,
    "learning/example-pattern-diagnostics-payload.json": Learning_Example_Pattern_Diagnostics_Payload_enSL,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_enSL,
    "reports/burn-down/components__parent-report-detailed-surface.json": Reports_Burn_Down_Components_Parent_Report_Detailed_Surface_enSL,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enSL,
    "reports/burn-down/utils__parent-report-out-of-grade-transparency.json": Reports_Burn_Down_Utils_Parent_Report_Out_Of_Grade_Transparency_enSL,
    "reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json": Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enSL,
    "reports/burn-down/utils__parent-report-surface__parent-topic-tier.json": Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enSL,
    "rewards/card-catalog.json": Rewards_Card_Catalog_enSL,
    "rewards/ui.json": Rewards_Ui_enSL,
  }),
  "en-LR": Object.freeze({
    "games/burn-down-index.json": Games_Burn_Down_Index_enLR,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enLR,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enLR,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enLR,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_enLR,
    "global-burn-down/components__school-portal__SchoolTeacherClassStudentsModal.json": Global_Burn_Down_Components_School_Portal_SchoolTeacherClassStudentsModal_enLR,
    "global-burn-down/components__teacher-portal__TeacherClassReportModal.json": Global_Burn_Down_Components_Teacher_Portal_TeacherClassReportModal_enLR,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_enLR,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_enLR,
    "global-burn-down/lib__teacher-portal__teacher-smoke-artifacts.json": Global_Burn_Down_Lib_Teacher_Portal_Teacher_Smoke_Artifacts_enLR,
    "global-burn-down/lib__worksheets__worksheet-ui.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enLR,
    "global-burn-down/pages___app.json": Global_Burn_Down_Pages_App_enLR,
    "global-burn-down/pages__school__classes__index.json": Global_Burn_Down_Pages_School_Classes_Index_enLR,
    "global-burn-down/pages__teacher__class__[classId].json": Global_Burn_Down_Pages_Teacher_Class_ClassId_enLR,
    "global-burn-down/pages__teacher__class__[classId]__activities__index.json": Global_Burn_Down_Pages_Teacher_Class_ClassId_Activities_Index_enLR,
    "learning/burn-down-index.json": Learning_Burn_Down_Index_enLR,
    "learning/burn-down/pages__learning__english-master.json": Learning_Burn_Down_Pages_Learning_English_Master_enLR,
    "rewards/ui.json": Rewards_Ui_enLR,
  }),
  "en-GM": Object.freeze({
    "books/registry-titles.json": Books_Registry_Titles_enGM,
    "books/ui.json": Books_Ui_enGM,
    "demo/ui.json": Demo_Ui_enGM,
    "games/burn-down-index.json": Games_Burn_Down_Index_enGM,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Data_enGM,
    "games/burn-down/components__educational-games__leo-lab__leo-lab-experiments-clean.json": Games_Burn_Down_Components_Educational_Games_Leo_Lab_Leo_Lab_Experiments_Clean_enGM,
    "games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Detective_Leo_Word_Detective_Data_enGM,
    "games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json": Games_Burn_Down_Components_Educational_Games_Leo_Word_Train_Leo_Word_Train_Data_enGM,
    "games/burn-down/components__solo-games__prototypes__dev__ConnectColorsPrototype.json": Games_Burn_Down_Components_Solo_Games_Prototypes_Dev_ConnectColorsPrototype_enGM,
    "games/burn-down/lib__educational-games__educational-game-registry.json": Games_Burn_Down_Lib_Educational_Games_Educational_Game_Registry_enGM,
    "games/burn-down/lib__solo-games__solo-game-registry.json": Games_Burn_Down_Lib_Solo_Games_Solo_Game_Registry_enGM,
    "games/sort-shapes.json": Games_Sort_Shapes_enGM,
    "games/ui-pack-index.json": Games_Ui_Pack_Index_enGM,
    "global-burn-down/burn-down-index.json": Global_Burn_Down_Burn_Down_Index_enGM,
    "global-burn-down/lib__site__public-page-seo.json": Global_Burn_Down_Lib_Site_Public_Page_Seo_enGM,
    "global-burn-down/lib__worksheets__worksheet-ui.json": Global_Burn_Down_Lib_Worksheets_Worksheet_Ui_enGM,
    "global-burn-down/pages___app.json": Global_Burn_Down_Pages_App_enGM,
    "global-burn-down/pages__school__classes__index.json": Global_Burn_Down_Pages_School_Classes_Index_enGM,
    "global-burn-down/utils__question-metadata-qa__question-bank-discovery.json": Global_Burn_Down_Utils_Question_Metadata_Qa_Question_Bank_Discovery_enGM,
    "learning/burn-down-index.json": Learning_Burn_Down_Index_enGM,
    "learning/burn-down/pages__learning__english-master.json": Learning_Burn_Down_Pages_Learning_English_Master_enGM,
    "learning/example-pattern-diagnostics-payload.json": Learning_Example_Pattern_Diagnostics_Payload_enGM,
    "reports/burn-down-index.json": Reports_Burn_Down_Index_enGM,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json": Reports_Burn_Down_Utils_Parent_Report_Language_Grade_Aware_Recommendation_Templates_enGM,
    "reports/burn-down/utils__parent-report-output-integrity__zero-evidence-policy-tests.json": Reports_Burn_Down_Utils_Parent_Report_Output_Integrity_Zero_Evidence_Policy_Tests_enGM,
    "reports/burn-down/utils__parent-report-surface__parent-topic-tier.json": Reports_Burn_Down_Utils_Parent_Report_Surface_Parent_Topic_Tier_enGM,
    "rewards/card-catalog.json": Rewards_Card_Catalog_enGM,
    "rewards/ui.json": Rewards_Ui_enGM,
    "global-burn-down/components__teacher-portal__TeacherDashboardClient.json": Global_Burn_Down_Components_Teacher_Portal_TeacherDashboardClient_enGM,
  }),

"en-AU": Object.freeze({
    "books/ui.json": books_ui_EnAu,
    "demo/ui.json": demo_ui_EnAu,
    "games/burn-down-index.json": games_burn_down_index_EnAu,
    "global-burn-down/burn-down-index.json": global_burn_down_burn_down_index_EnAu,
    "learning/burn-down-index.json": learning_burn_down_index_EnAu,
    "learning/diagnostic-labels.json": learning_diagnostic_labels_EnAu,
    "reports/burn-down-index.json": reports_burn_down_index_EnAu,
    "rewards/ui.json": rewards_ui_EnAu,
  }),
  "en-NZ": Object.freeze({
    "books/english-page-skills.json": books_english_page_skills_EnNz,
    "books/registry-titles.json": books_registry_titles_EnNz,
    "books/ui.json": books_ui_EnNz,
    "demo/ui.json": demo_ui_EnNz,
    "games/burn-down-index.json": games_burn_down_index_EnNz,
    "games/sort-shapes.json": games_sort_shapes_EnNz,
    "games/ui-pack-index.json": games_ui_pack_index_EnNz,
    "global-burn-down/burn-down-index.json": global_burn_down_burn_down_index_EnNz,
    // Index is runtime authority (includes index-only curriculum-audit slugs).
    "learning/burn-down-index.json": learning_burn_down_index_EnNz,
    "learning/diagnostic-labels.json": learning_diagnostic_labels_EnNz,
    "learning/example-pattern-diagnostics-payload.json": learning_example_pattern_diagnostics_payload_EnNz,
    "reports/burn-down-index.json": reports_burn_down_index_EnNz,
    "rewards/card-catalog.json": rewards_card_catalog_EnNz,
    "rewards/ui.json": rewards_ui_EnNz,
  }),
  "en-IE": Object.freeze({
    "books/registry-titles.json": books_registry_titles_EnIe,
    "books/ui.json": books_ui_EnIe,
    "demo/ui.json": demo_ui_EnIe,
    "games/burn-down-index.json": gamesBurnDownIndex_EnIe,
    "games/sort-shapes.json": games_sort_shapes_EnIe,
    "games/ui-pack-index.json": games_ui_pack_index_EnIe,
    "global-burn-down/burn-down-index.json": global_burn_downBurnDownIndex_EnIe,
    "learning/burn-down-index.json": learningBurnDownIndex_EnIe,
    "learning/diagnostic-labels.json": learning_diagnostic_labels_EnIe,
    "reports/burn-down-index.json": reportsBurnDownIndex_EnIe,
    "rewards/ui.json": rewards_ui_EnIe,
  }),
  "en-GB": Object.freeze({
    "books/english-page-skills.json": books_english_page_skills_EnGb,
    "books/registry-titles.json": books_registry_titles_EnGb,
    "books/ui.json": books_ui_EnGb,
    "demo/ui.json": demo_ui_EnGb,
    "games/burn-down-index.json": gamesBurnDownIndex_EnGb,
    "global-burn-down/burn-down-index.json": global_burn_downBurnDownIndex_EnGb,
    "learning/burn-down-index.json": learningBurnDownIndex_EnGb,
    "learning/diagnostic-labels.json": learning_diagnostic_labels_EnGb,
    "learning/example-pattern-diagnostics-payload.json": learning_example_pattern_diagnostics_payload_EnGb,
    "reports/burn-down-index.json": reports_burn_down_index_EnGb,
    "rewards/card-catalog.json": rewards_card_catalog_EnGb,
    "rewards/ui.json": rewards_ui_EnGb,
  }),
  "en-CA": Object.freeze({
    "games/burn-down-index.json": games_burn_down_index_EnCa,
    "games/sort-shapes.json": games_sort_shapes_EnCa,
    "global-burn-down/burn-down-index.json": global_burn_down_burn_down_index_EnCa,
    "learning/taxonomy/math.content.json": learning_taxonomy_math_content_EnCa,
  }),
  "en-SG": Object.freeze({
    "books/english-page-skills.json": books_english_page_skills_EnSg,
    "books/registry-titles.json": books_registry_titles_EnSg,
    "books/ui.json": books_ui_EnSg,
    "demo/ui.json": demo_ui_EnSg,
    "games/burn-down-index.json": games_burn_down_index_EnSg,
    "games/sort-shapes.json": games_sort_shapes_EnSg,
    "games/ui-pack-index.json": games_ui_pack_index_EnSg,
    "global-burn-down/burn-down-index.json": global_burn_down_burn_down_index_EnSg,
    "learning/burn-down-index.json": learning_burn_down_index_EnSg,
    "learning/diagnostic-labels.json": learning_diagnostic_labels_EnSg,
    "learning/example-pattern-diagnostics-payload.json": learning_example_pattern_diagnostics_payload_EnSg,
    "reports/burn-down-index.json": reports_burn_down_index_EnSg,
    "rewards/card-catalog.json": rewards_card_catalog_EnSg,
    "rewards/ui.json": rewards_ui_EnSg,
  }),
  "en-ZA": Object.freeze({
    "books/registry-titles.json": books_registry_titles_EnZa,
    "books/ui.json": books_ui_EnZa,
    "demo/ui.json": demo_ui_EnZa,
    "games/burn-down-index.json": gamesBurnDownIndex_EnZa,
    "games/sort-shapes.json": games_sort_shapes_EnZa,
    "games/ui-pack-index.json": games_ui_pack_index_EnZa,
    "global-burn-down/burn-down-index.json": global_burn_downBurnDownIndex_EnZa,
    "reports/burn-down-index.json": reports_burn_down_index_EnZa,
    "rewards/ui.json": rewards_ui_EnZa,
  }),
  // en-WLS: zero-content — inherits en-GB packs via content fallback chain only.
  // en-PH: no content-packs — inherits en via content fallback chain only.
  "en-SCT": Object.freeze({
    "books/english-page-skills.json": books_english_page_skills_EnSct,
    "books/registry-titles.json": books_registry_titles_EnSct,
    "books/ui.json": books_ui_EnSct,
    "demo/ui.json": demo_ui_EnSct,
    "games/burn-down-index.json": gamesBurnDownIndex_EnSct,
    "global-burn-down/burn-down-index.json": global_burn_downBurnDownIndex_EnSct,
    "learning/burn-down-index.json": learningBurnDownIndex_EnSct,
    "learning/diagnostic-labels.json": learning_diagnostic_labels_EnSct,
    "reports/burn-down-index.json": reports_burn_down_index_EnSct,
    "rewards/ui.json": rewards_ui_EnSct,
  }),
  "en-NIR": Object.freeze({
    "books/english-page-skills.json": books_english_page_skills_EnNir,
    "books/registry-titles.json": books_registry_titles_EnNir,
    "books/ui.json": books_ui_EnNir,
    "demo/ui.json": demo_ui_EnNir,
    "games/burn-down-index.json": gamesBurnDownIndex_EnNir,
    "global-burn-down/burn-down-index.json": global_burn_downBurnDownIndex_EnNir,
    "learning/burn-down-index.json": learningBurnDownIndex_EnNir,
    "learning/diagnostic-labels.json": learning_diagnostic_labels_EnNir,
    "reports/burn-down-index.json": reports_burn_down_index_EnNir,
    "rewards/ui.json": rewards_ui_EnNir,
  }),
};

/**
 * English-country burn-down overlay authority (final contract).
 *
 * - index: runtime overlay is the on-disk domain burn-down-index.json registered
 *   in CONTENT_PACK_CATALOG. Companion leaf JSON (if present) is a mirror only and
 *   must stay equivalent for shared keys; index-only slugs are legal.
 * - composed-leaves: runtime overlay is composed from leaf imports via
 *   composeBurnDownIndexOverlay. An on-disk index (if present) must mirror that
 *   composition; leaves are the authoring source.
 *
 * AU/NZ prefer index authority. IE/GB prefer composed-leaves, except en-GB reports
 * which registers its on-disk reports index directly.
 *
 * @type {Readonly<Record<string, Readonly<Record<string, "index" | "composed-leaves">>>>}
 */
export const ENGLISH_COUNTRY_BURN_DOWN_AUTHORITY = Object.freeze({
  "en-AU": Object.freeze({
    learning: "index",
    reports: "index",
    games: "index",
    "global-burn-down": "index",
  }),
  "en-NZ": Object.freeze({
    learning: "index",
    reports: "index",
    games: "index",
    "global-burn-down": "index",
  }),
  "en-IE": Object.freeze({
    learning: "composed-leaves",
    reports: "composed-leaves",
    games: "composed-leaves",
    "global-burn-down": "composed-leaves",
  }),
  "en-GB": Object.freeze({
    learning: "composed-leaves",
    reports: "index",
    games: "composed-leaves",
    "global-burn-down": "composed-leaves",
  }),
  "en-SCT": Object.freeze({
    learning: "composed-leaves",
    reports: "index",
    games: "composed-leaves",
    "global-burn-down": "composed-leaves",
  }),
  "en-NIR": Object.freeze({
    learning: "composed-leaves",
    reports: "index",
    games: "composed-leaves",
    "global-burn-down": "composed-leaves",
  }),
  "en-NG": Object.freeze({
    learning: "index",
    reports: "index",
    games: "index",
    "global-burn-down": "index",
  }),
});

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
