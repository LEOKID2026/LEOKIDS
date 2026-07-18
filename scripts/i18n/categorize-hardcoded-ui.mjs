/**
 * Categorize all hardcoded UI findings for burn-down planning.
 *
 * Usage:
 *   node scripts/i18n/categorize-hardcoded-ui.mjs
 *   node scripts/i18n/categorize-hardcoded-ui.mjs --write-report
 */
import fs from "node:fs";
import path from "node:path";
import { isAllowlistedFinding } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";
import { REPO_ROOT, scanRepository, toPosix } from "./hardcoded-ui-core.mjs";
import { categorizeFinding } from "./categorize-finding-rules.mjs";
import { classifyWaveFUiChrome } from "./wave-f-ui-chrome-classify.mjs";

const reportJsonPath = path.join(REPO_ROOT, "tmp/i18n/hardcoded-ui-categories.json");
const writeReport = process.argv.includes("--write-report");

const CATEGORIES = [
  "UI chrome",
  "Navigation",
  "Auth",
  "Student",
  "Parent",
  "Teacher",
  "School",
  "Guardian",
  "Learning",
  "Books UI",
  "Worksheets",
  "Educational games",
  "Solo games",
  "Arcade games",
  "Offline games",
  "Rewards",
  "Shop",
  "Reports",
  "Copilot",
  "PWA/offline",
  "SEO",
  "Emails",
  "API errors",
  "Accessibility",
  "Internal/non-user-facing",
  "False positives",
];

/**
 * Wave F audit: split legacy UI chrome bucket into true chrome vs misclassified.
 * @param {string} file
 * @param {string} text
 * @param {number} line
 */
export function categorizeWaveFUiChromeFinding(file, text, line) {
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

/**
 * @param {string} file
 */
function packType(file) {
  if (/content-packs|locales\//.test(file)) return "content pack";
  if (/\-data\.js$/.test(file) || /bank|taxonomy|catalog/.test(file)) return "content pack";
  if (/registry|label|display-label/.test(file)) return "UI translation";
  return "UI translation";
}

const { findings, scannedFiles } = scanRepository();

/** @type {Map<string, { findings: typeof findings, files: Set<string> }>} */
const byCategory = new Map(CATEGORIES.map((c) => [c, { findings: [], files: new Set() }]));

for (const f of findings) {
  const cat = categorizeFinding(f.file, f.text);
  const bucket = byCategory.get(cat) || byCategory.get("UI chrome");
  bucket.findings.push(f);
  bucket.files.add(f.file);
}

/** @type {Record<string, unknown>[]} */
const categoryRows = [];
for (const cat of CATEGORIES) {
  const bucket = byCategory.get(cat) || { findings: [], files: new Set() };

  const fileCounts = new Map();
  for (const f of bucket.findings) {
    fileCounts.set(f.file, (fileCounts.get(f.file) || 0) + 1);
  }
  const topFiles = [...fileCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([file, count]) => ({ file, count }));

  const uiTranslation = bucket.findings.filter((f) => packType(f.file) === "UI translation").length;
  const contentPack = bucket.findings.filter((f) => packType(f.file) === "content pack").length;

  categoryRows.push({
    category: cat,
    findings: bucket.findings.length,
    files: bucket.files.size,
    topFiles,
    uiTranslationFindings: uiTranslation,
    contentPackFindings: contentPack,
    allowlisted: bucket.findings.filter((f) => isAllowlistedFinding(f.file, f.line, f.text)).length,
  });
}

categoryRows.sort((a, b) => b.findings - a.findings);

const report = {
  generatedAt: new Date().toISOString(),
  scannedFiles,
  scannerTotal: findings.length,
  totalFindings: findings.length,
  categories: categoryRows,
  acceptanceTarget: {
    unresolvedUserVisibleHardcodedFindings: 0,
    note: "Allowlist entries are documented technical exceptions only",
  },
};

console.log(JSON.stringify(report, null, 2));

if (writeReport) {
  fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true });
  fs.writeFileSync(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.error(`Wrote ${toPosix(reportJsonPath)}`);
}
