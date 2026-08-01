/**
 * es-419 translation package inventory — what must exist for a complete LatAm Spanish locale.
 * Generated against repo structure; counts are leaf string values unless noted.
 * Admin / pages/dev / prototypes / POC / QA tools are out of scope.
 */

/** @typedef {"UI"|"learning"|"report"|"SEO"|"print"|"email"|"legal"|"system"} ContentKind */

/**
 * @typedef {{
 *   id: string,
 *   source: string,
 *   target: string,
 *   keysOrRecords: number|string,
 *   kind: ContentKind,
 *   enFallbackOkDuringDev: boolean,
 *   doNotTranslate?: string,
 *   englishSubjectKeepEn?: boolean,
 *   notes?: string,
 * }} InventoryItem
 */

/** @type {readonly InventoryItem[]} */
export const ES419_TRANSLATION_INVENTORY = Object.freeze([
  // —— UI namespaces (locales/en → locales/es-419) ——
  {
    id: "ns.common",
    source: "locales/en/common.json",
    target: "locales/es-419/common.json",
    keysOrRecords: 46,
    kind: "UI",
    enFallbackOkDuringDev: true,
    doNotTranslate: "brandName / Leo Kids product marks",
  },
  {
    id: "ns.ui",
    source: "locales/en/ui.json",
    target: "locales/es-419/ui.json",
    keysOrRecords: 594,
    kind: "UI",
    enFallbackOkDuringDev: true,
    doNotTranslate: "brand strings LEO KIDS / P LEO KIDS / T LEO KIDS; arcade game proper names where kept",
  },
  {
    id: "ns.auth",
    source: "locales/en/auth.json",
    target: "locales/es-419/auth.json",
    keysOrRecords: 181,
    kind: "UI",
    enFallbackOkDuringDev: true,
    doNotTranslate: "URL placeholders {url}/{siteUrl}/…; Leo Kids brand",
  },
  {
    id: "ns.validation",
    source: "locales/en/validation.json",
    target: "locales/es-419/validation.json",
    keysOrRecords: 58,
    kind: "system",
    enFallbackOkDuringDev: true,
  },
  {
    id: "ns.learning",
    source: "locales/en/learning.json",
    target: "locales/es-419/learning.json",
    keysOrRecords: 617,
    kind: "UI",
    enFallbackOkDuringDev: true,
    englishSubjectKeepEn: false,
    notes: "UI chrome around learning; English-subject stems stay in content packs / banks",
  },
  {
    id: "ns.reports",
    source: "locales/en/reports.json",
    target: "locales/es-419/reports.json",
    keysOrRecords: 249,
    kind: "report",
    enFallbackOkDuringDev: true,
  },
  {
    id: "ns.emails",
    source: "locales/en/emails.json",
    target: "locales/es-419/emails.json",
    keysOrRecords: 4,
    kind: "email",
    enFallbackOkDuringDev: true,
  },
  {
    id: "ns.seo",
    source: "locales/en/seo.json",
    target: "locales/es-419/seo.json",
    keysOrRecords: 9,
    kind: "SEO",
    enFallbackOkDuringDev: true,
  },
  {
    id: "ns.legal",
    source: "locales/en/legal.json",
    target: "locales/es-419/legal.json",
    keysOrRecords: 21,
    kind: "legal",
    enFallbackOkDuringDev: true,
    notes: "Legal copy may need owner/legal review before status=enabled",
  },
  {
    id: "ns.worksheets",
    source: "locales/en/worksheets.json",
    target: "locales/es-419/worksheets.json",
    keysOrRecords: 332,
    kind: "print",
    enFallbackOkDuringDev: true,
  },
  {
    id: "ns.games",
    source: "locales/en/games.json",
    target: "locales/es-419/games.json",
    keysOrRecords: 80,
    kind: "UI",
    enFallbackOkDuringDev: true,
  },
  {
    id: "ns.teacher",
    source: "locales/en/teacher.json",
    target: "locales/es-419/teacher.json",
    keysOrRecords: 78,
    kind: "UI",
    enFallbackOkDuringDev: true,
  },
  {
    id: "ns.school",
    source: "locales/en/school.json",
    target: "locales/es-419/school.json",
    keysOrRecords: 381,
    kind: "UI",
    enFallbackOkDuringDev: true,
  },
  {
    id: "ns.platform",
    source: "locales/en/platform.json",
    target: "locales/es-419/platform.json",
    keysOrRecords: 54,
    kind: "UI",
    enFallbackOkDuringDev: true,
  },
  {
    id: "ns.copilot",
    source: "locales/en/copilot.json",
    target: "locales/es-419/copilot.json",
    keysOrRecords: 89,
    kind: "report",
    enFallbackOkDuringDev: true,
  },

  // —— Required content packs (manifest) ——
  {
    id: "pack.learning.burn-down-index",
    source: "content-packs/en/learning/burn-down-index.json",
    target: "content-packs/es-419/learning/burn-down-index.json",
    keysOrRecords: "index + linked burn-down packs (~59 learning pack files)",
    kind: "learning",
    enFallbackOkDuringDev: true,
  },
  {
    id: "pack.learning.diagnostic-labels",
    source: "content-packs/en/learning/diagnostic-labels.json",
    target: "content-packs/es-419/learning/diagnostic-labels.json",
    keysOrRecords: "label records",
    kind: "learning",
    enFallbackOkDuringDev: true,
  },
  {
    id: "pack.reports.burn-down-index",
    source: "content-packs/en/reports/burn-down-index.json",
    target: "content-packs/es-419/reports/burn-down-index.json",
    keysOrRecords: "index + ~41 report pack files",
    kind: "report",
    enFallbackOkDuringDev: true,
  },
  {
    id: "pack.games.burn-down-index",
    source: "content-packs/en/games/burn-down-index.json",
    target: "content-packs/es-419/games/burn-down-index.json",
    keysOrRecords: "index + ~148 game pack files",
    kind: "UI",
    enFallbackOkDuringDev: true,
  },
  {
    id: "pack.games.ui-pack-index",
    source: "content-packs/en/games/ui-pack-index.json",
    target: "content-packs/es-419/games/ui-pack-index.json",
    keysOrRecords: "game UI pack index",
    kind: "UI",
    enFallbackOkDuringDev: true,
  },
  {
    id: "pack.books.ui",
    source: "content-packs/en/books/ui.json",
    target: "content-packs/es-419/books/ui.json",
    keysOrRecords: "book UI strings",
    kind: "learning",
    enFallbackOkDuringDev: true,
  },
  {
    id: "pack.rewards.ui",
    source: "content-packs/en/rewards/ui.json",
    target: "content-packs/es-419/rewards/ui.json",
    keysOrRecords: "rewards UI strings",
    kind: "UI",
    enFallbackOkDuringDev: true,
  },

  // —— Broader content-packs/en tree (396 JSON files total) ——
  {
    id: "pack.learning.tree",
    source: "content-packs/en/learning/**",
    target: "content-packs/es-419/learning/**",
    keysOrRecords: "59 files",
    kind: "learning",
    enFallbackOkDuringDev: true,
    englishSubjectKeepEn: true,
    notes: "English subject learning content stays EN; translate instructions/hints/feedback overlays",
  },
  {
    id: "pack.reports.tree",
    source: "content-packs/en/reports/**",
    target: "content-packs/es-419/reports/**",
    keysOrRecords: "41 files",
    kind: "report",
    enFallbackOkDuringDev: true,
  },
  {
    id: "pack.games.tree",
    source: "content-packs/en/games/**",
    target: "content-packs/es-419/games/**",
    keysOrRecords: "148 files",
    kind: "UI",
    enFallbackOkDuringDev: true,
  },
  {
    id: "pack.global-burn-down.tree",
    source: "content-packs/en/global-burn-down/**",
    target: "content-packs/es-419/global-burn-down/**",
    keysOrRecords: "142 files",
    kind: "UI",
    enFallbackOkDuringDev: true,
    doNotTranslate: "Skip prototypes/dev burn-down entries (e.g. LeoDogReferenceGallery)",
  },
  {
    id: "pack.books.tree",
    source: "content-packs/en/books/**",
    target: "content-packs/es-419/books/**",
    keysOrRecords: "3 files",
    kind: "learning",
    enFallbackOkDuringDev: true,
  },
  {
    id: "pack.rewards.tree",
    source: "content-packs/en/rewards/**",
    target: "content-packs/es-419/rewards/**",
    keysOrRecords: "2 files",
    kind: "UI",
    enFallbackOkDuringDev: true,
  },
  {
    id: "pack.demo.ui",
    source: "content-packs/en/demo/ui.json",
    target: "content-packs/es-419/demo/ui.json",
    keysOrRecords: "1 file",
    kind: "UI",
    enFallbackOkDuringDev: true,
    notes: "Demo surface — translate only if demo ships in global product",
  },

  // —— Help Center ——
  {
    id: "help.center",
    source: "data/help-center/content/** + index SECTIONS",
    target: "data/help-center/es-419/** + locale-aware getters",
    keysOrRecords: "article slug parity with EN (parents/students/parent-report/subjects)",
    kind: "UI",
    enFallbackOkDuringDev: false,
    notes: "Client contentLocale selects EN or es-419 article bodies; screenshots/videos shared",
  },

  // —— Learning books ——
  {
    id: "books.math",
    source: "docs/learning-book/en/math/**/drafts",
    target: "docs/learning-book/es-419/math/**/drafts",
    keysOrRecords: "189 active md drafts",
    kind: "learning",
    enFallbackOkDuringDev: false,
  },
  {
    id: "books.geometry",
    source: "docs/learning-book/en/geometry/**/drafts",
    target: "docs/learning-book/es-419/geometry/**/drafts",
    keysOrRecords: "66 active md drafts",
    kind: "learning",
    enFallbackOkDuringDev: false,
  },
  {
    id: "books.science",
    source: "docs/learning-book/en/science/**/drafts",
    target: "docs/learning-book/es-419/science/**/drafts",
    keysOrRecords: "38 active md drafts",
    kind: "learning",
    enFallbackOkDuringDev: false,
  },
  {
    id: "books.english",
    source: "docs/learning-book/en/english/**/drafts",
    target: "docs/learning-book/es-419/english/**/drafts",
    keysOrRecords: "124 active md drafts",
    kind: "learning",
    enFallbackOkDuringDev: false,
    englishSubjectKeepEn: true,
    doNotTranslate: "Stems, options, passages, vocabulary items stay English",
    notes: "Chrome/instructions translated; English learning material kept in English",
  },

  // —— Science overlay ——
  {
    id: "science.overlay",
    source: "data/science-questions-en-overlay.js",
    target: "data/science-questions-es-419-overlay.js (or locale overlay registry)",
    keysOrRecords: "full science bank overlay fields (stem/options/explanation; optional hint/feedback)",
    kind: "learning",
    enFallbackOkDuringDev: true,
  },

  // —— Writing / worksheets data ——
  {
    id: "writing.word-packs",
    source: "data/writing/word-packs.locale.js (+ EN catalogs)",
    target: "es-419 writing packs / locale resolution",
    keysOrRecords: "word pack titles & instructions",
    kind: "print",
    enFallbackOkDuringDev: true,
    englishSubjectKeepEn: true,
    notes: "English writing content may stay EN; UI titles/instructions follow locale",
  },

  // —— Glossary ——
  {
    id: "glossary.es-419",
    source: "lib/i18n/american-english-glossary.js (EN SSOT)",
    target: "lib/i18n/spanish-latam-glossary.js",
    keysOrRecords: "term entries",
    kind: "system",
    enFallbackOkDuringDev: false,
    notes: "Authority for terminology; not user-facing runtime strings",
  },
]);

export const ES419_PHASE1_TRANSLATED_NAMESPACES = Object.freeze([
  "common",
  "ui",
  "auth",
  "validation",
]);

export const ES419_PHASE2_TRANSLATED_NAMESPACES = Object.freeze([
  "learning",
  "reports",
  "worksheets",
  "games",
]);

export const ES419_PHASE3_TRANSLATED_NAMESPACES = Object.freeze([
  "emails",
  "seo",
  "legal",
  "teacher",
  "school",
  "platform",
  "copilot",
]);

export const ES419_TRANSLATED_NAMESPACES = Object.freeze([
  ...ES419_PHASE1_TRANSLATED_NAMESPACES,
  ...ES419_PHASE2_TRANSLATED_NAMESPACES,
  ...ES419_PHASE3_TRANSLATED_NAMESPACES,
]);
