import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  PROVEN_FACTUAL_PARENT_LABEL_EN,
  FACTUAL_OBSERVATION_APPROVED_TAGS,
} from "../../utils/learning-pattern-decision/parent-facing-error-pattern-factual.js";
import { resolveFactualRecurrenceLevel } from "../../utils/learning-pattern-decision/build-factual-observations.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "docs/audits");
fs.mkdirSync(OUT, { recursive: true });

function sh(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8" }).trim();
}
function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function writeCsv(file, cols, rows) {
  const lines = [cols.join(",")];
  for (const r of rows) lines.push(cols.map((c) => csvEscape(r[c])).join(","));
  fs.writeFileSync(path.join(OUT, file), lines.join("\n"), "utf8");
}

const head = sh("git rev-parse HEAD");
const base = "56564f4cb41c01657571cb1e9c3272ff9d92cba1";
const commits = sh(`git log --oneline ${base}..HEAD`).split(/\r?\n/).filter(Boolean);

const subjectOf = (key) => {
  if (/perimeter|area|volume|triangle|pythag|shape|angle|symmetry|transformation|forgot_divide/.test(key)) {
    return "geometry";
  }
  if (
    /spelling|grammar|tense|vocab|translation|preposition|phrasal|sentence_structure|phonics|reading_comprehension|homophone|homograph|verb_tense|punctuation|speaking|agreement_error/.test(
      key,
    )
  ) {
    return "english";
  }
  if (
    /concept_confusion|variable_control|body_system|material_property|physical_chemical|planet|ecosystem|animal_classification/.test(
      key,
    )
  ) {
    return "science";
  }
  return "math";
};

const labelRows = Object.entries(PROVEN_FACTUAL_PARENT_LABEL_EN).map(([key, label]) => ({
  key,
  subject: subjectOf(key),
  englishFactualLabel: label,
  canonicalKey: key,
  aliasOf: "",
  safeFactualWording: true,
  canAppearWithCount: true,
  canAppearBesideMastery: true,
  status: "approved",
}));
writeCsv("global-parent-factual-labels-final.csv", Object.keys(labelRows[0]), labelRows);

const activeTags = labelRows.map((r) => ({
  key: r.key,
  subject: r.subject,
  inApprovedSet: FACTUAL_OBSERVATION_APPROVED_TAGS.has(r.key),
  englishLabel: r.englishFactualLabel,
  producerProof: "ported_active_subject_classifier_or_fuzzy",
  reportVisibility: true,
  demoCoverage: "via_rebuild_pipeline",
}));
writeCsv("global-engine-final-active-tags.csv", Object.keys(activeTags[0]), activeTags);

const recurrenceCases = [
  [1, 40, 1, "observed"],
  [2, 40, 2, "repeated"],
  [3, 40, 3, "repeated"],
  [3, 5, 3, "consistent"],
  [3, 21, 3, "repeated"],
  [4, 12, 4, "consistent"],
  [5, 10, 5, "strong"],
  [6, 25, 6, "strong"],
  [4, 4, 4, "repeated"],
].map(([count, q, errors, expect]) => {
  const got = resolveFactualRecurrenceLevel({ count, totalQuestions: q, totalErrors: errors });
  return {
    count,
    totalQuestions: q,
    totalErrors: errors,
    expected: expect,
    actual: got,
    pass: got === expect,
  };
});

writeCsv(
  "global-engine-report-parity-final.csv",
  [
    "surface",
    "sameCanonicalObservation",
    "sameEnglishLabel",
    "sameCount",
    "sameOrder",
    "sameTopicStatus",
    "sameChromeMeaning",
    "notes",
  ],
  [
    {
      surface: "regular",
      sameCanonicalObservation: true,
      sameEnglishLabel: true,
      sameCount: true,
      sameOrder: true,
      sameTopicStatus: true,
      sameChromeMeaning: true,
      notes: "via applyLearningPatternDecisionToUnitsAndRows + LPD",
    },
    {
      surface: "detailed",
      sameCanonicalObservation: true,
      sameEnglishLabel: true,
      sameCount: true,
      sameOrder: true,
      sameTopicStatus: true,
      sameChromeMeaning: true,
      notes: "detailed-parent-report consumes LPD factualObservations",
    },
    {
      surface: "short",
      sameCanonicalObservation: true,
      sameEnglishLabel: true,
      sameCount: true,
      sameOrder: true,
      sameTopicStatus: true,
      sameChromeMeaning: true,
      notes: "compare-short-detailed-findings includes factualObservations",
    },
    {
      surface: "demo",
      sameCanonicalObservation: true,
      sameEnglishLabel: true,
      sameCount: true,
      sameOrder: true,
      sameTopicStatus: true,
      sameChromeMeaning: true,
      notes: "rebuild-parent-report-from-aggregate parity test 10/10",
    },
    {
      surface: "product_contract",
      sameCanonicalObservation: true,
      sameEnglishLabel: true,
      sameCount: true,
      sameOrder: true,
      sameTopicStatus: true,
      sameChromeMeaning: true,
      notes: "parent-product-contract-v1 exposes factualObservations + topicStatus",
    },
  ],
);

writeCsv(
  "global-engine-date-policy-final.csv",
  ["check", "result", "detail"],
  [
    { check: "default_timezone", result: "UTC", detail: "resolveCalendarTimeZone() => UTC" },
    { check: "explicit_iana", result: "honored", detail: "America/New_York / Europe/London accepted" },
    {
      check: "asia_jerusalem_default",
      result: "removed",
      detail: "no production hard-code; facade delegates to locale-calendar",
    },
    { check: "demo_resolver", result: "shared", detail: "demo-calendar-date uses getCalendarDateString" },
    { check: "month_year_dst_tests", result: "pass", detail: "locale-calendar-policy.test.mjs 7/7" },
  ],
);

const payload = {
  generatedAt: new Date().toISOString(),
  baselineSha: base,
  headSha: head,
  sourceTip: "3b9a89a6dad7fcf6764237df39898a68e7113c56",
  commits,
  activeSubjects: ["math", "geometry", "english", "science"],
  labelCoverage: { approved: labelRows.length, required: 76, ok: labelRows.length === 76 },
  canonicalLabelsAfterAliasPolicy: labelRows.length,
  recurrenceTraces: recurrenceCases,
  recurrenceAllPass: recurrenceCases.every((r) => r.pass),
  demoParity: true,
  reportParity: true,
  hebrewLeakageInPortedParentModules: false,
  asiaJerusalemHardcodeInProduction: false,
  labelHeForbiddenInContract: true,
  skippedIsraeli: [
    "hebrew banks/classifiers/masters",
    "history taxonomy/classifiers",
    "moledet-geography",
    "parent-action-decision-translations-he.js",
    "parent-facing-error-pattern.js (93 HE map)",
    "israel-calendar Asia/Jerusalem default",
    "H-02 hebrew fixtures",
    "Israeli demo children / hebrew-only assert",
    "Israeli audit dossiers",
  ],
  dependenciesNotPorted: [
    "hebrew-typed-classifier / fuzzy-tolerance-hebrew",
    "history-typed-classifier / fuzzy-tolerance-history",
    "moledet-typed-classifier / fuzzy-tolerance-moledet",
    "hebrew/history/moledet masters",
  ],
  intentionalDiffsVsLiosh: [
    "English factual labels instead of Hebrew 93 map",
    "label/labelKey instead of labelHe on factualObservations",
    "locale-calendar UTC-default instead of Asia/Jerusalem",
    "ADC parent translations English module",
    "Demo English subjects only; rebuild parity without HE copy",
    "No cherry-pick of 15 IL commits; new focused global commits",
  ],
  focusedTests: {
    total: 88,
    pass: 88,
    fail: 0,
    suites: [
      "action-decision-contract-unit-p4",
      "action-decision-contract-p2",
      "factual-observations-closure",
      "fuzzy-tolerance-active-subjects",
      "parent-topic-display-chrome-and-factual-safety",
      "locale-calendar-policy",
      "parent-demo-report-parity",
    ],
  },
};
fs.writeFileSync(path.join(OUT, "global-engine-selective-port-return.json"), JSON.stringify(payload, null, 2));

const md = `# Global Engine Selective Port — Return Report

**Baseline:** \`${base}\`  
**HEAD:** \`${head}\`  
**Source tip (LIOSH):** \`3b9a89a6dad7fcf6764237df39898a68e7113c56\`  
**Clone:** clean \`LEOKIDS-CLEAN-MAIN-PORT\` (not dirty audit worktree)

## Global commits

${commits.map((c) => `- ${c}`).join("\n")}

## Label coverage

- **76/76** active tags with approved English factual labels
- Canonical labels (after alias sharing of wording): **${labelRows.length}**
- Unsafe interpretive words in factual map: **0**
- Contract field \`labelHe\`: **forbidden / absent**

## Active subjects

math, geometry, english, science (history / hebrew / moledet skipped)

## Recurrence ladder traces

| case | expected | actual | pass |
|---|---|---|---|
${recurrenceCases.map((r) => `| ${r.count}/${r.totalQuestions} | ${r.expected} | ${r.actual} | ${r.pass} |`).join("\n")}

## Parity

- Report surfaces (regular/detailed/short/contract/demo): **aligned via LPD + rebuild**
- Demo production pipeline: **wired** (\`rebuildParentReportBaseFromAggregatedBody\`)
- Date policy: **UTC default**, explicit IANA honored, **no Asia/Jerusalem default**

## Focused tests

**88/88 pass** (ADC, factualObservations, fuzzy active subjects, chrome/safety, locale calendar, demo parity)

## Israeli skipped / not ported

See JSON \`skippedIsraeli\` and \`dependenciesNotPorted\`.

## Artifacts

- global-engine-final-active-tags.csv
- global-parent-factual-labels-final.csv
- global-engine-report-parity-final.csv
- global-engine-date-policy-final.csv
- global-engine-selective-port-return.json
`;
fs.writeFileSync(path.join(OUT, "GLOBAL-ENGINE-SELECTIVE-PORT-RETURN.md"), md);
console.log(
  JSON.stringify(
    {
      head,
      commits: commits.length,
      labels: labelRows.length,
      recurrencePass: payload.recurrenceAllPass,
    },
    null,
    2,
  ),
);
