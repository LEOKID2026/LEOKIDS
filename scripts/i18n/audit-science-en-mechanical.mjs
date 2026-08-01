/**
 * Detect mechanical / broken Science EN user-facing text.
 * Does not modify files — reports only.
 */
import { SCIENCE_QUESTIONS } from "../../data/science-questions.js";
import { SCIENCE_EN_OVERLAY } from "../../data/science-questions-en-overlay.js";
import fs from "fs";

const SUSPICIOUS = [
  /\bmain of\b/i,
  /\bMain of\b/,
  /\bHow \w+ to \w+/i,
  /\bWhat main\b/i,
  /\bSystem \w+ on\b/i,
  /\bto materials\b/i,
  /\bon in\b/i,
  /\bfrom sun\b/i,
  /\bWithout \w+ body\b/i,
  /,+\./,
  /^\s*\.\s*$/,
  /\bway best most\b/i,
  /\bdescribes way\b/i,
  /\bParts body\b/i,
  /\bOxygen air\b/i,
  /^Blood with oxygen\.\s*$/i,
  /\bMuscles bones\b/i,
  /\bto to\b/i,
  /\bof of\b/i,
  /\bin in\b/i,
  /\bthe the\b/i,
  /\bSystem \w+\.\s*$/,
  /\bthrough \w+ through\b/i,
  /\bnot bones\b/i,
  /\bair to blood\b/i,
  /\bbrain to muscles\b/i,
  /\bon heat body\b/i,
  /\bEnergy\.\s*$/,
  /\bBody\.\s*$/,
  /\bOn heat\b/i,
];

function issuesForText(text, field) {
  const s = String(text ?? "");
  const out = [];
  if (!s.trim()) out.push(`${field}:empty`);
  if (/^science question\.?$/i.test(s.trim())) out.push(`${field}:placeholder_science_question`);
  if (/\b(TODO|FIXME|TBD|PLACEHOLDER|lorem ipsum)\b/i.test(s)) out.push(`${field}:placeholder`);
  if (field === "stem" && s.trim().length > 0 && s.trim().length < 12) {
    out.push(`${field}:too_short`);
  }
  for (const re of SUSPICIOUS) {
    if (re.test(s)) out.push(`${field}:pattern:${re.source.slice(0, 40)}`);
  }
  // Very short option that looks like a fragment (not a number/single noun answer)
  if (field.startsWith("option") || field === "stem" || field === "explanation") {
    const words = s.trim().split(/\s+/).filter(Boolean);
    if (words.length > 0 && words.length <= 2 && /[a-z]/.test(s) && !/^[A-Z][a-z]+$/.test(s.trim().replace(/\.$/, ""))) {
      // "Energy." / "Body." style
      if (/^[A-Z][a-z]+\.$/.test(s.trim())) out.push(`${field}:one_word_sentence`);
    }
    // Missing articles heuristic for longer stems that look telegraphic
    if (field === "stem" && words.length >= 4 && words.length <= 12) {
      const hasArticle = /\b(a|an|the|what|which|how|why|where|when|who|do|does|is|are|can)\b/i.test(s);
      const hasVerb = /\b(is|are|do|does|can|help|make|move|carry|take|bring|describe|use|have|has)\b/i.test(s);
      if (!hasArticle && !hasVerb) out.push(`${field}:telegraphic`);
    }
  }
  return out;
}

function displayRow(q) {
  const ov = SCIENCE_EN_OVERLAY[q.id] || {};
  return {
    id: q.id,
    topic: q.topic,
    grades: q.grades,
    correctIndex: q.correctIndex,
    stem: ov.stem ?? q.stem,
    options: ov.options ?? q.options,
    explanation: ov.explanation ?? q.explanation,
    theoryLines: ov.theoryLines ?? q.theoryLines,
    patternFamily: q.params?.patternFamily,
    conceptTag: q.params?.conceptTag,
    diagnosticSkillId: q.params?.diagnosticSkillId,
    skillId: q.skillId || q.params?.diagnosticSkillId,
  };
}

const flagged = [];
let stringCount = 0;
for (const q of SCIENCE_QUESTIONS) {
  const d = displayRow(q);
  const issues = [];
  stringCount += 1; // stem
  issues.push(...issuesForText(d.stem, "stem"));
  for (let i = 0; i < (d.options || []).length; i++) {
    stringCount += 1;
    issues.push(...issuesForText(d.options[i], `option${i}`));
  }
  stringCount += 1;
  issues.push(...issuesForText(d.explanation, "explanation"));
  for (let i = 0; i < (d.theoryLines || []).length; i++) {
    stringCount += 1;
    issues.push(...issuesForText(d.theoryLines[i], `theory${i}`));
  }
  // duplicate options
  const opts = (d.options || []).map((o) => String(o).trim().toLowerCase());
  if (new Set(opts).size !== opts.length) issues.push("duplicate_options");
  if (d.correctIndex < 0 || d.correctIndex >= opts.length) issues.push("correctIndex_oob");

  if (issues.length) {
    flagged.push({ id: d.id, topic: d.topic, issues: [...new Set(issues)], stem: d.stem });
  }
}

const report = {
  totalRecords: SCIENCE_QUESTIONS.length,
  userFacingStringsApprox: stringCount,
  flaggedCount: flagged.length,
  cleanCount: SCIENCE_QUESTIONS.length - flagged.length,
  byTopic: {},
};
for (const f of flagged) {
  report.byTopic[f.topic] = (report.byTopic[f.topic] || 0) + 1;
}

fs.mkdirSync("reports/science-en-qa", { recursive: true });
fs.writeFileSync(
  "reports/science-en-qa/mechanical-flags.json",
  JSON.stringify({ report, flagged }, null, 2)
);
console.log(JSON.stringify(report, null, 2));
console.log("wrote reports/science-en-qa/mechanical-flags.json");
