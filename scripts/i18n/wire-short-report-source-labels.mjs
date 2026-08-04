import fs from "fs";

function sync(loc, slug, keys) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j[slug] = { ...(j[slug] || {}), ...keys };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  const leaf = `content-packs/${loc}/reports/burn-down/${slug}.json`;
  let d = { copy: {} };
  if (fs.existsSync(leaf)) d = JSON.parse(fs.readFileSync(leaf, "utf8"));
  d.copy = { ...(d.copy || {}), ...keys };
  fs.writeFileSync(leaf, JSON.stringify(d, null, 2) + "\n");
}

sync("en", "utils__parent-report-language__short-report-source-label", {
  insights_based_on_questions_practiced:
    "Insights based on the questions practiced in the selected period.",
  legacy_version_caution:
    "Some of this information comes from an earlier version of the report - it's worth treating it with caution.",
  not_enough_data_for_clear_insight:
    "There still isn't enough data for a clear insight - it's worth continuing to practice and checking again.",
});
sync("ar-001", "utils__parent-report-language__short-report-source-label", {
  insights_based_on_questions_practiced:
    "ملاحظات استنادًا إلى الأسئلة التي تُمرَّن عليها في الفترة المحددة.",
  legacy_version_caution:
    "بعض هذه المعلومات يأتي من نسخة سابقة من التقرير — يُفضّل التعامل معها بحذر.",
  not_enough_data_for_clear_insight:
    "لا توجد بعد بيانات كافية لملاحظة واضحة — يُفضّل مواصلة التمرين والتحقق مرة أخرى.",
});

sync("en", "utils__parent-report-language__parent-facing-pattern-label", {
  m10_division_buckets:
    "Based on the questions practiced in the selected period, it's worth continuing to practice division and reinforcing the connection to multiplication.",
  m10_multiplication:
    "Based on the questions practiced in the selected period, it's worth continuing to practice the inverse relationship between multiplication and division.",
  m10_thin_fallback:
    "Based on the questions practiced in the selected period, it's worth continuing to practice division and reinforcing the connection to multiplication.",
});
sync("ar-001", "utils__parent-report-language__parent-facing-pattern-label", {
  m10_division_buckets:
    "استنادًا إلى الأسئلة التي تُمرَّن عليها في الفترة المحددة، يُفضّل مواصلة تمرين القسمة وتعزيز الصلة بالضرب.",
  m10_multiplication:
    "استنادًا إلى الأسئلة التي تُمرَّن عليها في الفترة المحددة، يُفضّل مواصلة تمرين العلاقة العكسية بين الضرب والقسمة.",
  m10_thin_fallback:
    "استنادًا إلى الأسئلة التي تُمرَّن عليها في الفترة المحددة، يُفضّل مواصلة تمرين القسمة وتعزيز الصلة بالضرب.",
});

sync("en", "pages__learning__parent-report", {
  minutes_practice_questions_accuracy:
    "{minutes} min practice · {q} questions · {accuracy}% accuracy",
});
sync("ar-001", "pages__learning__parent-report", {
  minutes_practice_questions_accuracy: "{minutes} د تمرين · {q} أسئلة · دقة {accuracy}٪",
});

let s = fs.readFileSync("pages/learning/parent-report.js", "utf8");
const before = s;
s = s.replaceAll(
  "`${formatExclusiveLearningMinutesHe(value)} min`",
  `reportPackCopy("pages__learning__parent-report", "minutes_short", { m: String(formatExclusiveLearningMinutesHe(value)) })`,
);
s = s.replaceAll(
  "`${formatExclusiveLearningMinutesHe(value)} min`,",
  `reportPackCopy("pages__learning__parent-report", "minutes_short", { m: String(formatExclusiveLearningMinutesHe(value)) }),`,
);
s = s.replaceAll(
  "{value} ({formatExclusiveLearningMinutesHe(mins)} min)",
  `{value} ({reportPackCopy("pages__learning__parent-report", "minutes_short", { m: String(formatExclusiveLearningMinutesHe(mins)) })})`,
);
s = s.replaceAll(
  "return [`${value} min`, name];",
  `return [reportPackCopy("pages__learning__parent-report", "minutes_short", { m: String(value) }), name];`,
);
s = s.replaceAll(
  "`${p.minutes} min practice · ${q} questions · ${p.accuracy}% accuracy`",
  `reportPackCopy("pages__learning__parent-report", "minutes_practice_questions_accuracy", { minutes: String(p.minutes), q: String(q), accuracy: String(p.accuracy) })`,
);
if (s !== before) fs.writeFileSync("pages/learning/parent-report.js", s);
console.log("synced short-report + pattern + min labels", s !== before);
