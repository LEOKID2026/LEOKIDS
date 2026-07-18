/**
 * Wave F — split legacy UI chrome bucket into true chrome vs misclassified content.
 */
import { isAllowlistedFinding } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";
import { classifyFindingKind } from "./finding-classification.mjs";
import { categorizeFinding } from "./categorize-finding-rules.mjs";

/** Wave F sub-buckets for UI chrome audit. */
export const WAVE_F_BUCKETS = [
  "true_ui_chrome",
  "learning_misclassified",
  "game_misclassified",
  "books_misclassified",
  "reports_misclassified",
  "rewards_misclassified",
  "classroom_activities",
  "copilot_not_ui_chrome",
  "seo_not_ui_chrome",
  "pwa_not_ui_chrome",
  "technical_non_ui",
  "false_positive",
];

/**
 * @param {string} file
 * @param {string} text
 * @param {number} line
 */
export function classifyWaveFUiChrome(file, text, line) {
  const f = file.replace(/\\/g, "/");

  if (isAllowlistedFinding(f, line, text)) return "false_positive";

  if (
    /\/dev-student-simulator\/|pages\/learning\/dev|ui-display-labels\.js|CustomBuilderPanel/.test(
      f,
    )
  ) {
    return "technical_non_ui";
  }

  if (/learning-book|english-page-skill/.test(f)) return "books_misclassified";

  if (/parent-report|report-generator|report-language|detailed-parent-report|school-report-view-model|parent-product-contract|utils\/contracts\/parent-product/.test(f)) {
    return "reports_misclassified";
  }

  if (/reward-card|rewards\//.test(f)) return "rewards_misclassified";

  if (/components\/game-audio\//.test(f)) return "true_ui_chrome";

  if (
    /leo-miners|LeoMinersGame|solo-games|solo-game|arcade\/|components\/arcade|educational-games|offline-games|offline\/|game-pack-copy|burn-down.*games/.test(
      f,
    )
  ) {
    return "game_misclassified";
  }

  if (
    /geometry-conceptual-bank|topic-next-step|diagnostic-|taxonomy-|probe-map|math-animations|learning-patterns|ParentCurriculumContent|curriculum-pack|diagnostic-labels|curriculum-audit\/|geometry-question-generator|parent-narrative-safety-fixtures/.test(
      f,
    )
  ) {
    return "learning_misclassified";
  }

  if (
    /ai-hybrid-internal-reviewer|mock-fixtures|launch-readiness\/|global\/mock-fixtures/.test(
      f,
    )
  ) {
    return "technical_non_ui";
  }

  if (
    /classroom-activities|worksheet-labels|worksheet-ui|generate-activity-questions|teacher-activity-report|ActivityDisplayLevelSelector/.test(
      f,
    )
  ) {
    return "classroom_activities";
  }

  if (/parent-copilot|copilot-turn|ParentCopilot|parent-copilot-panel/.test(f)) {
    return "copilot_not_ui_chrome";
  }

  if (/public-page-seo|PageSeo|public-seo|GuideSeo/.test(f)) return "seo_not_ui_chrome";

  if (/game-audio-manifest|pwa-debug|service-worker/.test(f)) return "pwa_not_ui_chrome";

  const kind = classifyFindingKind(f, text, line);
  if (kind === "learning_content") return "learning_misclassified";
  if (kind === "game_content") return "game_misclassified";
  if (kind === "report_copy") return "reports_misclassified";
  if (["developer_only", "test_fixture", "technical_identifier", "brand"].includes(kind)) {
    return "technical_non_ui";
  }

  return "true_ui_chrome";
}

/**
 * @param {string} file
 * @param {string} text
 * @param {number} [line]
 */
export function categorizeFindingWaveF(file, text, line = 0) {
  const base = categorizeFinding(file, text);
  if (base !== "UI chrome") return base;

  const sub = classifyWaveFUiChrome(file, text, line);
  const remap = {
    learning_misclassified: "Learning",
    game_misclassified: "Educational games",
    books_misclassified: "Books UI",
    reports_misclassified: "Reports",
    rewards_misclassified: "Rewards",
    classroom_activities: "Worksheets",
    copilot_not_ui_chrome: "Copilot",
    seo_not_ui_chrome: "SEO",
    pwa_not_ui_chrome: "PWA/offline",
    technical_non_ui: "Internal/non-user-facing",
    false_positive: "False positives",
    true_ui_chrome: "UI chrome",
  };
  return remap[sub] || "UI chrome";
}
