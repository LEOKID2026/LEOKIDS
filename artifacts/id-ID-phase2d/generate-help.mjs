/**
 * Generate data/help-center/id-ID/* from English dump + help-dict.json
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const ART = path.join(ROOT, "artifacts/id-ID-phase2d");
const OUT = path.join(ROOT, "data/help-center/id-ID");

const help = JSON.parse(fs.readFileSync(path.join(ART, "en-help-dump.json"), "utf8"));
const dict = JSON.parse(fs.readFileSync(path.join(ART, "help-dict.json"), "utf8"));

const SKIP_KEYS = new Set([
  "slug",
  "section",
  "id",
  "kind",
  "level",
  "path",
  "src",
  "href",
  "ordered",
  "sources",
  "sourcesByViewport",
  "tone",
]);

const missing = new Set();
const identical = [];

function tr(s, ctx = "") {
  if (typeof s !== "string") return s;
  if (dict[s] !== undefined) {
    if (dict[s] === s && !/^(2026-05-23|PIN|PDF|PWA|Copilot|Avatar|Offline|Tic-tac-toe|Edit|info|data|avatar|disclaimer)$/i.test(s) && !s.includes("grade_") && !s.includes("Share →") && !s.includes("Add to Home Screen")) {
      // allowed brand/tech identical; track others
      if (!["Tips", "tip", "tips", "PDF", "PIN", "PWA", "Copilot", "Avatar", "Offline", "Edit", "info", "data", "avatar", "disclaimer", "arcade", "login"].includes(s)) {
        identical.push({ s, ctx });
      }
    }
    return dict[s];
  }
  // Preserve paths / technical
  if (s.startsWith("/") || s.startsWith("grade_") || /^[a-z]+(-[a-z0-9]+)+$/.test(s)) return s;
  missing.add(s);
  return s;
}

function walk(value, key = "") {
  if (typeof value === "string") {
    if (SKIP_KEYS.has(key)) return value;
    return tr(value, key);
  }
  if (Array.isArray(value)) return value.map((v, i) => walk(v, key));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (SKIP_KEYS.has(k) && typeof v !== "object") {
        out[k] = v;
      } else if (k === "sources" || k === "sourcesByViewport") {
        out[k] = v;
      } else {
        out[k] = walk(v, k);
      }
    }
    return out;
  }
  return value;
}

const idHelp = {
  parents: walk(help.parents),
  students: walk(help.students),
  "parent-report": walk(help["parent-report"]),
  subjects: walk(help.subjects),
};

// audience mapping
for (const section of Object.values(idHelp)) {
  for (const a of section) {
    if (a.audience === "parent" || a.audience === "orang tua") a.audience = "orang tua";
    if (a.audience === "student" || a.audience === "murid") a.audience = "murid";
  }
}

function emitSection(exportName, articles) {
  return `/** Indonesian (id-ID) Help — content only; MAIN registers globally. */\nexport const ${exportName} = ${JSON.stringify(articles, null, 2)};\n`;
}

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "parents.js"), emitSection("PARENT_ARTICLES", idHelp.parents));
fs.writeFileSync(path.join(OUT, "students.js"), emitSection("STUDENT_ARTICLES", idHelp.students));
fs.writeFileSync(path.join(OUT, "parent-report.js"), emitSection("PARENT_REPORT_ARTICLES", idHelp["parent-report"]));
fs.writeFileSync(path.join(OUT, "subjects.js"), emitSection("SUBJECT_ARTICLES", idHelp.subjects));

const indexJs = `import { PARENT_ARTICLES } from "./parents.js";
import { STUDENT_ARTICLES } from "./students.js";
import { PARENT_REPORT_ARTICLES } from "./parent-report.js";
import { SUBJECT_ARTICLES } from "./subjects.js";

export const SECTIONS_ID_ID = {
  parents: {
    key: "parents",
    title: "Panduan untuk orang tua",
    description: "Daftar, kelola anak, laporan, dan alat untuk orang tua.",
    href: "/help/parents",
    emoji: "👨‍👩‍👧",
    hubGradientKey: "parents",
  },
  students: {
    key: "students",
    title: "Panduan untuk murid",
    description: "Masuk, latihan, misi, dan gim — dalam bahasa yang sederhana.",
    href: "/help/students",
    emoji: "🎒",
    hubGradientKey: "students",
  },
  "parent-report": {
    key: "parent-report",
    title: "Laporan orang tua dijelaskan",
    description: "Cara membaca setiap bagian laporan — langkah demi langkah.",
    href: "/help/parent-report",
    emoji: "📊",
    hubGradientKey: "parent-report",
  },
  subjects: {
    key: "subjects",
    title: "Panduan mata pelajaran",
    description: "Apa yang dilatih di setiap mata pelajaran dan caranya.",
    href: "/help/subjects",
    emoji: "📚",
    hubGradientKey: "subjects",
  },
};

export const BY_SECTION_ID_ID = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES_ID_ID = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];
`;

fs.writeFileSync(path.join(OUT, "index.js"), indexJs);

fs.writeFileSync(
  path.join(ART, "help-generate-report.json"),
  JSON.stringify(
    {
      missing: [...missing],
      missingCount: missing.size,
      identicalSample: identical.slice(0, 40),
      identicalCount: identical.length,
      counts: {
        parents: idHelp.parents.length,
        students: idHelp.students.length,
        parentReport: idHelp["parent-report"].length,
        subjects: idHelp.subjects.length,
        total: Object.values(idHelp).reduce((n, a) => n + a.length, 0),
      },
    },
    null,
    2
  )
);

if (missing.size) {
  console.error("MISSING", [...missing].slice(0, 50));
  process.exit(1);
}
console.log("Help generated OK", {
  total: Object.values(idHelp).reduce((n, a) => n + a.length, 0),
  identicalTracked: identical.length,
});
