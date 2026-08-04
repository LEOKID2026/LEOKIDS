import { readFileSync, writeFileSync } from "node:fs";
import { ALL_TAXONOMY_ROWS } from "../../utils/diagnostic-engine-v2/taxonomy-registry.js";
import { TAXONOMY_EVIDENCE_RULES } from "../../utils/diagnostic-engine-v2/taxonomy-evidence-rules.js";

const ids = new Set(ALL_TAXONOMY_ROWS.map((r) => r.id));
/** @type {Record<string, typeof TAXONOMY_EVIDENCE_RULES[string]>} */
const filtered = {};
for (const [k, v] of Object.entries(TAXONOMY_EVIDENCE_RULES)) {
  if (ids.has(k)) filtered[k] = v;
}

const path = new URL("../../utils/diagnostic-engine-v2/taxonomy-evidence-rules.js", import.meta.url);
let src = readFileSync(path, "utf8");
const start = src.indexOf("export const TAXONOMY_EVIDENCE_RULES = Object.freeze({");
const closeIdx = src.indexOf("});", start);
if (start < 0 || closeIdx < 0) throw new Error("markers not found");
const end = closeIdx + 3;

const body = Object.entries(filtered)
  .map(([id, rule]) => {
    const lines = [
      `  "${id}": {`,
      `    taxonomyId: "${id}",`,
      `    evidenceSource: "${rule.evidenceSource}",`,
      `    requiredTags: ${JSON.stringify(rule.requiredTags)},`,
    ];
    if (rule.questionKinds) lines.push(`    questionKinds: ${JSON.stringify(rule.questionKinds)},`);
    if (rule.minTagMatches != null) lines.push(`    minTagMatches: ${rule.minTagMatches},`);
    if (rule.minRelevantQuestions != null) lines.push(`    minRelevantQuestions: ${rule.minRelevantQuestions},`);
    if (rule.minOccurrenceRatio != null) lines.push(`    minOccurrenceRatio: ${rule.minOccurrenceRatio},`);
    if (rule.requiresDistinctAnswers != null) {
      lines.push(`    requiresDistinctAnswers: ${rule.requiresDistinctAnswers},`);
    }
    if (rule.notesHe) lines.push(`    notesHe: ${JSON.stringify(rule.notesHe)},`);
    lines.push("  },");
    return lines.join("\n");
  })
  .join("\n");

src = `${src.slice(0, start)}export const TAXONOMY_EVIDENCE_RULES = Object.freeze({\n${body}\n});${src.slice(end)}`;
writeFileSync(path, src);
console.log(`filtered rules: ${Object.keys(filtered).length}`);
