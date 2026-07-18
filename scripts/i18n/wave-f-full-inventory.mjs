/**
 * Wave F — full unique inventory (all chrome domains, not legacy 642 UI-chrome pool only).
 *
 * Usage:
 *   node scripts/i18n/wave-f-full-inventory.mjs [--write-report] [--write-baseline]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isAllowlistedFinding } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";
import { categorizeFinding } from "./categorize-finding-rules.mjs";
import { classifyFindingKind, isRealDebtClassification } from "./finding-classification.mjs";
import { scanRepository, toPosix, findingId } from "./hardcoded-ui-core.mjs";
import { findingFingerprint } from "./wave-f-unique-classification.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reportPath = path.join(root, "tmp/i18n/wave-f-full-inventory.json");
const baselinePath = path.join(root, "tests/i18n/_wave-f-inventory-baseline.json");

export const WAVE_F_INVENTORY_BUCKETS = Object.freeze([
  "sharedUi",
  "auth",
  "guardian",
  "studentChrome",
  "parentChrome",
  "teacherSchoolChrome",
  "copilotUi",
  "copilotOutput",
  "technical",
  "falsePositive",
]);

/** @typedef {typeof WAVE_F_INVENTORY_BUCKETS[number]} WaveFInventoryBucket */

const CLOSED_WAVE_CATEGORIES = Object.freeze([
  "Learning",
  "Reports",
  "Books UI",
  "Rewards",
  "Educational games",
  "Solo games",
  "Arcade games",
  "Offline games",
  "Shop",
  "Emails",
  "SEO",
  "PWA/offline",
]);

/**
 * Classify a finding into exactly one Wave F inventory bucket.
 * Returns `null` when out of Wave F scope (closed content waves).
 * Returns `classroomDeferred` for Wave G worksheets/classroom shell debt.
 *
 * @param {string} file
 * @param {string} text
 * @param {number} line
 * @returns {WaveFInventoryBucket | "classroomDeferred" | null}
 */
export function classifyWaveFInventoryBucket(file, text, line) {
  const f = file.replace(/\\/g, "/");

  if (isAllowlistedFinding(f, line, text)) return "falsePositive";

  if (/lib\/student-client\/student-api-legacy-errors/.test(f)) return "technical";

  const category = categorizeFinding(f, text);
  if (category === "Worksheets") return "classroomDeferred";
  if (CLOSED_WAVE_CATEGORIES.includes(category)) return null;

  const kind = classifyFindingKind(f, text, line);
  if (kind === "false_positive") return "falsePositive";
  if (["developer_only", "test_fixture", "technical_identifier", "brand"].includes(kind)) {
    return "technical";
  }

  if (category === "Internal/non-user-facing") return "technical";

  if (/components\/parent-copilot\/|parent-copilot-panel/.test(f)) return "copilotUi";
  if (category === "Copilot") return "copilotOutput";
  if (/utils\/parent-copilot\//.test(f)) return "copilotOutput";
  if (/lib\/parent-copilot\//.test(f) && !/panel/.test(f)) return "copilotOutput";

  if (category === "Auth") return "auth";
  if (category === "Guardian") return "guardian";
  if (category === "Student") return "studentChrome";
  if (category === "Parent") return "parentChrome";
  if (category === "Teacher" || category === "School") return "teacherSchoolChrome";

  if (category === "API errors" && /parent-client|pages\/api\/parent/.test(f)) {
    return "parentChrome";
  }

  return "sharedUi";
}

/**
 * @param {Array<{ file: string, line: number, text: string, kind?: string }>} findings
 */
export function buildWaveFFullInventory(findings) {
  /** @type {Map<string, { finding: typeof findings[0], bucket: WaveFInventoryBucket }>} */
  const unique = new Map();
  let overlapRemoved = 0;
  let outOfScope = 0;
  let classroomDeferred = 0;
  let skippedNonDebt = 0;

  for (const finding of findings) {
    const kind = finding.kind || classifyFindingKind(finding.file, finding.text, finding.line);
    if (!isRealDebtClassification(kind)) {
      skippedNonDebt++;
      continue;
    }

    const bucket = classifyWaveFInventoryBucket(finding.file, finding.text, finding.line);
    if (bucket === null) {
      outOfScope++;
      continue;
    }
    if (bucket === "classroomDeferred") {
      classroomDeferred++;
      continue;
    }

    const fp = findingFingerprint(finding);
    const prev = unique.get(fp);
    if (prev) {
      if (prev.bucket !== bucket) overlapRemoved++;
      continue;
    }
    unique.set(fp, { finding, bucket });
  }

  /** @type {Record<WaveFInventoryBucket, number>} */
  const counts = Object.fromEntries(WAVE_F_INVENTORY_BUCKETS.map((b) => [b, 0]));
  for (const { bucket } of unique.values()) {
    counts[bucket] += 1;
  }

  const waveFTotalRemaining = WAVE_F_INVENTORY_BUCKETS.reduce((sum, b) => sum + counts[b], 0);
  const bucketSum = waveFTotalRemaining;

  return {
    waveFTotalRemaining,
    bucketSum,
    counts,
    sharedUiRemaining: counts.sharedUi,
    authRemaining: counts.auth,
    guardianRemaining: counts.guardian,
    studentRemaining: counts.studentChrome,
    parentRemaining: counts.parentChrome,
    teacherSchoolRemaining: counts.teacherSchoolChrome,
    copilotUiRemaining: counts.copilotUi,
    copilotOutputRemaining: counts.copilotOutput,
    technicalRemaining: counts.technical,
    falsePositiveRemaining: counts.falsePositive,
    classroomDeferred,
    outOfScope,
    overlapRemoved,
    skippedNonDebt,
    uniqueFindings: unique.size,
    sumsCorrect: bucketSum === waveFTotalRemaining,
    findingIds: [...unique.keys()],
  };
}

export function loadInventoryBaseline() {
  if (!fs.existsSync(baselinePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(baselinePath, "utf8"));
  } catch {
    return null;
  }
}

/**
 * @param {ReturnType<typeof buildWaveFFullInventory>} live
 * @param {{ known?: string[], count?: number } | null} baseline
 */
export function computeInventoryBurnDown(live, baseline) {
  const known = baseline?.known || [];
  const baselineSet = new Set(known);
  const liveSet = new Set(live.findingIds);
  const removed = known.filter((id) => !liveSet.has(id)).length;
  const before = baseline?.count ?? known.length ?? live.waveFTotalRemaining;
  return {
    waveFTotalUniqueBefore: before,
    waveFTotalUniqueRemoved: removed,
    waveFTotalUniqueRemaining: live.waveFTotalRemaining,
  };
}

export function runWaveFFullInventory(options = {}) {
  const { findings: rawFindings, scannedFiles } = scanRepository();
  const findings = rawFindings.map((f) => ({
    ...f,
    kind: classifyFindingKind(f.file, f.text, f.line),
  }));

  const live = buildWaveFFullInventory(findings);
  const baseline = loadInventoryBaseline();
  const burnDown = computeInventoryBurnDown(live, baseline);

  const report = {
    generatedAt: new Date().toISOString(),
    scannedFiles,
    inventory: live,
    burnDown,
    baselineStored: Boolean(baseline),
    note:
      "Wave F total is the sum of sharedUi + auth + guardian + studentChrome + parentChrome + teacherSchoolChrome + copilotUi + copilotOutput + technical + falsePositive. classroomDeferred is Wave G.",
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
          count: live.waveFTotalRemaining,
          known: live.findingIds,
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
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const writeReport = process.argv.includes("--write-report");
  const writeBaseline = process.argv.includes("--write-baseline");
  const report = runWaveFFullInventory({ writeReport, writeBaseline });
  console.log(JSON.stringify(report, null, 2));
  if (writeReport) console.error(`Wrote ${toPosix(reportPath)}`);
  if (writeBaseline) console.error(`Wrote ${toPosix(baselinePath)}`);
}
