/**
 * Probe-quality regressions for Arabic Country Waves 2/3.
 * Proves synthetic false cases FAIL without touching product content.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  detectFalseQatarFoundationalClaims,
  collectForbiddenEnglishUi,
} from "../../docs/reports/_arabic-country-wave-3-runtime-probes.mjs";
import { probeWave2LocaleMembership } from "../../docs/reports/_arabic-country-wave-2-runtime-probes.mjs";
import {
  getSelectableLocales,
  getPublicLocalePathPrefix,
  LOCALE_REGISTRY,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import {
  loadLocaleBundles,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";

test("Qatar foundational detector: legal early-learning wording is not a defect", () => {
  const legal = [
    "المرحلة التأسيسية للصفين الأول والثاني",
    "برامج المرحلة التأسيسية في الصف الأول",
    "foundational support for early grades",
  ];
  for (const s of legal) {
    assert.deepEqual(detectFalseQatarFoundationalClaims(s), [], s);
  }
});

test("Qatar foundational detector: synthetic grades1–6 = foundational MUST fail", () => {
  const falseCases = [
    "المرحلة التأسيسية هي الصفوف من 1 إلى 6",
    "الصفوف من 1 إلى 6 هي المرحلة التأسيسية",
    "المرحلة التأسيسية تشمل الصفوف من 1 إلى 6",
    "المرحلة التأسيسية للصفوف 1–6",
    "grades 1-6 are the foundational stage",
    "Foundational stage is grades 1–6",
  ];
  for (const s of falseCases) {
    assert.ok(detectFalseQatarFoundationalClaims(s).length > 0, s);
  }
});

test("Current Qatar runtime about does not claim foundational = grades 1–6", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("ar-QA");
  const about = JSON.stringify(bundles.ui?.public?.about || bundles.ui?.about || {});
  assert.deepEqual(detectFalseQatarFoundationalClaims(about), []);
});

test("forbidden English UI collector: Arabic chrome PASS; English chrome FAIL", () => {
  assert.deepEqual(
    collectForbiddenEnglishUi(["الصف", "شعبة", "ممارسة الرياضيات حسب الصف والموضوع"]),
    []
  );
  const hits = collectForbiddenEnglishUi(["Dashboard", "Parents", "الصف"]);
  assert.ok(hits.includes("Dashboard"));
  assert.ok(hits.includes("Parents"));
  assert.equal(hits.includes("الصف"), false);
  // English-learning content with Arabic present is not flagged as UI chrome leakage
  assert.deepEqual(collectForbiddenEnglishUi(["Practice English vocabulary — تدريب"]), []);
});

test("Wave2 membership: current IQ/JO/AE/TN remain selectable with paths/fallbacks", () => {
  const r = probeWave2LocaleMembership(
    getSelectableLocales(),
    LOCALE_REGISTRY,
    getPublicLocalePathPrefix,
    getLocaleFallbackChain
  );
  assert.equal(r.failures.length, 0, JSON.stringify(r.failures));
  assert.equal(r.currentSelectorTotal, 88);
  for (const id of ["ar-IQ", "ar-JO", "ar-AE", "ar-TN"]) {
    assert.equal(r.checks[`${id}.selectable`], true, id);
    assert.equal(r.checks[`${id}.path`], true, id);
    assert.equal(r.checks[`${id}.fallback`], true, id);
  }
});

test("Wave2 membership: removing ar-IQ while keeping high selector total MUST fail", () => {
  const synthetic = getSelectableLocales().filter((l) => l.id !== "ar-IQ");
  // Simulate replacing Iraq with an unrelated extra locale so total stays high.
  synthetic.push({
    id: "xx-FAKE",
    pathPrefix: "xx",
    label: "Fake",
    selectorVisible: true,
  });
  assert.ok(synthetic.length >= 84);
  const r = probeWave2LocaleMembership(
    synthetic,
    LOCALE_REGISTRY,
    getPublicLocalePathPrefix,
    getLocaleFallbackChain
  );
  assert.ok(r.failures.some((f) => /missing selectable ar-IQ/.test(f)), JSON.stringify(r.failures));
  assert.equal(r.checks["ar-IQ.selectable"], false);
  assert.equal(r.checks["ar-JO.selectable"], true);
});
