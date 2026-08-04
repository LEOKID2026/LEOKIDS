import fs from "node:fs";

function upsertLeafAndIndex(locale, family, slug, keys) {
  const leaf = `content-packs/${locale}/${family}/burn-down/${slug}.json`;
  const idxP = `content-packs/${locale}/${family}/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(leaf, "utf8"));
  j.copy = { ...(j.copy || {}), ...keys };
  fs.writeFileSync(leaf, JSON.stringify(j, null, 2) + "\n");
  const idx = JSON.parse(fs.readFileSync(idxP, "utf8"));
  idx[slug] = { ...(idx[slug] || {}), ...keys };
  fs.writeFileSync(idxP, JSON.stringify(idx, null, 2) + "\n");
  console.log(locale, slug, "ok");
}

upsertLeafAndIndex("en", "reports", "components__parent-report-detailed-surface", {
  total_learning_time: "Total learning time",
  questions_answered: "Questions answered",
  minutes_short: "{m} min",
  learning_time_breakdown: "Learning time breakdown",
  breakdown_by_subject: "Breakdown by subject",
  subject: "Subject",
});

upsertLeafAndIndex("ar-001", "reports", "components__parent-report-detailed-surface", {
  total_learning_time: "إجمالي وقت التعلم",
  questions_answered: "أسئلة تمت الإجابة عنها",
  minutes_short: "{m} دقيقة",
  learning_time_breakdown: "تقسيم وقت التعلم",
  breakdown_by_subject: "التوزيع حسب المادة",
  subject: "المادة",
  status: "الحالة",
});

upsertLeafAndIndex("en", "games", "lib__solo-games__solo-game-registry", {
  difficulty_easy: "Easy",
  difficulty_medium: "Medium",
  difficulty_hard: "Hard",
});

upsertLeafAndIndex("ar-001", "games", "lib__solo-games__solo-game-registry", {
  difficulty_easy: "سهل",
  difficulty_medium: "متوسط",
  difficulty_hard: "صعب",
});

upsertLeafAndIndex("en", "games", "components__solo-games__engines__MleoSortShapesEngine", {
  color_red: "Red",
  color_orange: "Orange",
  color_blue: "Blue",
  color_purple: "Purple",
  color_yellow: "Yellow",
  color_green: "Green",
});

upsertLeafAndIndex("ar-001", "games", "components__solo-games__engines__MleoSortShapesEngine", {
  color_red: "أحمر",
  color_orange: "برتقالي",
  color_blue: "أزرق",
  color_purple: "بنفسجي",
  color_yellow: "أصفر",
  color_green: "أخضر",
});
