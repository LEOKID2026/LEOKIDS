import fs from "fs";

function syncReports(loc, slug, keys) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j[slug] = { ...(j[slug] || {}), ...keys };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

syncReports("en", "lib__parent-ui__parent-report-regular-time", {
  zero_minutes: "0 min",
  minutes_short: "{m} min",
});
syncReports("ar-001", "lib__parent-ui__parent-report-regular-time", {
  zero_minutes: "0 دقيقة",
  minutes_short: "{m} دقيقة",
});

syncReports("en", "lib__parent-ui__learning-time-exclusive-breakdown-display", {
  subject_math: "Math",
  subject_geometry: "Geometry",
  subject_english: "English",
  subject_science: "Science",
  subject_history: "History",
  subject_geography: "Geography",
  learning_time_breakdown_line:
    "Learning time breakdown: question practice: {question} min · book reading: {book} min · other active learning: {other} min",
});
syncReports("ar-001", "lib__parent-ui__learning-time-exclusive-breakdown-display", {
  subject_math: "الرياضيات",
  subject_geometry: "الهندسة",
  subject_english: "الإنجليزية",
  subject_science: "العلوم",
  subject_history: "التاريخ",
  subject_geography: "الجغرافيا",
  learning_time_breakdown_line:
    "تفصيل وقت التعلّم: تمرين بالأسئلة: {question} دقيقة · قراءة كتاب: {book} دقيقة · تعلّم نشط آخر: {other} دقيقة",
});

syncReports("en", "pages__learning__parent-report", {
  daily_activity: "Daily activity",
  practice_time_and_questions_by_day:
    "Practice time and questions by day for the selected period",
});
syncReports("ar-001", "pages__learning__parent-report", {
  daily_activity: "النشاط اليومي",
  practice_time_and_questions_by_day: "وقت التمرين والأسئلة حسب اليوم للفترة المحددة",
});

console.log("synced time/daily chrome");
