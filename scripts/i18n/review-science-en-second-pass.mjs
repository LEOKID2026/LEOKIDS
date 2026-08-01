/**
 * Second-pass Science EN QA: structural + pedagogical heuristics.
 * Read-only report (does not modify banks).
 */
import fs from "fs";
import { SCIENCE_QUESTIONS } from "../../data/science-questions.js";
import { SCIENCE_EN_OVERLAY } from "../../data/science-questions-en-overlay.js";
import {
  FORBIDDEN_BRITISH_PATTERNS,
  FORBIDDEN_CALQUE_PATTERNS,
} from "../../lib/i18n/american-english-glossary.js";

const HEBREW_RE = /[\u0590-\u05FF]/;
const PLACEHOLDER_RE = /\b(TODO|FIXME|TBD|PLACEHOLDER|lorem ipsum|xxx+)\b/i;
const LITERAL_SCIENCE_QUESTION_RE = /^science question\.?$/i;
const MECHANICAL_RE =
  /\b(main of|What main|Parts body|Oxygen air|to to|of of|way best most)\b/i;

const findings = {
  grammar: [],
  unnatural_phrasing: [],
  incomplete_sentence: [],
  scientific_terminology: [],
  age_mismatch: [],
  question_answer_mismatch: [],
  duplicate_options: [],
  answer_leakage: [],
  explanation_mismatch: [],
  empty_content: [],
  british_spelling: [],
  placeholder: [],
  hebrew: [],
  structural: [],
};

function push(cat, id, detail) {
  findings[cat].push({ id, detail });
}

function display(q) {
  const ov = SCIENCE_EN_OVERLAY[q.id] || {};
  return {
    stem: ov.stem ?? q.stem,
    options: ov.options ?? q.options,
    explanation: ov.explanation ?? q.explanation,
    theoryLines: ov.theoryLines ?? q.theoryLines,
  };
}

const ids = new Set();
let stringCount = 0;
let emptyFixedCandidates = 0;
let dupOpts = 0;
let placeholders = 0;

for (const q of SCIENCE_QUESTIONS) {
  if (ids.has(q.id)) push("structural", q.id, "duplicate_id");
  ids.add(q.id);

  const d = display(q);
  const fields = [
    ["stem", d.stem],
    ["explanation", d.explanation],
    ...((d.options || []).map((o, i) => [`option${i}`, o])),
    ...((d.theoryLines || []).map((t, i) => [`theory${i}`, t])),
  ];

  // Overlay parity
  const ov = SCIENCE_EN_OVERLAY[q.id];
  if (!ov) push("structural", q.id, "missing_overlay");
  else {
    if (ov.stem !== q.stem) push("structural", q.id, "overlay_stem_mismatch");
    if (JSON.stringify(ov.options) !== JSON.stringify(q.options)) {
      push("structural", q.id, "overlay_options_mismatch");
    }
    if (ov.explanation !== q.explanation) {
      push("structural", q.id, "overlay_explanation_mismatch");
    }
  }

  // Required structure
  if (!Array.isArray(q.options) || q.options.length < 2) {
    push("structural", q.id, "options_too_few");
  }
  if (
    typeof q.correctIndex !== "number" ||
    q.correctIndex < 0 ||
    q.correctIndex >= (q.options || []).length
  ) {
    push("structural", q.id, "correctIndex_oob");
  }
  if (!q.topic) push("structural", q.id, "missing_topic");
  if (!Array.isArray(q.grades) || !q.grades.length) {
    push("structural", q.id, "missing_grades");
  }

  for (const [field, text] of fields) {
    stringCount += 1;
    const s = String(text ?? "");
    if (!s.trim()) {
      emptyFixedCandidates += 1;
      push("empty_content", q.id, field);
    }
    if (HEBREW_RE.test(s)) push("hebrew", q.id, field);
    if (PLACEHOLDER_RE.test(s) || LITERAL_SCIENCE_QUESTION_RE.test(s.trim())) {
      placeholders += 1;
      push("placeholder", q.id, `${field}:${s.slice(0, 80)}`);
    }
    if (MECHANICAL_RE.test(s)) {
      push("unnatural_phrasing", q.id, `${field}:mechanical`);
    }
    for (const p of FORBIDDEN_BRITISH_PATTERNS) {
      if (p.re.test(s)) push("british_spelling", q.id, `${field}:${p.id}`);
    }
    for (const p of FORBIDDEN_CALQUE_PATTERNS) {
      if (p.re.test(s)) push("unnatural_phrasing", q.id, `${field}:${p.id}`);
    }
    // Incomplete / fragment stems (short only; ellipsis completions are allowed if otherwise natural)
    if (field === "stem") {
      const t = s.trim();
      if (/^[a-z]/.test(t)) push("grammar", q.id, "stem_lowercase_start");
      if (t.length > 0 && t.length < 12) push("incomplete_sentence", q.id, t);
      if (/^(what|which|how|why|where|when|who)\??$/i.test(t)) {
        push("incomplete_sentence", q.id, t);
      }
    }
  }

  const opts = (d.options || []).map((o) => String(o).trim().toLowerCase());
  if (new Set(opts).size !== opts.length) {
    dupOpts += 1;
    push("duplicate_options", q.id, opts.join(" | "));
  }

  // Answer leakage: stem contains long unique phrase from correct option
  const correct = String(d.options?.[q.correctIndex] ?? "").trim();
  if (correct.length >= 18) {
    const key = correct.toLowerCase().replace(/[.?!,]/g, "");
    const stemKey = String(d.stem || "")
      .toLowerCase()
      .replace(/[.?!,]/g, "");
    if (key.length >= 18 && stemKey.includes(key.slice(0, Math.min(24, key.length)))) {
      push("answer_leakage", q.id, "stem_contains_correct_option");
    }
  }

  // Soft Q-A: correct option empty / identical to another
  if (!correct.trim()) push("question_answer_mismatch", q.id, "empty_correct");

  // Explanation should not obviously contradict by naming a different option as correct
  const expl = String(d.explanation || "").toLowerCase();
  for (let i = 0; i < (d.options || []).length; i++) {
    if (i === q.correctIndex) continue;
    const wrong = String(d.options[i] || "").trim().toLowerCase();
    if (wrong.length < 20) continue;
    if (expl.includes(`correct answer is ${wrong}`) || expl.includes(`answer is ${wrong}`)) {
      push("explanation_mismatch", q.id, `points_to_option_${i}`);
    }
  }

  // Age: very advanced jargon for grade 1–2
  const grades = q.grades || [];
  const hardTerms = /\b(mitochondria|photosynthesis|hemoglobin|neuron synapse|osmosis)\b/i;
  if (grades.some((g) => g <= 2) && hardTerms.test(d.stem + " " + correct)) {
    push("age_mismatch", q.id, "advanced_term_early_grade");
  }
}

// Overlay orphan keys
for (const id of Object.keys(SCIENCE_EN_OVERLAY)) {
  if (!ids.has(id)) push("structural", id, "overlay_orphan");
}

const summary = Object.fromEntries(
  Object.entries(findings).map(([k, v]) => [k, v.length])
);

const report = {
  totalRecords: SCIENCE_QUESTIONS.length,
  uniqueIds: ids.size,
  overlayKeys: Object.keys(SCIENCE_EN_OVERLAY).length,
  userFacingStrings: stringCount,
  emptyFields: emptyFixedCandidates,
  duplicateOptionQuestions: dupOpts,
  placeholders,
  findingCounts: summary,
  findings: Object.fromEntries(
    Object.entries(findings).map(([k, v]) => [k, v.slice(0, 40)])
  ),
};

fs.mkdirSync("reports/science-en-qa", { recursive: true });
fs.writeFileSync(
  "reports/science-en-qa/second-pass-review.json",
  JSON.stringify(report, null, 2)
);
console.log(JSON.stringify({ ...report, findings: undefined }, null, 2));
console.log("wrote reports/science-en-qa/second-pass-review.json");
