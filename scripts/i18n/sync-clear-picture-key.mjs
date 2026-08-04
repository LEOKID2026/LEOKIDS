import fs from "fs";

for (const [loc, val] of [
  ["en", "There still isn't enough data for a clear picture from the practice sessions"],
  ["ar-001", "لا توجد بعد بيانات كافية لصورة واضحة من جلسات التمرين"],
]) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j["pages__learning__parent-report"] = {
    ...(j["pages__learning__parent-report"] || {}),
    not_enough_data_for_clear_picture: val,
  };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}
console.log("ok");
