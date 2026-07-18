/**
 * Audit gap between locale key migration and hardcoded UI scanner findings.
 *
 * Usage:
 *   node scripts/i18n/audit-hardcoded-inventory.mjs
 *   node scripts/i18n/audit-hardcoded-inventory.mjs --write-report
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import {
  REPO_ROOT,
  countLocaleJsonStrings,
  findingId,
  loadBaselineSet,
  scanRepository,
  scanSource,
  toPosix,
} from "./hardcoded-ui-core.mjs";

const baselinePath = path.join(REPO_ROOT, "tests/i18n/_hardcoded-ui-baseline.json");
const reportJsonPath = path.join(REPO_ROOT, "tmp/i18n/hardcoded-inventory-audit.json");
const writeReport = process.argv.includes("--write-report");

const MIGRATION_AREAS = [
  {
    area: "Teacher portal registry",
    files: ["lib/teacher-portal/teacher-ui.js"],
    localeFiles: ["locales/en/teacher.json"],
    keysDocumented: 87,
  },
  {
    area: "School portal registry",
    files: ["lib/school-portal/school-ui.js", "lib/school-portal/school-communication.js"],
    localeFiles: ["locales/en/school.json"],
    keysDocumented: 381,
  },
  {
    area: "Validation / API errors",
    files: ["lib/platform-ui/hebrew-display-labels.js"],
    localeFiles: ["locales/en/validation.json"],
    keysDocumented: 44,
    note: "api.* keys only; subject/activity maps still hardcoded in registry",
  },
  {
    area: "Site navigation",
    files: ["lib/site-nav.js", "components/Layout.js"],
    localeFiles: ["locales/en/ui.json"],
    keysDocumented: 28,
    note: "labelKey in nav; Layout resolves via t()",
  },
  {
    area: "UI locale settings",
    files: ["components/parent/ParentMembershipLocaleSettings.jsx"],
    localeFiles: ["locales/en/ui.json"],
    keysDocumented: 6,
  },
  {
    area: "Reports parent insights",
    files: ["lib/parent-server/parent-report-parent-facing.server.js"],
    localeFiles: ["locales/en/reports.json"],
    keysDocumented: 6,
  },
];

/**
 * @param {string} rel
 */
function gitShowAtHead(rel) {
  try {
    return execSync(`git show HEAD:${rel}`, { cwd: REPO_ROOT, encoding: "utf8" });
  } catch {
    return null;
  }
}

/**
 * @param {string} rel
 * @param {string} source
 */
function countFindingsInSource(rel, source) {
  return scanSource(rel, source).length;
}

const { findings, scannedFiles } = scanRepository();
const baseline = loadBaselineSet(baselinePath);
const localeCounts = countLocaleJsonStrings();

/** @type {import('./hardcoded-ui-core.mjs').HardcodedFinding[]} */
const findingsByFile = findings;
const fileIndex = new Map();
for (const f of findingsByFile) {
  fileIndex.set(f.file, (fileIndex.get(f.file) || 0) + 1);
}

/** @type {Record<string, unknown>[]} */
const areaRows = [];
let totalKeysInLocale = 0;
let totalFindingsBeforeHead = 0;
let totalFindingsAfter = 0;

for (const area of MIGRATION_AREAS) {
  let findingsBefore = 0;
  let findingsAfter = 0;
  let localeKeyCount = 0;

  for (const rel of area.files) {
    const headSource = gitShowAtHead(rel);
    if (headSource) {
      findingsBefore += countFindingsInSource(rel, headSource);
    }
    const currentSource = fs.existsSync(path.join(REPO_ROOT, rel))
      ? fs.readFileSync(path.join(REPO_ROOT, rel), "utf8")
      : "";
    findingsAfter += countFindingsInSource(rel, currentSource);
  }

  for (const rel of area.localeFiles) {
    localeKeyCount += localeCounts.byFile[rel] || 0;
  }

  totalKeysInLocale += localeKeyCount;
  totalFindingsBeforeHead += findingsBefore;
  totalFindingsAfter += findingsAfter;

  const gapReasons = [];
  if (localeKeyCount > 0 && findingsBefore - findingsAfter < localeKeyCount / 3) {
    gapReasons.push(
      "Locale JSON lives under locales/ which the scanner excludes — key count ≠ finding count"
    );
  }
  if (findingsAfter > 0) {
    gapReasons.push(`${findingsAfter} runtime literals remain in scanned source files`);
  }
  if (area.note) gapReasons.push(area.note);
  if (findingsBefore === 0 && localeKeyCount > 0) {
    gapReasons.push("HEAD version may predate hardcoded strings or used patterns scanner skips");
  }

  areaRows.push({
    area: area.area,
    findingsBeforeHead: findingsBefore,
    localeStringsStored: localeKeyCount,
    keysDocumented: area.keysDocumented,
    findingsAfter,
    findingsRemoved: findingsBefore - findingsAfter,
    gapReason: gapReasons.join("; ") || "Aligned",
  });
}

const baselinePrevious = 4470;
const baselineCurrent = baseline.size || findings.length;

const globalGapReasons = [
  "Scanner v1 skipped entire export const lines and missed `= \"English\"` assignments — school-ui alone had ~321 invisible findings",
  "Scanner roots are pages/, components/, lib/, utils/, hooks/ — locales/ and content-packs/ are excluded by design",
  "Migrating copy to locales/en/*.json removes debt from scan only when literals are deleted from scanned source files",
  "Locale JSON key count measures stored copy outside the scan surface — key count ≠ finding count",
  "One English literal can produce multiple findings (patterns, duplicate lines, repeated labels across files)",
  "Registry re-exports (export const X = T.section.key) contain no string literals after JSON migration",
  "Partial migrations leave remaining maps as findings until fully moved",
  "Net baseline after v2 recalibration (4974) reflects honest measurement, not new user-facing debt",
];

const audit = {
  generatedAt: new Date().toISOString(),
  scannedFiles,
  totalFindings: findings.length,
  baselinePrevious,
  baselineCurrent,
  baselineNetDelta: baselinePrevious - baselineCurrent,
  localeJsonStringCount: localeCounts.total,
  migrationAreaTable: areaRows,
  globalGapReasons,
  checks: {
    teacherUiFindingsNow: fileIndex.get("lib/teacher-portal/teacher-ui.js") || 0,
    schoolUiFindingsNow: fileIndex.get("lib/school-portal/school-ui.js") || 0,
    schoolCommFindingsNow: fileIndex.get("lib/school-portal/school-communication.js") || 0,
    hebrewDisplayFindingsNow: fileIndex.get("lib/platform-ui/hebrew-display-labels.js") || 0,
    siteNavFindingsNow: fileIndex.get("lib/site-nav.js") || 0,
    layoutFindingsNow: fileIndex.get("components/Layout.js") || 0,
    duplicateTextTop10: topDuplicateTexts(findings).slice(0, 10),
    resolvedSinceBaseline: [...baseline].filter((id) => !findings.some((f) => findingId(f) === id))
      .length,
    novelVsBaseline: findings.filter((f) => !baseline.has(findingId(f))).length,
  },
  summary: {
    totalKeysDocumentedMigration: MIGRATION_AREAS.reduce((n, a) => n + a.keysDocumented, 0),
    totalFindingsRemovedFromMigratedFiles: totalFindingsBeforeHead - totalFindingsAfter,
    explainedGap:
      "Locale keys are stored outside the scan surface; baseline measures net findings in scanned runtime files only",
  },
};

console.log(JSON.stringify(audit, null, 2));

if (writeReport) {
  fs.mkdirSync(path.dirname(reportJsonPath), { recursive: true });
  fs.writeFileSync(reportJsonPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  console.error(`Wrote ${toPosix(reportJsonPath)}`);
}

/**
 * @param {import('./hardcoded-ui-core.mjs').HardcodedFinding[]} list
 */
function topDuplicateTexts(list) {
  const counts = new Map();
  for (const f of list) {
    counts.set(f.text, (counts.get(f.text) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([text, count]) => ({ text, count }));
}
