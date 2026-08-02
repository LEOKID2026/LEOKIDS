/**
 * Cabo Verde (pt-CV) sparse Help overlays for subjects —
 * 1.º–6.º ano / ensino básico on top of pt-PT Help.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "A prática é projetada para crianças da 1",
      text: "A prática é projetada para crianças do 1.º ao 6.º ano, de acordo com o nível do ano.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Prática de matemática do 1.º ao 6.º ano — o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  geometry: {
    summary:
      "Prática de geometria do 1.º ao 6.º ano – o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  english: {
    summary:
      "Prática de inglês do 1.º ao 6.º ano — o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Prática científica do 1.º ao 6.º ano — o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
