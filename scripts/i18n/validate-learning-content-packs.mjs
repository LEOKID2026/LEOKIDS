/**
 * Validate learning content pack parity (structure ↔ locale content).
 * Run: node scripts/i18n/validate-learning-content-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeTaxonomyRows } from "../../utils/diagnostic-engine-v2/taxonomy-merge.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const taxonomyDir = path.join(root, "content-packs/en/learning/taxonomy");
const subjects = ["math", "geometry", "english", "science"];

/** @type {string[]} */
const errors = [];

function readJson(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    errors.push(`missing file: ${rel}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (err) {
    errors.push(`invalid JSON ${rel}: ${err.message}`);
    return null;
  }
}

for (const subject of subjects) {
  const structure = readJson(`content-packs/en/learning/taxonomy/${subject}.structure.json`);
  const content = readJson(`content-packs/en/learning/taxonomy/${subject}.content.json`);
  if (!structure || !content) continue;

  const ids = new Set(structure.rows.map((r) => r.id));
  const contentIds = new Set(Object.keys(content.rows || {}));

  for (const id of ids) {
    if (!contentIds.has(id)) errors.push(`taxonomy ${subject}: missing content for ${id}`);
    else {
      const row = content.rows[id];
      for (const field of ["domain", "topic", "subskill", "pattern", "probe", "intervention", "escalation"]) {
        if (!row[field] || !String(row[field]).trim()) errors.push(`taxonomy ${subject}/${id}: missing ${field}`);
      }
    }
  }
  for (const id of contentIds) {
    if (!ids.has(id)) errors.push(`taxonomy ${subject}: orphan content id ${id}`);
  }
  if (new Set(ids).size !== ids.size) errors.push(`taxonomy ${subject}: duplicate structure ids`);

  const merged = mergeTaxonomyRows(structure.rows, content.rows);
  if (merged.length !== structure.rows.length) errors.push(`taxonomy ${subject}: merge count mismatch`);
}

const probes = readJson("content-packs/en/learning/fast-diagnostic-probes.json");
if (probes) {
  for (const mapName of ["probesByErrorTag", "probesByDiagnosticSkillId"]) {
    const map = probes[mapName] || {};
    for (const [key, row] of Object.entries(map)) {
      if (!row.skill?.trim()) errors.push(`probes ${mapName}/${key}: missing skill`);
      if (!row.reason?.trim()) errors.push(`probes ${mapName}/${key}: missing reason`);
      if (!row.suggestedQuestionType?.trim()) errors.push(`probes ${mapName}/${key}: missing suggestedQuestionType`);
    }
  }
}

const animTitles = readJson("content-packs/en/learning/math-animation-titles.json");
if (animTitles && (!animTitles.titles || Object.keys(animTitles.titles).length < 50)) {
  errors.push("math-animation-titles: expected at least 50 title keys");
}

if (errors.length) {
  console.error("validate-learning-content-packs FAILED");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log("validate-learning-content-packs OK");
