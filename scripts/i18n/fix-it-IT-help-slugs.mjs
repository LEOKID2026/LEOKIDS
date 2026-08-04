/**
 * Restore English help section slugs/keys (parents, students, parent-report)
 * that were corrupted by offline word maps. Titles stay Italian.
 */
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "data/help-center/it-IT");

const REPLACEMENTS = [
  [/genitores/g, "parents"],
  [/alunnos/g, "students"],
  [/genitore-report/g, "parent-report"],
  // accidental Italianized identifier fragments inside paths already handled above
];

function fixFile(p) {
  let t = fs.readFileSync(p, "utf8");
  const before = t;
  for (const [re, to] of REPLACEMENTS) t = t.replace(re, to);
  if (t !== before) {
    fs.writeFileSync(p, t, "utf8");
    return true;
  }
  return false;
}

// rewrite index.js cleanly like other locales
const index = `import { PARENT_ARTICLES } from "./parents.js";
import { STUDENT_ARTICLES } from "./students.js";
import { PARENT_REPORT_ARTICLES } from "./parent-report.js";
import { SUBJECT_ARTICLES } from "./subjects.js";

export const SECTIONS_IT_IT = {
  parents: {
    key: "parents",
    title: "Guida per i genitori",
    description: "Registrazione, gestione dei figli, report e strumenti per genitori o tutori.",
    href: "/help/parents",
    emoji: "👨‍👩‍👧",
    hubGradientKey: "parents",
  },
  students: {
    key: "students",
    title: "Guida per gli alunni",
    description: "Accesso, esercitazione, missioni e giochi — in linguaggio semplice.",
    href: "/help/students",
    emoji: "🎒",
    hubGradientKey: "students",
  },
  "parent-report": {
    key: "parent-report",
    title: "Il report per i genitori spiegato",
    description: "Come leggere ogni parte del report — passo dopo passo.",
    href: "/help/parent-report",
    emoji: "📊",
    hubGradientKey: "parent-report",
  },
  subjects: {
    key: "subjects",
    title: "Guide alle materie",
    description: "Cosa esercitare in ogni materia e come.",
    href: "/help/subjects",
    emoji: "📚",
    hubGradientKey: "subjects",
  },
};

export const BY_SECTION_IT_IT = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES_IT_IT = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];
`;

fs.writeFileSync(path.join(DIR, "index.js"), index, "utf8");
let n = 1;
for (const name of ["parents.js", "students.js", "parent-report.js", "subjects.js"]) {
  if (fixFile(path.join(DIR, name))) n += 1;
}
console.log("help slug files fixed", n);
