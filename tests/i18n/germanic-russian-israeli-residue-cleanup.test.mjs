/**
 * Germanic + Russian layers: zero local Israeli history / Hebrew curriculum /
 * Homeland / Moledet residue; shared parent-narrative / curriculum-map / report cleanup.
 *
 * Avoid importing modules that transitively load lib/content/pack-catalog.js
 * (other agents may leave temporary broken country overlay imports).
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validateParentNarrativeSafety } from "../../utils/parent-narrative-safety/parent-narrative-safety-guard.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const LOCALES = ["de-AT", "de-DE", "nl-BE", "nl-NL", "ru-RU"];

const FORBIDDEN_KEY_RE =
  /hasmonaean|hellenism_jews|rome_jews|rome_judea|roman_judean|homelandGeography|homeland_studies|homeland_geography|homeland_and_geography|keep_homeland|achievement_hebrew_star|achievement_moledet_explorer|israeli-primary|official-primary-curriculum-spine|mixed_hebrew|formal_hebrew|advanced_hebrew|hebrew_writing|hebrew_sentence|hebrew_vocabulary|hebrew_grammar|developed_hebrew|higher_level_hebrew|hist_sub_|safe_hebrew_parent|mapped_from_hebrew|unknown_hebrew_topic|grade_6_hasmon|grade_6_hellen|grade_6_rome_judea|grade_6_roman_judean|moledet/i;

const FORBIDDEN_FILENAME_RE =
  /israeli-primary-curriculum-map|official-primary-curriculum-spine/i;

const TRANSLATED_RESIDUE_RES = [
  /\bHasmonaean\b/i,
  /\bHasmonean\b/i,
  /\bHellenism\b/i,
  /\bHellenistic\b/i,
  /\bHomeland Studies\b/i,
  /\bHomeland Explorer\b/i,
  /\bHebrew Star\b/i,
  /(?<![A-Za-z0-9])Moledet(?![A-Za-z0-9])/,
  /\bHasmonäer\b/i,
  /\bHasmonäisch\b/i,
  /\bHellenismus\b/i,
  /\bhellenistisch\b/i,
  /\bHeimatkunde\b/i,
  /\bisraelischer Lehrplan\b/i,
  /\bHebräisch(?:er|e|en)?\b/,
  /\bHasmoneeën\b/i,
  /\bHasmonees\b/i,
  /\bhellenisme\b/i,
  /\bheemkunde\b/i,
  /\bHebreeuws(?:e)?\b/i,
  /\bIsraëlisch curriculum\b/i,
  /\bХасмонеи\b/i,
  /\bэллинизм\b/i,
  /\bэллинистический\b/i,
  /\bродиноведение\b/i,
  /\bизраильская учебная\b/i,
  /\bЗвезда иврита\b/i,
  /(?<![А-Яа-яЁёA-Za-z])иврит(?![А-Яа-яЁёA-Za-z])/i,
];

function walkJson(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function collectEntries(obj, prefix = "", out = []) {
  if (obj == null || typeof obj !== "object") return out;
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => collectEntries(v, `${prefix}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    out.push({ path: p, key: k, value: typeof v === "string" ? v : undefined });
    collectEntries(v, p, out);
  }
  return out;
}

function translatedHits(text) {
  const src = String(text || "");
  return TRANSLATED_RESIDUE_RES.filter((re) => re.test(src)).map((re) => re.source);
}

function auditLocale(loc) {
  /** @type {string[]} */
  const bad = [];
  for (const base of ["content-packs", "locales", "data/help-center"]) {
    const root = path.join(ROOT, base, loc);
    for (const file of walkJson(root)) {
      const rel = path.relative(ROOT, file).replace(/\\/g, "/");
      if (FORBIDDEN_FILENAME_RE.test(path.basename(file))) {
        bad.push(`filename:${rel}`);
        continue;
      }
      let json;
      try {
        json = JSON.parse(fs.readFileSync(file, "utf8"));
      } catch {
        continue;
      }
      if (
        json &&
        typeof json === "object" &&
        !Array.isArray(json) &&
        Object.keys(json).length === 0 &&
        /burn-down-index|israeli|homeland|hasmon|hellen|moledet|curriculum-spine/i.test(rel)
      ) {
        bad.push(`empty:${rel}`);
        continue;
      }
      for (const e of collectEntries(json)) {
        if (FORBIDDEN_KEY_RE.test(e.key)) bad.push(`key:${rel}:${e.path}`);
        if (typeof e.value === "string") {
          const hits = translatedHits(e.value);
          if (hits.length) bad.push(`value:${rel}:${e.path}:${hits[0]}`);
        }
      }
    }
  }
  return bad;
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function countProductionImportsOfIsraeliMap() {
  const roots = ["utils", "lib", "pages", "components", "hooks"];
  /** @type {string[]} */
  const hits = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === "node_modules" || ent.name === ".git") continue;
        walk(p);
        continue;
      }
      if (!/\.(js|mjs|cjs|ts|tsx)$/.test(ent.name)) continue;
      const raw = fs.readFileSync(p, "utf8");
      if (/israeli-primary-curriculum-map/.test(raw)) {
        hits.push(path.relative(ROOT, p).replace(/\\/g, "/"));
      }
    }
  }
  for (const r of roots) walk(path.join(ROOT, r));
  return hits;
}

describe("Germanic/Russian locales — Israeli residue cleanup", () => {
  for (const loc of LOCALES) {
    test(`${loc}: forbidden key families, translated residue, empty files = 0`, () => {
      const bad = auditLocale(loc);
      assert.deepEqual(bad, [], bad.slice(0, 25).join("\n"));
    });

    test(`${loc}: no israeli curriculum-map leaf / index registration`, () => {
      assert.equal(
        exists(
          `content-packs/${loc}/learning/burn-down/utils__curriculum-audit__israeli-primary-curriculum-map.json`
        ),
        false
      );
      assert.equal(
        exists(
          `content-packs/${loc}/learning/burn-down/utils__curriculum-audit__official-primary-curriculum-spine.json`
        ),
        false
      );
      const learnIdxPath = path.join(ROOT, `content-packs/${loc}/learning/burn-down-index.json`);
      if (fs.existsSync(learnIdxPath)) {
        const index = loadJson(`content-packs/${loc}/learning/burn-down-index.json`);
        assert.equal(
          Object.prototype.hasOwnProperty.call(
            index,
            "utils__curriculum-audit__israeli-primary-curriculum-map"
          ),
          false
        );
        assert.equal(
          Object.prototype.hasOwnProperty.call(
            index,
            "utils__curriculum-audit__official-primary-curriculum-spine"
          ),
          false
        );
      }
    });

    test(`${loc}: no Hebrew Star / Homeland Explorer reward entries`, () => {
      const catalogPath = path.join(ROOT, `content-packs/${loc}/rewards/card-catalog.json`);
      if (!fs.existsSync(catalogPath)) return;
      const catalog = loadJson(`content-packs/${loc}/rewards/card-catalog.json`);
      const cards = catalog.cards || catalog;
      assert.equal(cards.achievement_hebrew_star, undefined);
      assert.equal(cards.achievement_moledet_explorer, undefined);
    });

    test(`${loc}: grade-aware leaf/index orphan keys = 0`, () => {
      const indexPath = `content-packs/${loc}/reports/burn-down-index.json`;
      const leafPath =
        `content-packs/${loc}/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json`;
      if (!exists(indexPath) || !exists(leafPath)) return;
      const index = loadJson(indexPath);
      const leaf = loadJson(leafPath);
      const slug = "utils__parent-report-language__grade-aware-recommendation-templates";
      const indexKeys = new Set(Object.keys(index[slug] || {}));
      const leafKeys = new Set(Object.keys(leaf.copy || leaf));
      const onlyIndex = [...indexKeys].filter((k) => !leafKeys.has(k));
      const onlyLeaf = [...leafKeys].filter((k) => !indexKeys.has(k));
      assert.deepEqual(onlyIndex, []);
      assert.deepEqual(onlyLeaf, []);
    });
  }
});

describe("Shared — parent narrative locale default", () => {
  test("missing locale → en", () => {
    const r = validateParentNarrativeSafety({
      narrativeText: "Keep practicing math facts this week.",
    });
    assert.equal(r.locale, "en");
  });

  test("empty locale falls back to context then en", () => {
    const empty = validateParentNarrativeSafety({
      narrativeText: "Keep practicing math facts this week.",
      locale: "",
    });
    assert.equal(empty.locale, "en");
    const fromCtx = validateParentNarrativeSafety({
      narrativeText: "Keep practicing math facts this week.",
      reportContext: { locale: "de-DE" },
    });
    assert.equal(fromCtx.locale, "de-DE");
  });

  test("explicit he locale preserved", () => {
    const r = validateParentNarrativeSafety({
      narrativeText: "Keep practicing math facts this week.",
      locale: "he",
    });
    assert.equal(r.locale, "he");
  });

  test("explicit other locale preserved", () => {
    const r = validateParentNarrativeSafety({
      narrativeText: "Keep practicing math facts this week.",
      locale: "nl-NL",
    });
    assert.equal(r.locale, "nl-NL");
  });
});

describe("Shared — Israeli curriculum-map production absence", () => {
  test("israeli-primary-curriculum-map.js file absent", () => {
    assert.equal(exists("utils/curriculum-audit/israeli-primary-curriculum-map.js"), false);
  });

  test("production import count of israeli-primary-curriculum-map = 0", () => {
    assert.deepEqual(countProductionImportsOfIsraeliMap(), []);
  });

  test("curriculum-map lookup source returns null (always-null helper)", () => {
    const src = fs.readFileSync(
      path.join(ROOT, "utils/curriculum-audit/official-primary-curriculum-spine.js"),
      "utf8"
    );
    assert.match(src, /export function findTopicPlacement\s*\(/);
    assert.match(src, /export function findTopicPlacement\(\)\s*\{\s*return null;\s*\}/);
  });
});

describe("Shared — moledetKeys/hebrewKeys removed from global aggregation", () => {
  test("moledetKeys/hebrewKeys absent from parent-report-v2 source", () => {
    const src = fs.readFileSync(path.join(ROOT, "utils/parent-report-v2.js"), "utf8");
    assert.equal(/moledetKeys/.test(src), false);
    assert.equal(/hebrewKeys/.test(src), false);
    assert.equal(/hebrewTopics/.test(src), false);
    assert.equal(/moledetGeographyTopics/.test(src), false);
  });

  test("active global subjects remain in V2 order and English authority templates", () => {
    const src = fs.readFileSync(path.join(ROOT, "utils/parent-report-v2.js"), "utf8");
    assert.match(
      src,
      /V2_SUBJECT_ORDER\s*=\s*\[[^\]]*math[^\]]*geometry[^\]]*english[^\]]*science/
    );
    const enLeaf = loadJson(
      "content-packs/en/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
    );
    const copy = enLeaf.copy || {};
    const keys = Object.keys(copy);
    assert.ok(keys.some((k) => /factors|ratio|order_of_operations|prime_composite/i.test(k)));
    assert.ok(keys.some((k) => /perimeter|area|volume|pythagoras|diagonal/i.test(k)));
    assert.ok(keys.some((k) => /english|vocabulary|sentence_structure/i.test(k)));
    assert.ok(keys.some((k) => /science|animal|experiment|graph/i.test(k)));
    assert.equal(keys.some((k) => /hasmonaean|moledet|hebrew_star|homeland/i.test(k)), false);
  });
});
