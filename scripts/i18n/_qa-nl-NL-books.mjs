import fs from "node:fs";
import path from "node:path";

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (p.endsWith(".md")) acc.push(p);
  }
  return acc;
}

const ROOT = "docs/learning-book/nl-NL";
const files = walk(ROOT);
const GRADE = /\bGrade\s*[1-6]\b/;
const WISK = /\bWiskunde\b/;
const DRAFT = /\b(TODO|FIXME|TBD|\[draft\]|placeholder)\b/i;
// English instructional chrome outside english-subject learning targets
const EN_INSTR =
  /\b(Today we will|We already know|Let's|Read the|Write the|Circle the|Fill in|Complete the|Choose the|Look at|What are we learning|Practice tip|Try this|Answer key|Worksheet)\b/;
const HE = /[\u0590-\u05FF]/;

const stats = {
  files: files.length,
  grade: 0,
  wisk: 0,
  draft: 0,
  enInstr: 0,
  he: 0,
};
const samples = { grade: [], wisk: [], draft: [], enInstr: [], he: [] };

function add(bucket, file, line, max = 20) {
  stats[bucket]++;
  if (samples[bucket].length < max) samples[bucket].push({ file, line: line.trim().slice(0, 160) });
}

for (const file of files) {
  const rel = file.replace(/\\/g, "/");
  const isEnglishSubject = /\/english\//.test(rel);
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    if (GRADE.test(line)) add("grade", rel, line);
    if (WISK.test(line)) add("wisk", rel, line);
    if (DRAFT.test(line)) add("draft", rel, line);
    if (HE.test(line)) add("he", rel, line);
    // For english subject: allow English example sentences, but flag chrome headings still in EN
    if (EN_INSTR.test(line)) {
      if (!isEnglishSubject) add("enInstr", rel, line);
      else if (/^(#+\s*)?(What are we learning|Today we will|Practice tip|Try this)/i.test(line.trim())) {
        add("enInstr", rel, line);
      }
    }
  }
}

const bySubject = {};
for (const f of files) {
  const parts = f.replace(/\\/g, "/").split("/");
  const subj = parts[parts.indexOf("nl-NL") + 1] || "?";
  bySubject[subj] = (bySubject[subj] || 0) + 1;
}

const out = { stats, bySubject, samples };
fs.writeFileSync("scripts/i18n/_qa-books-report.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify({ stats, bySubject, sampleCounts: Object.fromEntries(Object.entries(samples).map(([k, v]) => [k, v.length])) }, null, 2));
