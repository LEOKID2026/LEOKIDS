/**
 * Emit data/english-questions/word-meanings/fr-FR.js from WORD_LISTS keys.
 * Context-checked French glosses for English word IDs (not the English word itself).
 *
 * Run: node scripts/i18n/generate-english-word-meanings-fr-FR.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { loadCache, mtTranslate, saveCache } from "./_fr-FR-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/english-questions/word-meanings/fr-FR.js");
const CACHE_PATH = path.join(__dirname, "_mt-cache-fr-FR-meanings.json");

/** Curated FR meanings by English word ID (context-checked). */
const OVERRIDES = {
  bus: "bus",
  "bus stop": "arrêt de bus",
  juice: "jus",
  eraser: "gomme",
  classroom: "salle de classe",
  car: "voiture",
  ticket: "billet",
  port: "port",
  grade: "note",
  mark: "note",
  class: "classe",
  bank: "banque",
  bat: "chauve-souris",
  light: "lumière",
  right: "droite",
  watch: "montre",
  hundred: "cent",
  fifty: "cinquante",
  navy: "bleu marine",
  maroon: "bordeaux",
  computer: "ordinateur",
  refrigerator: "réfrigérateur",
  fridge: "frigo",
  stove: "cuisinière",
  field: "champ",
  laptop: "ordinateur portable",
  headphones: "écouteurs",
  phone: "téléphone",
  cellphone: "téléphone portable",
  mobile: "portable",
  truck: "camion",
  train: "train",
  airplane: "avion",
  bicycle: "vélo",
  cookie: "biscuit",
  candy: "bonbon",
  soccer: "football",
  football: "football américain",
  elevator: "ascenseur",
  apartment: "appartement",
  trash: "poubelle",
  garbage: "ordures",
  vacation: "vacances",
  movie: "film",
  cell: "cellule",
  math: "mathématiques",
};

/** Category-aware overrides for polysemy. */
const CATEGORY_OVERRIDES = {
  school: {
    grade: "classe",
    mark: "note",
    class: "classe",
  },
  travel: {
    ticket: "billet",
    port: "port",
    watch: "regarder",
  },
  places: {
    bank: "banque",
    port: "port",
  },
  animals: {
    bat: "chauve-souris",
  },
  sports: {
    bat: "batte",
  },
  verbs: {
    watch: "regarder",
    light: "allumer",
    mark: "marquer",
  },
  adjectives: {
    light: "léger",
    right: "correct",
  },
  body: {
    right: "droit",
  },
  home: {
    light: "lumière",
    watch: "montre",
  },
  nature: {
    bank: "rive",
  },
};

async function meaningFor(listKey, wordId, cache) {
  if (CATEGORY_OVERRIDES[listKey]?.[wordId]) return CATEGORY_OVERRIDES[listKey][wordId];
  if (Object.prototype.hasOwnProperty.call(OVERRIDES, wordId)) return OVERRIDES[wordId];
  const cacheKey = `${listKey}::${wordId}`;
  if (cache[cacheKey]) return cache[cacheKey];
  if (cache[wordId] && !CATEGORY_OVERRIDES[listKey]) return cache[wordId];
  try {
    const prompt = `child-friendly French meaning of English word "${wordId}" (one short gloss, lowercase, France French):`;
    // Translate the word id as a gloss cue
    const translated = (await mtTranslate(wordId)).trim().toLowerCase();
    cache[cacheKey] = translated || wordId;
    cache[wordId] = cache[cacheKey];
    void prompt;
  } catch {
    cache[cacheKey] = wordId;
  }
  return cache[cacheKey];
}

async function main() {
  const cache = loadCache(CACHE_PATH);
  /** @type {Record<string, Record<string, string>>} */
  const out = {};
  const ids = [];
  for (const [listKey, words] of Object.entries(WORD_LISTS || {})) {
    out[listKey] = {};
    for (const wordId of Object.keys(words || {})) {
      ids.push([listKey, wordId]);
    }
  }

  console.log("Word IDs:", ids.length);
  const CONCURRENCY = 8;
  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const chunk = ids.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async ([listKey, wordId]) => {
        out[listKey][wordId] = await meaningFor(listKey, wordId, cache);
      }),
    );
    if (i % 80 === 0 || i + CONCURRENCY >= ids.length) {
      saveCache(CACHE_PATH, cache);
      console.log(`Progress ${Math.min(i + CONCURRENCY, ids.length)}/${ids.length}`);
    }
    await new Promise((r) => setTimeout(r, 40));
  }
  saveCache(CACHE_PATH, cache);

  // Re-apply category overrides for consistency
  for (const [listKey, words] of Object.entries(CATEGORY_OVERRIDES)) {
    if (!out[listKey]) continue;
    for (const [wordId, meaning] of Object.entries(words)) {
      if (out[listKey][wordId] != null) out[listKey][wordId] = meaning;
    }
  }
  for (const [wordId, meaning] of Object.entries(OVERRIDES)) {
    for (const listKey of Object.keys(out)) {
      if (out[listKey][wordId] != null && !CATEGORY_OVERRIDES[listKey]?.[wordId]) {
        out[listKey][wordId] = meaning;
      }
    }
  }

  const lines = [
    "/**",
    " * French France (fr-FR) meanings for English learning words.",
    " * Keys match WORD_LISTS English word IDs; values are child-friendly French glosses.",
    " * Generated by scripts/i18n/generate-english-word-meanings-fr-FR.mjs",
    " */",
    "",
    "export const WORD_MEANINGS_FR_FR = {",
  ];
  for (const listKey of Object.keys(out)) {
    lines.push(`  ${JSON.stringify(listKey)}: {`);
    for (const [wordId, meaning] of Object.entries(out[listKey])) {
      lines.push(`    ${JSON.stringify(wordId)}: ${JSON.stringify(meaning)},`);
    }
    lines.push("  },");
  }
  lines.push("};", "");
  fs.writeFileSync(OUT, lines.join("\n"), "utf8");
  console.log("Wrote", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
