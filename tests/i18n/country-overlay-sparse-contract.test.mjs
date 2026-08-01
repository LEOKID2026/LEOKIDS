/**
 * Country overlay sparse contract: orphans, identical overrides, near-full *copies*.
 * Dense justified overlays (100% different, linguistically required) are not copies.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  assessNearFullCopy,
  collectStringLeaves,
  resolveAuthorityPackPath,
} from "../../lib/i18n/country-overlay-sparse-contract.js";
import { getCatalogPackExact } from "../../lib/content/pack-catalog.js";
import { loadMergedReportBurnDownIndex } from "../../lib/reports/report-pack-copy.js";

const ROOT = process.cwd();
const GRADE_AWARE_SLUG = "utils__parent-report-language__grade-aware-recommendation-templates";
const GRADE_AWARE_FRAGMENTS = [
  "out-of-grade-guards",
  "weekly-focus",
  "practice-prompts",
  "course-labels",
];

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

/**
 * @param {string} locale
 */
function auditCountryContentPacks(locale) {
  const countryRoot = path.join(ROOT, "content-packs", locale);
  const baseRoot = path.join(ROOT, "content-packs", "es-419");
  const baseExists = (rel) => fs.existsSync(path.join(baseRoot, rel));

  /** @type {string[]} */
  const extraFiles = [];
  /** @type {Array<{ rel: string, key: string }>} */
  const orphanKeys = [];
  /** @type {Array<{ rel: string, key: string }>} */
  const identicalOverrides = [];
  /** @type {Array<{ rel: string, assessment: ReturnType<typeof assessNearFullCopy> }>} */
  const nearFullCopies = [];
  /** @type {Array<{ rel: string, overrideCount: number, baseCount: number, coverage: number }>} */
  const denseJustified = [];

  for (const rel of listJsonRel(countryRoot)) {
    // Index files are sparse by construction (few slugs vs full base index).
    if (rel.endsWith("/burn-down-index.json") || rel === "burn-down-index.json") continue;

    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    const authority = resolveAuthorityPackPath(rel, baseExists);
    if (authority.kind === "missing" || !authority.baseRel) {
      extraFiles.push(rel);
      continue;
    }
    const base = JSON.parse(fs.readFileSync(path.join(baseRoot, authority.baseRel), "utf8"));
    const countryLeaves = collectStringLeaves(country);
    const baseLeaves = collectStringLeaves(base);

    for (const [key, value] of countryLeaves) {
      if (!baseLeaves.has(key)) orphanKeys.push({ rel, key });
      else if (baseLeaves.get(key) === value) identicalOverrides.push({ rel, key });
    }

    // For fragment files, assess coverage against the parent pack leaf map.
    const assessment = assessNearFullCopy(
      /** @type {Map<string, string>} */ (countryLeaves),
      /** @type {Map<string, string>} */ (baseLeaves)
    );
    if (assessment.isNearFullCopy) nearFullCopies.push({ rel, assessment });
    if (assessment.isDenseJustifiedOverlay) {
      denseJustified.push({
        rel,
        overrideCount: assessment.overrideCount,
        baseCount: assessment.baseCount,
        coverage: assessment.coverage,
      });
    }
  }

  return { extraFiles, orphanKeys, identicalOverrides, nearFullCopies, denseJustified };
}

test("assessNearFullCopy distinguishes retained copies from dense justified overlays", () => {
  const base = new Map([
    ["a", "alpha value one"],
    ["b", "bravo value two"],
    ["c", "charlie value three"],
    ["d", "delta value four"],
    ["e", "echo value five"],
    ["f", "foxtrot value six"],
    ["g", "golf value seven"],
    ["h", "hotel value eight"],
    ["i", "india value nine"],
    ["j", "juliet value ten"],
  ]);

  const identicalDense = new Map(base);
  const identicalAssessment = assessNearFullCopy(identicalDense, base);
  assert.equal(identicalAssessment.isNearFullCopy, true);
  assert.equal(identicalAssessment.identicalCount, 10);

  // One-character drift on long strings ≈ retained copy, not a real locale rewrite.
  const tinyEdit = new Map(
    [...base].map(([k, v]) => {
      const long = `${v} — extended parent-facing recommendation text for similarity`;
      return [k, `${long.slice(0, -1)}x`];
    })
  );
  const tinyBase = new Map(
    [...base].map(([k, v]) => [
      k,
      `${v} — extended parent-facing recommendation text for similarity`,
    ])
  );
  const tinyAssessment = assessNearFullCopy(tinyEdit, tinyBase);
  assert.equal(tinyAssessment.isNearFullCopy, true);
  assert.ok(tinyAssessment.nearIdenticalCount >= 8);

  const rewritten = new Map([
    ["a", "curso Primaria redacción completamente distinta A"],
    ["b", "curso Primaria redacción completamente distinta B"],
    ["c", "curso Primaria redacción completamente distinta C"],
    ["d", "curso Primaria redacción completamente distinta D"],
    ["e", "curso Primaria redacción completamente distinta E"],
    ["f", "curso Primaria redacción completamente distinta F"],
    ["g", "curso Primaria redacción completamente distinta G"],
    ["h", "curso Primaria redacción completamente distinta H"],
    ["i", "curso Primaria redacción completamente distinta I"],
    ["j", "curso Primaria redacción completamente distinta J"],
  ]);
  const rewrittenAssessment = assessNearFullCopy(rewritten, base);
  assert.equal(rewrittenAssessment.isNearFullCopy, false);
  assert.equal(rewrittenAssessment.isDenseJustifiedOverlay, true);
  assert.equal(rewrittenAssessment.identicalCount, 0);
});

test("resolveAuthorityPackPath maps grade-aware semantic fragments to parent pack", () => {
  const baseExists = (rel) =>
    rel === "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json";
  const resolved = resolveAuthorityPackPath(
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates__weekly-focus.json",
    baseExists
  );
  assert.equal(resolved.kind, "fragment");
  assert.equal(
    resolved.baseRel,
    "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
  );
});

test("es-ES reports grade-aware fragments compose to the same runtime slug", () => {
  const dir = path.join(ROOT, "content-packs/es-ES/reports/burn-down");
  /** @type {Record<string, string>} */
  const merged = {};
  for (const frag of GRADE_AWARE_FRAGMENTS) {
    const file = `${GRADE_AWARE_SLUG}__${frag}.json`;
    const pack = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    Object.assign(merged, pack.copy || pack);
  }
  assert.equal(Object.keys(merged).length, 121);

  const catalog = getCatalogPackExact("es-ES", "reports/burn-down-index.json");
  assert.deepEqual(catalog[GRADE_AWARE_SLUG], merged);

  const monolithicPath = path.join(dir, `${GRADE_AWARE_SLUG}.json`);
  assert.equal(fs.existsSync(monolithicPath), false, "monolithic near-full leaf must not remain");
});

test("es-ES country overlay sparse contract: no near-full copies, no identical overrides", () => {
  const audit = auditCountryContentPacks("es-ES");
  assert.deepEqual(audit.extraFiles, []);
  assert.deepEqual(audit.orphanKeys, []);
  assert.deepEqual(audit.identicalOverrides, []);
  assert.deepEqual(
    audit.nearFullCopies.map((x) => x.rel),
    [],
    `near-full copies not allowed: ${JSON.stringify(audit.nearFullCopies, null, 2)}`
  );

  // Grade-aware fragments stay sparse vs the 121-key parent pack.
  for (const frag of GRADE_AWARE_FRAGMENTS) {
    const rel = `reports/burn-down/${GRADE_AWARE_SLUG}__${frag}.json`;
    const country = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/es-ES", rel), "utf8"));
    const base = JSON.parse(
      fs.readFileSync(
        path.join(
          ROOT,
          "content-packs/es-419/reports/burn-down",
          `${GRADE_AWARE_SLUG}.json`
        ),
        "utf8"
      )
    );
    const assessment = assessNearFullCopy(collectStringLeaves(country), collectStringLeaves(base));
    assert.ok(assessment.coverage < 0.9, `${rel} coverage ${assessment.coverage}`);
    assert.equal(assessment.isNearFullCopy, false);
  }
});

test("es-ES merged report runtime parity for grade-aware slug", () => {
  const merged = loadMergedReportBurnDownIndex("es-ES");
  const base = getCatalogPackExact("es-419", "reports/burn-down-index.json");
  const overlay = getCatalogPackExact("es-ES", "reports/burn-down-index.json");
  assert.equal(Object.keys(overlay[GRADE_AWARE_SLUG] || {}).length, 121);
  assert.equal(
    Object.keys(merged[GRADE_AWARE_SLUG] || {}).length,
    Object.keys(base[GRADE_AWARE_SLUG] || {}).length
  );

  const values = Object.values(merged[GRADE_AWARE_SLUG] || {}).join("\n");
  assert.equal((values.match(/\bgrados?\b/gi) || []).length, 0);
  assert.doesNotMatch(values, /\b(usted|pídale a su|proporcione|Mantenga|concéntrese|identifique)\b/i);
  assert.equal((values.match(/\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g) || []).length, 0);
});
