import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const EN = {
  incorrect: "Incorrect",
  answer_submitted: "Answer submitted",
  submit_answer: "Submit answer",
  type_your_answer: "Type your answer",
  enlarged_diagram: "Enlarged diagram",
  close_diagram: "Close diagram",
  waiting_for_the_teacher: "Waiting for the teacher…",
  correct: "Correct!",
  network_error: "Network error",
  could_not_start: "Could not start the activity",
  could_not_save: "Could not save the answer",
  teacher_paused: "The teacher paused the lesson — please wait",
  done_title_activity: "You finished the activity!",
  done_title_discussion: "You finished the discussion",
  done_title_explanation: "You read the explanation",
  done_body_explanation: "You read the teacher's explanation. Thank you!",
  done_body_discussion_multi: "You finished {count} discussion questions. Thank you!",
  done_body_discussion: "Thanks for your response. Your teacher will see the answer in class.",
  back_home: "Back home",
  question_progress: "Question {current} of {total}",
  answer_saved: "Answer saved",
  close_draft: "Close draft",
  scratch_pad: "Scratch pad",
  previous_question: "Previous question",
  next_question: "Next question",
  finish_and_submit: "Finish and submit",
  explanation_banner: "No need to submit an answer — read the content",
  read_continue: "I read it — continue",
  finished_reading: "I finished reading",
  summary_got_of: "You got {correct} of {total} questions correct",
  summary_got: "You got {correct} questions correct",
  summary_finished: "You finished the activity",
  score_chip_of: "{correct}/{total} questions",
  score_chip: "{correct} questions",
};

const AR = {
  incorrect: "غير صحيح",
  answer_submitted: "تم إرسال الإجابة",
  submit_answer: "إرسال الإجابة",
  type_your_answer: "اكتب إجابتك",
  enlarged_diagram: "رسم تخطيطي موسع",
  close_diagram: "إغلاق الرسم البياني",
  waiting_for_the_teacher: "في انتظار المعلم…",
  correct: "صحيح!",
  network_error: "خطأ في الشبكة",
  could_not_start: "تعذر بدء النشاط",
  could_not_save: "تعذر حفظ الإجابة",
  teacher_paused: "أوقف المعلم الدرس — يرجى الانتظار",
  done_title_activity: "أنهيت النشاط!",
  done_title_discussion: "أنهيت النقاش",
  done_title_explanation: "قرأت الشرح",
  done_body_explanation: "قرأت شرح المعلم. شكرًا لك!",
  done_body_discussion_multi: "أنهيت {count} أسئلة نقاش. شكرًا لك!",
  done_body_discussion: "شكرًا على إجابتك. سيراها معلمك في الصف.",
  back_home: "العودة للرئيسية",
  question_progress: "سؤال {current} من {total}",
  answer_saved: "تم حفظ الإجابة",
  close_draft: "إغلاق المسودة",
  scratch_pad: "مسودة الحساب",
  previous_question: "السؤال السابق",
  next_question: "السؤال التالي",
  finish_and_submit: "إنهاء وإرسال",
  explanation_banner: "لا حاجة لإرسال إجابة — اقرأ المحتوى",
  read_continue: "قرأته — متابعة",
  finished_reading: "أنهيت القراءة",
  summary_got_of: "أجبت بشكل صحيح على {correct} من {total} أسئلة",
  summary_got: "أجبت بشكل صحيح على {correct} أسئلة",
  summary_finished: "أنهيت النشاط",
  score_chip_of: "{correct}/{total} أسئلة",
  score_chip: "{correct} أسئلة",
};

const packs = {
  "pages__student__activity__[activityId]": { en: EN, ar: AR },
  "components__student__StudentActivitySubmitConfirmModal": {
    en: {
      title: "Finish and submit this activity?",
      answered_of: "You answered {answered} of {questionCount} questions",
      unanswered_warn:
        "There are {count} unanswered questions. After submitting you cannot go back and change answers.",
      submit_note: "After submitting you cannot go back and change answers.",
      cancel: "Cancel",
      submitting: "Submitting…",
      confirm: "Yes, finish and submit",
    },
    ar: {
      title: "إنهاء وإرسال هذا النشاط؟",
      answered_of: "أجبت على {answered} من {questionCount} أسئلة",
      unanswered_warn:
        "هناك {count} أسئلة بلا إجابة. بعد الإرسال لا يمكنك العودة وتغيير الإجابات.",
      submit_note: "بعد الإرسال لا يمكنك العودة وتغيير الإجابات.",
      cancel: "إلغاء",
      submitting: "جارٍ الإرسال…",
      confirm: "نعم، إنهاء وإرسال",
    },
  },
  "components__student__StudentAssignedActivityShell": {
    en: { back_to_home: "← Back to home" },
    ar: { back_to_home: "← العودة للرئيسية" },
  },
  "components__student__StudentClassroomActivitiesPanel": {
    en: {
      view_result: "View result",
      continue: "Continue",
      start: "Start",
      questions_meta: "questions",
      class_activities: "Class activities",
      parent_activities: "Parent activities",
      intro: "Activities assigned by your teacher or parent appear here.",
    },
    ar: {
      view_result: "عرض النتيجة",
      continue: "متابعة",
      start: "ابدأ",
      questions_meta: "أسئلة",
      class_activities: "أنشطة الصف",
      parent_activities: "أنشطة الوالدين",
      intro: "تظهر هنا الأنشطة التي عيّنها معلمك أو ولي أمرك.",
    },
  },
  "components__student__StudentAssignedActivityQuestionStage": {
    en: { enlarge: "⛶ Enlarge", enlarge_diagram: "Enlarge diagram" },
    ar: { enlarge: "⛶ تكبير", enlarge_diagram: "تكبير الرسم" },
  },
  "lib__classroom-activities__student-activity-result-labels.client": {
    en: {
      summary_got_of: EN.summary_got_of,
      summary_got: EN.summary_got,
      summary_finished: EN.summary_finished,
      score_chip_of: EN.score_chip_of,
      score_chip: EN.score_chip,
    },
    ar: {
      summary_got_of: AR.summary_got_of,
      summary_got: AR.summary_got,
      summary_finished: AR.summary_finished,
      score_chip_of: AR.score_chip_of,
      score_chip: AR.score_chip,
    },
  },
  "lib__classroom-activities__student-activity-scope-labels.client": {
    en: { personal_activity: "Personal activity" },
    ar: { personal_activity: "نشاط شخصي" },
  },
};

function writePack(locale, slug, copy) {
  const dir = path.join(root, "content-packs", locale, "global-burn-down");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${slug}.json`), `${JSON.stringify({ copy }, null, 2)}\n`);
}

for (const [slug, { en, ar }] of Object.entries(packs)) {
  writePack("en", slug, en);
  writePack("ar-001", slug, ar);
}

function rebuildIndex(locale) {
  const packDir = path.join(root, "content-packs", locale, "global-burn-down");
  const indexPath = path.join(packDir, "burn-down-index.json");
  let index = {};
  if (fs.existsSync(indexPath)) {
    try {
      index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    } catch {
      index = {};
    }
  }
  for (const name of fs.readdirSync(packDir)) {
    if (!name.endsWith(".json") || name === "burn-down-index.json") continue;
    const slug = name.replace(/\.json$/, "");
    const raw = JSON.parse(fs.readFileSync(path.join(packDir, name), "utf8"));
    index[slug] = { ...(index[slug] || {}), ...(raw.copy || {}) };
  }
  fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`);
  console.log(locale, "index packs", Object.keys(index).length);
}

rebuildIndex("en");
rebuildIndex("ar-001");
console.log("activity burn-down packs patched");
