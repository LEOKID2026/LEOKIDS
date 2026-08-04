/**
 * Agent-1 fix: Reports / Parent Reports burn-down wiring for ar-001 (+ EN authority).
 * No commit. No push.
 */
import fs from "node:fs";

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeJson(p, j) {
  fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`);
}

function upsertLeaf(leafPath, keys) {
  const j = readJson(leafPath);
  if (!j.copy || typeof j.copy !== "object") j.copy = {};
  Object.assign(j.copy, keys);
  writeJson(leafPath, j);
  return j.copy;
}

function upsertIndex(indexPath, slug, keys) {
  const j = readJson(indexPath);
  j[slug] = { ...(j[slug] || {}), ...keys };
  writeJson(indexPath, j);
}

function syncSlug(locale, domain, slug, keys, { nestedIndex = false } = {}) {
  const leaf =
    domain === "reports"
      ? `content-packs/${locale}/reports/burn-down/${slug}.json`
      : `content-packs/${locale}/global-burn-down/${slug}.json`;
  upsertLeaf(leaf, keys);
  const topIndex =
    domain === "reports"
      ? `content-packs/${locale}/reports/burn-down-index.json`
      : `content-packs/${locale}/global-burn-down/burn-down-index.json`;
  upsertIndex(topIndex, slug, keys);
  if (nestedIndex) {
    upsertIndex(
      `content-packs/${locale}/reports/burn-down/burn-down-index.json`,
      slug,
      keys,
    );
  }
  console.log("synced", locale, slug, Object.keys(keys).length, "keys");
}

const detailedEn = {
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

const detailedAr = {
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

syncSlug("en", "reports", "utils__detailed-parent-report", detailedEn, {
  nestedIndex: true,
});
syncSlug("ar-001", "reports", "utils__detailed-parent-report", detailedAr, {
  nestedIndex: true,
});

const trendEn = {
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
};

const trendAr = {
  line_improving:
    "الاتجاه في هذه الفترة: تحسّن — الدقة أعلى في الجزء الأخير من الفترة مما كانت عليه في البداية.",
  line_stable:
    "الاتجاه في هذه الفترة: لا تغيّر يُذكر — ما زال من المفيد تعزيز هذا الموضوع بتمرين قصير.",
  line_declining:
    "الاتجاه في هذه الفترة: يحتاج إلى تعزيز — ظهرت أخطاء أكثر في الجزء الأخير من الفترة، لذا يساعد التمرين القصير.",
  line_insufficient_data: "لا توجد بعد سلسلة تمرين كافية لتحديد اتجاه عبر الزمن.",
  improving: "تحسّن",
  no_significant_change: "لا تغيّر يُذكر",
  needs_reinforcement: "يحتاج إلى تعزيز",
};

syncSlug("en", "reports", "utils__parent-report-topic-trend-v1", trendEn, {
  nestedIndex: true,
});
syncSlug("ar-001", "reports", "utils__parent-report-topic-trend-v1", trendAr, {
  nestedIndex: true,
});

const presenceEn = {
  social_studies_geography: "Social Studies & Geography",
  there_is_some_practice_in_the_selected_period_but_not_yet_enough_to_dra:
    "There is some practice in the selected period, but not yet enough to draw a clear insight. It helps to continue for a few more days and check again.",
  there_is_no_practice_yet_in_the_selected_period:
    "There is no practice yet in the selected period.",
  there_is_limited_data_in_the_selected_period:
    "There is limited data in the selected period.",
  there_is_enough_data_in_the_selected_period_for_a_clear_picture:
    "There is enough data in the selected period for a clear picture.",
  practice_volume_not_yet_enough_in_the_selected_period:
    "Practice volume in the selected period is not yet enough for a clear picture.",
};

const presenceAr = {
  social_studies_geography: "الدراسات الاجتماعية والجغرافيا",
  there_is_some_practice_in_the_selected_period_but_not_yet_enough_to_dra:
    "هناك بعض التمرين في الفترة المحددة، لكنّه لا يكفي بعد لاستخلاص ملاحظة واضحة. يُفضّل المواصلة لبضعة أيام إضافية ثم التحقق مرة أخرى.",
  there_is_no_practice_yet_in_the_selected_period: "لا يوجد تمرين بعد في الفترة المحددة.",
  there_is_limited_data_in_the_selected_period: "البيانات محدودة في الفترة المحددة.",
  there_is_enough_data_in_the_selected_period_for_a_clear_picture:
    "توجد بيانات كافية في الفترة المحددة لصورة واضحة.",
  practice_volume_not_yet_enough_in_the_selected_period:
    "حجم التمرين في الفترة المحددة لا يكفي بعد لصورة واضحة.",
};

syncSlug("en", "global-burn-down", "utils__parent-data-presence", presenceEn);
syncSlug("ar-001", "global-burn-down", "utils__parent-data-presence", presenceAr);

syncSlug(
  "ar-001",
  "reports",
  "utils__parent-report-ui-explain",
  {
    light_parent_involvement: "مشاركة ولي الأمر الخفيفة",
    moderate_parent_involvement: "مشاركة ولي الأمر المعتدلة",
    high_parent_involvement: "مشاركة ولي الأمر العالية",
  },
  { nestedIndex: true },
);

syncSlug(
  "ar-001",
  "reports",
  "utils__parent-report-ui-explain-he",
  {
    light_parent_involvement: "مشاركة أولياء الأمور الخفيفة",
    moderate_parent_involvement: "مشاركة أولياء الأمور المعتدلة",
    high_parent_involvement: "مشاركة أولياء الأمور العالية",
  },
  { nestedIndex: true },
);

console.log("ALL DONE");
