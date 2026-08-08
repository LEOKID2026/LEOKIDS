/**
 * Build data/science-questions-id-ID-overlay.js from EN overlay + string maps.
 * CONTENT ONLY — does not register the overlay in science.js.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const ART = path.join(ROOT, "artifacts/id-ID-phase6b");

function loadMaps() {
  const map = Object.create(null);
  for (let i = 0; i < 64; i++) {
    const p = path.join(ART, `map-chunk-${i}.json`);
    if (!fs.existsSync(p)) continue;
    Object.assign(map, JSON.parse(fs.readFileSync(p, "utf8")));
  }
  return map;
}

function placeholders(s) {
  const simple = [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
  const mustache = [...String(s).matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
  return [...new Set([...simple, ...mustache])].sort();
}

function tr(en, map, missing, phBad, where) {
  if (typeof en !== "string") return en;
  if (!Object.prototype.hasOwnProperty.call(map, en)) {
    missing.push({ where, en: en.slice(0, 120) });
    return en;
  }
  const id = map[en];
  if (typeof id !== "string" || !id.trim()) {
    missing.push({ where, en: en.slice(0, 120), reason: "empty" });
    return en;
  }
  if (JSON.stringify(placeholders(en)) !== JSON.stringify(placeholders(id))) {
    phBad.push({ where, en: placeholders(en), id: placeholders(id) });
  }
  return id;
}

const mod = await import(pathToFileURL(path.resolve("data/science-questions-en-overlay.js")).href);
const enOv = mod.SCIENCE_EN_OVERLAY;
const map = loadMaps();
console.log("map keys", Object.keys(map).length);

const missing = [];
const phBad = [];
const out = {};

for (const id of Object.keys(enOv).sort()) {
  const e = enOv[id];
  const row = {};
  if (typeof e.stem === "string") row.stem = tr(e.stem, map, missing, phBad, `${id}.stem`);
  if (Array.isArray(e.options)) {
    row.options = e.options.map((o, i) => tr(o, map, missing, phBad, `${id}.options.${i}`));
  }
  if (typeof e.explanation === "string") {
    row.explanation = tr(e.explanation, map, missing, phBad, `${id}.explanation`);
  }
  if (Array.isArray(e.theoryLines)) {
    row.theoryLines = e.theoryLines.map((t, i) => tr(t, map, missing, phBad, `${id}.theoryLines.${i}`));
  }
  if (typeof e.hint === "string") row.hint = tr(e.hint, map, missing, phBad, `${id}.hint`);
  if (typeof e.feedback === "string") row.feedback = tr(e.feedback, map, missing, phBad, `${id}.feedback`);
  if (typeof e.question === "string") row.question = tr(e.question, map, missing, phBad, `${id}.question`);
  out[id] = row;
}

const header = `/** Indonesian (id-ID) display overlay for science questions. Content only — register in SCIENCE_OVERLAY_BY_LOCALE later. */\nexport const SCIENCE_ID_ID_OVERLAY = `;
const body = JSON.stringify(out, null, 2);
fs.writeFileSync(path.join(ROOT, "data/science-questions-id-ID-overlay.js"), header + body + ";\n", "utf8");

const report = {
  items: Object.keys(out).length,
  mapKeys: Object.keys(map).length,
  missing: missing.length,
  placeholderMismatches: phBad.length,
  missingSample: missing.slice(0, 30),
  phSample: phBad.slice(0, 20),
};
fs.writeFileSync(path.join(ART, "apply-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (missing.length || phBad.length) process.exitCode = 1;
