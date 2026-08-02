/**
 * Switzerland French (fr-CH) sparse Help overlays for subjects —
 * CP/6e and grade « classe » → 3P–8P / année + niveau de difficulté.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay["blockPatches"]} */
const SUBJECT_BLOCK_PATCHES = [
  {
    kind: "paragraph",
    textIncludes: "du CP à la 6e",
    text:
      "La pratique est conçue pour les enfants de la 3P à la 8P, en fonction de l’année scolaire.",
  },
  {
    kind: "paragraph",
    textIncludes: "Choisissez une classe et un niveau",
    text:
      "Choisissez une année et un niveau de difficulté, répondez aux questions et obtenez une explication après chaque réponse.",
  },
];

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Pratique des mathématiques de la 3P à la 8P : ce que les enfants apprennent et comment pratiquer.",
    blockPatches: [...SUBJECT_BLOCK_PATCHES],
  },
  geometry: {
    summary:
      "Pratique de la géométrie de la 3P à la 8P : ce que les enfants apprennent et comment pratiquer.",
    blockPatches: [...SUBJECT_BLOCK_PATCHES],
  },
  english: {
    summary:
      "Pratique de l’anglais de la 3P à la 8P : ce que les enfants apprennent et comment pratiquer.",
    blockPatches: [...SUBJECT_BLOCK_PATCHES],
  },
  science: {
    summary:
      "Pratique scientifique de la 3P à la 8P : ce que les enfants apprennent et comment mettre en pratique.",
    blockPatches: [...SUBJECT_BLOCK_PATCHES],
  },
};
