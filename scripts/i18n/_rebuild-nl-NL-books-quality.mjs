/**
 * Rebuild docs/learning-book/nl-NL (non-English subjects) from EN with quality translator
 * + exact maps (round2 + hard curated).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translateBookQualityNl, stillEnglishBookLine } from "./_nl-NL-book-quality.mjs";
import { translateBookLineNl } from "./_nl-NL-book-line.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EN_DIR = path.join(ROOT, "docs/learning-book/en");
const OUT_DIR = path.join(ROOT, "docs/learning-book/nl-NL");

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

const ROUND2 = JSON.parse(fs.readFileSync(path.join(__dirname, "_book-residue-round2.json"), "utf8"));
const HARD = JSON.parse(fs.readFileSync(path.join(__dirname, "_nl-NL-book-hard-en.json"), "utf8"));
const EXTRA = fs.existsSync(path.join(__dirname, "_nl-NL-book-hard-map.json"))
  ? JSON.parse(fs.readFileSync(path.join(__dirname, "_nl-NL-book-hard-map.json"), "utf8"))
  : {};

// EXTRA (curated hard map) wins over ROUND2 and auto quality.
const MAP = { ...ROUND2 };
for (const { en } of HARD) {
  if (EXTRA[en]) {
    MAP[en] = EXTRA[en];
    continue;
  }
  if (!MAP[en]) {
    const q = translateBookQualityNl(en);
    MAP[en] = !stillEnglishBookLine(q) ? q : translateBookLineNl(en);
    if (stillEnglishBookLine(MAP[en]) && !stillEnglishBookLine(q)) MAP[en] = q;
  }
}
Object.assign(MAP, EXTRA);

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

function translateLine(line, { englishSubject }) {
  if (!line.trim()) return line;
  if (isMetaIdLine(line)) {
    return line
      .replace(/\|\s*\*\*subject\*\*\s*\|\s*math\s*\|/i, "| **subject** | rekenen |")
      .replace(/\|\s*\*\*grade\*\*/i, "| **groep**")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_1_2\s*\|/i, "| **age_band** | groepen_3_4 |")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_3_4\s*\|/i, "| **age_band** | groepen_5_6 |")
      .replace(/\|\s*\*\*age_band\*\*\s*\|\s*grades_5_6\s*\|/i, "| **age_band** | groepen_7_8 |");
  }
  if (/^\|\s*[-:| ]+\s*\|?\s*$/.test(line)) return line;
  const trimmed = line.trim();
  if (englishSubject) return line;
  if (MAP[trimmed]) return line.replace(trimmed, MAP[trimmed]);
  const { text, ph } = protect(line);
  let out = translateBookQualityNl(text);
  if (stillEnglishBookLine(out)) out = translateBookLineNl(out);
  // longest exact substrings from MAP
  const keys = Object.keys(MAP).sort((a, b) => b.length - a.length);
  for (const en of keys) {
    if (en.length < 24) continue;
    if (out.includes(en)) out = out.split(en).join(MAP[en]);
  }
  return restore(out, ph);
}

function convert(md) {
  return md
    .split(/(```[\s\S]*?```)/g)
    .map((part) => {
      if (part.startsWith("```")) return part;
      return part
        .split(/(\n)/)
        .map((line) => (line === "\n" ? line : translateLine(line, { englishSubject: false })))
        .join("");
    })
    .join("");
}

let wrote = 0;
for (const enFile of walk(EN_DIR)) {
  const rel = path.relative(EN_DIR, enFile);
  if (rel.replace(/\\/g, "/").startsWith("english/")) continue;
  const dest = path.join(OUT_DIR, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, convert(fs.readFileSync(enFile, "utf8")), "utf8");
  wrote++;
}

// persist map for inspection / next curated pass
fs.writeFileSync(path.join(__dirname, "_nl-NL-book-hard-map.json"), JSON.stringify(MAP, null, 2));

const BAD =
  /\b(What |There is |There are |Today |Let's |Try it|On the next|In practice you'll|How many|How much|How do|A solid|A shape|A square|A rectangle|A triangle|We move|We get|We turn|Check the|Always check|missing number|rectangular prism|mirror image|swap places|Content scope:|calculate the|does it |faces that|Approved Hebrew|What is the|what is the)\b/i;

let remainFiles = 0;
const remainLines = [];
const stillMap = Object.entries(MAP).filter(([, nl]) => stillEnglishBookLine(nl));
for (const f of walk(OUT_DIR)) {
  if (f.includes(`${path.sep}english${path.sep}`)) continue;
  if (f.endsWith("README.md")) continue;
  const lines = fs.readFileSync(f, "utf8").split(/\n/);
  let hit = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("title_english") || lines[i].trim().startsWith("```")) continue;
    if (BAD.test(lines[i])) {
      hit = true;
      if (remainLines.length < 60) {
        remainLines.push(`${f.replace(/\\/g, "/")}:${i + 1} | ${lines[i].trim().slice(0, 140)}`);
      }
    }
  }
  if (hit) remainFiles++;
}

console.log(
  JSON.stringify(
    {
      wrote,
      mapSize: Object.keys(MAP).length,
      stillMap: stillMap.length,
      remainFiles,
      remainSample: remainLines.slice(0, 40),
      stillSample: stillMap.slice(0, 20).map(([e, n]) => ({ e: e.slice(0, 90), n: n.slice(0, 90) })),
    },
    null,
    2
  )
);
