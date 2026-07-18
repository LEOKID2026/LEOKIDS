import test from "node:test";
import assert from "node:assert/strict";
import { buildGlobalDebtInventory, GLOBAL_DEBT_OWNERS } from "../../scripts/i18n/global-debt-inventory.mjs";
import { scanRepository } from "../../scripts/i18n/hardcoded-ui-core.mjs";
import { classifyFindingKind } from "../../scripts/i18n/finding-classification.mjs";

test("global debt inventory — unowned is zero and owner sum equals unique remaining", () => {
  const { findings } = scanRepository();
  const enriched = findings.map((f) => ({
    ...f,
    kind: classifyFindingKind(f.file, f.text, f.line),
  }));
  const live = buildGlobalDebtInventory(enriched);
  assert.equal(live.unownedRemaining, 0);
  assert.equal(live.sumsCorrect, true);
  assert.equal(live.ownerSum, live.globalUniqueRemaining);
  const sum = GLOBAL_DEBT_OWNERS.reduce((acc, o) => acc + (live.ownerCounts[o] || 0), 0);
  assert.equal(sum, live.globalUniqueRemaining);
});

test("scanner metrics — realTotalDebt equals debt test field and excludedFromDebt is non-debt", () => {
  const { findings } = scanRepository();
  const enriched = findings.map((f) => ({
    ...f,
    kind: classifyFindingKind(f.file, f.text, f.line),
  }));
  const live = buildGlobalDebtInventory(enriched);
  assert.equal(live.metrics.realTotalDebt, live.metrics.realUserVisibleDebt + live.metrics.realContentDebt);
  assert.equal(live.metrics.unauthorizedUserVisible, live.metrics.realTotalDebt);
  assert.equal(live.metrics.scannerTotal, live.metrics.realTotalDebt + live.metrics.excludedFromDebt);
});
