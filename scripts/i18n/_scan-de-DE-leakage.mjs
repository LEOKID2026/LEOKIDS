/** Scan de-DE content for English instructional leakage. */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(ent.name, p)) out.push(p);
  }
  return out;
}

const EN_FUNC =
  /\b(the|and|with|that|which|without|because|through|into|about|their|they|this|these|those|would|could|should|from|have|been|being|does|make|makes|help|helps|need|needs|what|when|where|how|why|for|into|over|under|after|before|during|against|around|only|also|more|most|other|than|then|each|every)\b/gi;

function isEnglishSubject(p) {
  return /[\\/]english[\\/]/i.test(p);
}

function scanBooks() {
  const files = walk(path.join(ROOT, "docs/learning-book/de-DE"), (n) => n.endsWith(".md"));
  const by = {};
  let heavy = 0;
  const samples = [];
  for (const f of files) {
    const rel = path.relative(path.join(ROOT, "docs/learning-book/de-DE"), f);
    const subj = rel.split(path.sep)[0];
    by[subj] = (by[subj] || 0) + 1;
    if (isEnglishSubject(f)) continue;
    const t = fs.readFileSync(f, "utf8");
    const prose = t
      .replace(/`[^`]+`/g, "")
      .replace(/^\|.*\|$/gm, "")
      .replace(/https?:\/\/\S+/g, "");
    const hits = (prose.match(EN_FUNC) || []).length;
    const grade = /\bGrade\s*[1-6]\b/.test(prose);
    if (hits > 12 || grade) {
      heavy++;
      if (samples.length < 10) samples.push({ rel, hits, grade });
    }
  }
  return { files: files.length, by, heavyNonEnglish: heavy, samples };
}

function scanScience() {
  const modPath = path.join(ROOT, "data/science-questions-de-DE-overlay.js");
  const text = fs.readFileSync(modPath, "utf8");
  // crude: count English function words outside strings is hard; import instead
  return text.length;
}

const books = scanBooks();
console.log(JSON.stringify(books, null, 2));
console.log("english books", walk(path.join(ROOT, "docs/learning-book/de-DE"), (n, p) => n.endsWith(".md") && isEnglishSubject(p)).length);
