#!/usr/bin/env node
/**
 * Add English bookTitle/title fields to all learning book registries.
 * Keeps legacy *He fields for tooling compatibility but runtime prefers English.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const REGISTRY_DIR = path.join(ROOT, "lib/learning-book");

const SUBJECT_LABEL = {
  math: "Math",
  geometry: "Geometry",
  science: "Science",
  english: "English",
};

const GRADE_NUM = { g1: "1", g2: "2", g3: "3", g4: "4", g5: "5", g6: "6" };

/** @type {Record<string, Record<string, Record<string, string>>>} */
const BATCH_TITLE_EN = {
  math: {
    g1: {
      a: "Number line and counting basics",
      b: "Tens, even/odd, and basic addition",
      c: "Core operations",
      d: "Word problems",
    },
  },
};

function gradeLabel(grade) {
  return `Grade ${GRADE_NUM[grade] || grade}`;
}

function patchRegistryFile(filePath) {
  let src = fs.readFileSync(filePath, "utf8");
  const name = path.basename(filePath);
  const match = name.match(/^(math|geometry|science|english)-g(\d)-registry\.js$/);
  if (!match) return false;

  const subject = match[1];
  const grade = `g${match[2]}`;
  const subjectLabel = SUBJECT_LABEL[subject] || subject;
  const bookTitleEn = `${subjectLabel} Book — ${gradeLabel(grade)}`;

  if (!src.includes("bookTitle:")) {
    src = src.replace(
      /bookTitleHe:\s*"[^"]*"/,
      `bookTitle: "${bookTitleEn}",\n  bookTitleHe: "${
        src.match(/bookTitleHe:\s*"([^"]*)"/)?.[1] || bookTitleEn
      }"`
    );
  }

  src = src.replace(/titleHe:\s*"([^"]*)"/g, (full, heTitle) => {
    const idMatch = src.slice(0, src.indexOf(full)).match(/id:\s*"([^"]+)"/g);
    const batchId = idMatch?.[idMatch.length - 1]?.match(/"([^"]+)"/)?.[1];
    const en =
      BATCH_TITLE_EN[subject]?.[grade]?.[batchId] ||
      heTitle.replace(/[\u0590-\u05FF]/g, "").trim() ||
      heTitle;
    if (full.includes("title:")) return full;
    return `title: "${en.includes('"') ? en.replace(/"/g, '\\"') : en}", titleHe: "${heTitle}"`;
  });

  fs.writeFileSync(filePath, src, "utf8");
  return true;
}

let count = 0;
for (const file of fs.readdirSync(REGISTRY_DIR)) {
  if (patchRegistryFile(path.join(REGISTRY_DIR, file))) count++;
}
console.log(`Patched ${count} registry files with English bookTitle/title fields`);
