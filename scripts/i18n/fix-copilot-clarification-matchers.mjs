import fs from "fs";

const p = "utils/parent-copilot/index.js";
let t = fs.readFileSync(p, "utf8");

const start = t.indexOf("function buildNoScopeCategorySpecificClarification(utterance) {");
const end = t.indexOf("\nfunction normalizeMergedLlmAttempt(raw) {", start);
if (start < 0 || end < 0) {
  console.error("markers not found", { start, end });
  process.exit(1);
}

const replacement = `function buildNoScopeCategorySpecificClarification(utterance) {
  const t = String(utterance || "").trim();
  if (!t) return null;

  if (
    /another\\s+child|all\\s+(?:the\\s+)?kids|password|database|\\bdb\\b|all\\s+(?:the\\s+)?users|another\\s+account|someone\\s+else'?s\\s+data|list\\s+of\\s+(?:kids|children)/i.test(
      t
    )
  ) {
    return PRIVACY_BOUNDARY_RESPONSE_HE;
  }
  if (
    /weather|news|soccer|football|recipe|song|shoes|bitcoin|javascript|java\\s*script|what\\s*time|joke|prime\\s*minister|investments|stock\\s*market|homework\\s+that\\s+(?:isn'?t|not)/i.test(
      t
    )
  ) {
    return GENERAL_OFF_TOPIC_RESPONSE_HE;
  }
  if (/ignore\\s+(?:the\\s+)?(?:instructions|rules)|system\\s*prompt|debug|internal\\s*instructions|print\\s*(?:them|it)|from\\s+now\\s+on\\s+don'?t\\s+use/i.test(t)) {
    return "I do not ignore the report and do not disclose internal instructions. The answer here remains based on learning data, and it is possible to continue with the question about the actual state of learning.";
  }
  if (
    /\\binvent\\b|hide\\s+(?:the\\s+)?(?:data|report)|without\\s+considering\\s+(?:the\\s+)?data|write\\s+that\\s+(?:the\\s+)?child\\s+is\\s+excellent\\s+even\\s+though|change\\s+(?:the\\s+)?report/i.test(
      t
    )
  ) {
    return "It is not possible to invent, change or improve data in the report. It is possible to explain only the data that appears in it. It is also possible to build a clear formulation for the parent according to what is currently in the learning data.";
  }
  if (/how\\s+is\\s+(?:he|she|they).*(?:in\\s+)?music|\\bin\\s+music\\b|\\bin\\s+art\\b|\\bin\\s+sports?\\b|\\bin\\s+dance\\b/i.test(t)) {
    return "At the moment, there is no practice data for this subject in the report, so it is impossible to conclude a situation about it. If you wish, we can focus on subjects that do appear in the report.";
  }
  if (/why\\s+(?:did\\s+you\\s+)?(?:say|write).*(?:weak|struggling)|don'?t\\s+agree\\s+with\\s+(?:the\\s+)?report|(?:the\\s+)?report\\s+is\\s+wrong/i.test(t)) {
    return "There can be a gap between success at home and performance in practice in the app. That is why we look at a repeating pattern in the report over time, and not at a single answer.";
  }
  if (/explain\\s+(?:it\\s+)?(?:to\\s+me\\s+)?like\\s+(?:a\\s+)?parent|without\\s+(?:the\\s+)?(?:jargon|concepts)|in\\s+one\\s+sentence|only\\s+3\\s+points|in\\s+short/i.test(t)) {
    return "In short: the report compares subjects according to the amount of questions and accuracy in practice. If the data is still few, it is an initial sign and not a final direction - it is better to accumulate some more short practice before determining a direction.";
  }
  if (/what\\s+(?:to\\s+)?do\\s+tomorrow|what\\s+to\\s+practice\\s+(?:this\\s+)?week|short\\s+plan|how\\s+to\\s+help\\s+without\\s+pressure/i.test(t)) {
    return "You can start with a short program: 1) 10 minutes of repetition on one subject, 2) 5-8 questions on another subject, 3) retesting in two days if the same pattern is maintained.";
  }
  return null;
}

`;

// Also restore fingerprint fold (space-insensitive)
t = t.replace(
  /function normalizeWsHeJoin\(s\) \{\s*return String\(s \|\| ""\)\s*\.replace\(\/\\s\+\/g, " "\)\s*\.trim\(\);\s*\}/,
  `function normalizeWsHeJoin(s) {
  return String(s || "")
    .replace(/\\s+/g, "")
    .trim();
}`
);

t = t.slice(0, start) + replacement + t.slice(end);
fs.writeFileSync(p, t);
console.log("patched clarification + fingerprint fold");
