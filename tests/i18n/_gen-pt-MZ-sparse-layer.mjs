/**
 * One-shot generator for Mozambique (pt-MZ) sparse country overlays on pt-PT.
 * Writes only pt-MZ-dedicated locale/content-pack/help/test surfaces.
 * Derives from pt-PT (effective chain pt-PT←pt-BR); does not copy pt-AO.
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

function writeText(rel, text) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text, "utf8");
  created.push(rel);
}

/** Mozambique grade + European Portuguese educational terminology from pt-PT strings. */
export function mzGrade(s) {
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
  t = t.replace(/as classes 1–2/g, "as classes 1–2");
  for (let n = 1; n <= 6; n++) {
    t = t.replace(new RegExp(`${n}\\.º ano`, "g"), `${n}.ª classe`);
    t = t.replace(new RegExp(`${n}º ano`, "g"), `${n}.ª classe`);
  }
  t = t.replace(/\{grade\}\.º ano/g, "{grade}.ª classe");
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
  t = t.replace(/Escolher ano/g, "Selecionar a classe");
  t = t.replace(/Escolhe o ano/g, "Seleciona a classe");
  t = t.replace(/escolhe o ano/g, "seleciona a classe");
  t = t.replace(/Escolhe um ano/g, "Seleciona uma classe");
  t = t.replace(/escolhe um ano/g, "seleciona uma classe");
  t = t.replace(/Escolhe a ano/g, "Seleciona a classe");
  t = t.replace(/escolhe a ano/g, "seleciona a classe");
  t = t.replace(/Selecione um ano/g, "Selecione uma classe");
  t = t.replace(/Selecione uma nota/g, "Selecione uma classe");
  t = t.replace(/selecionar este ano/g, "selecionar esta classe");
  t = t.replace(/alterar o ano/g, "alterar a classe");
  t = t.replace(/Alterar nota/g, "Alterar classe");
  t = t.replace(/Voltar aos anos/g, "Voltar às classes");
  t = t.replace(/Transporte e anos/g, "Transporte e classes");
  t = t.replace(/deste ano/g, "desta classe");
  t = t.replace(/este ano(?!\w)/g, "esta classe");
  t = t.replace(/outro ano/g, "outra classe");
  t = t.replace(/um ano(?!\w)/g, "uma classe");
  t = t.replace(/o teu ano/g, "a tua classe");
  t = t.replace(/a ano(?!\w)/g, "a classe");
  t = t.replace(/o ano(?!\w)/g, "a classe");
  t = t.replace(/O ano(?!\w)/g, "A classe");
  t = t.replace(/\bAno\b/g, "Classe");
  t = t.replace(/por ano(?!\w)/g, "por classe");
  t = t.replace(/, ano,/g, ", classe,");
  t = t.replace(/tópico\/ano\/nível/g, "tópico/classe/nível");
  t = t.replace(/, anos e/g, ", classes e");
  t = t.replace(/anos e níveis/g, "classes e níveis");
  t = t.replace(/nome, ano e/g, "nome, classe e");
  t = t.replace(/escolha um ano/g, "escolha uma classe");
  t = t.replace(/escolha o ano/g, "escolha a classe");
  t = t.replace(/escolha a nota/g, "escolha a classe");
  t = t.replace(/matéria, o ano,/g, "matéria, a classe,");
  t = t.replace(/disciplina, o ano,/g, "disciplina, a classe,");
  t = t.replace(/disciplina, ano e/g, "disciplina, classe e");
  t = t.replace(/nível do ano/g, "nível da classe");
  t = t.replace(/de acordo com a ano/g, "de acordo com a classe");
  t = t.replace(/porcentagens/g, "percentagens");
  t = t.replace(/cronômetro/g, "cronómetro");
  t = t.replace(/gerenciamento/g, "gestão");
  t = t.replace(/Gerenciar/g, "Gerir");
  t = t.replace(/Adequado para grau/g, "Adequadas à classe");
  t = t.replace(/Todos os anos/g, "Todas as classes");
  t = t.replace(/Nota atual/g, "Classe atual");
  t = t.replace(/Ano atual/g, "Classe atual");
  t = t.replace(/· Nota:/g, "· Classe:");
  t = t.replace(/· Ano:/g, "· Classe:");
  return t;
}

/**
 * @param {unknown} node
 * @param {unknown} base
 * @returns {unknown | undefined}
 */
function sparseDiffTree(node, base) {
  if (typeof node === "string" && typeof base === "string") {
    const next = mzGrade(node);
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

/**
 * Keep only leaves that differ from effective authority value.
 * @param {Record<string, unknown>} overlay
 * @param {Record<string, unknown>} effective
 */
function pruneIdentical(overlay, effective) {
  /** @param {unknown} ov @param {unknown} ef */
  function walk(ov, ef) {
    if (typeof ov === "string") {
      if (typeof ef !== "string") return ov;
      return ov === ef ? undefined : ov;
    }
    if (!ov || typeof ov !== "object" || Array.isArray(ov)) return ov;
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(ov)) {
      const child = walk(v, ef && typeof ef === "object" ? ef[k] : undefined);
      if (child !== undefined) out[k] = child;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return walk(overlay, effective) || {};
}

function deepMerge(base, overlay) {
  if (overlay == null) return base;
  if (base == null) return overlay;
  if (typeof overlay !== "object" || Array.isArray(overlay)) return overlay;
  if (typeof base !== "object" || Array.isArray(base)) return overlay;
  /** @type {Record<string, unknown>} */
  const out = { ...base };
  for (const [k, v] of Object.entries(overlay)) {
    out[k] = deepMerge(out[k], v);
  }
  return out;
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function effectiveLocale(rel) {
  const brPath = path.join(ROOT, "locales/pt-BR", rel);
  const ptPath = path.join(ROOT, "locales/pt-PT", rel);
  const br = fs.existsSync(brPath) ? JSON.parse(fs.readFileSync(brPath, "utf8")) : {};
  const pt = fs.existsSync(ptPath) ? JSON.parse(fs.readFileSync(ptPath, "utf8")) : {};
  return deepMerge(br, pt);
}

function main() {
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

  // —— locales ——
  writeJson(
    "locales/pt-MZ/common.json",
    pruneIdentical(
      {
        gradeLabel: "{grade}.ª classe",
        grade1: "1.ª classe",
        grade2: "2.ª classe",
        grade3: "3.ª classe",
        grade4: "4.ª classe",
        grade5: "5.ª classe",
        grade6: "6.ª classe",
      },
      effectiveLocale("common.json")
    )
  );

  writeJson(
    "locales/pt-MZ/learning.json",
    pruneIdentical(
      {
        chooseGrade: "Selecionar a classe",
        master: {
          gradeRequired:
            "Por favor, seleciona uma classe antes de praticar. Pede a um dos encarregados de educação para atualizar a tua classe.",
          gradeFallback: "Classe",
          grades,
          gradeTitle: "{grade}.ª classe",
          mistakePracticeBlurb:
            "Escolhe um erro recente para abrir a prática focada no mesmo tópico, classe e dificuldade.",
          currentGrade: "Classe atual",
          notEnoughQuestions:
            "Não há perguntas suficientes para o tópico/classe/nível que escolheste. Tente alterar uma configuração.",
        },
        math: {
          howToLearnBlurb:
            "O objetivo é praticar matemática de uma forma divertida, de acordo com a classe, o tema e a dificuldade.",
          howToLearnSteps: {
            step1:
              "Seleciona a classe, a dificuldade e a operação (adição, subtração, multiplicação, divisão, frações, percentagens e muito mais).",
            step2:
              "Escolhe um modo de jogo: aprendizagem, desafio com cronómetro e vidas, velocidade ou maratona.",
          },
        },
        geometry: {
          howToLearnBlurb:
            "O objetivo é praticar geometria de uma forma divertida, de acordo com a classe, o tema e a dificuldade.",
          howToLearnSteps: {
            step1:
              "Seleciona a classe, a dificuldade e o tópico (área, perímetro, volume, ângulos, Pitágoras e muito mais).",
            step2:
              "Escolhe um modo de jogo: aprendizagem, desafio com cronómetro e vidas, velocidade ou maratona.",
          },
          errors: {
            invalidGrade: "Classe inválida. Por favor, escolhe outra classe.",
            noTopics: "Não há tópicos disponíveis para esta classe. Por favor, escolhe outra classe.",
          },
        },
        science: {
          howToLearnBlurb:
            "O objetivo é praticar ciências de uma forma divertida, de acordo com a classe, o tema e a dificuldade.",
          howToLearnSteps: {
            step1:
              "Seleciona a classe, o nível e o tópico (por exemplo, corpo humano, plantas, animais e muito mais).",
            step2:
              "Escolhe um modo de jogo: aprendizagem, desafio com cronómetro e vidas, velocidade ou maratona.",
          },
        },
      },
      effectiveLocale("learning.json")
    )
  );

  writeJson(
    "locales/pt-MZ/ui.json",
    pruneIdentical(
      {
        public: {
          homepage: {
            parentBenefits: {
              items: {
                0: {
                  text: "Uma visão mais ampla do que uma classe — construída a partir de atividades reais.",
                },
              },
            },
          },
          about: {
            intro1:
              "O site foi projetado para alunos do Ensino Primário com prática por matéria, classe, tópico e nível de dificuldade. Cada criança pode começar onde faz sentido, avançar gradualmente e reforçar os temas em que precisa de mais confiança.",
          },
        },
        parent: {
          selectGrade: "Selecionar a classe",
          gradeRequired: "Selecione uma classe.",
          allowGradePicker: "Permitir que a criança escolha a classe nas páginas de aprendizagem",
          filterSuitable: "Adequadas à classe",
          gradeSuitable: "Adequadas à classe",
        },
        home: {
          subhead:
            "Pratique matemática, geometria, inglês e ciências — feito para alunos do Ensino Primário.",
        },
        installApp: {
          prompt: {
            installNow: "Descarregue e instale agora",
          },
        },
      },
      effectiveLocale("ui.json")
    )
  );

  writeJson(
    "locales/pt-MZ/worksheets.json",
    pruneIdentical(
      {
        createHint:
          "Selecione a disciplina, a classe, o tópico e o nível – depois crie uma ficha de trabalho pronta para imprimir.",
        publicReadyTitle: "Fichas de trabalho prontas por classe",
        gradeField: "Classe",
        gradeFilterAll: "Todas as classes",
        gradeG1: "1.ª classe",
        gradeG2: "2.ª classe",
        gradeG3: "3.ª classe",
        gradeG4: "4.ª classe",
        gradeG5: "5.ª classe",
        gradeG6: "6.ª classe",
        selectGrade: "Classe",
        readyEmptyText:
          "Experimente alterar os filtros — ou escolha todas as disciplinas, classes e níveis.",
        publicDemoHint: "Uma breve demonstração com 8 exercícios – escolha disciplina, classe e tópico.",
      },
      effectiveLocale("worksheets.json")
    )
  );

  writeJson(
    "locales/pt-MZ/school.json",
    pruneIdentical(
      {
        portal: {
          classesSubtitle:
            "Escolha a classe, a turma física e a disciplina — relatórios e gestão por classe",
          chooseGrade: "Selecionar a classe",
          backGrades: "← Voltar às classes",
          colGrade: "Classe",
          studentsSubtitle:
            "Explorar por classe e turma — relatórios da criança sem inserir identificadores",
          createStudentGrade: "Classe",
          classMgmtGrade: "Classe",
          assignCurrentGrade: "Classe atual",
          assignTargetGrade: "Classe de destino",
          detailsSectionTransport: "Transporte e classes",
        },
        communication: {
          audienceGradeParents: "Encarregados desta classe",
          audienceGradeTeachers: "Professores desta classe",
          detailsFieldGrade: "Classe",
          detailsSectionTransport: "Transporte e classes",
        },
        reportSummary: {
          studentLine: "Respostas: {totalAnswers} · Precisão: {accuracy} · Classe: {gradeLevel}",
        },
      },
      effectiveLocale("school.json")
    )
  );

  writeJson(
    "locales/pt-MZ/validation.json",
    pruneIdentical({ invalidGrade: "Essa classe não é válida." }, effectiveLocale("validation.json"))
  );

  writeJson(
    "locales/pt-MZ/seo.json",
    pruneIdentical(
      {
        homeTitle: "Leo Kids – Prática para alunos do Ensino Primário",
        learningDescription: "Escolha uma matéria e uma classe para começar a praticar.",
      },
      effectiveLocale("seo.json")
    )
  );

  // —— content-packs: books / demo / rewards ——
  writeJson("content-packs/pt-MZ/books/ui.json", { grades });

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
  writeJson("content-packs/pt-MZ/books/registry-titles.json", { meta });

  const engSkillsPath = path.join(ROOT, "content-packs/pt-PT/books/english-page-skills.json");
  if (fs.existsSync(engSkillsPath)) {
    const eng = JSON.parse(fs.readFileSync(engSkillsPath, "utf8"));
    const diff = sparseDiffTree(eng, eng);
    if (diff) writeJson("content-packs/pt-MZ/books/english-page-skills.json", diff);
  }

  writeJson("content-packs/pt-MZ/demo/ui.json", {
    bar: {
      gradeLabel: "Classe",
      changeGrade: "Alterar classe",
    },
    enter: {
      intro:
        "Seleciona uma classe e explora o mundo infantil. {minutes} minutos de jogo e aprendizagem — sem inscrição.",
      chooseGradeLegend: "seleciona uma classe",
      activeSessionNote: "Tens uma demonstração ativa – alterar a classe não zera o cronómetro.",
    },
    grades,
    parentPortal: {
      homeParentAriaLabel: "Demonstração do encarregado de educação – portal somente pré-visualização",
    },
  });

  writeJson("content-packs/pt-MZ/rewards/ui.json", {
    gradeBands: {
      g12: "1.ª–2.ª classe",
      g34: "3.ª–4.ª classe",
      g56: "5.ª–6.ª classe",
    },
    series: {
      "sport-fun": "Desportos e Diversão",
    },
    fallback: {
      keepLearning: "Continuar a aprender para desbloquear este cartão",
    },
    surpriseBox: {
      keepLearning: "Continuar a aprender – uma nova caixa estará disponível em breve!",
      myCollection: "A minha coleção",
    },
    previewModal: {
      download: "Descarregue o meu cartão",
      downloading: "A descarregar...",
    },
    cardsPage: {
      tabs: {
        collection: {
          label: "A minha coleção",
        },
      },
    },
  });

  // —— games ——
  writeJson("content-packs/pt-MZ/games/burn-down-index.json", {
    "components__educational-games__leo-lab__leo-lab-data": {
      grades_1_2: "1.ª–2.ª classe",
    },
    "components__educational-games__leo-word-train__leo-word-train-data": {
      grades_1_2: "1.ª–2.ª classe",
      grades_3_4: "3.ª–4.ª classe",
      grades_5_6: "5.ª–6.ª classe",
    },
    "components__educational-games__leo-word-detective__leo-word-detective-data": {
      grades_1_2: "1.ª–2.ª classe",
      grades_3_4: "3.ª–4.ª classe",
      grades_5_6: "5.ª–6.ª classe",
    },
  });
  writeJson(
    "content-packs/pt-MZ/games/burn-down/components__educational-games__leo-lab__leo-lab-data.json",
    { copy: { grades_1_2: "1.ª–2.ª classe" } }
  );
  writeJson(
    "content-packs/pt-MZ/games/burn-down/components__educational-games__leo-word-train__leo-word-train-data.json",
    {
      copy: {
        grades_1_2: "1.ª–2.ª classe",
        grades_3_4: "3.ª–4.ª classe",
        grades_5_6: "5.ª–6.ª classe",
      },
    }
  );
  writeJson(
    "content-packs/pt-MZ/games/burn-down/components__educational-games__leo-word-detective__leo-word-detective-data.json",
    {
      copy: {
        grades_1_2: "1.ª–2.ª classe",
        grades_3_4: "3.ª–4.ª classe",
        grades_5_6: "5.ª–6.ª classe",
      },
    }
  );

  // —— learning curriculum labels ——
  writeJson("content-packs/pt-MZ/learning/burn-down-index.json", {
    "utils__curriculum-audit__israeli-primary-curriculum-map": {
      grades_1_2_grammar_not_assumed_core_exposure_enrichment_separation:
        "1.ª e 2.ª classes: gramática não assumida como núcleo; separação exposição/enriquecimento.",
      israel_elementary_grades_1_6_conservative_structured_mapping_advisory_so:
        "Ensino Primário de Israel (1.ª a 6.ª classes) — mapeamento estruturado conservador + âncoras de fontes consultivas",
    },
    "utils__curriculum-audit__official-primary-curriculum-spine": {
      israeli_elementary_grades_1_6_source_anchored_planning_spine_not_syllabu:
        "Classes do Ensino Primário israelenses da 1.ª à 6.ª classe — coluna de planejamento ancorada na fonte (não certificação de plano de estudos)",
    },
  });
  writeJson(
    "content-packs/pt-MZ/learning/burn-down/utils__curriculum-audit__israeli-primary-curriculum-map.json",
    {
      copy: {
        grades_1_2_grammar_not_assumed_core_exposure_enrichment_separation:
          "1.ª e 2.ª classes: gramática não assumida como núcleo; separação exposição/enriquecimento.",
        israel_elementary_grades_1_6_conservative_structured_mapping_advisory_so:
          "Ensino Primário de Israel (1.ª a 6.ª classes) — mapeamento estruturado conservador + âncoras de fontes consultivas",
      },
    }
  );
  writeJson(
    "content-packs/pt-MZ/learning/burn-down/utils__curriculum-audit__official-primary-curriculum-spine.json",
    {
      copy: {
        israeli_elementary_grades_1_6_source_anchored_planning_spine_not_syllabu:
          "Classes do Ensino Primário israelenses da 1.ª à 6.ª classe — coluna de planejamento ancorada na fonte (não certificação de plano de estudos)",
      },
    }
  );

  // —— reports ——
  const ptReportsIndex = readJson("content-packs/pt-PT/reports/burn-down-index.json");
  const gradeAwareKey = "utils__parent-report-language__grade-aware-recommendation-templates";
  const src = ptReportsIndex[gradeAwareKey] || {};
  /** @type {Record<string, string>} */
  const reportOverrides = {};
  for (const [k, v] of Object.entries(src)) {
    if (typeof v !== "string") continue;
    const next = mzGrade(v);
    if (next !== v) reportOverrides[k] = next;
  }
  writeJson("content-packs/pt-MZ/reports/burn-down-index.json", {
    "components__parent-report-detailed-surface": {
      grade: "Classe",
    },
    [gradeAwareKey]: reportOverrides,
  });
  writeJson(
    "content-packs/pt-MZ/reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json",
    { copy: reportOverrides }
  );
  writeJson("content-packs/pt-MZ/reports/burn-down/components__parent-report-detailed-surface.json", {
    copy: { grade: "Classe" },
  });
  writeJson(
    "content-packs/pt-MZ/reports/burn-down/utils__parent-report-surface__parent-topic-tier.json",
    { copy: { practice_above_grade_level: "Pratique acima do nível da classe" } }
  );

  // —— global burn-down ——
  writeJson("content-packs/pt-MZ/global-burn-down/burn-down-index.json", {
    "lib__site__public-page-seo": {
      ready_worksheets_a_worksheet_generator_and_answer_keys_for_elementary_pr:
        "fichas de trabalho prontas, um gerador de fichas de trabalho e soluções para prática no Ensino Primário.",
      digital_practice_for_elementary_learners_in_math_geometry_english_and_sc:
        "Prática digital para alunos do Ensino Primário em matemática, geometria, inglês e ciências.",
      leo_kids_practice_for_elementary_learners:
        "Leo Kids — prática para alunos do Ensino Primário.",
    },
    "lib__teacher-portal__teacher-class-grade": gradeCopy,
    "lib__teacher-server__teacher-dashboard.server": gradeCopy,
    "lib__worksheets__worksheet-meta-labels-en.server": gradeCopy,
    "lib__worksheets__worksheet-ui": {
      choose_a_subject_grade_topic_and_level_then_create_a_worksheet_ready_to_:
        "Escolha uma matéria, a classe, tópico e nível e crie uma ficha de trabalho pronta para imprimir.",
      ready_made_worksheets_by_grade: "fichas de trabalho prontas por classe",
    },
    "lib__learning__subject-permissions__subject-access.server": {
      you_don_t_have_permission_to_select_this_grade:
        "Não tem permissão para selecionar esta classe.",
    },
    pages___app: {
      default_document_title: "Leo Kids · Aprendizagem para alunos do Ensino Primário",
    },
  });
  writeJson("content-packs/pt-MZ/global-burn-down/lib__teacher-portal__teacher-class-grade.json", {
    copy: gradeCopy,
  });
  writeJson(
    "content-packs/pt-MZ/global-burn-down/lib__teacher-server__teacher-dashboard.server.json",
    { copy: gradeCopy }
  );
  writeJson(
    "content-packs/pt-MZ/global-burn-down/lib__worksheets__worksheet-meta-labels-en.server.json",
    { copy: gradeCopy }
  );
  writeJson("content-packs/pt-MZ/global-burn-down/lib__site__public-page-seo.json", {
    copy: {
      ready_worksheets_a_worksheet_generator_and_answer_keys_for_elementary_pr:
        "fichas de trabalho prontas, um gerador de fichas de trabalho e soluções para prática no Ensino Primário.",
      digital_practice_for_elementary_learners_in_math_geometry_english_and_sc:
        "Prática digital para alunos do Ensino Primário em matemática, geometria, inglês e ciências.",
      leo_kids_practice_for_elementary_learners:
        "Leo Kids — prática para alunos do Ensino Primário.",
    },
  });
  writeJson("content-packs/pt-MZ/global-burn-down/pages___app.json", {
    copy: {
      default_document_title: "Leo Kids · Aprendizagem para alunos do Ensino Primário",
    },
  });
  writeJson("content-packs/pt-MZ/global-burn-down/lib__worksheets__worksheet-ui.json", {
    copy: {
      choose_a_subject_grade_topic_and_level_then_create_a_worksheet_ready_to_:
        "Escolha uma matéria, a classe, tópico e nível e crie uma ficha de trabalho pronta para imprimir.",
      ready_made_worksheets_by_grade: "fichas de trabalho prontas por classe",
    },
  });
  writeJson(
    "content-packs/pt-MZ/global-burn-down/lib__learning__subject-permissions__subject-access.server.json",
    {
      copy: {
        you_don_t_have_permission_to_select_this_grade:
          "Não tem permissão para selecionar esta classe.",
      },
    }
  );

  // —— Help ——
  writeText(
    "data/help-center/pt-MZ/merge-overlays.js",
    `/**
 * Apply sparse Help Center overlays onto a base article list (by slug).
 * Utility pattern for Mozambique (pt-MZ) sparse Help overlays on pt-PT Help.
 */

/**
 * @typedef {{
 *   title?: string,
 *   summary?: string,
 *   keywords?: string[],
 *   blockPatches?: Array<{
 *     id?: string,
 *     kind?: string,
 *     textIncludes?: string,
 *     altIncludes?: string,
 *     paragraphIncludes?: string,
 *     text?: string,
 *     alt?: string,
 *     caption?: string,
 *     items?: string[],
 *     paragraphs?: string[],
 *   }>,
 * }} HelpArticleOverlay
 */

/**
 * @param {Record<string, unknown>} block
 * @param {NonNullable<HelpArticleOverlay["blockPatches"]>[number]} patch
 */
function blockMatches(block, patch) {
  if (patch.id != null && block.id !== patch.id) return false;
  if (patch.kind != null && block.kind !== patch.kind) return false;
  if (patch.textIncludes != null) {
    const hay = String(block.text || "");
    if (!hay.includes(patch.textIncludes)) return false;
  }
  if (patch.altIncludes != null) {
    const hay = String(block.alt || "");
    if (!hay.includes(patch.altIncludes)) return false;
  }
  if (patch.paragraphIncludes != null) {
    const paras = Array.isArray(block.paragraphs) ? block.paragraphs.join("\\n") : "";
    if (!paras.includes(patch.paragraphIncludes)) return false;
  }
  return Boolean(
    patch.id || patch.kind || patch.textIncludes || patch.altIncludes || patch.paragraphIncludes
  );
}

/**
 * @param {Record<string, unknown>} block
 * @param {NonNullable<HelpArticleOverlay["blockPatches"]>[number]} patch
 */
function applyBlockPatch(block, patch) {
  /** @type {Record<string, unknown>} */
  const next = { ...block };
  if (patch.text !== undefined) next.text = patch.text;
  if (patch.alt !== undefined) next.alt = patch.alt;
  if (patch.caption !== undefined) next.caption = patch.caption;
  if (patch.items !== undefined) next.items = patch.items;
  if (patch.paragraphs !== undefined) next.paragraphs = patch.paragraphs;
  return next;
}

/**
 * @param {Record<string, unknown>} article
 * @param {HelpArticleOverlay} overlay
 */
export function applyHelpArticleOverlay(article, overlay) {
  if (!overlay) return article;
  /** @type {Record<string, unknown>} */
  const out = { ...article };
  if (overlay.title !== undefined) out.title = overlay.title;
  if (overlay.summary !== undefined) out.summary = overlay.summary;
  if (overlay.keywords !== undefined) out.keywords = overlay.keywords;
  if (Array.isArray(overlay.blockPatches) && Array.isArray(article.blocks)) {
    out.blocks = article.blocks.map((block) => {
      for (const patch of overlay.blockPatches) {
        if (blockMatches(/** @type {Record<string, unknown>} */ (block), patch)) {
          return applyBlockPatch(/** @type {Record<string, unknown>} */ (block), patch);
        }
      }
      return block;
    });
  }
  return out;
}

/**
 * @param {Array<Record<string, unknown>>} baseArticles
 * @param {Record<string, HelpArticleOverlay>} overlaysBySlug
 */
export function mergeHelpArticlesWithOverlays(baseArticles, overlaysBySlug) {
  return (baseArticles || []).map((article) => {
    const slug = String(article?.slug || "");
    const overlay = overlaysBySlug?.[slug];
    if (!overlay) return article;
    return applyHelpArticleOverlay(article, overlay);
  });
}
`
  );

  writeText(
    "data/help-center/pt-MZ/students.js",
    `/**
 * Mozambique (pt-MZ) sparse Help overlays for students —
 * classe terminology on top of pt-PT Help.
 * textIncludes match pt-PT / pt-BR runtime article text.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Escolhe uma matéria e uma classe",
    summary: "Como entrar na prática na disciplina que escolheste.",
    keywords: ["assunto", "classe", "matéria"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "ao seu ano",
        text: "Escolhe um assunto da lista. As atividades corresponderão à tua classe.",
      },
    ],
  },
};
`
  );

  writeText(
    "data/help-center/pt-MZ/parents.js",
    `/**
 * Mozambique (pt-MZ) sparse Help overlays for parents —
 * classe / Ensino Primário / encarregado de educação on top of pt-PT Help.
 * textIncludes match pt-PT runtime article text.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    title: "Bem-vindo ao guia dos encarregados de educação",
    summary:
      "O que é Leo Kids, o que os encarregados de educação podem fazer no site e como começar.",
    keywords: ["encarregados de educação", "começar", "visão geral"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Leo Kids é um espaço de aprendizagem par",
        text: "Leo Kids é um espaço de aprendizagem para alunos do Ensino Primário da 1.ª à 6.ª classe, com prática de matemática, geometria, inglês e ciências, além de jogos e relatórios de progresso para os encarregados de educação.",
      },
      {
        kind: "heading",
        textIncludes: "O papel dos responsáveis",
        text: "O papel dos encarregados de educação",
      },
    ],
  },
  "create-parent-account": {
    summary: "Como se inscrever e entrar no portal dos encarregados de educação.",
    keywords: ["inscrever-se", "Conecte-se", "encarregados de educação"],
    blockPatches: [
      {
        kind: "screenshot",
        altIncludes: "login dos responsáveis",
        alt: "Ecrã de login dos encarregados de educação",
        caption: "Ecrã de login dos encarregados de educação",
      },
      {
        kind: "relatedLinks",
        items: [
          {
            href: "/parent/login",
            label: "Vá para o login dos encarregados de educação",
          },
        ],
      },
    ],
  },
  "parent-dashboard-tour": {
    keywords: ["painel", "crianças", "encarregados de educação"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Na página do encarregado de educação verá todos",
        text: "Na página do encarregado de educação verá todos os filhos vinculados à conta, com nome, classe e opções de gestão.",
      },
      {
        kind: "screenshot",
        altIncludes: "Página do responsável",
        alt: "Página do encarregado de educação com lista de filhos",
        caption: "Página do encarregado de educação com lista de filhos",
      },
    ],
  },
  "how-to-read-report": {
    keywords: ["relatório", "encarregados de educação", "leitura"],
  },
  "add-students": {
    summary: "Crie um perfil infantil, escolha uma classe e salve.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Digite o nome da criança e escolha um an",
        text: "Digite o nome da criança e escolha uma classe (1.ª à 6.ª classe). Depois de salvar, os detalhes de login da criança aparecerão.",
      },
      {
        kind: "list",
        items: ["1.ª classe", "2.ª classe — grade_2", "até a 6.ª classe — grade_6"],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Altere o nome ou a classe e exclua com confirmação.",
  },
  "monthly-rewards": {
    summary: "Jornada de persistência por assunto e recompensas para os encarregados de educação.",
  },
};
`
  );

  writeText(
    "data/help-center/pt-MZ/subjects.js",
    `/**
 * Mozambique (pt-MZ) sparse Help overlays for subjects —
 * 1.ª–6.ª classe / Ensino Primário on top of pt-PT Help.
 * textIncludes match pt-PT runtime article text.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "A prática é projetada para crianças da 1",
      text: "A prática é projetada para crianças da 1.ª à 6.ª classe, de acordo com o nível da classe.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Prática de matemática da 1.ª à 6.ª classe — o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  geometry: {
    summary:
      "Prática de geometria da 1.ª à 6.ª classe – o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  english: {
    summary:
      "Prática de inglês da 1.ª à 6.ª classe — o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Prática científica da 1.ª à 6.ª classe — o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
`
  );

  writeText(
    "data/help-center/pt-MZ/index.js",
    `/**
 * Mozambique (pt-MZ) Help layer — sparse overlays on pt-PT Help
 * (which overlays pt-BR).
 * Chain: pt-MZ overlays → pt-PT Help → pt-BR Help.
 * Shared Help locale wiring remains for the main agent.
 */
import { BY_SECTION_PT_PT, SECTIONS_PT_PT } from "../pt-PT/index.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

export const SECTIONS_PT_MZ = SECTIONS_PT_PT;

export const BY_SECTION_PT_MZ = {
  parents: mergeHelpArticlesWithOverlays(BY_SECTION_PT_PT.parents, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(BY_SECTION_PT_PT.students, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": BY_SECTION_PT_PT["parent-report"],
  subjects: mergeHelpArticlesWithOverlays(BY_SECTION_PT_PT.subjects, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_PT_MZ = [
  ...BY_SECTION_PT_MZ.parents,
  ...BY_SECTION_PT_MZ.students,
  ...BY_SECTION_PT_MZ["parent-report"],
  ...BY_SECTION_PT_MZ.subjects,
];
`
  );

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
if (isMain || process.argv[1]?.endsWith("_gen-pt-MZ-sparse-layer.mjs")) {
  main();
}
