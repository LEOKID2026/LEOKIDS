/**
 * Rebuild docs/learning-book/de-DE from EN with German book-line translator + residue map.
 * No external MT. Protects English educational targets on english/ paths.
 *
 *   node scripts/i18n/_rebuild-de-DE-books.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translateBookLineDe, stillEnglishInstructional, EXACT } from "./_de-DE-book-line.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EN_DIR = path.join(ROOT, "docs/learning-book/en");
const OUT_DIR = path.join(ROOT, "docs/learning-book/de-DE");
const RESIDUE_MAP = path.join(__dirname, "_de-DE-book-residue-map.json");
const LINES = path.join(__dirname, "_de-DE-book-en-lines.json");

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

function loadJson(p, fb = {}) {
  if (!fs.existsSync(p)) return fb;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const MANUAL = loadJson(RESIDUE_MAP, {});
const MAP = { ...EXACT, ...MANUAL };

// Seed map from unique lines via phrase engine (exact MANUAL wins)
const lines = loadJson(LINES, []);
for (const row of lines) {
  const en = row.en;
  if (!en || MAP[en]) continue;
  const de = translateBookLineDe(en);
  MAP[en] = de;
}
fs.writeFileSync(path.join(__dirname, "_de-DE-book-full-map.json"), JSON.stringify(MAP));

function protect(s) {
  const ph = [];
  let out = String(s).replace(/```[\s\S]*?```/g, (block) => {
    ph.push(block);
    return `\u27E6B${ph.length - 1}\u27E7`;
  });
  out = out.replace(/`([^`]+)`/g, (_, code) => {
    ph.push("`" + code + "`");
    return `\u27E6C${ph.length - 1}\u27E7`;
  });
  return { text: out, ph };
}
function restore(s, ph) {
  return String(s)
    .replace(/\u27E6B(\d+)\u27E7/g, (_, i) => ph[Number(i)])
    .replace(/\u27E6C(\d+)\u27E7/g, (_, i) => ph[Number(i)]);
}

function isMetaIdLine(line) {
  return /\|\s*\*\*(learning_page_id|skill_id|subject|grade|age_band|page_type|approval_status|title_english)\*\*/i.test(
    line
  );
}

function isEnglishTargetLine(line) {
  const t = line.trim();
  if (!t) return false;
  if (/^[A-Za-z][A-Za-z' -]{0,24}$/.test(t) && !/\s{2,}/.test(t)) return true;
  if (/^"[A-Za-z]/.test(t) || /^'[A-Za-z]/.test(t)) return true;
  if (/^[\d\s+\-×÷=/?.,…]+$/.test(t)) return true;
  return false;
}

function translateLine(line, { englishSubject }) {
  if (!line.trim()) return line;
  const trimmed0 = line.trim();
  // Full-line residue / exact map wins before meta short-circuit (title_english etc.)
  if (MAP[trimmed0]) return line.replace(trimmed0, MAP[trimmed0]);
  if (isMetaIdLine(line)) {
    let out = line
      .replace(/\|\s*\*\*subject\*\*\s*\|\s*math\s*\|/i, "| **subject** | Mathematik |")
      .replace(/\|\s*\*\*subject\*\*\s*\|\s*geometry\s*\|/i, "| **subject** | Geometrie |")
      .replace(/\|\s*\*\*subject\*\*\s*\|\s*science\s*\|/i, "| **subject** | Naturwissenschaften |")
      .replace(/\|\s*\*\*grade\*\*/i, "| **Klasse**")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_1_2\s*\|/i, "| **age_band** | Klassen_1_2 |")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_3_4\s*\|/i, "| **age_band** | Klassen_3_4 |")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_5_6\s*\|/i, "| **age_band** | Klassen_5_6 |")
      .replace(/\|\s*\*\*Field\*\*/gi, "| **Feld**")
      .replace(/\|\s*\*\*Value\*\*/gi, "| **Wert**")
      .replace(/\bGrade\s*([1-6])\b/g, "$1. Klasse")
      .replace(/`\[DRAFT — not owner-approved\]`/g, "`[ENTWURF — nicht freigegeben]`");
    // Translate title_english value cell when whole-line map missed
    if (/\|\s*\*\*title_english\*\*\s*\|/i.test(out)) {
      out = out.replace(
        /(\|\s*\*\*title_english\*\*\s*\|\s*)([^|]+?)(\s*\|)/i,
        (_, a, title, c) => {
          const t = title.trim();
          if (MAP[t]) return `${a}${MAP[t]}${c}`;
          const de = translateBookLineDe(t)
            .replace(/\bGrade\s*([1-6])\b/g, "$1. Klasse")
            .replace(/`\[DRAFT — not owner-approved\]`/g, "`[ENTWURF — nicht freigegeben]`");
          return `${a}${de}${c}`;
        }
      );
    }
    return out;
  }
  if (/^\|\s*[-:| ]+\s*\|?\s*$/.test(line)) return line;
  const trimmed = line.trim();
  if (MAP[trimmed]) return line.replace(trimmed, MAP[trimmed]);
  if (englishSubject && isEnglishTargetLine(line)) return line;
  if (
    englishSubject &&
    /^(A |An |The |We hear|We say|It's |It is |What is a |Door means|Think — a |In English)/i.test(trimmed) &&
    !/^(What are we learning|Today we|Try to solve|On the next|Now you know|Useful words|Simple explanation|Common mistake|Visual)/i.test(
      trimmed
    )
  ) {
    return line;
  }
  const { text, ph } = protect(line);
  let out = translateBookLineDe(text);
  for (const [en, de] of Object.entries(MAP)) {
    if (en.length >= 24 && out.includes(en)) out = out.split(en).join(de);
  }
  return restore(out, ph);
}

function convert(md, { englishSubject }) {
  return md
    .split(/(```[\s\S]*?```)/g)
    .map((part) => {
      if (part.startsWith("```")) return part;
      return part
        .split(/(\n)/)
        .map((line) => (line === "\n" ? line : translateLine(line, { englishSubject })))
        .join("");
    })
    .join("");
}

let n = 0;
for (const enFile of walk(EN_DIR)) {
  const rel = path.relative(EN_DIR, enFile);
  const dest = path.join(OUT_DIR, rel);
  const md = fs.readFileSync(enFile, "utf8");
  const englishSubject = rel.replace(/\\/g, "/").startsWith("english/");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, convert(md, { englishSubject }), "utf8");
  n++;
}

// Residue report from MAP for next manual round
const still = Object.entries(MAP).filter(([, de]) => stillEnglishInstructional(de));
fs.writeFileSync(
  path.join(__dirname, "_de-DE-book-residue-pending.json"),
  JSON.stringify(
    still.slice(0, 3000).map(([en, de]) => ({ en, de })),
    null,
    2
  )
);
console.log({ wrote: n, mapSize: Object.keys(MAP).length, stillEnglish: still.length });
