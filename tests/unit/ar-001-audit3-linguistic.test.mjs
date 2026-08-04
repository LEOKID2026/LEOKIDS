/**
 * Focused linguistic assertions for ar-001 audit #3 remediations.
 * Run: node --test tests/unit/ar-001-audit3-linguistic.test.mjs
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function readText(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

test("1 parents marketing — no مكان وقوف; natural progress copy", () => {
  const j = readJson("content-packs/ar-001/public-seo/marketing/parents.json");
  const body = j.infoSections?.[1]?.body || "";
  assert.match(body, /مستوى تقدّم/);
  assert.doesNotMatch(body, /مكان وقوف/);
  const blob = JSON.stringify(j);
  assert.doesNotMatch(blob, /مكان وقوف|احتكاك أقل|دون الحاجة إلى تحريكه|قم بتثبيت التطبيق/);
  assert.match(blob, /ثبّت التطبيق/);
  assert.match(blob, /حثّه باستمرار/);
  assert.match(blob, /توتر أقل حول وقت الواجبات/);
});

test("2 copilot subject/topic distinction", () => {
  const j = readJson("locales/ar-001/copilot.json");
  assert.match(j.boundary.diagnosticBoundary, /المواد والمواضيع/);
});

test("3 no product UI الوالد in locales/ar-001", () => {
  for (const f of ["auth.json", "ui.json", "school.json", "copilot.json"]) {
    const t = readText(`locales/ar-001/${f}`);
    assert.doesNotMatch(t, /الوالد/, `${f} still has الوالد`);
  }
});

test("4 diagnostic labels non-clinical in learning packs", () => {
  const adaptive = readJson(
    "content-packs/ar-001/learning/burn-down/utils__adaptive-learning-planner__adaptive-planner.json"
  );
  assert.match(
    adaptive.copy.inconsistent_or_guess_heavy_signals_use_a_small_diagnostic_set,
    /مجموعة تقييمية صغيرة/
  );
  const engine = readJson(
    "content-packs/ar-001/learning/burn-down/utils__diagnostic-engine-v3__types.json"
  );
  assert.match(Object.values(engine.copy).join(" "), /محرك التحليل V3/);
  const fw = readJson("content-packs/ar-001/learning/diagnostic-framework-v1.json");
  assert.match(fw.name || fw.copy?.name || JSON.stringify(fw), /إطار التحليل التربوي V1/);
});

test("5 arcade missions natural word order", () => {
  const j = readJson(
    "content-packs/ar-001/games/burn-down/lib__arcade__club__missions.server.json"
  );
  assert.equal(j.copy.play_one_arcade_game, "العب لعبة واحدة في صالة الألعاب");
  assert.equal(j.copy.play_50_arcade_games, "العب 50 لعبة في صالة الألعاب");
});

test("6 help monthly persistence natural kids copy", () => {
  const t = readText("data/help-center/ar-001/students.js");
  assert.match(t, /كلّما تدرّبت أكثر خلال الشهر، تقدّمت أكثر في رحلتك/);
});

test("8 auth direct imperatives", () => {
  const j = readJson("locales/ar-001/auth.json");
  assert.match(j.invite.parentReferral, /زُر هذا الرابط/);
  assert.match(j.registration.teacher.inviteOnlyNote, /انتقل إلى تبويب/);
  assert.doesNotMatch(j.invite.parentReferral, /قم بالزيارة هنا/);
});

test("9 english vocab family title keeps EN learning words", () => {
  const j = readJson("content-packs/ar-001/books/english-page-skills.json");
  assert.equal(j.grades.g4.vocab_family.title, "الأسرة — parents, work");
});
