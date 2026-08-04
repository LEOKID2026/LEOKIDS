import fs from "node:fs";

const keysEn = {
  subject_math: "Math",
  subject_geometry: "Geometry",
  subject_english: "English",
  subject_science: "Science",
  subject_low_question_count: "{subject} - low question count ({count} questions)",
  subject_good_accuracy_volume:
    "{subject} - {count} questions collected with good accuracy ({accuracy}%)",
  no_standout_subject_yet:
    "There's no standout subject yet based on question count and accuracy - continued practice will make the difference.",
  sparse_subjects_limited_info:
    "In {subjects} there's still limited information - the picture will become clearer after more practice.",
};

const keysAr = {
  subject_math: "الرياضيات",
  subject_geometry: "الهندسة",
  subject_english: "الإنجليزية",
  subject_science: "العلوم",
  subject_low_question_count: "{subject} — عدد أسئلة منخفض ({count} أسئلة)",
  subject_good_accuracy_volume: "{subject} — {count} أسئلة بدقة جيدة ({accuracy}%)",
  no_standout_subject_yet:
    "لا توجد مادة بارزة بعد بناءً على عدد الأسئلة والدقة — الممارسة المستمرة ستُظهر الفرق.",
  sparse_subjects_limited_info:
    "في {subjects} ما زالت المعلومات محدودة — ستتضح الصورة بعد مزيد من الممارسة.",
};

function sync(locale, keys) {
  const leaf = `content-packs/${locale}/reports/burn-down/utils__detailed-parent-report.json`;
  const j = JSON.parse(fs.readFileSync(leaf, "utf8"));
  Object.assign(j.copy, keys);
  fs.writeFileSync(leaf, JSON.stringify(j, null, 2) + "\n");
  const idxP = `content-packs/${locale}/reports/burn-down-index.json`;
  const idx = JSON.parse(fs.readFileSync(idxP, "utf8"));
  const slug = "utils__detailed-parent-report";
  idx[slug] = { ...(idx[slug] || {}), ...keys };
  fs.writeFileSync(idxP, JSON.stringify(idx, null, 2) + "\n");
  console.log(locale, "ok");
}

sync("en", keysEn);
sync("ar-001", keysAr);
