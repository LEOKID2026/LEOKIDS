import fs from "fs";

const path = "pages/learning/parent-report.js";
let s = fs.readFileSync(path, "utf8");
const slug = "pages__learning__parent-report";

const replacements = [
  [
    "Activity by subject (daily)",
    `{reportPackCopy("${slug}", "activity_by_subject_daily")}`,
  ],
  [
    "Number of different topics practiced each day",
    `{reportPackCopy("${slug}", "number_of_different_topics_practiced_each_day")}`,
  ],
  [
    "Summary across six subjects",
    `{reportPackCopy("${slug}", "summary_across_six_subjects")}`,
  ],
  [
    'title: "Math - accuracy by topic"',
    `title: reportPackCopy("${slug}", "math_accuracy_by_topic")`,
  ],
  [
    'title: "Geometry - accuracy by topic"',
    `title: reportPackCopy("${slug}", "geometry_accuracy_by_topic")`,
  ],
  [
    'title: "English - accuracy by topic"',
    `title: reportPackCopy("${slug}", "english_accuracy_by_topic")`,
  ],
  [
    'title: "Science - accuracy by topic"',
    `title: reportPackCopy("${slug}", "science_accuracy_by_topic")`,
  ],
];

for (const [a, b] of replacements) {
  const c = s.split(a).length - 1;
  if (c) {
    s = s.split(a).join(b);
    console.log("replaced", c, a.slice(0, 50));
  } else {
    console.log("MISSING", a.slice(0, 50));
  }
}
fs.writeFileSync(path, s);

function sync(loc, keys) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j[slug] = { ...(j[slug] || {}), ...keys };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

sync("en", {
  activity_by_subject_daily: "Activity by subject (daily)",
  number_of_different_topics_practiced_each_day:
    "Number of different topics practiced each day",
  summary_across_six_subjects: "Summary across six subjects",
  math_accuracy_by_topic: "Math - accuracy by topic",
  geometry_accuracy_by_topic: "Geometry - accuracy by topic",
  english_accuracy_by_topic: "English - accuracy by topic",
  science_accuracy_by_topic: "Science - accuracy by topic",
});
sync("ar-001", {
  activity_by_subject_daily: "النشاط حسب المادة (يومي)",
  number_of_different_topics_practiced_each_day: "عدد المواضيع المختلفة التي تُمرَّن عليها كل يوم",
  summary_across_six_subjects: "ملخص عبر ست مواد",
  math_accuracy_by_topic: "الرياضيات — الدقة حسب الموضوع",
  geometry_accuracy_by_topic: "الهندسة — الدقة حسب الموضوع",
  english_accuracy_by_topic: "الإنجليزية — الدقة حسب الموضوع",
  science_accuracy_by_topic: "العلوم — الدقة حسب الموضوع",
});
console.log("done");
