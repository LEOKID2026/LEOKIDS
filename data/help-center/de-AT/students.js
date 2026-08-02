/**
 * Austria (de-AT) sparse Help overlays for students — school-year Klasse → Schulstufe only.
 * Child address (du) preserved from de-DE.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Ein Fach und eine Schulstufe wählen",
    keywords: ["Fach", "Schulstufe"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "deiner Klasse",
        text: "Wähle ein Fach aus der Liste. Die Aufgaben passen zu deiner Schulstufe.",
      },
    ],
  },
};
