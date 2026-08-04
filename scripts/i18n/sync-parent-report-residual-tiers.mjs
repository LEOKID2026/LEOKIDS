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

const en = {
  recurring_mistake_pattern: "Recurring mistake pattern",
  in_this_topic: "In this topic",
  tier_needs_reinforcement: "Right now practice suggests this could use reinforcement",
  tier_needs_more_practice: "Looks like this could use more practice",
  tier_succeeding_now: "A topic the child is succeeding in right now",
  tier_strong_now: "A strong topic right now",
  tier_does_well_over_time: "What the child does well over time",
  tier_consistency: "Consistency",
  tier_still_strengthening: "A topic still strengthening",
  footnote_info_volume_next_step:
    "The amount of information helps decide how carefully to move to the next step.",
  teacher_sign_in_required: "Teacher sign-in is required - sign in again and try again.",
  report_could_not_be_built: "The report could not be built from the data received from the server.",
  report_load_timeout: "Loading the report took too long - try a shorter range or refresh.",
  no_questions_answered_period: "No questions answered in this period",
  not_practiced_subject_period: "Not practiced in this subject for the selected period",
  not_practiced_topic_period: "Not practiced in this topic for the selected period",
  subject_math: "Math",
  subject_geometry: "Geometry",
  subject_english: "English",
  subject_science: "Science",
};

const ar = {
  recurring_mistake_pattern: "نمط خطأ متكرر",
  in_this_topic: "في هذا الموضوع",
  tier_needs_reinforcement: "تشير الممارسة الآن إلى أن هذا يحتاج تعزيزًا",
  tier_needs_more_practice: "يبدو أن هذا يحتاج إلى مزيد من التمرين",
  tier_succeeding_now: "موضوع ينجح فيه الطفل الآن",
  tier_strong_now: "موضوع قوي الآن",
  tier_does_well_over_time: "ما يتقنه الطفل بمرور الوقت",
  tier_consistency: "ثبات الأداء",
  tier_still_strengthening: "موضوع ما زال يتعزز",
  footnote_info_volume_next_step:
    "حجم المعلومات يساعد على تحديد مدى الحذر عند الانتقال إلى الخطوة التالية.",
  teacher_sign_in_required: "تسجيل دخول المعلّم مطلوب — سجّل الدخول مجددًا وحاول مرة أخرى.",
  report_could_not_be_built: "تعذّر بناء التقرير من البيانات الواردة من الخادم.",
  report_load_timeout: "استغرق تحميل التقرير وقتًا طويلًا — جرّب نطاقًا أقصر أو حدّث الصفحة.",
  no_questions_answered_period: "لم تُجب أي أسئلة في هذه الفترة",
  not_practiced_subject_period: "لم يُتمرَّن على هذه المادة في الفترة المحددة",
  not_practiced_topic_period: "لم يُتمرَّن على هذا الموضوع في الفترة المحددة",
  subject_math: "الرياضيات",
  subject_geometry: "الهندسة",
  subject_english: "الإنجليزية",
  subject_science: "العلوم",
};

sync("en", en);
sync("ar-001", ar);

// Fix breakdown_by_subject family (division/topic calque → distribution/subject)
function fixBreakdown(loc, value) {
  for (const file of [
    `content-packs/${loc}/reports/burn-down-index.json`,
    `content-packs/${loc}/global-burn-down/burn-down-index.json`,
  ]) {
    if (!fs.existsSync(file)) continue;
    const j = JSON.parse(fs.readFileSync(file, "utf8"));
    let n = 0;
    for (const ns of Object.keys(j)) {
      if (j[ns] && typeof j[ns] === "object" && "breakdown_by_subject" in j[ns]) {
        j[ns].breakdown_by_subject = value;
        n++;
      }
    }
    fs.writeFileSync(file, JSON.stringify(j, null, 2) + "\n");
    console.log(file, "breakdown_by_subject patches", n);
  }
}
fixBreakdown("en", "Breakdown by subject");
fixBreakdown("ar-001", "التوزيع حسب المادة");

// Geometry area labels in books
const booksUi = "content-packs/ar-001/books/ui.json";
if (fs.existsSync(booksUi)) {
  const j = JSON.parse(fs.readFileSync(booksUi, "utf8"));
  const walk = (o) => {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string") {
        if (k.includes("area") || /منطقة (المربع|المثلث|الدائرة|متوازي|شبه)/.test(v)) {
          o[k] = v
            .replace(/^منطقة /, "مساحة ")
            .replace(/منطقة متوازي الأضلاع/, "مساحة متوازي الأضلاع")
            .replace(/منطقة شبه منحرف/, "مساحة شبه المنحرف");
        }
      } else walk(v);
    }
  };
  walk(j);
  fs.writeFileSync(booksUi, JSON.stringify(j, null, 2) + "\n");
  console.log("books ui area terms patched");
}

const diag = "content-packs/ar-001/learning/diagnostic-labels.json";
if (fs.existsSync(diag)) {
  const j = JSON.parse(fs.readFileSync(diag, "utf8"));
  if (j.area === "منطقة") j.area = "مساحة";
  if (j.labels && j.labels.area === "منطقة") j.labels.area = "مساحة";
  // common shapes
  for (const [k, v] of Object.entries(j)) {
    if (typeof v === "string" && /^منطقة /.test(v) && /مربع|مثلث|دائرة|مستطيل/.test(v)) {
      j[k] = v.replace(/^منطقة /, "مساحة ");
    }
  }
  if (j.topics && typeof j.topics === "object") {
    for (const [k, v] of Object.entries(j.topics)) {
      if (typeof v === "string" && /^منطقة /.test(v)) j.topics[k] = v.replace(/^منطقة /, "مساحة ");
    }
  }
  fs.writeFileSync(diag, JSON.stringify(j, null, 2) + "\n");
  console.log("diagnostic-labels area patched");
}

console.log("parent-report residual keys synced");
