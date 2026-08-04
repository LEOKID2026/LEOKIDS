import { readFileSync } from "node:fs";
import { ALL_TAXONOMY_ROWS } from "../../utils/diagnostic-engine-v2/taxonomy-registry.js";

const src = readFileSync(
  new URL("../../lib/learning/fixtures/taxonomy-real-runtime-fixtures.js", import.meta.url),
  "utf8"
);
const ids = ALL_TAXONOMY_ROWS.map((r) => r.id);
const missing = ids.filter((id) => !src.includes(`"${id}":`));
const extra = [...src.matchAll(/"([A-Z]+-\d+)":/g)]
  .map((m) => m[1])
  .filter((id) => !ids.includes(id));
console.log("missing loaders", missing);
console.log("extra loaders", [...new Set(extra)]);
