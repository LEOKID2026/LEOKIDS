import { PARENT_ARTICLES } from "./parents.js";
import { STUDENT_ARTICLES } from "./students.js";
import { PARENT_REPORT_ARTICLES } from "./parent-report.js";
import { SUBJECT_ARTICLES } from "./subjects.js";

export const SECTIONS_PT_BR = {
  "parents": {
    "key": "parents",
    "title": "Guia para responsáveis",
    "description": "Cadastre-se, gerencie filhos, relatórios e ferramentas para responsáveis.",
    "href": "/help/parents",
    "emoji": "👨‍👩‍👧",
    "hubGradientKey": "parents"
  },
  "students": {
    "key": "students",
    "title": "Guia para estudantes",
    "description": "Login, prática, missões e jogos — em linguagem simples.",
    "href": "/help/students",
    "emoji": "🎒",
    "hubGradientKey": "students"
  },
  "parent-report": {
    "key": "parent-report",
    "title": "Relatório pai explicado",
    "description": "Como ler cada parte do relatório — passo a passo.",
    "href": "/help/parent-report",
    "emoji": "📊",
    "hubGradientKey": "parent-report"
  },
  "subjects": {
    "key": "subjects",
    "title": "Guias de assuntos",
    "description": "O que praticar em cada disciplina e como.",
    "href": "/help/subjects",
    "emoji": "📚",
    "hubGradientKey": "subjects"
  }
};

export const BY_SECTION_PT_BR = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES_PT_BR = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];
