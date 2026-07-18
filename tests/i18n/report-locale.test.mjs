import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveParentReportLocale,
  localizeReportContractForLocale,
} from "../../lib/reports/report-locale.js";

test("resolveParentReportLocale prefers explicit preferred_report_language", () => {
  assert.equal(
    resolveParentReportLocale({
      preferredReportLanguage: "ar-XB",
      interfaceLocale: "en-XA",
    }),
    "ar-XB"
  );
});

test("localizeReportContractForLocale uses report locale bundle", () => {
  const localized = localizeReportContractForLocale(
    {
      type: "topic_needs_strengthening",
      subject: "math",
      topic: "addition",
      metrics: { questions: 12, accuracy: 55 },
      recommendedAction: "remediate_same_level",
    },
    "en"
  );
  assert.match(localized.headline, /addition|Addition/i);
  assert.equal(localized.locale, "en");
});
