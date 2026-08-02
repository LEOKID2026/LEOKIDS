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
import learning_BurnDownIndex_PtAo from "../../content-packs/pt-AO/learning/burn-down-index.json" with { type: "json" };
import learning_BurnDown_Utils_CurriculumAudit_IsraeliPrimaryCurriculumMap_PtAo from "../../content-packs/pt-AO/learning/burn-down/utils__curriculum-audit__israeli-primary-curriculum-map.json" with { type: "json" };
import learning_BurnDown_Utils_CurriculumAudit_OfficialPrimaryCurriculumSpine_PtAo from "../../content-packs/pt-AO/learning/burn-down/utils__curriculum-audit__official-primary-curriculum-spine.json" with { type: "json" };
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
import learning_BurnDown_Utils_CurriculumAudit_IsraeliPrimaryCurriculumMap_DeAt from "../../content-packs/de-AT/learning/burn-down/utils__curriculum-audit__israeli-primary-curriculum-map.json" with { type: "json" };
import learning_BurnDown_Utils_CurriculumAudit_OfficialPrimaryCurriculumSpine_DeAt from "../../content-packs/de-AT/learning/burn-down/utils__curriculum-audit__official-primary-curriculum-spine.json" with { type: "json" };
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
import learning_Burn_Down_Utils_Curriculum_Audit_Israeli_Primary_Curriculum_Map_PtMz from "../../content-packs/pt-MZ/learning/burn-down/utils__curriculum-audit__israeli-primary-curriculum-map.json" with { type: "json" };
import learning_Burn_Down_Utils_Curriculum_Audit_Official_Primary_Curriculum_Spine_PtMz from "../../content-packs/pt-MZ/learning/burn-down/utils__curriculum-audit__official-primary-curriculum-spine.json" with { type: "json" };
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
import reports_burn_down_utils_parent_report_language_grade_aware_recommendation_templates_practice_prompts_EnIe from "../../content-packs/en-IE/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__practice-prompts.json" with { type: "json" };
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
    reports_burn_down_utils_parent_report_language_grade_aware_recommendation_templates_practice_prompts_EnIe,
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
    "learning/burn-down-index.json": learning_BurnDownIndex_PtAo,
    "learning/burn-down/utils__curriculum-audit__israeli-primary-curriculum-map.json": learning_BurnDown_Utils_CurriculumAudit_IsraeliPrimaryCurriculumMap_PtAo,
    "learning/burn-down/utils__curriculum-audit__official-primary-curriculum-spine.json": learning_BurnDown_Utils_CurriculumAudit_OfficialPrimaryCurriculumSpine_PtAo,
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
    "learning/burn-down/utils__curriculum-audit__israeli-primary-curriculum-map.json": learning_BurnDown_Utils_CurriculumAudit_IsraeliPrimaryCurriculumMap_DeAt,
    "learning/burn-down/utils__curriculum-audit__official-primary-curriculum-spine.json": learning_BurnDown_Utils_CurriculumAudit_OfficialPrimaryCurriculumSpine_DeAt,
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
    "learning/burn-down/utils__curriculum-audit__israeli-primary-curriculum-map.json": learning_Burn_Down_Utils_Curriculum_Audit_Israeli_Primary_Curriculum_Map_PtMz,
    "learning/burn-down/utils__curriculum-audit__official-primary-curriculum-spine.json": learning_Burn_Down_Utils_Curriculum_Audit_Official_Primary_Curriculum_Spine_PtMz,
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
