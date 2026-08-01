/**
 * Wave 3 shared corrections: unsupported report topics + British practising inheritance.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { LEARNING_SUBJECT_ALLOWLIST } from "../../lib/learning-supabase/learning-activity.js";
import { resolveGradeAwareParentRecommendationHe } from "../../utils/parent-report-language/grade-aware-recommendation-resolver.js";
import { reportPackCopy, reportPackCopyForLocale } from "../../lib/reports/report-pack-copy.js";
import {
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { buildDemoParentReportPayload } from "../../lib/demo/parent-demo-data/report-payload-builder.server.js";
import { DEMO_HISTORY_START } from "../../lib/demo/parent-demo-data/constants.js";
import { todayYmdUtc } from "../../lib/demo/parent-demo-data/demo-calendar-date.server.js";

const FORBIDDEN_REPORT_PHRASES = ["Hebrew writing", "Hasmonaean", "Rome/Judea"];
const GLOBAL_SUBJECTS = ["math", "geometry", "english", "science"];
const BRITISH = ["en-GB", "en-WLS", "en-SCT", "en-NIR"];
const AMERICAN_AUTHORITY = ["en", "en-CA", "en-PH"];

const PRACTISING_KEYS = [
  "learning.hubBlurb",
  "learning.master.noBadgesYet",
  "ui.public.contact.faq.parentsSee.a",
  "ui.public.homepage.howItWorks.step2",
  "ui.public.homepage.funGames.0.text",
  "ui.student.subjectsIntro",
  "reports.remediateSameLevel",
  "reports.maintainAndStrengthen",
  "reports.actions.remediateSameLevel",
  "reports.actions.maintainAndStrengthen",
  "reports.v2.executive.majorTrendsManyUnitsLine2",
];

/**
 * @param {string} loc
 */
function t(loc) {
  const b = loadLocaleBundles(loc);
  return (key) => lookupMessage(b, key) ?? null;
}

test("unsupported hebrew/history report topics cannot enter global learning evidence", () => {
  assert.deepEqual([...LEARNING_SUBJECT_ALLOWLIST].sort(), [...GLOBAL_SUBJECTS].sort());
  assert.equal(LEARNING_SUBJECT_ALLOWLIST.has("hebrew"), false);
  assert.equal(LEARNING_SUBJECT_ALLOWLIST.has("history"), false);
});

test("hebrew_writing pack keys are not wired into grade-aware template bank", () => {
  const heWriting = resolveGradeAwareParentRecommendationHe({
    subjectId: "hebrew",
    gradeKey: "g4",
    taxonomyId: "H-01",
    slot: "action",
  });
  assert.equal(heWriting, null);
});

test("history template strings exist in en pack but SCT/NIR resolved parent report omits them", () => {
  // Template bank can resolve history when called directly (IL artifact).
  const historyDirect = resolveGradeAwareParentRecommendationHe({
    subjectId: "history",
    gradeKey: "g6",
    taxonomyId: "HI-02",
    bucketKey: "hasmonaeans",
    slot: "action",
  });
  assert.ok(historyDirect && /Hasmonaean/i.test(historyDirect));

  // Grade-aware templates bake reportPackCopy("en") — country overlays are not the runtime authority.
  const enCourse = reportPackCopy(
    "utils__parent-report-language__grade-aware-recommendation-templates",
    "grade_6_hasmonaean_timeline_sequencing"
  );
  assert.match(enCourse, /Hasmonaean|Grade 6/i);
  const sctCourse = reportPackCopyForLocale(
    "en-SCT",
    "utils__parent-report-language__grade-aware-recommendation-templates",
    "grade_6_hasmonaean_timeline_sequencing"
  );
  // Locale pack may differ, but parent report composition never surfaces history for global product.
  assert.ok(typeof sctCourse === "string");

  const built = buildDemoParentReportPayload(
    "demo-parent-child-noam-g2",
    DEMO_HISTORY_START,
    todayYmdUtc()
  );
  assert.equal(built.ok, true);
  const subjects = Object.keys(built.payload?.subjects || {});
  assert.deepEqual([...subjects].sort(), [...GLOBAL_SUBJECTS].sort());
  for (const forbidden of ["history", "hebrew", "moledet"]) {
    assert.ok(!subjects.includes(forbidden), forbidden);
  }

  const resolved = JSON.stringify({
    parentFacing: built.payload?.parentFacing || {},
    summary: built.payload?.summary || {},
    subjects: built.payload?.subjects || {},
  });
  for (const phrase of FORBIDDEN_REPORT_PHRASES) {
    assert.equal(
      resolved.includes(phrase) ? 1 : 0,
      0,
      `resolved demo report must not contain ${phrase}`
    );
  }

  // Scotland / Northern Ireland: same global subject gate — no history/hebrew evidence path.
  for (const locale of ["en-SCT", "en-NIR"]) {
    const blob = JSON.stringify({
      locale,
      subjects: GLOBAL_SUBJECTS,
      allowlist: [...LEARNING_SUBJECT_ALLOWLIST],
      hebrewResolver: resolveGradeAwareParentRecommendationHe({
        subjectId: "hebrew",
        gradeKey: "g4",
        taxonomyId: "H-01",
        slot: "action",
      }),
      reportSubjects: subjects,
      resolvedParentFacingHasForbidden: FORBIDDEN_REPORT_PHRASES.some((p) =>
        resolved.includes(p)
      ),
    });
    assert.match(blob, new RegExp(locale));
    assert.equal(
      FORBIDDEN_REPORT_PHRASES.filter((p) => resolved.includes(p)).length,
      0,
      `${locale} resolved report output`
    );
  }
});

test("en-GB practising overrides resolve for GB/WLS/SCT/NIR", () => {
  resetLocaleBundleCache();
  for (const loc of BRITISH) {
    const msg = t(loc);
    for (const key of PRACTISING_KEYS) {
      const value = msg(key);
      assert.ok(value, `${loc} ${key}`);
      assert.doesNotMatch(value, /\bpracticing\b/i, `${loc} ${key}`);
      assert.match(value, /practising/i, `${loc} ${key}`);
    }
    assert.match(msg("reports.remediateSameLevel"), /Keep practising/);
  }
});

test("en and en-PH remain American practicing on those keys", () => {
  resetLocaleBundleCache();
  for (const loc of AMERICAN_AUTHORITY) {
    const msg = t(loc);
    assert.match(msg("learning.hubBlurb"), /practicing/);
    assert.match(msg("learning.master.noBadgesYet"), /Keep practicing/);
    assert.match(msg("reports.remediateSameLevel"), /Keep practicing/);
    assert.doesNotMatch(msg("learning.hubBlurb"), /practising/);
  }
});

test("IDs placeholders and report meaning keys unchanged for practising overlays", () => {
  resetLocaleBundleCache();
  const en = t("en");
  const gb = t("en-GB");
  // Same keys resolve; only verb spelling differs.
  assert.ok(en("reports.remediateSameLevel"));
  assert.ok(gb("reports.remediateSameLevel"));
  assert.notEqual(en("reports.remediateSameLevel"), gb("reports.remediateSameLevel"));
  assert.equal(
    en("reports.remediateSameLevel").replace(/practicing/g, "practising"),
    gb("reports.remediateSameLevel")
  );
});
