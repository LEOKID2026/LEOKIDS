/**
 * Generate data/help-center/de-DE/* from English Help articles.
 * Preserves slugs, ids, hrefs, keywords structure, screenshot/video paths.
 * Uses a hand-authored German dictionary (no MT/API calls).
 *
 * Run: node scripts/i18n/generate-help-de-DE.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DE_DE_HELP_DICTIONARY } from "./_de-DE-help-dictionary.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "data/help-center/de-DE");

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
  "updatedAt",
]);

const SECTIONS = {
  parents: {
    key: "parents",
    title: "Guide for parents",
    description: "Sign up, manage children, reports, and parent tools.",
    href: "/help/parents",
    emoji: "👨‍👩‍👧",
    hubGradientKey: "parents",
  },
  students: {
    key: "students",
    title: "Guide for students",
    description: "Login, practice, missions, and games — in simple language.",
    href: "/help/students",
    emoji: "🎒",
    hubGradientKey: "students",
  },
  "parent-report": {
    key: "parent-report",
    title: "Parent report explained",
    description: "How to read each part of the report — step by step.",
    href: "/help/parent-report",
    emoji: "📊",
    hubGradientKey: "parent-report",
  },
  subjects: {
    key: "subjects",
    title: "Subject guides",
    description: "What to practice in each subject and how.",
    href: "/help/subjects",
    emoji: "📚",
    hubGradientKey: "subjects",
  },
};

const missing = new Set();

function translateString(en) {
  const s = String(en || "");
  if (!s.trim()) return s;
  if (/^\/[a-z0-9/_-]+$/i.test(s)) return s;
  if (Object.prototype.hasOwnProperty.call(DE_DE_HELP_DICTIONARY, s)) {
    return DE_DE_HELP_DICTIONARY[s];
  }
  missing.add(s);
  return s;
}

function transform(node, key) {
  if (node == null) return node;
  if (typeof node === "string") {
    if (key && PRESERVE_KEYS.has(key)) return node;
    return translateString(node);
  }
  if (Array.isArray(node)) {
    return node.map((item) => transform(item, key));
  }
  if (typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "sources") {
        out[k] = v;
        continue;
      }
      out[k] = transform(v, k);
    }
    return out;
  }
  return node;
}

function emitModule(exportName, value) {
  return `/** Auto-generated de-DE Help — do not hand-edit structure/slugs. */\nexport const ${exportName} = ${JSON.stringify(value, null, 2)};\n`;
}

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

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const parents = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/parents.js")).href);
  const students = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/students.js")).href);
  const parentReport = await import(
    pathToFileURL(path.join(ROOT, "data/help-center/content/parent-report.js")).href
  );
  const subjects = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/subjects.js")).href);

  const sectionsDe = transform(SECTIONS, null);
  for (const key of Object.keys(SECTIONS)) {
    sectionsDe[key].key = SECTIONS[key].key;
    sectionsDe[key].href = SECTIONS[key].href;
    sectionsDe[key].emoji = SECTIONS[key].emoji;
    sectionsDe[key].hubGradientKey = SECTIONS[key].hubGradientKey;
  }

  const parentsArticles = transform(parents.PARENT_ARTICLES, null);
  const studentsArticles = transform(students.STUDENT_ARTICLES, null);
  const reportArticles = transform(parentReport.PARENT_REPORT_ARTICLES, null);
  const subjectArticles = transform(subjects.SUBJECT_ARTICLES, null);

  restoreMeta(parentsArticles, parents.PARENT_ARTICLES);
  restoreMeta(studentsArticles, students.STUDENT_ARTICLES);
  restoreMeta(reportArticles, parentReport.PARENT_REPORT_ARTICLES);
  restoreMeta(subjectArticles, subjects.SUBJECT_ARTICLES);

  if (missing.size) {
    console.warn("MISSING DICTIONARY ENTRIES:", [...missing]);
  }

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

export const SECTIONS_DE_DE = ${JSON.stringify(sectionsDe, null, 2)};

export const BY_SECTION_DE_DE = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES_DE_DE = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];
`;
  fs.writeFileSync(path.join(OUT_DIR, "index.js"), indexSrc, "utf8");
  console.log("Wrote Help Center de-DE", {
    parents: parentsArticles.length,
    students: studentsArticles.length,
    parentReport: reportArticles.length,
    subjects: subjectArticles.length,
    missingDictionaryEntries: missing.size,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
