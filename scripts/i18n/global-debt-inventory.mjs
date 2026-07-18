/**
 * Global unique hardcoded-UI debt inventory — every real-debt finding has exactly one owner.
 *
 * Usage:
 *   node scripts/i18n/global-debt-inventory.mjs [--write-report] [--write-baseline]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categorizeFinding } from "./categorize-finding-rules.mjs";
import {
  classifyFindingKind,
  isRealDebtClassification,
  summarizeClassifiedFindings,
} from "./finding-classification.mjs";
import { findingId, scanRepository } from "./hardcoded-ui-core.mjs";
import { classifyWaveFInventoryBucket } from "./wave-f-full-inventory.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reportPath = path.join(root, "tmp/i18n/global-debt-inventory.json");
const baselinePath = path.join(root, "tests/i18n/_global-debt-inventory-baseline.json");

/** Owners for real-debt findings (sum must equal verified global debt). */
export const GLOBAL_DEBT_OWNERS = Object.freeze([
  "waveFSharedUi",
  "waveFTeacherSchool",
  "waveFCopilot",
  "waveFTechnical",
  "waveGWorksheetsClassroom",
  "learning",
  "reports",
  "books",
  "gamesEducational",
  "gamesSolo",
  "gamesArcade",
  "gamesOffline",
  "rewards",
  "shop",
  "seo",
  "pwaOffline",
  "emailsNotifications",
  "navigation",
  "accessibility",
  "apiErrors",
  "auth",
  "guardian",
  "studentChrome",
  "parentChrome",
  "publicContent",
  "personas",
  "ttsAudio",
  "unowned",
]);

/** Non-debt scanner findings (excluded from verified global debt total). */
export const GLOBAL_NON_DEBT_OWNERS = Object.freeze([
  "developerOnly",
  "testFixture",
  "falsePositive",
  "technicalNonDebt",
]);

const WAVE_F_BUCKET_TO_OWNER = Object.freeze({
  sharedUi: "waveFSharedUi",
  teacherSchoolChrome: "waveFTeacherSchool",
  copilotOutput: "waveFCopilot",
  copilotUi: "waveFCopilot",
  technical: "waveFTechnical",
  auth: "auth",
  guardian: "guardian",
  studentChrome: "studentChrome",
  parentChrome: "parentChrome",
  falsePositive: "falsePositive",
});

const CATEGORY_TO_OWNER = Object.freeze({
  Learning: "learning",
  Reports: "reports",
  "Books UI": "books",
  "Educational games": "gamesEducational",
  "Solo games": "gamesSolo",
  "Arcade games": "gamesArcade",
  "Offline games": "gamesOffline",
  Rewards: "rewards",
  Shop: "shop",
  SEO: "seo",
  "PWA/offline": "pwaOffline",
  Emails: "emailsNotifications",
  Navigation: "navigation",
  Accessibility: "accessibility",
  "API errors": "apiErrors",
  Auth: "auth",
  Guardian: "guardian",
  Student: "studentChrome",
  Parent: "parentChrome",
  Worksheets: "waveGWorksheetsClassroom",
  Copilot: "waveFCopilot",
  "UI chrome": "waveFSharedUi",
  Teacher: "waveFTeacherSchool",
  School: "waveFTeacherSchool",
  "Internal/non-user-facing": "waveFTechnical",
  "False positives": "falsePositive",
});

/**
 * @param {string} file
 * @param {string} text
 * @param {number} line
 * @param {string} kind
 * @returns {{ owner: string, countsAsDebt: boolean }}
 */
export function classifyGlobalDebtOwner(file, text, line, kind) {
  if (!isRealDebtClassification(kind)) {
    if (kind === "developer_only") return { owner: "developerOnly", countsAsDebt: false };
    if (kind === "test_fixture") return { owner: "testFixture", countsAsDebt: false };
    if (kind === "false_positive") return { owner: "falsePositive", countsAsDebt: false };
    return { owner: "technicalNonDebt", countsAsDebt: false };
  }

  const waveBucket = classifyWaveFInventoryBucket(file, text, line);
  if (waveBucket === "classroomDeferred") {
    return { owner: "waveGWorksheetsClassroom", countsAsDebt: true };
  }
  if (waveBucket === "falsePositive") {
    return { owner: "falsePositive", countsAsDebt: false };
  }
  if (waveBucket && waveBucket !== null && WAVE_F_BUCKET_TO_OWNER[waveBucket]) {
    return { owner: WAVE_F_BUCKET_TO_OWNER[waveBucket], countsAsDebt: true };
  }

  const category = categorizeFinding(file, text);
  const owner = CATEGORY_TO_OWNER[category] || "unowned";
  return { owner, countsAsDebt: true };
}

/**
 * @param {Array<{ file: string, line: number, text: string, kind?: string }>} findings
 */
export function buildGlobalDebtInventory(findings) {
  const metrics = summarizeClassifiedFindings(findings);

  /** @type {Map<string, { finding: typeof findings[0], owner: string, countsAsDebt: boolean }>} */
  const uniqueDebt = new Map();
  /** @type {Record<string, number>} */
  const ownerCounts = Object.fromEntries(GLOBAL_DEBT_OWNERS.map((o) => [o, 0]));
  /** @type {Record<string, number>} */
  const nonDebtCounts = Object.fromEntries(GLOBAL_NON_DEBT_OWNERS.map((o) => [o, 0]));

  for (const f of findings) {
    const kind = f.kind || classifyFindingKind(f.file, f.text, f.line);
    if (!isRealDebtClassification(kind)) {
      if (kind === "developer_only") nonDebtCounts.developerOnly++;
      else if (kind === "test_fixture") nonDebtCounts.testFixture++;
      else if (kind === "false_positive") nonDebtCounts.falsePositive++;
      else nonDebtCounts.technicalNonDebt++;
      continue;
    }

    const id = findingId(f);
    const { owner, countsAsDebt } = classifyGlobalDebtOwner(f.file, f.text, f.line, kind);
    if (!countsAsDebt) continue;

    if (!uniqueDebt.has(id)) {
      uniqueDebt.set(id, { finding: f, owner, countsAsDebt: true });
    }
  }

  for (const { owner } of uniqueDebt.values()) {
    ownerCounts[owner] = (ownerCounts[owner] || 0) + 1;
  }

  const globalUniqueRemaining = uniqueDebt.size;
  const rawRealDebtHits = findings.filter((f) =>
    isRealDebtClassification(f.kind || classifyFindingKind(f.file, f.text, f.line))
  ).length;
  const duplicateDebtHits = rawRealDebtHits - globalUniqueRemaining;
  const ownerSum = GLOBAL_DEBT_OWNERS.reduce((acc, o) => acc + (ownerCounts[o] || 0), 0);
  const unownedRemaining = ownerCounts.unowned || 0;

  return {
    metrics,
    globalUniqueRemaining,
    ownerCounts,
    nonDebtCounts,
    ownerSum,
    unownedRemaining,
    sumsCorrect: ownerSum === globalUniqueRemaining && unownedRemaining === 0,
    rawRealDebtHits,
    duplicateDebtHits,
    debtTestValue: metrics.realTotalDebt,
    findingIds: [...uniqueDebt.keys()],
  };
}

function loadBaseline() {
  if (!fs.existsSync(baselinePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  } catch {
    return null;
  }
}

export function runGlobalDebtInventory(options = {}) {
  const { findings: raw, scannedFiles } = scanRepository();
  const findings = raw.map((f) => ({
    ...f,
    kind: classifyFindingKind(f.file, f.text, f.line),
  }));

  const inventory = buildGlobalDebtInventory(findings);
  const baseline = loadBaseline();

  const report = {
    generatedAt: new Date().toISOString(),
    scannedFiles,
    scannerMetrics: {
      scannerTotal: inventory.metrics.scannerTotal,
      excludedFromDebt: inventory.metrics.excludedFromDebt,
      realTotalDebt: inventory.metrics.realTotalDebt,
      rawRealDebtHits: inventory.rawRealDebtHits,
      duplicateDebtHits: inventory.duplicateDebtHits,
      globalUniqueRemaining: inventory.globalUniqueRemaining,
      /** @deprecated legacy alias — equals realTotalDebt (user + content debt) */
      unauthorizedUserVisible: inventory.metrics.unauthorizedUserVisible,
      realUserVisibleDebt: inventory.metrics.realUserVisibleDebt,
      realContentDebt: inventory.metrics.realContentDebt,
      debtTestValue: inventory.debtTestValue,
      metricsExplanation:
        "realTotalDebt = realUserVisibleDebt + realContentDebt = debt test value. excludedFromDebt = developer_only + test_fixture + brand + allowlisted technical (not real debt). The legacy field unauthorizedUserVisible equals realTotalDebt, not excludedFromDebt.",
    },
    inventory: {
      globalUniqueRemaining: inventory.globalUniqueRemaining,
      unownedRemaining: inventory.unownedRemaining,
      ownerCounts: inventory.ownerCounts,
      nonDebtCounts: inventory.nonDebtCounts,
      ownerSum: inventory.ownerSum,
      sumsCorrect: inventory.sumsCorrect,
    },
    baselineStored: Boolean(baseline),
    note: "Every real-debt finding appears once. unowned must be 0. Ownership change is not a fix.",
  };

  if (options.writeReport !== false) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }

  if (options.writeBaseline) {
    fs.writeFileSync(
      baselinePath,
      `${JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          count: inventory.globalUniqueRemaining,
          known: inventory.findingIds,
          ownerCounts: inventory.ownerCounts,
        },
        null,
        2
      )}\n`,
      "utf8"
    );
  }

  return report;
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]).replace(/\\/g, "/") === fileURLToPath(import.meta.url).replace(/\\/g, "/");

if (isMain) {
  const writeBaseline = process.argv.includes("--write-baseline");
  const report = runGlobalDebtInventory({ writeReport: true, writeBaseline });
  console.log(JSON.stringify(report, null, 2));
  if (!report.inventory.sumsCorrect || report.inventory.unownedRemaining > 0) {
    process.exitCode = 1;
  }
}
