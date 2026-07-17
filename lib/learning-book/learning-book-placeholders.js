/**
 * Placeholder learning-book page markdown (7 sections, English).
 */

export const PLACEHOLDER_PAGE_ID = "book_placeholder";

/**
 * @param {{ subject: string, grade: string, subjectTitle?: string, subjectTitleHe?: string }} opts
 * @returns {string}
 */
export function buildPlaceholderPageMarkdown({ subject, grade, subjectTitle, subjectTitleHe }) {
  const subjectLabel =
    subjectTitle ||
    subjectTitleHe ||
    (subject === "geometry"
      ? "Geometry"
      : subject === "math"
        ? "Math"
        : subject === "science"
          ? "Science"
          : subject === "english"
            ? "English"
            : subject);
  const learningPageId = `${subject}:${grade}:${PLACEHOLDER_PAGE_ID}`;
  const skillId = `${subject}:kind:${PLACEHOLDER_PAGE_ID}`;

  return `# Book in preparation

## Metadata

| Field | Value |
|-------|-------|
| **learning_page_id** | \`${learningPageId}\` |
| **skill_id** | \`${skillId}\` |
| **subject** | ${subject} |
| **grade** | ${grade} |
| **page_type** | placeholder |
| **approval_status** | draft |
| **title_english** | Book in preparation |

---

## 1. What are we learning?

Content will be added soon.

## 2. Simple explanation

This page is ready for **${subjectLabel}** learning content.

## 3. Visual / concrete example

We will add an explanation, example, and practice for this topic soon.

## 4. Let's solve together

Content will be added soon.

## 5. Try it yourself

This page is ready for learning content.

## 6. Common mistake — watch out!

We will add tips and examples for this topic soon.

## 7. Let's practice!

Content will be added soon.
`;
}
