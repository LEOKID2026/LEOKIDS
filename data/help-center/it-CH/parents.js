/**
 * Switzerland Italian (it-CH) sparse Help overlays for parents —
 * Italy primaria/secondaria → Ticino 1ª–5ª elementare / 1ª media.
 * Inherit all other articles/fields from it-IT.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "1ª primaria",
        text:
          "Leo Kids è uno spazio di apprendimento per gli allievi della scuola elementare e della scuola media dalla 1ª elementare alla 1ª media, con esercitazioni di matematica, geometria, inglese e scienze, oltre a giochi e resoconti sui progressi per i genitori.",
      },
    ],
  },
  "add-students": {
    summary: "Crei un profilo bambino, selezioni una classe e salvi.",
    keywords: ["bambino", "classe", "aggiungere"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "1ª primaria",
        text:
          "Inserisca il nome del bambino e selezioni una classe (dalla 1ª elementare alla 1ª media). Dopo il salvataggio, verranno visualizzati i dettagli di accesso per il bambino.",
      },
      {
        kind: "list",
        items: [
          "1ª elementare",
          "2ª elementare",
          "3ª elementare",
          "4ª elementare",
          "5ª elementare",
          "1ª media",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Modifichi il nome o la classe e lo elimini con conferma.",
  },
};
