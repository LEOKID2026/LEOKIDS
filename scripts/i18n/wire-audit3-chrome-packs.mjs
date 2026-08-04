/**
 * Expand teacher worksheets + private activity + parent inbox chrome keys (en + ar-001).
 */
import fs from "node:fs";

function upsertSlug(loc, slug, keys) {
  const leafP = `content-packs/${loc}/global-burn-down/${slug}.json`;
  const idxP = `content-packs/${loc}/global-burn-down/burn-down-index.json`;
  let leaf = { copy: {} };
  if (fs.existsSync(leafP)) leaf = JSON.parse(fs.readFileSync(leafP, "utf8"));
  leaf.copy = { ...(leaf.copy || {}), ...keys };
  fs.writeFileSync(leafP, JSON.stringify(leaf, null, 2) + "\n");
  const idx = JSON.parse(fs.readFileSync(idxP, "utf8"));
  idx[slug] = { ...(idx[slug] || {}), ...keys };
  fs.writeFileSync(idxP, JSON.stringify(idx, null, 2) + "\n");
}

const WS_EN = {
  worksheets: "Worksheets",
  back_to_dashboard: "← Back to dashboard",
  subtitle: "All your worksheets — whole class or selected students.",
  create_new: "Create new worksheet",
  loading: "Loading…",
  error_loading: "Error loading",
  network_error: "Network error",
  empty: "No worksheets yet.",
  selected_students: "selected students",
  class_scope: "class",
  manage: "Manage",
  report: "Report",
};

const WS_AR = {
  worksheets: "أوراق عمل",
  back_to_dashboard: "← العودة إلى لوحة التحكم",
  subtitle: "جميع أوراق العمل — للفصل بأكمله أو لتلاميذ مختارين.",
  create_new: "إنشاء ورقة عمل جديدة",
  loading: "جارٍ التحميل…",
  error_loading: "تعذّر التحميل",
  network_error: "خطأ في الشبكة",
  empty: "لا توجد أوراق عمل بعد.",
  selected_students: "تلاميذ مختارون",
  class_scope: "فصل",
  manage: "إدارة",
  report: "تقرير",
};

const ACT_EN = {
  activity_for_selected_private_students: "Activity for selected private students",
  level: "Level",
  select_private_students: "Select private students",
  selected_count: "Selected: {n}",
  loading_students: "Loading students…",
  no_linked_private_students: "No linked private students.",
  select_all: "Select all",
  select_all_grade: "Select all ({grade})",
  clear: "Clear",
  class_label: "Class {grade}",
  multi_grade_warning:
    "⚠ You have students from different grades. You can only send one activity to students in the same grade.",
  activity_locked_to: "Activity locked to {grade}.",
  select_first_to_lock: "Select a first student to lock the grade.",
  activity_settings: "Activity settings",
  title: "Title",
  subject: "Subject",
  grade_for_content: "Grade (for content)",
  derived_from_selected: "— derived from selected students",
  topic: "Topic",
  no_science_topics: "No topics available for this grade in Science.",
  activity_type: "Activity type",
  number_of_questions: "Number of questions",
  time_limit_optional: "Time limit (seconds, optional)",
  required_for_quiz: "Required for quiz",
  blank_no_limit: "Blank = no limit",
  due_date_optional: "Due date (optional)",
  generating_questions: "Generating questions…",
  show_preview: "Show preview",
  create_and_send: "Create and send ({n} students)",
  discussion_question: "Discussion question:",
  questions_count: "{n} questions:",
};

const ACT_AR = {
  activity_for_selected_private_students: "نشاط لتلاميذ خاصين مختارين",
  level: "مستوى",
  select_private_students: "اختر تلاميذ خاصين",
  selected_count: "المحدَّدون: {n}",
  loading_students: "جارٍ تحميل التلاميذ…",
  no_linked_private_students: "لا يوجد تلاميذ خاصون مرتبطون.",
  select_all: "تحديد الكل",
  select_all_grade: "تحديد الكل ({grade})",
  clear: "مسح",
  class_label: "الصف {grade}",
  multi_grade_warning:
    "⚠ لديك تلاميذ من صفوف مختلفة. يمكنك إرسال نشاط واحد فقط لتلاميذ من الصف نفسه.",
  activity_locked_to: "النشاط مقيّد بـ {grade}.",
  select_first_to_lock: "اختر تلميذًا أولًا لتثبيت الصف.",
  activity_settings: "إعدادات النشاط",
  title: "العنوان",
  subject: "المادة",
  grade_for_content: "الصف (للمحتوى)",
  derived_from_selected: "— مستنتج من التلاميذ المحدَّدين",
  topic: "الموضوع",
  no_science_topics: "لا توجد مواضيع متاحة لهذا الصف في العلوم.",
  activity_type: "نوع النشاط",
  number_of_questions: "عدد الأسئلة",
  time_limit_optional: "حدّ زمني (ثوانٍ، اختياري)",
  required_for_quiz: "مطلوب للاختبار",
  blank_no_limit: "فارغ = بلا حد",
  due_date_optional: "تاريخ الاستحقاق (اختياري)",
  generating_questions: "جارٍ إنشاء الأسئلة…",
  show_preview: "عرض معاينة",
  create_and_send: "إنشاء وإرسال ({n} تلاميذ)",
  discussion_question: "سؤال النقاش:",
  questions_count: "{n} أسئلة:",
};

const INBOX_EN = {
  back_to_report: "← Back to report",
  loading: "Loading…",
};

const INBOX_AR = {
  back_to_report: "← العودة إلى التقرير",
  loading: "جارٍ التحميل…",
};

const DETAILED_TIMEOUT_EN = {
  loading_the_report_took_too_long_try_a_shorter_range_or_refresh:
    "Loading the report took too long - try a shorter range or refresh.",
};
const DETAILED_TIMEOUT_AR = {
  loading_the_report_took_too_long_try_a_shorter_range_or_refresh:
    "استغرق تحميل التقرير وقتًا طويلًا — جرّب نطاقًا أقصر أو حدّث الصفحة.",
};

upsertSlug("en", "pages__teacher__worksheets__index", WS_EN);
upsertSlug("ar-001", "pages__teacher__worksheets__index", WS_AR);
upsertSlug("en", "pages__teacher__students__activities__new", ACT_EN);
upsertSlug("ar-001", "pages__teacher__students__activities__new", ACT_AR);
upsertSlug("en", "pages__parent__school-inbox", INBOX_EN);
upsertSlug("ar-001", "pages__parent__school-inbox", INBOX_AR);

function upsertReport(loc, keys) {
  const slug = "pages__learning__parent-report-detailed";
  const leafP = `content-packs/${loc}/reports/burn-down/${slug}.json`;
  const idxP = `content-packs/${loc}/reports/burn-down-index.json`;
  let leaf = { copy: {} };
  if (fs.existsSync(leafP)) leaf = JSON.parse(fs.readFileSync(leafP, "utf8"));
  leaf.copy = { ...(leaf.copy || {}), ...keys };
  fs.writeFileSync(leafP, JSON.stringify(leaf, null, 2) + "\n");
  if (fs.existsSync(idxP)) {
    const idx = JSON.parse(fs.readFileSync(idxP, "utf8"));
    idx[slug] = { ...(idx[slug] || {}), ...keys };
    fs.writeFileSync(idxP, JSON.stringify(idx, null, 2) + "\n");
  }
}
upsertReport("en", DETAILED_TIMEOUT_EN);
upsertReport("ar-001", DETAILED_TIMEOUT_AR);

function syncGame(loc, slug, keys) {
  const indexP = `content-packs/${loc}/games/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(indexP, "utf8"));
  j[slug] = { ...(j[slug] || {}), ...keys };
  fs.writeFileSync(indexP, JSON.stringify(j, null, 2) + "\n");
  const leaf = `content-packs/${loc}/games/burn-down/${slug}.json`;
  let leafObj = { copy: {} };
  if (fs.existsSync(leaf)) leafObj = JSON.parse(fs.readFileSync(leaf, "utf8"));
  leafObj.copy = { ...(leafObj.copy || {}), ...keys };
  fs.writeFileSync(leaf, JSON.stringify(leafObj, null, 2) + "\n");
}

syncGame("en", "components__solo-games__engines__MleoSortShapesEngine", {
  next_item: "Next item:",
  youre_done: "You're done!",
});
syncGame("ar-001", "components__solo-games__engines__MleoSortShapesEngine", {
  next_item: "العنصر التالي:",
  youre_done: "أحسنت! انتهيت!",
});

console.log("chrome packs ok");
