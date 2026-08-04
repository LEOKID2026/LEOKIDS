import fs from "node:fs";

const p = "pages/student/activity/[activityId].js";
let s = fs.readFileSync(p, "utf8");
s = s.replaceAll(">Previous question<", ">{ac(\"previous_question\")}<");
s = s.replaceAll(">Next question<", ">{ac(\"next_question\")}<");
s = s.replaceAll(">Finish and submit<", ">{ac(\"finish_and_submit\")}<");
s = s.replaceAll(
  "No need to submit an answer — read the content",
  "{ac(\"explanation_banner\")}"
);
s = s.replaceAll(
  '{effectiveIdx < questionSet.length - 1 ? "I read it — continue" : "I finished reading"}',
  "{effectiveIdx < questionSet.length - 1 ? ac(\"read_continue\") : ac(\"finished_reading\")}"
);
s = s.replaceAll(
  'isCurrentQuestionAnswered ? "Answer saved" : globalBurnDownCopy("pages__student__activity__[activityId]", "submit_answer")',
  'isCurrentQuestionAnswered ? ac("answer_saved") : ac("submit_answer")'
);
s = s.replaceAll(
  'isCurrentQuestionAnswered ? "Answer saved" : ac("submit_answer")',
  'isCurrentQuestionAnswered ? ac("answer_saved") : ac("submit_answer")'
);
s = s.replaceAll(
  'globalBurnDownCopy("pages__student__activity__[activityId]", "answer_submitted")',
  'ac("answer_submitted")'
);
s = s.replaceAll(
  'globalBurnDownCopy("pages__student__activity__[activityId]", "type_your_answer")',
  'ac("type_your_answer")'
);
s = s.replaceAll(
  'globalBurnDownCopy("pages__student__activity__[activityId]", "waiting_for_the_teacher")',
  'ac("waiting_for_the_teacher")'
);
s = s.replaceAll(
  'globalBurnDownCopy("pages__student__activity__[activityId]", "enlarged_diagram")',
  'ac("enlarged_diagram")'
);
s = s.replaceAll(
  'globalBurnDownCopy("pages__student__activity__[activityId]", "close_diagram")',
  'ac("close_diagram")'
);
s = s.replaceAll(
  'globalBurnDownCopy("pages__student__activity__[activityId]", "submit_answer")',
  'ac("submit_answer")'
);
fs.writeFileSync(p, s);
const leftovers = s.match(
  /"(Previous question|Next question|Finish and submit|Answer saved|Correct!|Back home|Scratch pad|Close draft|I read it)/g
);
console.log("leftovers", leftovers);
