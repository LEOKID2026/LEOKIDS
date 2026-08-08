/**
 * Indonesian Master Phase 2A — Core UI namespace parity (owned namespaces only).
 * English SoT → id-ID disk files: common, ui, auth, validation, platform.
 *
 * Authority: dynamic EN/ID leaf totals for the owned subset (not a frozen historical count).
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const LOCALE = "id-ID";
const OWNED = ["common", "ui", "auth", "validation", "platform"];
const PLACEHOLDER_RE = /\{[a-zA-Z_][a-zA-Z0-9_]*\}/g;

/**
 * @param {unknown} node
 * @param {string} prefix
 * @param {Map<string, unknown>} out
 */
function collectLeaves(node, prefix, out) {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    out.set(prefix, node);
    return;
  }
  const keys = Object.keys(/** @type {Record<string, unknown>} */ (node));
  if (keys.length === 0) {
    out.set(prefix, node);
    return;
  }
  for (const key of keys) {
    const next = prefix ? `${prefix}.${key}` : key;
    collectLeaves(/** @type {Record<string, unknown>} */ (node)[key], next, out);
  }
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function placeholderSignature(value) {
  if (typeof value !== "string") return "";
  const matches = value.match(PLACEHOLDER_RE) || [];
  return [...matches].sort().join(",");
}

/**
 * @param {string} ns
 */
function loadNs(ns) {
  const enPath = path.join(ROOT, "locales", "en", `${ns}.json`);
  const idPath = path.join(ROOT, "locales", LOCALE, `${ns}.json`);
  assert.ok(fs.existsSync(enPath), `missing EN ${ns}`);
  assert.ok(fs.existsSync(idPath), `missing id-ID ${ns}`);
  const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
  const id = JSON.parse(fs.readFileSync(idPath, "utf8"));
  return { en, id, idPath };
}

test("Phase 2A: 5/5 owned namespaces load from disk for id-ID", () => {
  for (const ns of OWNED) {
    const { id } = loadNs(ns);
    assert.equal(typeof id, "object");
    assert.ok(id && !Array.isArray(id));
  }
});

test("Phase 2A: structural parity — missing/extra/empty/placeholders (dynamic EN/ID totals)", () => {
  /** @type {string[]} */
  const missing = [];
  /** @type {string[]} */
  const extra = [];
  /** @type {string[]} */
  const empty = [];
  /** @type {string[]} */
  const placeholderMismatches = [];
  let enLeaves = 0;
  let idLeaves = 0;

  for (const ns of OWNED) {
    const { en, id } = loadNs(ns);
    const enMap = new Map();
    const idMap = new Map();
    collectLeaves(en, "", enMap);
    collectLeaves(id, "", idMap);
    enLeaves += enMap.size;
    idLeaves += idMap.size;

    for (const key of enMap.keys()) {
      if (!idMap.has(key)) missing.push(`${ns}.${key}`);
    }
    for (const key of idMap.keys()) {
      if (!enMap.has(key)) extra.push(`${ns}.${key}`);
    }
    for (const [key, value] of idMap) {
      if (typeof value === "string" && value.trim() === "") {
        empty.push(`${ns}.${key}`);
      }
      if (enMap.has(key)) {
        const a = placeholderSignature(enMap.get(key));
        const b = placeholderSignature(value);
        if (a !== b) placeholderMismatches.push(`${ns}.${key}`);
      }
    }
  }

  assert.ok(enLeaves > 0, "EN owned subset must have leaves");
  assert.equal(idLeaves, enLeaves, `id-ID owned leaves must match EN (en=${enLeaves}, id=${idLeaves})`);
  assert.equal(missing.length, 0, `missing keys: ${JSON.stringify(missing)}`);
  assert.equal(extra.length, 0, `extra keys: ${JSON.stringify(extra)}`);
  assert.equal(empty.length, 0, `empty leaves: ${JSON.stringify(empty)}`);
  assert.equal(
    placeholderMismatches.length,
    0,
    `placeholder mismatches: ${JSON.stringify(placeholderMismatches)}`
  );
});

test("Phase 2A: locked terminology smoke checks on disk", () => {
  const auth = loadNs("auth").id;
  const common = loadNs("common").id;
  const ui = loadNs("ui").id;
  const platform = loadNs("platform").id;
  const validation = loadNs("validation").id;

  assert.equal(auth.signIn, "Masuk");
  assert.equal(auth.password, "Kata sandi");
  assert.equal(common.logout, "Keluar");
  assert.equal(common.login, "Masuk");
  assert.equal(common.grade1, "Kelas 1");
  assert.equal(common.gradeLabel, "Kelas {grade}");
  assert.equal(ui.teacherShell.signOut, "Keluar");
  assert.match(ui.teacherShell.backToDashboard, /dasbor/i);
  assert.equal(ui.teacherShell.myClasses, "Rombel saya");
  assert.equal(ui.teacherShell.classReportTitle, "Laporan rombel");
  assert.equal(platform.roles.teacher, "Guru");
  assert.equal(platform.auditActions.school_class_archived, "Rombel diarsipkan");
  assert.equal(ui.student.childDefault, "Murid");
  assert.equal(ui.nav.loginStudent, "Masuk murid");
  assert.equal(ui.empty.noStudents, "Belum ada murid. Tambahkan anak untuk mulai.");
  assert.equal(validation.passwordMismatch, "Kata sandi tidak cocok.");
  assert.equal(validation.api.unauthorized, "Silakan masuk");
  assert.equal(validation.api.physical_class_not_found.includes("rombongan belajar"), true);
  assert.match(validation.api.session_expired, /Sesi telah berakhir/);
  assert.doesNotMatch(validation.api.session_expired, /\bkamu\b/i);
});

test("Phase 2A: no siswa / peserta didik; no empty accidental English auth chrome", () => {
  const blob = OWNED.map((ns) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, `${ns}.json`), "utf8")).join(
    "\n"
  );
  assert.equal(/\bsiswa\b/i.test(blob), false);
  assert.equal(/peserta didik/i.test(blob), false);
  assert.equal(/"Sign in"/.test(blob), false);
  assert.equal(/"Sign out"/.test(blob), false);
  assert.equal(/"Password"/.test(blob), false);
  assert.equal(/"Dashboard"/.test(blob), false);
  assert.equal(/"Log in"/.test(blob), false);
  assert.equal(/"Log out"/.test(blob), false);
});
