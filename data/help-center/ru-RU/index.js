import { STUDENT_ARTICLES } from "./students.js";
import { PARENT_ARTICLES } from "./parents.js";
import { PARENT_REPORT_ARTICLES } from "./parent-report.js";
import { SUBJECT_ARTICLES } from "./subjects.js";

export const SECTIONS_RU_RU = {
  parents: {
    key: "parents",
    title: "Гид для родителей",
    description: "Регистрация, управление детьми, отчёты и инструменты для родителей.",
    href: "/help/parents",
    emoji: "👨‍👩‍👧",
    hubGradientKey: "parents",
  },
  students: {
    key: "students",
    title: "Гид для учеников",
    description: "Вход, практика, миссии и игры — простым языком.",
    href: "/help/students",
    emoji: "🎒",
    hubGradientKey: "students",
  },
  "parent-report": {
    key: "parent-report",
    title: "Отчёт родителя объяснён",
    description: "Как читать каждую часть отчёта — шаг за шагом.",
    href: "/help/parent-report",
    emoji: "📊",
    hubGradientKey: "parent-report",
  },
  subjects: {
    key: "subjects",
    title: "Гиды по предметам",
    description: "Что практиковать по каждому предмету и как.",
    href: "/help/subjects",
    emoji: "📚",
    hubGradientKey: "subjects",
  },
};

export const BY_SECTION_RU_RU = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES_RU_RU = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];
