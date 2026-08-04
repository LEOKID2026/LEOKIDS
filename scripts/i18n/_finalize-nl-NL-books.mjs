/**
 * Finalize nl-NL learning books: remove Hebrew chrome, map Grade→Groep,
 * keep English-subject learning targets/examples intact.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const DIR = path.join(ROOT, "docs/learning-book/nl-NL");

function walk(d, files = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith(".md")) files.push(p);
  }
  return files;
}

const GRADE_MAP = [
  [/\bGrade\s*1\b/g, "Groep 3"],
  [/\bGrade\s*2\b/g, "Groep 4"],
  [/\bGrade\s*3\b/g, "Groep 5"],
  [/\bGrade\s*4\b/g, "Groep 6"],
  [/\bGrade\s*5\b/g, "Groep 7"],
  [/\bGrade\s*6\b/g, "Groep 8"],
  [/\bYear\s*1\b/g, "Groep 3"],
  [/\bYear\s*2\b/g, "Groep 4"],
  [/\bYear\s*3\b/g, "Groep 5"],
  [/\bYear\s*4\b/g, "Groep 6"],
  [/\bYear\s*5\b/g, "Groep 7"],
  [/\bYear\s*6\b/g, "Groep 8"],
  [/\bWiskunde\b/g, "Rekenen"],
  [/\bgrades_1_2\b/g, "groepen_3_4"],
  [/\bgrades_3_4\b/g, "groepen_5_6"],
  [/\bgrades_5_6\b/g, "groepen_7_8"],
];

const HE_CHROME = [
  [/ספר אנגלית — כיתה א׳/g, "Engels — Groep 3"],
  [/ספר אנגלית — כיתה ב׳/g, "Engels — Groep 4"],
  [/ספר אנגלית — כיתה ג׳/g, "Engels — Groep 5"],
  [/ספר אנגלית — כיתה ד׳/g, "Engels — Groep 6"],
  [/ספר אנגלית — כיתה ה׳/g, "Engels — Groep 7"],
  [/ספר אנגלית — כיתה ו׳/g, "Engels — Groep 8"],
  [/ספר מתמטיקה/g, "Rekenen-boek"],
  [/ספר גאומטריה/g, "Meetkunde-boek"],
  [/ספר מדעים/g, "Natuur-en-techniekboek"],
  [/כיתה א[׳']/g, "Groep 3"],
  [/כיתה ב[׳']/g, "Groep 4"],
  [/כיתה ג[׳']/g, "Groep 5"],
  [/כיתה ד[׳']/g, "Groep 6"],
  [/כיתה ה[׳']/g, "Groep 7"],
  [/כיתה ו[׳']/g, "Groep 8"],
  [/\*\*אנגלית\*\*/g, "**Engels**"],
  [/\*\*מתמטיקה\*\*/g, "**Rekenen**"],
  [/\*\*גאומטריה\*\*/g, "**Meetkunde**"],
  [/\*\*מדעים\*\*/g, "**Natuur en techniek**"],
  [/אוצר מילים/g, "woordenschat"],
  [/דקדוק/g, "grammatica"],
  [/כתיבה/g, "schrijven"],
  [/קריאה/g, "lezen"],
  [/תרגום/g, "vertaling"],
];

let changedFiles = 0;
let heRemoved = 0;
for (const file of walk(DIR)) {
  const rel = file.replace(/\\/g, "/");
  const isEnglishSubject = rel.includes("/english/");
  let text = fs.readFileSync(file, "utf8");
  const before = text;

  for (const [re, rep] of HE_CHROME) text = text.replace(re, rep);
  // Grade mapping in chrome / titles — also for English subject display labels
  for (const [re, rep] of GRADE_MAP) {
    // Keep quoted English learning examples in english subject pages
    if (isEnglishSubject) {
      // Only map Grade in headings/metadata, not inside fenced code or pure example lines with English targets
      text = text
        .split(/\r?\n/)
        .map((line) => {
          if (line.trim().startsWith("```")) return line;
          if (/^\|\s*\*\*learning_page_id\*\*/.test(line) || /^\|\s*\*\*skill_id\*\*/.test(line)) return line;
          if (/title_english/i.test(line)) return line;
          if (/^#{1,6}\s+/.test(line) || /\*\*Status:\*\*|\*\*Book title:\*\*|Child-facing subject|Folder:|Batch /.test(line)) {
            let l = line;
            for (const [r, p] of GRADE_MAP) l = l.replace(r, p);
            return l;
          }
          // Map leftover Grade N outside protected English examples
          if (/\bGrade\s*[1-6]\b/.test(line) && !/`[^`]*Grade/.test(line)) {
            let l = line;
            for (const [r, p] of GRADE_MAP) l = l.replace(r, p);
            return l;
          }
          return line;
        })
        .join("\n");
    } else {
      text = text.replace(re, rep);
    }
  }

  if (!isEnglishSubject) {
    const heCount = (text.match(/[\u0590-\u05FF]/g) || []).length;
    if (heCount) {
      text = text.replace(/[\u0590-\u05FF]+/g, "");
      heRemoved += heCount;
      text = text.replace(/[ \t]{2,}/g, " ").replace(/ \n/g, "\n");
    }
  } else {
    // English subject: remove remaining Hebrew chrome tokens only (not Latin educational targets)
    const heCount = (text.match(/[\u0590-\u05FF]/g) || []).length;
    if (heCount) {
      text = text.replace(/[\u0590-\u05FF]+/g, "");
      heRemoved += heCount;
      text = text.replace(/[ \t]{2,}/g, " ").replace(/ \n/g, "\n");
    }
  }

  if (text !== before) {
    fs.writeFileSync(file, text, "utf8");
    changedFiles++;
  }
}

console.log({ changedFiles, heRemoved, total: walk(DIR).length });
