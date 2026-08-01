/**
 * Export Science display rows (overlay-preferred) into rewrite batches.
 */
import fs from "fs";
import { SCIENCE_QUESTIONS } from "../../data/science-questions.js";
import { SCIENCE_EN_OVERLAY } from "../../data/science-questions-en-overlay.js";

const flags = JSON.parse(
  fs.readFileSync("reports/science-en-qa/mechanical-flags.json", "utf8")
);
const flaggedIds = new Set(flags.flagged.map((f) => f.id));

function displayRow(q) {
  const ov = SCIENCE_EN_OVERLAY[q.id] || {};
  return {
    id: q.id,
    topic: q.topic,
    grades: q.grades,
    minLevel: q.minLevel,
    maxLevel: q.maxLevel,
    correctIndex: q.correctIndex,
    stem: ov.stem ?? q.stem,
    options: [...(ov.options ?? q.options ?? [])],
    explanation: ov.explanation ?? q.explanation,
    theoryLines: [...(ov.theoryLines ?? q.theoryLines ?? [])],
    patternFamily: q.params?.patternFamily || null,
    conceptTag: q.params?.conceptTag || null,
    diagnosticSkillId: q.params?.diagnosticSkillId || q.skillId || null,
  };
}

const flagged = SCIENCE_QUESTIONS.filter((q) => flaggedIds.has(q.id)).map(displayRow);
const clean = SCIENCE_QUESTIONS.filter((q) => !flaggedIds.has(q.id)).map(displayRow);

fs.mkdirSync("reports/science-en-qa/batches", { recursive: true });
fs.mkdirSync("reports/science-en-qa/patches", { recursive: true });

const BATCH = 70;
let bi = 0;
for (let i = 0; i < flagged.length; i += BATCH) {
  const chunk = flagged.slice(i, i + BATCH);
  const name = `batch-${String(bi).padStart(2, "0")}.json`;
  fs.writeFileSync(
    `reports/science-en-qa/batches/${name}`,
    JSON.stringify({ batch: bi, count: chunk.length, records: chunk }, null, 2)
  );
  bi += 1;
}
fs.writeFileSync(
  "reports/science-en-qa/batches/clean-pass.json",
  JSON.stringify({ count: clean.length, records: clean }, null, 2)
);
console.log(
  JSON.stringify(
    { flagged: flagged.length, clean: clean.length, batches: bi, batchSize: BATCH },
    null,
    2
  )
);
