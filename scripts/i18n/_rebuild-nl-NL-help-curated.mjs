/**
 * Rebuild Help Center nl-NL from English using curated exact EN→NL map (no MT API).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { HELP_EN_TO_NL } from "./_curated-nl-NL-help-map.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/help-center/nl-NL");

const SKIP = new Set([
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
  "related",
  "src",
  "updatedAt",
]);

const missing = [];

function translate(s, key) {
  if (typeof s !== "string") return s;
  if (SKIP.has(key)) return s;
  if (key === "audience") {
    if (s === "parent") return "ouder";
    if (s === "student") return "leerling";
  }
  if (Object.prototype.hasOwnProperty.call(HELP_EN_TO_NL, s)) return HELP_EN_TO_NL[s];
  if (s.trim() && /[A-Za-z]/.test(s) && !/^\/|^https?:/.test(s)) {
    missing.push({ key, s });
  }
  return s;
}

function transform(node, key = null) {
  if (node == null) return node;
  if (typeof node === "string") return translate(node, key);
  if (Array.isArray(node)) return node.map((x) => transform(x, key));
  if (typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = transform(v, k);
    return out;
  }
  return node;
}

async function load(name, exportName) {
  const mod = await import(
    pathToFileURL(path.join(ROOT, "data/help-center/content", name)).href + `?t=${Date.now()}`
  );
  return mod[exportName];
}

const parents = transform(await load("parents.js", "PARENT_ARTICLES"));
const students = transform(await load("students.js", "STUDENT_ARTICLES"));
const reports = transform(await load("parent-report.js", "PARENT_REPORT_ARTICLES"));
const subjects = transform(await load("subjects.js", "SUBJECT_ARTICLES"));

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(
  path.join(OUT, "parents.js"),
  `/** Dutch (Netherlands) Help Center — parents (curated) */\nexport const PARENT_ARTICLES = ${JSON.stringify(parents, null, 2)};\n`,
);
fs.writeFileSync(
  path.join(OUT, "students.js"),
  `/** Dutch (Netherlands) Help Center — students (curated) */\nexport const STUDENT_ARTICLES = ${JSON.stringify(students, null, 2)};\n`,
);
fs.writeFileSync(
  path.join(OUT, "parent-report.js"),
  `/** Dutch (Netherlands) Help Center — parent-report (curated) */\nexport const PARENT_REPORT_ARTICLES = ${JSON.stringify(reports, null, 2)};\n`,
);
fs.writeFileSync(
  path.join(OUT, "subjects.js"),
  `/** Dutch (Netherlands) Help Center — subjects (curated) */\nexport const SUBJECT_ARTICLES = ${JSON.stringify(subjects, null, 2)};\n`,
);
fs.writeFileSync(
  path.join(OUT, "index.js"),
  `import { PARENT_ARTICLES } from "./parents.js";
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
`,
);

const titles = [...parents, ...students, ...reports, ...subjects].map((a) => a.title);
console.log(
  JSON.stringify(
    {
      articles: titles.length,
      mapSize: Object.keys(HELP_EN_TO_NL).length,
      missingCount: missing.length,
      missing: missing.slice(0, 20),
      titles,
    },
    null,
    2,
  ),
);
if (missing.length) process.exitCode = 1;
