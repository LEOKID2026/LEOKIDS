/**
 * Read-only auditor scan: learning-book id-ID EN/HE residue (product drafts).
 * Excludes drafts README Hebrew notes (docs-only).
 */
import fs from "fs";
import path from "path";

const HEB = /[\u0590-\u05FF]/;
const EN_PROSE =
  /\b(the|and|you|your|please|click|select|choose|correct|incorrect|try again|answer|question|explain|because|which|what|how many|write|read|look at|before you|step \d)\b/i;
const ID_MARK =
  /\b(yang|dan|atau|untuk|dengan|adalah|pilih|jawab|soal|berapa|hitung|bentuk|langkah|sebelum|sesudah|benar|salah|kamu|jelaskan)\b/i;

const root = "docs/learning-book/id-ID";
const findings = {
  hebProduct: [],
  hebDraftReadmeOnly: [],
  enProseSample: [],
  fileCounts: {},
  totalMd: 0,
};

function walk(d, subject) {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) {
      walk(p, subject || ent.name);
      continue;
    }
    if (!/\.(md|json)$/i.test(ent.name)) continue;
    const isDraftReadme = p.includes(`${path.sep}drafts${path.sep}`) && /README/i.test(ent.name);
    const t = fs.readFileSync(p, "utf8");
    findings.totalMd += 1;
    findings.fileCounts[subject] = (findings.fileCounts[subject] || 0) + 1;
    if (HEB.test(t)) {
      if (isDraftReadme) findings.hebDraftReadmeOnly.push(p);
      else findings.hebProduct.push(p);
    }
    if (subject === "english" || isDraftReadme) continue;
    const lines = t.split(/\r?\n/);
    for (const line of lines) {
      const m = line.match(/"([^"]{20,})"/);
      if (!m) continue;
      const text = m[1];
      if (!EN_PROSE.test(text)) continue;
      if (ID_MARK.test(text)) continue;
      if (!/[A-Za-z]{4,}\s+[A-Za-z]{4,}/.test(text)) continue;
      findings.enProseSample.push({ file: p, text: text.slice(0, 160) });
      if (findings.enProseSample.length >= 100) return;
    }
  }
}

if (fs.existsSync(root)) walk(root);
const out = "artifacts/id-ID-auditor-a-final-linguistic/learning-book-en-prose.json";
fs.writeFileSync(out, JSON.stringify(findings, null, 2));
console.log(JSON.stringify({
  totalMd: findings.totalMd,
  fileCounts: findings.fileCounts,
  hebProduct: findings.hebProduct.length,
  hebDraftReadmeOnly: findings.hebDraftReadmeOnly.length,
  enProseSample: findings.enProseSample.length,
  hebProductFiles: findings.hebProduct.slice(0, 20),
  enSamples: findings.enProseSample.slice(0, 25),
}, null, 2));
