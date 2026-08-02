/**
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
