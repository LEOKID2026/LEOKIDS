/**
 * Austria (de-AT) sparse Help overlays for parents — Klasse → Schulstufe only.
 * Inherit all other articles/fields from de-DE.
 * Volksschule is not used for the full 1–6 range (5–6 are Sekundarstufe I).
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Grundschulkinder von der 1. bis zur 6. Klasse",
        text:
          "Leo Kids ist ein Lernraum für Kinder von der 1. bis zur 6. Schulstufe mit Übungen in Mathematik, Geometrie, Englisch und Naturwissenschaften sowie Spielen und Fortschrittsberichten für Eltern.",
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Name, Klasse",
        text:
          "Auf der Eltern-Seite sehen Sie alle mit dem Konto verknüpften Kinder mit Name, Schulstufe und Verwaltungsoptionen.",
      },
    ],
  },
  "add-students": {
    summary: "Ein Kinderprofil erstellen, eine Schulstufe wählen und speichern.",
    keywords: ["Kind", "Schulstufe", "hinzufügen"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "eine Klasse (1 bis 6)",
        text:
          "Geben Sie den Namen des Kindes ein und wählen Sie eine Schulstufe (1 bis 6). Nach dem Speichern werden die Anmeldedaten des Kindes angezeigt.",
      },
      {
        kind: "screenshot",
        altIncludes: "Klassenauswahl",
        alt: "Hinzufügen-Formular mit Schulstufenauswahl",
        caption: "Hinzufügen-Formular mit Schulstufenauswahl",
      },
      {
        kind: "list",
        items: [
          "1. Schulstufe",
          "2. Schulstufe",
          "3. Schulstufe",
          "4. Schulstufe",
          "5. Schulstufe",
          "6. Schulstufe",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Name oder Schulstufe ändern und mit Bestätigung löschen.",
  },
};
