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
  challenges: "Challenges",
  daily_challenge: "Daily challenge",
  weekly_challenge: "Weekly challenge",
  best_score: "Best score: {score}",
  completed: "Completed!",
  achievements: "Achievements",
});
sync("ar-001", {
  challenges: "التحديات",
  daily_challenge: "التحدي اليومي",
  weekly_challenge: "التحدي الأسبوعي",
  best_score: "أفضل نتيجة: {score}",
  completed: "مكتمل!",
  achievements: "الإنجازات",
});
console.log("challenges chrome synced");
