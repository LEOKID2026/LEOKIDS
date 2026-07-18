#!/usr/bin/env node
/**
 * Copy learning-book markdown into locale-aware layout:
 * docs/learning-book/{locale}/{subject}/{grade}/drafts/
 */
import fs from "fs";
import path from "path";

const root = process.cwd();
const subjects = ["math", "geometry", "science", "english"];
const grades = ["g1", "g2", "g3", "g4", "g5", "g6"];
const locale = process.argv[2] || "en";

let copied = 0;
let skipped = 0;

for (const subject of subjects) {
  for (const grade of grades) {
    const legacyDir = path.join(root, "docs", "learning-book", subject, grade, "drafts");
    const targetDir = path.join(root, "docs", "learning-book", locale, subject, grade, "drafts");
    if (!fs.existsSync(legacyDir)) continue;
    fs.mkdirSync(targetDir, { recursive: true });
    for (const file of fs.readdirSync(legacyDir)) {
      if (!file.endsWith(".md")) continue;
      const src = path.join(legacyDir, file);
      const dest = path.join(targetDir, file);
      if (fs.existsSync(dest)) {
        skipped += 1;
        continue;
      }
      fs.copyFileSync(src, dest);
      copied += 1;
    }
  }
}

console.log(JSON.stringify({ locale, copied, skipped }, null, 2));
