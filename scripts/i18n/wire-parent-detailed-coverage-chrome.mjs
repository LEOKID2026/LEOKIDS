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
  coverage_by_subject: "Coverage by subject",
  subject: "Subject",
  time_min: "Time (min)",
  subjects_limited_data: "Subjects with limited data this period",
  notable_subjects: "Notable subjects",
  coverage: "Coverage",
  time: "Time",
});
sync("ar-001", {
  coverage_by_subject: "التغطية حسب المادة",
  subject: "المادة",
  time_min: "الوقت (دقيقة)",
  subjects_limited_data: "مواد ببيانات محدودة في هذه الفترة",
  notable_subjects: "مواد بارزة",
  coverage: "التغطية",
  time: "الوقت",
});

for (const file of [
  "pages/learning/parent-report-detailed.js",
  "pages/learning/parent-report-detailed.renderable.jsx",
]) {
  let s = fs.readFileSync(file, "utf8");
  const reps = [
    [">Coverage by subject<", `>{${pack("coverage_by_subject")}}<`],
    [">Subject<", `>{${pack("subject")}}<`],
    [">Time (min)<", `>{${pack("time_min")}}<`],
    ["Subjects with limited data this period", `{${pack("subjects_limited_data")}}`],
    [">Notable subjects<", `>{${pack("notable_subjects")}}<`],
  ];
  // also plain text nodes without >
  const more = [
    ["Coverage by subject", `{${pack("coverage_by_subject")}}`],
    ["Notable subjects", `{${pack("notable_subjects")}}`],
  ];
  for (const [from, to] of [...reps, ...more]) {
    if (!s.includes(from)) continue;
    // avoid double-wrapping already packed
    if (from.startsWith(">") || !s.includes(`>{${pack("")}`)) {
      /* ok */
    }
    const safeFrom = from;
    if (s.includes(to)) continue;
    s = s.split(safeFrom).join(to);
    console.log(file, "ok", from.slice(0, 40));
  }
  fs.writeFileSync(file, s);
}
console.log("detailed chrome done");
