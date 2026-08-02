/**
 * ru-RU content layer smoke checks (no full suite / no build).
 * Content-only layer — shared wiring not required for these file/export checks.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RU_LOCALES = path.join(ROOT, "locales/ru-RU");
const REQUIRED_NS = [
  "auth",
  "common",
  "copilot",
  "emails",
  "games",
  "learning",
  "legal",
  "platform",
  "reports",
  "school",
  "seo",
  "teacher",
  "ui",
  "validation",
  "worksheets",
];

test("ru-RU locale namespace files exist", () => {
  for (const ns of REQUIRED_NS) {
    const p = path.join(RU_LOCALES, `${ns}.json`);
    assert.ok(fs.existsSync(p), `missing locales/ru-RU/${ns}.json`);
  }
});

test("ru-RU grade display uses класс mapping", () => {
  const common = JSON.parse(fs.readFileSync(path.join(RU_LOCALES, "common.json"), "utf8"));
  assert.equal(common.grade1, "1 класс");
  assert.equal(common.grade6, "6 класс");
  assert.match(String(common.gradeLabel), /класс/);
  assert.doesNotMatch(JSON.stringify(common), /\bGrade\s*[1-6]\b/);
});

test("ru-RU worksheet terminology authority", () => {
  const ws = JSON.parse(fs.readFileSync(path.join(RU_LOCALES, "worksheets.json"), "utf8"));
  assert.match(ws.createWorksheet, /лист заданий/i);
  assert.match(ws.readyTitle, /листы заданий|готовые листы/i);
  assert.match(ws.preview, /предварительн/i);
  assert.equal(ws.answerKey, "Ответы");
  assert.doesNotMatch(JSON.stringify(ws), /рабочая таблица/i);
});

test("ru-RU math/geometry rebuilders export expected symbols", async () => {
  const math = await import("../../utils/learning-content-ru-RU/math.js");
  const geo = await import("../../utils/learning-content-ru-RU/geometry.js");
  assert.equal(typeof math.rebuildMathStemRuRu, "function");
  assert.equal(typeof math.rubleWord, "function");
  assert.equal(typeof geo.rebuildGeometryStemRuRu, "function");
  assert.equal(math.rubleWord(1), "рубль");
  assert.equal(math.rubleWord(2), "рубля");
  assert.equal(math.rubleWord(5), "рублей");
  assert.equal(math.rubleWord(21), "рубль");
  assert.equal(math.rubleWord(12), "рублей");
});

test("ru-RU math money stems use рубль forms", async () => {
  const { rebuildMathStemRuRu } = await import("../../utils/learning-content-ru-RU/math.js");
  const stem = rebuildMathStemRuRu({
    params: { kind: "wp_pocket_money", money: 5, toy: 2 },
  });
  assert.match(stem, /рубл/);
  assert.doesNotMatch(stem, /dollar|euro|\$|€/i);
});

test("ru-RU geometry distinguishes круг and окружность", async () => {
  const { rebuildGeometryStemRuRu } = await import("../../utils/learning-content-ru-RU/geometry.js");
  const area = rebuildGeometryStemRuRu({ params: { kind: "circle_area", radius: 3 } });
  const peri = rebuildGeometryStemRuRu({ params: { kind: "circle_perimeter", radius: 3 } });
  assert.match(area, /Круг/);
  assert.match(area, /площад/i);
  assert.match(peri, /Окружность|окружности/);
});

test("ru-RU word meanings cover English ID set", async () => {
  const { WORD_MEANINGS_EN } = await import("../../data/english-questions/word-meanings/en.js");
  const { WORD_MEANINGS_RU_RU } = await import(
    "../../data/english-questions/word-meanings/ru-RU.js"
  );
  for (const [cat, words] of Object.entries(WORD_MEANINGS_EN)) {
    for (const id of Object.keys(words)) {
      assert.ok(WORD_MEANINGS_RU_RU[cat]?.[id], `missing ${cat}.${id}`);
      assert.notEqual(WORD_MEANINGS_RU_RU[cat][id], "");
    }
  }
  assert.equal(WORD_MEANINGS_RU_RU.school.grade, "класс");
  assert.equal(WORD_MEANINGS_RU_RU.travel.port, "морской порт");
  assert.equal(WORD_MEANINGS_RU_RU.community.port, "порт (гавань)");
  assert.equal(WORD_MEANINGS_RU_RU.travel.ticket, "билет");
  assert.equal(WORD_MEANINGS_RU_RU.community.bank, "банк");
  assert.equal(WORD_MEANINGS_RU_RU.house.light, "свет");
  assert.equal(WORD_MEANINGS_RU_RU.actions.watch, "наблюдать");
});

test("ru-RU science overlay ID parity with English when present", async () => {
  const overlayPath = path.join(ROOT, "data/science-questions-ru-RU-overlay.js");
  if (!fs.existsSync(overlayPath)) {
    assert.ok(true, "science overlay not yet merged — batch work in progress");
    return;
  }
  const { SCIENCE_EN_OVERLAY } = await import("../../data/science-questions-en-overlay.js");
  const { SCIENCE_RU_RU_OVERLAY } = await import("../../data/science-questions-ru-RU-overlay.js");
  const en = Object.keys(SCIENCE_EN_OVERLAY).sort();
  const ru = Object.keys(SCIENCE_RU_RU_OVERLAY).sort();
  assert.deepEqual(ru, en);
  for (const id of en) {
    assert.equal(
      (SCIENCE_RU_RU_OVERLAY[id].options || []).length,
      (SCIENCE_EN_OVERLAY[id].options || []).length,
      `options length ${id}`
    );
  }
});

test("ru-RU learning-book path parity with en when present", () => {
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
  const en = countMd(path.join(ROOT, "docs/learning-book/en"));
  const ru = countMd(path.join(ROOT, "docs/learning-book/ru-RU"));
  if (ru === 0) {
    assert.ok(true, "learning-book/ru-RU not yet generated");
    return;
  }
  assert.equal(ru, en);
  assert.ok(ru >= 450);
});

test("ru-RU child/adult address samples in authored locales", () => {
  const games = JSON.parse(fs.readFileSync(path.join(RU_LOCALES, "games.json"), "utf8"));
  const auth = JSON.parse(fs.readFileSync(path.join(RU_LOCALES, "auth.json"), "utf8"));
  assert.match(games.hubSubtitle, /Выбери|выбери/);
  assert.match(auth.parentWelcomeTitle, /родител/i);
  assert.match(auth.parentWelcomeBody, /вы можете|Вы можете/i);
});
