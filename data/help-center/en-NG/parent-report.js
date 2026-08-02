/**
 * Nigeria (en-NG) sparse Help overlays for parent-report — Math → Maths only.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_REPORT_OVERRIDES_BY_SLUG = {
  "topics-and-buckets": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "addition in math",
        text:
          "Each subject shows specific topics — for example addition in maths or vocabulary in English.",
      },
      {
        kind: "screenshot",
        altIncludes: "Math topics table",
        alt: "Maths topics table",
        caption: "Maths topics table",
      },
    ],
  },
  "subjects-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "across math, geometry",
        text:
          "Lets you see at a glance where your child is strong and where there is room to grow across maths, geometry, English, and science.",
      },
    ],
  },
};
