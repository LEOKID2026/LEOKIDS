import { PARENT_ARTICLES } from "./parents.js";
import { STUDENT_ARTICLES } from "./students.js";
import { PARENT_REPORT_ARTICLES } from "./parent-report.js";
import { SUBJECT_ARTICLES } from "./subjects.js";

export const SECTIONS_ES_419 = {
  parents: {
    key: "parents",
    title: "Guía para padres",
    description: "Registrarse, gestionar hijos e hijas, informes y herramientas para padres.",
    href: "/help/parents",
    emoji: "👨‍👩‍👧",
    hubGradientKey: "parents",
  },
  students: {
    key: "students",
    title: "Guía para estudiantes",
    description: "Inicio de sesión, práctica, misiones y juegos — en lenguaje sencillo.",
    href: "/help/students",
    emoji: "🎒",
    hubGradientKey: "students",
  },
  "parent-report": {
    key: "parent-report",
    title: "El informe para padres explicado",
    description: "Cómo leer cada parte del informe — paso a paso.",
    href: "/help/parent-report",
    emoji: "📊",
    hubGradientKey: "parent-report",
  },
  subjects: {
    key: "subjects",
    title: "Guías por materia",
    description: "Qué practicar en cada materia y cómo hacerlo.",
    href: "/help/subjects",
    emoji: "📚",
    hubGradientKey: "subjects",
  },
};

export const BY_SECTION_ES_419 = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES_ES_419 = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];
