/**
 * Portugal (pt-PT) sparse Help overlays for parent-report — European Portuguese on pt-BR.
 * Inherit all other articles/fields from pt-BR.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_REPORT_OVERRIDES_BY_SLUG = {
  "report-overview": {
    "title": "Visão geral do relatório do encarregado de educação",
    "blockPatches": [
      {
        "kind": "screenshot",
        "alt": "Página padrão do relatório do encarregado de educação",
        "altIncludes": "Página padrão do relatório do responsáve",
        "caption": "Página padrão do relatório do encarregado de educação",
        "textIncludes": "Página padrão do relatório do responsáve"
      }
    ]
  },
  "subjects-overview": {
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "Permite que veja rapidamente onde seu filho ou sua filha é forte e onde há espaço para crescer em matemática, geometria, inglês e ciências.",
        "textIncludes": "Permite que você veja rapidamente onde s"
      }
    ]
  },
  "understanding-the-disclaimer": {
    "blockPatches": [
      {
        "kind": "disclaimerQuote",
        "paragraphs": [
          "O relatório é baseado em dados práticos coletados no Leo Kids.",
          "O objetivo do relatório é ajudar os encarregados de educação a entender o que seus filhos praticaram, onde apareceram os pontos fortes e o que fortalecer em seguida.",
          "O relatório não é um diagnóstico médico, psicológico ou educacional e não substitui um professor, conselheiro, avaliador ou outro profissional. Se tiver preocupações contínuas sobre dificuldades ou lacunas de aprendizagem, fale com um professor ou profissional qualificado."
        ],
        "paragraphIncludes": "O relatório não é um diagnóstico médico,"
      },
      {
        "kind": "screenshot",
        "alt": "Caixa de aviso importante em um relatório do encarregado de educação",
        "altIncludes": "Caixa de aviso importante em um relatóri",
        "caption": "Caixa de aviso importante em um relatório do encarregado de educação",
        "textIncludes": "Caixa de aviso importante em um relatóri"
      }
    ]
  }
};
