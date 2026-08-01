/**
 * Apply Science EN text patches to bank + overlay.
 * Patch file: { patches: [ { id, stem, options, explanation, theoryLines? } ] }
 * Preserves correctIndex and all non-text fields.
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const PATCH_DIR = "reports/science-en-qa/patches";
const BANK_PATH = "data/science-questions.js";
const OVERLAY_PATH = "data/science-questions-en-overlay.js";

function loadPatches() {
  /** @type {Map<string, any>} */
  const map = new Map();
  if (!fs.existsSync(PATCH_DIR)) return map;
  for (const name of fs.readdirSync(PATCH_DIR).sort()) {
    if (!name.endsWith(".json")) continue;
    const raw = JSON.parse(fs.readFileSync(path.join(PATCH_DIR, name), "utf8"));
    const list = Array.isArray(raw) ? raw : raw.patches || raw.records || [];
    for (const p of list) {
      if (!p?.id) continue;
      map.set(String(p.id), p);
    }
  }
  return map;
}

function applyToObj(target, patch) {
  if (typeof patch.stem === "string") target.stem = patch.stem;
  if (Array.isArray(patch.options)) target.options = [...patch.options];
  if (typeof patch.explanation === "string") target.explanation = patch.explanation;
  if (Array.isArray(patch.theoryLines)) target.theoryLines = [...patch.theoryLines];
  else if (patch.theoryLines === null) delete target.theoryLines;
}

async function main() {
  const patches = loadPatches();
  console.log("patches_loaded", patches.size);
  if (!patches.size) {
    console.log("no patches");
    return;
  }

  const bankMod = await import(pathToFileURL(path.resolve(BANK_PATH)).href);
  const overlayMod = await import(pathToFileURL(path.resolve(OVERLAY_PATH)).href);
  const questions = bankMod.SCIENCE_QUESTIONS;
  const overlay = { ...overlayMod.SCIENCE_EN_OVERLAY };

  let bankHits = 0;
  let overlayHits = 0;
  const missing = [];
  for (const [id, patch] of patches) {
    const q = questions.find((r) => r.id === id);
    if (!q) {
      missing.push(id);
      continue;
    }
    // Validate option count / correctIndex intact
    const opts = patch.options || q.options;
    if (!Array.isArray(opts) || opts.length !== (q.options || []).length) {
      throw new Error(`option count mismatch for ${id}`);
    }
    if (q.correctIndex < 0 || q.correctIndex >= opts.length) {
      throw new Error(`correctIndex oob ${id}`);
    }
    applyToObj(q, patch);
    bankHits += 1;
    if (!overlay[id]) overlay[id] = {};
    applyToObj(overlay[id], patch);
    // Ensure overlay has required fields
    overlay[id].stem = q.stem;
    overlay[id].options = [...q.options];
    overlay[id].explanation = q.explanation;
    if (q.theoryLines) overlay[id].theoryLines = [...q.theoryLines];
    else delete overlay[id].theoryLines;
    overlayHits += 1;
  }

  // Rewrite bank file carefully: only SCIENCE_QUESTIONS array content is huge.
  // Prefer regenerating overlay fully; for bank, use structured serialize of inline+keep phase3 import.
  const phase3Ids = new Set(
    (await import(pathToFileURL(path.resolve("data/science-questions-phase3.js")).href))
      .SCIENCE_QUESTIONS_PHASE3.map((q) => q.id)
  );
  const inline = questions.filter((q) => !phase3Ids.has(q.id));
  const phase3 = questions.filter((q) => phase3Ids.has(q.id));

  // Update phase3 file
  const phase3Src =
    `// Metadata enrichment (safe pass): see science metadata reports.\n` +
    `export const SCIENCE_QUESTIONS_PHASE3 = ${JSON.stringify(phase3, null, 2)};\n`;
  fs.writeFileSync("data/science-questions-phase3.js", phase3Src);

  const bankSrc =
    `// grades[] must list only grades where topic appears in SCIENCE_GRADES[g].topics (data/science-curriculum.js).\n` +
    `// Maintainer realignment: node scripts/fix-science-grades-metadata.mjs\n` +
    `// English source conversion: node scripts/i18n/convert-science-banks-to-english.mjs\n` +
    `// Natural EN QA: node scripts/i18n/apply-science-en-patches.mjs\n` +
    `import { SCIENCE_QUESTIONS_PHASE3 } from "./science-questions-phase3.js";\n\n` +
    `export const SCIENCE_QUESTIONS = ${JSON.stringify(inline, null, 2)}.concat(SCIENCE_QUESTIONS_PHASE3);\n`;
  fs.writeFileSync(BANK_PATH, bankSrc);

  const overlaySrc =
    `/** English display overlay for science questions (Natural American English). */\n` +
    `export const SCIENCE_EN_OVERLAY = ${JSON.stringify(overlay, null, 2)};\n`;
  fs.writeFileSync(OVERLAY_PATH, overlaySrc);

  console.log(
    JSON.stringify(
      { bankHits, overlayHits, missing, inline: inline.length, phase3: phase3.length },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
