import fs from "fs";

{
  const p = "utils/parent-copilot/semantic-aggregate-answers.js";
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(
    /const improvementLines = trends\.filter\(\(t\) => \/\|{0,2}\/\.test\(t\)\);/,
    'const improvementLines = trends.filter((t) => /improv|progress|increase|strengthen|getting\\s+better/i.test(t));',
  );
  s = s.replace(
    /if \(\/\|\/\.test\(uImp\) && mathRow/,
    "if (/\\bmath(?:ematics)?\\b|\\barithmetic\\b/i.test(uImp) && mathRow",
  );
  fs.writeFileSync(p, s);
  console.log("saa", s.includes("/|/") ? "still has /|/" : "ok");
}

{
  const p = "utils/parent-copilot/truth-packet-v1.js";
  let s = fs.readFileSync(p, "utf8");
  const enOpen =
    "/still|cautious|partial|early|not\\s+clear|lack|medium|needed|reinforcement|open|limited|not\\s+closed|too\\s+early|narrow|cannot\\s+(?:yet\\s+)?(?:conclude|decide)|do\\s+not\\s+(?:advance|progress)|stop|wait|needs?\\s+reinforcement|attention|not\\s+(?:yet\\s+)?closed|without\\s+(?:a\\s+)?sufficient\\s+basis|do\\s+not\\s+close/iu";
  s = s.replace(
    /const narrativeSignalsOpenPartial =\s*\/[\s\S]*?\/u\.test\(\s*`\$\{slotInterp\} \$\{slotUnc\}`,\s*\);/g,
    `const narrativeSignalsOpenPartial =\n    ${enOpen}.test(\n      \`\${slotInterp} \${slotUnc}\`,\n    );`,
  );
  fs.writeFileSync(p, s);
  console.log("tp openPartial count", (s.match(/narrativeSignalsOpenPartial/g) || []).length);
}

{
  const p = "utils/parent-copilot/conversation-scope-inheritance.js";
  let s = fs.readFileSync(p, "utf8");
  // show context
  const m = s.match(/\/\|{2,}\/u;?/);
  console.log("csi match", m && m[0]);
  s = s.replace(
    /\/\|{2,}\/u/,
    "/\\b(?:same|also|and|what\\s+about|how\\s+about)\\b/iu",
  );
  fs.writeFileSync(p, s);
}

// Fix week planner intent match-all in index.js
{
  const p = "utils/parent-copilot/index.js";
  let s = fs.readFileSync(p, "utf8");
  const before = (s.match(/\/\\s\*\|{0,2}\\s\*\//g) || []).length;
  s = s.replace(/\/\\s\*\|{0,2}\\s\*\//g, "/\\b(?:this\\s+)?week\\b|coming\\s+week|\\bweekly\\b/i");
  // also /\s*||\s*/
  s = s.replace(/\/\\s*\|\|\\s*\//g, "/\\b(?:this\\s+)?week\\b|coming\\s+week|\\bweekly\\b/i");
  fs.writeFileSync(p, s);
  console.log("index week regex replacements", before);
}
