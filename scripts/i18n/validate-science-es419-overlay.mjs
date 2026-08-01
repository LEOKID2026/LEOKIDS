/**
 * Validate Science es-419 overlay vs EN source bank.
 */
import fs from "fs";
import { SCIENCE_QUESTIONS } from "../../data/science-questions.js";
import { SCIENCE_ES_419_OVERLAY } from "../../data/science-questions-es-419-overlay.js";
import { FORBIDDEN_ES_LATAM_PATTERNS } from "../../lib/i18n/spanish-latam-glossary.js";

const HEBREW = /[\u0590-\u05FF]/;
const PLACEHOLDER = /(?:^|[^A-Za-zÁÉÍÓÚáéíóúÑñ])(?:TODO|FIXME|TBD|PLACEHOLDER|Science question|lorem ipsum)(?:[^A-Za-zÁÉÍÓÚáéíóúÑñ]|$)/;
// Common English leftovers (allow scientific proper nouns separately)
const ENGLISH_LEAK =
  /\b(What|Which|How|Why|Where|When|the|and|with|from|into|through|because|should|would|could|does|do not|don't|isn't|heart|lungs|blood|plants?|animals?|Earth|Sun|Moon|hypothesis|experiment)\b/;

const ALLOW_ENGLISH_RE =
  /\b(DNA|UV|CO₂|CO2|O₂|O2|pH|GPS)\b/;

function scanText(s, id, field, findings) {
  const t = String(s ?? "");
  if (!t.trim()) findings.push({ id, cat: "missing_field", detail: field });
  if (HEBREW.test(t)) findings.push({ id, cat: "Hebrew leakage", detail: field });
  if (PLACEHOLDER.test(t)) findings.push({ id, cat: "missing_field", detail: `placeholder:${field}` });
  for (const p of FORBIDDEN_ES_LATAM_PATTERNS) {
    if (p.re.test(t)) findings.push({ id, cat: "regional wording", detail: `${field}:${p.id}` });
  }
  // English leak heuristic: skip if mostly Spanish (has áéíóúñ¿¡ or common Spanish words)
  const spanishCue = /[áéíóúñ¿¡]|\b(qué|cuál|cómo|por qué|dónde|el|la|los|las|un|una|de|en|para|con|que|es|son|del|al)\b/i.test(t);
  if (!spanishCue && ENGLISH_LEAK.test(t) && !ALLOW_ENGLISH_RE.test(t) && t.length > 8) {
    findings.push({ id, cat: "English leakage", detail: `${field}:${t.slice(0, 60)}` });
  }
}

const sourceIds = SCIENCE_QUESTIONS.map((q) => q.id);
const overlayIds = Object.keys(SCIENCE_ES_419_OVERLAY);
const sourceSet = new Set(sourceIds);
const overlaySet = new Set(overlayIds);

const missing = sourceIds.filter((id) => !overlaySet.has(id));
const extra = overlayIds.filter((id) => !sourceSet.has(id));
const findings = [];
let stringCount = 0;
let incomplete = 0;
let dupOpts = 0;

for (const q of SCIENCE_QUESTIONS) {
  const ov = SCIENCE_ES_419_OVERLAY[q.id];
  if (!ov) {
    incomplete += 1;
    continue;
  }
  if (!ov.stem || !ov.explanation || !Array.isArray(ov.options)) {
    incomplete += 1;
    findings.push({ id: q.id, cat: "missing_field", detail: "required" });
    continue;
  }
  if (ov.options.length !== q.options.length) {
    findings.push({ id: q.id, cat: "correct-answer change", detail: "option_count" });
  }
  const norms = ov.options.map((o) => String(o).trim().toLowerCase());
  if (new Set(norms).size !== norms.length) {
    dupOpts += 1;
    findings.push({ id: q.id, cat: "duplicate translated options", detail: norms.join(" | ") });
  }
  stringCount += 1 + ov.options.length + 1;
  scanText(ov.stem, q.id, "stem", findings);
  ov.options.forEach((o, i) => scanText(o, q.id, `option${i}`, findings));
  scanText(ov.explanation, q.id, "explanation", findings);
  if (Array.isArray(q.theoryLines) && q.theoryLines.length) {
    if (!Array.isArray(ov.theoryLines) || ov.theoryLines.length !== q.theoryLines.length) {
      findings.push({ id: q.id, cat: "missing_field", detail: "theoryLines" });
      incomplete += 1;
    } else {
      ov.theoryLines.forEach((t, i) => {
        stringCount += 1;
        scanText(t, q.id, `theory${i}`, findings);
      });
    }
  }
}

const byCat = {};
for (const f of findings) byCat[f.cat] = (byCat[f.cat] || 0) + 1;

const report = {
  sourceRecords: sourceIds.length,
  overlayRecords: overlayIds.length,
  missing: missing.length,
  extra: extra.length,
  duplicateIds: overlayIds.length - overlaySet.size,
  incomplete,
  duplicateOptionsQuestions: dupOpts,
  userFacingStringsApprox: stringCount,
  findingCounts: byCat,
  findingsSample: findings.slice(0, 80),
  missingSample: missing.slice(0, 30),
  contractComplete:
    missing.length === 0 &&
    extra.length === 0 &&
    incomplete === 0 &&
    sourceIds.length === overlayIds.length &&
    sourceIds.length === 1017,
};

fs.mkdirSync("reports/science-es419", { recursive: true });
fs.writeFileSync(
  "reports/science-es419/validate-report.json",
  JSON.stringify(report, null, 2)
);
console.log(JSON.stringify(report, null, 2));
