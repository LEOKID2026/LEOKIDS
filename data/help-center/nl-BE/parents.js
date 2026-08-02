/**
 * Belgium Dutch (nl-BE) sparse Help overlays for parents —
 * Groep 3–8 / basisschool → 1ste–6de leerjaar / lagere school.
 * Adult address (u) preserved from nl-NL parent surfaces.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "leerlingen van de basisschool in Groep 3–8",
        text:
          "Leo Kids is een leeromgeving voor leerlingen van de lagere school in het 1ste tot en met 6de leerjaar, met oefenen in rekenen, meetkunde, Engels en natuur en techniek, plus spellen en voortgangsrapporten voor ouders.",
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "naam, groep",
        text:
          "Op de ouderpagina ziet u alle kinderen die aan het account zijn gekoppeld, met naam, leerjaar en beheermogelijkheden.",
      },
    ],
  },
  "add-students": {
    summary: "Maak een kindprofiel, kies een leerjaar en sla op.",
    keywords: ["kind", "leerjaar", "toevoegen"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "kies een groep (Groep 3 tot en met Groep 8)",
        text:
          "Voer de naam van het kind in en kies een leerjaar (1ste tot en met 6de leerjaar). Na het opslaan verschijnen de inloggegevens van het kind.",
      },
      {
        kind: "screenshot",
        altIncludes: "groepkeuze",
        alt: "Formulier om kind toe te voegen met leerjaarkeuze",
        caption: "Formulier om kind toe te voegen met leerjaarkeuze",
      },
      {
        kind: "list",
        items: [
          "1ste leerjaar — grade_1",
          "2de leerjaar — grade_2",
          "tot en met 6de leerjaar — grade_6",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Naam of leerjaar wijzigen, en verwijderen met bevestiging.",
  },
};
