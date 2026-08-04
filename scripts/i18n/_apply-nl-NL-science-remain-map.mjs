/**
 * Apply curated remain EN→NL map onto science overlay fields that still leak English.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");
const MAP = JSON.parse(fs.readFileSync(path.join(__dirname, "_science-nl-NL-remain-map.json"), "utf8"));

const { SCIENCE_EN_OVERLAY: EN } = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
const { SCIENCE_NL_NL_OVERLAY: NL } = await import(pathToFileURL(OUT).href);

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

let patched = 0;
const out = {};
for (const id of Object.keys(EN)) {
  const en = EN[id];
  const nl = clone(NL[id] || {});
  const apply = (enVal, current, setter) => {
    const key = String(enVal ?? "");
    if (key && Object.prototype.hasOwnProperty.call(MAP, key)) {
      const next = MAP[key];
      if (current !== next) {
        setter(next);
        patched++;
      }
    }
  };

  apply(en.stem, nl.stem, (v) => {
    nl.stem = v;
  });
  apply(en.explanation, nl.explanation, (v) => {
    nl.explanation = v;
  });
  if (Array.isArray(en.options)) {
    nl.options = Array.isArray(nl.options) ? [...nl.options] : [...en.options];
    en.options.forEach((o, i) => {
      apply(o, nl.options[i], (v) => {
        nl.options[i] = v;
      });
    });
  }
  if (Array.isArray(en.theoryLines)) {
    nl.theoryLines = Array.isArray(nl.theoryLines) ? [...nl.theoryLines] : [...en.theoryLines];
    en.theoryLines.forEach((t, i) => {
      apply(t, nl.theoryLines[i], (v) => {
        nl.theoryLines[i] = v;
      });
    });
  }
  // preserve non-prose fields from existing NL if present
  for (const k of Object.keys(NL[id] || {})) {
    if (!["stem", "explanation", "options", "theoryLines"].includes(k) && nl[k] === undefined) {
      nl[k] = NL[id][k];
    }
  }
  out[id] = { ...NL[id], ...nl };
}

const header = `/**
 * Netherlands Dutch (nl-NL) overlay for science questions.
 * Prose only — IDs, answers, correctIndex, params, diagnostics, curriculum unchanged vs EN authority.
 */
`;

const body = `export const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(out, null, 2)};\n`;
fs.writeFileSync(OUT, header + body, "utf8");
console.log({ ids: Object.keys(out).length, patched });
