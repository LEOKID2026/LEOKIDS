/**
 * Restore science nl-NL from cache; apply only curated full-record fixes for residual EN.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");
const CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, "_mt-cache-nl-NL.json"), "utf8"));

const STRICT =
  /\b(the|and|with|from|that|this|these|those|what|which|because|survive|called|finding|provides|seeking|Digest|cookware|heats|Sleep|tipping|soak|hydrated|warmth|flight|adapted|underwater|Feathers|Crack|Absorb|substances|pumps|stores|replaces|breathe|breathing|working|feeling|muscles|stone|resting|steer|balance|moving|steady|pathway|useful|Comparing|shows|busy|factory|processes|manage|toxins|wastes|overlapping|lifestyle|People|Thirst|signal|fluid|abdomen|together|analysis|Units|comes|usually|never|Metal|often|conducts|directly|reproduction|wilts|becomes weak|heterogeneous mixture|made of metal|is soft\?|lays eggs|give birth|live young|warm-blooded|cold-blooded|correctly describes|main job|nervous system|dissolves|homogeneous mixture|greenhouse|methane trap|pollination|boiling point|water vapor|tilted|travels|hemisphere|outdoors|whether|rainy|sunny|throwing|Burning|depth perception|job of|Camouflage helps|What is the|What causes|Which explanation|If your|covered in|The kidneys|The eyes|It wilts|becomes|material is soft|Welke material|instead of|turns used|an example|Peer review|Findings|replications|Moving forever|Elasticity is|burning coal|using old|paper into ash|Filter waste|must breathe|variable changed)\b/i;

function tr(en) {
  const s = String(en ?? "");
  if (!s.trim()) return s;
  return CACHE[s] != null ? CACHE[s] : s;
}

const enMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href + `?t=${Date.now()}`);
const EN = enMod.SCIENCE_EN_OVERLAY;
const overlay = {};
for (const [id, e] of Object.entries(EN)) {
  overlay[id] = {
    stem: tr(e.stem ?? e.prompt ?? e.question ?? ""),
    options: (e.options || []).map(tr),
    explanation: tr(e.explanation || ""),
    ...(Array.isArray(e.theoryLines) ? { theoryLines: e.theoryLines.map(tr) } : {}),
  };
}

// Load curated patches from previous good work
const PATCHES = JSON.parse(fs.readFileSync(path.join(__dirname, "_science-nl-NL-curated-patches.json"), "utf8"));
for (const [id, q] of Object.entries(PATCHES)) overlay[id] = q;

fs.writeFileSync(OUT, `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(overlay, null, 2)};\n`);

const bad = [];
for (const id of Object.keys(EN)) {
  const n = overlay[id];
  const fields = [n.stem, n.explanation, ...(n.options || []), ...(n.theoryLines || [])];
  if (fields.some((f) => STRICT.test(String(f || "")))) bad.push(id);
}
fs.writeFileSync(path.join(__dirname, "_science-strict-bad-ids.json"), JSON.stringify(bad, null, 2));
console.log(JSON.stringify({ total: Object.keys(EN).length, bad: bad.length, sample: bad.slice(0, 30) }, null, 2));
