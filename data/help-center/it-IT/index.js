import { PARENT_ARTICLES } from "./parents.js";
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
