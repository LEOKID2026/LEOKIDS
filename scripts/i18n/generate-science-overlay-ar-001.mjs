/**
 * Generate data/science-questions-ar-001-overlay.js from English science overlay.
 * Run: node scripts/i18n/generate-science-overlay-ar-001.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-ar-001-overlay.js");
const CACHE_PATH = path.join(__dirname, "_mt-cache-ar-001-science.json");

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), "utf8");
}

async function mt(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

async function translateString(en, cache) {
  const s = String(en || "");
  if (!s.trim()) return s;
  if (cache[s]) return cache[s];
  try {
    cache[s] = await mt(s);
  } catch (err) {
    console.warn("MT fail", s.slice(0, 50), err.message);
    cache[s] = s;
  }
  return cache[s];
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
  const cache = loadCache();
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
      saveCache(cache);
      console.log(`Progress ${Math.min(i + CONCURRENCY, ids.length)}/${ids.length}`);
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  saveCache(cache);

  const body = `/** Arabic master (ar-001) display overlay for science questions. */\nexport const SCIENCE_AR_001_OVERLAY = ${JSON.stringify(out, null, 2)};\n`;
  fs.writeFileSync(OUT, body, "utf8");
  console.log("Wrote", OUT, "entries", Object.keys(out).length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
