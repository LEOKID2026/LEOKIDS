#!/usr/bin/env node
/**
 * Sync English bookTitle and batch title fields from converted markdown + subject/grade.
 */
import fs from "node:fs";
import path from "node:path";
import { getLearningBookEntry } from "../lib/learning-book/learning-book-catalog.js";
import { parseLearningPageMarkdown } from "../lib/learning-book/parse-learning-page-markdown.js";

const SUBJECTS = ["math", "geometry", "science", "english"];
const GRADES = ["g1", "g2", "g3", "g4", "g5", "g6"];
const SUBJECT_LABEL = { math: "Math", geometry: "Geometry", science: "Science", english: "English" };
const GRADE_LABEL = { g1: "1", g2: "2", g3: "3", g4: "4", g5: "5", g6: "6" };

/** @type {string[]} */
const updated = [];

for (const subject of SUBJECTS) {
  for (const grade of GRADES) {
    const entry = getLearningBookEntry(subject, grade);
    if (!entry || entry.status !== "authored") continue;

    const registryPath = path.join(
      process.cwd(),
      "lib/learning-book",
      `${subject}-${grade}-registry.js`
    );
    if (!fs.existsSync(registryPath)) continue;

    let src = fs.readFileSync(registryPath, "utf8");
    const bookTitle = `${SUBJECT_LABEL[subject]} — Grade ${GRADE_LABEL[grade]}`;

    if (!src.includes("bookTitle:")) {
      src = src.replace(
        /bookTitleHe:\s*"[^"]*"/,
        `bookTitle: "${bookTitle}",\n  bookTitleHe: "${bookTitle}"`
      );
    }

    for (const batch of entry.registry.batches) {
      const firstPageId = batch.pages[0];
      const mdPath = path.join(
        process.cwd(),
        entry.meta.draftsDir,
        `${firstPageId}.md`
      );
      let batchTitle = batch.titleHe;
      if (fs.existsSync(mdPath)) {
        const page = parseLearningPageMarkdown(fs.readFileSync(mdPath, "utf8"), firstPageId);
        batchTitle = page.metadata.title_english || page.displayTitle || batchTitle;
        // Use a shorter batch title: first page topic area heuristic
        if (batch.pages.length > 1) {
          batchTitle = `${batchTitle.split(" — ")[0]} and more`;
        }
      }
      const escaped = batch.titleHe.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(
        `(id:\\s*"${batch.id}"[\\s\\S]*?)titleHe:\\s*"${escaped}"`
      );
      if (re.test(src) && !src.includes(`id: "${batch.id}"`) === false) {
        src = src.replace(re, `$1title: "${batchTitle.replace(/"/g, '\\"')}", titleHe: "${batch.titleHe}"`);
      }
    }

    fs.writeFileSync(registryPath, src, "utf8");
    updated.push(`${subject}/${grade}`);
  }
}

console.log(`Updated registries: ${updated.length}`);
console.log(updated.join(", "));
