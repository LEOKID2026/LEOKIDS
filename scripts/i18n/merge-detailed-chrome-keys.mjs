import fs from "node:fs";

function mergeSlug(loc, slug, keys) {
  const leaf = `content-packs/${loc}/reports/burn-down/${slug}.json`;
  let j = { copy: {} };
  try {
    j = JSON.parse(fs.readFileSync(leaf, "utf8"));
  } catch {
    /* new */
  }
  if (!j.copy) j.copy = {};
  Object.assign(j.copy, keys);
  fs.mkdirSync(`content-packs/${loc}/reports/burn-down`, { recursive: true });
  fs.writeFileSync(leaf, JSON.stringify(j, null, 2) + "\n");
  const idxP = `content-packs/${loc}/reports/burn-down-index.json`;
  const idx = JSON.parse(fs.readFileSync(idxP, "utf8"));
  idx[slug] = { ...(idx[slug] || {}), ...keys };
  fs.writeFileSync(idxP, JSON.stringify(idx, null, 2) + "\n");
}

// Copy renderable chrome into base detailed slug so existing call sites resolve
for (const loc of ["en", "ar-001"]) {
  const idx = JSON.parse(fs.readFileSync(`content-packs/${loc}/reports/burn-down-index.json`, "utf8"));
  const rend = idx["pages__learning__parent-report-detailed.renderable"] || {};
  const base = idx["pages__learning__parent-report"] || {};
  const needed = {
    total_time: rend.total_time || base.total_time,
    overall_accuracy: rend.overall_accuracy || base.overall_accuracy,
    questions: rend.questions || base.questions,
    accuracy: rend.accuracy || base.accuracy,
    subject: rend.subject || base.subject,
    time_min: rend.time_min,
    coverage_by_subject: rend.coverage_by_subject,
    learning_subjects: rend.learning_subjects,
    full_report: rend.full_report,
    short_report: rend.short_report,
    back_to_learning: rend.back_to_learning,
    detailed_recommendations_by_topic: rend.detailed_recommendations_by_topic,
    print_full: rend.print_full,
    print_summary: rend.print_summary,
    report_data_status: base.report_data_status,
    limited_data_in_subjects: base.limited_data_in_subjects,
    minutes_short: loc === "en" ? "{m} min" : "{m} دقيقة",
    learning_time_breakdown_line:
      loc === "en"
        ? "Learning time breakdown: question practice: {q} min · book reading: {b} min · other active learning: {o} min"
        : "تفصيل وقت التعلّم: تمرين بالأسئلة: {q} دقيقة · قراءة كتاب: {b} دقيقة · تعلّم نشط آخر: {o} دقيقة",
  };
  const clean = Object.fromEntries(Object.entries(needed).filter(([, v]) => typeof v === "string" && v));
  mergeSlug(loc, "pages__learning__parent-report-detailed", clean);
}

const narrativeEn = {
  observation_little_1:
    "In {displayName} there's still too little practice in the selected period to know how it's really going.",
  observation_little_2:
    "In {displayName} we're only seeing a few attempts so far - that's okay; we'll add a bit more and come back to it.",
  observation_little_3:
    "In {displayName} there's still little practice in the selected period, so we're keeping a cautious wording.",
  observation_volume_1:
    "In {displayName} in the selected period there are {q} questions, with about {acc}% accuracy.",
  observation_volume_2:
    "In {displayName}, {q} questions were collected this period, with accuracy around {acc}%.",
  observation_volume_3:
    "In {displayName}, {q} questions were collected this period, with average accuracy of about {acc}%.",
  interpretation_we0_1: "It's still too early to set a clear direction here - we'll keep watching the practice.",
  interpretation_we0_2: "It's too early to write a final summary; we'll add a bit more practice and see how it holds.",
  interpretation_we0_3: "There still isn't enough data to set a clear direction - we'll move slowly and carefully.",
};

const narrativeAr = {
  observation_little_1:
    "في {displayName} ما زالت الممارسة قليلة في الفترة المحددة لمعرفة كيف تسير الأمور فعليًا.",
  observation_little_2:
    "في {displayName} ما زلنا نرى محاولات قليلة حتى الآن — لا بأس؛ سنضيف المزيد ونعود إليه.",
  observation_little_3:
    "في {displayName} ما زالت الممارسة قليلة في الفترة المحددة، لذا نستخدم صياغة حذرة.",
  observation_volume_1:
    "في {displayName} خلال الفترة المحددة هناك {q} أسئلة، بدقة تقارب {acc}٪.",
  observation_volume_2:
    "في {displayName}، جُمع {q} أسئلة خلال هذه الفترة، بدقة تقارب {acc}٪.",
  observation_volume_3:
    "في {displayName}، جُمع {q} أسئلة خلال هذه الفترة، بمتوسط دقة يقارب {acc}٪.",
  interpretation_we0_1: "ما زال مبكرًا لتحديد اتجاه واضح هنا — سنواصل متابعة الممارسة.",
  interpretation_we0_2: "ما زال مبكرًا لكتابة ملخص نهائي؛ سنضيف قليلًا من الممارسة ونرى إن كان ذلك يثبت.",
  interpretation_we0_3: "ما زالت البيانات غير كافية لتحديد اتجاه واضح — سنتقدّم ببطء وبحذر.",
};

mergeSlug("en", "utils__contracts__narrative-contract-v1", narrativeEn);
mergeSlug("ar-001", "utils__contracts__narrative-contract-v1", narrativeAr);

console.log("merged chrome + narrative keys");
