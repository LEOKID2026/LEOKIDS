/**
 * Wave F progress with fixed / reclassified / deferred breakdown (no "removed" for reclassification).
 *
 * Usage: node scripts/i18n/wave-f-progress-report.mjs [--write-report]
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
import { classifyGlobalDebtOwner } from "./global-debt-inventory.mjs";
import {
  buildWaveFFullInventory,
  classifyWaveFInventoryBucket,
  computeInventoryBurnDown,
  loadInventoryBaseline,
} from "./wave-f-full-inventory.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reportPath = path.join(root, "tmp/i18n/wave-f-progress-report.json");
const waveFBaselinePath = path.join(root, "tests/i18n/_wave-f-inventory-baseline.json");
const scannerBaselinePath = path.join(root, "tests/i18n/_hardcoded-ui-baseline.json");

function loadJson(p) {
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

/**
 * @param {string} id
 * @param {Map<string, { owner: string, waveBucket: string|null }>} currentDebtIndex
 */
function classifyBaselineExit(id, currentDebtIndex) {
  const live = currentDebtIndex.get(id);
  if (!live) {
    return { kind: "fixedOrMigrated", detail: "no longer in scanner real debt" };
  }
  if (live.waveBucket === "classroomDeferred") {
    return { kind: "deferred", detail: "waveGWorksheetsClassroom", owner: live.owner };
  }
  if (live.waveBucket === null) {
    return { kind: "reclassified", detail: `out of Wave F → ${live.owner}`, owner: live.owner };
  }
  if (live.waveBucket === "technical") {
    return { kind: "reclassified", detail: "wave F technical", owner: live.owner };
  }
  return { kind: "reclassified", detail: `wave F bucket ${live.waveBucket}`, owner: live.owner };
}

export function buildWaveFProgressReport() {
  const { findings: raw } = scanRepository();
  const findings = raw.map((f) => ({
    ...f,
    kind: classifyFindingKind(f.file, f.text, f.line),
  }));

  const metrics = summarizeClassifiedFindings(findings);
  const waveF = buildWaveFFullInventory(findings);
  const waveFBaseline = loadInventoryBaseline() || loadJson(waveFBaselinePath);
  const burnDown = computeInventoryBurnDown(waveF, waveFBaseline);

  const scannerBaseline = loadJson(scannerBaselinePath);

  /** @type {Map<string, { owner: string, waveBucket: string|null }>} */
  const currentDebtIndex = new Map();
  for (const f of findings) {
    const kind = f.kind || classifyFindingKind(f.file, f.text, f.line);
    if (!isRealDebtClassification(kind)) continue;
    const id = findingId(f);
    const waveBucket = classifyWaveFInventoryBucket(f.file, f.text, f.line);
    const { owner } = classifyGlobalDebtOwner(f.file, f.text, f.line, kind);
    currentDebtIndex.set(id, { owner, waveBucket });
  }

  /** @type {Record<string, number>} */
  const cumulativeBreakdown = {
    fixedOrMigrated: 0,
    reclassified: 0,
    deferred: 0,
  };

  const baselineIds = waveFBaseline?.known || [];
  for (const id of baselineIds) {
    if (waveF.findingIds.includes(id)) continue;
    const exit = classifyBaselineExit(id, currentDebtIndex);
    cumulativeBreakdown[exit.kind] = (cumulativeBreakdown[exit.kind] || 0) + 1;
  }

  const globalScannerDebtReduction =
    scannerBaseline?.count != null ? scannerBaseline.count - metrics.realTotalDebt : null;

  const CLOSED_WAVE_CATEGORIES = [
    "Learning",
    "Reports",
    "Books UI",
    "Rewards",
    "Educational games",
    "Solo games",
    "Arcade games",
    "Offline games",
  ];
  /** @type {Record<string, number>} */
  const closedWaveRemaining = {};
  for (const cat of CLOSED_WAVE_CATEGORIES) {
    closedWaveRemaining[cat] = findings.filter((f) => {
      const kind = f.kind || classifyFindingKind(f.file, f.text, f.line);
      if (!isRealDebtClassification(kind)) return false;
      return categorizeFinding(f.file, f.text) === cat;
    }).length;
  }

  return {
    generatedAt: new Date().toISOString(),
    scannerMetrics: {
      scannerTotal: metrics.scannerTotal,
      excludedFromDebt: metrics.excludedFromDebt,
      realTotalDebt: metrics.realTotalDebt,
      unauthorizedUserVisible: metrics.unauthorizedUserVisible,
      realUserVisibleDebt: metrics.realUserVisibleDebt,
      realContentDebt: metrics.realContentDebt,
      debtTestValue: metrics.realTotalDebt,
      metricsExplanation:
        "realTotalDebt (= debt test value) counts all real debt: UI + content. excludedFromDebt is non-debt (e.g. developer_only=155). unauthorizedUserVisible is a legacy alias for realTotalDebt, NOT excludedFromDebt.",
      globalScannerDebtReductionSinceStoredBaseline: globalScannerDebtReduction,
    },
    waveF: {
      totalUniqueBefore: burnDown.waveFTotalUniqueBefore,
      totalUniqueRemaining: burnDown.waveFTotalUniqueRemaining,
      cumulativeExitFromBaseline: burnDown.waveFTotalUniqueRemoved,
      cumulativeBreakdown,
      counts: waveF.counts,
      classroomDeferred: waveF.classroomDeferred,
    },
    closedWaveRemaining,
    learningReclassifiedRemaining: closedWaveRemaining.Learning,
  };
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]).replace(/\\/g, "/") === fileURLToPath(import.meta.url).replace(/\\/g, "/");

if (isMain) {
  const report = buildWaveFProgressReport();
  if (process.argv.includes("--write-report")) {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }
  console.log(JSON.stringify(report, null, 2));
}
