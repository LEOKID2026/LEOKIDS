import fs from "node:fs";
import { EXACT } from "./_de-DE-book-line.mjs";

const f = "docs/learning-book/de-DE/math/g1/drafts/ns_number_line.md";
const t = fs.readFileSync(f, "utf8");
console.log(
  t
    .split(/\r?\n/)
    .filter((l) => /What are we learning|Was lernen|On the next|Auf der nächsten|Number Line|Zahlenstrahl/.test(l))
    .slice(0, 20)
);
const map = JSON.parse(fs.readFileSync("scripts/i18n/_de-DE-book-residue-map.json", "utf8"));
console.log("exact", EXACT["## 1. What are we learning?"]);
console.log("map", map["## 1. What are we learning?"]);
const k = "On the next page we'll check the steps and the answer together.";
console.log("on next exact", EXACT[k]);
console.log("on next map", map[k]);

// Why collector thinks ## 1 is bad: inspect DE line vs EN key
const deLines = t.split(/\r?\n/);
const enLines = fs.readFileSync("docs/learning-book/en/math/g1/drafts/ns_number_line.md", "utf8").split(/\r?\n/);
for (let i = 0; i < deLines.length; i++) {
  if (/What are we learning|Was lernen wir/.test(enLines[i] || "") || /What are we learning|Was lernen wir/.test(deLines[i] || "")) {
    console.log({ i, en: enLines[i], de: deLines[i] });
  }
}
