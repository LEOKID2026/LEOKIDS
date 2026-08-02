/**
 * India (en-IN) sparse Help overlays for parents —
 * school-year Grade → Class 1–6; primary + upper-primary framing; Maths.
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
          "Leo Kids is a learning space for school students in Classes 1 to 6 (primary and upper-primary levels), with practice in maths, geometry, English, and science, plus games and progress reports for parents.",
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "name, grade,",
        text:
          "On the parent page you will see all children linked to the account, with name, class, and management options.",
      },
    ],
  },
  "add-students": {
    summary: "Create a child profile, choose a class, and save.",
    keywords: ["child", "class", "add"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "choose a grade (1 through 6)",
        text:
          "Enter the child's name and choose a class (Class 1 through Class 6). After saving, login details for the child will appear.",
      },
      {
        kind: "screenshot",
        altIncludes: "grade selection",
        alt: "Add child form with class selection",
        caption: "Add child form with class selection",
      },
      {
        kind: "list",
        items: [
          "Class 1 — grade_1",
          "Class 2 — grade_2",
          "through Class 6 — grade_6",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Change name or class, and delete with confirmation.",
  },
};
