/**
 * de-DE content layer smoke checks (no full suite / no build).
 * Content-only; shared wiring not required for these asserts.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function countMd(dir) {
  let n = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) n += countMd(p);
    else if (ent.name.endsWith(".md")) n += 1;
  }
  return n;
}

function walkJson(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

test("de-DE locales: 15 namespaces with en key-shape parity", () => {
  const enDir = path.join(ROOT, "locales/en");
  const deDir = path.join(ROOT, "locales/de-DE");
  const enFiles = fs.readdirSync(enDir).filter((f) => f.endsWith(".json")).sort();
  const deFiles = fs.readdirSync(deDir).filter((f) => f.endsWith(".json")).sort();
  assert.deepEqual(deFiles, enFiles);
  assert.equal(deFiles.length, 15);
  for (const f of enFiles) {
    const en = JSON.parse(fs.readFileSync(path.join(enDir, f), "utf8"));
    const de = JSON.parse(fs.readFileSync(path.join(deDir, f), "utf8"));
    assert.deepEqual(Object.keys(de).sort(), Object.keys(en).sort(), f);
  }
  const common = JSON.parse(fs.readFileSync(path.join(deDir, "common.json"), "utf8"));
  assert.equal(common.grade1, "1. Klasse");
  assert.equal(common.grade6, "6. Klasse");
  assert.equal(common.brandName, "Leo Kids");
  assert.equal(common.subjectMath, "Mathematik");
});

test("de-DE worksheets terminology", () => {
  const ws = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/worksheets.json"), "utf8"));
  const blob = JSON.stringify(ws);
  assert.match(blob, /Arbeitsblatt/);
  assert.match(blob, /Lösungen/);
  assert.doesNotMatch(blob, /\bTabelle\b/);
  assert.doesNotMatch(blob, /\bKalkulation\b/);
});

test("de-DE learning-book path parity with en", () => {
  const en = countMd(path.join(ROOT, "docs/learning-book/en"));
  const de = countMd(path.join(ROOT, "docs/learning-book/de-DE"));
  assert.equal(de, en);
  assert.ok(de >= 450);
});

test("de-DE content-packs file count parity with en domains", () => {
  const domains = ["learning", "reports", "games", "books", "rewards", "global-burn-down", "demo"];
  for (const d of domains) {
    const en = walkJson(path.join(ROOT, "content-packs/en", d)).length;
    const de = walkJson(path.join(ROOT, "content-packs/de-DE", d)).length;
    assert.equal(de, en, d);
  }
});

test("de-DE science overlay ID parity with en", async () => {
  const { SCIENCE_EN_OVERLAY } = await import("../../data/science-questions-en-overlay.js");
  const { SCIENCE_DE_DE_OVERLAY } = await import("../../data/science-questions-de-DE-overlay.js");
  const en = Object.keys(SCIENCE_EN_OVERLAY).sort();
  const de = Object.keys(SCIENCE_DE_DE_OVERLAY).sort();
  assert.deepEqual(de, en);
  assert.equal(de.length, 1017);
  // Authored body sample quality
  assert.equal(
    SCIENCE_DE_DE_OVERLAY.body_1.stem,
    "Wo befindet sich das Herz im menschlichen Körper?",
  );
  assert.equal(SCIENCE_DE_DE_OVERLAY.body_1.options.length, SCIENCE_EN_OVERLAY.body_1.options.length);
});

test("de-DE math/geometry rebuilders export expected symbols", async () => {
  const math = await import("../../utils/learning-content-de-DE/math.js");
  const geo = await import("../../utils/learning-content-de-DE/geometry.js");
  assert.equal(typeof math.rebuildMathStemDeDe, "function");
  assert.equal(typeof math.localizeMathQuestionDeDe, "function");
  assert.equal(typeof geo.rebuildGeometryStemDeDe, "function");
  assert.equal(typeof geo.localizeGeometryQuestionDeDe, "function");
  const money = math.rebuildMathStemDeDe({ params: { kind: "wp_pocket_money", money: 10, toy: 3 } });
  assert.match(money, /Euro/);
  assert.doesNotMatch(money, /dollar/i);
  const circle = geo.rebuildGeometryStemDeDe({ params: { kind: "circle_area", radius: 5 } });
  assert.match(circle, /Fläche|Kreis/);
});

test("de-DE word meanings full ID coverage vs WORD_LISTS", async () => {
  const { WORD_LISTS } = await import("../../data/english-questions/word-lists.js");
  const { WORD_MEANINGS_DE_DE } = await import("../../data/english-questions/word-meanings/de-DE.js");
  assert.deepEqual(Object.keys(WORD_MEANINGS_DE_DE).sort(), Object.keys(WORD_LISTS).sort());
  let n = 0;
  let missing = 0;
  for (const cat of Object.keys(WORD_LISTS)) {
    for (const id of Object.keys(WORD_LISTS[cat] || {})) {
      n++;
      if (!WORD_MEANINGS_DE_DE[cat]?.[id]) missing++;
      assert.ok(WORD_MEANINGS_DE_DE[cat]?.[id], `missing ${cat}.${id}`);
    }
  }
  assert.equal(n, 745);
  assert.equal(missing, 0);
  assert.ok(WORD_MEANINGS_DE_DE.sight?.the);
  // school.grade in WORD_LISTS is school year/class (not mark/score)
  assert.equal(WORD_MEANINGS_DE_DE.school.grade, "die Klasse");
  assert.equal(WORD_MEANINGS_DE_DE.travel.port, "der Hafen");
  assert.equal(WORD_MEANINGS_DE_DE.community.bank, "die Bank");
});

test("de-DE help center sections and article counts", async () => {
  const mod = await import("../../data/help-center/de-DE/index.js");
  assert.ok(mod.SECTIONS_DE_DE.parents);
  assert.ok(mod.SECTIONS_DE_DE.students);
  assert.ok(mod.BY_SECTION_DE_DE.parents.length >= 10);
  assert.ok(mod.BY_SECTION_DE_DE.students.length >= 8);
  assert.ok(mod.ALL_ARTICLES_DE_DE.length >= 30);
  const parentsBlob = JSON.stringify(mod.BY_SECTION_DE_DE.parents);
  assert.match(parentsBlob, /\bSie\b/);
  const studentsBlob = JSON.stringify(mod.BY_SECTION_DE_DE.students);
  assert.match(studentsBlob, /\b[Dd]u\b|\bdein\b|\bdir\b|\bdich\b/);
});

test("de-DE placeholders preserved in locales sample", () => {
  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/learning.json"), "utf8"));
  const blob = JSON.stringify(learning);
  assert.match(blob, /\{percent\}|\{count\}|\{grade\}|\{correct\}|\{total\}|\{level\}|\{name\}/);
});

test("de-DE no Austrian/Swiss regionalisms in authored samples", () => {
  const body = fs.readFileSync(
    path.join(ROOT, "scripts/i18n/_de-DE-science-authored/body.json"),
    "utf8",
  );
  const localesSample = fs.readFileSync(path.join(ROOT, "locales/de-DE/common.json"), "utf8");
  const blob = body + localesSample;
  assert.doesNotMatch(blob, /\bJänner\b/);
  assert.doesNotMatch(blob, /\bSpital\b/);
  assert.doesNotMatch(blob, /\bVelo\b/);
  assert.doesNotMatch(blob, /\bparkieren\b/i);
});

test("de-DE writing-pack requirements present", () => {
  const p = path.join(ROOT, "data/help-center/de-DE/writing-pack-requirements.md");
  assert.ok(fs.existsSync(p));
  const t = fs.readFileSync(p, "utf8");
  for (const title of [
    "Farben",
    "Tiere",
    "Familie",
    "Lebensmittel",
    "Schule",
    "Körper",
    "Haus",
    "Natur",
    "Verkehrsmittel",
    "Zahlen",
    "CVC-Wörter",
    "Häufige Wörter",
  ]) {
    assert.match(t, new RegExp(title));
  }
  assert.match(t, /Schreibe|Spure nach|Male aus/);
});

test("de-DE no FR/IT/NL/RU/HE leakage in common locale", () => {
  const common = fs.readFileSync(path.join(ROOT, "locales/de-DE/common.json"), "utf8");
  assert.doesNotMatch(common, /[\u0590-\u05FF]/); // Hebrew
  assert.doesNotMatch(common, /[\u0400-\u04FF]/); // Cyrillic
  assert.doesNotMatch(common, /\bBonjour\b|\bGrazie\b|\bBedankt\b|\bMerci\b/);
});
