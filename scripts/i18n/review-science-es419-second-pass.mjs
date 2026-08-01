/**
 * Second-pass pedagogical/linguistic review: Science EN ↔ es-419 overlay.
 */
import fs from "fs";
import { SCIENCE_QUESTIONS } from "../../data/science-questions.js";
import { SCIENCE_EN_OVERLAY } from "../../data/science-questions-en-overlay.js";
import { SCIENCE_ES_419_OVERLAY } from "../../data/science-questions-es-419-overlay.js";
import { FORBIDDEN_ES_LATAM_PATTERNS } from "../../lib/i18n/spanish-latam-glossary.js";

const HEBREW = /[\u0590-\u05FF]/;
const highRiskIds = fs.existsSync("reports/science-en-qa/high-risk-reconstructed.json")
  ? JSON.parse(fs.readFileSync("reports/science-en-qa/high-risk-reconstructed.json", "utf8")).map(
      (r) => r.id
    )
  : [];

function enDisplay(q) {
  const ov = SCIENCE_EN_OVERLAY[q.id] || {};
  return {
    stem: ov.stem ?? q.stem,
    options: ov.options ?? q.options,
    explanation: ov.explanation ?? q.explanation,
    theoryLines: ov.theoryLines ?? q.theoryLines,
  };
}

const findings = [];
function add(id, cat, detail) {
  findings.push({ id, cat, detail });
}

let strings = 0;
for (const q of SCIENCE_QUESTIONS) {
  const es = SCIENCE_ES_419_OVERLAY[q.id];
  const en = enDisplay(q);
  if (!es) {
    add(q.id, "missing field", "no overlay");
    continue;
  }
  if (es.options?.length !== en.options?.length) {
    add(q.id, "correct-answer change", "option count");
  }
  // correctIndex not stored in overlay — order must match; length check is enough for structure
  const norms = (es.options || []).map((o) => String(o).trim().toLowerCase());
  if (new Set(norms).size !== norms.length) {
    add(q.id, "duplicate translated options", norms.join(" | "));
  }
  const fields = [
    ["stem", es.stem],
    ["explanation", es.explanation],
    ...((es.options || []).map((o, i) => [`option${i}`, o])),
    ...((es.theoryLines || []).map((t, i) => [`theory${i}`, t])),
  ];
  for (const [field, text] of fields) {
    strings += 1;
    const s = String(text ?? "");
    if (!s.trim()) add(q.id, "missing field", field);
    if (HEBREW.test(s)) add(q.id, "Hebrew leakage", field);
    for (const p of FORBIDDEN_ES_LATAM_PATTERNS) {
      if (p.re.test(s)) add(q.id, "regional wording", `${field}:${p.id}`);
    }
    // Unintended English: stem starting with What/Which/How without Spanish marks
    if (field === "stem" && /^(What|Which|How|Why|Where|When)\b/.test(s)) {
      add(q.id, "English leakage", s.slice(0, 80));
    }
    // Answer leakage soft: stem contains long chunk of correct option
    if (field === "stem") {
      const correct = String(es.options?.[q.correctIndex] || "");
      const key = correct.toLowerCase().replace(/[.?!,¿¡]/g, "");
      if (key.length >= 28 && s.toLowerCase().replace(/[.?!,¿¡]/g, "").includes(key.slice(0, 28))) {
        add(q.id, "answer leakage", "stem contains correct option");
      }
    }
  }
}

const byCat = {};
for (const f of findings) byCat[f.cat] = (byCat[f.cat] || 0) + 1;

// High-risk deep sample: ensure Spanish present and option counts match
const highRiskReview = [];
for (const id of highRiskIds) {
  const q = SCIENCE_QUESTIONS.find((x) => x.id === id);
  const es = SCIENCE_ES_419_OVERLAY[id];
  const en = q ? enDisplay(q) : null;
  const issues = [];
  if (!es) issues.push("missing");
  else {
    if (es.options.length !== en.options.length) issues.push("option_count");
    if (!/[áéíóúñ¿¡]|\b(qué|cuál|cómo|el|la|de|en|para)\b/i.test(es.stem)) {
      issues.push("stem_may_not_be_spanish");
    }
    if (findings.some((f) => f.id === id)) issues.push("has_finding");
  }
  highRiskReview.push({ id, pass: issues.length === 0, issues });
}

const report = {
  totalRecords: SCIENCE_QUESTIONS.length,
  overlayRecords: Object.keys(SCIENCE_ES_419_OVERLAY).length,
  stringsReviewed: strings,
  findingCounts: byCat,
  findingsTotal: findings.length,
  findingsSample: findings.slice(0, 60),
  highRisk: {
    total: highRiskIds.length,
    pass: highRiskReview.filter((r) => r.pass).length,
    fail: highRiskReview.filter((r) => !r.pass).length,
    fails: highRiskReview.filter((r) => !r.pass).slice(0, 40),
  },
};

fs.writeFileSync(
  "reports/science-es419/second-pass-review.json",
  JSON.stringify(report, null, 2)
);
console.log(JSON.stringify({ ...report, findingsSample: report.findingsSample.slice(0, 15) }, null, 2));
