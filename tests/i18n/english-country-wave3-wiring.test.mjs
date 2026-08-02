/**
 * English country wave 3 wiring: Scotland / Northern Ireland / Philippines.
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

const WAVE3 = [
  {
    id: "en-SCT",
    prefix: "sct",
    label: "Scotland",
    fallback: ["en-SCT", "en-GB", "en"],
    grade1: "Primary 2",
    grade6: "Primary 7",
    chooseGrade: "Choose a primary year",
    help: "en-SCT",
    subjectMath: "Maths",
    centre: true,
  },
  {
    id: "en-NIR",
    prefix: "nir",
    label: "Northern Ireland",
    fallback: ["en-NIR", "en-GB", "en"],
    grade1: "Primary 2",
    grade6: "Primary 7",
    chooseGrade: "Choose a primary year",
    help: "en-NIR",
    subjectMath: "Maths",
    centre: true,
  },
  {
    id: "en-PH",
    prefix: "ph",
    label: "Philippines",
    fallback: ["en-PH", "en"],
    grade1: "Grade 1",
    grade6: "Grade 6",
    chooseGrade: "Choose a grade",
    help: "en",
    subjectMath: "Math",
    centre: false,
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

test("wave3 English countries registered with public paths", () => {
  for (const c of WAVE3) {
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
  assert.equal(resolveLocaleDefinition("en-SCT").fallbackLocale, "en-GB");
  assert.equal(resolveLocaleDefinition("en-NIR").fallbackLocale, "en-GB");
  assert.equal(resolveLocaleDefinition("en-PH").fallbackLocale, "en");
});

test("wave3 canonical redirects and reserved routes", () => {
  for (const c of WAVE3) {
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
  assert.equal(stripLocaleFromPath("/sct/parents").locale, "en-SCT");
  assert.equal(stripLocaleFromPath("/nir/parents").locale, "en-NIR");
  assert.equal(stripLocaleFromPath("/ph/parents").locale, "en-PH");
});

test("selector adds Scotland Northern Ireland Philippines; count 69", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 69);
  const byId = Object.fromEntries(locales.map((l) => [l.id, l]));
  for (const c of WAVE3) {
    assert.equal(byId[c.id].label, c.label);
    assert.equal(byId[c.id].nativeName, c.label);
    assert.notEqual(byId[c.id].label, c.id);
  }
  assert.ok(
    !locales.some((l) =>
      /United Kingdom|Scottish English|Northern Irish English|Philippine English|en-SCT|en-NIR|en-PH/i.test(
        l.label
      )
    )
  );
});

test("wave3 namespace merge and British inheritance", () => {
  resetLocaleBundleCache();
  const t = (loc) => {
    const b = loadLocaleBundles(loc);
    return (key) => lookupMessage(b, key) ?? key;
  };

  assert.equal(t("en-SCT")("common.grade1"), "Primary 2");
  assert.equal(t("en-SCT")("common.grade6"), "Primary 7");
  assert.equal(t("en-SCT")("common.subjectMath"), "Maths");
  assert.equal(t("en-SCT")("learning.chooseGrade"), "Choose a primary year");
  assert.match(t("en-SCT")("learning.geometry.reference.shapes.circle.desc"), /centre/i);
  assert.notEqual(t("en-SCT")("common.grade1"), t("en")("common.grade1"));
  assert.notEqual(t("en-SCT")("common.grade1"), t("en-GB")("common.grade1"));

  assert.equal(t("en-NIR")("common.grade1"), "Primary 2");
  assert.equal(t("en-NIR")("common.grade6"), "Primary 7");
  assert.equal(t("en-NIR")("common.subjectMath"), "Maths");
  assert.equal(t("en-NIR")("learning.chooseGrade"), "Choose a primary year");
  assert.match(t("en-NIR")("learning.geometry.reference.shapes.circle.desc"), /centre/i);

  assert.equal(t("en-PH")("common.grade1"), "Grade 1");
  assert.equal(t("en-PH")("common.grade6"), "Grade 6");
  assert.equal(t("en-PH")("common.subjectMath"), "Math");
  assert.equal(t("en-PH")("learning.chooseGrade"), "Choose a grade");
  assert.equal(t("en-PH")("teacher.fallback.defaultStudentName"), "Learner");
  // Missing namespaces inherit en (no British hop).
  assert.equal(t("en-PH")("common.grade1"), t("en")("common.grade1"));
});

test("wave3 school portal grade labels", () => {
  resetLocaleBundleCache();
  const t = (loc) => {
    const b = loadLocaleBundles(loc);
    return (key) => lookupMessage(b, key) ?? key;
  };
  for (const c of WAVE3) {
    const opts = getSchoolGradeOptions(t(c.id));
    assert.equal(opts.length, 6, c.id);
    assert.equal(opts[0].level, "1");
    assert.equal(opts[0].label, c.grade1, c.id);
    assert.equal(opts[5].label, c.grade6, c.id);
    assert.equal(t(c.id)("learning.chooseGrade"), c.chooseGrade, c.id);
    const labels = opts.map((o) => o.label).join("|");
    assert.ok(!/Primary 1\b/.test(labels), c.id);
    assert.ok(!/Year 8\b/.test(labels), c.id);
  }
});

test("wave3 content packs and reports", () => {
  assert.ok(getCatalogPackExact("en-SCT", "reports/burn-down-index.json"));
  assert.ok(getCatalogPackExact("en-NIR", "reports/burn-down-index.json"));
  assert.ok(getCatalogPackExact("en-SCT", "games/burn-down-index.json"));
  assert.ok(getCatalogPackExact("en-NIR", "learning/burn-down-index.json"));
  assert.equal(getCatalogPackExact("en-PH", "reports/burn-down-index.json"), null);

  const sctReports = loadMergedReportBurnDownIndex("en-SCT");
  const nirReports = loadMergedReportBurnDownIndex("en-NIR");
  const phReports = loadMergedReportBurnDownIndex("en-PH");
  const enReports = loadMergedReportBurnDownIndex("en");

  const sctText = JSON.stringify(sctReports);
  const nirText = JSON.stringify(nirReports);
  assert.match(sctText, /Primary 2/);
  assert.match(sctText, /Primary 7/);
  assert.doesNotMatch(sctText, /\bYear 1\b/);
  assert.doesNotMatch(sctText, /\bPrimary 1\b/);
  assert.doesNotMatch(sctText, /\bYear 8\b/);
  assert.match(nirText, /Primary 2/);
  assert.match(nirText, /Primary 7/);
  assert.doesNotMatch(nirText, /\bYear 1\b/);
  assert.doesNotMatch(nirText, /\bPrimary 1\b/);
  assert.doesNotMatch(nirText, /\bYear 8\b/);

  assert.equal(
    reportPackCopyForLocale("en-SCT", "components__parent-report-detailed-surface", "grade"),
    "Primary year"
  );
  assert.equal(
    reportPackCopyForLocale("en-NIR", "components__parent-report-detailed-surface", "grade"),
    "Primary year"
  );
  assert.equal(
    reportPackCopyForLocale("en-PH", "components__parent-report-detailed-surface", "grade"),
    reportPackCopyForLocale("en", "components__parent-report-detailed-surface", "grade")
  );
  assert.deepEqual(phReports, enReports);

  const sctBooks = loadContentPack("en-SCT", "books", "ui.json");
  assert.ok(sctBooks && typeof sctBooks === "object");
});

test("wave3 Help resolution", () => {
  for (const c of WAVE3) {
    assert.equal(resolveHelpLocale(c.id), c.help, c.id);
  }
  const sctParents = listArticles("parents", "en-SCT");
  const nirParents = listArticles("parents", "en-NIR");
  const phParents = listArticles("parents", "en-PH");
  const enParents = listArticles("parents", "en");
  assert.equal(sctParents.length, enParents.length);
  assert.equal(nirParents.length, enParents.length);
  assert.equal(phParents.length, enParents.length);

  const sctOverridden = sctParents.find((a) => /Primary 2/.test(JSON.stringify(a)));
  assert.ok(sctOverridden, "Scotland Help override sample");
  const nirOverridden = nirParents.find((a) => /Primary 2/.test(JSON.stringify(a)));
  assert.ok(nirOverridden, "Northern Ireland Help override sample");

  assert.equal(getHelpSections("en-PH").parents.title, getHelpSections("en").parents.title);
  assert.deepEqual(
    phParents.map((a) => a.slug),
    enParents.map((a) => a.slug)
  );
  assert.equal(fs.existsSync(path.join(ROOT, "data/help-center/en-PH")), false);
});

test("wave3 Help parent-report inherits England Maths chrome", () => {
  const gbReport = listArticles("parent-report", "en-GB");
  const sctReport = listArticles("parent-report", "en-SCT");
  const nirReport = listArticles("parent-report", "en-NIR");
  assert.deepEqual(
    sctReport.map((a) => a.slug),
    gbReport.map((a) => a.slug)
  );
  assert.deepEqual(
    nirReport.map((a) => a.slug),
    gbReport.map((a) => a.slug)
  );
  const gbBlob = JSON.stringify(gbReport);
  const sctBlob = JSON.stringify(sctReport);
  const nirBlob = JSON.stringify(nirReport);
  assert.match(gbBlob, /Maths/);
  assert.equal(sctBlob, gbBlob);
  assert.equal(nirBlob, gbBlob);
  assert.match(sctBlob, /Maths topics table/);
  assert.doesNotMatch(sctBlob, /Math topics table/);
});

test("wave3 word meanings fall back to English", () => {
  for (const c of WAVE3) {
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

test("Philippines has no content packs on disk", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs/en-PH")), false);
});

test("wave3 sparse contract vs authority base", () => {
  /** @type {Array<{ id: string, base: string }>} */
  const overlays = [
    { id: "en-SCT", base: "en-GB" },
    { id: "en-NIR", base: "en-GB" },
    { id: "en-PH", base: "en" },
  ];
  for (const c of overlays) {
    const countryRoot = path.join(ROOT, "content-packs", c.id);
    if (!fs.existsSync(countryRoot)) {
      assert.equal(c.id, "en-PH");
      continue;
    }
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

    assert.deepEqual(identicalOverrides, [], `${c.id} identical vs ${c.base}`);
    assert.deepEqual(nearFullCopies, [], `${c.id} near-full vs ${c.base}`);
    assert.deepEqual(hebrewHits, [], `${c.id} hebrew`);
  }
});
