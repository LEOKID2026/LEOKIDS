import fs from "fs";

function sync(loc, keys) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  const slug = "utils__parent-report-topic-trend-v1";
  j[slug] = { ...(j[slug] || {}), ...keys };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

sync("en", {
  line_improving:
    "Trend for this period: improving - accuracy is higher in the later part of the period than at the start.",
  line_stable:
    "Trend for this period: no significant change - it still helps to reinforce this topic with short practice.",
  line_declining:
    "Trend for this period: needs reinforcement - there were more mistakes in the later part of the period, so short practice would help.",
  line_insufficient_data:
    "There still isn't enough of a practice streak to identify a trend over time.",
  improving: "improving",
  no_significant_change: "no significant change",
  needs_reinforcement: "needs reinforcement",
});
sync("ar-001", {
  line_improving:
    "الاتجاه في هذه الفترة: تحسّن — الدقة أعلى في الجزء الأخير من الفترة مما كانت عليه في البداية.",
  line_stable:
    "الاتجاه في هذه الفترة: لا تغيّر يُذكر — ما زال من المفيد تعزيز هذا الموضوع بتمرين قصير.",
  line_declining:
    "الاتجاه في هذه الفترة: يحتاج إلى تعزيز — ظهرت أخطاء أكثر في الجزء الأخير من الفترة، لذا يساعد التمرين القصير.",
  line_insufficient_data:
    "لا توجد بعد سلسلة تمرين كافية لتحديد اتجاه عبر الزمن.",
  improving: "تحسّن",
  no_significant_change: "لا تغيّر يُذكر",
  needs_reinforcement: "يحتاج إلى تعزيز",
});
console.log("trend lines synced");
