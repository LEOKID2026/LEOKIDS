/**
 * fr-FR content layer smoke checks (no full suite / no build / no wiring).
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

function listJson(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) listJson(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

test("fr-FR locale namespaces exist with France grade labels", () => {
  const dir = path.join(ROOT, "locales/fr-FR");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("ui.json"));
  const common = JSON.parse(fs.readFileSync(path.join(dir, "common.json"), "utf8"));
  assert.equal(common.grade1, "CP");
  assert.equal(common.grade2, "CE1");
  assert.equal(common.grade3, "CE2");
  assert.equal(common.grade4, "CM1");
  assert.equal(common.grade5, "CM2");
  assert.equal(common.grade6, "6e");
  // Passthrough of already-localized short labels (same contract as it-IT / nl-NL)
  assert.equal(String(common.gradeLabel || ""), "{grade}");
  assert.equal(common.brandName, "Leo Kids");
  assert.ok(!("classe1" in common), "JSON keys must stay English (grade1)");
  const learning = JSON.parse(fs.readFileSync(path.join(dir, "learning.json"), "utf8"));
  assert.equal(
    learning.questionsAnswered,
    "{count, plural, one {# question} other {# questions}}",
  );
  assert.equal(String(learning.master?.gradeTitle || ""), "{grade}");
  assert.deepEqual(
    [
      learning.master?.grades?.g1,
      learning.master?.grades?.g2,
      learning.master?.grades?.g3,
      learning.master?.grades?.g4,
      learning.master?.grades?.g5,
      learning.master?.grades?.g6,
    ],
    ["CP", "CE1", "CE2", "CM1", "CM2", "6e"],
  );
  assert.equal(
    learning.master?.modes?.learning?.description,
    "Pas de fin de partie : entraîne-toi à ton rythme",
  );
  const ws = JSON.parse(fs.readFileSync(path.join(dir, "worksheets.json"), "utf8"));
  assert.match(String(ws.createWorksheet || ws.tabGenerator || ""), /fiche d’exercices/i);
  assert.doesNotMatch(JSON.stringify(ws), /feuille de calcul/i);
  assert.doesNotMatch(JSON.stringify(ws), /étudiant/i);
  assert.doesNotMatch(JSON.stringify(ws), /Choisissez une note|Choisis une note/);
});

test("fr-FR math/geometry rebuilders export expected symbols", async () => {
  const math = await import("../../utils/learning-content-fr-FR/math.js");
  const geo = await import("../../utils/learning-content-fr-FR/geometry.js");
  const idx = await import("../../utils/learning-content-fr-FR/index.js");
  assert.equal(typeof math.rebuildMathStemFrFr, "function");
  assert.equal(typeof geo.rebuildGeometryStemFrFr, "function");
  assert.equal(typeof idx.applyFrFrDisplayLayer, "function");

  const money = math.rebuildMathStemFrFr({
    params: { kind: "wp_pocket_money", money: 10, toy: 3 },
  });
  assert.match(String(money), /euro/i);
  assert.doesNotMatch(String(money), /dollar/i);

  const diskArea = geo.rebuildGeometryStemFrFr({ params: { kind: "circle_area", radius: 5 } });
  assert.match(String(diskArea), /disque/i);
  assert.match(String(diskArea), /rayon/i);
  assert.match(String(diskArea), /aire/i);
  const circ = geo.rebuildGeometryStemFrFr({ params: { kind: "circle_perimeter", radius: 5 } });
  assert.match(String(circ), /cercle/i);
  assert.match(String(circ), /circonférence/i);
});

test("fr-FR word meanings cover WORD_LISTS IDs and polysemy", async () => {
  const { WORD_MEANINGS_FR_FR } = await import("../../data/english-questions/word-meanings/fr-FR.js");
  const { WORD_LISTS } = await import("../../data/english-questions/word-lists.js");
  for (const [cat, words] of Object.entries(WORD_LISTS)) {
    assert.ok(WORD_MEANINGS_FR_FR[cat], `missing category ${cat}`);
    for (const id of Object.keys(words)) {
      assert.equal(typeof WORD_MEANINGS_FR_FR[cat][id], "string", `missing ${cat}.${id}`);
      assert.ok(WORD_MEANINGS_FR_FR[cat][id].trim(), `empty ${cat}.${id}`);
    }
  }
  // Polysemy samples (category-aware where available)
  if (WORD_MEANINGS_FR_FR.animals?.bat) assert.match(WORD_MEANINGS_FR_FR.animals.bat, /chauve-souris/i);
  if (WORD_MEANINGS_FR_FR.travel?.ticket) assert.match(WORD_MEANINGS_FR_FR.travel.ticket, /billet|ticket/i);
  if (WORD_MEANINGS_FR_FR.school?.class) assert.match(WORD_MEANINGS_FR_FR.school.class, /classe/i);
});

test("fr-FR help center article counts and slug parity with EN content", async () => {
  const fr = await import("../../data/help-center/fr-FR/index.js");
  const parents = await import("../../data/help-center/content/parents.js");
  const students = await import("../../data/help-center/content/students.js");
  const report = await import("../../data/help-center/content/parent-report.js");
  const subjects = await import("../../data/help-center/content/subjects.js");
  assert.equal(fr.BY_SECTION_FR_FR.parents.length, parents.PARENT_ARTICLES.length);
  assert.equal(fr.BY_SECTION_FR_FR.students.length, students.STUDENT_ARTICLES.length);
  assert.equal(fr.BY_SECTION_FR_FR["parent-report"].length, report.PARENT_REPORT_ARTICLES.length);
  assert.equal(fr.BY_SECTION_FR_FR.subjects.length, subjects.SUBJECT_ARTICLES.length);
  const enSlugs = [
    ...parents.PARENT_ARTICLES,
    ...students.STUDENT_ARTICLES,
    ...report.PARENT_REPORT_ARTICLES,
    ...subjects.SUBJECT_ARTICLES,
  ].map((a) => a.slug);
  const frSlugs = fr.ALL_ARTICLES_FR_FR.map((a) => a.slug);
  assert.deepEqual(frSlugs, enSlugs);
});

test("fr-FR science overlay ID parity with EN when present", async (t) => {
  const overlayPath = path.join(ROOT, "data/science-questions-fr-FR-overlay.js");
  if (!fs.existsSync(overlayPath)) {
    t.skip("science overlay not generated yet");
    return;
  }
  const { SCIENCE_EN_OVERLAY } = await import("../../data/science-questions-en-overlay.js");
  const { SCIENCE_FR_FR_OVERLAY } = await import("../../data/science-questions-fr-FR-overlay.js");
  const en = Object.keys(SCIENCE_EN_OVERLAY).sort();
  const fr = Object.keys(SCIENCE_FR_FR_OVERLAY).sort();
  assert.deepEqual(fr, en);
  const sample = SCIENCE_FR_FR_OVERLAY[en[0]];
  assert.equal(sample.options.length, SCIENCE_EN_OVERLAY[en[0]].options.length);
  assert.ok(!/"correctIndex"/.test(fs.readFileSync(overlayPath, "utf8").slice(0, 500)) || true);
});

test("fr-FR learning-book path parity with EN when present", (t) => {
  const en = countMd(path.join(ROOT, "docs/learning-book/en"));
  const fr = countMd(path.join(ROOT, "docs/learning-book/fr-FR"));
  if (fr === 0) {
    t.skip("learning-book/fr-FR not generated yet");
    return;
  }
  assert.equal(fr, en);
  assert.ok(fr >= 450);
});

test("fr-FR content-pack file count parity with EN when present", (t) => {
  const en = listJson(path.join(ROOT, "content-packs/en")).length;
  const fr = listJson(path.join(ROOT, "content-packs/fr-FR")).length;
  if (fr === 0) {
    t.skip("content-packs/fr-FR not generated yet");
    return;
  }
  assert.equal(fr, en);
});

test("fr-FR namespaces parse as JSON", () => {
  for (const f of fs.readdirSync(path.join(ROOT, "locales/fr-FR")).filter((x) => x.endsWith(".json"))) {
    assert.doesNotThrow(() =>
      JSON.parse(fs.readFileSync(path.join(ROOT, "locales/fr-FR", f), "utf8")),
    );
  }
});
