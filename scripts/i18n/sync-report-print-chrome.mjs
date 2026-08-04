import fs from "node:fs";

const keys = {
  en: {
    detailed_recommendations_by_topic: "Detailed recommendations by topic",
    print_full: "Print full",
    print_summary: "Print summary",
  },
  "ar-001": {
    detailed_recommendations_by_topic: "توصيات مفصّلة حسب الموضوع",
    print_full: "طباعة كاملة",
    print_summary: "طباعة الملخص",
  },
};

for (const loc of ["en", "ar-001"]) {
  const slug = "pages__learning__parent-report-detailed.renderable";
  const leaf = `content-packs/${loc}/reports/burn-down/${slug}.json`;
  let j = { copy: {} };
  try {
    j = JSON.parse(fs.readFileSync(leaf, "utf8"));
  } catch {
    /* new */
  }
  if (!j.copy) j.copy = {};
  Object.assign(j.copy, keys[loc]);
  // ensure full/short exist on renderable (already present for ar)
  if (loc === "en") {
    j.copy.full_report = j.copy.full_report || "Full report";
    j.copy.short_report = j.copy.short_report || "Short report";
    j.copy.back_to_learning = j.copy.back_to_learning || "Back to learning";
  }
  fs.mkdirSync(`content-packs/${loc}/reports/burn-down`, { recursive: true });
  fs.writeFileSync(leaf, JSON.stringify(j, null, 2) + "\n");
  const idxP = `content-packs/${loc}/reports/burn-down-index.json`;
  const idx = JSON.parse(fs.readFileSync(idxP, "utf8"));
  idx[slug] = { ...(idx[slug] || {}), ...j.copy };
  fs.writeFileSync(idxP, JSON.stringify(idx, null, 2) + "\n");
}
console.log("ok");
