import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

function loadJsonFromGit(relPath) {
  const raw = execSync(`git show HEAD:${relPath}`, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
  return JSON.parse(raw);
}

function loadLeaf(loc, slug) {
  const p = path.join("content-packs", loc, "reports", "burn-down", `${slug}.json`);
  if (!fs.existsSync(p)) return null;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  return j.copy && typeof j.copy === "object" ? j.copy : null;
}

function writeLeaf(loc, slug, copy) {
  const p = path.join("content-packs", loc, "reports", "burn-down", `${slug}.json`);
  fs.writeFileSync(p, JSON.stringify({ copy }, null, 2) + "\n");
}

const NEW_SLUGS = [
  "utils__parent-report-language__parent-report-owner-topic-copy-templates",
  "utils__detailed-report-parent-letter",
];

const EXTRA_KEYS = {
  "components__parent-report-detailed-surface": {
    en: {
      its_better_to_reinforce_the_current_topic_first:
        "It's better to reinforce the current topic first.",
      whats_working_well: "What's working well",
      what_to_avoid_right_now: "What to avoid right now",
      ready_to_advance: "Ready to advance?",
      what_to_pay_attention_to: "What to pay attention to",
      questions_count_one: "1 question",
      questions_count_other: "{n} questions",
      not_available: "Not available",
    },
    "ar-001": {
      its_better_to_reinforce_the_current_topic_first: "من الأفضل تعزيز الموضوع الحالي أولًا.",
      whats_working_well: "ما يسير بشكل جيد",
      what_to_avoid_right_now: "ما يُفضَّل تجنّبه الآن",
      ready_to_advance: "هل يمكن التقدّم؟",
      what_to_pay_attention_to: "ما يستحق الانتباه",
      questions_count_one: "سؤال واحد",
      questions_count_other: "{n} أسئلة",
      not_available: "غير متوفر",
    },
  },
  "utils__parent-report-ui-explain": {
    en: {
      its_better_to_reinforce_the_current_topic_first_before_raising_difficulty:
        "It's better to reinforce the current topic first before raising difficulty.",
      a_little_can_be_tried_but_only_within_the_same_topic_not_across_several:
        "A little can be tried, but only within the same topic, not across several topics at once.",
      a_small_step_within_the_same_topic_can_be_started:
        "A small step within the same topic can be started.",
      a_small_advanced_step_can_be_tried_carefully:
        "A small advanced step can be tried, carefully.",
    },
    "ar-001": {
      its_better_to_reinforce_the_current_topic_first_before_raising_difficulty:
        "من الأفضل تعزيز الموضوع الحالي أولًا قبل رفع مستوى الصعوبة.",
      a_little_can_be_tried_but_only_within_the_same_topic_not_across_several:
        "يمكن تجربة القليل، لكن ضمن الموضوع نفسه فقط، وليس عبر عدة مواضيع دفعة واحدة.",
      a_small_step_within_the_same_topic_can_be_started:
        "يمكن البدء بخطوة صغيرة ضمن الموضوع نفسه.",
      a_small_advanced_step_can_be_tried_carefully:
        "يمكن تجربة خطوة متقدّمة صغيرة، بحذر.",
    },
  },
  "utils__parent-report-surface__parent-topic-tier": {
    en: {
      in_review: "In review",
      topics: "Topics",
      topics_with_few_questions: "Topics with few questions",
    },
    "ar-001": {
      in_review: "قيد المراجعة",
      topics: "مواضيع",
      topics_with_few_questions: "مواضيع بأسئلة قليلة",
    },
  },
  "pages__learning__parent-report-detailed.renderable": {
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
  },
};

for (const loc of ["en", "ar-001"]) {
  const idx = loadJsonFromGit(`content-packs/${loc}/reports/burn-down-index.json`);

  // Restore critical leaves that were overwritten with wrong content
  for (const slug of Object.keys(idx)) {
    const fromIdx = idx[slug];
    if (!fromIdx || typeof fromIdx !== "object") continue;
    writeLeaf(loc, slug, fromIdx);
  }

  // Keep intentional new leaf packs
  for (const slug of NEW_SLUGS) {
    const leaf = loadLeaf(loc, slug);
    if (leaf) idx[slug] = { ...(idx[slug] || {}), ...leaf };
  }

  for (const [slug, byLoc] of Object.entries(EXTRA_KEYS)) {
    const keys = byLoc[loc] || byLoc.en;
    idx[slug] = { ...(idx[slug] || {}), ...keys };
    const leaf = loadLeaf(loc, slug) || {};
    writeLeaf(loc, slug, { ...leaf, ...keys });
  }

  fs.writeFileSync(
    `content-packs/${loc}/reports/burn-down-index.json`,
    JSON.stringify(idx, null, 2) + "\n"
  );
  console.log(loc, "slugs", Object.keys(idx).length, "normalize", idx["utils__parent-report-insights__normalize-parent-facing-labels"]?.subject_math);
}
