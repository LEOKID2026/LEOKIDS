/**
 * Final Phase 4B defect classification (brands/code/learning ≠ defects).
 */
import fs from "node:fs";

const audit = JSON.parse(fs.readFileSync("artifacts/id-ID-phase4b/parity-audit.json", "utf8"));

function isBrandOrTechnical(line) {
  const v = line.split(": ").slice(1).join(": ");
  if (/Leo (Bot|Safari|Superhero)/.test(v)) return true;
  if (/^\{[a-zA-Z_]+\}/.test(v) && v.length < 40) return true; // placeholder-only templates
  if (/threshold &&|ballX|ballY|spawnAt|getCoords|setPhase\(|New game"/.test(v)) return true;
  if (/&&\s*\r?\n|\.index\)\[/.test(v)) return true;
  return false;
}

function isEnglishLearning(line) {
  return /leo-word-detective|leo-word-train-data|The kids played board games|Rainy day and games|The apple is ___/.test(
    line
  );
}

const unexplained = audit.unexplainedEnglishUi.filter((x) => !isBrandOrTechnical(x) && !isEnglishLearning(x));
const gameTerm = audit.gameTermDefects.filter((x) => !isBrandOrTechnical(x) && !isEnglishLearning(x));

const intentional = new Set(audit.intentionalEnglish);
for (const line of audit.unexplainedEnglishUi) {
  if (isEnglishLearning(line)) intentional.add(line.split(": ")[0]);
}
for (const line of audit.gameTermDefects) {
  if (isEnglishLearning(line)) intentional.add(line.split(": ")[0]);
}

const out = {
  families: audit.families,
  global: audit.global,
  intentionalEnglishLearningValues: intentional.size,
  unexplainedEnglishUi: unexplained.length,
  unexplainedSample: unexplained,
  gameTerminologyDefects: gameTerm.length,
  gameTermSample: gameTerm,
  studentTerminologyDefects: audit.studentTermDefects.length,
  gradeTerminologyDefects: audit.gradeTermDefects.length,
  registerDefects: audit.registerDefects.length,
};

fs.writeFileSync("artifacts/id-ID-phase4b/final-classification.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
