import { PARENT_ARTICLES } from "./parents.js";
import { STUDENT_ARTICLES } from "./students.js";
import { PARENT_REPORT_ARTICLES } from "./parent-report.js";
import { SUBJECT_ARTICLES } from "./subjects.js";

export const SECTIONS_FR_FR = {
  "parents": {
    "key": "parents",
    "title": "Guide pour les parents",
    "description": "Inscrivez-vous, gérez les enfants, les rapports et les outils pour les parents.",
    "href": "/help/parents",
    "emoji": "👨‍👩‍👧",
    "hubGradientKey": "parents"
  },
  "students": {
    "key": "students",
    "title": "Guide pour les élèves",
    "description": "Connexion, entraînement, missions et jeux – dans un langage simple.",
    "href": "/help/students",
    "emoji": "🎒",
    "hubGradientKey": "students"
  },
  "parent-report": {
    "key": "parent-report",
    "title": "Rapport parental expliqué",
    "description": "Comment lire chaque partie du rapport – étape par étape.",
    "href": "/help/parent-report",
    "emoji": "📊",
    "hubGradientKey": "parent-report"
  },
  "subjects": {
    "key": "subjects",
    "title": "Guides thématiques",
    "description": "Que pratiquer dans chaque matière et comment.",
    "href": "/help/subjects",
    "emoji": "📚",
    "hubGradientKey": "subjects"
  }
};

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
