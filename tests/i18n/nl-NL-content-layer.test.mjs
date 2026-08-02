/**
 * nl-NL content layer targeted checks (no full suite / no build).
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

function walkJson(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, files);
    else if (ent.name.endsWith(".json")) files.push(p);
  }
  return files;
}

test("nl-NL namespaces parse and cover required files", () => {
  const dir = path.join(ROOT, "locales/nl-NL");
  const required = [
    "common",
    "ui",
    "auth",
    "learning",
    "reports",
    "emails",
    "seo",
    "legal",
    "worksheets",
    "games",
    "validation",
    "teacher",
    "school",
    "platform",
    "copilot",
  ];
  for (const ns of required) {
    const file = path.join(dir, `${ns}.json`);
    assert.ok(fs.existsSync(file), `missing ${ns}.json`);
    assert.doesNotThrow(() => JSON.parse(fs.readFileSync(file, "utf8")));
  }
});

test("nl-NL grade mapping Groep 3–8", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-NL/common.json"), "utf8"));
  assert.equal(common.grade1, "Groep 3");
  assert.equal(common.grade2, "Groep 4");
  assert.equal(common.grade3, "Groep 5");
  assert.equal(common.grade4, "Groep 6");
  assert.equal(common.grade5, "Groep 7");
  assert.equal(common.grade6, "Groep 8");
  assert.equal(common.subjectMath, "Rekenen");
  assert.equal(common.brandName, "Leo Kids");
  assert.doesNotMatch(JSON.stringify(common), /\bGrade\s*[1-6]\b/);
  assert.doesNotMatch(JSON.stringify(common), /\bGroep\s*[12]\b/);
});

test("nl-NL worksheets terminology", () => {
  const ws = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-NL/worksheets.json"), "utf8"));
  assert.match(String(ws.createWorksheet || ""), /werkblad/i);
  assert.match(String(ws.answerKey || ws.answerKeyTitle || ""), /Antwoorden|antwoorden/);
  assert.equal(ws.subjectMath, "Rekenen");
  assert.equal(ws.gradeFilterAll, "Alle groepen");
  assert.doesNotMatch(JSON.stringify(ws), /\bspreadsheet\b/i);
  assert.doesNotMatch(JSON.stringify(ws), /\brekenblad\b/i);
});

test("nl-NL math/geometry rebuilders export expected symbols", async () => {
  const math = await import("../../utils/learning-content-nl-NL/math.js");
  const geo = await import("../../utils/learning-content-nl-NL/geometry.js");
  assert.equal(typeof math.rebuildMathStemNlNl, "function");
  assert.equal(typeof geo.rebuildGeometryStemNlNl, "function");
  const money = math.rebuildMathStemNlNl({ params: { kind: "wp_pocket_money", money: 5, toy: 2 } });
  assert.match(money, /euro/i);
  assert.doesNotMatch(money, /dollar/i);
  const circle = geo.rebuildGeometryStemNlNl({ params: { kind: "circle_perimeter", radius: 3 } });
  assert.match(circle, /omtrek/i);
  assert.match(circle, /straal/i);
});

test("nl-NL science overlay ID parity with English", async () => {
  const { SCIENCE_EN_OVERLAY } = await import("../../data/science-questions-en-overlay.js");
  const { SCIENCE_NL_NL_OVERLAY } = await import("../../data/science-questions-nl-NL-overlay.js");
  const en = Object.keys(SCIENCE_EN_OVERLAY).sort();
  const nl = Object.keys(SCIENCE_NL_NL_OVERLAY).sort();
  assert.deepEqual(nl, en);
  assert.equal(nl.length, 1017);
  const sample = SCIENCE_NL_NL_OVERLAY[en[0]];
  assert.ok(sample.stem);
  assert.ok(Array.isArray(sample.options));
  assert.equal(sample.options.length, SCIENCE_EN_OVERLAY[en[0]].options.length);
});

test("nl-NL word meanings full ID mapping sample + polysemy", async () => {
  const { WORD_MEANINGS_EN } = await import("../../data/english-questions/word-meanings/en.js");
  const { WORD_MEANINGS_NL_NL } = await import("../../data/english-questions/word-meanings/nl-NL.js");
  for (const cat of Object.keys(WORD_MEANINGS_EN)) {
    assert.ok(WORD_MEANINGS_NL_NL[cat], `missing category ${cat}`);
    for (const id of Object.keys(WORD_MEANINGS_EN[cat])) {
      assert.ok(WORD_MEANINGS_NL_NL[cat][id], `missing ${cat}.${id}`);
    }
  }
  assert.equal(WORD_MEANINGS_NL_NL.school.grade, "cijfer");
  assert.equal(WORD_MEANINGS_NL_NL.travel.ticket, "kaartje");
  assert.equal(WORD_MEANINGS_NL_NL.travel.port, "haven");
  assert.equal(WORD_MEANINGS_NL_NL.community.port, "haven");
  assert.equal(WORD_MEANINGS_NL_NL.community.bank, "bank (geld)");
  assert.equal(WORD_MEANINGS_NL_NL.house.sofa, "zitbank");
  assert.equal(WORD_MEANINGS_NL_NL.house.light, "lamp");
  assert.equal(WORD_MEANINGS_NL_NL.actions.watch, "kijken naar");
  assert.equal(WORD_MEANINGS_NL_NL.school.student, "leerling");
  assert.equal(WORD_MEANINGS_NL_NL.school.teacher, "leerkracht");
});

test("nl-NL learning-book path parity with English", () => {
  const en = countMd(path.join(ROOT, "docs/learning-book/en"));
  const nl = countMd(path.join(ROOT, "docs/learning-book/nl-NL"));
  assert.equal(nl, en);
  assert.ok(nl >= 450);
});

test("nl-NL content-pack JSON files parse", () => {
  const files = walkJson(path.join(ROOT, "content-packs/nl-NL"));
  assert.ok(files.length > 50, `expected substantial pack set, got ${files.length}`);
  for (const f of files.slice(0, 40)) {
    assert.doesNotThrow(() => JSON.parse(fs.readFileSync(f, "utf8")), f);
  }
});

test("nl-NL help center sections exist", async () => {
  const mod = await import("../../data/help-center/nl-NL/index.js");
  assert.ok(mod.SECTIONS_NL_NL.parents);
  assert.ok(mod.SECTIONS_NL_NL.students);
  assert.ok(Array.isArray(mod.ALL_ARTICLES_NL_NL));
  assert.ok(mod.ALL_ARTICLES_NL_NL.length >= 30);
});
