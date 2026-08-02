/**
 * Switzerland (de-CH) sparse Help overlays for parents —
 * Primarschule terminology + Swiss Standard German spelling (ss).
 * Grade labels remain 1.–6. Klasse (same IDs as de-DE).
 * Adult address (Sie) preserved.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Grundschulkinder von der 1. bis zur 6. Klasse",
        text:
          "Leo Kids ist ein Lernraum für Primarschulkinder von der 1. bis zur 6. Klasse mit Übungen in Mathematik, Geometrie, Englisch und Naturwissenschaften sowie Spielen und Fortschrittsberichten für Eltern.",
      },
    ],
  },
  "create-parent-account": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "schließen Sie die Registrierung",
        text:
          "Gehen Sie zur Eltern-Anmeldeseite und schliessen Sie die Registrierung ab oder melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Passwort an.",
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "bis zu drei Kinder umfassen",
        text: "Standardmässig kann jedes Elternkonto bis zu drei Kinder umfassen.",
      },
    ],
  },
};
