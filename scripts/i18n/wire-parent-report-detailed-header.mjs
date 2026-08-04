import fs from "fs";

const PAGE = "pages/learning/parent-report-detailed.js";
const RENDERABLE = "pages/learning/parent-report-detailed.renderable.jsx";
const NS = "pages__learning__parent-report-detailed";
const pack = (k, vars) =>
  vars
    ? `reportPackCopy("${NS}", "${k}", ${vars})`
    : `reportPackCopy("${NS}", "${k}")`;

function wireFile(path) {
  let s = fs.readFileSync(path, "utf8");
  const reps = [
    ["Detailed Report for the Period", `{${pack("detailed_report_for_the_period")}}`],
    ["Detailed parent report - based on the selected dates", `{${pack("detailed_parent_report_based_on_the_selected_dates")}}`],
    ["Date range:", `{${pack("date_range_label")}}`],
    ["Period:", `{${pack("period_label")}}`],
    ['pi.period === "custom" ? "Custom dates" : pi.period === "month" ? "Month" : "Week"',
      `pi.period === "custom" ? ${pack("custom_dates")} : pi.period === "month" ? ${pack("month")} : ${pack("week")}`],
    [">Total time<", `>{${pack("total_time")}}<`],
    [">Questions<", `>{${pack("questions")}}<`],
    ["{payload.overallSnapshot.totalTime} min",
      `{${pack("minutes_short", "{ m: String(payload.overallSnapshot.totalTime) }")}}`],
  ];
  let n = 0;
  for (const [from, to] of reps) {
    if (!s.includes(from)) {
      console.warn(path, "MISS", from.slice(0, 50));
      continue;
    }
    const c = s.split(from).length - 1;
    s = s.split(from).join(to);
    n += c;
    console.log(path, "ok", c, from.slice(0, 40));
  }
  fs.writeFileSync(path, s);
  return n;
}

function sync(loc, keys) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j[NS] = { ...(j[NS] || {}), ...keys };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

sync("en", {
  detailed_report_for_the_period: "Detailed Report for the Period",
  detailed_parent_report_based_on_the_selected_dates:
    "Detailed parent report - based on the selected dates",
  date_range_label: "Date range:",
  period_label: "Period:",
  custom_dates: "Custom dates",
  month: "Month",
  week: "Week",
  total_time: "Total time",
  minutes_short: "{m} min",
});
sync("ar-001", {
  detailed_report_for_the_period: "التقرير المفصّل للفترة",
  detailed_parent_report_based_on_the_selected_dates:
    "تقرير ولي الأمر المفصّل — بناءً على التواريخ المحددة",
  date_range_label: "نطاق التاريخ:",
  period_label: "الفترة:",
  custom_dates: "تواريخ مخصّصة",
  month: "شهر",
  week: "أسبوع",
  total_time: "الوقت الإجمالي",
  minutes_short: "{m} دقيقة",
});

const a = wireFile(PAGE);
const b = wireFile(RENDERABLE);
console.log({ a, b });
