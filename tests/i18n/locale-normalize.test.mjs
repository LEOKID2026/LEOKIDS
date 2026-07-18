import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeLocaleInput,
  normalizeLocaleId,
  getBaseLocaleId,
  buildLocaleFallbackChain,
} from "../../lib/i18n/locale-normalize.js";

test("normalizeLocaleInput: empty defaults to en", () => {
  assert.deepEqual(normalizeLocaleInput(null).canonical, "en");
  assert.deepEqual(normalizeLocaleInput("").canonical, "en");
  assert.deepEqual(normalizeLocaleInput("   ").canonical, "en");
});

test("normalizeLocaleInput: BCP47 casing and underscore handling", () => {
  assert.equal(normalizeLocaleId("EN_us"), "en");
  assert.equal(normalizeLocaleId("en-US"), "en");
  assert.equal(normalizeLocaleId("en_GB"), "en");
  assert.equal(normalizeLocaleInput("pt-BR").canonical, "pt-BR");
  assert.equal(normalizeLocaleInput("pt-BR").language, "pt");
  assert.equal(normalizeLocaleInput("pt-BR").region, "BR");
});

test("normalizeLocaleInput: known aliases resolve to canonical registry ids", () => {
  assert.equal(normalizeLocaleId("en-au"), "en");
  assert.equal(normalizeLocaleId("en-xa"), "en-XA");
  assert.equal(normalizeLocaleId("ar-xb"), "ar-XB");
  assert.equal(normalizeLocaleId("he-IL"), "he");
  assert.equal(normalizeLocaleId("he"), "he");
});

test("normalizeLocaleInput: script subtags preserve canonical form", () => {
  const zh = normalizeLocaleInput("zh-Hans");
  assert.equal(zh.canonical, "zh-Hans");
  assert.equal(zh.script, "Hans");
  assert.equal(zh.base, "zh");
});

test("getBaseLocaleId: returns language subtag for regional variants", () => {
  assert.equal(getBaseLocaleId("en-XA"), "en");
  assert.equal(getBaseLocaleId("ar-XB"), "ar");
  assert.equal(getBaseLocaleId("en"), null);
});

test("buildLocaleFallbackChain: exact → base → configured → default", () => {
  assert.deepEqual(buildLocaleFallbackChain("en-XA", { configuredFallback: "en", defaultLocale: "en" }), [
    "en-XA",
    "en",
  ]);
  assert.deepEqual(buildLocaleFallbackChain("ar-XB", { configuredFallback: "en", defaultLocale: "en" }), [
    "ar-XB",
    "ar",
    "en",
  ]);
  assert.deepEqual(buildLocaleFallbackChain("pt-BR", { configuredFallback: "en", defaultLocale: "en" }), [
    "pt-BR",
    "pt",
    "en",
  ]);
  assert.deepEqual(buildLocaleFallbackChain("en", { configuredFallback: "en", defaultLocale: "en" }), ["en"]);
});

test("buildLocaleFallbackChain: deduplicates repeated entries", () => {
  const chain = buildLocaleFallbackChain("en", { configuredFallback: "en", defaultLocale: "en" });
  assert.deepEqual(chain, ["en"]);
  assert.equal(new Set(chain).size, chain.length);
});
