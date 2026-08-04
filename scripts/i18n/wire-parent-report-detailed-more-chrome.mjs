import fs from "fs";

const NS = "pages__learning__parent-report-detailed";
const pack = (k) => `reportPackCopy("${NS}", "${k}")`;

function sync(loc, keys) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j[NS] = { ...(j[NS] || {}), ...keys };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

sync("en", {
  overall_accuracy: "Overall accuracy",
  accuracy: "Accuracy",
  short_ideas_for_home: "Short ideas for home",
  direction_for_coming_days: "Direction for the coming days",
  no_data_to_display: "No data to display.",
});
sync("ar-001", {
  overall_accuracy: "الدقة الإجمالية",
  accuracy: "الدقة",
  short_ideas_for_home: "أفكار قصيرة للمنزل",
  direction_for_coming_days: "اتجاه للأيام القادمة",
  no_data_to_display: "لا توجد بيانات للعرض.",
});

for (const file of [
  "pages/learning/parent-report-detailed.js",
  "pages/learning/parent-report-detailed.renderable.jsx",
]) {
  let s = fs.readFileSync(file, "utf8");
  const reps = [
    [">Overall accuracy<", `>{${pack("overall_accuracy")}}<`],
    [">Accuracy<", `>{${pack("accuracy")}}<`],
    ['title="Short ideas for home"', `title={${pack("short_ideas_for_home")}}`],
    ['title="Direction for the coming days"', `title={${pack("direction_for_coming_days")}}`],
    ['"No data to display."', pack("no_data_to_display")],
  ];
  for (const [from, to] of reps) {
    if (!s.includes(from)) {
      console.warn(file, "MISS", from);
      continue;
    }
    s = s.split(from).join(to);
    console.log(file, "ok", from);
  }
  fs.writeFileSync(file, s);
}
console.log("done");
