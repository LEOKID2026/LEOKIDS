/**
 * Generate data/science-questions-it-IT-overlay.js from English science overlay.
 * Curated Italian post-fixes after translation; IDs/option order preserved.
 *
 * Run: node scripts/i18n/generate-science-overlay-it-IT.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-it-IT-overlay.js");
const CACHE_PATH = path.join(__dirname, "_mt-cache-it-IT-science.json");
const OFFLINE = process.env.IT_IT_OFFLINE === "1" || process.argv.includes("--offline");

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

function applyItalianSciencePostfix(s) {
  return String(s)
    .replace(/\bGrade 1\b/g, "1ª primaria")
    .replace(/\bGrade 2\b/g, "2ª primaria")
    .replace(/\bGrade 3\b/g, "3ª primaria")
    .replace(/\bGrade 4\b/g, "4ª primaria")
    .replace(/\bGrade 5\b/g, "5ª primaria")
    .replace(/\bGrade 6\b/g, "1ª secondaria")
    .replace(/\b6ª primaria\b/gi, "1ª secondaria")
    .replace(/\bstudente\b/gi, "alunno")
    .replace(/\bstudenti\b/gi, "alunni")
    .replace(/\bnatal\b/gi, "telefono")
    .replace(/\bnatel\b/gi, "telefono")
    .replace(/\bLeo Kids\b/g, "Leo Kids");
}

async function mt(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=it&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

async function translateString(en, cache) {
  const s = String(en || "");
  if (!s.trim()) return s;
  if (cache[s]) return applyItalianSciencePostfix(cache[s]);
  if (OFFLINE) return applyItalianSciencePostfix(s);
  try {
    cache[s] = await mt(s);
  } catch (err) {
    console.warn("MT fail", s.slice(0, 50), err.message);
    cache[s] = s;
  }
  return applyItalianSciencePostfix(cache[s]);
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
      // Never invent new fields; preserve structure exactly.
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
    await new Promise((r) => setTimeout(r, 40));
  }
  saveCache(cache);

  // Preserve key order from English authority
  /** @type {Record<string, unknown>} */
  const ordered = {};
  for (const id of ids) ordered[id] = out[id];

  const body =
    `/** Italian (Italy) display overlay for science questions. */\n` +
    `export const SCIENCE_IT_IT_OVERLAY = ${JSON.stringify(ordered, null, 2)};\n`;
  fs.writeFileSync(OUT, body, "utf8");
  console.log("Wrote", OUT, "entries", Object.keys(ordered).length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
