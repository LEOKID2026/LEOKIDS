/**
 * it-IT content layer smoke checks (no full suite / no build).
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

function walkStrings(node, out = []) {
  if (typeof node === "string") {
    out.push(node);
    return out;
  }
  if (Array.isArray(node)) {
    for (const item of node) walkStrings(item, out);
    return out;
  }
  if (node && typeof node === "object") {
    for (const v of Object.values(node)) walkStrings(v, out);
  }
  return out;
}

test("it-IT namespaces parse and cover en set", () => {
  const enDir = path.join(ROOT, "locales/en");
  const itDir = path.join(ROOT, "locales/it-IT");
  const enFiles = fs.readdirSync(enDir).filter((f) => f.endsWith(".json")).sort();
  const itFiles = fs.readdirSync(itDir).filter((f) => f.endsWith(".json")).sort();
  assert.deepEqual(itFiles, enFiles);
  for (const f of itFiles) {
    const raw = fs.readFileSync(path.join(itDir, f), "utf8");
    assert.doesNotThrow(() => JSON.parse(raw));
  }
});

test("it-IT grade mapping authority", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/it-IT/common.json"), "utf8"));
  assert.equal(common.grade1, "1ª primaria");
  assert.equal(common.grade2, "2ª primaria");
  assert.equal(common.grade3, "3ª primaria");
  assert.equal(common.grade4, "4ª primaria");
  assert.equal(common.grade5, "5ª primaria");
  assert.equal(common.grade6, "1ª secondaria");
  assert.notEqual(common.grade6, "6ª primaria");
  // gradeLabel is a passthrough of already-localized short labels (grade1–grade6)
  assert.equal(String(common.gradeLabel || ""), "{grade}");
  assert.equal(common.brandName, "Leo Kids");
  assert.equal(common.subjectMath, "Matematica");
  assert.equal(common.subjectScience, "Scienze");
});

test("it-IT worksheets terminology authority", () => {
  const ws = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/it-IT/worksheets.json"), "utf8"));
  const blob = JSON.stringify(ws);
  assert.doesNotMatch(blob, /foglio di calcolo/i);
  assert.match(blob, /scheda didattica|schede didattiche|scheda di esercizi/i);
});

test("it-IT learning-book path parity with en", () => {
  const en = countMd(path.join(ROOT, "docs/learning-book/en"));
  const it = countMd(path.join(ROOT, "docs/learning-book/it-IT"));
  assert.equal(it, en);
  assert.ok(it >= 450);
});

test("it-IT science overlay ID parity with en", async () => {
  const { SCIENCE_EN_OVERLAY } = await import("../../data/science-questions-en-overlay.js");
  const { SCIENCE_IT_IT_OVERLAY } = await import("../../data/science-questions-it-IT-overlay.js");
  const en = Object.keys(SCIENCE_EN_OVERLAY).sort();
  const it = Object.keys(SCIENCE_IT_IT_OVERLAY).sort();
  assert.deepEqual(it, en);
  // option order + field shape sample
  const sampleId = en[0];
  const enQ = SCIENCE_EN_OVERLAY[sampleId];
  const itQ = SCIENCE_IT_IT_OVERLAY[sampleId];
  assert.equal(Object.keys(itQ).sort().join(","), Object.keys(enQ).sort().join(","));
  if (Array.isArray(enQ.options) && Array.isArray(itQ.options)) {
    assert.equal(itQ.options.length, enQ.options.length);
  }
});

test("it-IT math/geometry rebuilders export expected symbols", async () => {
  const math = await import("../../utils/learning-content-it-IT/math.js");
  const geo = await import("../../utils/learning-content-it-IT/geometry.js");
  assert.equal(typeof math.rebuildMathStemItIt, "function");
  assert.equal(typeof geo.rebuildGeometryStemItIt, "function");

  const money = math.rebuildMathStemItIt({
    params: { kind: "wp_pocket_money", money: 10, toy: 3 },
  });
  assert.match(money, /euro/i);
  assert.doesNotMatch(money, /dollar/i);

  const circle = geo.rebuildGeometryStemItIt({
    params: { kind: "circle_perimeter", radius: 5 },
  });
  assert.match(circle, /circonferenza/i);
  assert.match(circle, /cerchio/i);
});

test("it-IT word meanings full map by ID with polysemy checks", async () => {
  const { WORD_MEANINGS_EN } = await import("../../data/english-questions/word-meanings/en.js");
  const { WORD_MEANINGS_IT_IT } = await import("../../data/english-questions/word-meanings/it-IT.js");
  for (const cat of Object.keys(WORD_MEANINGS_EN)) {
    assert.ok(WORD_MEANINGS_IT_IT[cat], `missing category ${cat}`);
    for (const id of Object.keys(WORD_MEANINGS_EN[cat])) {
      assert.equal(typeof WORD_MEANINGS_IT_IT[cat][id], "string", `${cat}.${id}`);
      assert.ok(WORD_MEANINGS_IT_IT[cat][id].length > 0, `${cat}.${id} empty`);
    }
  }
  // Polysemy by category / ID (only IDs present in EN authority)
  assert.equal(WORD_MEANINGS_IT_IT.travel.port, "porto");
  assert.equal(WORD_MEANINGS_IT_IT.community.port, "porto");
  assert.equal(WORD_MEANINGS_IT_IT.community.bank, "banca");
  assert.equal(WORD_MEANINGS_IT_IT.travel.ticket, "biglietto");
  assert.equal(WORD_MEANINGS_IT_IT.school.grade, "voto");
  assert.equal(WORD_MEANINGS_IT_IT.school.classroom, "aula");
  assert.equal(WORD_MEANINGS_IT_IT.actions.watch, "guardare");
  assert.equal(WORD_MEANINGS_IT_IT.house.light, "luce");
  assert.equal(WORD_MEANINGS_IT_IT.health.cold, "raffreddore");
  assert.equal(WORD_MEANINGS_IT_IT.weather.cold, "freddo");
  assert.notEqual(WORD_MEANINGS_IT_IT.actions.watch, WORD_MEANINGS_IT_IT.house.light);
});

test("it-IT help articles preserve slugs", async () => {
  const enStudents = await import("../../data/help-center/content/students.js");
  const it = await import("../../data/help-center/it-IT/index.js");
  const enSlugs = enStudents.STUDENT_ARTICLES.map((a) => a.slug).sort();
  const itSlugs = it.BY_SECTION_IT_IT.students.map((a) => a.slug).sort();
  assert.deepEqual(itSlugs, enSlugs);
  assert.match(it.SECTIONS_IT_IT.students.title, /alunn/i);
});

test("it-IT leakage scans (other languages / Swiss / grade)", () => {
  const trees = [
    "locales/it-IT",
    "utils/learning-content-it-IT",
    "data/help-center/it-IT",
  ];
  const bad = [
    /\bGrade\s*[1-6]\b/,
    /\bYear\s*[1-6]\b/,
    /\b6ª primaria\b/i,
    /\bfoglio di calcolo\b/i,
    /\bnatel\b/i,
    /[\u0590-\u05FF]/,
    /\b(télécharger|fichier|élève|classe de)\b/i,
    /\b(Schüler|Unterricht|Arbeitsblatt)\b/,
    /\b(leerling|werkblad)\b/i,
    /\b(ученик|тетрадь)\b/i,
    /\b(hoja de cálculo)\b/i,
  ];
  for (const tree of trees) {
    const dir = path.join(ROOT, tree);
    if (!fs.existsSync(dir)) continue;
    const stack = [dir];
    while (stack.length) {
      const cur = stack.pop();
      for (const ent of fs.readdirSync(cur, { withFileTypes: true })) {
        const p = path.join(cur, ent.name);
        if (ent.isDirectory()) stack.push(p);
        else if (/\.(json|js|mjs|md)$/.test(ent.name)) {
          const text = fs.readFileSync(p, "utf8");
          for (const re of bad) {
            assert.equal(re.test(text), false, `${path.relative(ROOT, p)} matched ${re}`);
          }
        }
      }
    }
  }
});

test("it-IT math sample does not change answers/correctIndex", async () => {
  const { localizeMathQuestionItIt } = await import("../../utils/learning-content-it-IT/math.js");
  const q = {
    id: "keep-id",
    subject: "math",
    questionKind: "wp_shop_discount",
    correctIndex: 1,
    params: { kind: "wp_shop_discount", price: 50, discPerc: 20 },
    options: ["40", "45", "50"],
  };
  const out = localizeMathQuestionItIt(q);
  assert.equal(out.id, "keep-id");
  assert.equal(out.correctIndex, 1);
  assert.deepEqual(out.options, ["40", "45", "50"]);
  assert.match(String(out.question), /€|euro/i);
});
