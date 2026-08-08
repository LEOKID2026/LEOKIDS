/**
 * Scan teacher/school/parent/student pages for hardcoded English JSX prose
 * that looks user-visible (heuristic; requires manual classification).
 */
import fs from "fs";
import path from "path";

const roots = [
  "pages/teacher",
  "pages/school",
  "pages/parent",
  "pages/student",
  "pages/guardian",
  "pages/demo",
  "components/arcade",
  "components/parent",
  "components/teacher",
  "components/school",
  "components/student",
];

const JSX_TEXT = />([A-Z][^<{]{8,120})</g;
const STR_LIT = /(?:set(?:Error|Msg|Message|SummaryError|ReportError|ExitErr|BundleErr)\([^)]*?["'`])([A-Z][^"'`]{8,120})["'`]/g;
const HARD_ATTR = /(?:aria-label|title|placeholder)=["']([A-Z][^"']{8,80})["']/g;

const hits = [];

function walk(d) {
  if (!fs.existsSync(d)) return;
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(jsx?|tsx?)$/.test(ent.name)) {
      const t = fs.readFileSync(p, "utf8");
      const lines = t.split(/\r?\n/);
      lines.forEach((line, i) => {
        // skip imports/comments/className heavy
        if (/^\s*\/\//.test(line) || /className=|import |from "/.test(line)) return;
        if (/globalBurnDownCopy|gamePackCopy|burnDownCopy|demoPackCopy|\.t\(|\bt\(["']/.test(line)) return;
        let m;
        const re = />([A-Z][^<{]*[a-z][^<{]{4,})</g;
        while ((m = re.exec(line))) {
          const text = m[1].trim();
          if (/^(GET|POST|PUT|DELETE|Content-Type|application\/)/.test(text)) continue;
          hits.push({ file: p, line: i + 1, kind: "jsx", text: text.slice(0, 140) });
        }
        const re2 = /["']([A-Z][a-z]+(?: [A-Za-z',.!]{2,}){2,})["']/g;
        while ((m = re2.exec(line))) {
          const text = m[1];
          if (/^(Not signed in|Could not|Please |Error |Failed |Save |Saved |Progress |Activity |Class |Weak |By |Total |Average |Students |Topics |Suggested |Focus |Reinforcement |Enrichment |Access |Upgrade |Player |Recent |Official |Daily |Friend |Guest |Waiting |Game |Round |Host |Claim |Collect |Register |Registration |Remove |Setting |My |Add |No |Play |This |Enter |Change |Display |Wins|Coins|Diamonds|Card |Today|How to|Pick |Continue |Wait |Sending|Victory|The game|Table |Prizes |Your |Last |Session |Players )/i.test(text) ||
              / (the|and|to|for|with|from|your|this|class|student|report|error|loading|data|please|select|enter|save|failed|marked|progress|activity|mode|question|skills|summary|performance|subject|reinforcement|monitoring|groups|lesson|suggestions|expired|invite|friend|profile|missions|achievements|challenge|tournament|reward|coins|diamonds|collection|experience|parent|teacher|school)\b/i.test(text)) {
            hits.push({ file: p, line: i + 1, kind: "string", text: text.slice(0, 140) });
          }
        }
      });
    }
  }
}

for (const r of roots) walk(r);

// de-dupe
const seen = new Set();
const uniq = [];
for (const h of hits) {
  const k = h.file + ":" + h.line + ":" + h.text;
  if (seen.has(k)) continue;
  seen.add(k);
  uniq.push(h);
}

const byArea = {};
for (const h of uniq) {
  const area = h.file.split(/[\\/]/)[0] + "/" + h.file.split(/[\\/]/)[1];
  byArea[area] = (byArea[area] || 0) + 1;
}

fs.writeFileSync(
  "artifacts/id-ID-auditor-a-final-linguistic/hardcoded-en-chrome-hits.json",
  JSON.stringify({ total: uniq.length, byArea, sample: uniq.slice(0, 200) }, null, 2)
);
console.log(JSON.stringify({ total: uniq.length, byArea }, null, 2));
console.log("--- teacher sample ---");
uniq.filter((x) => x.file.includes("teacher")).slice(0, 25).forEach((x) => console.log(x.file + ":" + x.line + " " + x.text));
console.log("--- arcade sample ---");
uniq.filter((x) => x.file.includes("arcade")).slice(0, 30).forEach((x) => console.log(x.file + ":" + x.line + " " + x.text));
console.log("--- school sample ---");
uniq.filter((x) => x.file.includes("school")).slice(0, 20).forEach((x) => console.log(x.file + ":" + x.line + " " + x.text));
