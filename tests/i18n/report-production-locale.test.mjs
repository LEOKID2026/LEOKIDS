import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveProductionReportLocale,
  attachReportLocaleMeta,
} from "../../lib/reports/report-locale.js";
import {
  buildParentFacingBlocks,
  buildParentInsightsHe,
} from "../../lib/parent-server/parent-report-parent-facing.server.js";

test("resolveProductionReportLocale prefers membership preferred_report_language over interface", () => {
  assert.equal(
    resolveProductionReportLocale({
      membershipLocales: {
        ok: true,
        preferredReportLanguage: "ar-XB",
        interfaceLanguage: "en-XA",
      },
    }),
    "ar-XB"
  );
});

test("resolveProductionReportLocale falls back to interface when report preference absent", () => {
  assert.equal(
    resolveProductionReportLocale({
      membershipLocales: {
        ok: true,
        preferredReportLanguage: "en",
        interfaceLanguage: "en-XA",
      },
    }),
    "en"
  );
  assert.equal(
    resolveProductionReportLocale({
      membershipLocales: {
        ok: true,
        interfaceLanguage: "en-XA",
      },
    }),
    "en-XA"
  );
});

test("resolveProductionReportLocale keeps report and interface independent", () => {
  const reportLocale = resolveProductionReportLocale({
    membershipLocales: {
      ok: true,
      preferredReportLanguage: "ar-XB",
      interfaceLanguage: "en-XA",
    },
  });
  assert.equal(reportLocale, "ar-XB");
  assert.notEqual(reportLocale, "en-XA");
});

test("attachReportLocaleMeta exposes both locale ids in payload meta", () => {
  const payload = attachReportLocaleMeta(
    { summary: { totalAnswers: 0 }, meta: { source: "supabase" } },
    { reportLocale: "ar-XB", interfaceLocale: "en-XA" }
  );
  assert.equal(payload.meta.reportLocale, "ar-XB");
  assert.equal(payload.meta.interfaceLocale, "en-XA");
  assert.equal(payload.meta.source, "supabase");
});

test("buildParentInsightsHe localizes headline copy via report locale", () => {
  const payload = {
    summary: { totalAnswers: 0, totalSessions: 0 },
    subjects: {},
    dailyActivity: [],
    recentMistakes: [],
  };

  const enInsights = buildParentInsightsHe(payload, "en");
  const pseudoInsights = buildParentInsightsHe(payload, "en-XA");

  assert.match(enInsights[0], /not yet enough practice data/i);
  assert.ok(pseudoInsights[0].length > enInsights[0].length);
});

test("buildParentFacingBlocks uses reportLocale for summary paths", () => {
  const payload = {
    summary: { totalAnswers: 0, totalSessions: 0 },
    subjects: {},
    dailyActivity: [],
    recentMistakes: [],
  };

  const enBlocks = buildParentFacingBlocks(payload, { reportLocale: "en" });
  const pseudoBlocks = buildParentFacingBlocks(payload, { reportLocale: "en-XA" });

  assert.ok(enBlocks.insights.length > 0);
  assert.ok(pseudoBlocks.homeRecommendations[0].length >= enBlocks.homeRecommendations[0].length);
});
