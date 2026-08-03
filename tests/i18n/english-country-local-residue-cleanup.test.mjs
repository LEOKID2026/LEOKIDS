/**
 * English-country local overlays: zero copied Israeli curriculum / report / reward residue.
 * Scans only the 13 en-* country locales (does not own shared global guards).
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deepMergeJson } from "../../lib/i18n/deep-merge.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const LOCALES = [
  "en-AU",
  "en-CM",
  "en-GB",
  "en-GH",
  "en-IE",
  "en-IN",
  "en-MU",
  "en-NG",
  "en-NIR",
  "en-NZ",
  "en-RW",
  "en-SCT",
  "en-SG",
];

const REC_SLUG = "utils__parent-report-language__grade-aware-recommendation-templates";
const CURRICULUM_SLUGS = [
  "utils__curriculum-audit__israeli-primary-curriculum-map",
  "utils__curriculum-audit__official-primary-curriculum-spine",
];

const FORBIDDEN_KEY_RE =
  /hasmonaean|hasmonean|hellenism|rome_judea|roman_judean|hebrew_|homeland|judaism|judea|moledet|israeli-primary|israeli_elementary|israel_elementary|achievement_hebrew|achievement_moledet|hist_sub_|maccabees|antiochus|bar[\s_-]?kokhba|\byavne\b|second[\s_-]?temple|great[\s_-]?revolt|official-primary-curriculum|\bname_he\b|\bdescription_he\b|HI-\d{2}/i;

const FORBIDDEN_DISPLAY_RE =
  /Hasmonaean|Hasmonean|Hellenism|Judea|Judah|Maccabees|Antiochus|Second Temple|Bar Kokhba|Yavne|Great Revolt|Hebrew Star|Homeland Explorer|Homeland Studies|Moledet|Hebrew vocabulary|Hebrew grammar|Israeli primary|Israel elementary|israeli-primary-curriculum/i;

const REWARD_FORBIDDEN_RE =
  /achievement_hebrew_star|achievement_moledet_explorer|Hebrew Star|Homeland Explorer|\bname_he\b|\bdescription_he\b|Moledet/i;

/** Representative en-base recommendation keys that must survive merge for active global subjects. */
const ACTIVE_GLOBAL_KEYS = {
  math: "do_not_provide_formal_factors_multiples_recommendations_for_grades_1_2",
  geometry: "keep_formal_perimeter_recommendations_null_for_grades_1_2",
  english: "this_week_focus_on_grade_3_4_english_sentence_structure_basic_word_order",
  science: "grade_3_4_evidence_source_grounding_for_animal_science_claims",
};

/**
 * @param {string} dir
 * @param {(abs: string) => boolean} pred
 * @returns {string[]}
 */
function walkFiles(dir, pred) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walkFiles(abs, pred));
    else if (pred(abs)) out.push(abs);
  }
  return out;
}

/**
 * @param {string} rel
 */
function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

/**
 * @param {string} locale
 * @returns {string[]}
 */
function localeRoots(locale) {
  return [
    path.join(ROOT, "content-packs", locale),
    path.join(ROOT, "locales", locale),
    path.join(ROOT, "data/help-center", locale),
  ];
}

/**
 * @param {unknown} node
 * @param {string} fileRel
 * @param {string[]} keyHits
 * @param {string[]} displayHits
 */
function scanNode(node, fileRel, keyHits, displayHits) {
  if (node == null) return;
  if (typeof node === "string") {
    if (FORBIDDEN_DISPLAY_RE.test(node) || FORBIDDEN_KEY_RE.test(node)) {
      displayHits.push(`${fileRel}::${node.slice(0, 80)}`);
    }
    return;
  }
  if (Array.isArray(node)) {
    for (const v of node) scanNode(v, fileRel, keyHits, displayHits);
    return;
  }
  if (typeof node !== "object") return;
  for (const [k, v] of Object.entries(/** @type {Record<string, unknown>} */ (node))) {
    if (FORBIDDEN_KEY_RE.test(k) || CURRICULUM_SLUGS.includes(k)) {
      keyHits.push(`${fileRel}::${k}`);
    }
    if (typeof v === "string" && (FORBIDDEN_DISPLAY_RE.test(v) || FORBIDDEN_KEY_RE.test(v))) {
      displayHits.push(`${fileRel}::${k}`);
    } else {
      scanNode(v, fileRel, keyHits, displayHits);
    }
  }
}

/**
 * @param {string} locale
 */
function loadRecLeafCopy(locale) {
  /** @type {Record<string, string>} */
  const copy = {};
  const burnDir = path.join(ROOT, "content-packs", locale, "reports/burn-down");
  if (!fs.existsSync(burnDir)) return copy;
  for (const name of fs.readdirSync(burnDir)) {
    if (!name.startsWith(REC_SLUG) || !name.endsWith(".json")) continue;
    const j = loadJson(path.relative(ROOT, path.join(burnDir, name)).replace(/\\/g, "/"));
    Object.assign(copy, j.copy || {});
  }
  return copy;
}

/**
 * @param {string} locale
 */
function mergedRecCopy(locale) {
  const basePath = path.join(
    ROOT,
    "content-packs/en/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
  );
  const base = fs.existsSync(basePath) ? loadJson(path.relative(ROOT, basePath).replace(/\\/g, "/")) : { copy: {} };
  const local = { copy: loadRecLeafCopy(locale) };
  return /** @type {{ copy: Record<string, string> }} */ (deepMergeJson(base, local));
}

describe("English-country local residue cleanup (13 locales)", () => {
  test("forbidden local key families and display strings are zero", () => {
    /** @type {string[]} */
    const keyHits = [];
    /** @type {string[]} */
    const displayHits = [];
    for (const locale of LOCALES) {
      for (const root of localeRoots(locale)) {
        for (const abs of walkFiles(root, (p) => /\.(json|js)$/.test(p))) {
          const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
          const text = fs.readFileSync(abs, "utf8");
          if (abs.endsWith(".json")) {
            try {
              scanNode(JSON.parse(text), rel, keyHits, displayHits);
            } catch {
              if (FORBIDDEN_KEY_RE.test(text) || FORBIDDEN_DISPLAY_RE.test(text)) {
                displayHits.push(rel);
              }
            }
          } else if (FORBIDDEN_KEY_RE.test(text) || FORBIDDEN_DISPLAY_RE.test(text)) {
            displayHits.push(rel);
          }
        }
      }
    }
    assert.deepEqual(keyHits, [], "forbidden local key families");
    assert.deepEqual(displayHits, [], "forbidden local display strings");
  });

  test("matching local report leaves and indexes are zero", () => {
    /** @type {string[]} */
    const leafHits = [];
    /** @type {string[]} */
    const indexHits = [];
    for (const locale of LOCALES) {
      const copy = loadRecLeafCopy(locale);
      for (const [k, v] of Object.entries(copy)) {
        if (FORBIDDEN_KEY_RE.test(`${k} ${v}`) || FORBIDDEN_DISPLAY_RE.test(String(v))) {
          leafHits.push(`${locale}.${k}`);
        }
      }
      const indexRel = `content-packs/${locale}/reports/burn-down-index.json`;
      const indexAbs = path.join(ROOT, indexRel);
      if (!fs.existsSync(indexAbs)) continue;
      const index = loadJson(indexRel);
      for (const [slug, slugCopy] of Object.entries(index)) {
        for (const [k, v] of Object.entries(slugCopy || {})) {
          if (
            FORBIDDEN_KEY_RE.test(`${slug} ${k} ${v}`) ||
            FORBIDDEN_DISPLAY_RE.test(String(v))
          ) {
            indexHits.push(`${locale}.${slug}.${k}`);
          }
        }
      }
    }
    assert.deepEqual(leafHits, [], "matching local report leaves");
    assert.deepEqual(indexHits, [], "matching local report indexes");
  });

  test("matching local reward catalog entries are zero", () => {
    /** @type {string[]} */
    const hits = [];
    for (const locale of LOCALES) {
      const rewardsDir = path.join(ROOT, "content-packs", locale, "rewards");
      for (const abs of walkFiles(rewardsDir, (p) => p.endsWith(".json"))) {
        const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
        const text = fs.readFileSync(abs, "utf8");
        if (REWARD_FORBIDDEN_RE.test(text)) hits.push(rel);
        try {
          const j = JSON.parse(text);
          const blob = JSON.stringify(j);
          if (REWARD_FORBIDDEN_RE.test(blob)) hits.push(`${rel}:parsed`);
        } catch {
          /* ignore */
        }
      }
      const rewardsLocale = path.join(ROOT, "locales", locale, "rewards.json");
      if (fs.existsSync(rewardsLocale)) {
        const text = fs.readFileSync(rewardsLocale, "utf8");
        if (REWARD_FORBIDDEN_RE.test(text)) {
          hits.push(path.relative(ROOT, rewardsLocale).replace(/\\/g, "/"));
        }
      }
    }
    assert.deepEqual(hits, [], "matching local reward catalog entries");
  });

  test("matching curriculum-map registrations are zero", () => {
    /** @type {string[]} */
    const hits = [];
    for (const locale of LOCALES) {
      const indexRel = `content-packs/${locale}/learning/burn-down-index.json`;
      const indexAbs = path.join(ROOT, indexRel);
      if (fs.existsSync(indexAbs)) {
        const index = loadJson(indexRel);
        for (const slug of CURRICULUM_SLUGS) {
          if (Object.prototype.hasOwnProperty.call(index, slug)) {
            hits.push(`${locale}:${slug}`);
          }
        }
      }
      const burn = path.join(ROOT, "content-packs", locale, "learning/burn-down");
      if (!fs.existsSync(burn)) continue;
      for (const name of fs.readdirSync(burn)) {
        if (
          name.includes("israeli-primary-curriculum-map") ||
          name.includes("official-primary-curriculum-spine")
        ) {
          hits.push(`${locale}:file:${name}`);
        }
      }
    }
    assert.deepEqual(hits, [], "matching curriculum-map registrations");
  });

  test("orphan recommendation index entries are zero", () => {
    /** @type {string[]} */
    const orphans = [];
    for (const locale of LOCALES) {
      const indexRel = `content-packs/${locale}/reports/burn-down-index.json`;
      const indexAbs = path.join(ROOT, indexRel);
      if (!fs.existsSync(indexAbs)) continue;
      const index = loadJson(indexRel);
      const leaf = loadRecLeafCopy(locale);
      const indexKeys = Object.keys(index[REC_SLUG] || {});
      const leafKeys = new Set(Object.keys(leaf));
      for (const k of indexKeys) {
        if (!leafKeys.has(k)) orphans.push(`${locale}:index-only:${k}`);
      }
      for (const k of leafKeys) {
        if (!(k in (index[REC_SLUG] || {}))) orphans.push(`${locale}:leaf-only:${k}`);
      }
    }
    assert.deepEqual(orphans, [], "orphan indexes");
  });

  test("no empty local JSON leftovers under recommendation / curriculum paths", () => {
    /** @type {string[]} */
    const empties = [];
    for (const locale of LOCALES) {
      for (const relDir of [
        `content-packs/${locale}/reports/burn-down`,
        `content-packs/${locale}/learning/burn-down`,
      ]) {
        const absDir = path.join(ROOT, relDir);
        for (const abs of walkFiles(absDir, (p) => p.endsWith(".json"))) {
          const j = JSON.parse(fs.readFileSync(abs, "utf8"));
          const keys = Object.keys(j || {});
          const empty =
            keys.length === 0 ||
            (keys.length === 1 && keys[0] === "copy" && Object.keys(j.copy || {}).length === 0);
          if (empty) empties.push(path.relative(ROOT, abs).replace(/\\/g, "/"));
        }
      }
    }
    assert.deepEqual(empties, [], "empty local files caused by cleanup");
  });

  test("merged runtime probe: local+en has zero Israeli residue; global subjects unaffected", () => {
    /** @type {string[]} */
    const mergedHits = [];
    let probesPassed = 0;
    let probesFailed = 0;

    for (const locale of LOCALES) {
      const merged = mergedRecCopy(locale);
      for (const [k, v] of Object.entries(merged.copy || {})) {
        if (FORBIDDEN_KEY_RE.test(`${k} ${v}`) || FORBIDDEN_DISPLAY_RE.test(String(v))) {
          mergedHits.push(`${locale}.${k}`);
        }
      }

      for (const [subject, key] of Object.entries(ACTIVE_GLOBAL_KEYS)) {
        const text = merged.copy?.[key];
        if (text && String(text).trim().length > 8) probesPassed += 1;
        else {
          probesFailed += 1;
          mergedHits.push(`${locale}:missing-global:${subject}:${key}`);
        }
      }

      const learnRel = `content-packs/${locale}/learning/burn-down-index.json`;
      if (fs.existsSync(path.join(ROOT, learnRel))) {
        const localLearn = loadJson(learnRel);
        const baseLearn = loadJson("content-packs/en/learning/burn-down-index.json");
        const mergedLearn = /** @type {Record<string, unknown>} */ (
          deepMergeJson(baseLearn, localLearn)
        );
        for (const slug of CURRICULUM_SLUGS) {
          if (mergedLearn[slug]) mergedHits.push(`${locale}:merged-learn:${slug}`);
        }
      }

      const rewardsDir = path.join(ROOT, "content-packs", locale, "rewards");
      const baseRewards = path.join(ROOT, "content-packs/en/rewards");
      for (const name of ["card-catalog.json", "ui.json"]) {
        const localAbs = path.join(rewardsDir, name);
        const baseAbs = path.join(baseRewards, name);
        if (!fs.existsSync(localAbs) && !fs.existsSync(baseAbs)) continue;
        const base = fs.existsSync(baseAbs) ? JSON.parse(fs.readFileSync(baseAbs, "utf8")) : {};
        const local = fs.existsSync(localAbs) ? JSON.parse(fs.readFileSync(localAbs, "utf8")) : {};
        const mergedRewards = deepMergeJson(base, local);
        if (REWARD_FORBIDDEN_RE.test(JSON.stringify(mergedRewards))) {
          mergedHits.push(`${locale}:merged-rewards:${name}`);
        }
      }
    }

    assert.deepEqual(mergedHits, [], "merged Israeli keys / recommendations / rewards");
    assert.equal(probesFailed, 0);
    assert.equal(probesPassed, LOCALES.length * Object.keys(ACTIVE_GLOBAL_KEYS).length);
  });
});
