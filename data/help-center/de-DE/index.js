import { PARENT_ARTICLES } from "./parents.js";
import { STUDENT_ARTICLES } from "./students.js";
import { PARENT_REPORT_ARTICLES } from "./parent-report.js";
import { SUBJECT_ARTICLES } from "./subjects.js";

export const SECTIONS_DE_DE = {
  "parents": {
    "key": "parents",
    "title": "Leitfaden für Eltern",
    "description": "Registrieren, Kinder verwalten, Berichte und Werkzeuge für Eltern.",
    "href": "/help/parents",
    "emoji": "👨‍👩‍👧",
    "hubGradientKey": "parents"
  },
  "students": {
    "key": "students",
    "title": "Leitfaden für Schüler",
    "description": "Anmeldung, Übungen, Missionen und Spiele — in einfacher Sprache.",
    "href": "/help/students",
    "emoji": "🎒",
    "hubGradientKey": "students"
  },
  "parent-report": {
    "key": "parent-report",
    "title": "Der Elternbericht erklärt",
    "description": "So lesen Sie jeden Teil des Berichts — Schritt für Schritt.",
    "href": "/help/parent-report",
    "emoji": "📊",
    "hubGradientKey": "parent-report"
  },
  "subjects": {
    "key": "subjects",
    "title": "Fach-Leitfäden",
    "description": "Was in jedem Fach geübt wird und wie.",
    "href": "/help/subjects",
    "emoji": "📚",
    "hubGradientKey": "subjects"
  }
};

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
