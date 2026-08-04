import fs from "node:fs";

function upsert(loc, slug, keys) {
  const leaf = `content-packs/${loc}/reports/burn-down/${slug}.json`;
  let j;
  try {
    j = JSON.parse(fs.readFileSync(leaf, "utf8"));
  } catch {
    j = { copy: {} };
  }
  if (!j.copy) j.copy = {};
  Object.assign(j.copy, keys);
  fs.writeFileSync(leaf, JSON.stringify(j, null, 2) + "\n");
  const idxP = `content-packs/${loc}/reports/burn-down-index.json`;
  const idx = JSON.parse(fs.readFileSync(idxP, "utf8"));
  idx[slug] = { ...(idx[slug] || {}), ...keys };
  fs.writeFileSync(idxP, JSON.stringify(idx, null, 2) + "\n");
}

const transferEn = {
  its_better_to_reinforce_the_current_topic_first_before_raising_difficulty:
    "It's better to reinforce the current topic first before raising difficulty.",
  a_little_can_be_tried_but_only_within_the_same_topic_not_across_several:
    "A little can be tried, but only within the same topic, not across several topics at once.",
  a_small_step_within_the_same_topic_can_be_started:
    "A small step within the same topic can be started.",
  a_small_advanced_step_can_be_tried_carefully:
    "A small advanced step can be tried, carefully.",
};

const transferAr = {
  its_better_to_reinforce_the_current_topic_first_before_raising_difficulty:
    "من الأفضل تعزيز الموضوع الحالي أولًا قبل رفع مستوى الصعوبة.",
  a_little_can_be_tried_but_only_within_the_same_topic_not_across_several:
    "يمكن تجربة القليل، لكن ضمن الموضوع نفسه فقط، وليس عبر عدة مواضيع دفعة واحدة.",
  a_small_step_within_the_same_topic_can_be_started:
    "يمكن البدء بخطوة صغيرة ضمن الموضوع نفسه.",
  a_small_advanced_step_can_be_tried_carefully:
    "يمكن تجربة خطوة متقدّمة صغيرة، بحذر.",
};

const letterEn = {
  the_subject_fallback: "the subject",
  little_practice_opening:
    "There's little practice in {lab} this period, so a broad conclusion isn't possible yet. It helps to continue with short practice and check if the direction holds after more questions.",
  practice_no_topic_detail_opening:
    "There's practice in {lab}, but not yet enough detail by topic to show a precise conclusion. It helps to continue with short practice, and in the next report it will be easier to see what repeats.",
  focus_first_two_topics:
    "In {lab} it's worth focusing first on {topic0}. {questions0} questions were solved, with {accuracy0}% accuracy. Another topic worth watching is {topic1}, with {questions1} questions and {accuracy1}% accuracy.",
  focus_now_one_topic:
    "In {lab} it's worth focusing right now on {topic}. {questions} questions were solved, with {accuracy}% accuracy.",
  main_pattern_seen: "The main pattern seen: {pattern}.",
};

const letterAr = {
  the_subject_fallback: "المادة",
  little_practice_opening:
    "الممارسة في {lab} قليلة خلال هذه الفترة، لذا لا يمكن بعد استخلاص استنتاج واسع. من المفيد متابعة ممارسة قصيرة والتحقق مما إذا كان الاتجاه يثبت بعد مزيد من الأسئلة.",
  practice_no_topic_detail_opening:
    "هناك ممارسة في {lab}، لكن ليس بعد تفصيلًا كافيًا حسب الموضوع لاستنتاج دقيق. من المفيد متابعة ممارسة قصيرة، وفي التقرير التالي سيكون أسهل رؤية ما يتكرر.",
  focus_first_two_topics:
    "في {lab} يجدر التركيز أولًا على {topic0}. تم حل {questions0} أسئلة بدقة {accuracy0}٪. موضوع آخر يستحق المتابعة هو {topic1}، مع {questions1} أسئلة ودقة {accuracy1}٪.",
  focus_now_one_topic:
    "في {lab} يجدر التركيز الآن على {topic}. تم حل {questions} أسئلة بدقة {accuracy}٪.",
  main_pattern_seen: "النمط الرئيسي الذي ظهر: {pattern}.",
};

upsert("en", "utils__parent-report-ui-explain", transferEn);
upsert("ar-001", "utils__parent-report-ui-explain", transferAr);
upsert("en", "utils__detailed-report-parent-letter", letterEn);
upsert("ar-001", "utils__detailed-report-parent-letter", letterAr);
console.log("synced transfer + letter keys");
