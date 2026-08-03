/**
 * Arabic master (ar-001) content layer smoke — Phases 7–18 closure gates (selector hidden).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  LOCALE_REGISTRY,
  getSelectableLocales,
  resolveDirection,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import {
  stripLocaleFromPath,
  withLocalePath,
  getLocaleFromPath,
} from "../../lib/i18n/locale-path.js";
import {
  collectMissingKeys,
  loadLocaleBundles,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { loadContentPack } from "../../lib/content/locale.server.js";
import { getCatalogPackExact } from "../../lib/content/pack-catalog.js";
import {
  resolveHelpLocale,
  listArticles,
} from "../../data/help-center/index.js";
import { ALL_ARTICLES_AR_001 } from "../../data/help-center/ar-001/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WORD_MEANINGS_AR_001 } from "../../data/english-questions/word-meanings/ar-001.js";
import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { localizeScienceQuestionForLocale } from "../../utils/learning-content-en/science.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import { resolveContentLocale } from "../../utils/learning-question-content-locale.js";
import { resolveRegisteredContentPack } from "../../lib/content/resolve-registered-pack.js";
import { FORBIDDEN_AR_001_PATTERNS } from "../../lib/i18n/arabic-master-glossary.js";
import { readRepoFile } from "./_certified-surfaces.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
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

function countKeys(obj, n = 0) {
  if (obj == null || typeof obj !== "object") return n + 1;
  for (const v of Object.values(obj)) n = countKeys(v, n);
  return n;
}

test("ar-001 registry: RTL, enabled selector, fallback to en", () => {
  const def = LOCALE_REGISTRY[LOCALE];
  assert.equal(def.direction, "rtl");
  assert.equal(resolveDirection(LOCALE), "rtl");
  assert.equal(def.selectorVisible, true);
  assert.equal(def.status, "enabled");
  assert.deepEqual(getLocaleFallbackChain(LOCALE), [LOCALE, "en"]);
  assert.equal(getSelectableLocales().filter((l) => l.label === "العربية").length, 1);
  assert.equal(getSelectableLocales().length, 76);
});

test("ar-001 path routing: /ar-001 Arabic, /ar Argentina", () => {
  assert.equal(getLocaleFromPath("/ar-001/parent/dashboard"), LOCALE);
  assert.equal(getLocaleFromPath("/ar/parent/dashboard"), "es-AR");
  const stripped = stripLocaleFromPath("/ar-001/teacher/classes");
  assert.equal(stripped.locale, LOCALE);
  assert.equal(stripped.pathname, "/teacher/classes");
  assert.equal(withLocalePath(LOCALE, "/student/home"), "/ar-001/student/home");
});

test("ar-001 locales: 15 namespaces, zero missing keys", () => {
  resetLocaleBundleCache();
  assert.equal(collectMissingKeys(LOCALE).length, 0);
  const enFiles = fs.readdirSync(path.join(ROOT, "locales/en")).filter((f) => f.endsWith(".json")).sort();
  const arFiles = fs.readdirSync(path.join(ROOT, "locales", LOCALE)).filter((f) => f.endsWith(".json")).sort();
  assert.deepEqual(arFiles, enFiles);
  assert.equal(arFiles.length, 15);
});

test("ar-001 common chrome is Arabic (not English fallback)", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles(LOCALE);
  assert.match(String(bundles.common?.brandTagline || ""), /[\u0600-\u06FF]/);
  assert.match(String(bundles.common?.subjectMath || ""), /[\u0600-\u06FF]/);
  assert.match(String(bundles.auth?.signIn || bundles.auth?.loginTitle || ""), /[\u0600-\u06FF]/);
  assert.match(String(bundles.school?.portal?.navDashboard || ""), /[\u0600-\u06FF]/);
  assert.match(String(bundles.teacher?.dashboard?.noClassesTitle || ""), /[\u0600-\u06FF]/);
});

test("ar-001 content-packs parity vs en (392 files)", () => {
  const enPacks = walkJson(path.join(ROOT, "content-packs/en"));
  const arPacks = walkJson(path.join(ROOT, "content-packs", LOCALE));
  const enRel = enPacks.map((p) => path.relative(path.join(ROOT, "content-packs/en"), p).replace(/\\/g, "/"));
  const arRel = new Set(arPacks.map((p) => path.relative(path.join(ROOT, "content-packs", LOCALE), p).replace(/\\/g, "/")));
  const missing = enRel.filter((r) => !arRel.has(r));
  assert.equal(missing.length, 0, missing.slice(0, 5).join(", "));
  assert.equal(arPacks.length, 392);
});

test("ar-001 books runtime packs resolve from catalog", () => {
  for (const leaf of ["registry-titles.json", "ui.json", "english-page-skills.json"]) {
    const pack = resolveRegisteredContentPack(LOCALE, "books", leaf);
    assert.ok(pack && typeof pack === "object", leaf);
    assert.ok(getCatalogPackExact(LOCALE, `books/${leaf}`));
  }
  const titles = resolveRegisteredContentPack(LOCALE, "books", "registry-titles.json");
  const blob = JSON.stringify(titles);
  assert.match(blob, /[\u0600-\u06FF]/);
});

test("ar-001 rewards and games packs resolve with Arabic copy", () => {
  const rewards = loadContentPack(LOCALE, "rewards", "ui.json");
  assert.ok(rewards);
  assert.match(JSON.stringify(rewards), /[\u0600-\u06FF]/);
  const games = loadContentPack(LOCALE, "games", "burn-down-index.json");
  assert.ok(games);
});

test("ar-001 help center: 40 articles wired", () => {
  assert.equal(ALL_ARTICLES_AR_001.length, 40);
  assert.equal(resolveHelpLocale(LOCALE), LOCALE);
  const parents = listArticles("parents", LOCALE);
  assert.ok(parents.length >= 10);
  const blob = JSON.stringify(parents);
  assert.match(blob, /[\u0600-\u06FF]/);
});

test("ar-001 word meanings: 745 IDs parity with WORD_LISTS", () => {
  assert.deepEqual(Object.keys(WORD_MEANINGS_AR_001).sort(), Object.keys(WORD_LISTS).sort());
  let n = 0;
  for (const cat of Object.keys(WORD_LISTS)) {
    for (const id of Object.keys(WORD_LISTS[cat] || {})) {
      n++;
      const meaning = WORD_MEANINGS_AR_001[cat]?.[id];
      assert.ok(meaning, `missing ${cat}.${id}`);
      assert.match(String(meaning), /[\u0600-\u06FF]/, `${cat}.${id}`);
      assert.equal(
        resolveEnglishWordMeaning(id, { listKey: cat, instructionLocale: LOCALE }),
        meaning
      );
    }
  }
  assert.equal(n, 745);
});

test("ar-001 science overlay ID parity with en (1017)", async () => {
  const { SCIENCE_EN_OVERLAY } = await import("../../data/science-questions-en-overlay.js");
  const { SCIENCE_AR_001_OVERLAY } = await import("../../data/science-questions-ar-001-overlay.js");
  const enIds = Object.keys(SCIENCE_EN_OVERLAY).sort();
  const arIds = Object.keys(SCIENCE_AR_001_OVERLAY).sort();
  assert.deepEqual(arIds, enIds);
  assert.equal(arIds.length, 1017);
  const sample = SCIENCE_AR_001_OVERLAY.body_1;
  assert.match(String(sample.stem || ""), /[\u0600-\u06FF]/);
  const out = localizeScienceQuestionForLocale(
    { id: "body_1", subject: "science", options: SCIENCE_EN_OVERLAY.body_1.options },
    LOCALE
  );
  assert.equal(String(out.stem || out.question || ""), sample.stem);
});

test("ar-001 math/geometry localize with Arabic stems (LTR math islands)", () => {
  assert.equal(resolveContentLocale({ contentLocale: LOCALE }), LOCALE);

  const money = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: LOCALE }
  );
  const moneyText = String(money.question || money.stem || money.exerciseText || "");
  assert.match(moneyText, /[\u0600-\u06FF]/);
  assert.doesNotMatch(moneyText, /How many|dollars?/i);

  const area = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: LOCALE }
  );
  const areaText = String(area.question || area.stem || area.exerciseText || "");
  assert.match(areaText, /[\u0600-\u06FF]/);
  assert.doesNotMatch(areaText, /What is the area|A circle has radius/i);
});

test("ar-001 English subject keeps English Q/A with Arabic-capable chrome path", () => {
  const english = localizeLearningQuestion(
    { subject: "english", params: { word: "cat", direction: "en_to_en" }, stem: "Choose the word: cat" },
    { subject: "english", contentLocale: LOCALE, instructionLocale: LOCALE }
  );
  const text = String(english.stem || english.question || "");
  assert.match(text, /cat/i);
});

test("ar-001 School Portal shell uses locale direction (RTL under ar-001)", () => {
  const src = readRepoFile("components/school-portal/SchoolPortalShell.jsx");
  assert.match(src, /useI18n\(\)/);
  assert.match(src, /direction/);
  assert.doesNotMatch(src, /dir\s*=\s*["']ltr["']/);
  assert.match(src, /bindSchoolUiLocale/);
});

test("ar-001 worksheet HTML builder is locale-aware", () => {
  const src = readRepoFile("lib/worksheets/worksheet-payload-build.server.js");
  assert.match(src, /worksheetDocumentLocaleAttrs|resolveLocaleDefinition/);
});

test("ar-001 locales/emails namespace present for runtime server copy", () => {
  const emails = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "emails.json"), "utf8"));
  const blob = JSON.stringify(emails);
  assert.ok(blob.length > 200);
  assert.match(blob, /[\u0600-\u06FF]/);
});

test("ar-001 no Hebrew script in locale/pack/help surfaces", () => {
  const roots = [
    path.join(ROOT, "locales", LOCALE),
    path.join(ROOT, "content-packs", LOCALE),
    path.join(ROOT, "data/help-center/ar-001"),
  ];
  const hits = [];
  for (const root of roots) {
    for (const f of walkJson(root)) {
      const t = fs.readFileSync(f, "utf8");
      if (/[\u0590-\u05FF]/.test(t)) hits.push(path.relative(ROOT, f));
    }
  }
  assert.deepEqual(hits, []);
});

test("ar-001 forbidden pattern scan on common.json passes", () => {
  const common = fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8");
  for (const { re, label } of FORBIDDEN_AR_001_PATTERNS) {
    assert.doesNotMatch(common, re, label);
  }
});

test("ar-001 no country-specific Arabic leakage samples (MSA neutral)", () => {
  const common = fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8");
  assert.doesNotMatch(common, /\bمصري\b|\bسعودي\b|\bمغربي\b/);
});
