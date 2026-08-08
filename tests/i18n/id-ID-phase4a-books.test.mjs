/**
 * Indonesian Master Phase 4A — books content-pack parity (disk only; no catalog registration).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const EN_ROOT = path.join(ROOT, "content-packs", "en", "books");
const ID_ROOT = path.join(ROOT, "content-packs", "id-ID", "books");
const VALIDATE = path.join(ROOT, "artifacts", "id-ID-phase4a", "validate-books.mjs");

function walkJson(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, acc);
    else if (ent.name.endsWith(".json")) acc.push(p);
  }
  return acc;
}

test("Phase 4A: EN book file count is 319; id-ID mirrors exactly", () => {
  const en = walkJson(EN_ROOT).map((p) => path.relative(EN_ROOT, p).split(path.sep).join("/")).sort();
  const id = walkJson(ID_ROOT).map((p) => path.relative(ID_ROOT, p).split(path.sep).join("/")).sort();
  assert.equal(en.length, 319);
  assert.equal(id.length, 319);
  assert.deepEqual(id, en);
});

test("Phase 4A: locked terminology smoke on ui + sample leaves", () => {
  const ui = JSON.parse(fs.readFileSync(path.join(ID_ROOT, "ui.json"), "utf8"));
  assert.equal(ui.grades.g1, "Kelas 1");
  assert.equal(ui.grades.g6, "Kelas 6");
  assert.equal(ui.subjects.math, "Matematika");
  assert.equal(ui.subjects.geometry, "Geometri");
  assert.equal(ui.subjects.science, "IPA");
  assert.equal(ui.subjects.english, "Bahasa Inggris");
  assert.equal(ui.shell.close, "Tutup");
  assert.ok(typeof ui.shell.practiceNow === "string" && ui.shell.practiceNow.length > 0);
  assert.notEqual(ui.shell.practiceNow, "Let's practice now");
  assert.match(ui.shell.backMath, /Matematika/);
  assert.equal(/\bFase\b/.test(JSON.stringify(ui)), false);

  const math = JSON.parse(
    fs.readFileSync(path.join(ID_ROOT, "page-title-leaves", "math.g1", "add_two.json"), "utf8")
  );
  assert.equal(math.title, "Menjumlahkan Dua Bilangan");

  const engSkill = JSON.parse(fs.readFileSync(path.join(ID_ROOT, "english-page-skills.json"), "utf8"));
  const sample = engSkill.grades.g1.classroom_words;
  assert.equal(sample.skillId, "english:phonics:g1:classroom_words");
  assert.equal(sample.learningLanguage, "en");
  assert.equal(sample.description, "book, pen, desk, chair, door, teacher, hello, bye");
  assert.notEqual(sample.title, "Classroom words");
});

test("Phase 4A: validate-books.mjs PASS", () => {
  const r = spawnSync(process.execPath, [VALIDATE], { encoding: "utf8", cwd: ROOT });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /VALIDATION PASS/);
});
