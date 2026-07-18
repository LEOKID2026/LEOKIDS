/** Client-safe English page skill index — display copy in content-packs/en/books/english-page-skills.json */

import skillsPack from "../../content-packs/en/books/english-page-skills.json" with { type: "json" };

/**
 * @param {string} gradeKey
 */
function buildGradeSkills(gradeKey) {
  /** @type {Record<string, object>} */
  const out = {};
  const grade = skillsPack.grades?.[gradeKey] || {};
  for (const [pageKey, entry] of Object.entries(grade)) {
    out[pageKey] = Object.freeze({
      skillId: entry.skillId,
      learningPageId: entry.learningPageId || "",
      pageType: entry.pageType,
      titleKey: `${gradeKey}.${pageKey}.title`,
      descriptionKey: `${gradeKey}.${pageKey}.description`,
    });
  }
  return Object.freeze(out);
}

export const ENGLISH_G1_PAGE_SKILLS = buildGradeSkills("g1");
export const ENGLISH_G2_PAGE_SKILLS = buildGradeSkills("g2");
export const ENGLISH_G3_PAGE_SKILLS = buildGradeSkills("g3");
export const ENGLISH_G4_PAGE_SKILLS = buildGradeSkills("g4");
export const ENGLISH_G5_PAGE_SKILLS = buildGradeSkills("g5");
export const ENGLISH_G6_PAGE_SKILLS = buildGradeSkills("g6");

/**
 * @param {string} gradeKey
 * @param {string} pageKey
 */
export function getEnglishPageSkillMeta(gradeKey, pageKey) {
  const grade = skillsPack.grades?.[gradeKey];
  return grade?.[pageKey] ?? null;
}
