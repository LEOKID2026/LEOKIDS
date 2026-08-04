/**
 * One-shot generator for Angola (pt-AO) sparse country overlays on pt-PT.
 * Writes only locales/pt-AO and content-packs/pt-AO files.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const created = [];

function writeJson(rel, obj) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, `${JSON.stringify(obj, null, 2)}\n`, "utf8");
  created.push(rel);
}

/** Angola grade terminology transform from pt-PT educational "ano" → "classe". */
export function aoGrade(s) {
  if (typeof s !== "string") return s;
  let t = s;
  t = t.replace(/ensino básico/gi, "Ensino Primário");
  t = t.replace(/1º–2\.º ano/g, "1.ª–2.ª classe");
  t = t.replace(/3º–4\.º ano/g, "3.ª–4.ª classe");
  t = t.replace(/5º–6\.º ano/g, "5.ª–6.ª classe");
  t = t.replace(/da 1ª à 6\.º ano/g, "da 1.ª à 6.ª classe");
  t = t.replace(/do 1º ao 6\.º ano/g, "da 1.ª à 6.ª classe");
  t = t.replace(/1º ao 6\.º ano/g, "1.ª à 6.ª classe");
  t = t.replace(/da 3ª à 4\.º ano/g, "da 3.ª à 4.ª classe");
  t = t.replace(/do 3º ao 4\.º ano/g, "da 3.ª à 4.ª classe");
  t = t.replace(/de 3ª a 4\.º ano/g, "da 3.ª à 4.ª classe");
  t = t.replace(/da 5ª à 6\.º ano/g, "da 5.ª à 6.ª classe");
  t = t.replace(/da 5ª a 6\.º ano/g, "da 5.ª à 6.ª classe");
  t = t.replace(/de 5ª a 6\.º ano/g, "da 5.ª à 6.ª classe");
  t = t.replace(/para os anos 1–2/g, "para as classes 1–2");
  t = t.replace(/os anos 1–2/g, "as classes 1–2");
  for (let n = 1; n <= 6; n++) {
    t = t.replace(new RegExp(`${n}\\.º ano`, "g"), `${n}.ª classe`);
    t = t.replace(new RegExp(`${n}º ano`, "g"), `${n}.ª classe`);
  }
  t = t.replace(/\{grade\}\.º ano/g, "{grade}.ª classe");
  // Gender agreement after masculine→feminine grade noun swap
  t = t.replace(/\bdo (\d)\.ª classe/g, "da $1.ª classe");
  t = t.replace(/\bno (\d)\.ª classe/g, "na $1.ª classe");
  t = t.replace(/\bao (\d)\.ª classe/g, "à $1.ª classe");
  t = t.replace(/da (\d)ª a (\d)\.ª classe/g, "da $1.ª à $2.ª classe");
  t = t.replace(/da (\d)ª à (\d)\.ª classe/g, "da $1.ª à $2.ª classe");
  t = t.replace(/do (\d)º ao (\d)\.ª classe/g, "da $1.ª à $2.ª classe");
  t = t.replace(/Ano de escolaridade/g, "Classe");
  t = t.replace(/Ano inválido/g, "Classe inválida");
  t = t.replace(/Esse ano não/g, "Essa classe não");
  t = t.replace(/Escolher o ano/g, "Selecionar a classe");
  t = t.replace(/Escolhe o ano/g, "Seleciona a classe");
  t = t.replace(/escolhe o ano/g, "seleciona a classe");
  t = t.replace(/Escolhe um ano/g, "Seleciona uma classe");
  t = t.replace(/escolhe um ano/g, "seleciona uma classe");
  t = t.replace(/Escolhe a ano/g, "Seleciona a classe");
  t = t.replace(/escolhe a ano/g, "seleciona a classe");
  t = t.replace(/Selecione um ano/g, "Selecione uma classe");
  t = t.replace(/selecionar este ano/g, "selecionar esta classe");
  t = t.replace(/alterar o ano/g, "alterar a classe");
  t = t.replace(/Voltar aos anos/g, "Voltar às classes");
  t = t.replace(/Transporte e anos/g, "Transporte e classes");
  t = t.replace(/deste ano/g, "desta classe");
  t = t.replace(/este ano(?!\w)/g, "esta classe");
  t = t.replace(/outro ano/g, "outra classe");
  t = t.replace(/um ano(?!\w)/g, "uma classe");
  t = t.replace(/o teu ano/g, "a tua classe");
  t = t.replace(/o ano(?!\w)/g, "a classe");
  t = t.replace(/O ano(?!\w)/g, "A classe");
  t = t.replace(/por ano(?!\w)/g, "por classe");
  t = t.replace(/, ano,/g, ", classe,");
  t = t.replace(/tópico\/ano\/nível/g, "tópico/classe/nível");
  t = t.replace(/, anos e/g, ", classes e");
  t = t.replace(/anos e níveis/g, "classes e níveis");
  t = t.replace(/nome, ano e/g, "nome, classe e");
  t = t.replace(/escolha um ano/g, "escolha uma classe");
  t = t.replace(/escolha o ano/g, "escolha a classe");
  t = t.replace(/matéria, o ano,/g, "matéria, a classe,");
  t = t.replace(/disciplina, o ano,/g, "disciplina, a classe,");
  t = t.replace(/disciplina, ano e/g, "disciplina, classe e");
  t = t.replace(/nível do ano/g, "nível da classe");
  return t;
}

function main() {
writeJson("locales/pt-AO/common.json", {
  gradeLabel: "{grade}.ª classe",
  grade1: "1.ª classe",
  grade2: "2.ª classe",
  grade3: "3.ª classe",
  grade4: "4.ª classe",
  grade5: "5.ª classe",
  grade6: "6.ª classe",
});

writeJson("locales/pt-AO/learning.json", {
  chooseGrade: "Selecionar a classe",
  master: {
    gradeRequired:
      "Por favor, seleciona uma classe antes de praticar. Pede a um dos encarregados de educação para atualizar a tua classe.",
    grades: {
      g1: "1.ª classe",
      g2: "2.ª classe",
      g3: "3.ª classe",
      g4: "4.ª classe",
      g5: "5.ª classe",
      g6: "6.ª classe",
    },
    gradeTitle: "{grade}.ª classe",
    mistakePracticeBlurb:
      "Escolhe um erro recente para abrir a prática focada no mesmo tópico, classe e dificuldade.",
    notEnoughQuestions:
      "Não há perguntas suficientes para o tópico/classe/nível que escolheste. Tente alterar uma configuração.",
  },
  math: {
    howToLearnSteps: {
      step1:
        "Seleciona a classe, a dificuldade e a operação (adição, subtração, multiplicação, divisão, frações, porcentagens e muito mais).",
    },
  },
  geometry: {
    howToLearnSteps: {
      step1:
        "Seleciona a classe, a dificuldade e o tópico (área, perímetro, volume, ângulos, Pitágoras e muito mais).",
    },
    errors: {
      invalidGrade: "Classe inválida. Por favor, escolhe outra classe.",
      noTopics: "Não há tópicos disponíveis para esta classe. Por favor, escolhe outra classe.",
    },
  },
  science: {
    howToLearnSteps: {
      step1:
        "Seleciona a classe, o nível e o tópico (por exemplo, corpo humano, plantas, animais e muito mais).",
    },
  },
});

writeJson("locales/pt-AO/ui.json", {
  public: {
    about: {
      intro1:
        "O site foi projetado para alunos do Ensino Primário com prática por matéria, classe, tópico e nível de dificuldade. Cada criança pode começar onde faz sentido, avançar gradualmente e reforçar os temas em que precisa de mais confiança.",
    },
  },
  parent: {
    selectGrade: "Selecionar a classe",
    gradeRequired: "Selecione uma classe.",
    allowGradePicker: "Permitir que a criança escolha a classe nas páginas de aprendizagem",
  },
  home: {
    subhead:
      "Pratique matemática, geometria, inglês e ciências — feito para alunos do Ensino Primário.",
  },
});

writeJson("locales/pt-AO/worksheets.json", {
  createHint:
    "Selecione a disciplina, a classe, o tópico e o nível – depois crie uma ficha de trabalho pronta para imprimir.",
  publicReadyTitle: "Fichas de trabalho prontas por classe",
  gradeG1: "1.ª classe",
  gradeG2: "2.ª classe",
  gradeG3: "3.ª classe",
  gradeG4: "4.ª classe",
  gradeG5: "5.ª classe",
  gradeG6: "6.ª classe",
  selectGrade: "Classe",
  readyEmptyText:
    "Experimente alterar os filtros — ou escolha todas as disciplinas, classes e níveis.",
  publicDemoHint:
    "Uma breve demonstração com 8 exercícios – escolha disciplina, classe e tópico.",
});

writeJson("locales/pt-AO/school.json", {
  portal: {
    chooseGrade: "Selecionar a classe",
    backGrades: "← Voltar às classes",
    detailsSectionTransport: "Transporte e classes",
  },
  communication: {
    audienceGradeParents: "Encarregados desta classe",
    audienceGradeTeachers: "Professores desta classe",
    detailsSectionTransport: "Transporte e classes",
  },
});

writeJson("locales/pt-AO/validation.json", {
  invalidGrade: "Essa classe não é válida.",
});

writeJson("locales/pt-AO/seo.json", {
  homeTitle: "Leo Kids – Prática para alunos do Ensino Primário",
});

const grades = {
  g1: "1.ª classe",
  g2: "2.ª classe",
  g3: "3.ª classe",
  g4: "4.ª classe",
  g5: "5.ª classe",
  g6: "6.ª classe",
};
const gradeCopy = {
  grade_1: "1.ª classe",
  grade_2: "2.ª classe",
  grade_3: "3.ª classe",
  grade_4: "4.ª classe",
  grade_5: "5.ª classe",
  grade_6: "6.ª classe",
};

writeJson("content-packs/pt-AO/books/ui.json", { grades });
writeJson("content-packs/pt-AO/demo/ui.json", {
  enter: {
    intro:
      "Seleciona uma classe e explore o mundo infantil. {minutes} minutos de jogo e aprendizagem — sem inscrição.",
    chooseGradeLegend: "seleciona uma classe",
    activeSessionNote:
      "Tens uma demonstração ativa – alterar a classe não zera o cronômetro.",
  },
  grades,
});
writeJson("content-packs/pt-AO/rewards/ui.json", {
  gradeBands: {
    g12: "1.ª–2.ª classe",
    g34: "3.ª–4.ª classe",
    g56: "5.ª–6.ª classe",
  },
});

const subjectTitles = {
  english: "Inglês",
  geometry: "Geometria",
  math: "Matemática",
  science: "Ciências",
};
const meta = {};
for (const [sub, title] of Object.entries(subjectTitles)) {
  for (let n = 1; n <= 6; n++) {
    meta[`${sub}.g${n}`] = { bookTitle: `${title} - ${n}.ª classe` };
  }
}
writeJson("content-packs/pt-AO/books/registry-titles.json", { meta });

writeJson("content-packs/pt-AO/global-burn-down/lib__teacher-portal__teacher-class-grade.json", {
  copy: gradeCopy,
});
writeJson("content-packs/pt-AO/global-burn-down/lib__teacher-server__teacher-dashboard.server.json", {
  copy: gradeCopy,
});
writeJson(
  "content-packs/pt-AO/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json",
  { copy: gradeCopy }
);
writeJson("content-packs/pt-AO/global-burn-down/lib__site__public-page-seo.json", {
  copy: {
    ready_worksheets_a_worksheet_generator_and_answer_keys_for_elementary_pr:
      "fichas de trabalho prontas, um gerador de fichas de trabalho e soluções para prática no Ensino Primário.",
    digital_practice_for_elementary_learners_in_math_geometry_english_and_sc:
      "Prática digital para alunos do Ensino Primário em matemática, geometria, inglês e ciências.",
    leo_kids_practice_for_elementary_learners:
      "Leo Kids — prática para alunos do Ensino Primário.",
  },
});
writeJson("content-packs/pt-AO/global-burn-down/pages___app.json", {
  copy: {
    default_document_title: "Leo Kids · Aprendizagem para alunos do Ensino Primário",
  },
});
writeJson("content-packs/pt-AO/global-burn-down/lib__worksheets__worksheet-ui.json", {
  copy: {
    choose_a_subject_grade_topic_and_level_then_create_a_worksheet_ready_to_:
      "Escolha uma matéria, a classe, tópico e nível e crie uma ficha de trabalho pronta para imprimir.",
    ready_made_worksheets_by_grade: "fichas de trabalho prontas por classe",
  },
});
writeJson(
  "content-packs/pt-AO/global-burn-down/lib__learning__subject-permissions__subject-access.server.json",
  {
    copy: {
      you_don_t_have_permission_to_select_this_grade:
        "Não tem permissão para selecionar esta classe.",
    },
  }
);

const ptReportsIndex = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content-packs/pt-PT/reports/burn-down-index.json"), "utf8")
);
const gradeAwareKey = "utils__parent-report-language__grade-aware-recommendation-templates";
const src = ptReportsIndex[gradeAwareKey] || {};
const reportOverrides = {};
for (const [k, v] of Object.entries(src)) {
  if (typeof v !== "string") continue;
  const next = aoGrade(v);
  if (next !== v) reportOverrides[k] = next;
}
writeJson("content-packs/pt-AO/reports/burn-down-index.json", {
  [gradeAwareKey]: reportOverrides,
});
// Note: parent-report "grade" label lives in pt-BR ("Ano") and is absent from pt-PT sparse
// authority — do not add orphan grade:Classe here; report as open finding for main agent.

/**
 * Deep-collect differing string leaves under a subtree, preserving shape for sparse overlay.
 * @param {unknown} node
 * @param {unknown} base
 * @returns {unknown | undefined}
 */
function sparseDiffTree(node, base) {
  if (typeof node === "string" && typeof base === "string") {
    const next = aoGrade(node);
    return next !== base ? next : undefined;
  }
  if (!node || typeof node !== "object" || Array.isArray(node)) return undefined;
  if (!base || typeof base !== "object" || Array.isArray(base)) return undefined;
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    const child = sparseDiffTree(v, /** @type {Record<string, unknown>} */ (base)[k]);
    if (child !== undefined) out[k] = child;
  }
  return Object.keys(out).length ? out : undefined;
}

const engSkillsPath = path.join(ROOT, "content-packs/pt-PT/books/english-page-skills.json");
if (fs.existsSync(engSkillsPath)) {
  const eng = JSON.parse(fs.readFileSync(engSkillsPath, "utf8"));
  const diff = sparseDiffTree(eng, eng);
  if (diff) writeJson("content-packs/pt-AO/books/english-page-skills.json", diff);
}

console.log(
  JSON.stringify(
    {
      files: created.length,
      reportOverrideCount: Object.keys(reportOverrides).length,
      created,
    },
    null,
    2
  )
);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename || process.argv[1]);
if (isMain || process.argv[1]?.endsWith("_gen-pt-AO-sparse-layer.mjs")) {
  main();
}
