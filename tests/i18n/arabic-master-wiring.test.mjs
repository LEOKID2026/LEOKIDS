/**
 * Arabic master layer (ar-001) structural wiring + Phase 19 closure tests.
 */import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  LOCALE_REGISTRY,
  getSelectableLocales,
  resolveLocaleDefinition,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { getLocaleFromPath, stripLocaleFromPath } from "../../lib/i18n/locale-path.js";
import {
  I18N_NAMESPACES,
  collectMissingKeys,
  loadLocaleBundles,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { loadContentPack } from "../../lib/content/locale.server.js";

const ROOT = process.cwd();
const LOCALE = "ar-001";

function walkJson(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

test("ar-001 registry contract", () => {
  const def = LOCALE_REGISTRY[LOCALE];
  assert.ok(def?.enabled);
  assert.equal(def.direction, "rtl");
  assert.equal(def.fallbackLocale, "en");
  assert.equal(def.label, "العربية");
  assert.equal(def.selectorVisible, true);
  assert.equal(def.status, "enabled");
  assert.equal(def.textToSpeechLocale, "ar-SA");
  assert.equal(def.ogLocale, "ar_SA");
});

test("selector count is 88 with ar-001 visible once", () => {
  assert.equal(getSelectableLocales().length, 88);
  const arabicLabels = getSelectableLocales().filter((l) => l.label === "العربية");
  assert.equal(arabicLabels.length, 1);
});

test("/ar is Argentina, /ar-001 is Arabic master", () => {
  assert.equal(getLocaleFromPath("/ar/dashboard"), "es-AR");
  assert.equal(getLocaleFromPath("/ar-001/dashboard"), LOCALE);
  const stripped = stripLocaleFromPath("/ar-001/parent/dashboard");
  assert.equal(stripped.locale, LOCALE);
  assert.equal(stripped.pathname, "/parent/dashboard");
});

test("fallback chain ar-001 → en", () => {
  assert.deepEqual(getLocaleFallbackChain(LOCALE), [LOCALE, "en"]);
});

test("disabled bare ar does not collide", () => {
  assert.equal(LOCALE_REGISTRY.ar?.enabled, false);
  assert.notEqual(resolveLocaleDefinition("ar").id, LOCALE);
});

test("namespace files exist for all I18N_NAMESPACES", () => {
  for (const ns of I18N_NAMESPACES) {
    const p = path.join(ROOT, "locales", LOCALE, `${ns}.json`);
    assert.ok(fs.existsSync(p), `missing locales/${LOCALE}/${ns}.json`);
  }
});

test("namespace key parity vs en", () => {
  resetLocaleBundleCache();
  const missing = collectMissingKeys(LOCALE, "en");
  assert.equal(missing.length, 0, missing.slice(0, 8).join(", "));
});

test("content pack disk parity vs en", () => {
  const enPacks = walkJson(path.join(ROOT, "content-packs/en"));
  const arPacks = walkJson(path.join(ROOT, "content-packs", LOCALE));
  const enRel = enPacks.map((p) => path.relative(path.join(ROOT, "content-packs/en"), p).replace(/\\/g, "/"));
  const arRel = new Set(arPacks.map((p) => path.relative(path.join(ROOT, "content-packs", LOCALE), p).replace(/\\/g, "/")));
  const missing = enRel.filter((r) => !arRel.has(r));
  assert.equal(missing.length, 0, missing.slice(0, 8).join(", "));
});

test("probe bundle loads Arabic school chrome", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles(LOCALE);
  assert.match(String(bundles.common?.brandTagline || ""), /[\u0600-\u06FF]/);
  assert.match(String(bundles.school?.portal?.navDashboard || ""), /[\u0600-\u06FF]/);
});

test("learning burn-down pack resolves", () => {
  const pack = loadContentPack(LOCALE, "learning", "burn-down-index.json");
  assert.ok(pack && typeof pack === "object");
});

test("locale picker includes ar-001 and selectable count stays 88", async () => {
  const { getSelectableLocales, getLocalePickerLocales } = await import(
    "../../lib/i18n/locale-registry.js"
  );
  assert.equal(getSelectableLocales().length, 88);
  const picker = getLocalePickerLocales("ar-001");
  assert.ok(picker.some((l) => l.id === "ar-001"));
  assert.ok(picker.length >= 88);
});

test("school communication binds Arabic locale", async () => {
  const { resetLocaleBundleCache } = await import("../../lib/i18n/load-messages.js");
  const mod = await import("../../lib/school-portal/school-communication.js");
  resetLocaleBundleCache();
  mod.bindSchoolCommunicationLocale(LOCALE);
  assert.match(String(mod.SC_NAV_MESSAGES), /[\u0600-\u06FF]/);
});
