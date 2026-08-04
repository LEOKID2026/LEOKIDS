/**
 * Rebuild Help Center nl-NL from English content with curated titles (local only).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { translateEnToNl } from "./_nl-NL-translate-engine.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/help-center/nl-NL");

const TITLE = {
  "welcome-and-overview": "Welkom bij de oudergids",
  "create-parent-account": "Een ouderaccount aanmaken",
  "parent-dashboard-tour": "Rondleiding door het ouderdashboard",
  "add-students": "Een kind toevoegen",
  "student-pin-and-credentials": "Pincode en inloggegevens voor uw kind",
  "edit-or-delete-student": "Een kind bewerken of verwijderen",
  "how-to-read-report": "Hoe begin ik met het lezen van het rapport?",
  "parent-copilot": "Vragen over het rapport (Copilot)",
  "monthly-rewards": "Maandelijkse volhardingsbeloning",
  "install-as-app": "Installeren als app",
  "mobile-and-offline": "Mobiel en offline spellen",
  "troubleshooting-login": "Problemen met inloggen oplossen",
  "privacy-and-data": "Privacy en gegevens",
  "student-login": "Hoe log ik in?",
  "student-home-tour": "Mijn startpagina",
  "choose-subject-and-grade": "Kies een vak en een groep",
  "answering-questions": "Hoe beantwoord ik vragen?",
  "hints-and-explanations": "Tips en uitleg",
  "daily-missions": "Dagelijkse missies",
  "monthly-persistence": "Maandelijkse volhardingsreis",
  "coins-and-arcade": "Munten en arcade",
  "avatar-and-profile": "Je avatar wijzigen",
  "offline-games": "Offline spellen",
  "tips-for-good-practice": "Tips voor goed oefenen",
  "report-overview": "Overzicht van het ouderrapport",
  "summary-card": "Samenvattingskaart",
  "data-presence": "Genoeg gegevens?",
  "trends-and-confidence": "Trends en betrouwbaarheidsniveau",
  "strengths-and-improvements": "Sterke punten en te verbeteren gebieden",
  "topics-and-buckets": "Onderwerpen per vak",
  "subjects-overview": "Overzicht van de vier vakken",
  "recommendations": "Oefenaanbevelingen",
  "challenges-section": "Aanbevolen uitdagingen",
  "detailed-report": "Gedetailleerd rapport",
  "printing-and-pdf": "Afdrukken en PDF-export",
  "understanding-the-disclaimer": "De belangrijke mededeling begrijpen",
  math: "Gids voor Rekenen",
  geometry: "Gids voor Meetkunde",
  english: "Gids voor Engels",
  science: "Gids voor Natuur en techniek",
};

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
  "screenshot",
  "screenshots",
  "video",
  "videos",
  "image",
  "src",
]);

const PHRASE = [
  ["parent guide", "oudergids"],
  ["Parent guide", "Oudergids"],
  ["parent report", "ouderrapport"],
  ["Parent report", "Ouderrapport"],
  ["your child", "uw kind"],
  ["Your child", "Uw kind"],
  ["sign in", "inloggen"],
  ["Sign in", "Inloggen"],
  ["log in", "inloggen"],
  ["Log in", "Inloggen"],
  ["dashboard", "dashboard"],
  ["subject", "vak"],
  ["subjects", "vakken"],
  ["grade", "groep"],
  ["grades", "groepen"],
  ["worksheet", "werkblad"],
  ["worksheets", "werkbladen"],
  ["Math", "Rekenen"],
  ["Geometry", "Meetkunde"],
  ["English", "Engels"],
  ["Science", "Natuur en techniek"],
  ["student", "leerling"],
  ["students", "leerlingen"],
  ["teacher", "leerkracht"],
  ["teachers", "leerkrachten"],
  ["parent", "ouder"],
  ["parents", "ouders"],
  ["guardian", "verzorger"],
  ["practice", "oefenen"],
  ["report", "rapport"],
  ["hint", "tip"],
  ["hints", "tips"],
  ["explanation", "uitleg"],
  ["explanations", "uitleg"],
  ["mission", "missie"],
  ["missions", "missies"],
  ["coins", "munten"],
  ["arcade", "arcade"],
  ["avatar", "avatar"],
  ["profile", "profiel"],
  ["offline", "offline"],
  ["privacy", "privacy"],
  ["data", "gegevens"],
  ["Welcome to", "Welkom bij"],
  ["How do I", "Hoe"],
  ["Create a", "Maak een"],
  ["Add a", "Voeg een"],
  ["Choose a", "Kies een"],
  ["Change your", "Wijzig je"],
  ["Tips for", "Tips voor"],
  ["Overview of", "Overzicht van"],
  ["Print and", "Afdrukken en"],
  ["the", "de"],
  ["and", "en"],
  ["with", "met"],
  ["for", "voor"],
  ["to", "naar"],
  ["a", "een"],
  ["an", "een"],
  ["your", "uw"],
  ["you", "u"],
  ["I", "ik"],
];

function translateHelpString(s, { childFacing = false } = {}) {
  let out = String(s ?? "");
  if (!out.trim()) return out;
  // Prefer engine + glossary style
  out = translateEnToNl(out, { childFacing });
  for (const [a, b] of PHRASE.sort((x, y) => y[0].length - x[0].length)) {
    out = out.split(a).join(b);
  }
  out = out
    .replace(/\bWiskunde\b/g, "Rekenen")
    .replace(/\bGrade\s*1\b/gi, "Groep 3")
    .replace(/\bGrade\s*2\b/gi, "Groep 4")
    .replace(/\bGrade\s*3\b/gi, "Groep 5")
    .replace(/\bGrade\s*4\b/gi, "Groep 6")
    .replace(/\bGrade\s*5\b/gi, "Groep 7")
    .replace(/\bGrade\s*6\b/gi, "Groep 8")
    .replace(/\bAll grades\b/gi, "Alle groepen")
    .replace(/\bSelect a grade\b/gi, "Kies een groep")
    .replace(/\bguide\b/gi, "gids")
    .replace(/\bstert\b/g, "begin")
    .replace(/\bsign in\b/gi, "inloggen")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (childFacing) {
    out = out.replace(/\bU\b/g, "Je").replace(/\buw\b/g, "jouw").replace(/\bUw\b/g, "Jouw");
  }
  return out;
}

function transform(node, ctx) {
  if (node == null) return node;
  if (typeof node === "string") {
    if (ctx.key && SKIP.has(ctx.key)) return node;
    return translateHelpString(node, ctx);
  }
  if (Array.isArray(node)) return node.map((x) => transform(x, ctx));
  if (typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "title" && node.slug && TITLE[node.slug]) {
        out.title = TITLE[node.slug];
        continue;
      }
      if (k === "section" && typeof v === "string") {
        // keep English section keys stable for loader
        out.section = v;
        continue;
      }
      out[k] = transform(v, { ...ctx, key: k });
    }
    return out;
  }
  return node;
}

async function load(name, exportName) {
  const mod = await import(pathToFileURL(path.join(ROOT, "data/help-center/content", name)).href + `?t=${Date.now()}`);
  return mod[exportName];
}

fs.mkdirSync(OUT, { recursive: true });

const parents = transform(await load("parents.js", "PARENT_ARTICLES"), { childFacing: false });
const students = transform(await load("students.js", "STUDENT_ARTICLES"), { childFacing: true });
const reports = transform(await load("parent-report.js", "PARENT_REPORT_ARTICLES"), { childFacing: false });
const subjects = transform(await load("subjects.js", "SUBJECT_ARTICLES"), { childFacing: false });

// Force titles again after transform
for (const list of [parents, students, reports, subjects]) {
  for (const a of list) {
    if (TITLE[a.slug]) a.title = TITLE[a.slug];
  }
}

fs.writeFileSync(
  path.join(OUT, "parents.js"),
  `/** Dutch (Netherlands) Help Center — parents */\nexport const PARENT_ARTICLES = ${JSON.stringify(parents, null, 2)};\n`,
);
fs.writeFileSync(
  path.join(OUT, "students.js"),
  `/** Dutch (Netherlands) Help Center — students */\nexport const STUDENT_ARTICLES = ${JSON.stringify(students, null, 2)};\n`,
);
fs.writeFileSync(
  path.join(OUT, "parent-report.js"),
  `/** Dutch (Netherlands) Help Center — parent-report */\nexport const PARENT_REPORT_ARTICLES = ${JSON.stringify(reports, null, 2)};\n`,
);
fs.writeFileSync(
  path.join(OUT, "subjects.js"),
  `/** Dutch (Netherlands) Help Center — subjects */\nexport const SUBJECT_ARTICLES = ${JSON.stringify(subjects, null, 2)};\n`,
);

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
fs.writeFileSync(path.join(OUT, "index.js"), index);
console.log({
  parents: parents.length,
  students: students.length,
  reports: reports.length,
  subjects: subjects.length,
  titles: [...parents, ...students, ...reports, ...subjects].map((a) => a.title),
});
