#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../../curriculum/international");
const subjects = ["math", "geometry", "english", "science"];
const grades = ["g1", "g2", "g3", "g4", "g5", "g6"];

let total = 0;
for (const subject of subjects) {
  for (const grade of grades) {
    const file = path.join(root, subject, `${grade}.json`);
    if (!fs.existsSync(file)) {
      console.error(`[curriculum] missing ${subject}/${grade}.json`);
      process.exit(1);
    }
    const rows = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(rows) || rows.length === 0) {
      console.error(`[curriculum] empty pack ${subject}/${grade}`);
      process.exit(1);
    }
    for (const row of rows) {
      for (const key of [
        "grade",
        "subject",
        "topic",
        "skill",
        "difficulty",
        "prerequisites",
        "masteryTarget",
        "contentLocale",
      ]) {
        if (!(key in row)) {
          console.error(`[curriculum] missing ${key} in ${subject}/${grade}`);
          process.exit(1);
        }
      }
      if (row.subject !== subject || row.grade !== grade) {
        console.error(`[curriculum] mismatch in ${subject}/${grade}:`, row.skill);
        process.exit(1);
      }
      total += 1;
    }
  }
}
console.log(`[curriculum] OK — ${total} skills across ${subjects.length} subjects × ${grades.length} grades`);
