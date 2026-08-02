/**
 * Switzerland (de-CH) sparse Help overlays for students —
 * Swiss Standard German spelling only. Klasse + du address inherited from de-DE.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "daily-missions": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Wenn du sie abschließt",
        text:
          "Auf deiner Startseite siehst du tägliche Missionen. Wenn du sie abschliesst, sammelst du Punkte und Fortschritt.",
      },
    ],
  },
  "tips-for-good-practice": {
    summary: "Übungszeit, Pausen und Regelmässigkeit.",
    blockPatches: [
      {
        kind: "callout",
        textIncludes: "Lernen macht mehr Spaß",
        text: "Lernen macht mehr Spass, wenn du dich nicht selbst unter Druck setzt!",
      },
    ],
  },
};
