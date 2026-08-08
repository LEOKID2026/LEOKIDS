/**
 * Focused validation for Indonesian Master Teacher/School Residual Chrome corrections.
 * Ownership: ID-A-006, ID-A-010, ID-A-011, ID-A-017
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(p)) out.push(p);
  }
  return out;
}

function countPatterns(files, patterns) {
  let total = 0;
  const hits = [];
  for (const f of files) {
    const text = fs.readFileSync(f, "utf8");
    for (const pat of patterns) {
      const re = new RegExp(pat, "g");
      const m = text.match(re);
      if (m) {
        total += m.length;
        hits.push({ file: path.relative(ROOT, f).replace(/\\/g, "/"), pattern: pat, count: m.length });
      }
    }
  }
  return { total, hits };
}

const classReportFiles = [path.join(ROOT, "pages/teacher/class/[classId].js")];
const worksheetFiles = walk(
  path.join(ROOT, "pages/teacher"),
  (p) => p.includes(`${path.sep}worksheets${path.sep}`) && /\.(js|jsx)$/.test(p)
);
const discussionFiles = [path.join(ROOT, "pages/teacher/class/[classId]/discussion/new.js")];
const schoolFiles = [
  ...walk(path.join(ROOT, "pages/school"), (p) => /\.(js|jsx)$/.test(p)),
  path.join(ROOT, "components/school-portal/SchoolTeacherDetailContent.jsx"),
  path.join(ROOT, "components/school-portal/SchoolOperatorsManager.jsx"),
];

const classReportPatterns = [
  "Class summary",
  "Class performance by subject",
  "Topics that need reinforcement",
  "Suggested support groups",
  "active students",
  "No problematic topics found in this period",
  "Not enough students with data to form groups",
  "Not enough data to form groups",
  "Students who need monitoring",
  "Suggested work groups",
  "Focus for next lesson",
  "Reinforcement suggestions",
  "Enrichment suggestions",
];

const worksheetPatterns = [
  "Not signed in",
  "Saved and marked as reviewed",
  "Progress saved",
  "Please select at least one student",
  "Activity mode",
];

const discussionPatterns = [
  "Could not load class",
  "This class grade level is invalid",
];

const schoolPatterns = [
  "Error loading report",
  "Error loading data",
  "Error loading messages",
  "Error loading children",
  "Failed to load",
  "Failed to update permissions",
  "Error loading portal",
];

const classAfter = countPatterns(classReportFiles, classReportPatterns);
const wsAfter = countPatterns(worksheetFiles, worksheetPatterns);
const discAfter = countPatterns(discussionFiles, discussionPatterns);
const schoolAfter = countPatterns(schoolFiles, schoolPatterns);

// EN/id-ID owned slug parity
const ownedSlugs = [
  "pages__teacher__class__[classId]",
  "pages__teacher__worksheets__new",
  "pages__teacher__class__[classId]__worksheets__new",
  "pages__teacher__worksheets__[worksheetId]__grade__[studentId]",
  "pages__teacher__class__[classId]__worksheets__[worksheetId]__grade__[studentId]",
  "pages__teacher__worksheets__[worksheetId]",
  "pages__teacher__class__[classId]__worksheets__[worksheetId]",
  "pages__teacher__worksheets__[worksheetId]__report",
  "pages__teacher__class__[classId]__worksheets__[worksheetId]__report",
  "pages__teacher__class__[classId]__discussion__new",
];
const enIndex = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content-packs/en/global-burn-down/burn-down-index.json"), "utf8")
);
const idIndex = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content-packs/id-ID/global-burn-down/burn-down-index.json"), "utf8")
);
let missingKeys = 0;
let emptyLeaves = 0;
for (const slug of ownedSlugs) {
  const ek = Object.keys(enIndex[slug] || {});
  const ik = Object.keys(idIndex[slug] || {});
  for (const k of ek) if (!ik.includes(k)) missingKeys += 1;
  for (const k of ik) {
    if (!ek.includes(k)) missingKeys += 1;
    if (!String(idIndex[slug][k] || "").trim()) emptyLeaves += 1;
  }
}

const schoolEn = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en/school.json"), "utf8"));
const schoolId = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/id-ID/school.json"), "utf8"));
const schoolKeys = [
  "reportLoadError",
  "messagesLoadError",
  "childrenLoadError",
  "permissionsUpdateError",
  "portalLoadError",
];
let schoolNsParity = 0;
for (const k of schoolKeys) {
  if (!schoolEn.portal?.[k] || !schoolId.portal?.[k]) schoolNsParity += 1;
}

// Adult register + Kelas/rombel probes
const classPack = enIndex["pages__teacher__class__[classId]"]
  ? idIndex["pages__teacher__class__[classId]"]
  : {};
const discPack = idIndex["pages__teacher__class__[classId]__discussion__new"] || {};
let kamuHits = 0;
let semanticDefects = 0;
for (const [k, v] of Object.entries(classPack)) {
  if (/\bkamu\b/i.test(String(v))) kamuHits += 1;
}
for (const v of Object.values(discPack)) {
  if (/\bkamu\b/i.test(String(v))) kamuHits += 1;
}
if (!/rombel/i.test(String(discPack.err_load_class || ""))) semanticDefects += 1;
if (!/kelas/i.test(String(discPack.err_invalid_grade || ""))) semanticDefects += 1;
if (!/rombel/i.test(String(classPack.class_summary || ""))) semanticDefects += 1;
if (/\bKelas\b/.test(String(classPack.class_summary || ""))) semanticDefects += 1;

const failed =
  classAfter.total +
    wsAfter.total +
    discAfter.total +
    schoolAfter.total +
    missingKeys +
    emptyLeaves +
    schoolNsParity +
    kamuHits +
    semanticDefects >
  0;

const result = {
  classReportEnglishAfter: classAfter.total,
  worksheetEnglishAfter: wsAfter.total,
  discussionEnglishAfter: discAfter.total,
  schoolFallbackEnglishAfter: schoolAfter.total,
  ownedSlugKeyParityDefects: missingKeys,
  emptyIdLeaves: emptyLeaves,
  schoolNamespaceParityDefects: schoolNsParity,
  adultRegisterDefects: kamuHits,
  kelasRombelSemanticDefects: semanticDefects,
  hits: {
    classReport: classAfter.hits,
    worksheets: wsAfter.hits,
    discussion: discAfter.hits,
    school: schoolAfter.hits,
  },
  pass: !failed,
};

fs.mkdirSync(path.join(ROOT, "artifacts/id-ID-teacher-school-residual-chrome"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "artifacts/id-ID-teacher-school-residual-chrome/focused-validation.json"),
  JSON.stringify(result, null, 2) + "\n"
);
console.log(JSON.stringify(result, null, 2));
process.exit(failed ? 1 : 0);
