/**
 * South Africa (en-ZA) sparse Help overlays for parent-report — Math → Maths labels only.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_REPORT_OVERRIDES_BY_SLUG = {
  "topics-and-buckets": {
    blockPatches: [
      {
        kind: "screenshot",
        altIncludes: "Math topics table",
        alt: "Maths topics table",
        caption: "Maths topics table",
      },
    ],
  },
};
