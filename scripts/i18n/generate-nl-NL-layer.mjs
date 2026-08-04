/**
 * Generate nl-NL content layer from English authority.
 *
 * Uses local curated overrides/glossary first; residual strings use Google gtx
 * only as a draft that is immediately post-processed with Netherlands rules
 * (Groep 3–8, Rekenen, werkblad, leerling, euro, je/u fixes). Not a blind dump.
 *
 * Run: node scripts/i18n/generate-nl-NL-layer.mjs
 * Optional: --force --dry --namespaces-only --packs-only --science-only --books-only --help-only
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  EXACT_OVERRIDES,
  SKIP_VALUE_KEYS,
  looksNonTranslate,
  protectPlaceholders,
  restorePlaceholders,
  translateEnToNl,
} from "./_nl-NL-translate-engine.mjs";
import {
  DUTCH_NETHERLANDS_GLOSSARY,
  FORBIDDEN_NL_NL_PATTERNS,
} from "../../lib/i18n/dutch-netherlands-glossary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_mt-cache-nl-NL.json");
const REPORT_PATH = path.join(__dirname, "_nl-NL-layer-report.json");

const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry");
const LOCAL_ONLY = process.argv.includes("--local-only") || process.env.NL_NL_LOCAL_ONLY === "1";
const NAMESPACES_ONLY = process.argv.includes("--namespaces-only");
const PACKS_ONLY = process.argv.includes("--packs-only");
const SCIENCE_ONLY = process.argv.includes("--science-only");
const BOOKS_ONLY = process.argv.includes("--books-only");
const HELP_ONLY = process.argv.includes("--help-only");

const DOMAINS = [
  "learning",
  "reports",
  "games",
  "books",
  "rewards",
  "global-burn-down",
  "demo",
];

const POST_PHRASE_FIXES = [
  [/Leo Kids/g, "Leo Kids"],
  [/Leo Kinderen/g, "Leo Kids"],
  [/\bWiskunde\b/g, "Rekenen"],
  [/\bwiskunde\b/g, "rekenen"],
  [/\bGrade\s*1\b/gi, "Groep 3"],
  [/\bGrade\s*2\b/gi, "Groep 4"],
  [/\bGrade\s*3\b/gi, "Groep 5"],
  [/\bGrade\s*4\b/gi, "Groep 6"],
  [/\bGrade\s*5\b/gi, "Groep 7"],
  [/\bGrade\s*6\b/gi, "Groep 8"],
  [/\bYear\s*1\b/gi, "Groep 3"],
  [/\bYear\s*2\b/gi, "Groep 4"],
  [/\bYear\s*3\b/gi, "Groep 5"],
  [/\bYear\s*4\b/gi, "Groep 6"],
  [/\bYear\s*5\b/gi, "Groep 7"],
  [/\bYear\s*6\b/gi, "Groep 8"],
  [/\b1e klas\b/gi, "Groep 3"],
  [/\b2e klas\b/gi, "Groep 4"],
  [/\b3e klas\b/gi, "Groep 5"],
  [/\b4e klas\b/gi, "Groep 6"],
  [/\b5e klas\b/gi, "Groep 7"],
  [/\b6e klas\b/gi, "Groep 8"],
  [/\bGroep\s*1\b/g, "Groep 3"],
  [/\bGroep\s*2\b/g, "Groep 3"],
  [/werkblad van activiteiten/gi, "werkblad"],
  [/bladen van activiteiten/gi, "werkbladen"],
  [/spreadsheet/gi, "werkblad"],
  [/rekenblad/gi, "werkblad"],
  [/\bstudent\b/gi, "leerling"],
  [/\bstudenten\b/gi, "leerlingen"],
  [/\bStudent\b/g, "Leerling"],
  [/\bStudenten\b/g, "Leerlingen"],
  [/\bleraren\b/gi, "leerkrachten"],
  [/\bleraar\b/gi, "leerkracht"],
  [/\bLeraar\b/g, "Leerkracht"],
  [/\bLeraren\b/g, "Leerkrachten"],
  [/\$(\d)/g, "€$1"],
  [/\bdollars?\b/gi, "euro"],
  [/\bgoesting\b/gi, "zin"],
  [/\bhesp\b/gi, "ham"],
  [/\bplezant\b/gi, "leuk"],
  [/\bamai[!?.]?\b/gi, ""],
  [/\bgij\b/gi, "jij"],
  [/\bge\b/g, "je"],
];

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyGlossaryHints(text) {
  let out = String(text ?? "");
  // Longer glossary keys first
  const entries = Object.entries(DUTCH_NETHERLANDS_GLOSSARY).sort(
    (a, b) => b[0].length - a[0].length,
  );
  for (const [enTerm, entry] of entries) {
    if (!entry?.preferred || enTerm.length < 3) continue;
    const re = new RegExp(`\\b${escapeRegExp(enTerm)}\\b`, "g");
    out = out.replace(re, entry.preferred);
  }
  for (const [re, rep] of POST_PHRASE_FIXES) out = out.replace(re, rep);
  return out.replace(/\s{2,}/g, " ").replace(/\s+([,.!?])/g, "$1").trim();
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
  throw new Error("External MT disabled (local-only nl-NL generation)");
}

async function translateString(en, cache, { childFacing = false } = {}) {
  if (looksNonTranslate(en)) return { value: en, source: "skip" };
  if (Object.prototype.hasOwnProperty.call(EXACT_OVERRIDES, en)) {
    return { value: applyGlossaryHints(EXACT_OVERRIDES[en]), source: "override" };
  }

  if (!FORCE && cache[en]) {
    let cached = applyGlossaryHints(cache[en]);
    if (childFacing) {
      cached = cached
        .replace(/\bU\b/g, "Je")
        .replace(/\bu\b/g, "je")
        .replace(/\bUw\b/g, "Jouw")
        .replace(/\buw\b/g, "jouw");
    }
    return { value: cached, source: "cache" };
  }

  const local = translateEnToNl(en, { childFacing });
  const polished = applyGlossaryHints(local);
  // Always prefer local/cache path when LOCAL_ONLY (no external API).
  if (LOCAL_ONLY || polished !== en) {
    cache[en] = polished;
    return { value: polished, source: "local" };
  }

  if (LOCAL_ONLY) {
    cache[en] = polished;
    return { value: polished, source: "local" };
  }

  const { text, ph } = protectPlaceholders(en);
  let translated;
  try {
    translated = await mtTranslate(text);
  } catch (err) {
    console.warn("MT unavailable, using local:", en.slice(0, 60), err.message);
    cache[en] = polished;
    return { value: polished, source: "mt-fail-local" };
  }
  translated = restorePlaceholders(translated, ph);
  translated = applyGlossaryHints(translated);
  if (childFacing) {
    translated = translated
      .replace(/\bU\b/g, "Je")
      .replace(/\bu\b/g, "je")
      .replace(/\bUw\b/g, "Jouw")
      .replace(/\buw\b/g, "jouw");
  }

  const enPh = [...en.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  const nlPh = [...translated.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  if (enPh !== nlPh) {
    console.warn("placeholder mismatch, keeping EN:", en.slice(0, 80));
    return { value: en, source: "ph-mismatch" };
  }

  cache[en] = translated;
  return { value: translated, source: "mt+post" };
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

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function collectStrings(node, key, skipFields, unique) {
  if (node == null) return;
  if (typeof node === "string") {
    if (key && SKIP_VALUE_KEYS.has(key)) return;
    if (skipFields && key && skipFields.has(key)) return;
    if (!looksNonTranslate(node)) unique.add(node);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((x) => collectStrings(x, undefined, skipFields, unique));
    return;
  }
  if (typeof node === "object") {
    let childSkip = skipFields;
    if (Array.isArray(node.doNotTranslateFields)) {
      childSkip = new Set([...(childSkip || []), ...node.doNotTranslateFields.map(String)]);
    }
    for (const [k, v] of Object.entries(node)) collectStrings(v, k, childSkip, unique);
  }
}

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
            childFacing: ctx.childFacing,
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
        preserveArrayStrings: k === "doNotTranslateFields",
        childFacing: ctx.childFacing,
      },
      translateFn,
    );
  }
  return out;
}

async function fillCache(unique, cache, opts) {
  const pending = [...unique].filter((s) => FORCE || !cache[s]);
  console.log("Need resolve:", pending.length);
  const CONCURRENCY = 6;
  let done = 0;
  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const chunk = pending.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async (s) => translateString(s, cache, opts)));
    done += chunk.length;
    if (done % 60 === 0 || done >= pending.length) {
      saveCache(cache);
      console.log(`Cache progress ${Math.min(done, pending.length)}/${pending.length}`);
    }
    await new Promise((r) => setTimeout(r, 35));
  }
  saveCache(cache);
}

async function translateTree(raw, cache, stats, opts = {}) {
  const inflight = new Map();
  async function translateFn(s) {
    stats.stringsSeen++;
    if (looksNonTranslate(s)) {
      stats.skipped++;
      return s;
    }
    let p = inflight.get(s);
    if (!p) {
      p = translateString(s, cache, opts).then((r) => {
        if (r.value !== s) stats.translated++;
        stats.bySource[r.source] = (stats.bySource[r.source] || 0) + 1;
        for (const f of FORBIDDEN_NL_NL_PATTERNS) {
          if (f.re.test(r.value)) stats.forbiddenHits.push({ en: s, nl: r.value, label: f.label });
        }
        return r;
      });
      inflight.set(s, p);
    }
    return (await p).value;
  }
  return transformNode(raw, { childFacing: opts.childFacing }, translateFn);
}

async function generateNamespaces(cache, stats) {
  const srcDir = path.join(ROOT, "locales", "en");
  const outDir = path.join(ROOT, "locales", "nl-NL");
  ensureDir(outDir);
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".json"));
  const unique = new Set();
  for (const f of files) {
    collectStrings(JSON.parse(fs.readFileSync(path.join(srcDir, f), "utf8")), undefined, undefined, unique);
  }
  console.log("Namespaces unique strings:", unique.size);
  if (DRY) return;
  await fillCache(unique, cache, {});
  for (const f of files) {
    // Keep handcrafted common.json if already written carefully
    if (f === "common.json" && fs.existsSync(path.join(outDir, f)) && !FORCE) {
      stats.namespaceFiles++;
      continue;
    }
    const raw = JSON.parse(fs.readFileSync(path.join(srcDir, f), "utf8"));
    const childFacing = f === "games.json" || f === "learning.json";
    const translated = await translateTree(raw, cache, stats, { childFacing });
    fs.writeFileSync(path.join(outDir, f), `${JSON.stringify(translated, null, 2)}\n`, "utf8");
    stats.namespaceFiles++;
  }
}

async function generatePacks(cache, stats) {
  const srcRoot = path.join(ROOT, "content-packs", "en");
  const outRoot = path.join(ROOT, "content-packs", "nl-NL");
  const allFiles = [];
  for (const d of DOMAINS) {
    const files = listJsonFiles(path.join(srcRoot, d));
    stats.domains[d] = files.length;
    for (const f of files) allFiles.push(f);
  }
  const unique = new Set();
  for (const file of allFiles) {
    collectStrings(JSON.parse(fs.readFileSync(file, "utf8")), undefined, undefined, unique);
  }
  console.log("Pack files:", allFiles.length, "unique strings:", unique.size);
  if (DRY) return;
  await fillCache(unique, cache, {});
  for (const file of allFiles) {
    const rel = path.relative(srcRoot, file);
    const outFile = path.join(outRoot, rel);
    ensureDir(path.dirname(outFile));
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const childFacing = rel.startsWith("games") || rel.startsWith("learning");
    const translated = await translateTree(raw, cache, stats, { childFacing });
    fs.writeFileSync(outFile, `${JSON.stringify(translated, null, 2)}\n`, "utf8");
    stats.packFiles++;
  }
}

async function generateScience(cache, stats) {
  const mod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
  const src = mod.SCIENCE_EN_OVERLAY;
  const ids = Object.keys(src);
  console.log("Science questions:", ids.length);
  const unique = new Set();
  for (const id of ids) collectStrings(src[id], undefined, undefined, unique);
  console.log("Science unique strings:", unique.size);
  if (DRY) return;
  await fillCache(unique, cache, { childFacing: true });

  /** @type {Record<string, unknown>} */
  const out = {};
  for (const id of ids) {
    const q = src[id];
    out[id] = {
      stem: (await translateString(String(q.stem || ""), cache, { childFacing: true })).value,
      options: Array.isArray(q.options)
        ? await Promise.all(
            q.options.map(async (o) => (await translateString(String(o), cache, { childFacing: true })).value),
          )
        : q.options,
      explanation: (await translateString(String(q.explanation || ""), cache, { childFacing: true })).value,
      theoryLines: Array.isArray(q.theoryLines)
        ? await Promise.all(
            q.theoryLines.map(
              async (t) => (await translateString(String(t), cache, { childFacing: true })).value,
            ),
          )
        : q.theoryLines,
    };
    stats.scienceRecords++;
  }
  const body = `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(out, null, 2)};\n`;
  fs.writeFileSync(path.join(ROOT, "data/science-questions-nl-NL-overlay.js"), body, "utf8");
}

function walkMd(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkMd(p, files);
    else if (ent.name.endsWith(".md")) files.push(p);
  }
  return files;
}

function protectCode(s) {
  /** @type {string[]} */
  const ph = [];
  let out = String(s).replace(/`([^`]+)`/g, (_, code) => {
    ph.push(code);
    return `⟦C${ph.length - 1}⟧`;
  });
  out = out.replace(/\$\{([^}]+)\}/g, (_, expr) => {
    ph.push(expr);
    return `⟦P${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restoreCode(s, ph) {
  return String(s)
    .replace(/⟦C(\d+)⟧/g, (_, i) => `\`${ph[Number(i)]}\``)
    .replace(/⟦P(\d+)⟧/g, (_, i) => `\${${ph[Number(i)]}}`);
}

async function generateBooks(cache, stats) {
  const SRC = path.join(ROOT, "docs/learning-book/en");
  const OUT = path.join(ROOT, "docs/learning-book/nl-NL");
  const files = walkMd(SRC);
  console.log("Learning-book md files:", files.length);
  if (DRY) return;

  for (const file of files) {
    const rel = path.relative(SRC, file);
    const outFile = path.join(OUT, rel);
    ensureDir(path.dirname(outFile));
    const raw = fs.readFileSync(file, "utf8");
    // English subject pages: keep English instructional targets; still localize chrome headings carefully
    const isEnglishSubject = rel.replace(/\\/g, "/").startsWith("english/");
    const lines = raw.split(/\r?\n/);
    const outLines = [];
    let inCode = false;
    for (const line of lines) {
      if (line.trim().startsWith("```")) {
        inCode = !inCode;
        outLines.push(line);
        continue;
      }
      if (inCode) {
        outLines.push(line);
        continue;
      }
      // Preserve metadata table values / ids
      if (/^\|\s*\*\*[^*]+\*\*\s*\|\s*`[^`]+`\s*\|/.test(line) || /^\|\s*Field\s*\|/.test(line)) {
        outLines.push(line);
        continue;
      }
      if (isEnglishSubject) {
        // Localize only markdown headings that are chrome; keep vocabulary/examples in English
        if (/^#{1,6}\s+/.test(line) || /^\*\*Source references:\*\*/.test(line) || /^\*\*Content scope:\*\*/.test(line)) {
          const { text, ph } = protectCode(line);
          const tr = await translateString(text, cache, { childFacing: true });
          outLines.push(restoreCode(applyGlossaryHints(tr.value), ph));
        } else {
          outLines.push(line);
        }
        continue;
      }
      if (!/[A-Za-z]/.test(line)) {
        outLines.push(line);
        continue;
      }
      const { text, ph } = protectCode(line);
      const tr = await translateString(text, cache, { childFacing: true });
      outLines.push(restoreCode(applyGlossaryHints(tr.value), ph));
    }
    fs.writeFileSync(outFile, outLines.join("\n"), "utf8");
    stats.bookFiles++;
    if (stats.bookFiles % 25 === 0) {
      saveCache(cache);
      console.log(`Books progress ${stats.bookFiles}/${files.length}`);
    }
  }
  saveCache(cache);
}

async function generateHelp(cache, stats) {
  const contentDir = path.join(ROOT, "data/help-center/content");
  const outDir = path.join(ROOT, "data/help-center/nl-NL");
  ensureDir(outDir);

  const sections = ["parents", "students", "parent-report", "subjects"];
  const exportsMap = {
    parents: "PARENT_ARTICLES",
    students: "STUDENT_ARTICLES",
    "parent-report": "PARENT_REPORT_ARTICLES",
    subjects: "SUBJECT_ARTICLES",
  };

  /** @type {Record<string, unknown[]>} */
  const bySection = {};

  for (const section of sections) {
    const file = path.join(contentDir, `${section === "parent-report" ? "parent-report" : section}.js`);
    const mod = await import(pathToFileURL(file).href);
    const articles = mod[exportsMap[section]] || mod.default || [];
    const unique = new Set();
    collectStrings(articles, undefined, undefined, unique);
    await fillCache(unique, cache, {
      childFacing: section === "students",
    });
    bySection[section] = await translateTree(articles, cache, stats, {
      childFacing: section === "students",
    });
    const exportName = exportsMap[section];
    const body = `/** Dutch (Netherlands) Help Center — ${section} */\nexport const ${exportName} = ${JSON.stringify(bySection[section], null, 2)};\n`;
    const outName =
      section === "parent-report" ? "parent-report.js" : `${section}.js`;
    fs.writeFileSync(path.join(outDir, outName), body, "utf8");
    stats.helpArticles += bySection[section].length;
  }

  const index = `import { PARENT_ARTICLES } from "./parents.js";
import { STUDENT_ARTICLES } from "./students.js";
import { PARENT_REPORT_ARTICLES } from "./parent-report.js";
import { SUBJECT_ARTICLES } from "./subjects.js";

export const SECTIONS_NL_NL = {
  parents: {
    key: "parents",
    title: "Gids voor ouders",
    description: "Registreren, kinderen beheren, rapporten bekijken en hulpmiddelen voor ouders of verzorgers.",
    href: "/help/parents",
    emoji: "👨‍👩‍👧",
    hubGradientKey: "parents",
  },
  students: {
    key: "students",
    title: "Gids voor leerlingen",
    description: "Inloggen, oefenen, missies en spellen — in eenvoudige taal.",
    href: "/help/students",
    emoji: "🎒",
    hubGradientKey: "students",
  },
  "parent-report": {
    key: "parent-report",
    title: "Ouderrapport uitgelegd",
    description: "Hoe u elk deel van het rapport leest — stap voor stap.",
    href: "/help/parent-report",
    emoji: "📊",
    hubGradientKey: "parent-report",
  },
  subjects: {
    key: "subjects",
    title: "Vakgidsen",
    description: "Wat oefenen per vak en hoe.",
    href: "/help/subjects",
    emoji: "📚",
    hubGradientKey: "subjects",
  },
};

export const BY_SECTION_NL_NL = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES_NL_NL = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];
`;
  fs.writeFileSync(path.join(outDir, "index.js"), index, "utf8");
}

async function main() {
  const cache = loadCache();
  const stats = {
    namespaceFiles: 0,
    packFiles: 0,
    scienceRecords: 0,
    bookFiles: 0,
    helpArticles: 0,
    stringsSeen: 0,
    translated: 0,
    skipped: 0,
    bySource: {},
    domains: {},
    forbiddenHits: [],
  };

  const runAll = !NAMESPACES_ONLY && !PACKS_ONLY && !SCIENCE_ONLY && !BOOKS_ONLY && !HELP_ONLY;

  if (runAll || NAMESPACES_ONLY) {
    console.log("=== locales/nl-NL ===");
    await generateNamespaces(cache, stats);
  }
  if (runAll || PACKS_ONLY) {
    console.log("=== content-packs/nl-NL ===");
    await generatePacks(cache, stats);
  }
  if (runAll || SCIENCE_ONLY) {
    console.log("=== science overlay ===");
    await generateScience(cache, stats);
  }
  if (runAll || BOOKS_ONLY) {
    console.log("=== learning books ===");
    await generateBooks(cache, stats);
  }
  if (runAll || HELP_ONLY) {
    console.log("=== help center ===");
    await generateHelp(cache, stats);
  }

  stats.forbiddenHits = stats.forbiddenHits.slice(0, 80);
  stats.cacheSize = Object.keys(cache).length;
  fs.writeFileSync(REPORT_PATH, JSON.stringify(stats, null, 2), "utf8");
  console.log("Done.", JSON.stringify(stats, null, 2));
  console.log("Report:", REPORT_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
