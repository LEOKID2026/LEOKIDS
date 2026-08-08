/**
 * Indonesian Master Phase 2C — Adult Portals & Reports namespace parity.
 * English SoT → id-ID disk files: reports, emails, legal, teacher, school, copilot.
 *
 * Authority: dynamic EN/ID leaf totals for the owned subset + active id-ID runtime overlay.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  I18N_NAMESPACES,
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";

const ROOT = process.cwd();
const LOCALE = "id-ID";
const OWNED = ["reports", "emails", "legal", "teacher", "school", "copilot"];
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

test("Phase 2C: id-ID runtime overlay is active (not English fallback)", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles(LOCALE);
  for (const ns of I18N_NAMESPACES) {
    assert.ok(bundles[ns] && typeof bundles[ns] === "object", ns);
  }
  assert.equal(lookupMessage(bundles, "school.portal.navDashboard"), "Dasbor");
  assert.equal(lookupMessage(bundles, "teacher.subjects.math"), "Matematika");
  assert.equal(lookupMessage(bundles, "emails.welcomeSubject"), "Selamat datang di Leo Kids");
  assert.notEqual(lookupMessage(bundles, "school.portal.navDashboard"), "Dashboard");
});

test("Phase 2C: 6/6 owned namespaces load from disk for id-ID", () => {
  for (const ns of OWNED) {
    const { id } = loadNs(ns);
    assert.equal(typeof id, "object");
    assert.ok(id && !Array.isArray(id));
  }
});

test("Phase 2C: structural parity — missing/extra/empty/placeholders (dynamic EN/ID totals)", () => {
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

test("Phase 2C: school Kelas vs rombel semantic probes", () => {
  const school = loadNs("school").id;
  assert.equal(school.portal.colGrade, "Kelas");
  assert.equal(school.portal.colClass, "Rombel");
  assert.notEqual(school.portal.colGrade, school.portal.colClass);
  assert.equal(school.portal.chooseGrade, "Pilih kelas");
  assert.equal(school.portal.choosePhysicalClass, "Pilih rombongan belajar");
  assert.equal(school.portal.classLabel, "Rombel");
  assert.equal(school.portal.assignCurrentGrade, "Kelas saat ini");
  assert.equal(school.portal.assignCurrentClass, "Rombel saat ini");
  assert.equal(school.portal.classMgmtGrade, "Kelas");
  assert.match(school.portal.classMgmtName, /rombongan belajar/i);
  assert.equal(school.communication.detailsFieldGrade, "Kelas");
  assert.equal(school.communication.detailsFieldClass, "Rombel");
  assert.match(school.reportSummary.studentLine, /Kelas:/);
  assert.equal(school.portal.navDashboard, "Dasbor");
  assert.equal(school.portal.navStudents, "Murid");
  assert.equal(school.communication.relationGuardian, "Wali murid");
  assert.equal(school.portal.statusLabel, "Status");
  assert.equal(school.portal.activityColStatus, "Status");
});

test("Phase 2C: teacher contract — subject IDs preserved; adult register", () => {
  const teacher = loadNs("teacher").id;
  assert.deepEqual(teacher.reportSubjects, ["math", "geometry", "english", "science"]);
  assert.equal(teacher.subjects.math, "Matematika");
  assert.equal(teacher.fallback.defaultStudentName, "Murid");
  assert.match(teacher.dashboard.noClassesTitle, /rombongan belajar/i);
  assert.match(teacher.classHealth.strong, /rombongan belajar/i);
  assert.equal(teacher.dashboard.createClassLabel, "Nama rombongan belajar");
});

test("Phase 2C: emails / legal / reports / copilot smoke + no forbidden terms", () => {
  const emails = loadNs("emails").id;
  const legal = loadNs("legal").id;
  const reports = loadNs("reports").id;
  const copilot = loadNs("copilot").id;

  assert.equal(emails.welcomeSubject, "Selamat datang di Leo Kids");
  assert.match(emails.resetSubject, /Leo Kids/);
  assert.equal(legal.privacyTitle, "Kebijakan privasi");
  assert.match(legal.placeholderNotice, /placeholder/i);
  assert.equal(reports.shortTitle, "Laporan kemajuan");
  assert.equal(reports.detailedTitle, "Laporan terperinci");
  assert.match(reports.topicNeedsStrengthening, /\{topic\}/);
  assert.match(reports.topicNeedsStrengthening, /\{accuracy\}/);
  assert.match(reports.topicNeedsStrengthening, /\{questions\}/);
  assert.match(copilot.boundary.privacyBoundary, /orang tua/i);
  assert.match(copilot.boundary.generalOffTopic, /Anda|anak Anda/i);
  assert.match(
    copilot.answers["lib_parent-copilot_copilot-turn-payload"].server
      .invalid_custom_range_rangefrom_rangeto_must_be_yyyy_mm_dd_and_fr,
    /rangeFrom\/rangeTo/
  );

  const blob = OWNED.map((ns) =>
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, `${ns}.json`), "utf8")
  ).join("\n");
  assert.equal(/\bsiswa\b/i.test(blob), false);
  assert.equal(/peserta didik/i.test(blob), false);
  assert.equal(/\bkamu\b/i.test(blob), false);
  assert.equal(/"Dashboard"/.test(blob), false);
  assert.equal(/"Children"/.test(blob), false);
  assert.equal(/"Sign out"/.test(blob), false);
});
