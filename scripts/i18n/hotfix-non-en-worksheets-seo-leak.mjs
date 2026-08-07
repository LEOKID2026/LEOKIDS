/**
 * Hotfix: fill missing worksheet burn-down keys + homepage seoEntry/seoNav
 * for non-English masters. Updates burn-down-index.json and source pack JSON.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const META_SLUG = "lib__worksheets__worksheet-meta-labels-en.server";
const FMT_SLUG = "lib__worksheets__worksheet-math-practice-format";

const META_PATCH = {
  "es-419": {
    ratio: "Razón",
    scale: "Escala",
    area: "Área",
    subject_math: "Matemáticas",
    subject_geometry: "Geometría",
    subject_english: "Inglés",
    subject_science: "Ciencias",
    worksheet_title_prefix: "Hoja de práctica — {subject} · {topic}",
    grade_n: "Grado {n}",
  },
  "fr-FR": {
    ratio: "Rapport",
    scale: "Échelle",
    area: "Aire",
    subject_math: "Maths",
    subject_geometry: "Géométrie",
    subject_english: "Anglais",
    subject_science: "Sciences",
    worksheet_title_prefix: "Fiche — {subject} · {topic}",
    grade_n: "Niveau {n}",
  },
  "de-DE": {
    ratio: "Verhältnis",
    scale: "Maßstab",
    area: "Fläche",
    subject_math: "Mathematik",
    subject_geometry: "Geometrie",
    subject_english: "Englisch",
    subject_science: "Naturwissenschaften",
    worksheet_title_prefix: "Arbeitsblatt — {subject} · {topic}",
    grade_n: "{n}. Klasse",
  },
  "it-IT": {
    ratio: "Rapporto",
    scale: "Scala",
    area: "Area",
    subject_math: "Matematica",
    subject_geometry: "Geometria",
    subject_english: "Inglese",
    subject_science: "Scienze",
    worksheet_title_prefix: "Scheda — {subject} · {topic}",
    grade_n: "{n}ª primaria",
  },
  "nl-NL": {
    ratio: "Verhouding",
    scale: "Schaal",
    area: "Oppervlakte",
    subject_math: "Rekenen",
    subject_geometry: "Meetkunde",
    subject_english: "Engels",
    subject_science: "Wetenschap",
    worksheet_title_prefix: "Werkblad — {subject} · {topic}",
    grade_n: "Groep {n}",
  },
  "pt-BR": {
    ratio: "Razão",
    scale: "Escala",
    area: "Área",
    subject_math: "Matemática",
    subject_geometry: "Geometria",
    subject_english: "Inglês",
    subject_science: "Ciências",
    worksheet_title_prefix: "Folha — {subject} · {topic}",
    grade_n: "{n}º ano",
  },
  "pt-PT": {
    ratio: "Razão",
    scale: "Escala",
    area: "Área",
    subject_math: "Matemática",
    subject_geometry: "Geometria",
    subject_english: "Inglês",
    subject_science: "Ciências",
    worksheet_title_prefix: "Ficha — {subject} · {topic}",
    grade_n: "{n}.º ano",
  },
  "ru-RU": {
    ratio: "Отношение",
    scale: "Масштаб",
    area: "Площадь",
    subject_math: "Математика",
    subject_geometry: "Геометрия",
    subject_english: "Английский",
    subject_science: "Естествознание",
    worksheet_title_prefix: "Лист — {subject} · {topic}",
    grade_n: "{n} класс",
  },
};

const FMT_PATCH = {
  "es-419": {
    horizontal_addition: "Suma horizontal",
    vertical_addition: "Suma vertical",
    horizontal_subtraction: "Resta horizontal",
    vertical_subtraction: "Resta vertical",
    unit_fractions_halves_quarters: "Fracciones unitarias — mitades y cuartos",
  },
  "fr-FR": {
    horizontal_addition: "Addition horizontale",
    vertical_addition: "Addition verticale",
    horizontal_subtraction: "Soustraction horizontale",
    vertical_subtraction: "Soustraction verticale",
    unit_fractions_halves_quarters: "Fractions unitaires — demis et quarts",
  },
  "de-DE": {
    horizontal_addition: "Horizontale Addition",
    vertical_addition: "Vertikale Addition",
    horizontal_subtraction: "Horizontale Subtraktion",
    vertical_subtraction: "Vertikale Subtraktion",
    unit_fractions_halves_quarters: "Stammbrüche — Halbe und Viertel",
  },
  "it-IT": {
    horizontal_addition: "Addizione orizzontale",
    vertical_addition: "Addizione verticale",
    horizontal_subtraction: "Sottrazione orizzontale",
    vertical_subtraction: "Sottrazione verticale",
    unit_fractions_halves_quarters: "Frazioni unitarie — metà e quarti",
  },
  "nl-NL": {
    horizontal_addition: "Horizontaal optellen",
    vertical_addition: "Verticaal optellen",
    horizontal_subtraction: "Horizontaal aftrekken",
    vertical_subtraction: "Verticaal aftrekken",
    unit_fractions_halves_quarters: "Eenheidsbreuken — helften en kwarten",
  },
  "pt-BR": {
    horizontal_addition: "Adição horizontal",
    vertical_addition: "Adição vertical",
    horizontal_subtraction: "Subtração horizontal",
    vertical_subtraction: "Subtração vertical",
    unit_fractions_halves_quarters: "Frações unitárias — metades e quartos",
  },
  "pt-PT": {
    horizontal_addition: "Adição horizontal",
    vertical_addition: "Adição vertical",
    horizontal_subtraction: "Subtração horizontal",
    vertical_subtraction: "Subtração vertical",
    unit_fractions_halves_quarters: "Frações unitárias — metades e quartos",
  },
  "ru-RU": {
    horizontal_addition: "Горизонтальное сложение",
    vertical_addition: "Вертикальное сложение",
    horizontal_subtraction: "Горизонтальное вычитание",
    vertical_subtraction: "Вертикальное вычитание",
    unit_fractions_halves_quarters: "Единичные дроби — половины и четверти",
  },
};

const SEO_BLOCKS = {
  "es-419": {
    seoEntry: {
      title: "Áreas de práctica y guías para padres",
      body: "¿Quieres explorar las áreas de práctica de Leo Kids? Navega por páginas de práctica y guías, lee una breve descripción y luego inicia sesión o regístrate en el área de padres.",
      practiceAreasCta: "Áreas de práctica",
      parentGuidesCta: "Guías para padres",
      quickLinks: {
        math: "Matemáticas",
        geometry: "Geometría",
        english: "Inglés",
        science: "Ciencias",
        digitalPractice: "Práctica digital",
        parentReports: "Informes para padres",
        homePracticeRoutine: "Rutina de práctica en casa",
      },
    },
    valueCardsAria: "Valores del producto",
    seoNav: {
      pageNavigationAria: "Navegación de la página",
      backToPractice: "Volver a las áreas de práctica",
      backToGuides: "Volver a las guías",
      home: "Inicio",
      relatedGuides: "Guías relacionadas",
      moreGuides: "Más guías",
      fromGuideToPracticeTitle: "De la guía a la práctica",
      fromGuideToPracticeBody:
        "Después de elegir un enfoque, ve al área de práctica correspondiente y elige un grado y un tema. Puedes volver a la guía en cualquier momento para ajustar el siguiente paso.",
      fromGuidesToPracticeTitle: "De las guías a la práctica",
      fromGuidesToPracticeBody:
        "Las páginas de práctica reúnen materias, temas y actividades disponibles para que elijas el siguiente paso según tu objetivo.",
      chooseGuideByGoal: "Elige una guía según el objetivo",
      allPracticeAreas: "Todas las áreas de práctica",
      morePracticeAreas: "Más áreas de práctica",
      faqTitle: "Preguntas frecuentes",
    },
  },
  "fr-FR": {
    seoEntry: {
      title: "Domaines de pratique et guides parents",
      body: "Vous voulez explorer les domaines de pratique Leo Kids ? Parcourez les pages de pratique et les guides, lisez un court aperçu, puis connectez-vous ou inscrivez-vous dans l’espace parents.",
      practiceAreasCta: "Domaines de pratique",
      parentGuidesCta: "Guides parents",
      quickLinks: {
        math: "Maths",
        geometry: "Géométrie",
        english: "Anglais",
        science: "Sciences",
        digitalPractice: "Pratique numérique",
        parentReports: "Rapports parents",
        homePracticeRoutine: "Routine de pratique à la maison",
      },
    },
    valueCardsAria: "Valeurs du produit",
    seoNav: {
      pageNavigationAria: "Navigation de la page",
      backToPractice: "Retour aux domaines de pratique",
      backToGuides: "Retour aux guides",
      home: "Accueil",
      relatedGuides: "Guides associés",
      moreGuides: "Plus de guides",
      fromGuideToPracticeTitle: "Du guide à la pratique",
      fromGuideToPracticeBody:
        "Après avoir choisi une approche, allez dans le domaine de pratique correspondant et choisissez un niveau et un sujet. Vous pouvez revenir au guide à tout moment pour ajuster la suite.",
      fromGuidesToPracticeTitle: "Des guides à la pratique",
      fromGuidesToPracticeBody:
        "Les pages de pratique rassemblent matières, sujets et activités disponibles pour choisir la prochaine étape selon l’objectif.",
      chooseGuideByGoal: "Choisir un guide selon l’objectif",
      allPracticeAreas: "Tous les domaines de pratique",
      morePracticeAreas: "Plus de domaines de pratique",
      faqTitle: "Questions fréquentes",
    },
  },
  "de-DE": {
    seoEntry: {
      title: "Übungsbereiche und Elternleitfäden",
      body: "Möchten Sie die Übungsbereiche von Leo Kids entdecken? Durchstöbern Sie Übungsseiten und Leitfäden, lesen Sie eine kurze Übersicht und melden Sie sich dann im Elternbereich an oder registrieren Sie sich.",
      practiceAreasCta: "Übungsbereiche",
      parentGuidesCta: "Elternleitfäden",
      quickLinks: {
        math: "Mathematik",
        geometry: "Geometrie",
        english: "Englisch",
        science: "Naturwissenschaften",
        digitalPractice: "Digitale Übung",
        parentReports: "Elternberichte",
        homePracticeRoutine: "Übungsroutine zu Hause",
      },
    },
    valueCardsAria: "Produktwerte",
    seoNav: {
      pageNavigationAria: "Seitennavigation",
      backToPractice: "Zurück zu den Übungsbereichen",
      backToGuides: "Zurück zu den Leitfäden",
      home: "Startseite",
      relatedGuides: "Verwandte Leitfäden",
      moreGuides: "Weitere Leitfäden",
      fromGuideToPracticeTitle: "Vom Leitfaden zur Übung",
      fromGuideToPracticeBody:
        "Nachdem Sie einen Ansatz gewählt haben, gehen Sie zum passenden Übungsbereich und wählen Klasse und Thema. Sie können jederzeit zum Leitfaden zurückkehren, um den nächsten Schritt anzupassen.",
      fromGuidesToPracticeTitle: "Von Leitfäden zur Übung",
      fromGuidesToPracticeBody:
        "Übungsseiten bündeln Fächer, Themen und verfügbare Aktivitäten, damit Sie den nächsten Schritt nach Ziel wählen können.",
      chooseGuideByGoal: "Leitfaden nach Ziel wählen",
      allPracticeAreas: "Alle Übungsbereiche",
      morePracticeAreas: "Weitere Übungsbereiche",
      faqTitle: "Häufig gestellte Fragen",
    },
  },
  "it-IT": {
    seoEntry: {
      title: "Aree di pratica e guide per genitori",
      body: "Vuoi esplorare le aree di pratica di Leo Kids? Sfoglia le pagine di pratica e le guide, leggi una breve panoramica, poi accedi o registrati nell’area genitori.",
      practiceAreasCta: "Aree di pratica",
      parentGuidesCta: "Guide per genitori",
      quickLinks: {
        math: "Matematica",
        geometry: "Geometria",
        english: "Inglese",
        science: "Scienze",
        digitalPractice: "Pratica digitale",
        parentReports: "Report per genitori",
        homePracticeRoutine: "Routine di pratica a casa",
      },
    },
    valueCardsAria: "Valori del prodotto",
    seoNav: {
      pageNavigationAria: "Navigazione della pagina",
      backToPractice: "Torna alle aree di pratica",
      backToGuides: "Torna alle guide",
      home: "Home",
      relatedGuides: "Guide correlate",
      moreGuides: "Altre guide",
      fromGuideToPracticeTitle: "Dalla guida alla pratica",
      fromGuideToPracticeBody:
        "Dopo aver scelto un approccio, vai all’area di pratica corrispondente e scegli classe e argomento. Puoi tornare alla guida in qualsiasi momento per regolare il passo successivo.",
      fromGuidesToPracticeTitle: "Dalle guide alla pratica",
      fromGuidesToPracticeBody:
        "Le pagine di pratica raccolgono materie, argomenti e attività disponibili così puoi scegliere il passo successivo in base all’obiettivo.",
      chooseGuideByGoal: "Scegli una guida per obiettivo",
      allPracticeAreas: "Tutte le aree di pratica",
      morePracticeAreas: "Altre aree di pratica",
      faqTitle: "Domande frequenti",
    },
  },
  "nl-NL": {
    seoEntry: {
      title: "Oefengebieden en oudergidsen",
      body: "Wil je de oefengebieden van Leo Kids verkennen? Blader door oefenpagina’s en gidsen, lees een korte samenvatting en log daarna in of registreer je in het oudergebied.",
      practiceAreasCta: "Oefengebieden",
      parentGuidesCta: "Oudergidsen",
      quickLinks: {
        math: "Rekenen",
        geometry: "Meetkunde",
        english: "Engels",
        science: "Wetenschap",
        digitalPractice: "Digitale oefening",
        parentReports: "Ouderrapporten",
        homePracticeRoutine: "Thuisoefenroutine",
      },
    },
    valueCardsAria: "Productwaarden",
    seoNav: {
      pageNavigationAria: "Paginanavigatie",
      backToPractice: "Terug naar oefengebieden",
      backToGuides: "Terug naar gidsen",
      home: "Home",
      relatedGuides: "Gerelateerde gidsen",
      moreGuides: "Meer gidsen",
      fromGuideToPracticeTitle: "Van gids naar oefenen",
      fromGuideToPracticeBody:
        "Na het kiezen van een aanpak ga je naar het passende oefengebied en kies je een leerjaar en onderwerp. Je kunt op elk moment terug naar de gids om de volgende stap aan te passen.",
      fromGuidesToPracticeTitle: "Van gidsen naar oefenen",
      fromGuidesToPracticeBody:
        "Oefenpagina’s bundelen vakken, onderwerpen en beschikbare activiteiten zodat je de volgende stap per doel kunt kiezen.",
      chooseGuideByGoal: "Kies een gids op doel",
      allPracticeAreas: "Alle oefengebieden",
      morePracticeAreas: "Meer oefengebieden",
      faqTitle: "Veelgestelde vragen",
    },
  },
  "pt-BR": {
    seoEntry: {
      title: "Áreas de prática e guias para pais",
      body: "Quer explorar as áreas de prática do Leo Kids? Navegue pelas páginas de prática e guias, leia uma breve visão geral e depois entre ou cadastre-se na área dos pais.",
      practiceAreasCta: "Áreas de prática",
      parentGuidesCta: "Guias para pais",
      quickLinks: {
        math: "Matemática",
        geometry: "Geometria",
        english: "Inglês",
        science: "Ciências",
        digitalPractice: "Prática digital",
        parentReports: "Relatórios para pais",
        homePracticeRoutine: "Rotina de prática em casa",
      },
    },
    valueCardsAria: "Valores do produto",
    seoNav: {
      pageNavigationAria: "Navegação da página",
      backToPractice: "Voltar às áreas de prática",
      backToGuides: "Voltar aos guias",
      home: "Início",
      relatedGuides: "Guias relacionados",
      moreGuides: "Mais guias",
      fromGuideToPracticeTitle: "Do guia à prática",
      fromGuideToPracticeBody:
        "Depois de escolher uma abordagem, vá à área de prática correspondente e escolha ano e tópico. Você pode voltar ao guia a qualquer momento para ajustar o próximo passo.",
      fromGuidesToPracticeTitle: "Dos guias à prática",
      fromGuidesToPracticeBody:
        "As páginas de prática reúnem matérias, tópicos e atividades disponíveis para você escolher o próximo passo conforme o objetivo.",
      chooseGuideByGoal: "Escolha um guia por objetivo",
      allPracticeAreas: "Todas as áreas de prática",
      morePracticeAreas: "Mais áreas de prática",
      faqTitle: "Perguntas frequentes",
    },
  },
  "pt-PT": {
    seoEntry: {
      title: "Áreas de prática e guias para pais",
      body: "Quer explorar as áreas de prática do Leo Kids? Navegue pelas páginas de prática e guias, leia uma breve visão geral e depois inicie sessão ou registe-se na área dos pais.",
      practiceAreasCta: "Áreas de prática",
      parentGuidesCta: "Guias para pais",
      quickLinks: {
        math: "Matemática",
        geometry: "Geometria",
        english: "Inglês",
        science: "Ciências",
        digitalPractice: "Prática digital",
        parentReports: "Relatórios para pais",
        homePracticeRoutine: "Rotina de prática em casa",
      },
    },
    valueCardsAria: "Valores do produto",
    seoNav: {
      pageNavigationAria: "Navegação da página",
      backToPractice: "Voltar às áreas de prática",
      backToGuides: "Voltar aos guias",
      home: "Início",
      relatedGuides: "Guias relacionados",
      moreGuides: "Mais guias",
      fromGuideToPracticeTitle: "Do guia à prática",
      fromGuideToPracticeBody:
        "Depois de escolher uma abordagem, vá à área de prática correspondente e escolha ano e tópico. Pode voltar ao guia a qualquer momento para ajustar o passo seguinte.",
      fromGuidesToPracticeTitle: "Dos guias à prática",
      fromGuidesToPracticeBody:
        "As páginas de prática reúnem disciplinas, tópicos e atividades disponíveis para escolher o passo seguinte conforme o objetivo.",
      chooseGuideByGoal: "Escolha um guia por objetivo",
      allPracticeAreas: "Todas as áreas de prática",
      morePracticeAreas: "Mais áreas de prática",
      faqTitle: "Perguntas frequentes",
    },
  },
  "ru-RU": {
    seoEntry: {
      title: "Области практики и руководства для родителей",
      body: "Хотите изучить области практики Leo Kids? Просмотрите страницы практики и руководства, прочитайте краткий обзор, затем войдите или зарегистрируйтесь в разделе для родителей.",
      practiceAreasCta: "Области практики",
      parentGuidesCta: "Руководства для родителей",
      quickLinks: {
        math: "Математика",
        geometry: "Геометрия",
        english: "Английский",
        science: "Естествознание",
        digitalPractice: "Цифровая практика",
        parentReports: "Отчёты для родителей",
        homePracticeRoutine: "Домашняя практика",
      },
    },
    valueCardsAria: "Ценности продукта",
    seoNav: {
      pageNavigationAria: "Навигация по странице",
      backToPractice: "Назад к областям практики",
      backToGuides: "Назад к руководствам",
      home: "Главная",
      relatedGuides: "Связанные руководства",
      moreGuides: "Ещё руководства",
      fromGuideToPracticeTitle: "От руководства к практике",
      fromGuideToPracticeBody:
        "Выбрав подход, перейдите в подходящую область практики и выберите класс и тему. Вы можете вернуться к руководству на любом шаге, чтобы скорректировать следующий шаг.",
      fromGuidesToPracticeTitle: "От руководств к практике",
      fromGuidesToPracticeBody:
        "Страницы практики объединяют предметы, темы и доступные занятия, чтобы выбрать следующий шаг по цели.",
      chooseGuideByGoal: "Выберите руководство по цели",
      allPracticeAreas: "Все области практики",
      morePracticeAreas: "Ещё области практики",
      faqTitle: "Часто задаваемые вопросы",
    },
  },
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function patchBurnDown(locale) {
  const indexPath = path.join(ROOT, "content-packs", locale, "global-burn-down", "burn-down-index.json");
  const index = readJson(indexPath);
  const en = readJson(path.join(ROOT, "content-packs", "en", "global-burn-down", "burn-down-index.json"));

  if (!index[META_SLUG]) index[META_SLUG] = {};
  if (!index[FMT_SLUG]) index[FMT_SLUG] = {};

  // For pt-PT, seed missing worksheet packs from pt-BR first.
  if (locale === "pt-PT") {
    const br = readJson(path.join(ROOT, "content-packs", "pt-BR", "global-burn-down", "burn-down-index.json"));
    for (const slug of [META_SLUG, FMT_SLUG]) {
      const enPack = en[slug] || {};
      const brPack = br[slug] || {};
      const locPack = index[slug] || {};
      for (const [k, v] of Object.entries(enPack)) {
        if (!(k in locPack) && typeof brPack[k] === "string") locPack[k] = brPack[k];
      }
      index[slug] = locPack;
    }
  }

  Object.assign(index[META_SLUG], META_PATCH[locale] || {});
  Object.assign(index[FMT_SLUG], FMT_PATCH[locale] || {});
  writeJson(indexPath, index);

  // Keep source pack JSON in sync when present.
  const metaSrc = path.join(ROOT, "content-packs", locale, "global-burn-down", `${META_SLUG}.json`);
  const fmtSrc = path.join(ROOT, "content-packs", locale, "global-burn-down", `${FMT_SLUG}.json`);
  if (fs.existsSync(metaSrc)) {
    const j = readJson(metaSrc);
    j.copy = { ...(j.copy || {}), ...(META_PATCH[locale] || {}) };
    if (locale === "pt-PT") {
      const brSrc = path.join(ROOT, "content-packs", "pt-BR", "global-burn-down", `${META_SLUG}.json`);
      if (fs.existsSync(brSrc)) {
        const br = readJson(brSrc);
        j.copy = { ...(br.copy || {}), ...(j.copy || {}), ...(META_PATCH[locale] || {}) };
      }
    }
    writeJson(metaSrc, j);
  }
  if (fs.existsSync(fmtSrc)) {
    const j = readJson(fmtSrc);
    j.copy = { ...(j.copy || {}), ...(FMT_PATCH[locale] || {}) };
    if (locale === "pt-PT") {
      const brSrc = path.join(ROOT, "content-packs", "pt-BR", "global-burn-down", `${FMT_SLUG}.json`);
      if (fs.existsSync(brSrc)) {
        const br = readJson(brSrc);
        j.copy = { ...(br.copy || {}), ...(j.copy || {}), ...(FMT_PATCH[locale] || {}) };
      }
    }
    writeJson(fmtSrc, j);
  }
}

function patchUi(locale) {
  const block = SEO_BLOCKS[locale];
  if (!block) return;
  const uiPath = path.join(ROOT, "locales", locale, "ui.json");
  const ui = readJson(uiPath);
  if (!ui.public) ui.public = {};
  if (!ui.public.homepage) ui.public.homepage = {};
  ui.public.homepage.seoEntry = block.seoEntry;
  ui.public.homepage.valueCardsAria = block.valueCardsAria;
  ui.public.seoNav = block.seoNav;
  writeJson(uiPath, ui);
}

const locales = ["es-419", "fr-FR", "de-DE", "it-IT", "nl-NL", "pt-BR", "pt-PT", "ru-RU"];
for (const locale of locales) {
  patchBurnDown(locale);
  patchUi(locale);
  console.log(`patched ${locale}`);
}

console.log("done");
