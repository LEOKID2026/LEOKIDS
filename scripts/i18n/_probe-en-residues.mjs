import fs from "fs";

const s = fs.readFileSync("pages/learning/parent-report.js", "utf8");
const needles = [
  "What the child does well over time",
  "Where the best results were seen",
  "Recommended to maintain",
  "Where it's worth reinforcing",
  "What's worth paying attention",
  "What can be done at home",
  "Goals for the coming week",
  "Recommendation for the child",
  "Example of a mistake",
  "Correct answer",
  "Child's answer",
  "Few questions in the selected",
  "A topic the child is succeeding",
  "similar mistakes",
  "The number of questions in the selected period",
];
for (const n of needles) {
  const i = s.indexOf(n);
  console.log(i >= 0 ? "FOUND" : "MISS", n);
  if (i >= 0) console.log("  ", JSON.stringify(s.slice(Math.max(0, i - 40), i + n.length + 40)));
}
