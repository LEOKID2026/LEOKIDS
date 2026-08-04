import fs from "node:fs";

const keysEn = {
  its_better_to_reinforce_the_current_topic_first:
    "It's better to reinforce the current topic first.",
  whats_working_well: "What's working well",
  what_to_avoid_right_now: "What to avoid right now",
  ready_to_advance: "Ready to advance?",
};

const keysAr = {
  its_better_to_reinforce_the_current_topic_first: "من الأفضل تعزيز الموضوع الحالي أولًا.",
  whats_working_well: "ما يسير بشكل جيد",
  what_to_avoid_right_now: "ما يُفضَّل تجنّبه الآن",
  ready_to_advance: "هل يمكن التقدّم؟",
};

for (const loc of ["en", "ar-001"]) {
  const keys = loc === "en" ? keysEn : keysAr;
  const leaf = `content-packs/${loc}/reports/burn-down/components__parent-report-detailed-surface.json`;
  const j = JSON.parse(fs.readFileSync(leaf, "utf8"));
  Object.assign(j.copy, keys);
  fs.writeFileSync(leaf, JSON.stringify(j, null, 2) + "\n");
  const idxP = `content-packs/${loc}/reports/burn-down-index.json`;
  const idx = JSON.parse(fs.readFileSync(idxP, "utf8"));
  const slug = "components__parent-report-detailed-surface";
  idx[slug] = { ...(idx[slug] || {}), ...keys };
  fs.writeFileSync(idxP, JSON.stringify(idx, null, 2) + "\n");
  console.log(loc, "ok");
}
