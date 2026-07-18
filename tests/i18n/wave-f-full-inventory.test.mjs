import test from "node:test";
import assert from "node:assert/strict";
import {
  WAVE_F_INVENTORY_BUCKETS,
  buildWaveFFullInventory,
  classifyWaveFInventoryBucket,
} from "../../scripts/i18n/wave-f-full-inventory.mjs";
import { scanRepository } from "../../scripts/i18n/hardcoded-ui-core.mjs";
import { classifyFindingKind } from "../../scripts/i18n/finding-classification.mjs";

test("Wave F full inventory bucket sum equals total unique remaining", () => {
  const { findings } = scanRepository();
  const enriched = findings.map((f) => ({
    ...f,
    kind: classifyFindingKind(f.file, f.text, f.line),
  }));
  const live = buildWaveFFullInventory(enriched);
  assert.equal(live.sumsCorrect, true);
  assert.equal(live.bucketSum, live.waveFTotalRemaining);
  const sum = WAVE_F_INVENTORY_BUCKETS.reduce((acc, b) => acc + live.counts[b], 0);
  assert.equal(sum, live.waveFTotalRemaining);
});

test("Wave F inventory classifies student and shared domains distinctly", () => {
  assert.equal(
    classifyWaveFInventoryBucket("components/student/StudentThemePicker.jsx", "Light theme", 1),
    "studentChrome"
  );
  assert.equal(
    classifyWaveFInventoryBucket("lib/guest/constants.js", "Not available in guest mode", 1),
    "sharedUi"
  );
  assert.equal(classifyWaveFInventoryBucket("pages/guardian/login.js", "Sign in", 1), "guardian");
});
