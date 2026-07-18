/**
 * Shared hardcoded-UI category routing (Wave A–F).
 */
import { isAllowlistedFinding } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";

/**
 * @param {string} file
 * @param {string} text
 */
export function categorizeFinding(file, text) {
  const f = file.replace(/\\/g, "/");

  if (isAllowlistedFinding(f, 0, text)) return "False positives";

  if (
    /\/dev-student-simulator\/|pages\/learning\/dev\/|pages\/learning\/dev-/.test(f) ||
    /\/mock\//.test(f) ||
    /feature-flag/.test(f) ||
    /pages\/student\/pwa-debug\.js/.test(f) ||
    (/-server\.(js|mjs)/.test(f) && /\/internal\//.test(f))
  ) {
    return "Internal/non-user-facing";
  }

  if (/parent-copilot|copilot-turn|ParentCopilot/.test(f)) return "Copilot";
  if (/parent-report|report-generator|report-language|detailed-parent-report/.test(f)) return "Reports";
  if (/learning-book|english-page-skill/.test(f)) return "Books UI";
  if (/worksheet/.test(f)) return "Worksheets";
  if (/educational-games|leo-lab|leo-pizzeria|leo-word/.test(f)) return "Educational games";
  if (/solo-games|solo-game/.test(f)) return "Solo games";
  if (/arcade|word-games\/engines/.test(f)) return "Arcade games";
  if (/\/offline\/|offline-games/.test(f)) return "Offline games";
  if (/reward-card|rewards\//.test(f)) return "Rewards";
  if (/\/shop|shop-/.test(f)) return "Shop";
  if (/pwa\/|service-worker|sw\.js|manifest/.test(f)) return "PWA/offline";
  if (/seo|public-page-seo|PageSeo/.test(f)) return "SEO";
  if (/email|sendgrid|mail/.test(f)) return "Emails";
  if (/diagnostic-|taxonomy-|probe-map|math-animations/.test(f)) return "Learning";
  if (/ParentCurriculumContent/.test(f)) return "Learning";
  if (/hebrew-display-labels|apiError|validation/.test(f)) return "API errors";
  if (/student-api-legacy-errors/.test(f)) return "Internal/non-user-facing";
  if (/utils\/contracts\/|parent-product-contract|launch-readiness\/|report-visible-practice-sync/.test(f)) {
    return "Internal/non-user-facing";
  }
  if (/aria-|a11y|accessibility/.test(f)) return "Accessibility";
  if (/site-nav|Layout\.js|AppLocaleShell|shared\/|common\/modal|toast/.test(f)) return "Navigation";
  if (/guardian/.test(f)) return "Guardian";
  if (/pages\/student\/activity\/|StudentAssignedActivityQuestionStage/.test(f)) return "Worksheets";
  if (/teacher-portal|pages\/teacher|components\/teacher/.test(f)) return "Teacher";
  if (/school-portal|pages\/school|components\/school/.test(f)) return "School";
  if (/pages\/student|components\/student|student-portal/.test(f)) return "Student";
  if (/pages\/parent|components\/parent|parent-portal|parent-client/.test(f)) return "Parent";
  if (/pages\/.*login|auth|session/.test(f)) return "Auth";
  if (/pages\/learning|learning-/.test(f)) return "Learning";
  if (
    /geometry-conceptual-bank|topic-next-step-engine|topic-next-step-phase2|parent-narrative-safety-fixtures|geometry-question-generator|curriculum-audit\//.test(
      f,
    )
  ) {
    return "Learning";
  }
  if (/leo-miners|LeoMinersGame|components\/leo-miners|leo-miners-guards/.test(f)) {
    return "Educational games";
  }
  if (
    /classroom-activities|ActivityDisplayLevelSelector|generate-activity-questions-client|student-activity-error-labels/.test(
      f,
    )
  ) {
    return "Worksheets";
  }
  if (/ai-hybrid-internal-reviewer|mock-fixtures/.test(f)) return "Internal/non-user-facing";
  if (
    /components\/game-audio|components\/Layout|loading|empty-state|error\.js|404|confirm/.test(f)
  ) {
    return "UI chrome";
  }

  return "UI chrome";
}
