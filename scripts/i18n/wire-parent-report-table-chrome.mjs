import fs from "fs";

const slug = "pages__learning__parent-report";
const insightSlug = "components__ParentReportInsight";
const rpc = (key) => `{reportPackCopy("${slug}", "${key}")}`;

const replacements = [
  [">Operation<", `>${rpc("operation")}<`],
  [">Level<", `>${rpc("level")}<`],
  [">Grade<", `>${rpc("grade")}<`],
  [">Source<", `>${rpc("source")}<`],
  [">Last date<", `>${rpc("last_date")}<`],
  [">Time<", `>${rpc("time")}<`],
  [">Correct<", `>${rpc("correct")}<`],
  [">Accuracy<", `>${rpc("accuracy_col")}<`],
  [">Status<", `>${rpc("status")}<`],
  [">Topic<", `>${rpc("topic")}<`],
  ["Source:</span>", `${rpc("source")}:</span>`],
  ["Last date:</span>", `${rpc("last_date")}:</span>`],
  ["Time:</span>", `${rpc("time")}:</span>`],
  ["Accuracy:</span>", `${rpc("accuracy_col")}:</span>`],
  ["Level:</span>", `${rpc("level")}:</span>`],
  ["Grade:</span>", `${rpc("grade")}:</span>`],
  ["Correct:</span>", `${rpc("correct")}:</span>`],
  ["Status:</span>", `${rpc("status")}:</span>`],
  ["🧮 Math progress", `{reportPackCopy("${slug}", "math_progress")}`],
  ["Geometry progress", `{reportPackCopy("${slug}", "geometry_progress")}`],
  ["English progress", `{reportPackCopy("${slug}", "english_progress")}`],
  ["Science progress", `{reportPackCopy("${slug}", "science_progress")}`],
];

let s = fs.readFileSync("pages/learning/parent-report.js", "utf8");
let n = 0;
for (const [a, b] of replacements) {
  const c = s.split(a).length - 1;
  if (c) {
    s = s.split(a).join(b);
    n += c;
    console.log("replaced", c, a.slice(0, 40));
  }
}
fs.writeFileSync("pages/learning/parent-report.js", s);
console.log("total", n);

let insight = fs.readFileSync("components/ParentReportInsight.jsx", "utf8");
const ir = [
  ["What's going well", `{reportPackCopy("${insightSlug}", "whats_going_well")}`],
  ["Areas to strengthen", `{reportPackCopy("${insightSlug}", "areas_to_strengthen")}`],
  ["Home tips", `{reportPackCopy("${insightSlug}", "home_tips")}`],
];
for (const [a, b] of ir) {
  const c = insight.split(a).length - 1;
  if (c) {
    insight = insight.split(a).join(b);
    console.log("insight", c, a);
  }
}
fs.writeFileSync("components/ParentReportInsight.jsx", insight);

// Sync pack keys
function sync(loc, slugName, keys) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j[slugName] = { ...(j[slugName] || {}), ...keys };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  const leaf = `content-packs/${loc}/reports/burn-down/${slugName}.json`;
  let data = { copy: {} };
  if (fs.existsSync(leaf)) data = JSON.parse(fs.readFileSync(leaf, "utf8"));
  data.copy = { ...(data.copy || {}), ...keys };
  fs.writeFileSync(leaf, JSON.stringify(data, null, 2) + "\n");
}

const pageEn = {
  operation: "Operation",
  grade: "Grade",
  source: "Source",
  last_date: "Last date",
  time: "Time",
  correct: "Correct",
  accuracy_col: "Accuracy",
  status: "Status",
  topic: "Topic",
  math_progress: "🧮 Math progress",
  geometry_progress: "Geometry progress",
  english_progress: "English progress",
  science_progress: "Science progress",
};
const pageAr = {
  operation: "العملية",
  grade: "الصف",
  source: "المصدر",
  last_date: "آخر تاريخ",
  time: "الوقت",
  correct: "صحيحة",
  accuracy_col: "الدقة",
  status: "الحالة",
  topic: "الموضوع",
  math_progress: "🧮 تقدم الرياضيات",
  geometry_progress: "تقدم الهندسة",
  english_progress: "تقدم الإنجليزية",
  science_progress: "تقدم العلوم",
};
const insightEn = {
  whats_going_well: "What's going well",
  areas_to_strengthen: "Areas to strengthen",
  home_tips: "Home tips",
};
const insightAr = {
  whats_going_well: "ما يسير على ما يرام",
  areas_to_strengthen: "مجالات للتعزيز",
  home_tips: "نصائح للمنزل",
};

sync("en", slug, pageEn);
sync("ar-001", slug, pageAr);
sync("en", insightSlug, insightEn);
sync("ar-001", insightSlug, insightAr);
console.log("packs synced");
