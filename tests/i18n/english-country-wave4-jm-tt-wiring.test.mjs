/**
 * English country wave 4 wiring: Jamaica / Trinidad and Tobago / Bahamas / Guyana.
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
import { loadContentPack, resolveLearningBookDraftsDir } from "../../lib/content/locale.server.js";
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
import { getLocaleSelectorFlag } from "../../lib/i18n/locale-selector-flags.js";
import {
  buildSelectorCoverageMarkets,
  getLocaleCoverageGeoId,
} from "../../lib/i18n/locale-selector-coverage.js";
import {
  assessNearFullCopy,
  auditBurnDownIndexOverlay,
  collectStringLeaves,
  isBurnDownIndexPath,
  resolveAuthorityPackPath,
} from "../../lib/i18n/country-overlay-sparse-contract.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const HEBREW_RE = /[\u0590-\u05FF]/;
const WORLD = JSON.parse(
  fs.readFileSync(path.join(ROOT, "lib/i18n/data/world-countries.json"), "utf8")
);
const WORLD_IDS = new Set([
  ...WORLD.countries.map((c) => c.id),
  ...WORLD.markers.map((m) => m.id),
]);

const WAVE4 = [
  {
    id: "en-JM",
    prefix: "jm",
    label: "Jamaica",
    fallback: ["en-JM", "en"],
    grade1: "Grade 1",
    grade6: "Grade 6",
    chooseGrade: "Choose a grade",
    help: "en",
    subjectMath: "Maths",
    flag: "jm",
    geo: "JM",
    primarySchool: true,
  },
  {
    id: "en-TT",
    prefix: "tt",
    label: "Trinidad and Tobago",
    fallback: ["en-TT", "en"],
    grade1: "Infant 2",
    grade6: "Standard 5",
    chooseGrade: "Choose a primary level",
    help: "en",
    subjectMath: "Maths",
    flag: "tt",
    geo: "TT",
    primarySchool: false,
  },
  {
    id: "en-BS",
    prefix: "bs",
    label: "Bahamas",
    fallback: ["en-BS", "en"],
    grade1: "Grade 1",
    grade6: "Grade 6",
    chooseGrade: "Choose a grade",
    help: "en",
    subjectMath: "Maths",
    flag: "bs",
    geo: "BS",
    primarySchool: true,
    seoMarket: /Bahamas/i,
  },
  {
    id: "en-GY",
    prefix: "gy",
    label: "Guyana",
    fallback: ["en-GY", "en"],
    grade1: "Grade 1",
    grade6: "Grade 6",
    chooseGrade: "Choose a grade",
    help: "en",
    subjectMath: "Maths",
    flag: "gy",
    geo: "GY",
    primarySchool: true,
    seoMarket: /Guyana/i,
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

test("wave4 English countries registered with public paths", () => {
  for (const c of WAVE4) {
    const def = resolveLocaleDefinition(c.id);
    assert.equal(def.id, c.id);
    assert.equal(def.enabled, true);
    assert.equal(def.pathPrefix, c.prefix);
    assert.equal(def.label, c.label);
    assert.equal(def.nativeName, c.label);
    assert.equal(def.fallbackLocale, "en");
    assert.equal(def.direction, "ltr");
    assert.equal(normalizeLocaleId(c.id), c.id);
    assert.equal(normalizeLocaleId(c.id.toLowerCase()), c.id);
    assert.deepEqual(getLocaleFallbackChain(c.id), c.fallback);
    assert.equal(getPublicLocalePathPrefix(c.id), c.prefix);
    assert.equal(resolveLocaleIdFromPathPrefix(c.prefix), c.id);
    assert.equal(withLocalePath(c.id, "/parents"), `/${c.prefix}/parents`);
  }
});

test("wave4 canonical redirects and reserved routes", () => {
  for (const c of WAVE4) {
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
  assert.equal(stripLocaleFromPath("/jm/parents").locale, "en-JM");
  assert.equal(stripLocaleFromPath("/tt/parents").locale, "en-TT");
  assert.equal(stripLocaleFromPath("/bs/parents").locale, "en-BS");
  assert.equal(stripLocaleFromPath("/gy/parents").locale, "en-GY");
});

test("selector adds Jamaica Trinidad Bahamas Guyana; count 93", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 93);
  const byId = Object.fromEntries(locales.map((l) => [l.id, l]));
  for (const c of WAVE4) {
    assert.equal(byId[c.id].label, c.label);
    assert.equal(byId[c.id].nativeName, c.label);
    assert.notEqual(byId[c.id].label, c.id);
  }
  assert.ok(byId["en-WLS"]);
  assert.ok(byId["en-PH"]);
});

test("wave4 flags and coverage map geos", () => {
  const { markets, marketCount, byGeoId } = buildSelectorCoverageMarkets();
  assert.equal(getSelectableLocales().length, 93);
  assert.equal(marketCount, 83);
  assert.equal(markets.length, 83);

  for (const c of WAVE4) {
    assert.equal(getLocaleSelectorFlag(c.id)?.code, c.flag);
    assert.equal(getLocaleCoverageGeoId(c.id), c.geo);
    assert.ok(WORLD_IDS.has(c.geo), c.geo);
    assert.ok(byGeoId.has(c.geo), c.geo);
    assert.deepEqual(byGeoId.get(c.geo)?.localeIds, [c.id]);
  }
});

test("wave4 namespace merge: grades Maths SEO primary-school", () => {
  resetLocaleBundleCache();
  const t = (loc) => {
    const b = loadLocaleBundles(loc);
    return (key) => lookupMessage(b, key) ?? key;
  };

  assert.equal(t("en-JM")("common.grade1"), "Grade 1");
  assert.equal(t("en-JM")("common.grade6"), "Grade 6");
  assert.equal(t("en-JM")("common.subjectMath"), "Maths");
  assert.match(t("en-JM")("seo.homeTitle"), /Jamaica/i);
  assert.match(t("en-JM")("ui.home.subhead"), /primary school/i);
  assert.match(t("en-JM")("ui.nav.helpCenter"), /centre/i);

  assert.equal(t("en-TT")("common.grade1"), "Infant 2");
  assert.equal(t("en-TT")("common.grade2"), "Standard 1");
  assert.equal(t("en-TT")("common.grade3"), "Standard 2");
  assert.equal(t("en-TT")("common.grade4"), "Standard 3");
  assert.equal(t("en-TT")("common.grade5"), "Standard 4");
  assert.equal(t("en-TT")("common.grade6"), "Standard 5");
  assert.equal(t("en-TT")("learning.master.grades.g1"), "Infant 2");
  assert.equal(t("en-TT")("learning.master.grades.g6"), "Standard 5");
  assert.equal(t("en-TT")("common.subjectMath"), "Maths");
  assert.equal(t("en-TT")("learning.chooseGrade"), "Choose a primary level");
  assert.match(t("en-TT")("ui.public.about.intro1"), /Infant 2 through Standard 5/);
  assert.match(t("en-TT")("ui.public.about.intro1"), /primary level/);
  assert.doesNotMatch(t("en-TT")("ui.public.about.intro1"), /Infant 1/);
  assert.doesNotMatch(t("en-TT")("ui.public.about.intro1"), /top product level/i);
  assert.equal(
    t("en-TT")("worksheets.recommendationsHint"),
    "Suggestions are based on topics your child practised recently — not the parent report."
  );

  for (const id of ["en-BS", "en-GY"]) {
    assert.equal(t(id)("common.grade1"), "Grade 1");
    assert.equal(t(id)("common.grade6"), "Grade 6");
    assert.equal(t(id)("common.subjectMath"), "Maths");
    assert.equal(t(id)("learning.chooseGrade"), t("en")("learning.chooseGrade"));
    assert.match(t(id)("ui.home.subhead"), /primary school/i);
    assert.match(t(id)("ui.nav.helpCenter"), /centre/i);
    assert.match(t(id)("learning.hubBlurb"), /practising/i);
  }
  assert.match(t("en-BS")("seo.homeTitle"), /Bahamas/i);
  assert.match(t("en-GY")("seo.homeTitle"), /Guyana/i);
  assert.notEqual(t("en-BS")("seo.homeTitle"), t("en")("seo.homeTitle"));
  assert.notEqual(t("en-GY")("seo.homeTitle"), t("en")("seo.homeTitle"));
});

test("wave4 school portal grade labels", () => {
  resetLocaleBundleCache();
  const t = (loc) => {
    const b = loadLocaleBundles(loc);
    return (key) => lookupMessage(b, key) ?? key;
  };
  for (const c of WAVE4) {
    const opts = getSchoolGradeOptions(t(c.id));
    assert.equal(opts.length, 6, c.id);
    assert.equal(opts[0].level, "1");
    assert.equal(opts[0].label, c.grade1, c.id);
    assert.equal(opts[5].label, c.grade6, c.id);
    assert.equal(t(c.id)("learning.chooseGrade"), c.chooseGrade, c.id);
  }
  assert.deepEqual(
    getSchoolGradeOptions(t("en-TT")).map((o) => o.label),
    ["Infant 2", "Standard 1", "Standard 2", "Standard 3", "Standard 4", "Standard 5"]
  );
});

test("wave4 sparse content packs", () => {
  for (const c of WAVE4) {
    assert.equal(getCatalogPackExact(c.id, "reports/burn-down-index.json"), null);
    assert.equal(getCatalogPackExact(c.id, "learning/burn-down-index.json"), null);
    assert.ok(getCatalogPackExact(c.id, "global-burn-down/burn-down-index.json"));

    const reports = loadMergedReportBurnDownIndex(c.id);
    const enReports = loadMergedReportBurnDownIndex("en");
    assert.deepEqual(reports, enReports);

    assert.equal(
      reportPackCopyForLocale(c.id, "components__parent-report-detailed-surface", "grade"),
      reportPackCopyForLocale("en", "components__parent-report-detailed-surface", "grade")
    );

    const seo = loadContentPack(c.id, "global-burn-down", "lib__site__public-page-seo.json");
    assert.match(
      String(seo?.copy?.leo_kids_practice_for_elementary_learners || ""),
      c.seoMarket || new RegExp(c.label, "i")
    );
    assert.match(String(seo?.copy?.math_practice_by_grade_and_topic_leo_kids || ""), /Maths/);
  }
});

test("wave4 Help word meanings and Learning Books inherit English", () => {
  for (const c of WAVE4) {
    assert.equal(resolveHelpLocale(c.id), c.help, c.id);
    assert.equal(fs.existsSync(path.join(ROOT, `data/help-center/${c.id}`)), false, c.id);
    assert.equal(getHelpSections(c.id).parents.title, getHelpSections("en").parents.title);
    assert.deepEqual(
      listArticles("parents", c.id).map((a) => a.slug),
      listArticles("parents", "en").map((a) => a.slug)
    );

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

    for (const subject of ["math", "english", "science", "geometry"]) {
      const dir = resolveLearningBookDraftsDir(c.id, subject, "g1");
      const enDir = resolveLearningBookDraftsDir("en", subject, "g1");
      assert.ok(dir && enDir, `${c.id} ${subject}`);
      assert.equal(path.resolve(dir), path.resolve(enDir), `${c.id} ${subject}`);
    }
  }
});

test("wave4 Wales Philippines English Master regression", () => {
  assert.equal(resolveLocaleDefinition("en-WLS").pathPrefix, "wls");
  assert.equal(resolveLocaleDefinition("en-PH").pathPrefix, "ph");
  assert.equal(getCatalogPackExact("en-WLS", "global-burn-down/burn-down-index.json") != null, true);
  assert.equal(getCatalogPackExact("en-PH", "global-burn-down/burn-down-index.json") != null, true);
  resetLocaleBundleCache();
  assert.equal(lookupMessage(loadLocaleBundles("en"), "common.grade1"), "Grade 1");
  assert.equal(lookupMessage(loadLocaleBundles("en"), "common.subjectMath"), "Math");
});

test("wave4 no cross-country residue in product layers", () => {
  /** @type {Record<string, RegExp[]>} */
  const forbidden = {
    "en-JM": [/Trinidad/i, /Tobago/i, /Bahamas/i, /Guyana/i],
    "en-TT": [/Jamaica/i, /Bahamas/i, /Guyana/i],
    "en-BS": [/Jamaica/i, /Trinidad/i, /Tobago/i, /Guyana/i],
    "en-GY": [/Jamaica/i, /Trinidad/i, /Tobago/i, /Bahamas/i],
  };
  /** @type {string[]} */
  const hits = [];
  for (const [loc, pats] of Object.entries(forbidden)) {
    for (const root of [
      path.join(ROOT, "locales", loc),
      path.join(ROOT, "content-packs", loc),
    ]) {
      for (const rel of listJsonRel(root)) {
        const text = fs.readFileSync(path.join(root, rel), "utf8");
        for (const re of pats) {
          if (re.test(text)) hits.push(`${loc}/${rel}:${re}`);
        }
      }
    }
  }
  assert.deepEqual(hits, []);
});

test("wave4 sparse contract vs en authority", () => {
  for (const c of WAVE4) {
    const countryRoot = path.join(ROOT, "content-packs", c.id);
    assert.equal(fs.existsSync(countryRoot), true, c.id);
    const baseRoot = path.join(ROOT, "content-packs", "en");
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

    assert.deepEqual(identicalOverrides, [], `${c.id} identical vs en`);
    assert.deepEqual(nearFullCopies, [], `${c.id} near-full vs en`);
    assert.deepEqual(hebrewHits, [], `${c.id} hebrew`);
  }
});
