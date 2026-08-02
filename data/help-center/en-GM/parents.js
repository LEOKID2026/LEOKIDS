/**
 * The Gambia (en-GM) sparse Help overlays for parents —
 * Lower Basic Education Grade 1–6; Maths; English formal-education layer
 * (not the sole language used in The Gambia).
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "elementary learners in grades 1–6",
        text:
          "Leo Kids is a learning space for English-language Lower Basic pupils in The Gambia. Lower Basic Education officially covers Grade 1–6; LEO KIDS groups these grades for practice as Grade 1–2, Grade 3–4, and Grade 5–6. It includes practice in maths, geometry, English, and science, plus games and progress reports for parents.",
      },
    ],
  },
  "parent-dashboard-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "name, grade,",
        text:
          "On the parent page you will see all children linked to the account, with name, grade, and management options.",
      },
    ],
  },
  "add-students": {
    summary: "Create a child profile, choose a grade, and save.",
    keywords: ["child", "grade", "add"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "choose a grade (1 through 6)",
        text:
          "Enter the child's name and choose a grade (Grade 1 through Grade 6). After saving, login details for the child will appear.",
      },
      {
        kind: "screenshot",
        altIncludes: "grade selection",
        alt: "Add child form with grade selection",
        caption: "Add child form with grade selection",
      },
      {
        kind: "list",
        items: [
          "Grade 1 — grade_1",
          "Grade 2 — grade_2",
          "through Grade 6 — grade_6",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Change name or grade, and delete with confirmation.",
  },
};
