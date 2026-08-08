/**
 * Classify unique EN book lines for id-ID translation planning.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.join(ROOT, "artifacts/id-ID-phase8");
const EN = path.join(OUT, "en-sot");
const lines = JSON.parse(fs.readFileSync(path.join(OUT, "unique-lines.json"), "utf8"));

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

/** Which subjects contain each line */
const lineSubjects = new Map();
for (const f of walk(EN)) {
  const rel = path.relative(EN, f).replace(/\\/g, "/");
  const subject = rel.split("/")[0];
  const text = fs.readFileSync(f, "utf8");
  for (const raw of text.split(/\r?\n/)) {
    const en = raw.trim();
    if (!en) continue;
    if (!lineSubjects.has(en)) lineSubjects.set(en, new Set());
    lineSubjects.get(en).add(subject);
  }
}

function isFormulaOrToken(t) {
  if (/^```/.test(t)) return true;
  if (/^\|\s*[-:| ]+\s*\|?\s*$/.test(t)) return true;
  if (/^[\d\s+\-×÷=*/?.,…()\[\]{}%°:]+$/.test(t)) return true;
  if (/^`[^`]+`$/.test(t)) return true;
  if (/^:::/.test(t)) return true;
  if (/^[-*]\s*`[^`]+`\s*$/.test(t)) return true;
  if (/learning_page_id|skill_id/.test(t) && /\|/.test(t)) return true;
  // path bullets
  if (/^-\s*`?(data|docs|lib|utils|content-packs)\//.test(t)) return true;
  return false;
}

function isLikelyEnglishLearningTarget(t, subjects) {
  if (!subjects.has("english")) return false;
  if (subjects.size > 1 && (subjects.has("math") || subjects.has("geometry") || subjects.has("science"))) {
    // shared chrome — not a target
    return false;
  }
  // short lexical items
  if (/^[A-Za-z][A-Za-z' -]{0,28}$/.test(t) && !/\b(the|and|with|from|what|when|how|today|learn|try|solve)\b/i.test(t)) {
    return true;
  }
  if (/^"[A-Za-z]/.test(t) || /^'[A-Za-z]/.test(t)) return true;
  if (/In English we say:/i.test(t)) return false; // chrome
  if (/means /i.test(t) && t.split(/\s+/).length <= 6) return true;
  return false;
}

const buckets = {
  protect: [],
  english_target: [],
  chrome: [],
  title: [],
  prose: [],
};

for (const { en, n } of lines) {
  const subjects = lineSubjects.get(en) || new Set();
  if (isFormulaOrToken(en)) {
    buckets.protect.push({ en, n });
    continue;
  }
  if (isLikelyEnglishLearningTarget(en, subjects)) {
    buckets.english_target.push({ en, n, subjects: [...subjects] });
    continue;
  }
  if (
    /^#{1,6}\s/.test(en) ||
    /^\*\*(Source references|Content scope|Date):/i.test(en) ||
    /^\| Field \| Value \|/.test(en) ||
    /^\| File \| Draft title \|/.test(en) ||
    /^Try to solve/i.test(en) ||
    /^On the next page/i.test(en) ||
    /^Try it yourself/i.test(en)
  ) {
    buckets.chrome.push({ en, n });
    continue;
  }
  if (/^#\s[^#]/.test(en)) {
    buckets.title.push({ en, n });
    continue;
  }
  buckets.prose.push({ en, n, subjects: [...subjects] });
}

const summary = Object.fromEntries(
  Object.entries(buckets).map(([k, v]) => [k, v.length])
);

fs.writeFileSync(path.join(OUT, "line-classification.json"), JSON.stringify({ summary, buckets }, null, 2));
console.log(summary);
