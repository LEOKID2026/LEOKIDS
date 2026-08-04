/**
 * Wire parent-report chrome + date-range presets for ar-001.
 */
import fs from "fs";

function patchJson(path, mutator) {
  const j = JSON.parse(fs.readFileSync(path, "utf8"));
  mutator(j);
  fs.writeFileSync(path, JSON.stringify(j, null, 2) + "\n");
}

const dateKeysEn = {
  day: "Day",
  week: "Week",
  month: "Month",
  year: "Year",
  custom_dates: "Custom",
};
const dateKeysAr = {
  day: "يوم",
  week: "أسبوع",
  month: "شهر",
  year: "سنة",
  custom_dates: "مخصص",
};

for (const [locale, keys] of [
  ["en", dateKeysEn],
  ["ar-001", dateKeysAr],
]) {
  patchJson(`content-packs/${locale}/global-burn-down/burn-down-index.json`, (j) => {
    j.components__reporting__ReportDateRangeControl = {
      ...(j.components__reporting__ReportDateRangeControl || {}),
      ...keys,
    };
  });
}

const chromeEn = {
  parent_report_title: "📊 Parent Report",
  detailed_report_for_the_period: "Detailed Report for the Period",
  total_time: "Total time",
  overall_accuracy: "Overall accuracy",
  level: "Level",
  level_n: "Level {n}",
  correct_count: "{n} correct",
  questions: "Questions",
  accuracy: "Accuracy %",
  correct: "Correct",
  report_data_status: "Report data status",
  limited_data_in_subjects: "Limited data in subjects: {list}",
  correct_dot_accuracy: "{correct} correct • {accuracy}% accuracy",
  hours_paren: "({n} hours)",
  min_unit: "{n} min",
};
const chromeAr = {
  parent_report_title: "📊 تقرير ولي الأمر",
  detailed_report_for_the_period: "تقرير تفصيلي عن الفترة",
  total_time: "الوقت الإجمالي",
  overall_accuracy: "الدقة الإجمالية",
  level: "المستوى",
  level_n: "المستوى {n}",
  correct_count: "{n} صحيحة",
  questions: "أسئلة",
  accuracy: "الدقة ٪",
  correct: "صحيحة",
  report_data_status: "حالة بيانات التقرير",
  limited_data_in_subjects: "بيانات محدودة في المواد: {list}",
  correct_dot_accuracy: "{correct} صحيحة • دقة {accuracy}%",
  hours_paren: "({n} ساعة)",
  min_unit: "{n} د",
};

for (const [locale, keys] of [
  ["en", chromeEn],
  ["ar-001", chromeAr],
]) {
  const leaf = `content-packs/${locale}/reports/burn-down/pages__learning__parent-report.json`;
  patchJson(leaf, (j) => {
    j.copy = { ...(j.copy || {}), ...keys };
  });
  patchJson(`content-packs/${locale}/reports/burn-down-index.json`, (j) => {
    const key = "pages__learning__parent-report";
    j[key] = { ...(j[key] || {}), ...keys };
  });
}

console.log("packs updated");
