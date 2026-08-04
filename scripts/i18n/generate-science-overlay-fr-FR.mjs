/**
 * Generate data/science-questions-fr-FR-overlay.js from English science overlay.
 * Run: node scripts/i18n/generate-science-overlay-fr-FR.mjs
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

async function translateString(en, cache) {
  const r = await translateStringFr(en, cache, { tone: "child" });
  return applySurfaceTone(applyGlossaryHints(r.value), "child");
}

async function transformNode(node, cache) {
  if (typeof node === "string") return translateString(node, cache);
  if (Array.isArray(node)) {
    const out = [];
    for (const item of node) out.push(await transformNode(item, cache));
    return out;
  }
  if (node && typeof node === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = await transformNode(v, cache);
    }
    return out;
  }
  return node;
}

async function main() {
  const mod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
  const src = mod.SCIENCE_EN_OVERLAY;
  const cache = loadCache(CACHE_PATH);
  const ids = Object.keys(src);
  console.log("Science questions:", ids.length);

  /** @type {Record<string, unknown>} */
  const out = {};
  const CONCURRENCY = 4;
  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const chunk = ids.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (id) => {
        out[id] = await transformNode(src[id], cache);
      }),
    );
    if (i % 40 === 0 || i + CONCURRENCY >= ids.length) {
      saveCache(CACHE_PATH, cache);
      console.log(`Progress ${Math.min(i + CONCURRENCY, ids.length)}/${ids.length}`);
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  saveCache(CACHE_PATH, cache);

  const body = `/** French France (fr-FR) display overlay for science questions. */\nexport const SCIENCE_FR_FR_OVERLAY = ${JSON.stringify(out, null, 2)};\n`;
  fs.writeFileSync(OUT, body, "utf8");
  console.log("Wrote", OUT, "entries", Object.keys(out).length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
