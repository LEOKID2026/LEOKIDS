/**
 * Generate data/help-center/fr-FR/* from English Help articles.
 * Run: node scripts/i18n/generate-help-fr-FR.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { applyGlossaryHints, loadCache, saveCache, translateStringFr } from "./_fr-FR-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "data/help-center/fr-FR");
const CACHE_PATH = path.join(__dirname, "_mt-cache-fr-FR-help.json");

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

function toneForSection(section) {
  if (section === "students") return "child";
  return "adult";
}

async function translateString(en, cache, tone) {
  const r = await translateStringFr(en, cache, { tone });
  return applyGlossaryHints(r.value);
}

async function transform(node, key, cache, tone) {
  if (node == null) return node;
  if (typeof node === "string") {
    if (key && PRESERVE_KEYS.has(key)) return node;
    return translateString(node, cache, tone);
  }
  if (Array.isArray(node)) {
    const out = [];
    for (const item of node) out.push(await transform(item, key, cache, tone));
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
      out[k] = await transform(v, k, cache, tone);
    }
    return out;
  }
  return node;
}

function emitModule(exportName, value) {
  return `/** Auto-generated fr-FR Help — do not hand-edit structure/slugs. */\nexport const ${exportName} = ${JSON.stringify(value, null, 2)};\n`;
}

async function main() {
  const cache = loadCache(CACHE_PATH);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const enIndexUrl = pathToFileURL(path.join(ROOT, "data/help-center/index.js")).href;
  const parents = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/parents.js")).href);
  const students = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/students.js")).href);
  const parentReport = await import(
    pathToFileURL(path.join(ROOT, "data/help-center/content/parent-report.js")).href
  );
  const subjects = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/subjects.js")).href);
  const { SECTIONS } = await import(enIndexUrl);

  const sectionsFr = await transform(SECTIONS, null, cache, "adult");
  for (const key of Object.keys(SECTIONS)) {
    sectionsFr[key].key = SECTIONS[key].key;
    sectionsFr[key].href = SECTIONS[key].href;
    sectionsFr[key].emoji = SECTIONS[key].emoji;
    sectionsFr[key].hubGradientKey = SECTIONS[key].hubGradientKey;
  }

  const parentsArticles = await transform(parents.PARENT_ARTICLES, null, cache, toneForSection("parents"));
  const studentsArticles = await transform(students.STUDENT_ARTICLES, null, cache, toneForSection("students"));
  const reportArticles = await transform(
    parentReport.PARENT_REPORT_ARTICLES,
    null,
    cache,
    toneForSection("parent-report"),
  );
  const subjectArticles = await transform(subjects.SUBJECT_ARTICLES, null, cache, toneForSection("subjects"));
  saveCache(CACHE_PATH, cache);

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

export const SECTIONS_FR_FR = ${JSON.stringify(sectionsFr, null, 2)};

export const BY_SECTION_FR_FR = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES_FR_FR = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];
`;
  fs.writeFileSync(path.join(OUT_DIR, "index.js"), indexSrc, "utf8");
  console.log("Wrote Help Center fr-FR", {
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
