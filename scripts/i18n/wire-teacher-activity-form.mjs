import fs from "node:fs";

const p = "pages/teacher/students/activities/new.js";
let s = fs.readFileSync(p, "utf8");

if (!s.includes("function actCopy(")) {
  s = s.replace(
    'const MODES = ["guided_practice", "quiz", "homework", "discussion"];',
    `const MODES = ["guided_practice", "quiz", "homework", "discussion"];
const ACT = "pages__teacher__students__activities__new";
function actCopy(key, vars) {
  let t = globalBurnDownCopy(ACT, key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      t = t.split("{" + k + "}").join(String(v));
    }
  }
  return t;
}`
  );
}

const map = [
  [
    '<h2 className="text-base font-semibold">Select private students</h2>',
    '<h2 className="text-base font-semibold" data-testid="teacher-activity-form-ready">{actCopy("select_private_students")}</h2>',
  ],
  ["Selected: {selectedIds.size}", '{actCopy("selected_count", { n: selectedIds.size })}'],
  ["Loading students…", '{actCopy("loading_students")}'],
  ["No linked private students.", '{actCopy("no_linked_private_students")}'],
  [
    '{lockedGrade ? `Select all (${formatGradeLevelHe(lockedGrade)})` : "Select all"}',
    '{lockedGrade ? actCopy("select_all_grade", { grade: formatGradeLevelHe(lockedGrade) }) : actCopy("select_all")}',
  ],
  [">\n                  Clear\n                </button>", '>\n                  {actCopy("clear")}\n                </button>'],
  ["Class {s.gradeLevel}", '{actCopy("class_label", { grade: s.gradeLevel })}'],
  [
    "⚠ You have students from different grades. You can only send one activity to students in the same grade.",
    '{actCopy("multi_grade_warning")}',
  ],
  [
    " ` Activity locked to ${formatGradeLevelHe(lockedGrade)}.`",
    ' ` ${actCopy("activity_locked_to", { grade: formatGradeLevelHe(lockedGrade) })}`',
  ],
  ['" Select a first student to lock the grade."', 'actCopy("select_first_to_lock")'],
  [
    '<h2 className="text-base font-semibold mb-3">Activity settings</h2>',
    '<h2 className="text-base font-semibold mb-3">{actCopy("activity_settings")}</h2>',
  ],
  ['<span className="text-white/70">Title</span>', '<span className="text-white/70">{actCopy("title")}</span>'],
  ['<span className="text-white/70">Subject</span>', '<span className="text-white/70">{actCopy("subject")}</span>'],
  ["Grade (for content)", '{actCopy("grade_for_content")}'],
  ["- derived from selected students", '{actCopy("derived_from_selected")}'],
  ['<span className="text-white/70">Topic</span>', '<span className="text-white/70">{actCopy("topic")}</span>'],
  ["No topics available for this grade in Science.", '{actCopy("no_science_topics")}'],
  [
    '<span className="text-white/70">Activity type</span>',
    '<span className="text-white/70">{actCopy("activity_type")}</span>',
  ],
  [
    '<span className="text-white/70">Number of questions</span>',
    '<span className="text-white/70">{actCopy("number_of_questions")}</span>',
  ],
  [
    '<span className="text-white/70">Time limit (seconds, optional)</span>',
    '<span className="text-white/70">{actCopy("time_limit_optional")}</span>',
  ],
  [
    'placeholder={mode === "quiz" ? "Required for quiz" : "Blank = no limit"}',
    'placeholder={mode === "quiz" ? actCopy("required_for_quiz") : actCopy("blank_no_limit")}',
  ],
  [
    '<span className="text-white/70">Due date (optional)</span>',
    '<span className="text-white/70">{actCopy("due_date_optional")}</span>',
  ],
  [
    '{busy ? "Generating questions…" : "Show preview"}',
    '{busy ? actCopy("generating_questions") : actCopy("show_preview")}',
  ],
  [
    "Create and send ({selectedIds.size} students)",
    '{actCopy("create_and_send", { n: selectedIds.size })}',
  ],
  [
    '{mode === "discussion" ? "Discussion question:" : `${preview.length} questions:`}',
    '{mode === "discussion" ? actCopy("discussion_question") : actCopy("questions_count", { n: preview.length })}',
  ],
];

let n = 0;
for (const [a, b] of map) {
  if (s.includes(a)) {
    s = s.split(a).join(b);
    n += 1;
  } else {
    console.log("MISS", a.slice(0, 70));
  }
}
fs.writeFileSync(p, s);
console.log("replaced", n);
