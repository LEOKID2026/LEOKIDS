import { readFileSync, writeFileSync } from "node:fs";
import { TAXONOMY_EVIDENCE_RULES } from "../../utils/diagnostic-engine-v2/taxonomy-evidence-rules.js";
import { TAG_PRODUCER_REGISTRY } from "../../lib/learning/taxonomy-tag-producer-registry.js";

const allowedTags = new Set();
for (const rule of Object.values(TAXONOMY_EVIDENCE_RULES)) {
  for (const tag of rule.requiredTags || []) allowedTags.add(tag);
}

/** @type {Record<string, typeof TAG_PRODUCER_REGISTRY[string]>} */
const filtered = {};
for (const [tag, producer] of Object.entries(TAG_PRODUCER_REGISTRY)) {
  if (producer.module === "hebrew-typed-classifier") continue;
  if (!allowedTags.has(tag)) continue;
  filtered[tag] = producer;
}

const path = new URL("../../lib/learning/taxonomy-tag-producer-registry.js", import.meta.url);
let src = readFileSync(path, "utf8");
src = src.replace(
  /\/\*\* @typedef \{"[^"]+"\} ProducerModule \*\//,
  '/** @typedef {"math-numeric-classifier"|"math-mcq-infer"|"mcq-distractor-classifier"|"english-typed-classifier"|"geometry-numeric-classifier"|"question-bank-static"|"probe-params"} ProducerModule */'
);

const start = src.indexOf("export const TAG_PRODUCER_REGISTRY = Object.freeze({");
const closeIdx = src.indexOf("});", start);
if (start < 0 || closeIdx < 0) throw new Error("markers not found");
const end = closeIdx + 3;

const body = Object.entries(filtered)
  .map(([tag, producer]) => {
    const lines = [
      `  ${tag}: {`,
      `    module: "${producer.module}",`,
      `    generator: "${producer.generator}",`,
      `    active: ${producer.active},`,
    ];
    if (producer.notes) lines.push(`    notes: ${JSON.stringify(producer.notes)},`);
    lines.push("  },");
    return lines.join("\n");
  })
  .join("\n");

src = `${src.slice(0, start)}export const TAG_PRODUCER_REGISTRY = Object.freeze({\n${body}\n});${src.slice(end)}`;
writeFileSync(path, src);
console.log(`filtered producers: ${Object.keys(filtered).length}`);
