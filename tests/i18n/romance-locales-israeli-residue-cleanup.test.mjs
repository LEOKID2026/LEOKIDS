/**
 * Romance-language country layers: zero local Israeli history / Hebrew curriculum /
 * Homeland / Moledet residue across 17 locales.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const LOCALES = [
  "es-419",
  "es-AR",
  "es-ES",
  "fr-BE",
  "fr-BJ",
  "fr-CA",
  "fr-CD",
  "fr-CH",
  "fr-CI",
  "fr-FR",
  "fr-SN",
  "it-CH",
  "it-IT",
  "pt-AO",
  "pt-BR",
  "pt-MZ",
  "pt-PT",
];

const FAMILIES = {
  Spanish: ["es-419", "es-AR", "es-ES"],
  French: ["fr-BE", "fr-BJ", "fr-CA", "fr-CD", "fr-CH", "fr-CI", "fr-FR", "fr-SN"],
  Italian: ["it-CH", "it-IT"],
  Portuguese: ["pt-AO", "pt-BR", "pt-MZ", "pt-PT"],
};

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
  /\basmoneo\b/i,
  /\basmoneos\b/i,
  /\bhelenismo\b/i,
  /\bhelenístico\b/i,
  /\bestudios de la patria\b/i,
  /\bcurrículo israelí\b/i,
  /\bEstrella del hebreo\b/i,
  /\bExplorador de la patria\b/i,
  /\bhellénisme\b/i,
  /\bhellénistique\b/i,
  /\bHasmonéen\b/i,
  /\bHasmonéens\b/i,
  /\bétudes de la patrie\b/i,
  /\bprogramme israélien\b/i,
  /\bétoile hébraïque\b/i,
  /\bÉtoile hébraïque\b/i,
  /\bellenismo\b/i,
  /\bellenistico\b/i,
  /\bAsmoneo\b/i,
  /\bAsmonei\b/i,
  /\bstudi della patria\b/i,
  /\bcurricolo israeliano\b/i,
  /\bStella Ebraica\b/i,
  /\bHasmoneu\b/i,
  /\bHasmoneus\b/i,
  /\bestudos da pátria\b/i,
  /\bcurrículo israelita\b/i,
  /\bcurrículo israelense\b/i,
  /\bEstrela Hebraica\b/i,
];

/** Infrastructure labels that remain in English authority global packs — not product residue. */
const INFRA_KEY_ALLOW =
  /^(hebrew_question_voice|hebrew_level_prefix|notosanshebrew_regular_ttf)$/;

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
      // Empty JSON created by this cleanup would be israeli-named leaves / emptied indexes.
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
        if (INFRA_KEY_ALLOW.test(e.key)) continue;
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

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

describe("Romance locales — Israeli residue cleanup", () => {
  for (const [family, locales] of Object.entries(FAMILIES)) {
    describe(family, () => {
      for (const loc of locales) {
        test(`${loc}: forbidden key families, translated residue, empty files = 0`, () => {
          const bad = auditLocale(loc);
          assert.deepEqual(bad, [], bad.slice(0, 20).join("\n"));
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
          const idxRel = `content-packs/${loc}/learning/burn-down-index.json`;
          if (exists(idxRel)) {
            const idx = loadJson(idxRel);
            assert.equal(
              Object.prototype.hasOwnProperty.call(
                idx,
                "utils__curriculum-audit__israeli-primary-curriculum-map"
              ),
              false
            );
            assert.equal(
              Object.prototype.hasOwnProperty.call(
                idx,
                "utils__curriculum-audit__official-primary-curriculum-spine"
              ),
              false
            );
          }
        });

        test(`${loc}: no Hebrew Star / Homeland Explorer reward entries`, () => {
          const rel = `content-packs/${loc}/rewards/card-catalog.json`;
          if (!exists(rel)) return;
          const cards = loadJson(rel).cards || loadJson(rel);
          assert.equal(cards.achievement_hebrew_star, undefined);
          assert.equal(cards.achievement_moledet_explorer, undefined);
        });

        test(`${loc}: no homelandGeographyTopics / homeland report labels`, () => {
          const diagRel = `content-packs/${loc}/learning/diagnostic-labels.json`;
          if (exists(diagRel)) {
            const diag = loadJson(diagRel);
            assert.equal(diag.homelandGeographyTopics, undefined);
            if (diag.snippets) assert.equal(diag.snippets.homeland, undefined);
          }
          const displayRel = `content-packs/${loc}/reports/burn-down/utils__parent-report-language__parent-report-display-labels.json`;
          if (exists(displayRel)) {
            const d = loadJson(displayRel);
            const copy = d.copy || d;
            assert.equal(copy.homeland_studies, undefined);
            assert.equal(copy.homeland_geography, undefined);
          }
        });
      }
    });
  }

  test("all 17 locales covered", () => {
    const listed = new Set(Object.values(FAMILIES).flat());
    assert.deepEqual([...listed].sort(), [...LOCALES].sort());
  });

  test("report recommendation leaf/index stay aligned where both exist", () => {
    const slug = "utils__parent-report-language__grade-aware-recommendation-templates";
    for (const loc of LOCALES) {
      const idxRel = `content-packs/${loc}/reports/burn-down-index.json`;
      const leafRel = `content-packs/${loc}/reports/burn-down/${slug}.json`;
      if (!exists(idxRel) || !exists(leafRel)) continue;
      const idxKeys = new Set(Object.keys(loadJson(idxRel)[slug] || {}));
      const leafKeys = new Set(Object.keys(loadJson(leafRel).copy || {}));
      const onlyIndex = [...idxKeys].filter((k) => !leafKeys.has(k));
      const onlyLeaf = [...leafKeys].filter((k) => !idxKeys.has(k));
      assert.deepEqual(onlyIndex, [], `${loc} index orphans`);
      assert.deepEqual(onlyLeaf, [], `${loc} leaf orphans`);
      for (const k of idxKeys) {
        assert.equal(FORBIDDEN_KEY_RE.test(k), false, `${loc} bad key ${k}`);
      }
    }
  });
});
