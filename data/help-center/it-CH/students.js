/**
 * Switzerland Italian (it-CH) sparse Help overlays for students —
 * grade span → 1ª–5ª elementare / 1ª media; keep tu address.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "tuo classe",
        text:
          "Scegli un argomento dall'elenco. Le attività corrisponderanno alla tua classe (dalla 1ª elementare alla 1ª media).",
      },
    ],
  },
};
