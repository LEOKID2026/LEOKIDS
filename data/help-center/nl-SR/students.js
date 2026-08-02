/**
 * Suriname Dutch (nl-SR) sparse Help overlays for students —
 * groep (grade level) → leerjaar. Child address (je/jij) preserved from nl-NL.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Kies een vak en een leerjaar",
    keywords: ["vak", "leerjaar"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "jouw groep",
        text: "Kies een vak uit de lijst. De activiteiten passen bij jouw leerjaar.",
      },
    ],
  },
};
