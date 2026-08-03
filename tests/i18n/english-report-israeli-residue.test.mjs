/**
 * English-base report/learning authority: zero Israeli history / Hebrew / Homeland residue.
 */
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { resolveGradeAwareParentRecommendationHe } from "../../utils/parent-report-language/grade-aware-recommendation-resolver.js";
import { GRADE_AWARE_RECOMMENDATION_TEMPLATES } from "../../utils/parent-report-language/grade-aware-recommendation-templates.js";
import { reportPackCopy } from "../../lib/reports/report-pack-copy.js";
import {
  SUBJECT_HE_ALIASES,
  TOPIC_HE_ALIASES,
} from "../../utils/parent-copilot/report-row-resolver.js";
import { taxonomyIdsForReportBucket } from "../../utils/diagnostic-engine-v2/topic-taxonomy-bridge.js";
import {
  SUBJECT_LABEL_BY_ID,
  SUBJECT_VISIBLE_LABELS_HE,
} from "../../utils/parent-report-language/subject-evidence-policy.js";
import { PARENT_REPORT_SUBJECT_LABELS_EN } from "../../utils/parent-report-language/parent-report-display-labels.js";
import { findTranslatedIsraeliResidue } from "./_global-hebrew-guard-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const ISRAELI_HISTORY_CASES = [
  { taxonomyId: "HI-02", bucketKey: "hasmonaeans" },
  { taxonomyId: "HI-02", bucketKey: "rome_jews" },
  { taxonomyId: "HI-03", bucketKey: "hellenism_jews" },
  { taxonomyId: "HI-03", bucketKey: "hasmonaeans" },
  { taxonomyId: "HI-03", bucketKey: "rome_jews" },
  { taxonomyId: "HI-05", bucketKey: "hellenism_jews" },
  { taxonomyId: "HI-05", bucketKey: "rome_jews" },
  { taxonomyId: "HI-06", bucketKey: "hasmonaeans" },
  { taxonomyId: "HI-06", bucketKey: "rome_jews" },
  { taxonomyId: "HI-07", bucketKey: "rome_jews" },
  { taxonomyId: "HI-09", bucketKey: "rome_jews" },
];

const ACTIVE_GLOBAL_SMOKE = [
  { subjectId: "math", gradeKey: "g4", taxonomyId: "M-02", bucketKey: "addition" },
  { subjectId: "geometry", gradeKey: "g4", taxonomyId: "G-01", bucketKey: "shapes_basic" },
  { subjectId: "english", gradeKey: "g4", taxonomyId: "E-01", bucketKey: "vocabulary" },
  { subjectId: "science", gradeKey: "g4", taxonomyId: "S-01", bucketKey: "animals" },
];

function loadJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function collectIndexKeys(indexObj) {
  /** @type {string[]} */
  const keys = [];
  for (const [slug, copy] of Object.entries(indexObj || {})) {
    for (const k of Object.keys(copy || {})) keys.push(`${slug}::${k}`);
  }
  return keys;
}

function israeliKeyHit(key, value = "") {
  return /hasmonaean|hellenism|rome_judea|roman_judean|hebrew_|homeland|judaism|judea|moledet|israeli-primary/i.test(
    `${key} ${value}`
  );
}

describe("English report authority — Israeli residue removed", () => {
  test("grade-aware resolver returns null for all known Israeli history recommendation paths", () => {
    let hits = 0;
    for (const c of ISRAELI_HISTORY_CASES) {
      const text = resolveGradeAwareParentRecommendationHe({
        subjectId: "history",
        gradeKey: "g6",
        taxonomyId: c.taxonomyId,
        bucketKey: c.bucketKey,
        slot: "action",
      });
      if (text) hits += 1;
      assert.equal(text, null, `${c.taxonomyId}/${c.bucketKey} => ${text}`);
    }
    assert.equal(hits, 0);
    assert.equal(GRADE_AWARE_RECOMMENDATION_TEMPLATES.history, undefined);
  });

  test("English report index contains zero Israeli-topic keys", () => {
    const index = loadJson("content-packs/en/reports/burn-down-index.json");
    const leaf = loadJson(
      "content-packs/en/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
    );
    const bad = [];
    for (const [slug, copy] of Object.entries(index)) {
      for (const [k, v] of Object.entries(copy || {})) {
        if (israeliKeyHit(k, v) || findTranslatedIsraeliResidue(String(v)).length) {
          bad.push(`${slug}.${k}`);
        }
      }
    }
    for (const [k, v] of Object.entries(leaf.copy || {})) {
      if (israeliKeyHit(k, v) || findTranslatedIsraeliResidue(String(v)).length) {
        bad.push(`leaf.${k}`);
      }
    }
    assert.deepEqual(bad, []);
  });

  test("English learning index has no israeli-primary-curriculum-map registration", () => {
    const index = loadJson("content-packs/en/learning/burn-down-index.json");
    assert.equal(
      Object.prototype.hasOwnProperty.call(index, "utils__curriculum-audit__israeli-primary-curriculum-map"),
      false
    );
    const leaf = path.join(
      ROOT,
      "content-packs/en/learning/burn-down/utils__curriculum-audit__israeli-primary-curriculum-map.json"
    );
    assert.equal(fs.existsSync(leaf), false);
  });

  test("no Hebrew/Moledet/Homeland display labels in English report subject maps", () => {
    assert.deepEqual(Object.keys(SUBJECT_LABEL_BY_ID).sort(), [
      "english",
      "geometry",
      "math",
      "science",
    ]);
    assert.equal(SUBJECT_LABEL_BY_ID.history, undefined);
    assert.equal(SUBJECT_LABEL_BY_ID.geography, undefined);
    assert.equal(PARENT_REPORT_SUBJECT_LABELS_EN.history, undefined);
    assert.equal(PARENT_REPORT_SUBJECT_LABELS_EN.geography, undefined);
    const visibleBlob = JSON.stringify(SUBJECT_VISIBLE_LABELS_HE);
    assert.equal(/Homeland|Moledet|Hebrew/i.test(visibleBlob), false);

    const displayLeaf = loadJson(
      "content-packs/en/reports/burn-down/utils__parent-report-language__parent-report-display-labels.json"
    );
    assert.equal(displayLeaf.copy.homeland_studies, undefined);
    assert.equal(displayLeaf.copy.homeland_geography, undefined);

    const diag = loadJson("content-packs/en/learning/diagnostic-labels.json");
    assert.equal(diag.homelandGeographyTopics, undefined);
  });

  test("diagnostic/copilot bridges do not expose Israeli topics", () => {
    assert.equal(TOPIC_HE_ALIASES.hasmonaeans, undefined);
    assert.equal(TOPIC_HE_ALIASES.hellenism_jews, undefined);
    assert.equal(TOPIC_HE_ALIASES.rome_jews, undefined);
    assert.equal(TOPIC_HE_ALIASES.hist_sub_hasmonaean_kingdom, undefined);
    assert.equal(SUBJECT_HE_ALIASES.history, undefined);
    assert.deepEqual(taxonomyIdsForReportBucket("history", "hasmonaeans"), []);
    assert.deepEqual(taxonomyIdsForReportBucket("history", "hellenism_jews"), []);
    assert.deepEqual(taxonomyIdsForReportBucket("history", "rome_jews"), []);
  });

  test("active global subject recommendations still resolve", () => {
    const results = {};
    for (const c of ACTIVE_GLOBAL_SMOKE) {
      const text = resolveGradeAwareParentRecommendationHe({
        ...c,
        slot: "action",
      });
      results[c.subjectId] = Boolean(text && String(text).trim());
      assert.ok(text && String(text).trim().length > 8, `${c.subjectId} unresolved`);
    }
    assert.equal(results.math, true);
    assert.equal(results.geometry, true);
    assert.equal(results.english, true);
    assert.equal(results.science, true);
  });

  test("report pack copy for removed Israeli history keys is unsupported/empty", () => {
    const gone = [
      "grade_6_hasmonaean_timeline_sequencing",
      "grade_6_hellenism_judaism_cause_effect",
      "grade_6_rome_judea_timeline_sequencing",
      "homeland_studies",
    ];
    for (const key of gone) {
      const v = reportPackCopy(
        "utils__parent-report-language__grade-aware-recommendation-templates",
        key
      );
      assert.ok(v == null || v === "" || v === key, `unexpected live copy for ${key}: ${v}`);
      if (typeof v === "string" && v !== key) {
        assert.equal(findTranslatedIsraeliResidue(v).length, 0, key);
      }
    }
  });

  test("no orphan Israeli keys between recommendation leaf and index slug", () => {
    const index = loadJson("content-packs/en/reports/burn-down-index.json");
    const leaf = loadJson(
      "content-packs/en/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
    );
    const slug = "utils__parent-report-language__grade-aware-recommendation-templates";
    const indexKeys = new Set(Object.keys(index[slug] || {}));
    const leafKeys = new Set(Object.keys(leaf.copy || {}));
    const onlyIndex = [...indexKeys].filter((k) => !leafKeys.has(k));
    const onlyLeaf = [...leafKeys].filter((k) => !indexKeys.has(k));
    assert.deepEqual(onlyIndex, []);
    assert.deepEqual(onlyLeaf, []);
    // Full index should not retain Israeli orphans under any slug
    const israeliOrphans = collectIndexKeys(index).filter((k) => israeliKeyHit(k));
    assert.deepEqual(israeliOrphans, []);
  });
});
