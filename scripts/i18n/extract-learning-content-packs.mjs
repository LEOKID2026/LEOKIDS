/**
 * Extract learning content packs from runtime source files (one-time / refresh helper).
 * Run: node scripts/i18n/extract-learning-content-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(root, "content-packs/en/learning");

const TAXONOMY_FILES = [
  ["math", "utils/diagnostic-engine-v2/taxonomy-math.js", "MATH_TAXONOMY_ROWS"],
  ["geometry", "utils/diagnostic-engine-v2/taxonomy-geometry.js", "GEOMETRY_TAXONOMY_ROWS"],
  ["english", "utils/diagnostic-engine-v2/taxonomy-english.js", "ENGLISH_TAXONOMY_ROWS"],
  ["science", "utils/diagnostic-engine-v2/taxonomy-science.js", "SCIENCE_TAXONOMY_ROWS"],
];

const CONTENT_STRING_FIELDS = [
  "domainHe",
  "topicHe",
  "subskillHe",
  "patternHe",
  "counterEvidenceHe",
  "countsWhenHe",
  "doesNotCountWhenHe",
  "probeHe",
  "interventionHe",
  "escalationHe",
];

const CONTENT_ARRAY_FIELDS = [
  "observableMarkersHe",
  "rootsHe",
  "competitorsHe",
  "doNotConcludeHe",
];

const NEUTRAL_FIELDS = ["id", "subjectId", "minWrong", "minDistinctPatternFamilies", "minDistinctDays"];

/**
 * @param {string} filePath
 * @param {string} exportName
 */
function extractExportArray(filePath, exportName) {
  const src = fs.readFileSync(path.join(root, filePath), "utf8");
  const re = new RegExp(`export const ${exportName} = ([\\s\\S]*?);\\r?\\n`, "m");
  const m = src.match(re);
  if (!m) throw new Error(`missing ${exportName} in ${filePath}`);
  return vm.runInNewContext(`(${m[1]})`, {});
}

/**
 * @param {Record<string, unknown>} row
 */
function splitTaxonomyRow(row) {
  /** @type {Record<string, unknown>} */
  const structure = {};
  /** @type {Record<string, unknown>} */
  const content = { id: row.id };

  for (const key of NEUTRAL_FIELDS) {
    if (row[key] !== undefined) structure[key] = row[key];
  }

  const fieldMap = {
    domainHe: "domain",
    topicHe: "topic",
    subskillHe: "subskill",
    patternHe: "pattern",
    counterEvidenceHe: "counterEvidence",
    countsWhenHe: "countsWhen",
    doesNotCountWhenHe: "doesNotCountWhen",
    probeHe: "probe",
    interventionHe: "intervention",
    escalationHe: "escalation",
    observableMarkersHe: "observableMarkers",
    rootsHe: "roots",
    competitorsHe: "competitors",
    doNotConcludeHe: "doNotConclude",
  };

  for (const [srcKey, dstKey] of Object.entries(fieldMap)) {
    if (row[srcKey] !== undefined) content[dstKey] = row[srcKey];
  }

  return { structure, content };
}

fs.mkdirSync(path.join(outDir, "taxonomy"), { recursive: true });

/** @type {Record<string, { structure: unknown[], content: Record<string, unknown> }>} */
const taxonomyBundles = {};

for (const [subject, filePath, exportName] of TAXONOMY_FILES) {
  const rows = extractExportArray(filePath, exportName);
  const structure = [];
  /** @type {Record<string, unknown>} */
  const contentById = {};

  for (const row of rows) {
    const split = splitTaxonomyRow(row);
    structure.push(split.structure);
    contentById[String(row.id)] = split.content;
  }

  taxonomyBundles[subject] = { structure, content: contentById };

  fs.writeFileSync(
    path.join(outDir, "taxonomy", `${subject}.structure.json`),
    `${JSON.stringify({ subjectId: subject, rows: structure }, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(outDir, "taxonomy", `${subject}.content.json`),
    `${JSON.stringify({ subjectId: subject, rows: contentById }, null, 2)}\n`,
    "utf8"
  );
  console.log(`taxonomy/${subject}: ${structure.length} rows`);
}

function extractConstObject(filePath, constName) {
  const src = fs.readFileSync(path.join(root, filePath), "utf8");
  const re = new RegExp(`(?:export )?const ${constName} = ([\\s\\S]*?);\\r?\\n`, "m");
  const m = src.match(re);
  if (!m) throw new Error(`missing ${constName} in ${filePath}`);
  return vm.runInNewContext(`(${m[1]})`, {});
}

/** Normalize probe hint maps to content pack shape */
function normalizeProbeMap(map) {
  /** @type {Record<string, { skill: string, suggestedQuestionType: string, reason: string }>} */
  const out = {};
  for (const [key, val] of Object.entries(map || {})) {
    if (!val || typeof val !== "object") continue;
    out[key] = {
      skill: String(val.skill || ""),
      suggestedQuestionType: String(val.suggestedQuestionType || ""),
      reason: String(val.reasonHe || val.reason || ""),
    };
  }
  return out;
}

const probeMod = await import("../../utils/fast-diagnostic-engine/probe-map.js");
const probeByTag = probeMod.PROBE_BY_ERROR_TAG;
const probeBySkill = probeMod.PROBE_BY_DIAGNOSTIC_SKILL_ID;

fs.writeFileSync(
  path.join(outDir, "fast-diagnostic-probes.json"),
  `${JSON.stringify(
    {
      probesByErrorTag: normalizeProbeMap(probeByTag),
      probesByDiagnosticSkillId: normalizeProbeMap(probeBySkill),
    },
    null,
    2
  )}\n`,
  "utf8"
);
console.log(
  `fast-diagnostic-probes: ${Object.keys(probeByTag).length} tags, ${Object.keys(probeBySkill).length} skills`
);

const parentMod = await import("../../utils/fast-diagnostic-engine/parent-copy.js");
fs.writeFileSync(
  path.join(outDir, "fast-diagnostic-tag-labels.json"),
  `${JSON.stringify({ tagLabels: parentMod.TAG_LABEL_EN }, null, 2)}\n`,
  "utf8"
);
console.log(`fast-diagnostic-tag-labels: ${Object.keys(parentMod.TAG_LABEL_EN).length} tags`);

console.log("Done.");
