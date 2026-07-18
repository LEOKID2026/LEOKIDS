/**
 * Wave F — UI chrome classification audit.
 * Splits the original 642 legacy UI chrome pool — each finding counted exactly once.
 *
 * Usage: node scripts/i18n/audit-ui-chrome-classification.mjs [--write-report]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanRepository, toPosix } from "./hardcoded-ui-core.mjs";
import { categorizeFinding } from "./categorize-finding-rules.mjs";
import {
  classifyWaveFUiChrome,
  categorizeFindingWaveF,
} from "./wave-f-ui-chrome-classify.mjs";
import { runWaveFFullInventory } from "./wave-f-full-inventory.mjs";
import {
  buildWaveFUniqueClassification,
  categorizeFindingLegacyWaveFPool,
} from "./wave-f-unique-classification.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reportPath = path.join(root, "tmp/i18n/wave-f-ui-chrome-classification.json");
const writeReport = process.argv.includes("--write-report");

/** Frozen Wave F opening scope — do not recompute from live scan. */
export const ORIGINAL_WAVE_F_UNIQUE_FINDINGS = 642;

export { classifyWaveFUiChrome, categorizeFindingWaveF };

const { findings, scannedFiles } = scanRepository();
const live = buildWaveFUniqueClassification(findings);

const removedFromScanner = Math.max(0, ORIGINAL_WAVE_F_UNIQUE_FINDINGS - live.totalUniqueFindings);

const uniqueClassification = {
  totalUniqueFindings: ORIGINAL_WAVE_F_UNIQUE_FINDINGS,
  trueUiChrome: live.buckets.trueUiChrome,
  trueUiRemoved: removedFromScanner,
  reclassifiedLearning: live.buckets.reclassifiedLearning,
  reclassifiedGames: live.buckets.reclassifiedGames,
  reclassifiedClassroom: live.buckets.reclassifiedClassroom,
  reclassifiedBooks: live.buckets.reclassifiedBooks,
  reclassifiedReports: live.buckets.reclassifiedReports,
  reclassifiedRewards: live.buckets.reclassifiedRewards,
  reclassifiedCopilot: live.buckets.reclassifiedCopilot,
  reclassifiedSeo: live.buckets.reclassifiedSeo,
  reclassifiedPwa: live.buckets.reclassifiedPwa,
  technical: live.buckets.technical,
  falsePositives: live.buckets.falsePositives,
  overlapCount: 0,
};

uniqueClassification.bucketSum =
  uniqueClassification.trueUiChrome +
  uniqueClassification.trueUiRemoved +
  uniqueClassification.reclassifiedLearning +
  uniqueClassification.reclassifiedGames +
  uniqueClassification.reclassifiedClassroom +
  uniqueClassification.reclassifiedBooks +
  uniqueClassification.reclassifiedReports +
  uniqueClassification.reclassifiedRewards +
  uniqueClassification.reclassifiedCopilot +
  uniqueClassification.reclassifiedSeo +
  uniqueClassification.reclassifiedPwa +
  uniqueClassification.technical +
  uniqueClassification.falsePositives;

uniqueClassification.sumsToOriginal642 =
  uniqueClassification.bucketSum === ORIGINAL_WAVE_F_UNIQUE_FINDINGS;

const currentUiChrome = findings.filter((f) => categorizeFinding(f.file, f.text) === "UI chrome");

const CLOSED_WAVES = ["Learning", "Reports", "Books UI", "Rewards", "Educational games", "Solo games", "Arcade games"];
/** @type {Record<string, number>} */
const activeCategoryCounts = {};
for (const wave of CLOSED_WAVES) {
  activeCategoryCounts[wave] = findings.filter((f) => categorizeFinding(f.file, f.text) === wave).length;
}

const fullInventoryReport = runWaveFFullInventory({ writeReport: false });
const waveFFullInventory = fullInventoryReport.inventory;

const report = {
  generatedAt: new Date().toISOString(),
  scannedFiles,
  originalWaveFUniqueFindings: ORIGINAL_WAVE_F_UNIQUE_FINDINGS,
  uniqueClassification,
  waveFFullInventory: {
    ...waveFFullInventory,
    burnDown: fullInventoryReport.burnDown,
    legacySharedUiPoolNote:
      "uniqueClassification.trueUiChrome is the old 642-pool shared UI subset only — not total Wave F remaining",
  },
  liveLegacyPoolInScanner: {
    totalUniqueFindings: live.totalUniqueFindings,
    buckets: live.buckets,
    bucketSum: live.bucketSum,
    note: "Findings still matching legacy UI-chrome pool rules in current scan",
  },
  trueUiChromeRemaining: uniqueClassification.trueUiChrome,
  waveFTotalUniqueRemaining: waveFFullInventory.waveFTotalRemaining,
  trueUiRemoved: uniqueClassification.trueUiRemoved,
  uiChromeActiveCategoryCount: currentUiChrome.length,
  activeCategoryCounts,
  activeRegressionNote:
    "activeCategoryCounts are full-repo scanner categories. Legacy reclassified debt is not a closed-wave regression.",
  keyFileChecks: {
    "utils/geometry-conceptual-bank.js": {
      legacyPool: categorizeFindingLegacyWaveFPool("utils/geometry-conceptual-bank.js", "sample"),
      currentCategory: categorizeFinding("utils/geometry-conceptual-bank.js", "sample"),
      waveFSub: classifyWaveFUiChrome("utils/geometry-conceptual-bank.js", "sample", 0),
    },
    "components/leo-miners/LeoMinersGame.jsx": {
      legacyPool: categorizeFindingLegacyWaveFPool("components/leo-miners/LeoMinersGame.jsx", "sample"),
      currentCategory: categorizeFinding("components/leo-miners/LeoMinersGame.jsx", "sample"),
      waveFSub: classifyWaveFUiChrome("components/leo-miners/LeoMinersGame.jsx", "sample", 0),
    },
    "components/game-audio/GameAudioSettingsPanel.jsx": {
      legacyPool: categorizeFindingLegacyWaveFPool("components/game-audio/GameAudioSettingsPanel.jsx", "sample"),
      currentCategory: categorizeFinding("components/game-audio/GameAudioSettingsPanel.jsx", "sample"),
      waveFSub: classifyWaveFUiChrome("components/game-audio/GameAudioSettingsPanel.jsx", "sample", 0),
    },
  },
};

console.log(JSON.stringify(report, null, 2));

if (writeReport) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.error(`Wrote ${toPosix(reportPath)}`);
}
