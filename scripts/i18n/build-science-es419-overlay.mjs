/**
 * Merge topic translation JSON files into data/science-questions-es-419-overlay.js
 * Expects reports/science-es419/out-*.json with { patches: [ { id, stem, options, explanation, theoryLines? } ] }
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const OUT_DIR = "reports/science-es419";
const TARGET = "data/science-questions-es-419-overlay.js";

async function main() {
  const { SCIENCE_QUESTIONS } = await import(
    pathToFileURL(path.resolve("data/science-questions.js")).href
  );
  const byId = Object.fromEntries(SCIENCE_QUESTIONS.map((q) => [q.id, q]));
  const overlay = {};
  const files = fs
    .readdirSync(OUT_DIR)
    .filter((f) => f.startsWith("out-") && f.endsWith(".json"))
    .sort();

  let loaded = 0;
  for (const name of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(OUT_DIR, name), "utf8"));
    const list = Array.isArray(raw) ? raw : raw.patches || raw.records || [];
    for (const p of list) {
      if (!p?.id) continue;
      const src = byId[p.id];
      if (!src) throw new Error(`unknown id ${p.id} in ${name}`);
      if (!Array.isArray(p.options) || p.options.length !== src.options.length) {
        throw new Error(`option count mismatch ${p.id} in ${name}`);
      }
      if (!p.stem || !p.explanation || p.options.some((o) => !String(o || "").trim())) {
        throw new Error(`incomplete ${p.id} in ${name}`);
      }
      const entry = {
        stem: p.stem,
        options: [...p.options],
        explanation: p.explanation,
      };
      if (Array.isArray(p.theoryLines) && p.theoryLines.length) {
        entry.theoryLines = [...p.theoryLines];
      } else if (Array.isArray(src.theoryLines) && src.theoryLines.length) {
        throw new Error(`missing theoryLines for ${p.id} in ${name}`);
      }
      if (typeof p.hint === "string") entry.hint = p.hint;
      if (typeof p.feedback === "string") entry.feedback = p.feedback;
      overlay[p.id] = entry;
      loaded += 1;
    }
  }

  const missing = SCIENCE_QUESTIONS.filter((q) => !overlay[q.id]).map((q) => q.id);
  fs.writeFileSync(
    TARGET,
    `/** Science MCQ display overlay for es-419 (LatAm Spanish). */\nexport const SCIENCE_ES_419_OVERLAY = ${JSON.stringify(overlay, null, 2)};\n`,
    "utf8"
  );
  fs.writeFileSync(
    path.join(OUT_DIR, "merge-report.json"),
    JSON.stringify(
      {
        files,
        loadedEntries: Object.keys(overlay).length,
        patchApplications: loaded,
        expected: SCIENCE_QUESTIONS.length,
        missingCount: missing.length,
        missing: missing.slice(0, 50),
      },
      null,
      2
    )
  );
  console.log(
    JSON.stringify(
      {
        files: files.length,
        overlay: Object.keys(overlay).length,
        expected: SCIENCE_QUESTIONS.length,
        missing: missing.length,
      },
      null,
      2
    )
  );
  if (missing.length) process.exitCode = 2;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
