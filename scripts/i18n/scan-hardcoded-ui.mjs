/**
 * Full-repository scan for unauthorized user-visible hardcoded English.
 *
 * Terminology:
 *   scannerTotal              — all pattern matches in runtime scan roots
 *   allowlistedFindings       — documented technical exceptions in scanned files
 *   realTotalDebt             — all real debt (UI + content); equals debt test value
 *   unauthorizedUserVisible   — deprecated alias for realTotalDebt (NOT excluded-from-debt)
 *   excludedFromDebt          — developer_only, test_fixture, brand, allowlisted technical
 *   storedDebtBaseline        — ledger of known debt IDs (burn-down tracking only)
 *   resolvedSincePreviousRun  — IDs in baseline no longer present
 *   newSincePreviousRun       — IDs present but not in baseline
 */
import fs from "node:fs";
import path from "node:path";
import {
  REPO_ROOT,
  findingId,
  loadBaselineSet,
  scanRepository,
  toPosix,
} from "./hardcoded-ui-core.mjs";
import {
  classifyFindingKind,
  isRealDebtClassification,
  summarizeClassifiedFindings,
} from "./finding-classification.mjs";
import { countAllowlistedFindings } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";

const baselinePath = path.join(REPO_ROOT, "tests/i18n/_hardcoded-ui-baseline.json");
const writeBaseline = process.argv.includes("--write-baseline");
const pruneBaseline = process.argv.includes("--prune-baseline");
const recalibrateBaseline = process.argv.includes("--recalibrate-baseline");

const { findings: rawFindings, scannedFiles } = scanRepository();
const findings = rawFindings.map((f) => ({
  ...f,
  kind: classifyFindingKind(f.file, f.text, f.line),
}));

const debtFindings = findings.filter((f) => isRealDebtClassification(f.kind));
const debtIds = debtFindings.map((f) => findingId(f));
const idSet = new Set(debtIds);
const metrics = summarizeClassifiedFindings(findings);
const allowlistedFindings = countAllowlistedFindings(findings);

if (writeBaseline || recalibrateBaseline) {
  if (!recalibrateBaseline && fs.existsSync(baselinePath)) {
    const existing = loadBaselineSet(baselinePath);
    if (debtIds.length > existing.size) {
      console.error(
        `Refusing to grow storedDebtBaseline (${existing.size} → ${debtIds.length}). Fix debt or use --prune-baseline after burn-down.`
      );
      process.exit(2);
    }
  }
  fs.writeFileSync(
    baselinePath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: debtIds.length,
        mode: "debt-burn-down",
        scannerVersion: 2,
        tracks: "unauthorizedUserVisible",
        known: debtIds,
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  console.log(`Wrote storedDebtBaseline with ${debtIds.length} debt IDs to ${toPosix(baselinePath)}`);
  process.exit(0);
}

const storedDebtBaseline = loadBaselineSet(baselinePath);
const resolvedSincePreviousRun = [...storedDebtBaseline].filter((id) => !idSet.has(id));
const newSincePreviousRun = debtIds.filter((id) => !storedDebtBaseline.has(id));

if (pruneBaseline) {
  if (debtIds.length >= storedDebtBaseline.size) {
    console.error(
      `Refusing to prune: current debt ${debtIds.length} is not below storedDebtBaseline ${storedDebtBaseline.size}`
    );
    process.exit(2);
  }
  fs.writeFileSync(
    baselinePath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: debtIds.length,
        mode: "debt-burn-down",
        tracks: "unauthorizedUserVisible",
        prunedResolved: resolvedSincePreviousRun.length,
        known: debtIds,
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  console.log(
    `Pruned storedDebtBaseline ${storedDebtBaseline.size} → ${debtIds.length} (removed ${resolvedSincePreviousRun.length} resolved debt IDs)`
  );
  process.exit(0);
}

const report = {
  scannedFiles,
  scannerTotal: metrics.scannerTotal,
  allowlistedFindings,
  authorizedTechnicalExceptions: metrics.authorizedTechnicalExceptions,
  unauthorizedUserVisible: metrics.unauthorizedUserVisible,
  realTotalDebt: metrics.realTotalDebt,
  excludedFromDebt: metrics.excludedFromDebt,
  realUserVisibleDebt: metrics.realUserVisibleDebt,
  realContentDebt: metrics.realContentDebt,
  developerOnly: metrics.developerOnly,
  falsePositives: metrics.falsePositives,
  technicalExceptions: metrics.technicalExceptions,
  storedDebtBaseline: storedDebtBaseline.size,
  resolvedSincePreviousRun: resolvedSincePreviousRun.length,
  newSincePreviousRun: newSincePreviousRun.length,
  baselineGrew: metrics.unauthorizedUserVisible > storedDebtBaseline.size,
  burnDownTarget: 0,
  classification: metrics.byKind,
  sample: debtFindings.slice(0, 20),
  novel: debtFindings.filter((f) => !storedDebtBaseline.has(findingId(f))).slice(0, 20),
};

console.log(JSON.stringify(report, null, 2));

if (metrics.unauthorizedUserVisible > 0 || metrics.unauthorizedUserVisible > storedDebtBaseline.size) {
  process.exitCode = 1;
}
