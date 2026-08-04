/**
 * Finish remaining de-DE content: science (from authored topic JSONs),
 * then regenerate packs/books with expanded cache.
 * No external MT. No API agents.
 *
 *   node scripts/i18n/finish-de-DE-layer.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transformNode, translateEnToDeDe } from "./_de-DE-edu-translate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const AUTHORED = path.join(__dirname, "_de-DE-science-authored");
const CACHE_PATH = path.join(__dirname, "_de-DE-authored-cache.json");
const SENTENCE_CACHE = path.join(__dirname, "_de-DE-sentence-cache.json");

function loadJson(p, fallback = {}) {
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function walkFiles(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, pred, out);
    else if (pred(ent.name)) out.push(p);
  }
  return out;
}

async function writeScienceOverlay() {
  const mod = await import(
    pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href
  );
  const src = mod.SCIENCE_EN_OVERLAY;
  const authored = {};
  for (const f of fs.readdirSync(AUTHORED).filter((x) => x.endsWith(".json"))) {
    Object.assign(authored, loadJson(path.join(AUTHORED, f)));
  }
  const sentenceCache = loadJson(SENTENCE_CACHE);
  const out = {};
  let a = 0;
  let c = 0;
  let e = 0;
  for (const id of Object.keys(src)) {
    if (authored[id]) {
      out[id] = authored[id];
      a++;
      continue;
    }
    // Apply sentence cache field-by-field when available
    const q = src[id];
    const mapped = {
      stem: sentenceCache[q.stem] || null,
      options: (q.options || []).map((o) => sentenceCache[o] || null),
      explanation: sentenceCache[q.explanation] || null,
      theoryLines: (q.theoryLines || []).map((t) => sentenceCache[t] || null),
    };
    const complete =
      mapped.stem &&
      mapped.options.every(Boolean) &&
      mapped.explanation &&
      mapped.theoryLines.every(Boolean);
    if (complete) {
      out[id] = mapped;
      c++;
    } else {
      out[id] = q;
      e++;
    }
  }
  const body = `/** German (Germany) (de-DE) display overlay for science questions. */
export const SCIENCE_DE_DE_OVERLAY = ${JSON.stringify(out, null, 2)};
`;
  fs.writeFileSync(path.join(ROOT, "data/science-questions-de-DE-overlay.js"), body, "utf8");
  console.log(`[science] authored=${a} sentence-cache=${c} en-fallback=${e} total=${Object.keys(out).length}`);
  return { a, c, e };
}

function regeneratePacks() {
  const cache = { ...loadJson(CACHE_PATH), ...loadJson(SENTENCE_CACHE) };
  const domains = ["learning", "reports", "games", "books", "rewards", "global-burn-down", "demo"];
  const srcRoot = path.join(ROOT, "content-packs/en");
  const outRoot = path.join(ROOT, "content-packs/de-DE");
  let n = 0;
  for (const d of domains) {
    for (const file of walkFiles(path.join(srcRoot, d), (x) => x.endsWith(".json"))) {
      const rel = path.relative(srcRoot, file);
      const outFile = path.join(outRoot, rel);
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      const raw = JSON.parse(fs.readFileSync(file, "utf8"));
      fs.writeFileSync(outFile, `${JSON.stringify(transformNode(raw, { cache }), null, 2)}\n`);
      n++;
    }
  }
  console.log(`[packs] ${n}`);
}

const BOOK_SECTIONS = {
  "What are we learning?": "Was lernen wir?",
  "Simple explanation": "Einfache Erklärung",
  "Visual / concrete example": "Anschauliches / konkretes Beispiel",
  "Let's solve together": "Lass uns gemeinsam lösen",
  "Try it yourself": "Probiere es selbst",
  "Common mistake — watch out!": "Häufiger Fehler — Achtung!",
  "Common mistake - watch out!": "Häufiger Fehler — Achtung!",
  Metadata: "Metadaten",
  "Source references:": "Quellenverweise:",
  "Content scope:": "Inhaltsumfang:",
  Field: "Feld",
  Value: "Wert",
  Example: "Beispiel",
  Remember: "Merke dir",
  Practice: "Übung",
  "Today we're going to learn": "Heute lernen wir",
  "Today we will learn": "Heute lernen wir",
  "Today we're going to": "Heute ",
  "On the next page": "Auf der nächsten Seite",
  "Try to solve it on your own": "Versuch, es allein zu lösen",
  "Let's break it into easy steps": "Lass uns das in einfache Schritte zerlegen",
  "Start at": "Beginne bei",
  "So:": "Also:",
  "For example:": "Zum Beispiel:",
  "means \"and more\"": "bedeutet „und dazu“",
  "means \"that's the total\"": "bedeutet „das ist die Summe“",
  "Addition is when you put two groups together to make one bigger group.":
    "Addition bedeutet, dass du zwei Gruppen zusammenfügst und eine größere Gruppe erhältst.",
  "When you add — you put two amounts together.":
    "Wenn du addierst — fügst du zwei Mengen zusammen.",
  "Four and three more — together that's seven.": "Vier und drei dazu — zusammen sind das sieben.",
  "Still need to add": "Es fehlen noch",
  "First we add": "Zuerst addieren wir",
  "Adding in the Teens — Numbers from 11 to 19": "Addieren im Teenagerbereich — Zahlen von 11 bis 19",
  "to add numbers when the answer": "Zahlen zu addieren, wenn das Ergebnis",
  "Numbers from 11 to 19": "Zahlen von 11 bis 19",
  "No vertical addition, no carrying.": "Keine senkrechte Addition, kein Übertrag.",
  "Sum up to 20.": "Summe bis 20.",
  "Addition when the answer is in the range 11–19 (the teens).": "Addition, wenn das Ergebnis im Bereich 11–19 liegt (Zehnerplus).",
  "Today we're going to learn to add": "Heute lernen wir zu addieren",
  "Today we will learn to add": "Heute lernen wir zu addieren",
  "Heute lernen wir to add": "Heute lernen wir zu addieren",
  "Let's solve together": "Lass uns gemeinsam lösen",
  "Try it yourself": "Probiere es selbst",
  "Common mistake": "Häufiger Fehler",
  "watch out!": "Achtung!",
  "Simple explanation": "Einfache Erklärung",
  "Visual / concrete example": "Anschauliches / konkretes Beispiel",
  "What are we learning?": "Was lernen wir?",
};

function translateBookMarkdown(md, cache, protectEnglish) {
  let out = md;
  for (const [en, de] of Object.entries(BOOK_SECTIONS)) out = out.split(en).join(de);
  out = out.replace(/\bGrade ([1-6])\b/g, "$1. Klasse");
  out = out.replace(/\bdollars?\b/gi, "Euro");
  out = out.replace(/\bWorksheets\b/g, "Arbeitsblätter");
  out = out.replace(/\bWorksheet\b/g, "Arbeitsblatt");
  out = out.replace(/\bworksheets\b/g, "Arbeitsblätter");
  out = out.replace(/\bworksheet\b/g, "Arbeitsblatt");
  out = out.replace(/\bTeacher\b/g, "Lehrkraft");
  out = out.replace(/\bStudents\b/g, "Schülerinnen und Schüler");
  out = out.replace(/\bstudents\b/g, "Schülerinnen und Schüler");
  out = out
    .split(/\r?\n/)
    .map((line) => {
      if (!line.trim()) return line;
      if (/^```/.test(line)) return line;
      if (/^\|/.test(line) && /`/.test(line)) {
        return line
          .replace(/\bField\b/g, "Feld")
          .replace(/\bValue\b/g, "Wert")
          .replace(/\bMetadata\b/g, "Metadaten");
      }
      if (protectEnglish) {
        const t = line.trim();
        if (/^[a-z]+(?:_[a-z]+)*$/i.test(t) && t.length <= 24) return line;
        // Keep short English vocab lines in word lists
        if (/^[A-Za-z][A-Za-z' -]{0,20}$/.test(t) && !/\s{2,}/.test(t)) {
          // likely a learning target word/phrase — keep
          if (!/^(The|What|How|When|Why|Which|This|That|Today|Let's|Try|Start|First|Still|When|Addition|Four|Without|Leaves|Roots)/i.test(t)) {
            return line;
          }
        }
      }
      const trimmed = line.trim();
      if (cache[trimmed]) {
        const indent = line.match(/^(\s*)/)[1];
        return indent + cache[trimmed];
      }
      // heading lines
      const hm = line.match(/^(#{1,6}\s+)(.+)$/);
      if (hm && cache[hm[2]]) return hm[1] + cache[hm[2]];
      if (hm) {
        const tr = translateEnToDeDe(hm[2], { cache, protectEnglishTargets: protectEnglish });
        return hm[1] + tr;
      }
      // translate remaining prose via curated engine + cache
      if (/[A-Za-z]/.test(line) && !/^[-*]\s*`/.test(line) && !/^[-*]\s*docs\//.test(line) && !/^[-*]\s*data\//.test(line)) {
        const indent = line.match(/^(\s*)/)[1];
        const body = line.slice(indent.length);
        if (cache[body]) return indent + cache[body];
        return indent + translateEnToDeDe(body, { cache, protectEnglishTargets: protectEnglish });
      }
      return line;
    })
    .join("\n");
  return out.endsWith("\n") ? out : `${out}\n`;
}

function regenerateBooks() {
  const cache = { ...loadJson(CACHE_PATH), ...loadJson(SENTENCE_CACHE) };
  const srcRoot = path.join(ROOT, "docs/learning-book/en");
  const outRoot = path.join(ROOT, "docs/learning-book/de-DE");
  const files = walkFiles(srcRoot, (n) => n.endsWith(".md"));
  for (const file of files) {
    const rel = path.relative(srcRoot, file);
    const outFile = path.join(outRoot, rel);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    const protect = /(^|[\\/])english([\\/]|$)/i.test(rel);
    const md = fs.readFileSync(file, "utf8");
    fs.writeFileSync(outFile, translateBookMarkdown(md, cache, protect), "utf8");
  }
  console.log(`[books] ${files.length}`);
}

async function main() {
  await writeScienceOverlay();
  regeneratePacks();
  regenerateBooks();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
