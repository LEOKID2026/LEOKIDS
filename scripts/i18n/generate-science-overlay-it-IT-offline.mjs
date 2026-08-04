/**
 * Offline: build data/science-questions-it-IT-overlay.js
 * EN IDs + option order authority; text from EN→IT cache or es-419→it bridge.
 * No network.
 *
 * Run: node scripts/i18n/generate-science-overlay-it-IT-offline.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolveItString, applyItalianAuthorityPostfix } from "./offline-es-to-it-IT.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-it-IT-overlay.js");
const CACHE_PATH = path.join(__dirname, "_mt-cache-it-IT-science.json");

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function transformPair(enNode, esNode, cache) {
  if (typeof enNode === "string") {
    return resolveItString(enNode, typeof esNode === "string" ? esNode : null, cache);
  }
  if (Array.isArray(enNode)) {
    return enNode.map((item, i) =>
      transformPair(item, Array.isArray(esNode) ? esNode[i] : null, cache),
    );
  }
  if (enNode && typeof enNode === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(enNode)) {
      const esVal = esNode && typeof esNode === "object" ? esNode[k] : null;
      out[k] = transformPair(v, esVal, cache);
    }
    return out;
  }
  return enNode;
}

async function main() {
  const enMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
  const esMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-es-419-overlay.js")).href);
  const en = enMod.SCIENCE_EN_OVERLAY;
  const es = esMod.SCIENCE_ES_419_OVERLAY;
  const cache = loadCache();
  const ids = Object.keys(en);

  /** @type {Record<string, unknown>} */
  const out = {};
  let cacheHits = 0;
  let bridge = 0;

  for (const id of ids) {
    const enQ = en[id];
    const esQ = es[id] || null;
    // count stem source
    const stemEn = enQ?.stem;
    if (stemEn && cache[stemEn]) cacheHits += 1;
    else bridge += 1;
    out[id] = transformPair(enQ, esQ, cache);
  }

  // Final authority pass on serialized strings
  const bodyObj = JSON.parse(JSON.stringify(out));
  function walkFix(n) {
    if (typeof n === "string") return applyItalianAuthorityPostfix(n);
    if (Array.isArray(n)) return n.map(walkFix);
    if (n && typeof n === "object") {
      for (const k of Object.keys(n)) n[k] = walkFix(n[k]);
    }
    return n;
  }
  walkFix(bodyObj);

  const body =
    `/** Italian (Italy) display overlay for science questions. Offline-built from EN IDs + cache/es-419 bridge. */\n` +
    `export const SCIENCE_IT_IT_OVERLAY = ${JSON.stringify(bodyObj, null, 2)};\n`;
  fs.writeFileSync(OUT, body, "utf8");
  console.log("Wrote", OUT, {
    ids: ids.length,
    stemCacheHits: cacheHits,
    stemBridge: bridge,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
