import fs from "fs";

const p = "utils/parent-copilot/parent-facing-answer-postprocess.js";
let t = fs.readFileSync(p, "utf8");

// Replace Hebrew-only banned phrase rules with English Global equivalents.
const enRules = `const BANNED_PHRASE_RULES = [
  {
    pattern: /Most foci with a relatively stable formulation[^.!?]*[.!?]?/giu,
    replace: "",
  },
  {
    pattern: /(?:worth continuing to follow\\s*-\\s*)?Currently, there is no information here that does not come from the report[^.!?]*[.!?]?/giu,
    replace: "",
  },
  {
    pattern: /This means the picture is built from subjects and topics already included in the period range\\.?/giu,
    replace: copilotStaticMessage("copilot.answers.utils_parent-copilot_parent-facing-answer-postpr.the_report_is_based_on_the_practice_carried_out_on_the_site_in_t"),
  },
  {
    pattern: /Parent,?\\s*you can use this as a dictionary of meanings for the report[^.!?]*[.!?]?/giu,
    replace: "",
  },
  {
    pattern: /without adding an external interpretation layer\\.?/giu,
    replace: "",
  },
  {
    pattern: /Dictionary of meanings(?:\\s+for the report)?[^.!?]*[.!?]?/giu,
    replace: "",
  },
];`;

t = t.replace(/const BANNED_PHRASE_RULES = \[[\s\S]*?\];/, enRules);

// Topic-pair matcher: any letters (EN/ES), not Hebrew-only.
t = t.replace(
  /const pairRe = \/\[\\u0590-\\u05FF\]\[\\u0590-\\u05FF\\s\]\{0,24\}\\s\*-\\s\*\[\\u0590-\\u05FF\]\[\^\\n,.;\]\{2,48\}\/gu;/,
  "const pairRe = /([\\p{L}][\\p{L}\\s]{0,24})\\s*-\\s*([\\p{L}][^\\n,.;]{2,48})/gu;"
);

fs.writeFileSync(p, t);
console.log({
  hasHE: /[\u0590-\u05FF]/.test(fs.readFileSync(p, "utf8")),
  normSpace: t.includes('.replace(/\\s+/g, " ")'),
  joinSpace: t.includes('.join(" ")'),
});
