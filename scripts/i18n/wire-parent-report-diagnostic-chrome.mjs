import fs from "fs";

const PAGE = "pages/learning/parent-report.js";
let s = fs.readFileSync(PAGE, "utf8");
const pack = (key, vars) =>
  vars
    ? `reportPackCopy("pages__learning__parent-report", "${key}", ${vars})`
    : `reportPackCopy("pages__learning__parent-report", "${key}")`;

const replacements = [
  [
    'setParentReportError("The report could not be built from the data received from the server.");',
    `setParentReportError(${pack("report_could_not_be_built")});`,
  ],
  [
    '? "Loading the report took too long - try a shorter range or refresh."',
    `? ${pack("report_load_timeout")}`,
  ],
  [
    '? "A topic the child is succeeding in right now"\n                            : "A strong topic right now")}));',
    `? ${pack("tier_succeeding_now")}\n                            : ${pack("tier_strong_now")}));`,
  ],
  [
    'tierHe: w.tierHe || "Right now practice suggests this could use reinforcement"}));',
    `tierHe: w.tierHe || ${pack("tier_needs_reinforcement")}));`,
  ],
  ["Based on what was practiced:", `{${pack("based_on_what_was_practiced")}}`],
  [
    '<span className="text-white/45">What to do: </span>',
    `<span className="text-white/45">{${pack("what_to_do")}} </span>`,
  ],
  [
    '<span className="text-white/45 font-bold">Now: </span>',
    `<span className="text-white/45 font-bold">{${pack("now_label")}} </span>`,
  ],
  [
    '<span className="text-white/45 font-bold">Avoid: </span>',
    `<span className="text-white/45 font-bold">{${pack("avoid_label")}} </span>`,
  ],
  [
    '<span className="text-white/45 font-bold">What repeats as a mistake: </span>',
    `<span className="text-white/45 font-bold">{${pack("what_repeats_as_mistake")}} </span>`,
  ],
  [
    '<span className="text-white/45 font-bold">What the child already remembers well: </span>',
    `<span className="text-white/45 font-bold">{${pack("what_child_already_remembers")}} </span>`,
  ],
  [
    "What the child does well over time\n                              </div>",
    `{${pack("tier_does_well_over_time")}}\n                              </div>`,
  ],
  [
    '{x.tierHe || "What the child does well over time"}',
    `{x.tierHe || ${pack("tier_does_well_over_time")}}`,
  ],
  [
    "Where the best results were seen\n                              </div>",
    `{${pack("where_best_results_seen")}}\n                              </div>`,
  ],
  [
    "Recommended to maintain\n                              </div>",
    `{${pack("recommended_to_maintain")}}\n                              </div>`,
  ],
  [
    '{maintainTierHeDisplay(x.tierHe) || "Consistency"}',
    `{maintainTierHeDisplay(x.tierHe) || ${pack("tier_consistency")}}`,
  ],
  [
    "Where it's worth reinforcing\n                              </div>",
    `{${pack("where_worth_reinforcing")}}\n                              </div>`,
  ],
  [
    '{x.tierHe || "A topic still strengthening"}',
    `{x.tierHe || ${pack("tier_still_strengthening")}}`,
  ],
  [
    "What's worth paying attention to this week\n                              </div>",
    `{${pack("worth_paying_attention_week")}}\n                              </div>`,
  ],
  [
    "What can be done at home\n                                    </div>",
    `{${pack("what_can_be_done_at_home")}}\n                                    </div>`,
  ],
  [
    "Goals for the coming week\n                                    </div>",
    `{${pack("goals_for_coming_week")}}\n                                    </div>`,
  ],
  [
    "Recommendation for the child\n                                    </div>",
    `{${pack("recommendation_for_child")}}\n                                    </div>`,
  ],
  [
    "Recommendation for the child - keeping what's working\n                                    </div>",
    `{${pack("recommendation_for_child_maintain")}}\n                                    </div>`,
  ],
  [
    "Recommendation for the parent - encouragement and support\n                                    </div>",
    `{${pack("recommendation_for_parent_encourage")}}\n                                    </div>`,
  ],
  [
    "Example of a mistake (from practice)\n                                  </div>",
    `{${pack("example_mistake_from_practice")}}\n                                  </div>`,
  ],
  [
    "Correct answer\n                                          </span>",
    `{${pack("correct_answer")}}\n                                          </span>`,
  ],
  [
    "Child's answer\n                                          </span>",
    `{${pack("childs_answer")}}\n                                          </span>`,
  ],
  [
    "Few questions in the selected period\n                </h2>",
    `{${pack("few_questions_selected_period")}}\n                </h2>`,
  ],
  [
    "The number of questions in the selected period is too low to show meaningful charts or tables here.\n                  It's recommended to rely on the summary and explanations above, and keep practicing to build a clearer picture.",
    `{${pack("few_questions_charts_body")}}`,
  ],
  [
    'return ["No questions answered in this period", ""];',
    `return [${pack("no_questions_answered_period")}, ""];`,
  ],
  [
    'return ["Not practiced in this subject for the selected period", ""];',
    `return [${pack("not_practiced_subject_period")}, ""];`,
  ],
  [
    'return ["Not practiced in this topic for the selected period", ""];',
    `return [${pack("not_practiced_topic_period")}, ""];`,
  ],
  ['name="Math"', `name={formatParentReportSubjectHe("math")}`],
  ['name="Geometry"', `name={formatParentReportSubjectHe("geometry")}`],
  ['name="English"', `name={formatParentReportSubjectHe("english")}`],
  ['name="Science"', `name={formatParentReportSubjectHe("science")}`],
  [
    'toLocaleDateString("en-US"',
    'toLocaleDateString(activeReportLocale === "ar-001" ? "ar" : "en-US"',
  ],
  [
    "? ` (${w.mistakeCount} similar mistakes)`",
    `? \` (\${reportPackCopy("pages__learning__parent-report", "similar_mistakes_count", { n: w.mistakeCount })})\``,
  ],
];

let applied = 0;
for (const [from, to] of replacements) {
  if (!s.includes(from)) {
    console.warn("MISSING:", JSON.stringify(from).slice(0, 100));
    continue;
  }
  const count = s.split(from).length - 1;
  s = s.split(from).join(to);
  applied += count;
  console.log("ok", count, from.slice(0, 55).replace(/\n/g, "\\n"));
}

const accFrom =
  "{diagnosticParentVisibleTextHe(x.labelHe)} - {x.accuracy}% accuracy ({x.questions} questions)";
const accTo = `{diagnosticParentVisibleTextHe(x.labelHe)} - {${pack("accuracy_questions_meta", "{ accuracy: x.accuracy, questions: x.questions }")}}`;
if (s.includes(accFrom)) {
  const c = s.split(accFrom).length - 1;
  s = s.split(accFrom).join(accTo);
  applied += c;
  console.log("ok accuracy meta", c);
}

const accFrom2 = `- {x.accuracy}% accuracy ({x.questions} questions)`;
if (s.includes(accFrom2)) {
  const c = s.split(accFrom2).length - 1;
  s = s
    .split(accFrom2)
    .join(
      `- {${pack("accuracy_questions_meta", "{ accuracy: x.accuracy, questions: x.questions }")}}`,
    );
  applied += c;
  console.log("ok accuracy leftover", c);
}

fs.writeFileSync(PAGE, s);
console.log("applied", applied);

function sync(loc, keys) {
  const p = `content-packs/${loc}/reports/burn-down-index.json`;
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  j["pages__learning__parent-report"] = {
    ...(j["pages__learning__parent-report"] || {}),
    ...keys,
  };
  fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n");
}

sync("en", {
  based_on_what_was_practiced: "Based on what was practiced:",
  what_to_do: "What to do:",
  now_label: "Now:",
  avoid_label: "Avoid:",
  what_repeats_as_mistake: "What repeats as a mistake:",
  what_child_already_remembers: "What the child already remembers well:",
  where_best_results_seen: "Where the best results were seen",
  recommended_to_maintain: "Recommended to maintain",
  where_worth_reinforcing: "Where it's worth reinforcing",
  worth_paying_attention_week: "What's worth paying attention to this week",
  what_can_be_done_at_home: "What can be done at home",
  goals_for_coming_week: "Goals for the coming week",
  recommendation_for_child: "Recommendation for the child",
  recommendation_for_child_maintain: "Recommendation for the child - keeping what's working",
  recommendation_for_parent_encourage:
    "Recommendation for the parent - encouragement and support",
  example_mistake_from_practice: "Example of a mistake (from practice)",
  correct_answer: "Correct answer",
  childs_answer: "Child's answer",
  few_questions_selected_period: "Few questions in the selected period",
  few_questions_charts_body:
    "The number of questions in the selected period is too low to show meaningful charts or tables here. It's recommended to rely on the summary and explanations above, and keep practicing to build a clearer picture.",
  accuracy_questions_meta: "{accuracy}% accuracy ({questions} questions)",
  similar_mistakes_count: "{n} similar mistakes",
});
sync("ar-001", {
  based_on_what_was_practiced: "بناءً على ما تُمرِّن عليه:",
  what_to_do: "ما العمل:",
  now_label: "الآن:",
  avoid_label: "تجنّب:",
  what_repeats_as_mistake: "ما يتكرر كخطأ:",
  what_child_already_remembers: "ما يتذكره الطفل جيدًا:",
  where_best_results_seen: "أين ظهرت أفضل النتائج",
  recommended_to_maintain: "يُستحسن الحفاظ عليه",
  where_worth_reinforcing: "ما يستحق التعزيز",
  worth_paying_attention_week: "ما يستحق الانتباه هذا الأسبوع",
  what_can_be_done_at_home: "ما يمكن فعله في المنزل",
  goals_for_coming_week: "أهداف الأسبوع القادم",
  recommendation_for_child: "توصية للطفل",
  recommendation_for_child_maintain: "توصية للطفل — الحفاظ على ما ينجح",
  recommendation_for_parent_encourage: "توصية لولي الأمر — تشجيع ودعم",
  example_mistake_from_practice: "مثال على خطأ (من الممارسة)",
  correct_answer: "الإجابة الصحيحة",
  childs_answer: "إجابة الطفل",
  few_questions_selected_period: "أسئلة قليلة في الفترة المحددة",
  few_questions_charts_body:
    "عدد الأسئلة في الفترة المحددة منخفض جدًا لعرض مخططات أو جداول ذات معنى هنا. يُفضَّل الاعتماد على الملخص والتوضيحات أعلاه، ومواصلة التمرين لبناء صورة أوضح.",
  accuracy_questions_meta: "دقة {accuracy}% ({questions} أسئلة)",
  similar_mistakes_count: "{n} أخطاء مشابهة",
});
console.log("diagnostic chrome keys synced");
