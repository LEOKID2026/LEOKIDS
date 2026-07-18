import { scanRepository } from "./hardcoded-ui-core.mjs";
import { isAllowlistedFinding } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";
import { classifyWaveFUiChrome } from "./wave-f-ui-chrome-classify.mjs";

/** Legacy Wave F pool rules — before base-route recategorization fixes. */
export function categorizeFindingLegacyWaveFPool(file, text) {
  const f = file.replace(/\\/g, "/");

  if (isAllowlistedFinding(f, 0, text)) return "False positives";

  if (
    /\/dev-student-simulator\/|pages\/learning\/dev\/|pages\/learning\/dev-/.test(f) ||
    /\/mock\//.test(f) ||
    /feature-flag/.test(f) ||
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
  if (/hebrew-display-labels|apiError|validation/.test(f)) return "API errors";
  if (/aria-|a11y|accessibility/.test(f)) return "Accessibility";
  if (/site-nav|Layout\.js|AppLocaleShell|shared\/|common\/modal|toast/.test(f)) return "Navigation";
  if (/guardian/.test(f)) return "Guardian";
  if (/teacher-portal|pages\/teacher|components\/teacher/.test(f)) return "Teacher";
  if (/school-portal|pages\/school|components\/school/.test(f)) return "School";
  if (/pages\/student|components\/student|student-portal/.test(f)) return "Student";
  if (/pages\/parent|components\/parent|parent-portal|parent-client/.test(f)) return "Parent";
  if (/pages\/.*login|auth|session/.test(f)) return "Auth";
  if (/pages\/learning|learning-/.test(f)) return "Learning";
  if (/components\/Layout|loading|empty-state|error\.js|404|confirm/.test(f)) return "UI chrome";

  return "UI chrome";
}

/** @param {{ file: string, line: number, text: string }} finding */
export function findingFingerprint(finding) {
  return `${finding.file.replace(/\\/g, "/")}:${finding.line}:${finding.text}`;
}

/** Map Wave F sub-bucket → unique report row. */
export const WAVE_F_UNIQUE_BUCKET_MAP = {
  true_ui_chrome: "trueUiChrome",
  learning_misclassified: "reclassifiedLearning",
  game_misclassified: "reclassifiedGames",
  classroom_activities: "reclassifiedClassroom",
  books_misclassified: "reclassifiedBooks",
  reports_misclassified: "reclassifiedReports",
  rewards_misclassified: "reclassifiedRewards",
  copilot_not_ui_chrome: "reclassifiedCopilot",
  seo_not_ui_chrome: "reclassifiedSeo",
  pwa_not_ui_chrome: "reclassifiedPwa",
  technical_non_ui: "technical",
  false_positive: "falsePositives",
};

/**
 * Classify legacy Wave F pool findings — each finding exactly once.
 * @param {typeof import('./hardcoded-ui-core.mjs').scanRepository extends () => infer R ? R : never} findings
 */
export function buildWaveFUniqueClassification(findings) {
  const legacyPool = findings.filter(
    (f) => categorizeFindingLegacyWaveFPool(f.file, f.text) === "UI chrome",
  );

  /** @type {Record<string, number>} */
  const buckets = Object.fromEntries(Object.values(WAVE_F_UNIQUE_BUCKET_MAP).map((k) => [k, 0]));
  /** @type {Record<string, string[]>} */
  const overlapExamples = [];

  for (const f of legacyPool) {
    const sub = classifyWaveFUiChrome(f.file, f.text, f.line);
    const key = WAVE_F_UNIQUE_BUCKET_MAP[sub] || "trueUiChrome";
    buckets[key] = (buckets[key] || 0) + 1;
  }

  const bucketSum = Object.values(buckets).reduce((a, b) => a + b, 0);

  return {
    totalUniqueFindings: legacyPool.length,
    buckets,
    bucketSum,
    overlapCount: bucketSum === legacyPool.length ? 0 : Math.abs(bucketSum - legacyPool.length),
    legacyPoolFindings: legacyPool.map(findingFingerprint),
  };
}

if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}`) {
  const { findings } = scanRepository();
  console.log(JSON.stringify(buildWaveFUniqueClassification(findings), null, 2));
}
