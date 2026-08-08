/**
 * Audit unexplained English prose in id-ID learning books.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isEnglishLearningTargetLine, stillEnglishInstructional } from "./id-book-engine.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ID = path.join(ROOT, "docs/learning-book/id-ID");

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

function isProtected(t) {
  if (!t.trim()) return true;
  if (/^```/.test(t)) return true;
  if (/^\|\s*[-:| ]+\s*\|?\s*$/.test(t)) return true;
  if (/^[\d\s+\-×÷=*/?.,…()\[\]{}%°:<>≤≥≠≈∞√πRp]+$/.test(t)) return true;
  if (/^`[^`]+`$/.test(t)) return true;
  if (/^:::/.test(t)) return true;
  if (/^[-*]\s*`[^`]+`\s*$/.test(t)) return true;
  if (/^-\s*`?(data|docs|lib|utils|content-packs|scripts)\//.test(t)) return true;
  if (/^\|/.test(t) && /\|\s*\*\*(learning_page_id|skill_id|grade|age_band|page_type|approval_status|title_english)\*\*/i.test(t))
    return true;
  if (/^(type|width|height|unit|label|labels|points|show|fill|stroke)\s*:/i.test(t)) return true;
  if (/[=+\-×÷]/.test(t) && !/[A-Za-z]{4,}/.test(t)) return true;
  // formula-ish retained
  if (/^(Area|Perimeter|Volume|Diagonal|Distance|Base area|Luas|Keliling)\s*=/.test(t)) return true;
  return false;
}

const findings = [];
let scanned = 0;
for (const f of walk(ID)) {
  const rel = path.relative(ID, f).replace(/\\/g, "/");
  const englishSubject = rel.startsWith("english/");
  const isReadme = /\/README\.md$/i.test(rel);
  const text = fs.readFileSync(f, "utf8");
  let lineNo = 0;
  for (const raw of text.split(/\r?\n/)) {
    lineNo += 1;
    scanned += 1;
    const t = raw.trim();
    if (!t || isProtected(t)) continue;
    if (englishSubject && isEnglishLearningTargetLine(t)) continue;
    // intentional English-learning chrome cues
    if (englishSubject && /^(In English we say:|Dalam bahasa Inggris kita bilang:)/i.test(t)) continue;

    const hasLatinWord = /\b[A-Za-z]{3,}\b/.test(t);
    if (!hasLatinWord) continue;

    // Allow proper nouns / units / tokens
    const cleaned = t
      .replace(/\b(cm|mm|km|kg|g|ml|l|Rp|GCF|FPB|KPK|PDF|SQL|CTA|ID|URL|http|https|www)\b/gi, "")
      .replace(/`[^`]+`/g, "")
      .replace(/\b[A-Z]{2,}\b/g, "") // acronyms
      .replace(/\b(Noah|Danny|Dana|Mia|Amir|Noa|ABCD|AB|BC)\b/g, "");

    if (!stillEnglishInstructional(cleaned) && !/\b(the|and|with|that|which|because|from|have|been|does|make|what|when|where|how|why|for|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|is|like|has|not|today|learn|find|using|about|into|this|these|those|they|their)\b/i.test(cleaned)) {
      continue;
    }

    // If mostly Indonesian already, skip mild leftovers of technical tokens
    const idHits = (cleaned.match(/\b(kamu|kita|berapa|hitung|belajar|jumlah|kelas|contoh|langkah|hari|mari|bilangan|persegi|sudut|luas|yang|dari|untuk|dengan|adalah|tidak|atau)\b/gi) || []).length;
    const enHits = (cleaned.match(/\b(the|and|with|that|what|when|how|you|your|will|are|is|this|these|today|learn|find|about)\b/gi) || []).length;
    if (idHits >= 2 && enHits <= 1) continue;

    findings.push({
      file: rel,
      line: lineNo,
      text: t.slice(0, 200),
      bucket: englishSubject ? "english" : isReadme ? "readme" : "mgs",
    });
  }
}

const byBucket = findings.reduce((a, f) => {
  a[f.bucket] = (a[f.bucket] || 0) + 1;
  return a;
}, {});

fs.writeFileSync(
  path.join(ROOT, "artifacts/id-ID-phase8/english-residue-audit.json"),
  JSON.stringify(
    {
      scannedLines: scanned,
      unexplained: findings.length,
      byBucket,
      sample: findings.slice(0, 80),
    },
    null,
    2
  )
);
console.log(JSON.stringify({ scannedLines: scanned, unexplained: findings.length, byBucket }, null, 2));
