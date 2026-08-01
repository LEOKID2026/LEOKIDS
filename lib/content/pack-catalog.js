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
