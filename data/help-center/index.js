import { PARENT_ARTICLES } from "./content/parents.js";
import { STUDENT_ARTICLES } from "./content/students.js";
import { PARENT_REPORT_ARTICLES } from "./content/parent-report.js";
import { SUBJECT_ARTICLES } from "./content/subjects.js";
import {
  ALL_ARTICLES_ES_419,
  BY_SECTION_ES_419,
  SECTIONS_ES_419,
} from "./es-419/index.js";
import {
  ALL_ARTICLES_ES_ES,
  BY_SECTION_ES_ES,
  SECTIONS_ES_ES,
} from "./es-ES/index.js";
import {
  ALL_ARTICLES_PT_BR,
  BY_SECTION_PT_BR,
  SECTIONS_PT_BR,
} from "./pt-BR/index.js";
import {
  ALL_ARTICLES_PT_PT,
  BY_SECTION_PT_PT,
  SECTIONS_PT_PT,
} from "./pt-PT/index.js";
import {
  ALL_ARTICLES_IT_IT,
  BY_SECTION_IT_IT,
  SECTIONS_IT_IT,
} from "./it-IT/index.js";
import {
  ALL_ARTICLES_FR_FR,
  BY_SECTION_FR_FR,
  SECTIONS_FR_FR,
} from "./fr-FR/index.js";
import {
  ALL_ARTICLES_NL_NL,
  BY_SECTION_NL_NL,
  SECTIONS_NL_NL,
} from "./nl-NL/index.js";
import {
  ALL_ARTICLES_DE_DE,
  BY_SECTION_DE_DE,
  SECTIONS_DE_DE,
} from "./de-DE/index.js";
import {
  ALL_ARTICLES_RU_RU,
  BY_SECTION_RU_RU,
  SECTIONS_RU_RU,
} from "./ru-RU/index.js";
import {
  ALL_ARTICLES_EN_AU,
  BY_SECTION_EN_AU,
  SECTIONS_EN_AU,
} from "./en-AU/index.js";
import {
  ALL_ARTICLES_EN_NZ,
  BY_SECTION_EN_NZ,
  SECTIONS_EN_NZ,
} from "./en-NZ/index.js";
import {
  ALL_ARTICLES_EN_IE,
  BY_SECTION_EN_IE,
  SECTIONS_EN_IE,
} from "./en-IE/index.js";
import {
  ALL_ARTICLES_EN_GB,
  BY_SECTION_EN_GB,
  SECTIONS_EN_GB,
} from "./en-GB/index.js";
// BY_SECTION_EN_GB used for SCT/NIR parent-report Maths inheritance (no local parent-report overlays).
import {
  ALL_ARTICLES_EN_SG,
  BY_SECTION_EN_SG,
} from "./en-SG/index.js";
import {
  ALL_ARTICLES_EN_ZA,
  BY_SECTION_EN_ZA,
  SECTIONS_EN_ZA,
} from "./en-ZA/index.js";
import {
  ALL_ARTICLES_EN_SCT,
  BY_SECTION_EN_SCT,
  SECTIONS_EN_SCT,
} from "./en-SCT/index.js";
import {
  ALL_ARTICLES_EN_NIR,
  BY_SECTION_EN_NIR,
  SECTIONS_EN_NIR,
} from "./en-NIR/index.js";
import {
  ALL_ARTICLES_PT_AO,
  BY_SECTION_PT_AO,
  SECTIONS_PT_AO,
} from "./pt-AO/index.js";
import {
  ALL_ARTICLES_EN_NG,
  BY_SECTION_EN_NG,
} from "./en-NG/index.js";
import {
  ALL_ARTICLES_FR_CI,
  BY_SECTION_FR_CI,
} from "./fr-CI/index.js";
import {
  ALL_ARTICLES_DE_AT,
  BY_SECTION_DE_AT,
  SECTIONS_DE_AT,
} from "./de-AT/index.js";
import {
  ALL_ARTICLES_FR_CA,
  BY_SECTION_FR_CA,
} from "./fr-CA/index.js";
import {
  ALL_ARTICLES_PT_MZ,
  BY_SECTION_PT_MZ,
  SECTIONS_PT_MZ,
} from "./pt-MZ/index.js";
import {
  ALL_ARTICLES_EN_KE,
  BY_SECTION_EN_KE,
  SECTIONS_EN_KE,
} from "./en-KE/index.js";
import {
  ALL_ARTICLES_DE_CH,
  BY_SECTION_DE_CH,
  SECTIONS_DE_CH,
} from "./de-CH/index.js";
import {
  ALL_ARTICLES_NL_BE,
  BY_SECTION_NL_BE,
  SECTIONS_NL_BE,
} from "./nl-BE/index.js";
import {
  ALL_ARTICLES_FR_BE,
  BY_SECTION_FR_BE,
} from "./fr-BE/index.js";
import {
  ALL_ARTICLES_FR_CH,
  BY_SECTION_FR_CH,
} from "./fr-CH/index.js";
import {
  ALL_ARTICLES_IT_CH,
  BY_SECTION_IT_CH,
} from "./it-CH/index.js";

export {
  ALL_ARTICLES_ES_419,
  SECTIONS_ES_419,
  ALL_ARTICLES_ES_ES,
  SECTIONS_ES_ES,
  ALL_ARTICLES_PT_BR,
  SECTIONS_PT_BR,
  ALL_ARTICLES_PT_PT,
  SECTIONS_PT_PT,
  ALL_ARTICLES_PT_AO,
  SECTIONS_PT_AO,
  ALL_ARTICLES_IT_IT,
  SECTIONS_IT_IT,
  ALL_ARTICLES_IT_CH,
  ALL_ARTICLES_FR_FR,
  SECTIONS_FR_FR,
  ALL_ARTICLES_FR_CI,
  ALL_ARTICLES_FR_CA,
  ALL_ARTICLES_FR_BE,
  ALL_ARTICLES_FR_CH,
  ALL_ARTICLES_PT_MZ,
  SECTIONS_PT_MZ,
  ALL_ARTICLES_EN_KE,
  SECTIONS_EN_KE,
  ALL_ARTICLES_DE_CH,
  SECTIONS_DE_CH,
  ALL_ARTICLES_NL_NL,
  SECTIONS_NL_NL,
  ALL_ARTICLES_NL_BE,
  SECTIONS_NL_BE,
  ALL_ARTICLES_DE_DE,
  SECTIONS_DE_DE,
  ALL_ARTICLES_DE_AT,
  SECTIONS_DE_AT,
  ALL_ARTICLES_RU_RU,
  SECTIONS_RU_RU,
  ALL_ARTICLES_EN_AU,
  SECTIONS_EN_AU,
  ALL_ARTICLES_EN_NZ,
  SECTIONS_EN_NZ,
  ALL_ARTICLES_EN_IE,
  SECTIONS_EN_IE,
  ALL_ARTICLES_EN_GB,
  SECTIONS_EN_GB,
  ALL_ARTICLES_EN_SG,
  ALL_ARTICLES_EN_ZA,
  SECTIONS_EN_ZA,
  ALL_ARTICLES_EN_NG,
  ALL_ARTICLES_EN_SCT,
  SECTIONS_EN_SCT,
  ALL_ARTICLES_EN_NIR,
  SECTIONS_EN_NIR,
};

export const SECTIONS = {
  parents: {
    key: "parents",
    title: "Guide for parents",
    description: "Sign up, manage children, reports, and parent tools.",
    href: "/help/parents",
    emoji: "👨‍👩‍👧",
    hubGradientKey: "parents",
  },
  students: {
    key: "students",
    title: "Guide for students",
    description: "Login, practice, missions, and games — in simple language.",
    href: "/help/students",
    emoji: "🎒",
    hubGradientKey: "students",
  },
  "parent-report": {
    key: "parent-report",
    title: "Parent report explained",
    description: "How to read each part of the report — step by step.",
    href: "/help/parent-report",
    emoji: "📊",
    hubGradientKey: "parent-report",
  },
  subjects: {
    key: "subjects",
    title: "Subject guides",
    description: "What to practice in each subject and how.",
    href: "/help/subjects",
    emoji: "📚",
    hubGradientKey: "subjects",
  },
};

const BY_SECTION = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];

/**
 * @param {string|null|undefined} [locale]
 * @returns {"en"|"es-419"|"es-ES"|"pt-BR"|"pt-PT"|"it-IT"|"fr-FR"|"nl-NL"|"de-DE"|"ru-RU"|"en-AU"|"en-NZ"|"en-IE"|"en-GB"|"en-SG"|"en-ZA"|"en-SCT"|"en-NIR"}
 */
export function resolveHelpLocale(locale) {
  const id = String(locale || "en")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  if (id === "en-au") return "en-AU";
  if (id === "en-nz") return "en-NZ";
  if (id === "en-ie") return "en-IE";
  if (id === "en-gb" || id === "en-wls") return "en-GB";
  if (id === "en-sct") return "en-SCT";
  if (id === "en-nir") return "en-NIR";
  if (id === "en-sg") return "en-SG";
  if (id === "en-za") return "en-ZA";
  if (id === "en-ng") return "en-NG";
  if (id === "en-ke") return "en-KE";
  // English Canada / Philippines have no Help overlay — inherit English base.
  if (id === "en-ca" || id === "en-ph") return "en";
  // Portugal owns public path /pt; bare `pt` is not an alias of Brazil.
  if (id === "pt-pt" || id === "pt") return "pt-PT";
  if (id === "pt-ao") return "pt-AO";
  if (id === "pt-mz") return "pt-MZ";
  if (id === "pt-br") return "pt-BR";
  // Italy / France / Netherlands / Germany / Russia own /it /fr /nl /de /ru;
  // bare tags are not aliases of other locales.
  if (id === "it-ch") return "it-CH";
  if (id === "it-it" || id === "it") return "it-IT";
  if (id === "fr-be") return "fr-BE";
  if (id === "fr-ch") return "fr-CH";
  if (id === "fr-ci") return "fr-CI";
  if (id === "fr-ca") return "fr-CA";
  if (id === "fr-fr" || id === "fr") return "fr-FR";
  if (id === "nl-be") return "nl-BE";
  if (id === "nl-nl" || id === "nl") return "nl-NL";
  if (id === "de-at") return "de-AT";
  if (id === "de-ch") return "de-CH";
  if (id === "de-de" || id === "de") return "de-DE";
  if (id === "ru-ru" || id === "ru") return "ru-RU";
  if (id === "es-es") return "es-ES";
  if (id === "es-419" || id.startsWith("es-")) return "es-419";
  return "en";
}

/**
 * @param {string|null|undefined} [locale]
 */
export function getHelpSections(locale) {
  const helpLocale = resolveHelpLocale(locale);
  if (helpLocale === "en-AU") return SECTIONS_EN_AU;
  if (helpLocale === "en-NZ") return SECTIONS_EN_NZ;
  if (helpLocale === "en-IE") return SECTIONS_EN_IE;
  if (helpLocale === "en-GB") return SECTIONS_EN_GB;
  if (helpLocale === "en-SCT") return SECTIONS_EN_SCT;
  if (helpLocale === "en-NIR") return SECTIONS_EN_NIR;
  if (helpLocale === "en-SG") return SECTIONS;
  if (helpLocale === "en-ZA") return SECTIONS_EN_ZA;
  if (helpLocale === "en-NG") return SECTIONS;
  if (helpLocale === "en-KE") return SECTIONS_EN_KE;
  if (helpLocale === "pt-AO") return SECTIONS_PT_AO;
  if (helpLocale === "pt-MZ") return SECTIONS_PT_MZ;
  if (helpLocale === "pt-PT") return SECTIONS_PT_PT;
  if (helpLocale === "pt-BR") return SECTIONS_PT_BR;
  if (helpLocale === "it-CH") return SECTIONS_IT_IT;
  if (helpLocale === "it-IT") return SECTIONS_IT_IT;
  if (helpLocale === "fr-BE") return SECTIONS_FR_FR;
  if (helpLocale === "fr-CH") return SECTIONS_FR_FR;
  if (helpLocale === "fr-CI") return SECTIONS_FR_FR;
  if (helpLocale === "fr-CA") return SECTIONS_FR_FR;
  if (helpLocale === "fr-FR") return SECTIONS_FR_FR;
  if (helpLocale === "nl-BE") return SECTIONS_NL_BE;
  if (helpLocale === "nl-NL") return SECTIONS_NL_NL;
  if (helpLocale === "de-AT") return SECTIONS_DE_AT;
  if (helpLocale === "de-CH") return SECTIONS_DE_CH;
  if (helpLocale === "de-DE") return SECTIONS_DE_DE;
  if (helpLocale === "ru-RU") return SECTIONS_RU_RU;
  if (helpLocale === "es-ES") return SECTIONS_ES_ES;
  if (helpLocale === "es-419") return SECTIONS_ES_419;
  return SECTIONS;
}

/**
 * @param {string} section
 * @param {string|null|undefined} [locale]
 */
export function listArticles(section, locale) {
  const helpLocale = resolveHelpLocale(locale);
  if (helpLocale === "en-AU") {
    return BY_SECTION_EN_AU[section] || [];
  }
  if (helpLocale === "en-NZ") {
    return BY_SECTION_EN_NZ[section] || [];
  }
  if (helpLocale === "en-IE") {
    return BY_SECTION_EN_IE[section] || [];
  }
  if (helpLocale === "en-GB") {
    return BY_SECTION_EN_GB[section] || [];
  }
  if (helpLocale === "en-SCT") {
    // Country packs omit parent-report Maths chrome; inherit England overlays.
    if (section === "parent-report") return BY_SECTION_EN_GB[section] || [];
    return BY_SECTION_EN_SCT[section] || [];
  }
  if (helpLocale === "en-NIR") {
    if (section === "parent-report") return BY_SECTION_EN_GB[section] || [];
    return BY_SECTION_EN_NIR[section] || [];
  }
  if (helpLocale === "en-SG") {
    return BY_SECTION_EN_SG[section] || [];
  }
  if (helpLocale === "en-ZA") {
    return BY_SECTION_EN_ZA[section] || [];
  }
  if (helpLocale === "en-NG") {
    return BY_SECTION_EN_NG[section] || [];
  }
  if (helpLocale === "en-KE") {
    return BY_SECTION_EN_KE[section] || [];
  }
  if (helpLocale === "pt-AO") {
    return BY_SECTION_PT_AO[section] || [];
  }
  if (helpLocale === "pt-MZ") {
    return BY_SECTION_PT_MZ[section] || [];
  }
  if (helpLocale === "pt-PT") {
    return BY_SECTION_PT_PT[section] || [];
  }
  if (helpLocale === "pt-BR") {
    return BY_SECTION_PT_BR[section] || [];
  }
  if (helpLocale === "it-CH") {
    return BY_SECTION_IT_CH[section] || [];
  }
  if (helpLocale === "it-IT") {
    return BY_SECTION_IT_IT[section] || [];
  }
  if (helpLocale === "fr-BE") {
    return BY_SECTION_FR_BE[section] || [];
  }
  if (helpLocale === "fr-CH") {
    return BY_SECTION_FR_CH[section] || [];
  }
  if (helpLocale === "fr-CI") {
    return BY_SECTION_FR_CI[section] || [];
  }
  if (helpLocale === "fr-CA") {
    return BY_SECTION_FR_CA[section] || [];
  }
  if (helpLocale === "fr-FR") {
    return BY_SECTION_FR_FR[section] || [];
  }
  if (helpLocale === "nl-BE") {
    return BY_SECTION_NL_BE[section] || [];
  }
  if (helpLocale === "nl-NL") {
    return BY_SECTION_NL_NL[section] || [];
  }
  if (helpLocale === "de-AT") {
    return BY_SECTION_DE_AT[section] || [];
  }
  if (helpLocale === "de-CH") {
    return BY_SECTION_DE_CH[section] || [];
  }
  if (helpLocale === "de-DE") {
    return BY_SECTION_DE_DE[section] || [];
  }
  if (helpLocale === "ru-RU") {
    return BY_SECTION_RU_RU[section] || [];
  }
  if (helpLocale === "es-ES") {
    return BY_SECTION_ES_ES[section] || [];
  }
  if (helpLocale === "es-419") {
    return BY_SECTION_ES_419[section] || [];
  }
  return BY_SECTION[section] || [];
}

/**
 * @param {string} section
 * @param {string} slug
 * @param {string|null|undefined} [locale]
 */
export function getArticle(section, slug, locale) {
  const articles = listArticles(section, locale);
  return articles.find((a) => a.slug === slug) || null;
}

/**
 * Paths are locale-agnostic (same slugs across locales).
 * @param {string} section
 */
export function getPathsForSection(section) {
  return listArticles(section, "en").map((a) => ({
    params: { slug: a.slug },
  }));
}

export function validateArticle(article) {
  const errors = [];
  if (!article?.slug) errors.push("missing slug");
  if (!article?.title) errors.push("missing title");
  if (!article?.summary) errors.push("missing summary");
  if (!article?.section) errors.push("missing section");

  for (const block of article?.blocks || []) {
    if (block.kind === "screenshot") {
      if (!block.alt?.trim()) errors.push(`screenshot missing alt in ${article.slug}`);
      if (!block.path?.trim()) errors.push(`screenshot missing path in ${article.slug}`);
    }
  }
  return errors;
}

export function collectScreenshotPathsFromArticles(articles = ALL_ARTICLES) {
  const paths = new Set();
  for (const article of articles) {
    for (const block of article.blocks || []) {
      if (block.kind !== "screenshot") continue;
      paths.add(block.path);
      if (block.sources?.mobile) paths.add(block.sources.mobile);
      if (block.sources?.tablet) paths.add(block.sources.tablet);
    }
  }
  return [...paths].sort();
}

/** Build-time validation for articles (EN + overlays slug parity). */
export function assertAllArticlesValid() {
  const allErrors = [];
  const packs = [
    { locale: "en", articles: ALL_ARTICLES },
    { locale: "es-419", articles: ALL_ARTICLES_ES_419 },
    { locale: "es-ES", articles: ALL_ARTICLES_ES_ES },
    { locale: "pt-BR", articles: ALL_ARTICLES_PT_BR },
    { locale: "pt-PT", articles: ALL_ARTICLES_PT_PT },
    { locale: "it-IT", articles: ALL_ARTICLES_IT_IT },
    { locale: "fr-FR", articles: ALL_ARTICLES_FR_FR },
    { locale: "nl-NL", articles: ALL_ARTICLES_NL_NL },
    { locale: "de-DE", articles: ALL_ARTICLES_DE_DE },
    { locale: "ru-RU", articles: ALL_ARTICLES_RU_RU },
    { locale: "en-AU", articles: ALL_ARTICLES_EN_AU },
    { locale: "en-NZ", articles: ALL_ARTICLES_EN_NZ },
    { locale: "en-IE", articles: ALL_ARTICLES_EN_IE },
    { locale: "en-GB", articles: ALL_ARTICLES_EN_GB },
    { locale: "en-SG", articles: ALL_ARTICLES_EN_SG },
    { locale: "en-ZA", articles: ALL_ARTICLES_EN_ZA },
    { locale: "en-NG", articles: ALL_ARTICLES_EN_NG },
    { locale: "en-KE", articles: ALL_ARTICLES_EN_KE },
    { locale: "en-SCT", articles: ALL_ARTICLES_EN_SCT },
    { locale: "en-NIR", articles: ALL_ARTICLES_EN_NIR },
    { locale: "pt-AO", articles: ALL_ARTICLES_PT_AO },
    { locale: "pt-MZ", articles: ALL_ARTICLES_PT_MZ },
    { locale: "fr-CI", articles: ALL_ARTICLES_FR_CI },
    { locale: "fr-CA", articles: ALL_ARTICLES_FR_CA },
    { locale: "fr-BE", articles: ALL_ARTICLES_FR_BE },
    { locale: "fr-CH", articles: ALL_ARTICLES_FR_CH },
    { locale: "nl-BE", articles: ALL_ARTICLES_NL_BE },
    { locale: "it-CH", articles: ALL_ARTICLES_IT_CH },
    { locale: "de-AT", articles: ALL_ARTICLES_DE_AT },
    { locale: "de-CH", articles: ALL_ARTICLES_DE_CH },
  ];
  for (const pack of packs) {
    for (const article of pack.articles) {
      const errs = validateArticle(article);
      if (errs.length) {
        allErrors.push({
          locale: pack.locale,
          slug: article.slug,
          section: article.section,
          errs,
        });
      }
    }
  }

  const enSlugs = new Set(ALL_ARTICLES.map((a) => `${a.section}/${a.slug}`));
  const parityPacks = packs.filter((p) => p.locale !== "en");
  for (const pack of parityPacks) {
    const slugs = new Set(pack.articles.map((a) => `${a.section}/${a.slug}`));
    for (const key of enSlugs) {
      if (!slugs.has(key)) {
        allErrors.push({ locale: pack.locale, errs: [`missing slug parity: ${key}`] });
      }
    }
    for (const key of slugs) {
      if (!enSlugs.has(key)) {
        allErrors.push({ locale: pack.locale, errs: [`extra slug vs en: ${key}`] });
      }
    }
  }

  if (allErrors.length) {
    throw new Error(
      `Help Center article validation failed: ${JSON.stringify(allErrors, null, 2)}`
    );
  }
}

assertAllArticlesValid();
