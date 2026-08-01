/**
 * Generate content-packs/es-419 from content-packs/en.
 *
 * - Walks JSON recursively; preserves keys and non-string leaves
 * - Translates user-facing string VALUES only (Google gtx MT + locale seed + glossary)
 * - Skips ids/paths/urls/enums/hex; respects doNotTranslateFields
 * - Protects {placeholders} / ICU-ish tokens during MT
 *
 * Run: node scripts/i18n/generate-content-packs-es-419.mjs
 * Optional: --force  retranslate even if cache hit
 * Optional: --dry    print stats only
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SPANISH_LATAM_GLOSSARY,
  FORBIDDEN_ES_LATAM_PATTERNS,
} from "../../lib/i18n/spanish-latam-glossary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SRC_ROOT = path.join(ROOT, "content-packs", "en");
const OUT_ROOT = path.join(ROOT, "content-packs", "es-419");
const CACHE_PATH = path.join(__dirname, "_mt-cache-es-419.json");
const REPORT_PATH = path.join(__dirname, "_content-packs-es-419-report.json");

const DOMAINS = [
  "learning",
  "reports",
  "games",
  "books",
  "rewards",
  "global-burn-down",
  "demo",
];

const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry");

/** Keys whose string values are never translated (ids / technical). */
const SKIP_VALUE_KEYS = new Set([
  "id",
  "ids",
  "skillId",
  "pageType",
  "learningPageId",
  "learningLanguage",
  "gameId",
  "subjectId",
  "topicId",
  "slug",
  "href",
  "src",
  "path",
  "route",
  "url",
  "icon",
  "image",
  "imageSrc",
  "asset",
  "assetPath",
  "font",
  "ttf",
  "locale",
  "localeId",
  "contentLocale",
  "enum",
  "key",
  "code",
  "type",
  "kind",
  "status",
  "severity",
  "version",
  "sha",
  "hash",
  "color",
  "bg",
  "background",
  "className",
  "component",
  "file",
  "filename",
  "ext",
  "mime",
  "doNotTranslateFields",
]);

/** Exact EN → ES overrides (glossary / product tone). */
const EXACT_OVERRIDES = {
  Math: "Matemáticas",
  Geometry: "Geometría",
  English: "Inglés",
  Science: "Ciencias",
  Strength: "Fortaleza",
  "Area to strengthen": "Área para reforzar",
  "Worth strengthening": "Área para reforzar",
  "Parent report": "Informe para padres",
  "Learning pattern": "Patrón de aprendizaje",
  Progress: "Progreso",
  Improvement: "Mejora",
  Practice: "Práctica",
  Start: "Empezar",
  Continue: "Continuar",
  "Try again": "Intentar de nuevo",
  Check: "Comprobar",
  Next: "Siguiente",
  Back: "Atrás",
  Play: "Jugar",
  Finish: "Terminar",
  Loading: "Cargando…",
  "Loading...": "Cargando…",
  Save: "Guardar",
  Cancel: "Cancelar",
  Delete: "Eliminar",
  Close: "Cerrar",
  Hint: "Pista",
  Addition: "Suma",
  Subtraction: "Resta",
  Multiplication: "Multiplicación",
  Division: "División",
  Fractions: "Fracciones",
  Percentages: "Porcentajes",
  Sequences: "Secuencias",
  Decimals: "Decimales",
  Rounding: "Redondeo",
  Equations: "Ecuaciones",
  Patterns: "Patrones",
  Vocabulary: "Vocabulario",
  Grammar: "Gramática",
  Phonics: "Fonética",
  Writing: "Escritura",
  Reading: "Lectura",
  "Reading comprehension": "Comprensión lectora",
  Shapes: "Figuras",
  "Basic shapes": "Figuras básicas",
  Area: "Área",
  Perimeter: "Perímetro",
  Volume: "Volumen",
  Angles: "Ángulos",
  Triangles: "Triángulos",
  Circles: "Círculos",
  Symmetry: "Simetría",
  Coordinates: "Coordenadas",
  Animals: "Animales",
  Plants: "Plantas",
  Materials: "Materiales",
  "Mixed practice": "Práctica mixta",
  "Word problems": "Problemas verbales",
  "Place value": "Valor posicional",
  "Number sense": "Sentido numérico",
  "Grade 1": "Grado 1",
  "Grade 2": "Grado 2",
  "Grade 3": "Grado 3",
  "Grade 4": "Grado 4",
  "Grade 5": "Grado 5",
  "Grade 6": "Grado 6",
  "Grades 1–2": "Grados 1–2",
  "Grades 3–4": "Grados 3–4",
  "Grades 5–6": "Grados 5–6",
  Regular: "Común",
  Special: "Especial",
  Rare: "Rara",
  Gold: "Oro",
  "Surprise box": "Caja sorpresa",
  Locked: "Bloqueada",
  "My cards": "Mis cartas",
  "My collection": "Mi colección",
  "Card shop": "Tienda de cartas",
  "All cards": "Todas las cartas",
  Series: "Series",
  Buy: "Comprar",
  "Sell duplicate": "Vender duplicado",
  "Open box": "Abrir caja",
  "Table of contents": "Índice",
  "Coming soon": "Próximamente",
  "Previous page": "Página anterior",
  "Next page": "Página siguiente",
  "Previous topic": "Tema anterior",
  "Next topic": "Tema siguiente",
  "Let's practice now": "Practiquemos ahora",
  "Practice with questions": "Practicar con preguntas",
  "Book reading": "Lectura del libro",
};

/** Phrase replacements applied after MT (product tone / LatAm). */
const POST_PHRASE_FIXES = [
  [/Área a fortalecer/gi, "Área para reforzar"],
  [/áreas a fortalecer/gi, "áreas para reforzar"],
  [/Informe de padres/gi, "Informe para padres"],
  [/reporte de padres/gi, "informe para padres"],
  [/\bpunto débil\b/gi, "área para reforzar"],
  [/\bWorth strengthening\b/gi, "Área para reforzar"],
  [/\bMates\b/g, "Matemáticas"],
  [/\borderador(?:es)?\b/gi, "computadora"],
  [/\bvosotros\b/gi, "ustedes"],
  [/\bvosotras\b/gi, "ustedes"],
  [/\b(tenés|querés|podés)\b/gi, (m) => ({ tenés: "tienes", querés: "quieres", podés: "puedes" }[m.toLowerCase()] || m)],
];

function flattenLocaleMap() {
  /** @type {Map<string, string>} */
  const map = new Map();
  const enDir = path.join(ROOT, "locales", "en");
  const esDir = path.join(ROOT, "locales", "es-419");
  if (!fs.existsSync(enDir) || !fs.existsSync(esDir)) return map;

  function flatten(obj, prefix = "") {
    /** @type {Array<[string, string]>} */
    const out = [];
    if (obj == null) return out;
    if (typeof obj === "string") {
      out.push([prefix, obj]);
      return out;
    }
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => out.push(...flatten(v, `${prefix}[${i}]`)));
      return out;
    }
    if (typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) {
        out.push(...flatten(v, prefix ? `${prefix}.${k}` : k));
      }
    }
    return out;
  }

  for (const f of fs.readdirSync(enDir).filter((x) => x.endsWith(".json"))) {
    const esPath = path.join(esDir, f);
    if (!fs.existsSync(esPath)) continue;
    const en = JSON.parse(fs.readFileSync(path.join(enDir, f), "utf8"));
    const es = JSON.parse(fs.readFileSync(esPath, "utf8"));
    const enF = Object.fromEntries(flatten(en));
    const esF = Object.fromEntries(flatten(es));
    for (const [k, enVal] of Object.entries(enF)) {
      const esVal = esF[k];
      if (typeof enVal === "string" && typeof esVal === "string" && enVal !== esVal) {
        if (!map.has(enVal)) map.set(enVal, esVal);
      }
    }
  }
  return map;
}

function looksNonTranslate(s) {
  if (s == null) return true;
  const str = String(s);
  if (!str.trim()) return true;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(str)) return true;
  if (/^https?:\/\//i.test(str) || str.startsWith("mailto:")) return true;
  if (/^\{[a-zA-Z0-9_]+\}$/.test(str)) return true;
  if (/^\d+(\.\d+)?%?$/.test(str)) return true;
  if (/^[A-Z0-9_]{2,}$/.test(str) && str.length <= 48) return true;
  // Pure Hebrew / non-Latin scripts with no Latin letters — keep as-is (asset names etc.)
  if (/[\u0590-\u05FF]/.test(str) && !/[A-Za-z]/.test(str)) return true;
  if (!/\s/.test(str)) {
    if (/^[a-z0-9]+([_/.-][a-z0-9]+)+$/i.test(str)) return true;
    if (/^[a-z]+[A-Z][a-zA-Z0-9]*$/.test(str)) return true;
    if (/^\/[a-z0-9/_\[\]-]+$/i.test(str)) return true;
    if (/\.(png|jpe?g|gif|webp|svg|ttf|woff2?|json|js|css|mp3|wav|pdf)$/i.test(str)) return true;
  }
  return false;
}

function protectPlaceholders(s) {
  /** @type {string[]} */
  const ph = [];
  const out = String(s).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
    ph.push(name);
    return `⟦${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restorePlaceholders(s, ph) {
  return String(s).replace(/⟦\s*(\d+)\s*⟧/g, (_, i) => `{${ph[Number(i)]}}`);
}

function applyGlossaryHints(text) {
  let out = text;
  for (const [enTerm, entry] of Object.entries(SPANISH_LATAM_GLOSSARY)) {
    if (!entry?.preferred) continue;
    // Only replace standalone English leftovers that match glossary keys (whole word, EN form)
    if (!/[A-Za-z]/.test(enTerm)) continue;
    const re = new RegExp(`\\b${escapeRegExp(enTerm)}\\b`, "g");
    // Avoid replacing inside already-Spanish sentences for short common words — only exact leftover tokens
    if (enTerm.length >= 4) {
      out = out.replace(re, entry.preferred);
    }
  }
  for (const [re, rep] of POST_PHRASE_FIXES) {
    out = out.replace(re, rep);
  }
  return out;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasForbidden(text) {
  return FORBIDDEN_ES_LATAM_PATTERNS.some((p) => p.re.test(text));
}

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

async function mtTranslate(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

/**
 * @param {string} en
 * @param {Map<string,string>} localeMap
 * @param {Record<string,string>} cache
 */
async function translateString(en, localeMap, cache) {
  if (looksNonTranslate(en)) return { value: en, source: "skip" };
  if (Object.prototype.hasOwnProperty.call(EXACT_OVERRIDES, en)) {
    return { value: EXACT_OVERRIDES[en], source: "override" };
  }
  if (localeMap.has(en)) {
    return { value: applyGlossaryHints(localeMap.get(en)), source: "locale" };
  }
  if (!FORCE && cache[en]) {
    return { value: cache[en], source: "cache" };
  }

  const { text, ph } = protectPlaceholders(en);
  let translated;
  try {
    translated = await mtTranslate(text);
  } catch (err) {
    console.warn("MT fail:", en.slice(0, 60), err.message);
    return { value: en, source: "mt-fail" };
  }
  translated = restorePlaceholders(translated, ph);
  translated = applyGlossaryHints(translated);

  // If MT mangled placeholders, fall back to EN
  const enPh = [...en.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  const esPh = [...translated.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  if (enPh !== esPh) {
    console.warn("placeholder mismatch, keeping EN:", en.slice(0, 80));
    return { value: en, source: "ph-mismatch" };
  }

  cache[en] = translated;
  return { value: translated, source: "mt" };
}

function listJsonFiles(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(p) {
    for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
      const fp = path.join(p, ent.name);
      if (ent.isDirectory()) walk(fp);
      else if (ent.name.endsWith(".json")) out.push(fp);
    }
  })(dir);
  return out;
}

/**
 * @param {unknown} node
 * @param {{ key?: string, doNotTranslate?: Set<string> }} ctx
 * @param {(s: string, key?: string) => Promise<string>} translateFn
 */
async function transformNode(node, ctx, translateFn) {
  if (node == null) return node;
  if (typeof node === "string") {
    if (ctx.preserveString) return node;
    if (ctx.key && SKIP_VALUE_KEYS.has(ctx.key)) return node;
    if (ctx.doNotTranslate && ctx.key && ctx.doNotTranslate.has(ctx.key)) return node;
    return translateFn(node, ctx.key);
  }
  if (typeof node !== "object") return node;
  if (Array.isArray(node)) {
    const out = [];
    for (const item of node) {
      out.push(
        await transformNode(
          item,
          {
            doNotTranslate: ctx.doNotTranslate,
            preserveString: ctx.preserveArrayStrings || ctx.preserveString,
          },
          translateFn,
        ),
      );
    }
    return out;
  }

  /** @type {Set<string>|undefined} */
  let childSkip = ctx.doNotTranslate;
  if (Array.isArray(node.doNotTranslateFields)) {
    childSkip = new Set([...(childSkip || []), ...node.doNotTranslateFields.map(String)]);
  }

  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    out[k] = await transformNode(
      v,
      {
        key: k,
        doNotTranslate: childSkip,
        // Field-name lists must stay English keys
        preserveArrayStrings: k === "doNotTranslateFields",
      },
      translateFn,
    );
  }
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

async function main() {
  const localeMap = flattenLocaleMap();
  const cache = loadCache();
  const stats = {
    files: 0,
    stringsSeen: 0,
    translated: 0,
    skipped: 0,
    bySource: {},
    domains: {},
    forbiddenHits: [],
    intentionalEnglish: [],
    mtFails: 0,
  };

  const bump = (k) => {
    stats.bySource[k] = (stats.bySource[k] || 0) + 1;
  };

  /** Deduped in-flight translations */
  /** @type {Map<string, Promise<{value:string,source:string}>>} */
  const inflight = new Map();

  async function translateFn(s) {
    stats.stringsSeen++;
    if (looksNonTranslate(s)) {
      stats.skipped++;
      bump("skip");
      return s;
    }
    let p = inflight.get(s);
    if (!p) {
      p = translateString(s, localeMap, cache).then((r) => {
        if (r.source === "mt-fail" || r.source === "ph-mismatch") stats.mtFails++;
        if (r.value === s && r.source !== "skip") {
          // left English intentionally or failed
          if (r.source === "mt-fail" || r.source === "ph-mismatch") {
            /* counted */
          } else if (/^[A-Za-z0-9]/.test(s) && !/[áéíóúñü¿¡]/i.test(r.value)) {
            stats.intentionalEnglish.push(s);
          }
        } else if (r.value !== s) {
          stats.translated++;
        }
        bump(r.source);
        if (hasForbidden(r.value)) {
          stats.forbiddenHits.push({ en: s, es: r.value });
        }
        return r;
      });
      inflight.set(s, p);
    }
    const r = await p;
    return r.value;
  }

  // Prefetch unique strings with mild concurrency
  console.log("Scanning EN packs…");
  const allFiles = [];
  for (const d of DOMAINS) {
    const files = listJsonFiles(path.join(SRC_ROOT, d));
    stats.domains[d] = files.length;
    for (const f of files) allFiles.push({ domain: d, file: f });
  }
  console.log("Files:", allFiles.length, "locale seed:", localeMap.size);

  if (DRY) {
    console.log(JSON.stringify(stats.domains, null, 2));
    return;
  }

  // Collect unique translatable strings first for batch cache fill
  const unique = new Set();
  function collect(node, key, skipFields) {
    if (node == null) return;
    if (typeof node === "string") {
      if (key && SKIP_VALUE_KEYS.has(key)) return;
      if (skipFields && key && skipFields.has(key)) return;
      if (!looksNonTranslate(node)) unique.add(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((x) => collect(x, undefined, skipFields));
      return;
    }
    if (typeof node === "object") {
      let childSkip = skipFields;
      if (Array.isArray(node.doNotTranslateFields)) {
        childSkip = new Set([...(childSkip || []), ...node.doNotTranslateFields.map(String)]);
      }
      for (const [k, v] of Object.entries(node)) collect(v, k, childSkip);
    }
  }
  for (const { file } of allFiles) {
    collect(JSON.parse(fs.readFileSync(file, "utf8")));
  }
  console.log("Unique candidate strings:", unique.size);

  // Fill cache with concurrency
  const pending = [...unique].filter((s) => FORCE || !cache[s]);
  console.log("Need MT/locale resolve:", pending.length);
  const CONCURRENCY = 8;
  let done = 0;
  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const chunk = pending.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (s) => {
        await translateString(s, localeMap, cache);
      }),
    );
    done += chunk.length;
    if (done % 80 === 0 || done >= pending.length) {
      saveCache(cache);
      console.log(`Cache progress ${Math.min(done, pending.length)}/${pending.length}`);
    }
    await new Promise((r) => setTimeout(r, 40));
  }
  saveCache(cache);

  // Write packs
  for (const { domain, file } of allFiles) {
    const rel = path.relative(SRC_ROOT, file);
    const outFile = path.join(OUT_ROOT, rel);
    ensureDir(path.dirname(outFile));
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const translated = await transformNode(raw, {}, translateFn);
    fs.writeFileSync(outFile, `${JSON.stringify(translated, null, 2)}\n`, "utf8");
    stats.files++;
  }

  // Dedupe intentional English list
  stats.intentionalEnglish = [...new Set(stats.intentionalEnglish)].slice(0, 200);
  stats.forbiddenHits = stats.forbiddenHits.slice(0, 50);
  stats.cacheSize = Object.keys(cache).length;

  fs.writeFileSync(REPORT_PATH, JSON.stringify(stats, null, 2), "utf8");
  console.log("Done.", JSON.stringify({ files: stats.files, domains: stats.domains, bySource: stats.bySource, mtFails: stats.mtFails }, null, 2));
  console.log("Report:", REPORT_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
