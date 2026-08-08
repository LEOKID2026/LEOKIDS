/**
 * Phase 4B parity + terminology + unexplained English UI audit.
 */
import fs from "node:fs";
import path from "node:path";
import { walkLeaves, placeholders, shouldPreserveString, isEnglishLearningLeaf } from "./helpers.mjs";

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, acc);
    else if (e.name.endsWith(".json")) acc.push(p);
  }
  return acc;
}

function relKey(f) {
  return f.split(path.sep).join("/");
}

function keyTree(node, prefix = [], out = new Set()) {
  if (node === null || typeof node !== "object") {
    out.add(prefix.join("."));
    return out;
  }
  if (Array.isArray(node)) {
    if (node.length === 0) out.add(prefix.join("."));
    node.forEach((v, i) => keyTree(v, prefix.concat(String(i)), out));
    return out;
  }
  const keys = Object.keys(node);
  if (keys.length === 0) out.add(prefix.join("."));
  for (const k of keys) keyTree(node[k], prefix.concat(k), out);
  return out;
}

const report = {
  families: {},
  global: {
    missingKeys: 0,
    extraKeys: 0,
    emptyRequiredLeaves: 0,
    schemaDefects: 0,
    placeholderMismatches: 0,
  },
  intentionalEnglish: [],
  unexplainedEnglishUi: [],
  gameTermDefects: [],
  studentTermDefects: [],
  gradeTermDefects: [],
  registerDefects: [],
};

for (const fam of ["games", "rewards", "demo"]) {
  const enFiles = walkFiles(path.join("content-packs/en", fam)).map(relKey).sort();
  const idFiles = walkFiles(path.join("content-packs/id-ID", fam)).map(relKey).sort();
  const enRel = enFiles.map((f) => f.replace(`content-packs/en/${fam}/`, ""));
  const idRel = idFiles.map((f) => f.replace(`content-packs/id-ID/${fam}/`, ""));
  const missingFiles = enRel.filter((f) => !idRel.includes(f));
  const orphanFiles = idRel.filter((f) => !enRel.includes(f));

  let enLeaves = 0;
  let idLeaves = 0;
  let missingKeys = 0;
  let extraKeys = 0;
  let empty = 0;
  let schema = 0;
  let ph = 0;

  for (const rel of enRel) {
    const enPath = path.join("content-packs/en", fam, rel);
    const idPath = path.join("content-packs/id-ID", fam, rel);
    if (!fs.existsSync(idPath)) continue;
    const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
    const id = JSON.parse(fs.readFileSync(idPath, "utf8"));
    const eLeaves = walkLeaves(en);
    const iLeaves = walkLeaves(id);
    enLeaves += eLeaves.length;
    idLeaves += iLeaves.length;
    const eKeys = keyTree(en);
    const iKeys = keyTree(id);
    for (const k of eKeys) if (!iKeys.has(k)) missingKeys += 1;
    for (const k of iKeys) if (!eKeys.has(k)) extraKeys += 1;

    const iMap = new Map(iLeaves.map((L) => [L.path, L]));
    for (const L of eLeaves) {
      const R = iMap.get(L.path);
      if (!R) {
        schema += 1;
        continue;
      }
      if (typeof L.value !== typeof R.value) schema += 1;
      if (typeof L.value === "string") {
        if (typeof R.value !== "string" || R.value.trim() === "") empty += 1;
        else if (JSON.stringify(placeholders(L.value)) !== JSON.stringify(placeholders(R.value))) ph += 1;

        const fullRel = `content-packs/en/${fam}/${rel}`;
        const idVal = R.value;
        // terminology on Indonesian values
        if (/\b(permainan)\b/i.test(idVal) || (/\bgames?\b/i.test(idVal) && !/LEO|Leo|Bingo|Ludo|Connect/i.test(idVal))) {
          // allow Game over / product; flag permainan and bare game
          if (/\bpermainan\b/i.test(idVal) || /\b(game|games)\b/i.test(idVal)) {
            report.gameTermDefects.push(`${fam}/${rel}::${L.path}: ${idVal}`);
          }
        }
        if (/\b(siswa|peserta didik)\b/i.test(idVal)) report.studentTermDefects.push(`${fam}/${rel}::${L.path}: ${idVal}`);
        if (/\bGrade\s*[1-6]\b/.test(idVal) || /\bFase\s*[ABC]\b/i.test(idVal)) {
          report.gradeTermDefects.push(`${fam}/${rel}::${L.path}: ${idVal}`);
        }
        if (/\bAnda\b/.test(idVal)) report.registerDefects.push(`${fam}/${rel}::${L.path}: ${idVal}`);

        // English UI detection on ID leaf when EN was translated-eligible
        if (
          !shouldPreserveString(L.key, L.value, L.path, fullRel) &&
          idVal === L.value &&
          /[A-Za-z]{3,}/.test(idVal) &&
          /\s/.test(idVal) &&
          !isEnglishLearningLeaf(fullRel, L.path, L.value)
        ) {
          // likely untranslated English UI
          report.unexplainedEnglishUi.push(`${fam}/${rel}::${L.path}: ${idVal.slice(0, 120)}`);
        } else if (isEnglishLearningLeaf(fullRel, L.path, L.value) || (idVal === L.value && shouldPreserveString(L.key, L.value, L.path, fullRel) === false && /leo-word/i.test(fullRel))) {
          if (idVal === L.value && /[A-Za-z]{3,}/.test(idVal)) {
            report.intentionalEnglish.push(`${fam}/${rel}::${L.path}`);
          }
        }
      }
    }
  }

  report.families[fam] = {
    enFiles: enFiles.length,
    idFiles: idFiles.length,
    missingFiles: missingFiles.length,
    orphanFiles: orphanFiles.length,
    missingFileSample: missingFiles.slice(0, 10),
    orphanFileSample: orphanFiles.slice(0, 10),
    enLeaves,
    idLeaves,
    missingKeys,
    extraKeys,
    empty,
    schema,
    placeholderMismatches: ph,
  };
  report.global.missingKeys += missingKeys;
  report.global.extraKeys += extraKeys;
  report.global.emptyRequiredLeaves += empty;
  report.global.schemaDefects += schema;
  report.global.placeholderMismatches += ph;
}

// Deduplicate / trim
report.intentionalEnglish = [...new Set(report.intentionalEnglish)];
report.unexplainedEnglishUi = [...new Set(report.unexplainedEnglishUi)];
report.gameTermDefects = [...new Set(report.gameTermDefects)];
report.studentTermDefects = [...new Set(report.studentTermDefects)];
report.gradeTermDefects = [...new Set(report.gradeTermDefects)];
report.registerDefects = [...new Set(report.registerDefects)];

fs.writeFileSync("artifacts/id-ID-phase4b/parity-audit.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ families: report.families, global: report.global }, null, 2));
console.log("intentionalEnglish", report.intentionalEnglish.length);
console.log("unexplainedEnglishUi", report.unexplainedEnglishUi.length);
console.log(report.unexplainedEnglishUi.slice(0, 40));
console.log("gameTerm", report.gameTermDefects.length, report.gameTermDefects.slice(0, 20));
console.log("student", report.studentTermDefects);
console.log("grade", report.gradeTermDefects);
console.log("register", report.registerDefects);
