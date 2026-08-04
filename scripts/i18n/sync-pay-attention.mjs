import fs from "node:fs";

const keys = {
  en: {
    what_to_pay_attention_to: "What to pay attention to",
    questions_count_one: "1 question",
    questions_count_other: "{n} questions",
    not_available: "Not available",
  },
  "ar-001": {
    what_to_pay_attention_to: "ما يستحق الانتباه",
    questions_count_one: "سؤال واحد",
    questions_count_other: "{n} أسئلة",
    not_available: "غير متوفر",
  },
};

for (const loc of ["en", "ar-001"]) {
  const slug = "components__parent-report-detailed-surface";
  const leaf = `content-packs/${loc}/reports/burn-down/${slug}.json`;
  const j = JSON.parse(fs.readFileSync(leaf, "utf8"));
  Object.assign(j.copy, keys[loc]);
  fs.writeFileSync(leaf, JSON.stringify(j, null, 2) + "\n");
  const idxP = `content-packs/${loc}/reports/burn-down-index.json`;
  const idx = JSON.parse(fs.readFileSync(idxP, "utf8"));
  idx[slug] = { ...(idx[slug] || {}), ...keys[loc] };
  fs.writeFileSync(idxP, JSON.stringify(idx, null, 2) + "\n");
}
console.log("ok");
