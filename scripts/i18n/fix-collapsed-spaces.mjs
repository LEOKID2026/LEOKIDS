import fs from "fs";
import { execSync } from "child_process";

function fixFile(rel) {
  let t = fs.readFileSync(rel, "utf8");
  const beforeEmpty = (t.match(/\.replace\(\/\\s\+\/g,\s*""\)/g) || []).length;
  const beforeJoin = (t.match(/\.join\(""\)/g) || []).length;
  t = t.replace(/\.replace\(\/\\s\+\/g,\s*""\)/g, '.replace(/\\s+/g, " ")');
  t = t.replace(/\.join\(""\)/g, '.join(" ")');
  // also fix \s{2} collapses that remove rather than space
  t = t.replace(/\.replace\(\/\\s\{2\}\/g,\s*""\)/g, '.replace(/\\s{2,}/g, " ")');
  t = t.replace(/\.replace\(\/\\s\{2,\}\/g,\s*""\)/g, '.replace(/\\s{2,}/g, " ")');
  fs.writeFileSync(rel, t);
  const afterEmpty = (t.match(/\.replace\(\/\\s\+\/g,\s*""\)/g) || []).length;
  const afterJoin = (t.match(/\.join\(""\)/g) || []).length;
  console.log(rel, { beforeEmpty, beforeJoin, afterEmpty, afterJoin });
}

const files = [
  "utils/parent-copilot/index.js",
  "utils/parent-copilot/answer-composer.js",
  "utils/parent-copilot/answer-compaction.js",
  "utils/parent-copilot/truth-packet-v1.js",
  "utils/parent-copilot/llm-orchestrator.js",
  "utils/parent-copilot/data-grounded-evidence-augmentation.js",
  "utils/parent-copilot/comparison-practical-continuity.js",
  "utils/parent-copilot/parent-facing-answer-postprocess.js",
];
for (const f of files) {
  if (fs.existsSync(f)) fixFile(f);
}
