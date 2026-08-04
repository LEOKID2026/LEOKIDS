import fs from "fs";

const PAGE = "pages/learning/parent-report.js";
let s = fs.readFileSync(PAGE, "utf8");
const pack = (key, vars) =>
  vars
    ? `reportPackCopy("pages__learning__parent-report", "${key}", ${vars})`
    : `reportPackCopy("pages__learning__parent-report", "${key}")`;

/** Replace unique English literal as whole-line JSX text (CRLF-safe). */
function replacePlain(from, to) {
  if (!s.includes(from)) {
    console.warn("MISS", from.slice(0, 70));
    return 0;
  }
  const c = s.split(from).length - 1;
  s = s.split(from).join(to);
  console.log("ok", c, from.slice(0, 55));
  return c;
}

let applied = 0;
applied += replacePlain(
  "? \"A topic the child is succeeding in right now\"\r\n                            : \"A strong topic right now\")}));",
  `? ${pack("tier_succeeding_now")}\r\n                            : ${pack("tier_strong_now")}));`,
);
applied += replacePlain(
  "What the child does well over time",
  `{${pack("tier_does_well_over_time")}}`,
);
applied += replacePlain(
  "Where the best results were seen",
  `{${pack("where_best_results_seen")}}`,
);
applied += replacePlain(
  "Recommended to maintain",
  `{${pack("recommended_to_maintain")}}`,
);
applied += replacePlain(
  "Where it's worth reinforcing",
  `{${pack("where_worth_reinforcing")}}`,
);
applied += replacePlain(
  "What's worth paying attention to this week",
  `{${pack("worth_paying_attention_week")}}`,
);
applied += replacePlain(
  "What can be done at home",
  `{${pack("what_can_be_done_at_home")}}`,
);
applied += replacePlain(
  "Goals for the coming week",
  `{${pack("goals_for_coming_week")}}`,
);
applied += replacePlain(
  "Recommendation for the child - keeping what's working",
  `{${pack("recommendation_for_child_maintain")}}`,
);
applied += replacePlain(
  "Recommendation for the parent - encouragement and support",
  `{${pack("recommendation_for_parent_encourage")}}`,
);
applied += replacePlain(
  "Recommendation for the child",
  `{${pack("recommendation_for_child")}}`,
);
applied += replacePlain(
  "Example of a mistake (from practice)",
  `{${pack("example_mistake_from_practice")}}`,
);
applied += replacePlain("Correct answer", `{${pack("correct_answer")}}`);
applied += replacePlain("Child's answer", `{${pack("childs_answer")}}`);
applied += replacePlain(
  "Few questions in the selected period",
  `{${pack("few_questions_selected_period")}}`,
);
applied += replacePlain(
  "The number of questions in the selected period is too low to show meaningful charts or tables here.\r\n                  It's recommended to rely on the summary and explanations above, and keep practicing to build a clearer picture.",
  `{${pack("few_questions_charts_body")}}`,
);

fs.writeFileSync(PAGE, s);
console.log("applied", applied);

// Re-probe
const needles = [
  "What the child does well over time",
  "Where the best results were seen",
  "Recommended to maintain",
  "Where it's worth reinforcing",
  "What's worth paying attention",
  "What can be done at home",
  "Goals for the coming week",
  "Recommendation for the child",
  "Example of a mistake",
  "Correct answer",
  "Child's answer",
  "Few questions in the selected",
  "A topic the child is succeeding",
  "The number of questions in the selected period",
];
const out = fs.readFileSync(PAGE, "utf8");
for (const n of needles) {
  console.log(out.includes(n) ? "STILL" : "gone", n.slice(0, 40));
}
