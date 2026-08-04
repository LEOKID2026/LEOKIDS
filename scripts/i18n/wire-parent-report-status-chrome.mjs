import fs from "fs";

const path = "pages/learning/parent-report.js";
let s = fs.readFileSync(path, "utf8");
const slug = "pages__learning__parent-report";
const rpc = (k, vars) =>
  vars
    ? `{reportPackCopy("${slug}", "${k}", ${vars})}`
    : `{reportPackCopy("${slug}", "${k}")}`;

const pairs = [
  ["⚠️ Needs more practice", `⚠️ ${rpc("needs_more_practice").slice(1, -1)}`],
  ["👍 Good", `👍 ${rpc("status_good").slice(1, -1)}`],
  ["💡 Recommendations", `💡 ${rpc("recommendations").slice(1, -1)}`],
  ["Good results in this topic", rpc("good_results_in_this_topic").slice(1, -1)],
];

// Fix JSX text properly — replace full span contents
s = s.replaceAll(
  `<span className="text-red-400 text-xs">⚠️ Needs more practice</span>`,
  `<span className="text-red-400 text-xs">⚠️ {reportPackCopy("${slug}", "needs_more_practice")}</span>`,
);
s = s.replaceAll(
  `<span className="text-yellow-400 text-xs">👍 Good</span>`,
  `<span className="text-yellow-400 text-xs">👍 {reportPackCopy("${slug}", "status_good")}</span>`,
);
s = s.replaceAll(
  `💡 Recommendations`,
  `💡 {reportPackCopy("${slug}", "recommendations")}`,
);
s = s.replaceAll(
  `{x.tierHe || "Good results in this topic"}`,
  `{x.tierHe || reportPackCopy("${slug}", "good_results_in_this_topic")}`,
);
s = s.replaceAll(
  "if (tm > 0) return `${tm} min of practice`;",
  `if (tm > 0) return reportPackCopy("${slug}", "min_of_practice", { tm: String(tm) });`,
);
s = s.replaceAll(
  '{row.questions > 0 ? `${row.questions} questions` : `${row.minutes} min`}',
  `{row.questions > 0 ? reportPackCopy("${slug}", "questions_count", { q: String(row.questions) }) : reportPackCopy("${slug}", "minutes_short", { m: String(row.minutes) })}`,
);

// Insights heading if present
s = s.replaceAll(">Insights<", `>{reportPackCopy("${slug}", "insights")}<`);
s = s.replaceAll("💡 Insights", `💡 {reportPackCopy("${slug}", "insights")}`);

fs.writeFileSync(path, s);

function sync(loc, keys) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j[slug] = { ...(j[slug] || {}), ...keys };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

sync("en", {
  needs_more_practice: "Needs more practice",
  status_good: "Good",
  recommendations: "Recommendations",
  insights: "Insights",
  good_results_in_this_topic: "Good results in this topic",
  min_of_practice: "{tm} min of practice",
  questions_count: "{q} questions",
  minutes_short: "{m} min",
});
sync("ar-001", {
  needs_more_practice: "يحتاج إلى مزيد من التمرين",
  status_good: "جيد",
  recommendations: "توصيات",
  insights: "ملاحظات",
  good_results_in_this_topic: "نتائج جيدة في هذا الموضوع",
  min_of_practice: "{tm} دقيقة من التمرين",
  questions_count: "{q} أسئلة",
  minutes_short: "{m} د",
});
console.log("wired status/recommendations chrome");
