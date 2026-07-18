import test from "node:test";
import assert from "node:assert/strict";
import {
  reportPackCopyForLocale,
  applyReportLocaleTransform,
} from "../../lib/reports/report-pack-copy.js";
import {
  resolveParentReportLocale,
  resolveReportDirection,
  attachReportLocaleMeta,
} from "../../lib/reports/report-locale.js";
import { resolveInterfaceLocale } from "../../lib/i18n/locale-resolution.js";

/** @type {{ interfaceLocale: string, reportLocale: string }[]} */
const MATRIX = [
  { interfaceLocale: "en", reportLocale: "en" },
  { interfaceLocale: "en-XA", reportLocale: "en" },
  { interfaceLocale: "ar-XB", reportLocale: "en" },
  { interfaceLocale: "en", reportLocale: "en-XA" },
  { interfaceLocale: "en", reportLocale: "ar-XB" },
  { interfaceLocale: "ar-XB", reportLocale: "ar-XB" },
];

for (const combo of MATRIX) {
  test(`report matrix interface=${combo.interfaceLocale} report=${combo.reportLocale}`, () => {
    const resolvedReport = resolveParentReportLocale({
      preferredReportLanguage: combo.reportLocale,
      interfaceLocale: combo.interfaceLocale,
    });
    assert.equal(resolvedReport, combo.reportLocale);
    if (combo.interfaceLocale !== combo.reportLocale) {
      assert.notEqual(resolvedReport, combo.interfaceLocale);
    }

    const reportDir = resolveReportDirection(combo.reportLocale);
    if (combo.reportLocale === "ar-XB") assert.equal(reportDir, "rtl");
    else assert.equal(reportDir, "ltr");

    const sample = reportPackCopyForLocale(
      combo.reportLocale,
      "utils__parent-report-ui-explain-he",
      "improving"
    );
    assert.ok(sample.length > 0);
    assert.doesNotMatch(sample, /^improving$/);

    if (combo.reportLocale === "en-XA") {
      assert.ok(sample.includes("[[["));
    }
    if (combo.reportLocale === "ar-XB") {
      assert.ok(sample.includes("\u202B"));
    }

    const meta = attachReportLocaleMeta(
      { insights: [] },
      { reportLocale: combo.reportLocale, interfaceLocale: combo.interfaceLocale }
    );
    assert.equal(meta.meta.reportLocale, combo.reportLocale);
    assert.equal(meta.meta.interfaceLocale, combo.interfaceLocale);
  });
}

test("interface and report locales resolve independently from URL prefix", () => {
  const iface = resolveInterfaceLocale({
    asPath: "/ar-XB/learning/parent-report",
    pathname: "/learning/parent-report",
    query: {},
  });
  assert.equal(iface, "ar-XB");

  const report = resolveParentReportLocale({
    preferredReportLanguage: "en",
    interfaceLocale: iface,
  });
  assert.equal(report, "en");
});

test("applyReportLocaleTransform leaves en unchanged", () => {
  assert.equal(applyReportLocaleTransform("Fractions need practice", "en"), "Fractions need practice");
});
