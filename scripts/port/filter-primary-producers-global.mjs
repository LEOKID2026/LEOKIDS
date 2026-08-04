import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ALL_TAXONOMY_ROWS } from "../../utils/diagnostic-engine-v2/taxonomy-registry.js";
import { RULE_PRIMARY_PRODUCER } from "../../lib/learning/taxonomy-rule-primary-producers.js";

const ids = new Set(ALL_TAXONOMY_ROWS.map((r) => r.id));
/** @type {Record<string, typeof RULE_PRIMARY_PRODUCER[string]>} */
const filtered = {};
for (const [k, v] of Object.entries(RULE_PRIMARY_PRODUCER)) {
  if (ids.has(k)) filtered[k] = v;
}

const path = fileURLToPath(new URL("../../lib/learning/taxonomy-rule-primary-producers.js", import.meta.url));
let src = readFileSync(path, "utf8");
const start = src.indexOf("export const RULE_PRIMARY_PRODUCER = Object.freeze({");
const closeIdx = src.indexOf("});", start);
if (start < 0 || closeIdx < 0) throw new Error("markers not found");
const end = closeIdx + 3;

const body = Object.entries(filtered)
  .map(([id, row]) => {
    const parts = [
      `  "${id}": { tag: ${JSON.stringify(row.tag)}, module: ${JSON.stringify(row.module)}, generator: ${JSON.stringify(row.generator)}, active: ${row.active}`,
    ];
    if (row.probeKind) parts[0] += `, probeKind: ${JSON.stringify(row.probeKind)}`;
    parts[0] += " },";
    return parts[0];
  })
  .join("\n");

src = `${src.slice(0, start)}export const RULE_PRIMARY_PRODUCER = Object.freeze({\n${body}\n});${src.slice(end)}`;
writeFileSync(path, src);
console.log(`filtered primary producers: ${Object.keys(filtered).length}`);
