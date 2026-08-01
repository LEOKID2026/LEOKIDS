/**
 * Singapore (en-SG) sparse Help overlays for parents —
 * school-year Grade → Primary level / Primary 1–6, Maths only.
 * Inherit all other articles/fields from English content/.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "elementary learners in grades 1–6",
        text:
          "Leo Kids is a learning space for primary learners in Primary 1–6, with practice in maths, geometry, English, and science, plus games and progress reports for parents.",
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "name, grade,",
        text:
          "On the parent page you will see all children linked to the account, with name, primary level, and management options.",
      },
    ],
  },
  "add-students": {
    summary: "Create a child profile, choose a primary level, and save.",
    keywords: ["child", "primary level", "add"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "choose a grade (1 through 6)",
        text:
          "Enter the child's name and choose a primary level (Primary 1 through Primary 6). After saving, login details for the child will appear.",
      },
      {
        kind: "screenshot",
        altIncludes: "grade selection",
        alt: "Add child form with primary level selection",
        caption: "Add child form with primary level selection",
      },
      {
        kind: "list",
        items: [
          "Primary 1 — grade_1",
          "Primary 2 — grade_2",
          "through Primary 6 — grade_6",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Change name or primary level, and delete with confirmation.",
  },
};
