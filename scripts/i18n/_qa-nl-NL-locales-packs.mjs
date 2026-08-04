import fs from "node:fs";
import path from "node:path";

function walk(d, acc = []) {
  if (!fs.existsSync(d)) return acc;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function collectStrings(node, out = [], key = "") {
  if (node == null) return out;
  if (typeof node === "string") {
    out.push({ key, s: node });
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => collectStrings(v, out, `${key}[${i}]`));
    return out;
  }
  if (typeof node === "object") {
    for (const [k, v] of Object.entries(node)) collectStrings(v, out, key ? `${key}.${k}` : k);
  }
  return out;
}

const EN_CHROME =
  /\b(Welcome to|How do I|Create worksheet|Answer key|All grades|Select a grade|Sign in|Log in|Click here|Loading\.\.\.|Try again|Continue|Next|Back|Save|Cancel|Delete|Settings|Dashboard|Teacher|Student|Parent|Math|Geometry|Science|English|Grade [1-6]|Creating |difficulty levels)\b/;
const WISK = /\bWiskunde\b/;
const GRADE = /\bGrade\s*[1-6]\b/;
const JE_U_MIX = /\b(je|jij|jouw)\b.*\b(uw|u)\b|\b(uw|u)\b.*\b(je|jij|jouw)\b/i;
const MIXED_CORRUPT = /\b(Weent|eeenr|reenpport|peenge|neeneenr|leeenr)\b/;
const WETENSCHAP = /\bwetenschap\b/i;

function scanFile(file, kind) {
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    return [];
  }
  let strings = [];
  if (file.endsWith(".json")) {
    try {
      strings = collectStrings(JSON.parse(text));
    } catch {
      return [{ kind, file, issue: "JSON_PARSE_FAIL", s: "" }];
    }
  } else {
    strings = [{ key: "raw", s: text }];
  }
  const hits = [];
  for (const { key, s } of strings) {
    if (!s || !s.trim()) continue;
    if (MIXED_CORRUPT.test(s)) hits.push({ kind, file, key, issue: "corrupt", s: s.slice(0, 140) });
    if (WISK.test(s)) hits.push({ kind, file, key, issue: "Wiskunde", s: s.slice(0, 140) });
    if (GRADE.test(s)) hits.push({ kind, file, key, issue: "Grade", s: s.slice(0, 140) });
    if (EN_CHROME.test(s) && !/Leo Kids|Copilot|PIN|PDF|PWA|arcade/i.test(s.split(" ")[0] || "")) {
      // allow Math as part of already-Dutch? Flag raw English chrome
      if (
        /\b(Welcome to|How do I|Create worksheet|Answer key|All grades|Select a grade|Creating |difficulty levels|Sign in with|Click here)\b/.test(
          s,
        ) ||
        /\bGrade\s*[1-6]\b/.test(s)
      ) {
        hits.push({ kind, file, key, issue: "EN_chrome", s: s.slice(0, 140) });
      }
    }
    if (WETENSCHAP.test(s) && !/natuur en techniek/i.test(s)) {
      hits.push({ kind, file, key, issue: "wetenschap", s: s.slice(0, 140) });
    }
    if (JE_U_MIX.test(s)) hits.push({ kind, file, key, issue: "je_u_mix", s: s.slice(0, 140) });
  }
  return hits;
}

const localeFiles = walk("locales/nl-NL").filter((f) => f.endsWith(".json"));
const packFiles = walk("content-packs/nl-NL").filter((f) => f.endsWith(".json"));

const localeHits = localeFiles.flatMap((f) => scanFile(f, "locale"));
const packHits = packFiles.flatMap((f) => scanFile(f, "pack"));

function tally(hits) {
  const t = {};
  for (const h of hits) t[h.issue] = (t[h.issue] || 0) + 1;
  return t;
}

const out = {
  locales: localeFiles.length,
  packs: packFiles.length,
  localeTally: tally(localeHits),
  packTally: tally(packHits),
  localeHits: localeHits.slice(0, 80),
  packHits: packHits.slice(0, 80),
};
fs.writeFileSync("scripts/i18n/_qa-locales-packs-report.json", JSON.stringify(out, null, 2));
console.log(
  JSON.stringify(
    {
      locales: out.locales,
      packs: out.packs,
      localeTally: out.localeTally,
      packTally: out.packTally,
      localeHitCount: localeHits.length,
      packHitCount: packHits.length,
    },
    null,
    2,
  ),
);
