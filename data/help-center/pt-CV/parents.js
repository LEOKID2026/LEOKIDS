/**
 * Cabo Verde (pt-CV) sparse Help overlays for parents —
 * ensino básico / 1.º–6.º ano / encarregado de educação on pt-PT Help.
 * Portuguese experience scoped without claiming it is Cabo Verde's only language.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    title: "Bem-vindo ao guia dos encarregados de educação",
    summary:
      "O que é Leo Kids, o que os encarregados de educação podem fazer na experiência em português em Cabo Verde e como começar.",
    keywords: ["encarregados de educação", "começar", "visão geral", "Cabo Verde"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Leo Kids é um espaço de aprendizagem par",
        text: "Leo Kids é um espaço de aprendizagem em português para alunos do ensino básico em Cabo Verde, do 1.º ao 6.º ano, com prática de matemática, geometria, inglês e ciências, além de jogos e relatórios de progresso para os encarregados de educação.",
      },
      {
        kind: "heading",
        textIncludes: "O papel dos responsáveis",
        text: "O papel dos encarregados de educação",
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Na página do encarregado de educação verá todos",
        text: "Na página do encarregado de educação verá todos os filhos vinculados à conta, com nome, ano e opções de gestão.",
      },
    ],
  },
  "add-students": {
    summary: "Crie um perfil infantil, escolha um ano e guarde.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Digite o nome da criança e escolha um an",
        text: "Digite o nome da criança e escolha um ano (1.º ao 6.º ano). Depois de guardar, os detalhes de login da criança aparecerão.",
      },
      {
        kind: "list",
        items: ["1.º ano", "2.º ano — grade_2", "até ao 6.º ano — grade_6"],
      },
    ],
  },
  "mobile-and-offline": {
    tocPatches: [
      {
        id: "mobile",
        titleIncludes: "Usando celular",
        title: "Usando o telemóvel",
      },
    ],
    blockPatches: [
      {
        kind: "heading",
        textIncludes: "Usando celular",
        text: "Usando o telemóvel",
      },
    ],
  },
};
