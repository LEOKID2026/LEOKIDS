/**
 * Merge rest-id-*.json arrays with dict-missing.json → dict-overrides-rest.json
 * Arrays must be index-aligned with missing-00..06 / dict-missing.
 */
import fs from "fs";
import path from "path";

const ART = path.join(process.cwd(), "artifacts/id-ID-phase4d");
const missing = JSON.parse(fs.readFileSync(path.join(ART, "dict-missing.json"), "utf8"));

const parts = [];
for (const f of ["00", "01", "02", "03", "04", "05", "06"]) {
  const p = path.join(ART, `rest-id-${f}.json`);
  if (!fs.existsSync(p)) {
    console.error("missing chunk", p);
    process.exit(1);
  }
  const arr = JSON.parse(fs.readFileSync(p, "utf8"));
  parts.push(...arr);
}

if (parts.length !== missing.length) {
  console.error({ expected: missing.length, got: parts.length });
  process.exit(1);
}

function placeholders(s) {
  return (String(s).match(/\{[a-zA-Z0-9_]+\}/g) || []).sort();
}

const out = {};
const phBad = [];
for (let i = 0; i < missing.length; i++) {
  const en = missing[i];
  const id = parts[i];
  if (typeof id !== "string" || !id.length) {
    console.error("empty at", i, en.slice(0, 80));
    process.exit(1);
  }
  if (placeholders(en).join() !== placeholders(id).join()) {
    phBad.push({ i, en, id });
  }
  out[en] = id;
}

fs.writeFileSync(path.join(ART, "dict-overrides-rest.json"), JSON.stringify(out, null, 2) + "\n");
console.log({
  entries: Object.keys(out).length,
  placeholderMismatch: phBad.length,
  sampleBad: phBad.slice(0, 5),
});
if (phBad.length) process.exitCode = 1;
