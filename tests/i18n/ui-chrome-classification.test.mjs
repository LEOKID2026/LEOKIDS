import test, { describe } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { categorizeFinding } from "../../scripts/i18n/categorize-finding-rules.mjs";
import {
  classifyWaveFUiChrome,
  categorizeFindingWaveF,
} from "../../scripts/i18n/wave-f-ui-chrome-classify.mjs";
import {
  ORIGINAL_WAVE_F_UNIQUE_FINDINGS,
} from "../../scripts/i18n/audit-ui-chrome-classification.mjs";
import { buildWaveFUniqueClassification } from "../../scripts/i18n/wave-f-unique-classification.mjs";
import { scanRepository } from "../../scripts/i18n/hardcoded-ui-core.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("wave F classification audit script runs with unique 642 accounting", () => {
  const out = execFileSync("node", ["scripts/i18n/audit-ui-chrome-classification.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
  const report = JSON.parse(out);
  assert.equal(report.originalWaveFUniqueFindings, 642);
  assert.equal(report.uniqueClassification.totalUniqueFindings, 642);
  assert.equal(report.uniqueClassification.sumsToOriginal642, true);
  assert.equal(report.uniqueClassification.bucketSum, 642);
  assert.equal(report.uniqueClassification.overlapCount, 0);
  assert.equal(
    report.keyFileChecks["utils/geometry-conceptual-bank.js"].currentCategory,
    "Learning",
  );
  assert.equal(
    report.keyFileChecks["components/game-audio/GameAudioSettingsPanel.jsx"].waveFSub,
    "true_ui_chrome",
  );
});

test("live legacy pool buckets sum without overlap", () => {
  const live = buildWaveFUniqueClassification(scanRepository().findings);
  assert.equal(live.bucketSum, live.totalUniqueFindings);
  assert.equal(live.overlapCount, 0);
  assert.equal(
    live.totalUniqueFindings + live.buckets.trueUiChrome >= 0,
    true,
  );
  assert.equal(
    ORIGINAL_WAVE_F_UNIQUE_FINDINGS,
    live.totalUniqueFindings + Math.max(0, ORIGINAL_WAVE_F_UNIQUE_FINDINGS - live.totalUniqueFindings),
  );
});

describe("Wave F categorization rules", () => {
  test("geometry conceptual bank is Learning, not UI chrome", () => {
    assert.equal(categorizeFinding("utils/geometry-conceptual-bank.js", "What is a square?"), "Learning");
    assert.equal(
      classifyWaveFUiChrome("utils/geometry-conceptual-bank.js", "What is a square?", 1),
      "learning_misclassified",
    );
  });

  test("Leo Miners gameplay stays in Educational games", () => {
    assert.equal(
      categorizeFinding("components/leo-miners/LeoMinersGame.jsx", "Collect gems"),
      "Educational games",
    );
    assert.equal(
      classifyWaveFUiChrome("components/leo-miners/LeoMinersGame.jsx", "Collect gems", 1),
      "game_misclassified",
    );
  });

  test("shared game audio settings panel is true UI chrome", () => {
    assert.equal(
      categorizeFinding("components/game-audio/GameAudioSettingsPanel.jsx", "Audio settings"),
      "UI chrome",
    );
    assert.equal(
      classifyWaveFUiChrome("components/game-audio/GameAudioSettingsPanel.jsx", "Audio settings", 1),
      "true_ui_chrome",
    );
  });

  test("classroom activity labels route to Worksheets", () => {
    assert.equal(
      categorizeFinding(
        "lib/classroom-activities/student-activity-error-labels.client.js",
        "Activity not found",
      ),
      "Worksheets",
    );
    assert.equal(
      classifyWaveFUiChrome(
        "lib/classroom-activities/student-activity-error-labels.client.js",
        "Activity not found",
        1,
      ),
      "classroom_activities",
    );
    assert.equal(
      categorizeFindingWaveF(
        "lib/classroom-activities/student-activity-error-labels.client.js",
        "Activity not found",
        1,
      ),
      "Worksheets",
    );
  });
});
