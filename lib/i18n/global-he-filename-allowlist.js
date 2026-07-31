/**
 * Explicit allowlist of Global-runtime modules that keep a legacy `*He` / `.he`
 * filename but are NOT Hebrew text authorities.
 *
 * Authority must be: English module, report pack, or documented no-op.
 * Adding a new `*He` Global importer requires an entry here OR removing the He path.
 */

export const GLOBAL_HE_FILENAME_ALLOWLIST = Object.freeze([
  {
    path: "utils/diagnostic-labels-he.js",
    kind: "shim",
    authority: "utils/diagnostic-labels.js",
  },
  {
    path: "lib/parent-ui/parent-report-approved-copy-he.js",
    kind: "shim",
    authority: "lib/parent-ui/parent-report-approved-copy.js",
  },
  {
    path: "utils/parent-report-language/parent-facing-normalize-he.js",
    kind: "shim",
    authority: "utils/parent-report-language/parent-facing-normalize.js",
  },
  {
    path: "utils/learning-pattern-decision/parent-facing-error-pattern-he.js",
    kind: "shim",
    authority: "utils/learning-pattern-decision/parent-facing-error-pattern.js",
  },
  {
    path: "lib/learning-book/format-book-shell-title-he.js",
    kind: "shim",
    authority: "lib/learning-book/format-book-shell-title.js",
  },
  {
    path: "utils/parent-report-language/parent-report-display-labels.he.js",
    kind: "shim",
    authority: "utils/parent-report-language/parent-report-display-labels.js",
  },
  {
    path: "utils/parent-report-language/pedagogy-glossary-he.js",
    kind: "noop_passthrough",
    authority: "English parent copy is already parent-facing",
  },
  {
    path: "utils/parent-report-ui-explain-he.js",
    kind: "pack_backed",
    authority: "content-packs/en reports via reportPackCopy",
  },
  {
    path: "utils/detailed-report-parent-letter-he.js",
    kind: "pack_backed",
    authority: "content-packs/en reports via globalBurnDownCopy / report packs",
  },
  {
    path: "utils/parent-report-engine-insights-he.js",
    kind: "pack_backed",
    authority: "English insight builders + report packs (no HE prose)",
  },
  {
    path: "lib/classroom-activities/classroom-skill-labels-he.js",
    kind: "en_authority_legacy_name",
    authority: "English skill labels in-module (filename legacy)",
  },
  {
    path: "utils/parent-report-language/surface-row-labels-he.js",
    kind: "pack_backed",
    authority: "reportPackCopy",
  },
  {
    path: "utils/parent-report-language/parent-diagnostic-explanations-he.js",
    kind: "pack_backed",
    authority: "reportPackCopy",
  },
  {
    path: "utils/parent-copilot/conversational-reply-class-he.js",
    kind: "bilingual_utterance_matcher",
    authority: "Reply-class IDs are locale-neutral; HE/EN lexicons match parent input (not display SSOT)",
  },
]);

export const GLOBAL_HE_FILENAME_ALLOWLIST_PATHS = Object.freeze(
  GLOBAL_HE_FILENAME_ALLOWLIST.map((e) => e.path)
);
