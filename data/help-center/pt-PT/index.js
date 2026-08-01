import { BY_SECTION_PT_BR, SECTIONS_PT_BR } from "../pt-BR/index.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";
import { PARENT_REPORT_OVERRIDES_BY_SLUG } from "./parent-report.js";

export const SECTIONS_PT_PT = {
  parents: {
    ...SECTIONS_PT_BR.parents,
    title: "Guia para encarregados de educação",
    description: "Registe-se, faça a gestão dos filhos, consulte relatórios e use as ferramentas para encarregados de educação.",
  },
  students: {
    ...SECTIONS_PT_BR.students,
    title: "Guia para alunos",
    description: "Entrada, prática, missões e jogos — em linguagem simples.",
  },
  "parent-report": {
    ...SECTIONS_PT_BR["parent-report"],
    title: "Relatório do encarregado de educação explicado",
    description: "Como ler cada parte do relatório — passo a passo.",
  },
  subjects: {
    ...SECTIONS_PT_BR.subjects,
    title: "Guias das disciplinas",
    description: "O que praticar em cada disciplina e como.",
  },
};

export const BY_SECTION_PT_PT = {
  parents: mergeHelpArticlesWithOverlays(BY_SECTION_PT_BR.parents, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(BY_SECTION_PT_BR.students, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    BY_SECTION_PT_BR["parent-report"],
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(BY_SECTION_PT_BR.subjects, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_PT_PT = [
  ...BY_SECTION_PT_PT.parents,
  ...BY_SECTION_PT_PT.students,
  ...BY_SECTION_PT_PT["parent-report"],
  ...BY_SECTION_PT_PT.subjects,
];
