import test, { afterEach, beforeEach, describe } from "node:test";
import assert from "node:assert/strict";
import {
  I18N_NAMESPACES,
  loadLocaleBundles,
  lookupMessage,
  registerLocaleBundle,
  resetLocaleBundleCache,
  collectMissingKeys,
} from "../../lib/i18n/load-messages.js";
import { createTranslator } from "../../lib/i18n/create-translator.js";

beforeEach(() => {
  resetLocaleBundleCache();
});

afterEach(() => {
  resetLocaleBundleCache();
});

test("loadLocaleBundles returns all namespaces for en", () => {
  const bundles = loadLocaleBundles("en");
  for (const ns of I18N_NAMESPACES) {
    assert.ok(bundles[ns], `missing namespace ${ns}`);
    assert.equal(typeof bundles[ns], "object");
  }
  assert.equal(lookupMessage(bundles, "common.startLearning"), "Start learning");
});

test("loadLocaleBundles respects locale id and caches per locale", () => {
  const en = loadLocaleBundles("en");
  const pseudo = loadLocaleBundles("en-XA");
  assert.notEqual(en, pseudo);
  assert.equal(lookupMessage(pseudo, "common.startLearning"), "Start learning");
  assert.equal(loadLocaleBundles("en-XA"), pseudo);
});

const EMPTY_NS = {
  ui: {},
  auth: {},
  learning: {},
  reports: {},
  emails: {},
  seo: {},
  legal: {},
  worksheets: {},
  games: {},
  validation: {},
};

test("loadLocaleBundles merges fallback chain (later overrides earlier)", () => {
  registerLocaleBundle("en-XA", {
    common: { onlyInXA: "XA value", startLearning: "XA start" },
    ...EMPTY_NS,
  });
  resetLocaleBundleCache();

  const bundles = loadLocaleBundles("en-XA");
  assert.equal(lookupMessage(bundles, "common.onlyInXA"), "XA value");
  assert.equal(lookupMessage(bundles, "common.startLearning"), "XA start");
  assert.equal(lookupMessage(bundles, "common.back"), "Back");
});

test("loadLocaleBundles warns once for missing locale bundle in chain", () => {
  const warnings = [];
  const orig = console.warn;
  console.warn = (...args) => warnings.push(args.join(" "));
  try {
    resetLocaleBundleCache();
    loadLocaleBundles("ar-XB");
    loadLocaleBundles("ar-XB");
    assert.ok(warnings.some((w) => w.includes('[i18n] no bundle for locale "ar"')));
    assert.equal(warnings.filter((w) => w.includes('[i18n] no bundle for locale "ar"')).length, 1);
  } finally {
    console.warn = orig;
    resetLocaleBundleCache();
  }
});

describe("createTranslator missing key warnings", () => {
  test("warns in dev for missing keys and returns key as fallback", () => {
    const warnings = [];
    const orig = console.warn;
    console.warn = (...args) => warnings.push(args.join(" "));
    try {
      const { t, getMissingKeys } = createTranslator("en");
      assert.equal(t("common.startLearning"), "Start learning");
      assert.equal(t("ui.definitely.missing.key"), "ui.definitely.missing.key");
      assert.deepEqual(getMissingKeys(), ["ui.definitely.missing.key"]);
      assert.ok(warnings.some((w) => w.includes("[i18n] missing key: ui.definitely.missing.key")));
    } finally {
      console.warn = orig;
    }
  });
});

test("collectMissingKeys returns empty when locale matches reference", () => {
  assert.deepEqual(collectMissingKeys("en", "en"), []);
});

test("loadLocaleBundles fills gaps from en via fallback chain merge", () => {
  registerLocaleBundle("en-XA", {
    common: { onlyPartial: "Only in XA" },
    ...EMPTY_NS,
  });
  resetLocaleBundleCache();

  const bundles = loadLocaleBundles("en-XA");
  assert.equal(lookupMessage(bundles, "common.onlyPartial"), "Only in XA");
  assert.equal(lookupMessage(bundles, "common.back"), "Back");

  const { t } = createTranslator("en-XA");
  assert.ok(t("common.onlyPartial").includes("Only in XA"));
  assert.ok(t("common.back").includes("Back"));
});
