/**
 * Explicit allowlist of Global-runtime modules that keep a legacy `*He` / `.he`
 * filename but are NOT Hebrew text authorities.
 *
 * Authority must be: English module, report pack, or documented no-op.
 * Adding a new `*He` Global importer requires an entry here OR removing the He path.
 */

export const GLOBAL_HE_FILENAME_ALLOWLIST = Object.freeze([
  {
    path: "utils/diagnostic-labels.js",
    kind: "shim",
    authority: "utils/diagnostic-labels.js",
  },
  {
    path: "lib/parent-ui/parent-report-approved-copy.js",
    kind: "shim",
    authority: "lib/parent-ui/parent-report-approved-copy.js",
  },
  {
    path: "utils/parent-report-language/pedagogy-glossary.js",
    kind: "noop_passthrough",
    authority: "Global EN passthrough normalize; Hebrew gloss removed from Global product runtime",
  },
  {
    path: "utils/parent-report-language/parent-facing-normalize.js",
    kind: "noop_passthrough",
    authority: "Global EN parent-facing normalize (CI Hebrew layer is out of Global product scope)",
  },
  {
    path: "utils/learning-pattern-decision/parent-facing-error-pattern.js",
    kind: "shim",
    authority: "utils/learning-pattern-decision/parent-facing-error-pattern.js",
  },
  {
    path: "lib/learning-book/format-book-shell-title.js",
    kind: "shim",
    authority: "lib/learning-book/format-book-shell-title.js",
  },
  {
    path: "utils/parent-report-language/parent-report-display-labels.js",
    kind: "shim",
    authority: "utils/parent-report-language/parent-report-display-labels.js",
  },
  {
    path: "utils/parent-report-ui-explain.js",
    kind: "pack_backed",
    authority: "content-packs/en reports via reportPackCopy",
  },
  {
    path: "utils/detailed-report-parent-letter.js",
    kind: "pack_backed",
    authority: "content-packs/en reports via globalBurnDownCopy / report packs",
  },
  {
    path: "utils/parent-report-engine-insights.js",
    kind: "pack_backed",
    authority: "English insight builders + report packs (no HE prose)",
  },
  {
    path: "lib/classroom-activities/classroom-skill-labels.js",
    kind: "en_authority_legacy_name",
    authority: "English skill labels in-module (filename legacy)",
  },
  {
    path: "utils/parent-report-language/surface-row-labels.js",
    kind: "pack_backed",
    authority: "reportPackCopy",
  },
  {
    path: "utils/parent-report-language/parent-diagnostic-explanations.js",
    kind: "pack_backed",
    authority: "reportPackCopy",
  },
  {
    path: "utils/parent-copilot/conversational-reply-class.js",
    kind: "bilingual_utterance_matcher",
    authority: "Reply-class IDs are locale-neutral; HE/EN lexicons match parent input (not display SSOT)",
  },
]);

export const GLOBAL_HE_FILENAME_ALLOWLIST_PATHS = Object.freeze(
  GLOBAL_HE_FILENAME_ALLOWLIST.map((e) => e.path)
);
