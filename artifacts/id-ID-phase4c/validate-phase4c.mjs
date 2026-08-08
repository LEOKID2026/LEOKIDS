/**
 * Phase 4C content-only structural + linguistic validation.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import assert from "node:assert/strict";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ART = path.join(ROOT, "artifacts/id-ID-phase4c");

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function relPosix(from, file) {
  return path.relative(from, file).split(path.sep).join("/");
}

function loadCopy(raw) {
  if (raw && typeof raw === "object" && raw.copy && typeof raw.copy === "object") return { wrap: "copy", map: raw.copy };
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return { wrap: "bare", map: raw };
  return null;
}

function phSig(s) {
  if (typeof s !== "string") return "";
  const simple = [];
  const re = /\{([a-zA-Z_][a-zA-Z0-9_]*)(?:,|\})/g;
  let m;
  while ((m = re.exec(s))) simple.push(m[1]);
  return `${[...simple].sort().join("|")}|plural=${/,\s*plural\s*,/.test(s)}|hash=${/#/.test(s)}`;
}

function collectLeafMaps(familyRoot) {
  /** @type {Map<string, {keys: Set<string>, leaves: Map<string,string>, wrap: string}>} */
  const files = new Map();
  for (const f of walk(familyRoot)) {
    const rel = relPosix(familyRoot, f);
    if (rel === "burn-down-index.json") continue;
    const loaded = loadCopy(JSON.parse(fs.readFileSync(f, "utf8")));
    assert.ok(loaded, `bad shape ${rel}`);
    const keys = new Set(Object.keys(loaded.map));
    const leaves = new Map();
    for (const [k, v] of Object.entries(loaded.map)) {
      assert.equal(typeof v, "string", `${rel}.${k} not string`);
      leaves.set(k, v);
    }
    files.set(rel, { keys, leaves, wrap: loaded.wrap });
  }
  return files;
}

function indexSlugCount(indexPath) {
  const idx = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  return Object.keys(idx).length;
}

const report = {
  global: {},
  reports: {},
  defects: {
    missingFiles: [],
    orphanFiles: [],
    missingKeys: [],
    extraKeys: [],
    emptyLeaves: [],
    placeholderMismatches: [],
    schemaDefects: [],
    studentTerm: [],
    gradeClass: [],
    reportTerm: [],
    adultRegister: [],
    unexplainedEnglish: [],
  },
  intentionalEnglish: [],
  counts: {},
};

function auditFamily(name, enRootRel, idRootRel) {
  const enRoot = path.join(ROOT, enRootRel);
  const idRoot = path.join(ROOT, idRootRel);
  const enFiles = [...collectLeafMaps(enRoot).keys()].sort();
  const idMaps = collectLeafMaps(idRoot);
  const idFiles = [...idMaps.keys()].sort();
  const enMaps = collectLeafMaps(enRoot);

  const missingFiles = enFiles.filter((f) => !idMaps.has(f));
  const orphanFiles = idFiles.filter((f) => !enMaps.has(f));
  report.defects.missingFiles.push(...missingFiles.map((f) => `${name}/${f}`));
  report.defects.orphanFiles.push(...orphanFiles.map((f) => `${name}/${f}`));

  let enLeaves = 0;
  let idLeaves = 0;
  for (const f of enFiles) {
    const en = enMaps.get(f);
    const id = idMaps.get(f);
    if (!id) continue;
    enLeaves += en.leaves.size;
    idLeaves += id.leaves.size;
    if (en.wrap !== id.wrap) report.defects.schemaDefects.push(`${name}/${f} wrap ${en.wrap}→${id.wrap}`);
    for (const k of en.keys) {
      if (!id.keys.has(k)) report.defects.missingKeys.push(`${name}/${f}::${k}`);
    }
    for (const k of id.keys) {
      if (!en.keys.has(k)) report.defects.extraKeys.push(`${name}/${f}::${k}`);
    }
    for (const [k, ev] of en.leaves) {
      const iv = id.leaves.get(k);
      if (iv === undefined) continue;
      if (String(iv).trim() === "") report.defects.emptyLeaves.push(`${name}/${f}::${k}`);
      if (phSig(ev) !== phSig(iv)) {
        report.defects.placeholderMismatches.push({ path: `${name}/${f}::${k}`, en: ev, id: iv });
      }
    }
  }

  const enAll = walk(enRoot).map((f) => relPosix(enRoot, f)).sort();
  const idAll = walk(idRoot).map((f) => relPosix(idRoot, f)).sort();
  const enIndex = path.join(enRoot, "burn-down-index.json");
  const idIndex = path.join(idRoot, "burn-down-index.json");
  assert.ok(fs.existsSync(enIndex));
  assert.ok(fs.existsSync(idIndex));
  const enIdxPacks = indexSlugCount(enIndex);
  const idIdxPacks = indexSlugCount(idIndex);

  report[name === "global-burn-down" ? "global" : "reports"] = {
    enFiles: enAll.length,
    idFiles: idAll.length,
    enLeafFiles: enFiles.length,
    idLeafFiles: idFiles.length,
    enLeaves,
    idLeaves,
    enIndexPacks: enIdxPacks,
    idIndexPacks: idIdxPacks,
  };
}

auditFamily("global-burn-down", "content-packs/en/global-burn-down", "content-packs/id-ID/global-burn-down");
auditFamily("reports", "content-packs/en/reports", "content-packs/id-ID/reports");

// Linguistic blob over owned id-ID packs (leaf + index)
const idBlobFiles = [
  ...walk(path.join(ROOT, "content-packs/id-ID/global-burn-down")),
  ...walk(path.join(ROOT, "content-packs/id-ID/reports")),
];
const blob = idBlobFiles.map((f) => fs.readFileSync(f, "utf8")).join("\n");

if (/\bsiswa\b/i.test(blob)) report.defects.studentTerm.push("siswa found");
if (/peserta didik/i.test(blob)) report.defects.studentTerm.push("peserta didik found");
if (/\bkamu\b/i.test(blob)) report.defects.adultRegister.push("kamu found");

// School semantic probes
const drill = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, "content-packs/id-ID/global-burn-down/components__school-portal__SchoolDrillDown.json"),
    "utf8"
  )
).copy;
if (!/Kelas/i.test(drill.grade_status || "")) report.defects.gradeClass.push(`grade_status=${drill.grade_status}`);
if (!/rombel|rombongan belajar/i.test(drill.class_status || "")) {
  report.defects.gradeClass.push(`class_status=${drill.class_status}`);
}
if (!/rombel|rombongan belajar|kelas/i.test(drill.col_class || "")) {
  // col_class is physical in this component
  if (!/Rombel|rombongan/i.test(drill.col_class || "")) report.defects.gradeClass.push(`col_class=${drill.col_class}`);
}
if (drill.grade_status === drill.class_status) report.defects.gradeClass.push("grade_status === class_status");

// Report chrome smoke
const display = JSON.parse(
  fs.readFileSync(
    path.join(
      ROOT,
      "content-packs/id-ID/reports/burn-down/utils__parent-report-language__parent-report-display-labels.json"
    ),
    "utf8"
  )
).copy;
if (!/laporan/i.test(display.report || "")) report.defects.reportTerm.push(`report=${display.report}`);
if (!/Matematika/i.test(display.subject_math || "")) report.defects.reportTerm.push(`subject_math=${display.subject_math}`);
if (!/Kelas/i.test(display.activity_subject_grade || "")) {
  report.defects.gradeClass.push(`activity_subject_grade=${display.activity_subject_grade}`);
}

// Unexplained English: identical EN/ID values that look like UI prose
const dict = JSON.parse(fs.readFileSync(path.join(ART, "dict-merged.json"), "utf8"));
  const intentionalPatterns = [
    /___/, // fill blanks
    /^The cat is red$/i,
    /^The apple is/i,
    /^She likes red$/i,
    /^Train departs$/i,
    /^The room is dark/i,
    /^Could I get some help/i,
    /^Arial,\s*Helvetica/i,
    /^N\/A$/,
    /^name@example\.com$/,
    /^String\(/,
    /printWithMode/,
    /className=/,
    /ParentAiInsight/,
    /engineConfidenceTier/,
    /insufficient_data/,
    /needsHumanReview/,
    /ENABLE_MONTHLY/,
    /NotoSans/,
    /math_\$\{kind\}/,
    /`math_/,
    /^[\d\s\-–—·|/]+$/,
    /^[A-Z]{2,10}$/, // acronyms
  ];

let identical = 0;
let unexplained = 0;
for (const [en, id] of Object.entries(dict)) {
  if (en !== id) continue;
  identical++;
  const ok = intentionalPatterns.some((re) => re.test(en)) || en.length <= 2 || /^[A-Za-z0-9_./${}`()\-+\[\]"'\\=#\s]+$/.test(en) && !/\s/.test(en.trim()) && en.length < 40;
  // short machine tokens without spaces
  const machiney = !/[a-z]{4,}\s+[a-z]{3,}/i.test(en) && (/[_$`=]/.test(en) || /^[A-Z0-9_/.\-]+$/.test(en));
  const fillBlank = /___/.test(en) || /\b(she|they|we|the|if|learning|honest|exploring|communities|after|although|before|by the|could|students|technology|please)\b/i.test(en) && /___|\.\.\.|___/.test(en + "___");
  const engLearning =
    /___/.test(en) ||
    /^(The cat is red|The apple is|She likes red|Train departs|The room is dark)/i.test(en) ||
    (/\b(she|they|we|students|technology|please|after|although|before|by the|could|exploring|honest|learning|communities|if it|if we)\b/i.test(en) &&
      (/___/.test(en) || /prefer|finished|asked|recycle|rains|feedback|cultures|evidence|carefully|science fair|listen carefully/i.test(en)));

  if (ok || machiney || engLearning) {
    report.intentionalEnglish.push(en);
  } else if (/\b(the|and|with|for|your|please|loading|report|class|grade|student|teacher|dashboard|click|save|cancel)\b/i.test(en) && en.split(/\s+/).length >= 2) {
    unexplained++;
    report.defects.unexplainedEnglish.push(en);
  } else if (en.split(/\s+/).length >= 3 && /[a-z]{3,}/i.test(en)) {
    unexplained++;
    report.defects.unexplainedEnglish.push(en);
  } else {
    report.intentionalEnglish.push(en);
  }
}

report.counts = {
  identicalLeaves: identical,
  intentionalEnglish: report.intentionalEnglish.length,
  unexplainedEnglish: unexplained,
  missingFiles: report.defects.missingFiles.length,
  orphanFiles: report.defects.orphanFiles.length,
  missingKeys: report.defects.missingKeys.length,
  extraKeys: report.defects.extraKeys.length,
  emptyLeaves: report.defects.emptyLeaves.length,
  placeholderMismatches: report.defects.placeholderMismatches.length,
  schemaDefects: report.defects.schemaDefects.length,
  studentTerm: report.defects.studentTerm.length,
  gradeClass: report.defects.gradeClass.length,
  reportTerm: report.defects.reportTerm.length,
  adultRegister: report.defects.adultRegister.length,
};

fs.writeFileSync(path.join(ART, "validate-results.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ global: report.global, reports: report.reports, counts: report.counts }, null, 2));
if (report.defects.unexplainedEnglish.length) {
  console.log("unexplained sample", report.defects.unexplainedEnglish.slice(0, 30));
}
if (report.defects.gradeClass.length) console.log("gradeClass", report.defects.gradeClass);
if (report.defects.placeholderMismatches.length) {
  console.log("ph sample", report.defects.placeholderMismatches.slice(0, 5));
}

test("Phase 4C file + key parity", () => {
  assert.equal(report.counts.missingFiles, 0);
  assert.equal(report.counts.orphanFiles, 0);
  assert.equal(report.counts.missingKeys, 0);
  assert.equal(report.counts.extraKeys, 0);
  assert.equal(report.counts.emptyLeaves, 0);
  assert.equal(report.counts.placeholderMismatches, 0);
  assert.equal(report.counts.schemaDefects, 0);
  assert.equal(report.global.enFiles, report.global.idFiles);
  assert.equal(report.reports.enFiles, report.reports.idFiles);
  assert.equal(report.global.enLeaves, report.global.idLeaves);
  assert.equal(report.reports.enLeaves, report.reports.idLeaves);
  assert.equal(report.global.enIndexPacks, report.global.idIndexPacks);
  assert.equal(report.reports.enIndexPacks, report.reports.idIndexPacks);
});

test("Phase 4C linguistic defects zero", () => {
  assert.equal(report.counts.studentTerm, 0);
  assert.equal(report.counts.gradeClass, 0);
  assert.equal(report.counts.reportTerm, 0);
  assert.equal(report.counts.adultRegister, 0);
  assert.equal(report.counts.unexplainedEnglish, 0);
});

test("Phase 4C school Kelas vs rombel probes", () => {
  assert.match(drill.grade_status, /Kelas/i);
  assert.match(drill.class_status, /rombel|rombongan belajar/i);
  assert.notEqual(drill.grade_status, drill.class_status);
  assert.match(display.activity_subject_grade, /Kelas/);
});
