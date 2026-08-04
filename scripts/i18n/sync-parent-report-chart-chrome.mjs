import fs from "fs";

function sync(loc, keys) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j["pages__learning__parent-report"] = {
    ...(j["pages__learning__parent-report"] || {}),
    ...keys,
  };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

sync("en", {
  practice_questions_book_reading_other_active:
    "Practice with questions, book reading, and other active learning",
  practice_time_minutes_full_details:
    "Practice time (minutes) - full details will also show questions and accuracy",
  breakdown: "Breakdown",
});
sync("ar-001", {
  practice_questions_book_reading_other_active:
    "التمرين بالأسئلة، قراءة الكتاب، والتعلّم النشط الآخر",
  practice_time_minutes_full_details:
    "وقت التمرين (بالدقائق) — التفاصيل الكاملة تعرض أيضًا الأسئلة والدقة",
  breakdown: "تفصيل",
  learning_time_breakdown: "تفصيل وقت التعلّم",
  practice_with_questions: "التمرين بالأسئلة",
  other_active_learning: "تعلّم نشط آخر",
});
console.log("chart chrome synced");
