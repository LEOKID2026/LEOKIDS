/**
 * Regression guard: the parent-facing "insufficient evidence" diagnostic label must use
 * the softer, approved wording ("  ...") and must never regress to the
 * blunter "     ..." phrasing.
 * Run: node --test tests/parent-report-language/insufficient-evidence-softer-wording.test.mjs
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { PARENT_DIAGNOSTIC_TYPE_LABEL_HE } from "../../utils/parent-report-language/parent-report-copy-spec.js";

test("insufficient_evidence label uses the softer approved wording", () => {
  assert.match(PARENT_DIAGNOSTIC_TYPE_LABEL_HE.insufficient_evidence, /  /);
  assert.doesNotMatch(
    PARENT_DIAGNOSTIC_TYPE_LABEL_HE.insufficient_evidence,
    /    /
  );
});

test("mixed_low_signal label uses the softer approved wording", () => {
  assert.match(PARENT_DIAGNOSTIC_TYPE_LABEL_HE.mixed_low_signal, /  /);
  assert.doesNotMatch(
    PARENT_DIAGNOSTIC_TYPE_LABEL_HE.mixed_low_signal,
    /    /
  );
});
