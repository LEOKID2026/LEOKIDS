import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function loadIndex(loc) {
  const p = path.join(ROOT, "content-packs", loc, "reports", "burn-down-index.json");
  return { p, j: JSON.parse(fs.readFileSync(p, "utf8")) };
}
function saveIndex(p, j) {
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}
function ensureLeaf(loc, slug, keys) {
  const leaf = path.join(ROOT, "content-packs", loc, "reports", "burn-down", `${slug}.json`);
  let data = { copy: {} };
  if (fs.existsSync(leaf)) data = JSON.parse(fs.readFileSync(leaf, "utf8"));
  if (!data.copy) data.copy = {};
  Object.assign(data.copy, keys);
  fs.mkdirSync(path.dirname(leaf), { recursive: true });
  fs.writeFileSync(leaf, JSON.stringify(data, null, 2) + "\n");
}

const packs = {
  "utils__parent-report-insights__normalize-parent-facing-labels": {
    en: {
      subject: "Subject",
      topic: "Topic",
      subject_math: "Math",
      subject_geometry: "Geometry",
      subject_english: "English",
      subject_science: "Science",
      ratio: "Ratio",
      scale: "Scale",
      area: "Area",
    },
    ar: {
      subject: "مادة",
      topic: "موضوع",
      subject_math: "الرياضيات",
      subject_geometry: "الهندسة",
      subject_english: "الإنجليزية",
      subject_science: "العلوم",
      ratio: "النسبة",
      scale: "المقياس",
      area: "المساحة",
    },
  },
  "utils__parent-report-output-integrity__row-display-label-context": {
    en: {
      topic: "Topic",
      unavailable: "Unavailable",
      above_registered_grade: "Above registered grade",
      below_registered_grade: "Below registered grade",
      at_registered_grade_level: "At registered grade level",
      outside_the_registered_grade_band: "Outside the registered grade band",
      topic_grade_title: "{topic} - Grade {grade}",
    },
    ar: {
      topic: "موضوع",
      unavailable: "غير متوفر",
      above_registered_grade: "فوق الصف المسجّل",
      below_registered_grade: "دون الصف المسجّل",
      at_registered_grade_level: "في مستوى الصف المسجّل",
      outside_the_registered_grade_band: "خارج نطاق الصف المسجّل",
      topic_grade_title: "{topic} - الصف {grade}",
    },
  },
  "lib__parent-ui__parent-report-regular-display": {
    en: {
      not_available: "Not available",
      topic_colon_detail: "{topic}: {detail}",
      in_topic_home_tip: "In {topic}: {tip}",
      summary_stable_with_focus:
        "This report shows relatively stable practice, but there are a few topics worth paying attention to. {strength} looks more stable, while {focus} shows recurring mistakes.",
      summary_focus_only: "This report has a few topics worth paying attention to: {focus}.",
      summary_stable_only: "This report shows relatively stable practice, mainly in {strength}.",
      topic_stable_line: "{topic}: practice looks stable - {q} questions, {acc}% accuracy.",
    },
    ar: {
      not_available: "غير متوفر",
      topic_colon_detail: "{topic}: {detail}",
      in_topic_home_tip: "في {topic}: {tip}",
      summary_stable_with_focus:
        "يُظهر هذا التقرير تمرينًا مستقرًا نسبيًا، لكن هناك مواضيع قليلة تستحق الانتباه. يبدو {strength} أكثر استقرارًا، بينما يُظهر {focus} أخطاء متكررة.",
      summary_focus_only: "يحتوي هذا التقرير على مواضيع قليلة تستحق الانتباه: {focus}.",
      summary_stable_only: "يُظهر هذا التقرير تمرينًا مستقرًا نسبيًا، خاصة في {strength}.",
      topic_stable_line: "{topic}: يبدو التمرين مستقرًا — {q} أسئلة، بدقة {acc}٪.",
    },
  },
  "lib__parent-ui__parent-report-approved-copy": {
    en: {
      this_topic: "this topic",
      question_singular: "question",
      question_plural: "questions",
      questions_answered: "{q} {questions} answered.",
      questions_answered_with_accuracy: "{q} {questions} answered, with {acc}% accuracy.",
      few_questions_in_topic_early:
        "There are only a few questions in {topic} so far, so it's still too early to draw a strong conclusion.",
      topic_stable_strength: "{title}: practice looks stable - {q} questions, {acc}% accuracy.",
      grade_word_n: "Grade {grade}",
      some_mistakes_repeat_same_type: "Some mistakes repeat in the same type of question.",
      recurring_mistakes_follow_method:
        "There are recurring mistakes in this practice - it helps to follow the solving method together.",
      no_clear_pattern_review_method:
        "There isn't one clear mistake pattern yet, but it helps to go over the solving method together, not just the final answer.",
      in_topic_recurring_mistakes: "In {topic}, there are recurring mistakes worth noticing.",
      topic_recurring_mistakes_focus: "{topic}: there are recurring mistakes worth noticing.",
      fractions_numerator_only_prominent:
        "In {topic}, a recurring mistake shows up: the child tends to compare fractions using only the top number, without checking the overall size of the fraction.",
      fractions_numerator_only_focus:
        "The child tends to compare fractions using only the top number, without checking the overall size of the fraction.",
      fractions_numerator_only_meaning:
        "The recurring mistake is comparing by the top number only - the child doesn't always check the overall size of the fraction.",
      fractions_numerator_only_home:
        "Ask them to explain why one fraction is bigger than another, rather than only looking at the top number.",
      wrong_pairs_prominent:
        "In {topic}, the same specific problems keep coming up wrong. This means the issue isn't the whole times-table, just a few pairs worth reinforcing.",
      wrong_pairs_focus:
        "The same specific fact pairs keep coming up wrong - it helps to reinforce exactly those pairs.",
      wrong_pairs_meaning:
        "The same multiplication pairs keep coming up wrong. It helps to reinforce those specific pairs rather than redoing everything from scratch.",
      rounding_prominent:
        "In {topic}, there's some confusion about rounding numbers: when to round up and when to keep or round down.",
      rounding_focus: "There's some confusion about rounding - when to round up and when to round down.",
      rounding_meaning: "There's some confusion about rounding - when to round up and when to round down.",
      rounding_home:
        "Ask the child to explain which digit they're rounding by, and check whether the result makes sense.",
      reverse_op_prominent:
        "In {topic}, the child sometimes works in the opposite direction - adding or moving forward instead of decreasing the number.",
      reverse_op_focus:
        "The child sometimes works in the opposite direction - adding or moving forward instead of decreasing the number.",
      reverse_op_meaning:
        "The child sometimes works in the opposite direction - adding or moving forward instead of decreasing the number.",
      partial_comparison_prominent:
        "In {topic}, the child seems to use only part of the information in the text, rather than comparing all the needed details.",
      partial_comparison_focus:
        "The child seems to use only part of the information in the text, rather than comparing all the needed details.",
      partial_comparison_meaning:
        "It looks like the child uses only part of the information in the text, rather than comparing all the needed details.",
    },
    ar: {
      this_topic: "هذا الموضوع",
      question_singular: "سؤال",
      question_plural: "أسئلة",
      questions_answered: "أُجيب عن {q} {questions}.",
      questions_answered_with_accuracy: "أُجيب عن {q} {questions}، بدقة {acc}٪.",
      few_questions_in_topic_early:
        "لا يوجد سوى عدد قليل من الأسئلة في {topic} حتى الآن، لذلك لا يزال من المبكر استخلاص نتيجة قوية.",
      topic_stable_strength: "{title}: يبدو التمرين مستقرًا — {q} أسئلة، بدقة {acc}٪.",
      grade_word_n: "الصف {grade}",
      some_mistakes_repeat_same_type: "تتكرر بعض الأخطاء في النوع نفسه من الأسئلة.",
      recurring_mistakes_follow_method:
        "توجد أخطاء متكررة في هذا التمرين — من المفيد متابعة طريقة الحل معًا.",
      no_clear_pattern_review_method:
        "لا يظهر بعد نمط خطأ واضح واحد، لكن من المفيد مراجعة طريقة الحل معًا وليس الإجابة النهائية فقط.",
      in_topic_recurring_mistakes: "في {topic}، توجد أخطاء متكررة تستحق الانتباه.",
      topic_recurring_mistakes_focus: "{topic}: توجد أخطاء متكررة تستحق الانتباه.",
      fractions_numerator_only_prominent:
        "في {topic}، يظهر خطأ متكرر: يميل الطفل إلى مقارنة الكسور باستخدام الرقم العلوي فقط، دون التحقق من حجم الكسر ككل.",
      fractions_numerator_only_focus:
        "يميل الطفل إلى مقارنة الكسور باستخدام الرقم العلوي فقط، دون التحقق من حجم الكسر ككل.",
      fractions_numerator_only_meaning:
        "الخطأ المتكرر هو المقارنة بالرقم العلوي فقط — لا يتحقق الطفل دائمًا من حجم الكسر ككل.",
      fractions_numerator_only_home:
        "اطلب منه أن يشرح لماذا كسر أكبر من آخر، بدل الاكتفاء بالنظر إلى الرقم العلوي.",
      wrong_pairs_prominent:
        "في {topic}، تتكرر الأخطاء في مسائل محددة. هذا يعني أن المشكلة ليست في جدول الضرب كله، بل في أزواج قليلة تستحق التعزيز.",
      wrong_pairs_focus: "تتكرر الأخطاء في الأزواج نفسها — من المفيد تعزيز تلك الأزواج تحديدًا.",
      wrong_pairs_meaning:
        "تتكرر الأخطاء في أزواج الضرب نفسها. من المفيد تعزيز تلك الأزواج بدل إعادة كل شيء من البداية.",
      rounding_prominent:
        "في {topic}، يوجد بعض الالتباس حول تقريب الأعداد: متى تُقرَّب لأعلى ومتى تُبقى أو تُقرَّب لأسفل.",
      rounding_focus: "يوجد بعض الالتباس حول التقريب — متى لأعلى ومتى لأسفل.",
      rounding_meaning: "يوجد بعض الالتباس حول التقريب — متى لأعلى ومتى لأسفل.",
      rounding_home:
        "اطلب من الطفل أن يشرح أي رقم يعتمد عليه في التقريب، ويتحقق مما إذا كانت النتيجة منطقية.",
      reverse_op_prominent:
        "في {topic}، يعمل الطفل أحيانًا في الاتجاه المعاكس — يضيف أو يتقدم بدل إنقاص العدد.",
      reverse_op_focus: "يعمل الطفل أحيانًا في الاتجاه المعاكس — يضيف أو يتقدم بدل إنقاص العدد.",
      reverse_op_meaning: "يعمل الطفل أحيانًا في الاتجاه المعاكس — يضيف أو يتقدم بدل إنقاص العدد.",
      partial_comparison_prominent:
        "في {topic}، يبدو أن الطفل يستخدم جزءًا فقط من معلومات النص، بدل مقارنة كل التفاصيل المطلوبة.",
      partial_comparison_focus:
        "يبدو أن الطفل يستخدم جزءًا فقط من معلومات النص، بدل مقارنة كل التفاصيل المطلوبة.",
      partial_comparison_meaning:
        "يبدو أن الطفل يستخدم جزءًا فقط من معلومات النص، بدل مقارنة كل التفاصيل المطلوبة.",
    },
  },
  "utils__parent-report-language__parent-report-display-labels": {
    en: {
      subject_math: "Math",
      subject_geometry: "Geometry",
      subject_english: "English",
      subject_science: "Science",
      unknown: "Unknown",
      activity_subject_grade: "{base} - {subject} grade {grade}",
      speed: "Speed",
      quiz: "Quiz",
    },
    ar: {
      subject_math: "الرياضيات",
      subject_geometry: "الهندسة",
      subject_english: "الإنجليزية",
      subject_science: "العلوم",
      unknown: "غير معروف",
      activity_subject_grade: "{base} - {subject} الصف {grade}",
      speed: "السرعة",
      quiz: "اختبار",
    },
  },
};

for (const loc of ["en", "ar-001"]) {
  const { p, j } = loadIndex(loc);
  const side = loc === "en" ? "en" : "ar";
  for (const [slug, sides] of Object.entries(packs)) {
    const keys = sides[side];
    j[slug] = { ...(j[slug] || {}), ...keys };
    ensureLeaf(loc, slug, keys);
  }
  saveIndex(p, j);
  console.log("synced", loc);
}

const { bindReportPackLocale, reportPackCopy } = await import("../../lib/reports/report-pack-copy.js");
const { getTopicDisplayNameHe, getSubjectDisplayNameHe } = await import(
  "../../utils/parent-report-insights/normalize-parent-facing-labels.js"
);
bindReportPackLocale("ar-001");
console.log("vocab", getTopicDisplayNameHe("english", "vocabulary"));
console.log("subject", getSubjectDisplayNameHe("english"));
console.log(
  "title",
  reportPackCopy("utils__parent-report-output-integrity__row-display-label-context", "topic_grade_title", {
    topic: "المفردات",
    grade: "3",
  }),
);
console.log(
  "summary",
  reportPackCopy("lib__parent-ui__parent-report-regular-display", "summary_focus_only", {
    focus: "المفردات",
  }),
);
