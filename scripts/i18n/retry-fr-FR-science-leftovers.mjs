/**
 * Retry MT for science overlay strings that still equal English.
 * Run: node scripts/i18n/retry-fr-FR-science-leftovers.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  applyGlossaryHints,
  applySurfaceTone,
  loadCache,
  saveCache,
  translateStringFr,
} from "./_fr-FR-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-fr-FR-overlay.js");
const CACHE_PATH = path.join(__dirname, "_mt-cache-fr-FR-science.json");

async function translateFresh(en, cache) {
  delete cache[en];
  const r = await translateStringFr(en, cache, { force: true, tone: "child" });
  return applySurfaceTone(applyGlossaryHints(r.value), "child");
}

async function main() {
  const enMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
  const frMod = await import(pathToFileURL(OUT).href + `?t=${Date.now()}`);
  const en = enMod.SCIENCE_EN_OVERLAY;
  const fr = structuredClone(frMod.SCIENCE_FR_FR_OVERLAY);
  const cache = loadCache(CACHE_PATH);
  let fixed = 0;

  for (const id of Object.keys(en)) {
    const a = en[id];
    const b = fr[id];
    if (!b) continue;
    for (const f of ["stem", "explanation"]) {
      if (a[f] && a[f] === b[f] && /[A-Za-z]{3,}/.test(a[f])) {
        b[f] = await translateFresh(a[f], cache);
        fixed += 1;
        await new Promise((r) => setTimeout(r, 40));
      }
    }
    if (Array.isArray(a.options) && Array.isArray(b.options)) {
      for (let i = 0; i < a.options.length; i++) {
        if (a.options[i] && a.options[i] === b.options[i] && /[A-Za-z]{3,}/.test(a.options[i])) {
          b.options[i] = await translateFresh(a.options[i], cache);
          fixed += 1;
          await new Promise((r) => setTimeout(r, 40));
        }
      }
    }
    if (Array.isArray(a.theoryLines) && Array.isArray(b.theoryLines)) {
      for (let i = 0; i < a.theoryLines.length; i++) {
        if (a.theoryLines[i] && a.theoryLines[i] === b.theoryLines[i] && /[A-Za-z]{3,}/.test(a.theoryLines[i])) {
          b.theoryLines[i] = await translateFresh(a.theoryLines[i], cache);
          fixed += 1;
          await new Promise((r) => setTimeout(r, 40));
        }
      }
    }
  }

  saveCache(CACHE_PATH, cache);
  const body = `/** French France (fr-FR) display overlay for science questions. */\nexport const SCIENCE_FR_FR_OVERLAY = ${JSON.stringify(fr, null, 2)};\n`;
  fs.writeFileSync(OUT, body, "utf8");
  console.log("Fixed strings:", fixed, "entries", Object.keys(fr).length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
