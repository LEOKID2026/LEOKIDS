/**
 * Apply pre-translated English markdown to a math learning book page.
 * Usage: node scripts/apply-math-en-page.mjs <grade> <pageId> <contentFile>
 */
import fs from "fs";
import path from "path";

const [grade, pageId, contentFile] = process.argv.slice(2);
if (!grade || !pageId || !contentFile) {
  console.error("Usage: node scripts/apply-math-en-page.mjs <grade> <pageId> <contentFile>");
  process.exit(1);
}

const target = path.join("docs/learning-book/math", grade, "drafts", `${pageId}.md`);
fs.writeFileSync(target, fs.readFileSync(contentFile, "utf8"), "utf8");
console.log(`Wrote ${target}`);
