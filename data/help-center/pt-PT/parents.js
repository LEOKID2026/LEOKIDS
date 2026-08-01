/**
 * Portugal (pt-PT) sparse Help overlays for parents — European Portuguese on pt-BR.
 * Inherit all other articles/fields from pt-BR.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "Leo Kids é um espaço de aprendizagem para alunos do ensino básico da 1ª à 6.º ano, com prática de matemática, geometria, inglês e ciências, além de jogos e relatórios de progresso para os encarregados de educação.",
        "textIncludes": "Leo Kids é um espaço de aprendizagem par"
      },
      {
        "kind": "list",
        "items": [
          "Crie uma conta de encarregado de educação e faça login",
          "Adicione filhos e gerencie detalhes de login",
          "Veja relatórios e recomendações práticas"
        ]
      },
      {
        "kind": "relatedLinks",
        "items": [
          {
            "href": "/help/parents/create-parent-account",
            "label": "Crie uma conta de encarregado de educação"
          },
          {
            "href": "/help/parents/parent-dashboard-tour",
            "label": "Tour pelo painel do encarregado de educação"
          }
        ]
      }
    ]
  },
  "create-parent-account": {
    "title": "Crie uma conta de encarregado de educação",
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "Vá para a página de login dos encarregados de educação e conclua a inscrição ou faça login com seu e-mail e palavra-passe.",
        "textIncludes": "Vá para a página de login dos responsáve"
      },
      {
        "kind": "screenshot",
        "alt": "Ecrã de login dos encarregados de educação",
        "altIncludes": "Tela de login dos responsáveis",
        "caption": "Ecrã de login dos encarregados de educação",
        "textIncludes": "Tela de login dos responsáveis"
      },
      {
        "kind": "callout",
        "text": "Mantenha seus dados de login em um local seguro – precisará deles em cada login.",
        "textIncludes": "Mantenha seus dados de login em um local"
      }
    ]
  },
  "parent-dashboard-tour": {
    "title": "Tour pelo painel do encarregado de educação",
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "Na página do encarregado de educação verá todos os filhos vinculados à conta, com nome, ano e opções de gerenciamento.",
        "textIncludes": "Na página do responsável você verá todos"
      },
      {
        "kind": "screenshot",
        "alt": "Página do encarregado de educação com lista de filhos",
        "altIncludes": "Página do responsável com lista de filho",
        "caption": "Página do encarregado de educação com lista de filhos",
        "textIncludes": "Página do responsável com lista de filho"
      },
      {
        "kind": "paragraph",
        "text": "Por padrão, cada conta de encarregado de educação pode incluir até três filhos.",
        "textIncludes": "Por padrão, cada conta de responsável po"
      },
      {
        "kind": "callout",
        "text": "Se atingir o limite, edite ou remova um filho existente antes de adicionar um novo.",
        "textIncludes": "Se você atingir o limite, edite ou remov"
      }
    ]
  },
  "add-students": {
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "Digite o nome da criança e escolha um ano (1º ao 6.º ano). Depois de salvar, os detalhes de login da criança aparecerão.",
        "textIncludes": "Digite o nome da criança e escolha um an"
      },
      {
        "kind": "list",
        "items": [
          "1.º ano",
          "2.º ano — grade_2",
          "até a 6.º ano — grade_6"
        ]
      }
    ]
  },
  "student-pin-and-credentials": {
    "keywords": [
      "PIN",
      "palavra-passe",
      "criança"
    ],
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "Seu filho ou sua filha faz login com um nome de utilizador e um código de 4 dígitos. Após a criação ou redefinição, o código é mostrado uma vez – salve-o.",
        "textIncludes": "Seu filho ou sua filha faz login com um "
      },
      {
        "kind": "paragraph",
        "text": "Na página do encarregado de educação pode criar um novo código de login para seu filho ou sua filha. O código antigo irá parar de funcionar.",
        "textIncludes": "Na página do responsável você pode criar"
      }
    ]
  },
  "how-to-read-report": {
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "Na página principal, escolha um filho e clique em visualizar relatório. pode alternar entre o relatório padrão e o detalhado.",
        "textIncludes": "Na página principal, escolha um filho e "
      }
    ]
  },
  "monthly-rewards": {
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "Seu filho ou sua filha desenvolve persistência por meio da prática mensal. Na página de recompensas pode ver o progresso por assunto.",
        "textIncludes": "Seu filho ou sua filha desenvolve persis"
      }
    ]
  },
  "install-as-app": {
    "title": "Instalar como uma aplicação",
    "summary": "Adicione Leo Kids ao ecrã inicial do seu telefone ou tablet.",
    "keywords": [
      "PWA",
      "instalar",
      "aplicação"
    ],
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "Na página inicial ou no navegador poderá ver “Instalar aplicação” – toque e confirme. Então pode abrir o Leo Kids como uma aplicação.",
        "textIncludes": "Na página inicial ou no navegador você p"
      },
      {
        "kind": "screenshot",
        "alt": "Solicitação de instalação do aplicação",
        "altIncludes": "Solicitação de instalação do aplicativo",
        "caption": "Solicitação de instalação do aplicação",
        "textIncludes": "Solicitação de instalação do aplicativo"
      },
      {
        "kind": "callout",
        "text": "No iPhone: Compartilhar → Adicionar ao ecrã inicial.",
        "textIncludes": "No iPhone: Compartilhar → Adicionar à te"
      }
    ]
  },
  "mobile-and-offline": {
    "blockPatches": [
      {
        "kind": "paragraph",
        "text": "O site funciona em ecrãs pequenas. O login dos alunos e dos encarregados de educação também funciona em um telefone.",
        "textIncludes": "O site funciona em telas pequenas. O log"
      }
    ]
  },
  "troubleshooting-login": {
    "keywords": [
      "emitir",
      "Conecte-se",
      "PIN"
    ],
    "blockPatches": [
      {
        "kind": "list",
        "items": [
          "PIN errado – peça um novo código aos seus encarregados de educação",
          "Nome de utilizador não reconhecido – verifique a ortografia",
          "A página não carrega – tente atualizar ou limpar o cache do navegador"
        ]
      },
      {
        "kind": "callout",
        "text": "Se o problema persistir, entre em contacto conosco através da página de contacto.",
        "textIncludes": "Se o problema persistir, entre em contat"
      }
    ]
  },
  "privacy-and-data": {
    "summary": "O que é coletado durante a prática e como entrar em contacto conosco sobre privacidade.",
    "blockPatches": [
      {
        "kind": "callout",
        "text": "Para dúvidas ou solicitações de privacidade, consulte a política de privacidade ou entre em contacto conosco.",
        "textIncludes": "Para dúvidas ou solicitações de privacid"
      }
    ]
  }
};
