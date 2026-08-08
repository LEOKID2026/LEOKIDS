/**
 * Focused validation — Indonesian Master School Final Linguistic Residuals
 * Ownership: NEW-A-001, NEW-A-002, NEW-A-003, ID-A-011
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "artifacts/id-ID-school-final-linguistic-residuals");

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(p)) out.push(p);
  }
  return out;
}

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, "/");
}

function countInFiles(files, patterns) {
  let total = 0;
  const hits = [];
  for (const f of files) {
    const text = fs.readFileSync(f, "utf8");
    for (const pat of patterns) {
      const re = typeof pat === "string" ? new RegExp(pat, "g") : new RegExp(pat.source, pat.flags.includes("g") ? pat.flags : `${pat.flags}g`);
      const m = text.match(re);
      if (m) {
        total += m.length;
        hits.push({ file: rel(f), pattern: String(pat), count: m.length });
      }
    }
  }
  return { total, hits };
}

function flatLeaves(obj, prefix = "", out = {}) {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      flatLeaves(v, prefix ? `${prefix}.${k}` : k, out);
    }
    return out;
  }
  out[prefix] = obj;
  return out;
}

function namespaceLeaves(localeDir) {
  let total = 0;
  const files = fs.readdirSync(localeDir).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    total += Object.keys(flatLeaves(JSON.parse(fs.readFileSync(path.join(localeDir, f), "utf8")))).length;
  }
  return total;
}

function schoolParity() {
  const en = flatLeaves(JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en/school.json"), "utf8")));
  const id = flatLeaves(JSON.parse(fs.readFileSync(path.join(ROOT, "locales/id-ID/school.json"), "utf8")));
  const ek = Object.keys(en);
  const ik = Object.keys(id);
  const missing = ek.filter((k) => !(k in id));
  const extra = ik.filter((k) => !(k in en));
  const empty = [...ek, ...ik].filter((k) => {
    const v = k in en ? en[k] : id[k];
    return typeof v === "string" && !String(v).trim();
  });
  const placeholderMismatches = ek.filter((k) => {
    if (!(k in id)) return false;
    const a = String(en[k] ?? "").match(/\{(\w+)\}/g) || [];
    const b = String(id[k] ?? "").match(/\{(\w+)\}/g) || [];
    return a.slice().sort().join() !== b.slice().sort().join();
  });
  return {
    missing,
    extra,
    empty,
    placeholderMismatches,
    enSchoolLeaves: ek.length,
    idSchoolLeaves: ik.length,
  };
}

const monitorFile = [path.join(ROOT, "pages/school/activities/[activityId]/monitor.js")];
const teacherDetailFiles = [
  path.join(ROOT, "components/school-portal/SchoolTeacherDetailContent.jsx"),
  path.join(ROOT, "pages/school/teachers/[teacherId].js"),
];
const classesBrowseFile = [path.join(ROOT, "pages/school/classes/index.js")];
const schoolOwnedFiles = [
  ...walk(path.join(ROOT, "pages/school"), (p) => /\.(js|jsx)$/.test(p)),
  ...walk(path.join(ROOT, "components/school-portal"), (p) => /\.(js|jsx)$/.test(p)),
  path.join(ROOT, "lib/school-portal/use-school-portal-session.js"),
];

const monitorEn = [
  "Back to activities",
  "Class accuracy",
  "View answers",
  '"Network error"',
  "Children:",
  "Questions:",
  ">Child<",
  ">Answers<",
  ">Correct<",
  ">Details<",
];

const teacherDetailEn = [
  "Network error loading teacher details",
  "No teacher ID found",
  " children`",
  "Authorized subjects",
  '"Subject"',
  '"Child"',
];

const classesBrowseEn = [
  "6 subjects",
  " physical classes",
  "Class status:",
];

const networkFallbackEn = [
  '"Network error"',
  "Network error loading",
  '"Failed to ',
  '"Error loading',
  '"Invite failed"',
  '"Creation failed"',
  '"Action failed"',
  '"Invite completed successfully"',
];

const monitorAfter = countInFiles(monitorFile, monitorEn);
const teacherAfter = countInFiles(teacherDetailFiles, teacherDetailEn);
const classesAfter = countInFiles(classesBrowseFile, classesBrowseEn);
const networkAfter = countInFiles(schoolOwnedFiles, networkFallbackEn);

const parity = schoolParity();
const enLeaves = namespaceLeaves(path.join(ROOT, "locales/en"));
const idLeaves = namespaceLeaves(path.join(ROOT, "locales/id-ID"));

// Kelas/rombel + adult register probes on new id-ID keys
const schoolId = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/id-ID/school.json"), "utf8"));
const portal = schoolId.portal || {};
let kelasRombelDefects = 0;
let adultRegisterDefects = 0;
if (!/rombel/i.test(String(portal.classAccuracy || ""))) kelasRombelDefects += 1;
if (!/rombongan belajar|rombel/i.test(String(portal.physicalClassesCount || ""))) kelasRombelDefects += 1;
if (!/rombel/i.test(String(portal.classStatusWithValue || ""))) kelasRombelDefects += 1;
if (/\bKelas\b/.test(String(portal.classAccuracy || ""))) kelasRombelDefects += 1;
for (const v of Object.values(portal)) {
  if (/\bkamu\b/i.test(String(v))) adultRegisterDefects += 1;
}

// Phase9 School API regression probes on owned surfaces
const phase9 = countInFiles(schoolOwnedFiles, [
  /body\?\.error\?\.message/,
  /json\?\.error\?\.message/,
  /\|\|\s*"Error/,
  /\|\|\s*"Failed/,
  /\|\|\s*"Network/,
]);

const failed =
  monitorAfter.total +
    teacherAfter.total +
    classesAfter.total +
    networkAfter.total +
    parity.missing.length +
    parity.extra.length +
    parity.empty.length +
    parity.placeholderMismatches.length +
    kelasRombelDefects +
    adultRegisterDefects +
    phase9.total >
  0;

const result = {
  NEW_A_001_monitorEnglishAfter: monitorAfter.total,
  NEW_A_002_teacherDetailEnglishAfter: teacherAfter.total,
  NEW_A_003_classesBrowseEnglishAfter: classesAfter.total,
  ID_A_011_networkFallbackEnglishAfter: networkAfter.total,
  kelasRombelDefects,
  adultRegisterDefects,
  phase9SchoolApiRegressionHits: phase9.total,
  schoolNamespace: {
    missing: parity.missing.length,
    extra: parity.extra.length,
    empty: parity.empty.length,
    placeholderMismatches: parity.placeholderMismatches.length,
    enSchoolLeaves: parity.enSchoolLeaves,
    idSchoolLeaves: parity.idSchoolLeaves,
  },
  currentEnNamespaceLeaves: enLeaves,
  currentIdNamespaceLeaves: idLeaves,
  hits: {
    monitor: monitorAfter.hits,
    teacherDetail: teacherAfter.hits,
    classesBrowse: classesAfter.hits,
    network: networkAfter.hits,
    phase9: phase9.hits,
  },
  pass: !failed,
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "focused-validation.json"), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 2));
process.exit(failed ? 1 : 0);
