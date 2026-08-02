/**
 * Switzerland Italian (it-CH) sparse Help overlays for subjects —
 * primaria/secondaria → elementare/media; adult Lei on parent-facing subject tips.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay["blockPatches"]} */
const SUBJECT_BLOCK_PATCHES = [
  {
    kind: "paragraph",
    textIncludes: "1ª primaria",
    text:
      "La pratica è progettata per i bambini dalla 1ª elementare alla 1ª media, abbinati al livello scolastico.",
  },
  {
    kind: "paragraph",
    textIncludes: "Scegli la classe e un livello",
    text:
      "Selezioni una classe e un livello di difficoltà, risponda alle domande e ottenga una spiegazione dopo ogni risposta.",
  },
];

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Pratica di matematica dalla 1ª elementare alla 1ª media: cosa imparano i bambini e come esercitarsi.",
    blockPatches: [...SUBJECT_BLOCK_PATCHES],
  },
  geometry: {
    summary:
      "Pratica di geometria dalla 1ª elementare alla 1ª media: cosa imparano i bambini e come esercitarsi.",
    blockPatches: [...SUBJECT_BLOCK_PATCHES],
  },
  english: {
    summary:
      "Pratica di inglese dalla 1ª elementare alla 1ª media: cosa imparano i bambini e come esercitarsi.",
    blockPatches: [...SUBJECT_BLOCK_PATCHES],
  },
  science: {
    summary:
      "Pratica di scienze dalla 1ª elementare alla 1ª media: cosa imparano i bambini e come esercitarsi.",
    blockPatches: [...SUBJECT_BLOCK_PATCHES],
  },
};
