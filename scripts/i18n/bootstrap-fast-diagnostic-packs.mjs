import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(root, "content-packs/en/learning");

function extractFromOldProbeMap() {
  const src = fs.readFileSync(path.join(root, "tmp/probe-map-old.js"), "utf8");
  const fbMatch = src.match(/const EN_GRAMMAR_PROBE_FALLBACK = (\{[\s\S]*?\});/);
  if (!fbMatch) throw new Error("EN_GRAMMAR_PROBE_FALLBACK missing");
  const tagMatch = src.match(/export const PROBE_BY_ERROR_TAG = (\{[\s\S]*?\});/);
  const skillMatch = src.match(/export const PROBE_BY_DIAGNOSTIC_SKILL_ID = (\{[\s\S]*?\});/);
  if (!tagMatch || !skillMatch) throw new Error("probe maps missing");

  const ctx = {
    EN_GRAMMAR_PROBE_FALLBACK: vm.runInNewContext(`(${fbMatch[1]})`, {}),
  };
  const tags = vm.runInNewContext(`(${tagMatch[1]})`, ctx);
  const skills = vm.runInNewContext(`(${skillMatch[1]})`, ctx);

  /** @param {Record<string, { skill: string, suggestedQuestionType: string, reasonHe: string }>} map */
  function normalize(map) {
    /** @type {Record<string, { skill: string, suggestedQuestionType: string, reason: string }>} */
    const out = {};
    for (const [key, val] of Object.entries(map)) {
      out[key] = {
        skill: val.skill,
        suggestedQuestionType: val.suggestedQuestionType,
        reason: val.reasonHe,
      };
    }
    return out;
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "fast-diagnostic-probes.json"),
    `${JSON.stringify(
      {
        probesByErrorTag: normalize(tags),
        probesByDiagnosticSkillId: normalize(skills),
      },
      null,
      2
    )}\n`,
    "utf8"
  );
  console.log("probes", Object.keys(tags).length, Object.keys(skills).length);
}

function extractFromOldParentCopy() {
  const src = fs.readFileSync(path.join(root, "tmp/parent-copy-old.js"), "utf8");
  const m = src.match(/export const TAG_LABEL_EN = ([\s\S]*?);\r?\n\r?\n\/\*\* @deprecated/);
  if (!m) throw new Error("TAG_LABEL_EN missing");
  const tags = vm.runInNewContext(`(${m[1]})`, {});
  fs.writeFileSync(
    path.join(outDir, "fast-diagnostic-tag-labels.json"),
    `${JSON.stringify({ tagLabels: tags }, null, 2)}\n`,
    "utf8"
  );
  console.log("tag labels", Object.keys(tags).length);
}

extractFromOldProbeMap();
extractFromOldParentCopy();
