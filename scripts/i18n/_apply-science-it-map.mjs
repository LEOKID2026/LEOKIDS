import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");
const MAP = JSON.parse(fs.readFileSync(path.join(__dirname, "_science-it-nl-map.json"), "utf8"));

const { SCIENCE_EN_OVERLAY: EN } = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
const { SCIENCE_NL_NL_OVERLAY: NL } = await import(pathToFileURL(OUT).href + "?t=" + Date.now());

let patched = 0;
const out = structuredClone(NL);
for (const id of Object.keys(EN)) {
  const en = EN[id];
  const nl = out[id];
  if (!nl) continue;
  const apply = (enVal, get, set) => {
    const key = String(enVal ?? "");
    if (key in MAP && get() !== MAP[key]) {
      set(MAP[key]);
      patched++;
    }
  };
  apply(en.stem, () => nl.stem, (v) => { nl.stem = v; });
  apply(en.explanation, () => nl.explanation, (v) => { nl.explanation = v; });
  (en.options || []).forEach((o, i) => apply(o, () => nl.options[i], (v) => { nl.options[i] = v; }));
  (en.theoryLines || []).forEach((t, i) => apply(t, () => nl.theoryLines[i], (v) => { nl.theoryLines[i] = v; }));
}

fs.writeFileSync(
  OUT,
  `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(out, null, 2)};\n`,
  "utf8"
);
console.log({ patched, mapKeys: Object.keys(MAP).length });
