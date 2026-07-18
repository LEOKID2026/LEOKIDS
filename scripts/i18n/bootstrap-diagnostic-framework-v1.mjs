/**
 * Bootstrap diagnostic-framework-v1 content pack from git HEAD source.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const srcPath = path.join(root, "tmp/diagnostic-framework-v1-old.js");

if (!fs.existsSync(srcPath)) {
  console.error("Run: git show HEAD:utils/learning-diagnostics/diagnostic-framework-v1.js | Out-File -Encoding utf8 tmp/diagnostic-framework-v1-old.js");
  process.exit(1);
}

const src = fs.readFileSync(srcPath, "utf8");
const skillMatch = src.match(/export const SKILL_PACK_BY_SUBJECT_ID = (\{[\s\S]*?\});/);
const frameworkMatch = src.match(/export const PROFESSIONAL_FRAMEWORK_V1 = (\{[\s\S]*?\});/);
if (!skillMatch || !frameworkMatch) throw new Error("exports missing");

const skillPack = vm.runInNewContext(`(${skillMatch[1]})`, {});
const framework = vm.runInNewContext(`(${frameworkMatch[1]})`, {});

/** @type {Record<string, Record<string, { subskills: string[] }>>} */
const structure = {};
/** @type {Record<string, string>} */
const skillLabels = {};

for (const [subjectId, packs] of Object.entries(skillPack)) {
  structure[subjectId] = {};
  for (const [packId, row] of Object.entries(packs)) {
    structure[subjectId][packId] = { subskills: row.subskills };
    skillLabels[`${subjectId}.${packId}`] = row.label;
  }
}

const out = {
  framework: {
    version: framework.version,
    name: framework.name,
    supportedSubjectIds: framework.supportedSubjectIds,
    evidenceLevelEnum: framework.evidenceLevelEnum,
    confidenceEnum: framework.confidenceEnum,
    recommendationTypeEnum: framework.recommendationTypeEnum,
    bannedConclusionPhrases: framework.bannedConclusionPhrases,
  },
  skillPackStructure: structure,
  skillLabels,
};

const outDir = path.join(root, "content-packs/en/learning");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "diagnostic-framework-v1.json"), `${JSON.stringify(out, null, 2)}\n`, "utf8");
console.log("skill labels", Object.keys(skillLabels).length);
