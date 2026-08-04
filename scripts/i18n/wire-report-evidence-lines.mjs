import fs from "fs";

const slug = "utils__parent-report-language__subject-evidence-policy";
const en = {
  zero_evidence_line: "{subject}: not practiced in the selected period",
  thin_evidence_line:
    "{subject}: {n} questions in the selected period - still limited information; it is worth continuing to practice and checking again",
};
const ar = {
  zero_evidence_line: "{subject}: لم يُمارَس في الفترة المحددة",
  thin_evidence_line:
    "{subject}: {n} أسئلة في الفترة المحددة — المعلومات لا تزال محدودة؛ يستحق مواصلة التمرين والتحقق مرة أخرى",
};

for (const [loc, keys] of [
  ["en", en],
  ["ar-001", ar],
]) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j[slug] = { ...(j[slug] || {}), ...keys };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  fs.writeFileSync(
    `content-packs/${loc}/reports/burn-down/${slug}.json`,
    JSON.stringify({ copy: keys }, null, 2) + "\n"
  );
}

const chrome = {
  stands_out_heading: "What stands out most right now",
  worth_noting: "Worth noting:",
  no_focus_area: "There's no area worth focusing on right now for the selected period.",
  has_volume_no_pattern:
    "There's practice data for the selected period, but there still isn't enough clear basis from the practice to see which topic to focus on - it's worth continuing to practice and checking again afterward.",
};
const chromeAr = {
  stands_out_heading: "ما يبرز أكثر الآن",
  worth_noting: "جدير بالملاحظة:",
  no_focus_area: "لا يوجد مجال يستحق التركيز عليه الآن في الفترة المحددة.",
  has_volume_no_pattern:
    "هناك بيانات تمرين في الفترة المحددة، لكن لا توجد بعد أساس واضح كافٍ من التمرين لتحديد موضوع للتركيز عليه — يستحق مواصلة التمرين والتحقق لاحقًا.",
};

for (const [loc, keys] of [
  ["en", chrome],
  ["ar-001", chromeAr],
]) {
  const key = "pages__learning__parent-report";
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j[key] = { ...(j[key] || {}), ...keys };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
  const leaf = `content-packs/${loc}/reports/burn-down/${key}.json`;
  const lj = JSON.parse(fs.readFileSync(leaf, "utf8"));
  lj.copy = { ...(lj.copy || {}), ...keys };
  fs.writeFileSync(leaf, JSON.stringify(lj, null, 2) + "\n");
}

console.log("ok");
