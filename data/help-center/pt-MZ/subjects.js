/**
 * Mozambique (pt-MZ) sparse Help overlays for subjects —
 * 1.ª–6.ª classe / Ensino Primário on top of pt-PT Help.
 * textIncludes match pt-PT runtime article text.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "A prática é projetada para crianças da 1",
      text: "A prática é projetada para crianças da 1.ª à 6.ª classe, de acordo com o nível da classe.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Prática de matemática da 1.ª à 6.ª classe — o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  geometry: {
    summary:
      "Prática de geometria da 1.ª à 6.ª classe – o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  english: {
    summary:
      "Prática de inglês da 1.ª à 6.ª classe — o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Prática científica da 1.ª à 6.ª classe — o que as crianças aprendem e como praticar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
