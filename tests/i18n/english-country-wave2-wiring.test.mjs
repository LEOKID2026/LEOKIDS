/**
 * English country wave 2 wiring: Canada / Singapore / South Africa / Wales.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getPublicLocalePathPrefix,
  resolveLocaleIdFromPathPrefix,
  resolveLocaleDefinition,
  getSelectableLocales,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { normalizeLocaleId } from "../../lib/i18n/locale-normalize.js";
import {
  stripLocaleFromPath,
  withLocalePath,
  shouldRedirectToPublicLocalePrefix,
  buildLocalizedHref,
} from "../../lib/i18n/locale-path.js";
import {
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { loadContentPack } from "../../lib/content/locale.server.js";
import { getCatalogPackExact } from "../../lib/content/pack-catalog.js";
import {
  loadMergedReportBurnDownIndex,
  reportPackCopyForLocale,
} from "../../lib/reports/report-pack-copy.js";
import {
  resolveHelpLocale,
  listArticles,
  getHelpSections,
} from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { getSchoolGradeOptions } from "../../lib/school-portal/school-drilldown.js";
import {
  assessNearFullCopy,
  auditBurnDownIndexOverlay,
  collectStringLeaves,
  isBurnDownIndexPath,
  resolveAuthorityPackPath,
} from "../../lib/i18n/country-overlay-sparse-contract.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const HEBREW_RE = /[\u0590-\u05FF]/;

const WAVE2 = [
  {
    id: "en-CA",
    prefix: "ca",
    label: "Canada-en",
    fallback: ["en-CA", "en"],
    grade1: "Grade 1",
    chooseGrade: "Choose a grade",
    help: "en",
  },
  {
    id: "en-SG",
    prefix: "sg",
    label: "Singapore",
    fallback: ["en-SG", "en"],
    grade1: "Primary 1",
    chooseGrade: "Choose a primary level",
    help: "en-SG",
  },
  {
    id: "en-ZA",
    prefix: "za",
    label: "South Africa",
    fallback: ["en-ZA", "en"],
    grade1: "Grade 1",
    chooseGrade: "Choose a grade",
    help: "en-ZA",
  },
  {
    id: "en-WLS",
    prefix: "wls",
    label: "Wales",
    fallback: ["en-WLS", "en-GB", "en"],
    grade1: "Year 1",
    chooseGrade: "Choose a year",
    help: "en-GB",
  },
];

/**
 * @param {string} dir
 */
function listJsonRel(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  /** @param {string} d @param {string} rel */
  function walk(d, rel = "") {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const r = rel ? `${rel}/${ent.name}` : ent.name;
      const abs = path.join(d, ent.name);
      if (ent.isDirectory()) walk(abs, r);
      else if (ent.name.endsWith(".json")) out.push(r.replace(/\\/g, "/"));
    }
  }
  walk(dir);
  return out.sort();
}

test("wave2 English countries registered with public paths", () => {
  for (const c of WAVE2) {
    const def = resolveLocaleDefinition(c.id);
    assert.equal(def.id, c.id);
    assert.equal(def.enabled, true);
    assert.equal(def.pathPrefix, c.prefix);
    assert.equal(def.label, c.label);
    assert.equal(def.nativeName, c.label);
    assert.equal(normalizeLocaleId(c.id), c.id);
    assert.equal(normalizeLocaleId(c.id.toLowerCase()), c.id);
    assert.deepEqual(getLocaleFallbackChain(c.id), c.fallback);
    assert.equal(getPublicLocalePathPrefix(c.id), c.prefix);
    assert.equal(resolveLocaleIdFromPathPrefix(c.prefix), c.id);
    assert.equal(withLocalePath(c.id, "/parents"), `/${c.prefix}/parents`);
  }
  assert.equal(resolveLocaleDefinition("en-WLS").fallbackLocale, "en-GB");
});

test("wave2 canonical redirects and reserved routes", () => {
  for (const c of WAVE2) {
    const fromInternal = stripLocaleFromPath(`/${c.id}/student/home`);
    assert.equal(fromInternal.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromInternal.pathSegment), true);
    assert.equal(withLocalePath(c.id, fromInternal.pathname), `/${c.prefix}/student/home`);

    const fromUpper = stripLocaleFromPath(`/${c.prefix.toUpperCase()}/parents`);
    assert.equal(fromUpper.locale, c.id);
    assert.equal(
      buildLocalizedHref(c.id, fromUpper.pathname, { search: "tab=1", hash: "top" }),
      `/${c.prefix}/parents?tab=1#top`
    );

    const publicParse = stripLocaleFromPath(`/${c.prefix}/help/parents`);
    assert.equal(publicParse.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, publicParse.pathSegment), false);
  }
  for (const seg of ["api", "dev", "app", "css", "img", "pdf", "uk"]) {
    assert.equal(resolveLocaleIdFromPathPrefix(seg), null, seg);
  }
  assert.equal(stripLocaleFromPath("/api/session").hadPrefix, false);
  assert.equal(stripLocaleFromPath("/eng/parents").locale, "en-GB");
  assert.equal(stripLocaleFromPath("/wls/parents").locale, "en-WLS");
});

test("selector adds Canada Singapore South Africa Wales; count 69", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 75);
  const byId = Object.fromEntries(locales.map((l) => [l.id, l]));
  for (const c of WAVE2) {
    assert.equal(byId[c.id].label, c.label);
    assert.equal(byId[c.id].nativeName, c.label);
    assert.notEqual(byId[c.id].label, c.id);
  }
  assert.ok(!locales.some((l) => /United Kingdom|Welsh|Wales-cy/i.test(l.label)));
  assert.ok(locales.some((l) => l.id === "en-CA" && l.label === "Canada-en"));
  assert.ok(locales.some((l) => l.id === "fr-CA" && l.label === "Canada-fr"));
  assert.ok(locales.some((l) => l.id === "en-WLS"));
});

test("wave2 namespace merge and Wales inherits en-GB", () => {
  resetLocaleBundleCache();
  const t = (loc) => {
    const b = loadLocaleBundles(loc);
    return (key) => lookupMessage(b, key) ?? key;
  };
  assert.equal(t("en-SG")("common.grade1"), "Primary 1");
  assert.equal(t("en-SG")("common.subjectMath"), "Maths");
  assert.equal(t("en-ZA")("common.subjectMath"), "Maths");
  assert.equal(t("en-CA")("ui.languageSwitcher.label") || t("en")("ui.languageSwitcher.label"), t("en")("ui.languageSwitcher.label"));
  // Wales has no overlays — British Year labels from en-GB.
  assert.equal(t("en-WLS")("common.grade1"), "Year 1");
  assert.equal(t("en-WLS")("common.grade1"), t("en-GB")("common.grade1"));
  assert.notEqual(t("en-WLS")("common.grade1"), t("en")("common.grade1"));
  assert.equal(t("en-WLS")("learning.chooseGrade"), t("en-GB")("learning.chooseGrade"));
});

test("wave2 school portal grade labels", () => {
  resetLocaleBundleCache();
  const t = (loc) => {
    const b = loadLocaleBundles(loc);
    return (key) => lookupMessage(b, key) ?? key;
  };
  for (const c of WAVE2) {
    const opts = getSchoolGradeOptions(t(c.id));
    assert.equal(opts[0].level, "1");
    assert.equal(opts[0].label, c.grade1, c.id);
    assert.equal(t(c.id)("learning.chooseGrade"), c.chooseGrade, c.id);
  }
});

test("wave2 content packs and Wales pack inheritance", () => {
  assert.ok(getCatalogPackExact("en-CA", "games/burn-down-index.json"));
  assert.ok(getCatalogPackExact("en-SG", "reports/burn-down-index.json"));
  assert.ok(getCatalogPackExact("en-ZA", "reports/burn-down-index.json"));
  assert.equal(getCatalogPackExact("en-WLS", "reports/burn-down-index.json"), null);

  const walesReports = loadMergedReportBurnDownIndex("en-WLS");
  const gbReports = loadMergedReportBurnDownIndex("en-GB");
  assert.equal(
    walesReports?.["components__parent-report-detailed-surface"]?.grade,
    gbReports?.["components__parent-report-detailed-surface"]?.grade
  );
  assert.equal(
    reportPackCopyForLocale("en-WLS", "utils__parent-report-language__parent-report-display-labels", "graded"),
    reportPackCopyForLocale("en-GB", "utils__parent-report-language__parent-report-display-labels", "graded")
  );

  const sgPack = loadContentPack("en-SG", "learning", "burn-down-index.json");
  assert.ok(sgPack && typeof sgPack === "object");
});

test("wave2 Help resolution", () => {
  for (const c of WAVE2) {
    assert.equal(resolveHelpLocale(c.id), c.help, c.id);
  }
  assert.equal(getHelpSections("en-CA").parents.title, getHelpSections("en").parents.title);
  assert.equal(listArticles("parents", "en-SG").length, listArticles("parents", "en").length);
  assert.equal(listArticles("parents", "en-ZA").length, listArticles("parents", "en").length);
  assert.equal(getHelpSections("en-WLS").parents.title, getHelpSections("en-GB").parents.title);
  assert.deepEqual(
    listArticles("parents", "en-WLS").map((a) => a.slug),
    listArticles("parents", "en-GB").map((a) => a.slug)
  );
});

test("wave2 word meanings fall back to English", () => {
  for (const c of WAVE2) {
    const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${c.id}.js`);
    assert.equal(fs.existsSync(meaningPath), false, c.id);
    const red = resolveEnglishWordMeaning("red", {
      listKey: "colors",
      instructionLocale: c.id,
    });
    const enRed = resolveEnglishWordMeaning("red", {
      listKey: "colors",
      instructionLocale: "en",
    });
    assert.equal(red, enRed, c.id);
  }
});

test("Wales is zero-content on disk", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "locales/en-WLS")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs/en-WLS")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/help-center/en-WLS")), false);
});

test("wave2 sparse contract vs authority base", () => {
  /** @type {Array<{ id: string, base: string }>} */
  const overlays = [
    { id: "en-CA", base: "en" },
    { id: "en-SG", base: "en" },
    { id: "en-ZA", base: "en" },
  ];
  for (const c of overlays) {
    const countryRoot = path.join(ROOT, "content-packs", c.id);
    const baseRoot = path.join(ROOT, "content-packs", c.base);
    const baseExists = (rel) => fs.existsSync(path.join(baseRoot, rel));
    /** @type {string[]} */
    const identicalOverrides = [];
    /** @type {string[]} */
    const nearFullCopies = [];
    /** @type {string[]} */
    const hebrewHits = [];

    for (const rel of listJsonRel(countryRoot)) {
      const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
      if (isBurnDownIndexPath(rel)) {
        const domain = rel.split("/")[0];
        const baseRel = `${domain}/burn-down-index.json`;
        if (!baseExists(baseRel)) continue;
        const base = JSON.parse(fs.readFileSync(path.join(baseRoot, baseRel), "utf8"));
        const indexAudit = auditBurnDownIndexOverlay(country, base, { countryRoot, domain });
        for (const [key, value] of indexAudit.countryLeaves) {
          if (HEBREW_RE.test(value)) hebrewHits.push(`${rel}:${key}`);
        }
        for (const key of indexAudit.identicalOverrides) identicalOverrides.push(`${rel}:${key}`);
        assert.deepEqual(indexAudit.orphanKeys, [], `${c.id} ${rel} orphan`);
        assert.deepEqual(indexAudit.placeholderMismatches, [], `${c.id} ${rel} placeholders`);
        continue;
      }
      const authority = resolveAuthorityPackPath(rel, baseExists);
      if (authority.kind === "missing" || !authority.baseRel) continue;
      const base = JSON.parse(fs.readFileSync(path.join(baseRoot, authority.baseRel), "utf8"));
      const countryLeaves = collectStringLeaves(country);
      const baseLeaves = collectStringLeaves(base);
      for (const [key, value] of countryLeaves) {
        if (typeof value === "string" && HEBREW_RE.test(value)) hebrewHits.push(`${rel}:${key}`);
        if (baseLeaves.has(key) && baseLeaves.get(key) === value) {
          identicalOverrides.push(`${rel}:${key}`);
        }
      }
      const assessment = assessNearFullCopy(countryLeaves, baseLeaves);
      if (assessment.isNearFullCopy) nearFullCopies.push(rel);
    }

    assert.deepEqual(identicalOverrides, [], `${c.id} identical`);
    assert.deepEqual(nearFullCopies, [], `${c.id} near-full`);
    assert.deepEqual(hebrewHits, [], `${c.id} hebrew`);
  }
});
