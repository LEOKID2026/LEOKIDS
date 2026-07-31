/**
 * Central contract: what must exist for a complete product locale.
 * Adding a language = supply artifacts listed here (no per-component forks).
 *
 * Pseudo locales (en-XA, ar-XB) prove transforms without translated content packs.
 */

/** @typedef {"required"|"optional"|"english_subject_exception"|"pseudo_ok"} CompletenessRequirement */

/**
 * @typedef {{
 *   id: string,
 *   requirement: CompletenessRequirement,
 *   description: string,
 *   check: string,
 * }} LocaleCompletenessItem
 */

/** @type {readonly LocaleCompletenessItem[]} */
export const LOCALE_COMPLETENESS_MANIFEST = Object.freeze([
  {
    id: "registry",
    requirement: "required",
    description: "Locale registered in LOCALE_REGISTRY with direction, intlLocale, fonts, ogLocale",
    check: "registry",
  },
  {
    id: "ui_namespaces",
    requirement: "required",
    description: "UI message namespaces under locales/{id}/",
    check: "ui_namespaces",
  },
  {
    id: "content_pack_catalog",
    requirement: "required",
    description: "Content packs registered in CONTENT_PACK_CATALOG (or fs under content-packs/{id}/)",
    check: "content_packs",
  },
  {
    id: "learning_books",
    requirement: "required",
    description: "Learning book drafts under docs/learning-book/{id}/{subject}/{grade}/drafts",
    check: "learning_books",
  },
  {
    id: "science_overlay",
    requirement: "required",
    description: "Science localizable fields covered for this locale (overlay or native bank)",
    check: "science_overlay",
  },
  {
    id: "question_stem_templates",
    requirement: "required",
    description: "Math/geometry stem templates for locale (params-based; no HE runtime translation)",
    check: "question_stems",
  },
  {
    id: "worksheets_writing",
    requirement: "required",
    description: "Worksheet/writing pack titles & instructions for locale",
    check: "worksheets",
  },
  {
    id: "games_packs",
    requirement: "required",
    description: "Game UI/burn-down packs for locale",
    check: "games",
  },
  {
    id: "report_packs",
    requirement: "required",
    description: "Parent report burn-down packs for locale",
    check: "reports",
  },
  {
    id: "seo",
    requirement: "required",
    description: "SEO ready: ogLocale, hreflang when status=enabled",
    check: "seo",
  },
  {
    id: "fonts_direction",
    requirement: "required",
    description: "Direction + font fallback stack declared on registry entry",
    check: "fonts",
  },
  {
    id: "localized_assets",
    requirement: "optional",
    description: "Localized assets under assets/i18n/{id}/ — required items only when declared; empty inactive locale OK",
    check: "localized_assets",
  },
  {
    id: "english_subject_learning",
    requirement: "english_subject_exception",
    description: "English-subject learning stems/options stay en; instructions may follow locale",
    check: "english_subject",
  },
  {
    id: "pseudo_transforms",
    requirement: "pseudo_ok",
    description: "Pseudo locales may omit translated packs and use en fallback + transforms",
    check: "pseudo",
  },
]);

/** UI namespaces expected for a full locale (mirrors lib/i18n/load-messages I18N_NAMESPACES). */
export const REQUIRED_UI_NAMESPACES = Object.freeze([
  "common",
  "ui",
  "auth",
  "learning",
  "reports",
  "emails",
  "seo",
  "legal",
  "worksheets",
  "games",
  "validation",
  "teacher",
  "school",
  "platform",
  "copilot",
]);

/** Content-pack relative paths that must resolve for a full locale (via catalog or fs). */
export const REQUIRED_CONTENT_PACK_PATHS = Object.freeze([
  "learning/burn-down-index.json",
  "learning/diagnostic-labels.json",
  "reports/burn-down-index.json",
  "games/burn-down-index.json",
  "games/ui-pack-index.json",
  "books/ui.json",
  "rewards/ui.json",
]);

export const GLOBAL_SUBJECTS = Object.freeze(["math", "geometry", "english", "science"]);
export const GLOBAL_GRADES = Object.freeze(["g1", "g2", "g3", "g4", "g5", "g6"]);
