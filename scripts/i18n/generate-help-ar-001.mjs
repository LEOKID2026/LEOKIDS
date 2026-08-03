/**
 * Generate data/help-center/ar-001/* from English Help articles.
 * Preserves slugs, ids, hrefs, keywords structure, screenshot/video paths.
 *
 * Run: node scripts/i18n/generate-help-ar-001.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "data/help-center/ar-001");
const CACHE_PATH = path.join(__dirname, "_mt-cache-ar-001-help.json");

const PRESERVE_KEYS = new Set([
  "slug",
  "section",
  "id",
  "kind",
  "href",
  "path",
  "emoji",
  "hubGradientKey",
  "key",
  "type",
  "level",
  "sources",
  "mobile",
  "tablet",
  "desktop",
]);

const POST_FIXES = [
  [/Leo Crianças/g, "Leo Kids"],
  [/telemóvel/gi, "celular"],
  [/autocarro/gi, "ônibus"],
  [/ficheiro/gi, "arquivo"],
  [/\bGrau\b/g, "Ano"],
  [/\bgrau\b/g, "ano"],
  [/grades? 1/gi, "1º ano"],
  [/1 a 6/g, "1º ao 6º ano"],
  [/\bpais\b/gi, "responsáveis"],
  [/\bPais\b/g, "Responsáveis"],
];

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
  let out = (json[0] || []).map((x) => x[0]).join("");
  for (const [re, rep] of POST_FIXES) out = out.replace(re, rep);
  return out;
}

async function translateString(en, cache) {
  const s = String(en || "");
  if (!s.trim()) return s;
  if (/^\/[a-z0-9/_-]+$/i.test(s)) return s;
  if (cache[s]) return cache[s];
  try {
    cache[s] = await mt(s);
  } catch (err) {
    console.warn("MT fail:", s.slice(0, 60), err.message);
    cache[s] = s;
  }
  return cache[s];
}

async function transform(node, key, cache) {
  if (node == null) return node;
  if (typeof node === "string") {
    if (key && PRESERVE_KEYS.has(key)) return node;
    // Keep English keyword tokens for search parity where they are ids; still translate display keywords.
    return translateString(node, cache);
  }
  if (Array.isArray(node)) {
    const out = [];
    for (const item of node) out.push(await transform(item, key, cache));
    return out;
  }
  if (typeof node === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "sources") {
        out[k] = v;
        continue;
      }
      out[k] = await transform(v, k, cache);
    }
    return out;
  }
  return node;
}

function emitModule(exportName, value) {
  return `/** Auto-generated ar-001 Help — do not hand-edit structure/slugs. */\nexport const ${exportName} = ${JSON.stringify(value, null, 2)};\n`;
}

async function main() {
  const cache = loadCache();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const enIndexUrl = pathToFileURL(path.join(ROOT, "data/help-center/index.js")).href;
  // Import content modules directly to avoid assertAllArticlesValid side effects pulling es packs only
  const parents = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/parents.js")).href);
  const students = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/students.js")).href);
  const parentReport = await import(
    pathToFileURL(path.join(ROOT, "data/help-center/content/parent-report.js")).href
  );
  const subjects = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/subjects.js")).href);
  const { SECTIONS } = await import(enIndexUrl);

  const sectionsAr = await transform(SECTIONS, null, cache);
  // Restore non-translatable section keys / hrefs
  for (const key of Object.keys(SECTIONS)) {
    sectionsAr[key].key = SECTIONS[key].key;
    sectionsAr[key].href = SECTIONS[key].href;
    sectionsAr[key].emoji = SECTIONS[key].emoji;
    sectionsAr[key].hubGradientKey = SECTIONS[key].hubGradientKey;
  }

  const parentsArticles = await transform(parents.PARENT_ARTICLES, null, cache);
  const studentsArticles = await transform(students.STUDENT_ARTICLES, null, cache);
  const reportArticles = await transform(parentReport.PARENT_REPORT_ARTICLES, null, cache);
  const subjectArticles = await transform(subjects.SUBJECT_ARTICLES, null, cache);
  saveCache(cache);

  // Restore slugs/section/hrefs/paths from English
  function restoreMeta(translated, original) {
    for (let i = 0; i < original.length; i++) {
      const src = original[i];
      const dst = translated[i];
      dst.slug = src.slug;
      dst.section = src.section;
      dst.id = src.id;
      if (Array.isArray(src.toc)) {
        dst.toc = src.toc.map((t, idx) => ({ id: t.id, title: dst.toc?.[idx]?.title || t.title }));
      }
      if (Array.isArray(src.blocks) && Array.isArray(dst.blocks)) {
        for (let b = 0; b < src.blocks.length; b++) {
          const sb = src.blocks[b];
          const db = dst.blocks[b];
          if (!db) continue;
          db.kind = sb.kind;
          if (sb.id) db.id = sb.id;
          if (sb.path) db.path = sb.path;
          if (sb.href) db.href = sb.href;
          if (sb.sources) db.sources = sb.sources;
          if (sb.type) db.type = sb.type;
          if (sb.level != null) db.level = sb.level;
          if (Array.isArray(sb.links) && Array.isArray(db.links)) {
            for (let li = 0; li < sb.links.length; li++) {
              if (db.links[li] && sb.links[li]?.href) db.links[li].href = sb.links[li].href;
            }
          }
        }
      }
    }
    return translated;
  }

  restoreMeta(parentsArticles, parents.PARENT_ARTICLES);
  restoreMeta(studentsArticles, students.STUDENT_ARTICLES);
  restoreMeta(reportArticles, parentReport.PARENT_REPORT_ARTICLES);
  restoreMeta(subjectArticles, subjects.SUBJECT_ARTICLES);

  fs.writeFileSync(path.join(OUT_DIR, "parents.js"), emitModule("PARENT_ARTICLES", parentsArticles));
  fs.writeFileSync(path.join(OUT_DIR, "students.js"), emitModule("STUDENT_ARTICLES", studentsArticles));
  fs.writeFileSync(
    path.join(OUT_DIR, "parent-report.js"),
    emitModule("PARENT_REPORT_ARTICLES", reportArticles),
  );
  fs.writeFileSync(path.join(OUT_DIR, "subjects.js"), emitModule("SUBJECT_ARTICLES", subjectArticles));

  const indexSrc = `import { PARENT_ARTICLES } from "./parents.js";
import { STUDENT_ARTICLES } from "./students.js";
import { PARENT_REPORT_ARTICLES } from "./parent-report.js";
import { SUBJECT_ARTICLES } from "./subjects.js";

export const SECTIONS_AR_001 = ${JSON.stringify(sectionsAr, null, 2)};

export const BY_SECTION_AR_001 = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES_AR_001 = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];
`;
  fs.writeFileSync(path.join(OUT_DIR, "index.js"), indexSrc, "utf8");
  console.log("Wrote Help Center ar-001", {
    parents: parentsArticles.length,
    students: studentsArticles.length,
    parentReport: reportArticles.length,
    subjects: subjectArticles.length,
    cache: Object.keys(cache).length,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
