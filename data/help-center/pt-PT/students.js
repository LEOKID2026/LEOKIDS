/**
 * Portugal (pt-PT) sparse Help overlays for students — European Portuguese on pt-BR.
 * Inherit all other articles/fields from pt-BR.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "student-login": {
    summary: "Entra com o teu nome de utilizador e PIN.",
    keywords: ["Entrar", "PIN"],
    blockPatches: [
      {
        kind: "list",
        items: [
          "Pede ao teu encarregado de educação o teu nome de utilizador e código",
          "Escreve-os na página de login",
          "Toca em Entrar",
        ],
      },
      {
        kind: "screenshot",
        alt: "Ecrã de login do aluno",
        altIncludes: "Tela de login do aluno",
        caption: "Ecrã de login do aluno",
        textIncludes: "Tela de login do aluno",
      },
    ],
  },
  "student-home-tour": {
    summary: "O que vês após entrar: disciplinas, moedas e avatar.",
    blockPatches: [
      {
        kind: "paragraph",
        text: "Aqui vais ver o teu nome, quantas moedas tens e quais disciplinas podes abrir.",
        textIncludes: "Aqui você verá seu nome, quantas moedas ",
      },
    ],
  },
  "choose-subject-and-grade": {
    summary: "Como entrar na prática na disciplina que escolheste.",
  },
  "answering-questions": {
    blockPatches: [
      {
        kind: "list",
        items: [
          "Às vezes escolhes uma resposta de uma lista",
          "Às vezes escreves um número ou palavra",
          "Depois da tua resposta vais ver se acertaste",
        ],
      },
      {
        kind: "screenshot",
        alt: "Pergunta prática no ecrã",
        altIncludes: "Pergunta prática na tela",
        caption: "Pergunta prática no ecrã",
        textIncludes: "Pergunta prática na tela",
      },
    ],
  },
  "hints-and-explanations": {
    blockPatches: [
      {
        kind: "paragraph",
        text: "Se cometeste um erro – lê a explicação e tenta novamente. Se acertaste – passa para a pergunta seguinte!",
        textIncludes: "Se você cometeu um erro – leia a explica",
      },
      {
        kind: "callout",
        text: "Não tenhas pressa – ler a explicação ajuda-te a compreender.",
        textIncludes: "Não tenha pressa – ler a explicação ajud",
      },
    ],
  },
  "daily-missions": {
    summary: "Pequenas tarefas que te ajudam a avançar todos os dias.",
    blockPatches: [
      {
        kind: "paragraph",
        text: "Na tua página inicial vais ver missões diárias. Ao terminá-las, ganhas pontos e progresses.",
        textIncludes: "Na sua página inicial você verá missões ",
      },
    ],
  },
  "monthly-persistence": {
    blockPatches: [
      {
        kind: "paragraph",
        text: "Quanto mais praticas num mês, mais longe vai a tua jornada. Isso mostra o quanto continuaste!",
        textIncludes: "Quanto mais você pratica em um mês, mais",
      },
    ],
  },
  "coins-and-arcade": {
    blockPatches: [
      {
        kind: "paragraph",
        text: "Pratica e ganha moedas. No fliperama podes jogar jogos de tabuleiro com os amigos.",
        textIncludes: "Pratique e ganhe moedas. No fliperama vo",
      },
    ],
  },
  "tips-for-good-practice": {
    blockPatches: [
      {
        kind: "list",
        items: [
          "Pratica um pouco todos os dias",
          "Faz uma pausa se estiveres cansado",
          "Lê as explicações quando não entenderes",
        ],
      },
      {
        kind: "callout",
        text: "Aprender é mais divertido quando não te estás a pressionar!",
        textIncludes: "Aprender é mais divertido quando você nã",
      },
    ],
  },
};
