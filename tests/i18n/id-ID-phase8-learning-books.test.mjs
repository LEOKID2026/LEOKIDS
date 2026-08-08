/**
 * Phase 8 — id-ID learning-book completeness & parity.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkLocaleCompleteness } from "../../lib/i18n/check-locale-completeness.js";
import { GLOBAL_GRADES, GLOBAL_SUBJECTS } from "../../lib/i18n/locale-completeness-manifest.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EN = path.join(ROOT, "artifacts/id-ID-phase8/en-sot");
const ID = path.join(ROOT, "docs/learning-book/id-ID");

function listDraftFiles(root, subject, grade) {
  const dir = path.join(root, subject, grade, "drafts");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
}

function walk(d, a = []) {
  if (!fs.existsSync(d)) return a;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

test("learning_books completeness gate is 24/24 for id-ID", () => {
  const r = checkLocaleCompleteness("id-ID");
  const lb = r.findings.find((f) => f.id === "learning_books");
  assert.equal(lb?.status, "ok");
  assert.match(lb.detail, /ok=24/);
  assert.match(lb.detail, /legacyFallback=0/);
  assert.match(lb.detail, /missing=0/);
});

test("overall id-ID completeness has no missing gates after Phase 8", () => {
  const r = checkLocaleCompleteness("id-ID");
  assert.equal(r.summary.missing, 0);
  assert.equal(r.summary.fallback, 0);
});

test("24-slot matrix parity vs English SoT (artifacts extract)", () => {
  assert.ok(fs.existsSync(EN), "EN SoT extract required under artifacts/id-ID-phase8/en-sot");
  let missing = 0;
  let empty = 0;
  let orphan = 0;
  const enSlots = new Set();
  const idSlots = new Set();

  for (const subject of GLOBAL_SUBJECTS) {
    for (const grade of GLOBAL_GRADES) {
      const key = `${subject}/${grade}`;
      const enFiles = listDraftFiles(EN, subject, grade);
      const idFiles = listDraftFiles(ID, subject, grade);
      if (enFiles.length) enSlots.add(key);
      if (idFiles.length) idSlots.add(key);
      if (!idFiles.length) missing += 1;
      for (const f of idFiles) {
        const text = fs.readFileSync(path.join(ID, subject, grade, "drafts", f), "utf8");
        if (!text.trim()) empty += 1;
      }
      // orphan filenames not in EN
      for (const f of idFiles) {
        if (!enFiles.includes(f)) orphan += 1;
      }
      // missing filenames vs EN
      for (const f of enFiles) {
        if (!idFiles.includes(f)) missing += 1;
      }
      assert.deepEqual(idFiles, enFiles, `filename parity ${key}`);
    }
  }

  assert.equal(enSlots.size, 24);
  assert.equal(idSlots.size, 24);
  assert.equal(missing, 0);
  assert.equal(empty, 0);
  assert.equal(orphan, 0);
});

test("structural metadata keys preserved on sample pages", () => {
  const samples = [
    "math/g1/drafts/add_two.md",
    "geometry/g3/drafts/README.md",
    "science/g2/drafts/animals.md",
    "english/g1/drafts/vocab_colors.md",
  ];
  for (const rel of samples) {
    const enPath = path.join(EN, rel);
    const idPath = path.join(ID, rel);
    if (!fs.existsSync(enPath)) continue;
    assert.ok(fs.existsSync(idPath), rel);
    const en = fs.readFileSync(enPath, "utf8");
    const id = fs.readFileSync(idPath, "utf8");
    const enIds = [...en.matchAll(/\|\s*\*\*learning_page_id\*\*\s*\|\s*`([^`]+)`/g)].map((m) => m[1]);
    const idIds = [...id.matchAll(/\|\s*\*\*learning_page_id\*\*\s*\|\s*`([^`]+)`/g)].map((m) => m[1]);
    assert.deepEqual(idIds, enIds, `learning_page_id ${rel}`);
  }
});

test("English subject retains learning-target lemmas", () => {
  const p = path.join(ID, "english/g1/drafts/vocab_colors.md");
  const text = fs.readFileSync(p, "utf8");
  assert.match(text, /^red$/m);
  assert.match(text, /^blue$/m);
  assert.match(text, /^green$/m);
  assert.match(text, /^yellow$/m);
  assert.match(text, /Apa yang kita pelajari|hari ini kamu akan belajar|Hari ini/i);
});

test("math page uses Indonesian chrome and Kelas terminology where expected", () => {
  const p = path.join(ID, "math/g1/drafts/add_two.md");
  const text = fs.readFileSync(p, "utf8");
  assert.match(text, /Apa yang kita pelajari/);
  assert.match(text, /Penjelasan sederhana/);
  assert.doesNotMatch(text, /Fase [ABC]/);
  assert.match(text, /math:g1:add_two/);
});

test("no unexplained English instructional residue in MGS content pages", () => {
  const auditPath = path.join(ROOT, "artifacts/id-ID-phase8/english-residue-audit.json");
  assert.ok(fs.existsSync(auditPath));
  const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
  assert.equal(audit.unexplained, 0);
});

test("file counts match EN SoT extract", () => {
  const enCount = walk(EN).length;
  const idCount = walk(ID).length;
  assert.equal(idCount, enCount);
  assert.equal(enCount, 450);
});

/** Minimal test runner without node:test dependency variance */
function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (err) {
    console.error(`not ok - ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}
