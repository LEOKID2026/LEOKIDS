/**
 * Export english-page-skill-index.js display strings → content-packs/en/books/english-page-skills.json
 * Run: node scripts/i18n/export-english-page-skills.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ENGLISH_G1_PAGE_SKILLS,
  ENGLISH_G2_PAGE_SKILLS,
  ENGLISH_G3_PAGE_SKILLS,
  ENGLISH_G4_PAGE_SKILLS,
  ENGLISH_G5_PAGE_SKILLS,
  ENGLISH_G6_PAGE_SKILLS,
} from "../../lib/learning-book/english-page-skill-index.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outPath = path.join(root, "content-packs/en/books/english-page-skills.json");

/** @type {Record<string, Record<string, object>>} */
const grades = {
  g1: ENGLISH_G1_PAGE_SKILLS,
  g2: ENGLISH_G2_PAGE_SKILLS,
  g3: ENGLISH_G3_PAGE_SKILLS,
  g4: ENGLISH_G4_PAGE_SKILLS,
  g5: ENGLISH_G5_PAGE_SKILLS,
  g6: ENGLISH_G6_PAGE_SKILLS,
};

/** @type {Record<string, Record<string, object>>} */
const pack = { grades: {} };

for (const [gradeKey, skills] of Object.entries(grades)) {
  pack.grades[gradeKey] = {};
  for (const [pageKey, entry] of Object.entries(skills)) {
    const e = /** @type {Record<string, string>} */ (entry);
    pack.grades[gradeKey][pageKey] = {
      skillId: e.skillId,
      learningPageId: e.learningPageId || "",
      pageType: e.pageType,
      title: e.titleHe || "",
      description: e.scope || "",
      doNotTranslateFields: ["description"],
      learningLanguage: "en",
    };
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(pack, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath} (${Object.values(pack.grades).reduce((n, g) => n + Object.keys(g).length, 0)} skills)`);
