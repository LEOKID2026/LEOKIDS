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
  ALL_ARTICLES_AR_001,
  BY_SECTION_AR_001,
  SECTIONS_AR_001,
} from "./ar-001/index.js";
import {
  ALL_ARTICLES_AR_EG,
  BY_SECTION_AR_EG,
  SECTIONS_AR_EG,
} from "./ar-EG/index.js";
import {
  ALL_ARTICLES_AR_SA,
  BY_SECTION_AR_SA,
  SECTIONS_AR_SA,
} from "./ar-SA/index.js";
import {
  ALL_ARTICLES_AR_MA,
  BY_SECTION_AR_MA,
  SECTIONS_AR_MA,
} from "./ar-MA/index.js";
import {
  ALL_ARTICLES_AR_DZ,
  BY_SECTION_AR_DZ,
  SECTIONS_AR_DZ,
} from "./ar-DZ/index.js";
import {
  ALL_ARTICLES_AR_IQ,
  BY_SECTION_AR_IQ,
  SECTIONS_AR_IQ,
} from "./ar-IQ/index.js";
import {
  ALL_ARTICLES_AR_JO,
  BY_SECTION_AR_JO,
  SECTIONS_AR_JO,
} from "./ar-JO/index.js";
import {
  ALL_ARTICLES_AR_AE,
  BY_SECTION_AR_AE,
  SECTIONS_AR_AE,
} from "./ar-AE/index.js";
import {
  ALL_ARTICLES_AR_TN,
  BY_SECTION_AR_TN,
  SECTIONS_AR_TN,
} from "./ar-TN/index.js";
import {
  ALL_ARTICLES_AR_KW,
  BY_SECTION_AR_KW,
  SECTIONS_AR_KW,
} from "./ar-KW/index.js";
import {
  ALL_ARTICLES_AR_QA,
  BY_SECTION_AR_QA,
  SECTIONS_AR_QA,
} from "./ar-QA/index.js";
import {
  ALL_ARTICLES_AR_OM,
  BY_SECTION_AR_OM,
  SECTIONS_AR_OM,
} from "./ar-OM/index.js";
import {
  ALL_ARTICLES_AR_BH,
  BY_SECTION_AR_BH,
  SECTIONS_AR_BH,
} from "./ar-BH/index.js";
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
import {
  ALL_ARTICLES_EN_IN,
  BY_SECTION_EN_IN,
} from "./en-IN/index.js";
import {
  ALL_ARTICLES_EN_GH,
  BY_SECTION_EN_GH,
  SECTIONS_EN_GH,
} from "./en-GH/index.js";
import {
  ALL_ARTICLES_FR_SN,
  BY_SECTION_FR_SN,
} from "./fr-SN/index.js";
import {
  ALL_ARTICLES_FR_CD,
  BY_SECTION_FR_CD,
} from "./fr-CD/index.js";
import {
  ALL_ARTICLES_ES_US,
  BY_SECTION_ES_US,
} from "./es-US/index.js";
import {
  ALL_ARTICLES_RU_KZ,
  BY_SECTION_RU_KZ,
} from "./ru-KZ/index.js";
import {
  ALL_ARTICLES_RU_UZ,
  BY_SECTION_RU_UZ,
} from "./ru-UZ/index.js";
import {
  ALL_ARTICLES_RU_KG,
  BY_SECTION_RU_KG,
} from "./ru-KG/index.js";
import {
  ALL_ARTICLES_RU_BY,
  BY_SECTION_RU_BY,
} from "./ru-BY/index.js";
import {
  ALL_ARTICLES_EN_RW,
  BY_SECTION_EN_RW,
  SECTIONS_EN_RW,
} from "./en-RW/index.js";
import {
  ALL_ARTICLES_FR_CM,
  BY_SECTION_FR_CM,
} from "./fr-CM/index.js";
import {
  ALL_ARTICLES_EN_CM,
  BY_SECTION_EN_CM,
  SECTIONS_EN_CM,
} from "./en-CM/index.js";
import {
  ALL_ARTICLES_FR_BJ,
  BY_SECTION_FR_BJ,
} from "./fr-BJ/index.js";
import {
  ALL_ARTICLES_EN_MU,
  BY_SECTION_EN_MU,
  SECTIONS_EN_MU,
} from "./en-MU/index.js";
import {
  ALL_ARTICLES_FR_GN,
  BY_SECTION_FR_GN,
} from "./fr-GN/index.js";
import {
  ALL_ARTICLES_FR_TG,
  BY_SECTION_FR_TG,
} from "./fr-TG/index.js";
import {
  ALL_ARTICLES_FR_GA,
  BY_SECTION_FR_GA,
} from "./fr-GA/index.js";
import {
  ALL_ARTICLES_FR_CG,
  BY_SECTION_FR_CG,
} from "./fr-CG/index.js";

import {
  ALL_ARTICLES_NL_SR,
  BY_SECTION_NL_SR,
  SECTIONS_NL_SR,
} from "./nl-SR/index.js";
import {
  ALL_ARTICLES_PT_CV,
  BY_SECTION_PT_CV,
  SECTIONS_PT_CV,
} from "./pt-CV/index.js";
import {
  ALL_ARTICLES_ES_GQ,
  BY_SECTION_ES_GQ,
} from "./es-GQ/index.js";
import {
  ALL_ARTICLES_EN_SL,
  BY_SECTION_EN_SL,
  SECTIONS_EN_SL,
} from "./en-SL/index.js";
import {
  ALL_ARTICLES_EN_LR,
  BY_SECTION_EN_LR,
  SECTIONS_EN_LR,
} from "./en-LR/index.js";
import {
  ALL_ARTICLES_EN_GM,
  BY_SECTION_EN_GM,
  SECTIONS_EN_GM,
} from "./en-GM/index.js";

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
  ALL_ARTICLES_FR_SN,
  ALL_ARTICLES_FR_CD,
  ALL_ARTICLES_FR_CM,
  ALL_ARTICLES_EN_CM,
  SECTIONS_EN_CM,
  ALL_ARTICLES_FR_BJ,
  ALL_ARTICLES_EN_MU,
  SECTIONS_EN_MU,
  ALL_ARTICLES_FR_GN,
  ALL_ARTICLES_FR_TG,
  ALL_ARTICLES_FR_GA,
  ALL_ARTICLES_FR_CG,
  ALL_ARTICLES_NL_SR,
  SECTIONS_NL_SR,
  ALL_ARTICLES_PT_CV,
  SECTIONS_PT_CV,
  ALL_ARTICLES_ES_GQ,
  ALL_ARTICLES_EN_SL,
  SECTIONS_EN_SL,
  ALL_ARTICLES_EN_LR,
  SECTIONS_EN_LR,
  ALL_ARTICLES_EN_GM,
  SECTIONS_EN_GM,
  ALL_ARTICLES_PT_MZ,
  SECTIONS_PT_MZ,
  ALL_ARTICLES_EN_KE,
  SECTIONS_EN_KE,
  ALL_ARTICLES_EN_IN,
  ALL_ARTICLES_EN_GH,
  SECTIONS_EN_GH,
  ALL_ARTICLES_EN_RW,
  SECTIONS_EN_RW,
  ALL_ARTICLES_ES_US,
  ALL_ARTICLES_RU_KZ,
  ALL_ARTICLES_RU_UZ,
  ALL_ARTICLES_RU_KG,
  ALL_ARTICLES_RU_BY,
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
  if (id === "en-in") return "en-IN";
  if (id === "en-gh") return "en-GH";
  if (id === "en-rw") return "en-RW";
  if (id === "en-cm") return "en-CM";
  if (id === "en-mu") return "en-MU";
  if (id === "en-sl") return "en-SL";
  if (id === "en-lr") return "en-LR";
  if (id === "en-gm") return "en-GM";
  // English Canada / Philippines have no Help overlay — inherit English base.
  if (id === "en-ca" || id === "en-ph") return "en";
  // Portugal owns public path /pt; bare `pt` is not an alias of Brazil.
  if (id === "pt-pt" || id === "pt") return "pt-PT";
  if (id === "pt-ao") return "pt-AO";
  if (id === "pt-mz") return "pt-MZ";
  if (id === "pt-cv") return "pt-CV";
  if (id === "pt-br") return "pt-BR";
  // Italy / France / Netherlands / Germany / Russia own /it /fr /nl /de /ru;
  // bare tags are not aliases of other locales.
  if (id === "it-ch") return "it-CH";
  if (id === "it-it" || id === "it") return "it-IT";
  if (id === "fr-be") return "fr-BE";
  if (id === "fr-ch") return "fr-CH";
  if (id === "fr-sn") return "fr-SN";
  if (id === "fr-cd") return "fr-CD";
  if (id === "fr-cm") return "fr-CM";
  if (id === "fr-bj") return "fr-BJ";
  if (id === "fr-gn") return "fr-GN";
  if (id === "fr-tg") return "fr-TG";
  if (id === "fr-ga") return "fr-GA";
  if (id === "fr-cg") return "fr-CG";
  if (id === "fr-ci") return "fr-CI";
  if (id === "fr-ca") return "fr-CA";
  if (id === "fr-fr" || id === "fr") return "fr-FR";
  if (id === "nl-be") return "nl-BE";
  if (id === "nl-sr") return "nl-SR";
  if (id === "nl-nl" || id === "nl") return "nl-NL";
  if (id === "de-at") return "de-AT";
  if (id === "de-ch") return "de-CH";
  if (id === "de-de" || id === "de") return "de-DE";
  if (id === "ru-kz") return "ru-KZ";
  if (id === "ru-uz") return "ru-UZ";
  if (id === "ru-kg") return "ru-KG";
  if (id === "ru-by") return "ru-BY";
  if (id === "ru-ru" || id === "ru") return "ru-RU";
  if (id === "ar-eg") return "ar-EG";
  if (id === "ar-sa") return "ar-SA";
  if (id === "ar-ma") return "ar-MA";
  if (id === "ar-dz") return "ar-DZ";
  if (id === "ar-iq") return "ar-IQ";
  if (id === "ar-jo") return "ar-JO";
  if (id === "ar-ae") return "ar-AE";
  if (id === "ar-tn") return "ar-TN";
  if (id === "ar-kw") return "ar-KW";
  if (id === "ar-qa") return "ar-QA";
  if (id === "ar-om") return "ar-OM";
  if (id === "ar-bh") return "ar-BH";
  if (id === "ar-001") return "ar-001";
  if (id === "es-us") return "es-US";
  if (id === "es-gq") return "es-GQ";
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
  if (helpLocale === "en-IN") return SECTIONS;
  if (helpLocale === "en-GH") return SECTIONS_EN_GH;
  if (helpLocale === "en-RW") return SECTIONS_EN_RW;
  if (helpLocale === "en-CM") return SECTIONS_EN_CM;
  if (helpLocale === "en-MU") return SECTIONS_EN_MU;
  if (helpLocale === "en-SL") return SECTIONS_EN_SL;
  if (helpLocale === "en-LR") return SECTIONS_EN_LR;
  if (helpLocale === "en-GM") return SECTIONS_EN_GM;
  if (helpLocale === "pt-AO") return SECTIONS_PT_AO;
  if (helpLocale === "pt-MZ") return SECTIONS_PT_MZ;
  if (helpLocale === "pt-CV") return SECTIONS_PT_CV;
  if (helpLocale === "pt-PT") return SECTIONS_PT_PT;
  if (helpLocale === "pt-BR") return SECTIONS_PT_BR;
  if (helpLocale === "it-CH") return SECTIONS_IT_IT;
  if (helpLocale === "it-IT") return SECTIONS_IT_IT;
  if (helpLocale === "fr-BE") return SECTIONS_FR_FR;
  if (helpLocale === "fr-CH") return SECTIONS_FR_FR;
  if (helpLocale === "fr-SN") return SECTIONS_FR_FR;
  if (helpLocale === "fr-CD") return SECTIONS_FR_FR;
  if (helpLocale === "fr-CM") return SECTIONS_FR_FR;
  if (helpLocale === "fr-BJ") return SECTIONS_FR_FR;
  if (helpLocale === "fr-GN") return SECTIONS_FR_FR;
  if (helpLocale === "fr-TG") return SECTIONS_FR_FR;
  if (helpLocale === "fr-GA") return SECTIONS_FR_FR;
  if (helpLocale === "fr-CG") return SECTIONS_FR_FR;
  if (helpLocale === "fr-CI") return SECTIONS_FR_FR;
  if (helpLocale === "fr-CA") return SECTIONS_FR_FR;
  if (helpLocale === "fr-FR") return SECTIONS_FR_FR;
  if (helpLocale === "nl-BE") return SECTIONS_NL_BE;
  if (helpLocale === "nl-SR") return SECTIONS_NL_SR;
  if (helpLocale === "nl-NL") return SECTIONS_NL_NL;
  if (helpLocale === "de-AT") return SECTIONS_DE_AT;
  if (helpLocale === "de-CH") return SECTIONS_DE_CH;
  if (helpLocale === "de-DE") return SECTIONS_DE_DE;
  if (helpLocale === "ru-KZ") return SECTIONS_RU_RU;
  if (helpLocale === "ru-UZ") return SECTIONS_RU_RU;
  if (helpLocale === "ru-KG") return SECTIONS_RU_RU;
  if (helpLocale === "ru-BY") return SECTIONS_RU_RU;
  if (helpLocale === "ru-RU") return SECTIONS_RU_RU;
  if (helpLocale === "ar-EG") return SECTIONS_AR_EG;
  if (helpLocale === "ar-SA") return SECTIONS_AR_SA;
  if (helpLocale === "ar-MA") return SECTIONS_AR_MA;
  if (helpLocale === "ar-DZ") return SECTIONS_AR_DZ;
  if (helpLocale === "ar-IQ") return SECTIONS_AR_IQ;
  if (helpLocale === "ar-JO") return SECTIONS_AR_JO;
  if (helpLocale === "ar-AE") return SECTIONS_AR_AE;
  if (helpLocale === "ar-TN") return SECTIONS_AR_TN;
  if (helpLocale === "ar-KW") return SECTIONS_AR_KW;
  if (helpLocale === "ar-QA") return SECTIONS_AR_QA;
  if (helpLocale === "ar-OM") return SECTIONS_AR_OM;
  if (helpLocale === "ar-BH") return SECTIONS_AR_BH;
  if (helpLocale === "ar-001") return SECTIONS_AR_001;
  if (helpLocale === "es-US") return SECTIONS_ES_419;
  if (helpLocale === "es-GQ") return SECTIONS_ES_419;
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
  if (helpLocale === "en-IN") {
    return BY_SECTION_EN_IN[section] || [];
  }
  if (helpLocale === "en-GH") {
    return BY_SECTION_EN_GH[section] || [];
  }
  if (helpLocale === "en-RW") {
    return BY_SECTION_EN_RW[section] || [];
  }
  if (helpLocale === "en-CM") {
    return BY_SECTION_EN_CM[section] || [];
  }
  if (helpLocale === "en-MU") {
    return BY_SECTION_EN_MU[section] || [];
  }
  if (helpLocale === "en-SL") {
    return BY_SECTION_EN_SL[section] || [];
  }
  if (helpLocale === "en-LR") {
    return BY_SECTION_EN_LR[section] || [];
  }
  if (helpLocale === "en-GM") {
    return BY_SECTION_EN_GM[section] || [];
  }
  if (helpLocale === "pt-AO") {
    return BY_SECTION_PT_AO[section] || [];
  }
  if (helpLocale === "pt-MZ") {
    return BY_SECTION_PT_MZ[section] || [];
  }
  if (helpLocale === "pt-CV") {
    return BY_SECTION_PT_CV[section] || [];
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
  if (helpLocale === "fr-SN") {
    return BY_SECTION_FR_SN[section] || [];
  }
  if (helpLocale === "fr-CD") {
    return BY_SECTION_FR_CD[section] || [];
  }
  if (helpLocale === "fr-CM") {
    return BY_SECTION_FR_CM[section] || [];
  }
  if (helpLocale === "fr-BJ") {
    return BY_SECTION_FR_BJ[section] || [];
  }
  if (helpLocale === "fr-GN") {
    return BY_SECTION_FR_GN[section] || [];
  }
  if (helpLocale === "fr-TG") {
    return BY_SECTION_FR_TG[section] || [];
  }
  if (helpLocale === "fr-GA") {
    return BY_SECTION_FR_GA[section] || [];
  }
  if (helpLocale === "fr-CG") {
    return BY_SECTION_FR_CG[section] || [];
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
  if (helpLocale === "nl-SR") {
    return BY_SECTION_NL_SR[section] || [];
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
  if (helpLocale === "ru-KZ") {
    return BY_SECTION_RU_KZ[section] || [];
  }
  if (helpLocale === "ru-UZ") {
    return BY_SECTION_RU_UZ[section] || [];
  }
  if (helpLocale === "ru-KG") {
    return BY_SECTION_RU_KG[section] || [];
  }
  if (helpLocale === "ru-BY") {
    return BY_SECTION_RU_BY[section] || [];
  }
  if (helpLocale === "ru-RU") {
    return BY_SECTION_RU_RU[section] || [];
  }
  if (helpLocale === "ar-EG") {
    return BY_SECTION_AR_EG[section] || [];
  }
  if (helpLocale === "ar-SA") {
    return BY_SECTION_AR_SA[section] || [];
  }
  if (helpLocale === "ar-MA") {
    return BY_SECTION_AR_MA[section] || [];
  }
  if (helpLocale === "ar-DZ") {
    return BY_SECTION_AR_DZ[section] || [];
  }
  if (helpLocale === "ar-IQ") {
    return BY_SECTION_AR_IQ[section] || [];
  }
  if (helpLocale === "ar-JO") {
    return BY_SECTION_AR_JO[section] || [];
  }
  if (helpLocale === "ar-AE") {
    return BY_SECTION_AR_AE[section] || [];
  }
  if (helpLocale === "ar-TN") {
    return BY_SECTION_AR_TN[section] || [];
  }
  if (helpLocale === "ar-KW") {
    return BY_SECTION_AR_KW[section] || [];
  }
  if (helpLocale === "ar-QA") {
    return BY_SECTION_AR_QA[section] || [];
  }
  if (helpLocale === "ar-OM") {
    return BY_SECTION_AR_OM[section] || [];
  }
  if (helpLocale === "ar-BH") {
    return BY_SECTION_AR_BH[section] || [];
  }
  if (helpLocale === "ar-001") {
    return BY_SECTION_AR_001[section] || [];
  }
  if (helpLocale === "es-US") {
    return BY_SECTION_ES_US[section] || [];
  }
  if (helpLocale === "es-GQ") {
    return BY_SECTION_ES_GQ[section] || [];
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
    { locale: "ar-001", articles: ALL_ARTICLES_AR_001 },
    { locale: "ar-EG", articles: ALL_ARTICLES_AR_EG },
    { locale: "ar-SA", articles: ALL_ARTICLES_AR_SA },
    { locale: "ar-MA", articles: ALL_ARTICLES_AR_MA },
    { locale: "ar-DZ", articles: ALL_ARTICLES_AR_DZ },
    { locale: "ar-IQ", articles: ALL_ARTICLES_AR_IQ },
    { locale: "ar-JO", articles: ALL_ARTICLES_AR_JO },
    { locale: "ar-AE", articles: ALL_ARTICLES_AR_AE },
    { locale: "ar-TN", articles: ALL_ARTICLES_AR_TN },
    { locale: "ar-KW", articles: ALL_ARTICLES_AR_KW },
    { locale: "ar-QA", articles: ALL_ARTICLES_AR_QA },
    { locale: "ar-OM", articles: ALL_ARTICLES_AR_OM },
    { locale: "ar-BH", articles: ALL_ARTICLES_AR_BH },
    { locale: "en-AU", articles: ALL_ARTICLES_EN_AU },
    { locale: "en-NZ", articles: ALL_ARTICLES_EN_NZ },
    { locale: "en-IE", articles: ALL_ARTICLES_EN_IE },
    { locale: "en-GB", articles: ALL_ARTICLES_EN_GB },
    { locale: "en-SG", articles: ALL_ARTICLES_EN_SG },
    { locale: "en-ZA", articles: ALL_ARTICLES_EN_ZA },
    { locale: "en-NG", articles: ALL_ARTICLES_EN_NG },
    { locale: "en-KE", articles: ALL_ARTICLES_EN_KE },
    { locale: "en-IN", articles: ALL_ARTICLES_EN_IN },
    { locale: "en-GH", articles: ALL_ARTICLES_EN_GH },
    { locale: "en-SCT", articles: ALL_ARTICLES_EN_SCT },
    { locale: "en-NIR", articles: ALL_ARTICLES_EN_NIR },
    { locale: "pt-AO", articles: ALL_ARTICLES_PT_AO },
    { locale: "pt-MZ", articles: ALL_ARTICLES_PT_MZ },
    { locale: "fr-CI", articles: ALL_ARTICLES_FR_CI },
    { locale: "fr-CA", articles: ALL_ARTICLES_FR_CA },
    { locale: "fr-BE", articles: ALL_ARTICLES_FR_BE },
    { locale: "fr-CH", articles: ALL_ARTICLES_FR_CH },
    { locale: "fr-SN", articles: ALL_ARTICLES_FR_SN },
    { locale: "fr-CD", articles: ALL_ARTICLES_FR_CD },
    { locale: "fr-CM", articles: ALL_ARTICLES_FR_CM },
    { locale: "en-CM", articles: ALL_ARTICLES_EN_CM },
    { locale: "fr-BJ", articles: ALL_ARTICLES_FR_BJ },
    { locale: "en-MU", articles: ALL_ARTICLES_EN_MU },
    { locale: "fr-GN", articles: ALL_ARTICLES_FR_GN },
    { locale: "fr-TG", articles: ALL_ARTICLES_FR_TG },
    { locale: "fr-GA", articles: ALL_ARTICLES_FR_GA },
    { locale: "fr-CG", articles: ALL_ARTICLES_FR_CG },
    { locale: "nl-SR", articles: ALL_ARTICLES_NL_SR },
    { locale: "pt-CV", articles: ALL_ARTICLES_PT_CV },
    { locale: "es-GQ", articles: ALL_ARTICLES_ES_GQ },
    { locale: "en-SL", articles: ALL_ARTICLES_EN_SL },
    { locale: "en-LR", articles: ALL_ARTICLES_EN_LR },
    { locale: "en-GM", articles: ALL_ARTICLES_EN_GM },
    { locale: "nl-BE", articles: ALL_ARTICLES_NL_BE },
    { locale: "it-CH", articles: ALL_ARTICLES_IT_CH },
    { locale: "de-AT", articles: ALL_ARTICLES_DE_AT },
    { locale: "de-CH", articles: ALL_ARTICLES_DE_CH },
    { locale: "es-US", articles: ALL_ARTICLES_ES_US },
    { locale: "ru-KZ", articles: ALL_ARTICLES_RU_KZ },
    { locale: "ru-UZ", articles: ALL_ARTICLES_RU_UZ },
    { locale: "ru-KG", articles: ALL_ARTICLES_RU_KG },
    { locale: "ru-BY", articles: ALL_ARTICLES_RU_BY },
    { locale: "en-RW", articles: ALL_ARTICLES_EN_RW },
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
