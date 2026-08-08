/**
 * Indonesian Master Phase 2C — disk parity / placeholder / terminology audit
 * for owned adult namespaces (does not modify loader).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const NSS = ["reports", "emails", "legal", "teacher", "school", "copilot"];

function walkLeaves(obj, prefix = "", out = []) {
  if (obj === null || typeof obj !== "object") {
    out.push({ path: prefix, value: obj });
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => walkLeaves(v, `${prefix}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    walkLeaves(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

function walkKeys(obj, prefix = "", out = []) {
  if (obj === null || typeof obj !== "object") {
    out.push(prefix);
    return out;
  }
  if (Array.isArray(obj)) {
    // arrays of primitives: treat as one leaf path; arrays of objects: recurse indices
    if (obj.every((x) => x === null || typeof x !== "object")) {
      out.push(prefix);
      return out;
    }
    obj.forEach((v, i) => walkKeys(v, `${prefix}[${i}]`, out));
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    walkKeys(v, prefix ? `${prefix}.${k}` : k, out);
  }
  return out;
}

function placeholders(s) {
  if (typeof s !== "string") return "";
  const found = s.match(/\{[a-zA-Z0-9_]+\}/g) || [];
  return found.slice().sort().join("|");
}

function isEmptyLeaf(v) {
  return v === "" || v === null || v === undefined;
}

const summary = {
  namespaces: {},
  totals: {
    enLeaves: 0,
    idLeaves: 0,
    missingKeys: 0,
    extraKeys: 0,
    emptyLeaves: 0,
    placeholderMismatches: 0,
    studentTermDefects: 0,
    gradeClassDefects: 0,
    adultRegisterDefects: 0,
    reportTermDefects: 0,
    untranslatedEnglish: 0,
  },
  defects: {
    missingKeys: [],
    extraKeys: [],
    emptyLeaves: [],
    placeholderMismatches: [],
    studentTermDefects: [],
    gradeClassDefects: [],
    adultRegisterDefects: [],
    reportTermDefects: [],
    untranslatedEnglish: [],
  },
};

// School semantic probes (must distinguish Kelas vs rombel)
const SCHOOL_PROBES = {
  "portal.colGrade": /Kelas/,
  "portal.colClass": /Rombel|rombongan belajar/i,
  "portal.chooseGrade": /kelas/i,
  "portal.choosePhysicalClass": /rombongan belajar|rombel/i,
  "portal.classLabel": /Rombel|rombongan belajar/i,
  "portal.assignCurrentGrade": /Kelas/,
  "portal.assignCurrentClass": /Rombel|rombongan belajar/i,
  "portal.classMgmtGrade": /Kelas/,
  "portal.classMgmtName": /rombongan belajar|rombel/i,
  "communication.detailsFieldGrade": /Kelas/,
  "communication.detailsFieldClass": /Rombel|rombongan belajar/i,
  "reportSummary.studentLine": /Kelas:/,
};

for (const ns of NSS) {
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en", `${ns}.json`), "utf8"));
  const id = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/id-ID", `${ns}.json`), "utf8"));
  const enKeys = new Set(walkKeys(en));
  const idKeys = new Set(walkKeys(id));
  const enLeaves = walkLeaves(en);
  const idLeaves = walkLeaves(id);
  const idByPath = Object.fromEntries(idLeaves.map((l) => [l.path, l.value]));
  const enByPath = Object.fromEntries(enLeaves.map((l) => [l.path, l.value]));

  const missing = [...enKeys].filter((k) => !idKeys.has(k));
  const extra = [...idKeys].filter((k) => !enKeys.has(k));
  const empty = idLeaves.filter((l) => typeof l.value === "string" && isEmptyLeaf(l.value));
  const ph = [];
  for (const l of enLeaves) {
    if (typeof l.value !== "string") continue;
    const a = placeholders(l.value);
    const b = placeholders(idByPath[l.path]);
    if (a !== b) ph.push({ path: `${ns}.${l.path}`, en: a, id: b });
  }

  // reportSubjects IDs must remain English IDs
  if (ns === "teacher") {
    const enSub = en.reportSubjects;
    const idSub = id.reportSubjects;
    if (JSON.stringify(enSub) !== JSON.stringify(idSub)) {
      summary.defects.untranslatedEnglish.push("teacher.reportSubjects ID array mutated");
      summary.totals.untranslatedEnglish += 1;
    }
  }

  // kamu register (adult surfaces)
  for (const l of idLeaves) {
    if (typeof l.value !== "string") continue;
    if (/\bkamu\b/i.test(l.value)) {
      summary.defects.adultRegisterDefects.push(`${ns}.${l.path}`);
      summary.totals.adultRegisterDefects += 1;
    }
    // siswa / peserta didik should not appear (locked: murid)
    if (/\bsiswa\b|\bpeserta didik\b/i.test(l.value)) {
      summary.defects.studentTermDefects.push(`${ns}.${l.path}: ${l.value}`);
      summary.totals.studentTermDefects += 1;
    }
  }

  // School grade/class probes
  if (ns === "school") {
    for (const [probe, re] of Object.entries(SCHOOL_PROBES)) {
      const v = idByPath[probe];
      if (typeof v !== "string" || !re.test(v)) {
        summary.defects.gradeClassDefects.push(`school.${probe} = ${JSON.stringify(v)}`);
        summary.totals.gradeClassDefects += 1;
      }
    }
    // colGrade must differ from colClass
    if (idByPath["portal.colGrade"] === idByPath["portal.colClass"]) {
      summary.defects.gradeClassDefects.push("portal.colGrade === portal.colClass");
      summary.totals.gradeClassDefects += 1;
    }
  }

  // Untranslated English heuristic: identical non-technical leaf strings (length > 3, has space or long word)
  const allowIdentical = new Set([
    "OK",
    "PIN",
    "UUID",
    "-",
    "Leo Kids",
    "Google",
    "Copilot",
    "Present simple",
    "Past simple",
    "Habitat",
    "Status", // common Indonesian UI loanword
    "Volume", // Indonesian math curriculum term
  ]);
  for (const l of enLeaves) {
    if (typeof l.value !== "string") continue;
    const idv = idByPath[l.path];
    if (typeof idv !== "string") continue;
    if (l.value === idv) {
      // Subject IDs in teacher.reportSubjects must remain machine IDs
      if (ns === "teacher" && /^reportSubjects\[\d+\]$/.test(l.path)) continue;
      // Placeholder-only / punctuation templates
      if (/^(\{[a-zA-Z0-9_]+\}|[·\s().,\-—])+$/.test(l.value)) continue;
      // allow short tokens, IDs, technical fragments
      if (
        allowIdentical.has(l.value) ||
        l.value.length <= 2 ||
        /^[A-Z0-9_\-./]+$/.test(l.value) ||
        /rangeFrom|YYYY-MM-DD|next_step|FACTS_JSON|recommendation$/.test(l.value)
      ) {
        continue;
      }
      // English grammar topic labels intentionally kept when identical in EN topic names that are English-subject terms
      if (ns === "reports" && /topics\.english\.grammar_(present|past)_simple/.test(l.path)) {
        continue;
      }
      summary.defects.untranslatedEnglish.push(`${ns}.${l.path}: ${JSON.stringify(l.value)}`);
      summary.totals.untranslatedEnglish += 1;
    }
  }

  summary.namespaces[ns] = {
    enLeaves: enLeaves.length,
    idLeaves: idLeaves.length,
    missingKeys: missing.length,
    extraKeys: extra.length,
    emptyLeaves: empty.length,
    placeholderMismatches: ph.length,
  };
  summary.totals.enLeaves += enLeaves.length;
  summary.totals.idLeaves += idLeaves.length;
  summary.totals.missingKeys += missing.length;
  summary.totals.extraKeys += extra.length;
  summary.totals.emptyLeaves += empty.length;
  summary.totals.placeholderMismatches += ph.length;
  for (const m of missing) summary.defects.missingKeys.push(`${ns}.${m}`);
  for (const m of extra) summary.defects.extraKeys.push(`${ns}.${m}`);
  for (const m of empty) summary.defects.emptyLeaves.push(`${ns}.${m.path}`);
  for (const m of ph) summary.defects.placeholderMismatches.push(m);
}

const outPath = path.join(ROOT, "artifacts/id-ID-phase2c/audit-results.json");
fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary.totals, null, 2));
console.log("namespaces", summary.namespaces);
if (
  summary.totals.missingKeys ||
  summary.totals.extraKeys ||
  summary.totals.emptyLeaves ||
  summary.totals.placeholderMismatches ||
  summary.totals.studentTermDefects ||
  summary.totals.gradeClassDefects ||
  summary.totals.adultRegisterDefects ||
  summary.totals.untranslatedEnglish
) {
  console.log("DEFECTS", JSON.stringify(summary.defects, null, 2));
  process.exitCode = 1;
} else {
  console.log("AUDIT_PASS");
}
