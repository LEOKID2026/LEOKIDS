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
  print_export_to_pdf: "🖨️ Print / 📄 Export to PDF",
  back_to_learning: "← Back to learning",
  not_available: "Not available",
  mixed_results_keep_watching: "Mixed results - we'll keep watching",
  system_configuration_error: "System configuration error.",
  mistake_pattern: "Mistake pattern",
});
sync("ar-001", {
  print_export_to_pdf: "🖨️ طباعة / 📄 تصدير إلى PDF",
  back_to_learning: "← العودة إلى التعلم",
  not_available: "غير متوفر",
  mixed_results_keep_watching: "نتائج متباينة — سنواصل المتابعة",
  system_configuration_error: "خطأ في إعدادات النظام.",
  mistake_pattern: "نمط الخطأ",
});
console.log("print/back + residual chrome synced");
