/**
 * American English quality guards for Global EN SSOT sources.
 * Complementary to linguistic review — not a substitute.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  AMERICAN_ENGLISH_GLOSSARY,
  FORBIDDEN_BRITISH_PATTERNS,
  FORBIDDEN_CALQUE_PATTERNS,
  HEBREW_CHAR_RE,
} from "../../lib/i18n/american-english-glossary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const SCAN_DIRS = [
  "locales/en",
  "content-packs/en",
];

const CODE_LEAK_RE =
  /\breturn\s*\(|\buseMemo\s*\(|\.filter\s*\(\s*Boolean\s*\)|pr1ParentVisibleTextHe|buildSubjectParentLetter/;

const EMPTYISH_RE = /^\s*$/;
const SUSPICIOUS_WS_RE = /\s{3,}|\t| \n|\n /;

/** Paths where Hebrew keys are intentional (HE→EN maps), not user-facing HE prose */
const HE_KEY_ALLOW = [
  /content-packs\/en\/learning\/geometry-content\.json$/,
];

/** Prototype/dev burn-down inventory may still carry extraction noise; keep HE-free after cleanup */
function walkFiles(dir, out = []) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return out;
  for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.join(dir, ent.name).replace(/\\/g, "/");
    if (ent.isDirectory()) walkFiles(rel, out);
    else if (/\.(json)$/.test(ent.name)) out.push(rel);
  }
  return out;
}

function collectStringLeaves(node, acc = []) {
  if (typeof node === "string") {
    acc.push(node);
    return acc;
  }
  if (Array.isArray(node)) {
    for (const v of node) collectStringLeaves(v, acc);
    return acc;
  }
  if (node && typeof node === "object") {
    for (const v of Object.values(node)) collectStringLeaves(v, acc);
  }
  return acc;
}

test("american english glossary exports required terms", () => {
  assert.equal(AMERICAN_ENGLISH_GLOSSARY.subjectLabel, "Math");
  assert.equal(AMERICAN_ENGLISH_GLOSSARY.gradeLabel, "Grade 1");
  assert.equal(AMERICAN_ENGLISH_GLOSSARY.terms.areaToStrengthen, "area to strengthen");
  assert.equal(AMERICAN_ENGLISH_GLOSSARY.terms.rectangularPrism, "Rectangular prism");
  assert.equal(AMERICAN_ENGLISH_GLOSSARY.spelling.color, "color");
  assert.equal(AMERICAN_ENGLISH_GLOSSARY.spelling.behavior, "behavior");
});

test("EN locales and content-packs: no Hebrew in user-facing string values", () => {
  const files = SCAN_DIRS.flatMap((d) => walkFiles(d));
  assert.ok(files.length > 50, `expected many EN json files, got ${files.length}`);
  const hits = [];
  for (const rel of files) {
    if (HE_KEY_ALLOW.some((re) => re.test(rel))) {
      // Only allow Hebrew inside object keys of alias maps — values must stay EN
      const raw = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
      const strings = collectStringLeaves(raw);
      for (const s of strings) {
        if (HEBREW_CHAR_RE.test(s)) hits.push({ rel, s: s.slice(0, 80) });
      }
      continue;
    }
    const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
    if (!HEBREW_CHAR_RE.test(text)) continue;
    const raw = JSON.parse(text);
    for (const s of collectStringLeaves(raw)) {
      if (HEBREW_CHAR_RE.test(s)) hits.push({ rel, s: s.slice(0, 80) });
    }
  }
  assert.deepEqual(hits, [], `Hebrew in EN string values:\n${hits.map((h) => `${h.rel}: ${h.s}`).join("\n")}`);
});

test("EN locales and content-packs: no forbidden British spellings in string values", () => {
  const files = SCAN_DIRS.flatMap((d) => walkFiles(d));
  const hits = [];
  for (const rel of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
    for (const s of collectStringLeaves(raw)) {
      for (const { id, re } of FORBIDDEN_BRITISH_PATTERNS) {
        if (re.test(s)) hits.push({ rel, id, s: s.slice(0, 100) });
      }
    }
  }
  assert.deepEqual(hits, [], `British spelling hits:\n${hits.map((h) => `${h.rel} [${h.id}]: ${h.s}`).join("\n")}`);
});

test("EN locales and content-packs: no known Hebrew calques in string values", () => {
  const files = SCAN_DIRS.flatMap((d) => walkFiles(d));
  const hits = [];
  for (const rel of files) {
    // Rewards card series name "Professions" is intentional catalog label — skip that file for profession pattern only
    const raw = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
    for (const s of collectStringLeaves(raw)) {
      for (const { id, re } of FORBIDDEN_CALQUE_PATTERNS) {
        if (id === "profession_subject" && /content-packs\/en\/rewards\//.test(rel)) continue;
        if (re.test(s)) hits.push({ rel, id, s: s.slice(0, 120) });
      }
    }
  }
  assert.deepEqual(hits, [], `Calque hits:\n${hits.map((h) => `${h.rel} [${h.id}]: ${h.s}`).join("\n")}`);
});

test("EN report burn-down packs: no code-leak string values", () => {
  const files = walkFiles("content-packs/en/reports");
  const hits = [];
  for (const rel of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
    for (const s of collectStringLeaves(raw)) {
      if (CODE_LEAK_RE.test(s)) hits.push({ rel, s: s.slice(0, 100) });
    }
  }
  assert.deepEqual(hits, [], `Code leaks:\n${hits.map((h) => `${h.rel}: ${h.s}`).join("\n")}`);
});

test("EN locales: no empty string leaves and limited suspicious whitespace", () => {
  const files = walkFiles("locales/en");
  const empty = [];
  const ws = [];
  for (const rel of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
    for (const s of collectStringLeaves(raw)) {
      if (EMPTYISH_RE.test(s)) empty.push(rel);
      else if (SUSPICIOUS_WS_RE.test(s) && s.length < 200) ws.push({ rel, s: JSON.stringify(s).slice(0, 80) });
    }
  }
  assert.deepEqual(empty, [], `Empty locale strings: ${empty.join(", ")}`);
  assert.ok(ws.length < 5, `Suspicious whitespace samples: ${JSON.stringify(ws.slice(0, 5))}`);
});

test("english-page-skills pack has no Hebrew after EN authority pass", () => {
  const rel = "content-packs/en/books/english-page-skills.json";
  const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
  assert.equal(HEBREW_CHAR_RE.test(text), false);
});

test("geometry solidNames use Rectangular prism not Cuboid", () => {
  const rel = "content-packs/en/learning/geometry-content.json";
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
  assert.ok(raw.solidNames.includes("Rectangular prism"));
  assert.equal(raw.solidNames.includes("Cuboid"), false);
  assert.equal(raw.solidAliases["rectangular prism"], "Rectangular prism");
});
