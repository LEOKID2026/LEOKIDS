/**
 * Saudi Arabia (ar-SA) subject Help — academic grade chrome uses الصف (not درجة).
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
  geometry: {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
  english: {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
  science: {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
};
