/**
 * English country wave wiring: AU / NZ / IE / England.
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
import {
  ENGLISH_COUNTRY_BURN_DOWN_AUTHORITY,
  getCatalogPackExact,
} from "../../lib/content/pack-catalog.js";
import {
  loadMergedReportBurnDownIndex,
  reportPackCopyForLocale,
} from "../../lib/reports/report-pack-copy.js";
import {
  resolveHelpLocale,
  listArticles,
  getHelpSections,
  ALL_ARTICLES,
} from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import {
  assessNearFullCopy,
  auditBurnDownIndexOverlay,
  collectStringLeaves,
  isBurnDownIndexPath,
  resolveAuthorityPackPath,
} from "../../lib/i18n/country-overlay-sparse-contract.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const HEBREW_RE = /[\u0590-\u05FF]/;

const COUNTRIES = [
  {
    id: "en-AU",
    prefix: "au",
    label: "Australia",
    grade1: "Year 1",
    grade6: "Year 6",
    reportGrade: "Year",
  },
  {
    id: "en-NZ",
    prefix: "nz",
    label: "New Zealand",
    grade1: "Year 1",
    grade6: "Year 6",
    reportGrade: "Year",
  },
  {
    id: "en-IE",
    prefix: "ie",
    label: "Ireland",
    grade1: "First Class",
    grade6: "Sixth Class",
    reportGrade: "Class",
  },
  {
    id: "en-GB",
    prefix: "eng",
    label: "England",
    grade1: "Year 1",
    grade6: "Year 6",
    reportGrade: "Year",
  },
];

test("English countries registered with public paths and en fallback", () => {
  for (const c of COUNTRIES) {
    const def = resolveLocaleDefinition(c.id);
    assert.equal(def.id, c.id);
    assert.equal(def.enabled, true);
    assert.equal(def.fallbackLocale, "en");
    assert.equal(def.pathPrefix, c.prefix);
    assert.equal(def.label, c.label);
    assert.equal(def.nativeName, c.label);
    assert.equal(normalizeLocaleId(c.id), c.id);
    assert.equal(normalizeLocaleId(c.id.toLowerCase()), c.id);
    assert.deepEqual(getLocaleFallbackChain(c.id), [c.id, "en"]);
    assert.equal(getPublicLocalePathPrefix(c.id), c.prefix);
    assert.equal(resolveLocaleIdFromPathPrefix(c.prefix), c.id);
    assert.equal(withLocalePath(c.id, "/parents"), `/${c.prefix}/parents`);
  }
});

test("English country canonical redirects preserve deep paths and query", () => {
  for (const c of COUNTRIES) {
    const fromInternal = stripLocaleFromPath(`/${c.id}/student/home`);
    assert.equal(fromInternal.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromInternal.pathSegment), true);
    assert.equal(withLocalePath(c.id, fromInternal.pathname), `/${c.prefix}/student/home`);

    const fromUpper = stripLocaleFromPath(`/${c.prefix.toUpperCase()}/parents`);
    assert.equal(fromUpper.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromUpper.pathSegment), true);
    assert.equal(
      buildLocalizedHref(c.id, fromUpper.pathname, { search: "tab=1", hash: "top" }),
      `/${c.prefix}/parents?tab=1#top`
    );

    const publicParse = stripLocaleFromPath(`/${c.prefix}/help/parents`);
    assert.equal(publicParse.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, publicParse.pathSegment), false);
  }
  assert.equal(stripLocaleFromPath("/api/session").hadPrefix, false);
  assert.equal(resolveLocaleIdFromPathPrefix("uk"), null);
});

test("selector includes Australia New Zealand Ireland England among 33 locales", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 33);
  const byId = Object.fromEntries(locales.map((l) => [l.id, l]));
  for (const c of COUNTRIES) {
    assert.equal(byId[c.id].label, c.label);
    assert.equal(byId[c.id].nativeName, c.label);
    assert.notEqual(byId[c.id].label, c.id);
  }
  assert.ok(locales.some((l) => l.id === "en-AU"));
  assert.ok(locales.some((l) => l.id === "en-NZ"));
  assert.ok(locales.some((l) => l.id === "en-IE"));
  assert.ok(locales.some((l) => l.id === "en-GB"));
  assert.ok(!locales.some((l) => /United Kingdom|British English|Australian English/i.test(l.label)));
});

test("namespace deep merge: country overlays + en inheritance", () => {
  resetLocaleBundleCache();
  for (const c of COUNTRIES) {
    const bundles = loadLocaleBundles(c.id);
    assert.equal(lookupMessage(bundles, "common.grade1"), c.grade1, c.id);
    assert.equal(lookupMessage(bundles, "common.grade6"), c.grade6, c.id);
    const inherited = lookupMessage(bundles, "ui.languageSwitcher.label");
    assert.ok(typeof inherited === "string" && inherited.length > 0, c.id);
    const enOnly = lookupMessage(bundles, "ui.nav.home");
    assert.ok(typeof enOnly === "string" && enOnly.length > 0, c.id);
  }
});

test("content packs and reports merge onto en without replacing whole packs", () => {
  for (const c of COUNTRIES) {
    const books = loadContentPack(c.id, "books", "ui.json");
    assert.ok(books && typeof books === "object", c.id);
    const reports = getCatalogPackExact(c.id, "reports/burn-down-index.json");
    assert.ok(reports && typeof reports === "object", c.id);
    const merged = loadMergedReportBurnDownIndex(c.id);
    assert.equal(
      merged?.["components__parent-report-detailed-surface"]?.grade,
      c.reportGrade,
      c.id
    );
  }
  // Ireland incomplete on-disk reports index must not win over composed leaves.
  const ieReports = getCatalogPackExact("en-IE", "reports/burn-down-index.json");
  assert.ok(
    ieReports["utils__parent-report-language__grade-aware-recommendation-templates"]
  );
  assert.ok(ieReports["utils__parent-report-out-of-grade-transparency"]);
});

test("Help overlays inherit English article IDs/slugs", () => {
  const enKeys = new Set(ALL_ARTICLES.map((a) => `${a.section}/${a.slug}`));
  for (const c of COUNTRIES) {
    assert.equal(resolveHelpLocale(c.id), c.id);
    assert.equal(getHelpSections(c.id).parents.title, "Guide for parents");
    const parents = listArticles("parents", c.id);
    assert.equal(parents.length, listArticles("parents", "en").length);
    for (const a of parents) {
      assert.ok(enKeys.has(`${a.section}/${a.slug}`), `${c.id}:${a.slug}`);
    }
  }
  assert.equal(resolveHelpLocale("es-419"), "es-419");
  assert.equal(resolveHelpLocale("es-ES"), "es-ES");
  assert.equal(resolveHelpLocale("es-MX"), "es-419");
});

test("word meanings fall back to English (no country overlay files)", () => {
  for (const c of COUNTRIES) {
    const meaningPath = path.join(
      ROOT,
      "data/english-questions/word-meanings",
      `${c.id}.js`
    );
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

test("LanguageSwitcher scroll contract preserved in source", () => {
  const switcher = fs.readFileSync(
    path.join(ROOT, "components/i18n/LanguageSwitcher.jsx"),
    "utf8"
  );
  assert.match(switcher, /max-h-\[min\(70vh,520px\)\]/);
  assert.match(switcher, /overflow-y-auto/);
  assert.match(switcher, /overflow-x-hidden/);
  assert.match(switcher, /overscroll-contain/);
});

/**
 * @param {string} dir
 * @returns {string[]}
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

test("English country sparse contract vs en: no identical overrides / near-full copies", () => {
  for (const c of COUNTRIES) {
    const countryRoot = path.join(ROOT, "content-packs", c.id);
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
        assert.deepEqual(indexAudit.orphanKeys, [], `${c.id} ${rel} orphan index keys`);
        assert.deepEqual(
          indexAudit.placeholderMismatches,
          [],
          `${c.id} ${rel} placeholder mismatches`
        );
        continue;
      }

      const authority = resolveAuthorityPackPath(rel, baseExists);
      if (authority.kind === "missing" || !authority.baseRel) continue;
      const base = JSON.parse(fs.readFileSync(path.join(baseRoot, authority.baseRel), "utf8"));
      const countryLeaves = collectStringLeaves(country);
      const baseLeaves = collectStringLeaves(base);
      for (const [key, value] of countryLeaves) {
        if (typeof value === "string" && HEBREW_RE.test(value)) {
          hebrewHits.push(`${rel}:${key}`);
        }
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

test("Spanish help resolveHelpLocale unchanged by English country wiring", () => {
  assert.equal(resolveHelpLocale("es-419"), "es-419");
  assert.equal(resolveHelpLocale("es-MX"), "es-419");
  assert.equal(resolveHelpLocale("es-ES"), "es-ES");
  assert.equal(resolveHelpLocale("pt-BR"), "pt-BR");
  assert.equal(resolveHelpLocale("en"), "en");
});

/**
 * Companion leaf packs for a burn-down domain (burn-down/ + domain-root slug files).
 * @param {string} countryRoot
 * @param {string} domain
 */
function loadCompanionBurnDownLeaves(countryRoot, domain) {
  /** @type {Record<string, Record<string, string>>} */
  const out = {};
  const leafCopy = (pack) => {
    if (pack && typeof pack === "object" && pack.copy && typeof pack.copy === "object") {
      return /** @type {Record<string, string>} */ (pack.copy);
    }
    return /** @type {Record<string, string>} */ (pack || {});
  };
  const burnDir = path.join(countryRoot, domain, "burn-down");
  if (fs.existsSync(burnDir)) {
    /** @type {Record<string, string>} */
    const gradeAware = {};
    for (const f of fs.readdirSync(burnDir).filter((x) => x.endsWith(".json"))) {
      const pack = JSON.parse(fs.readFileSync(path.join(burnDir, f), "utf8"));
      if (f.includes("grade-aware-recommendation-templates__")) {
        Object.assign(gradeAware, leafCopy(pack));
        continue;
      }
      out[f.slice(0, -".json".length)] = leafCopy(pack);
    }
    if (Object.keys(gradeAware).length) {
      out["utils__parent-report-language__grade-aware-recommendation-templates"] = gradeAware;
    }
  }
  const domainRoot = path.join(countryRoot, domain);
  if (fs.existsSync(domainRoot)) {
    for (const f of fs.readdirSync(domainRoot).filter((x) => x.endsWith(".json") && x !== "burn-down-index.json")) {
      const slug = f.slice(0, -".json".length);
      out[slug] = leafCopy(JSON.parse(fs.readFileSync(path.join(domainRoot, f), "utf8")));
    }
  }
  return out;
}

test("English country burn-down authority: single source, no stale mirrors", () => {
  const domains = ["learning", "reports", "games", "global-burn-down"];
  let conflicts = 0;
  let stale = 0;

  for (const [locale, byDomain] of Object.entries(ENGLISH_COUNTRY_BURN_DOWN_AUTHORITY)) {
    const countryRoot = path.join(ROOT, "content-packs", locale);
    for (const domain of domains) {
      const mode = byDomain[domain];
      assert.ok(mode === "index" || mode === "composed-leaves", `${locale}/${domain}`);
      const catalog = getCatalogPackExact(locale, `${domain}/burn-down-index.json`) || {};
      const indexPath = path.join(countryRoot, domain, "burn-down-index.json");
      const hasIndex = fs.existsSync(indexPath);
      const diskIndex = hasIndex ? JSON.parse(fs.readFileSync(indexPath, "utf8")) : null;
      const companions = loadCompanionBurnDownLeaves(countryRoot, domain);

      if (mode === "index") {
        assert.equal(hasIndex, true, `${locale}/${domain} index authority requires on-disk index`);
        assert.deepEqual(
          diskIndex,
          catalog,
          `${locale}/${domain} on-disk index must equal catalog (index authority)`
        );
        for (const slug of Object.keys(companions)) {
          if (!catalog[slug]) continue;
          for (const key of Object.keys(companions[slug])) {
            if (catalog[slug][key] !== companions[slug][key]) {
              conflicts += 1;
              stale += 1;
            }
          }
        }
      } else {
        // composed-leaves: catalog is composed from leaf imports; disk index optional mirror
        if (hasIndex) {
          assert.deepEqual(
            diskIndex,
            catalog,
            `${locale}/${domain} on-disk index must mirror composed catalog`
          );
        }
        for (const slug of Object.keys(catalog)) {
          // Every catalog slug should have companion leaf material except when fragments merge.
          const hasLeaf =
            Boolean(companions[slug]) ||
            (slug === "utils__parent-report-language__grade-aware-recommendation-templates" &&
              fs.existsSync(path.join(countryRoot, domain, "burn-down")));
          assert.equal(hasLeaf, true, `${locale}/${domain} composed slug missing leaves: ${slug}`);
        }
      }
    }
  }

  assert.equal(conflicts, 0, "duplicate authority conflict");
  assert.equal(stale, 0, "stale authority artifacts");
});

test("NZ learning index-only curriculum records load at runtime", () => {
  const indexOnly = [
    "utils__curriculum-audit__israeli-primary-curriculum-map",
    "utils__curriculum-audit__official-primary-curriculum-spine",
  ];
  assert.equal(ENGLISH_COUNTRY_BURN_DOWN_AUTHORITY["en-NZ"].learning, "index");
  const catalog = getCatalogPackExact("en-NZ", "learning/burn-down-index.json");
  const loaded = loadContentPack("en-NZ", "learning", "burn-down-index.json");
  const burnDir = path.join(ROOT, "content-packs/en-NZ/learning/burn-down");
  for (const slug of indexOnly) {
    assert.ok(catalog?.[slug], `catalog missing ${slug}`);
    assert.ok(loaded?.[slug], `runtime missing ${slug}`);
    assert.equal(
      fs.existsSync(path.join(burnDir, `${slug}.json`)),
      false,
      `${slug} must remain index-only (no duplicate leaf)`
    );
  }
  assert.match(
    String(loaded?.[indexOnly[0]]?.israel_elementary_grades_1_6_conservative_structured_mapping_advisory_so || ""),
    /years 1–6/i
  );
  assert.match(
    String(loaded?.[indexOnly[1]]?.israeli_elementary_grades_1_6_source_anchored_planning_spine_not_syllabu || ""),
    /years 1–6/i
  );
});

test("Australia By year mode label accepted in parent-report mode column", () => {
  // Short mode label beside Practice / Mistakes / Learning — not a standalone heading.
  const au = reportPackCopyForLocale(
    "en-AU",
    "utils__parent-report-language__parent-report-display-labels",
    "graded"
  );
  assert.equal(au, "By year");
  const en = reportPackCopyForLocale(
    "en",
    "utils__parent-report-language__parent-report-display-labels",
    "graded"
  );
  assert.equal(en, "Graded");
});

test("England keeps product term student (no pupil overlay)", () => {
  const gbRoot = path.join(ROOT, "content-packs/en-GB");
  const gbLocales = path.join(ROOT, "locales/en-GB");
  let pupilHits = 0;
  for (const root of [gbRoot, gbLocales]) {
    for (const rel of listJsonRel(root)) {
      const s = fs.readFileSync(path.join(root, rel), "utf8");
      const m = s.match(/\bpupil\b/gi);
      if (m) pupilHits += m.length;
    }
  }
  assert.equal(pupilHits, 0);
  // Inherited English product vocabulary uses student.
  resetLocaleBundleCache();
  const en = loadLocaleBundles("en");
  const gb = loadLocaleBundles("en-GB");
  assert.match(String(lookupMessage(en, "ui.nav.home") || "home"), /./);
  assert.equal(lookupMessage(gb, "common.grade1"), "Year 1");
});

test("England and New Zealand reward holiday titles use Holidays plural", () => {
  for (const loc of ["en-GB", "en-NZ"]) {
    const pack = getCatalogPackExact(loc, "rewards/card-catalog.json");
    assert.equal(pack?.cards?.event_summer_vacation?.title, "Leo Summer Holidays", loc);
    assert.equal(pack?.cards?.event_winter_vacation?.title, "Leo Winter Holidays", loc);
    assert.match(pack?.cards?.event_summer_vacation?.description || "", /Summer Holidays/);
    assert.match(pack?.cards?.event_winter_vacation?.description || "", /Winter Holidays/);
  }
});
