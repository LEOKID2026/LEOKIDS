import { PARENT_ARTICLES } from "./parents.js";
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
