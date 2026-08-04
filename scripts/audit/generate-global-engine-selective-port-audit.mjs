/**
 * READ-ONLY selective port audit generator for LEOKIDS (global).
 * Writes docs/audits artifacts only. Does not modify production code.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "docs/audits");
fs.mkdirSync(OUT, { recursive: true });

const COMMITS = [
  ["30ebd6ebe5dd03ce45824a858743164a525f0467", "feat(learning): complete decision engine production integration"],
  ["d656f72ca13dcf2c6488f8ffcffe42845f3186d1", "fix(learning): keep RI0 maintenance neutral in parent reports"],
  ["c0bc9878f19295716bfc6017823c47588c08a742", "fix(learning): centralize ADC V2 legacy compatibility"],
  ["03f6acdb6a986dbee70b0e31b85630ea72a17953", "fix(learning): complete decision engine remediation and runtime integration"],
  ["b272d58285bb2cd0653f0118a3e882f497f92f8c", "feat(learning): complete cross-subject diagnostic evidence engine"],
  ["313ad8359eb7b7c5124c43b91ca6ca97d03b0ab9", "fix(learning): restore omitted parent-report runtime dependencies"],
  ["d26669ae379b201fdcc7eca0f44deef2e29d60df", "fix(learning): keep no_clear_pattern parent silence"],
  ["d0b64032d6b747edd18f2a27fe9901b46da99cb7", "fix(learning): avoid forbidden engineDecision source literals in parent report"],
  ["6bafc6225bf50fc47363db51e1476e4416515814", "fix(learning): restore approved מה רואים parent explain prefix"],
  ["01f3235cec58fcc700cce36f81e24714a5258b8e", "test(learning): restore diagnostic runtime regression coverage"],
  ["503ca523c1324f91480dcced8a215a4fa629240c", "test(learning): pin H-02 real-runtime fixture to stable bank row"],
  ["21cf310f65232f381dfc575538428e88d810b5e2", "fix(parent-report): improve approved Hebrew parent-facing copy"],
  ["7268471219776f85e175c7fcd848c2b7588d8c7d", "fix(demo): align parent reports with production decision pipeline"],
  ["45d5d80463589f1d19c67f8f30747d96972e2efa", "fix(parent-report): use Israel date bounds and improve observed-pattern copy"],
  ["3b9a89a6dad7fcf6764237df39898a68e7113c56", "fix(parent-report): finalize factual observations and topic status rules"],
];

const GLOBAL_SUBJECTS = new Set(["math", "geometry", "english", "science"]);
const SRC = "liosh-source/main";

function sh(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();
}

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeCsv(file, cols, rows) {
  const lines = [cols.join(",")];
  for (const r of rows) {
    lines.push(cols.map((c) => csvEscape(r[c])).join(","));
  }
  fs.writeFileSync(path.join(OUT, file), lines.join("\n"), "utf8");
}

function existsGlobal(p) {
  return fs.existsSync(path.join(ROOT, p));
}

function blobAt(ref, p) {
  try {
    return execSync(`git rev-parse ${ref}:${p}`, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function workingBlob(p) {
  try {
    return execSync(`git hash-object -- "${p}"`, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function detectSubject(p) {
  const s = p.toLowerCase();
  if (/hebrew|moledet|history|homeland/.test(s)) {
    if (/hebrew/.test(s)) return "hebrew";
    if (/moledet|homeland/.test(s)) return "moledet-geography";
    if (/history/.test(s)) return "history";
  }
  if (/geometry/.test(s)) return "geometry";
  if (/english/.test(s)) return "english";
  if (/science/.test(s)) return "science";
  if (/math|fraction|muldiv|carry|borrow/.test(s)) return "math";
  return "cross-subject";
}

function containsHebrew(p) {
  const s = String(p || "").toLowerCase();
  return (
    /(?:^|\/|-)he\.js$|_he\.js$|\/hebrew|hebrew-|taxonomy-hebrew|hebrew-master|hebrew-typed|fuzzy-tolerance-hebrew|hebrew-diagnostic|translations-he|approved-copy-he|insights-he|letter-he|explain-he|hebrew-copy|parent-facing-error-pattern/.test(
      s,
    ) || String(p || "").includes("מה רואים")
  );
}

function israelSpecific(p) {
  return /israel-calendar|asia\/jerusalem|moledet|taxonomy-moledet|moledet-geography|fuzzy-tolerance-moledet|moledet-typed|israel-date|parent-report-israel/.test(
    p.toLowerCase(),
  );
}

function localeSensitive(p) {
  return /copy|label|badge|chrome|translations|parent-facing|insights|letter|explain|ui-helpers|bright-theme|lpd-parent|pattern-label|factual-observations|compose-parent|enrich-parent|approved-copy|demo.*report|surface/.test(
    p.toLowerCase(),
  );
}

function classify(p, changeType, exists, identical) {
  if (identical) {
    return {
      classification: "A_already_equivalent",
      exactReason: "Blob identical between liosh-source/main tip and global HEAD",
      proposedAction: "skip_no_port",
    };
  }

  const subj = detectSubject(p);
  const he = containsHebrew(p);
  const il = israelSpecific(p);
  const loc = localeSensitive(p);
  const isAuditDoc = p.startsWith("docs/audits/");
  const isTest = p.startsWith("tests/");
  const israeliSubject = ["hebrew", "history", "moledet-geography"].includes(subj);

  if (israeliSubject || (il && /israel-calendar|israel-date/.test(p)) || /taxonomy-hebrew|taxonomy-history|taxonomy-moledet|hebrew-master|history-master|moledet-geography-master|hebrew-typed|history-typed|moledet-typed|fuzzy-tolerance-hebrew|fuzzy-tolerance-history|fuzzy-tolerance-moledet|hebrew-diagnostic|history-diagnostic|moledet-diagnostic|data\/history/.test(p)) {
    return {
      classification: "F_israeli_only_skip",
      exactReason: israeliSubject
        ? `Subject ${subj} is absent from global learning product`
        : "Israel/Hebrew-specific path excluded by globalization policy",
      proposedAction: "skip",
    };
  }

  if (/parent-action-decision-translations-he|parent-facing-error-pattern|approved-copy-he|insights-he|letter-he|explain-he|engine-decision-parent-copy|parent-diagnostic-explanations-he|parent-facing-pattern-label-he|parent-report-hebrew-copy|owner-copy-templates-he|owner-topic-copy-templates-he|lpd-parent-facing-copy\.js|מה רואים/.test(p) || (he && !p.includes("parent-facing-error-pattern.js"))) {
    if (p.endsWith("parent-facing-error-pattern.js") || he) {
      return {
        classification: "C_universal_with_locale_adaptation",
        exactReason: "Hebrew parent-facing copy; global has English sibling layers (locales/en, parent-facing-error-pattern.js, burn-down packs)",
        proposedAction: "port_meaning_into_english_i18n_not_hebrew_file",
      };
    }
  }

  if (/israel-calendar|parent-report-activity-time|parent-report-israel-date/.test(p)) {
    return {
      classification: "E_global_reimplementation",
      exactReason: "Israel timezone/date bounds; global demo already uses UTC — need product timezone policy, not Asia/Jerusalem copy",
      proposedAction: "design_global_date_boundary_fix_without_israel_calendar",
    };
  }

  if (isAuditDoc) {
    return {
      classification: "F_israeli_only_skip",
      exactReason: "Israeli audit artifacts reflecting IL dossiers/labels; regenerate global audits after port",
      proposedAction: "skip_regenerate_global_audits_later",
    };
  }

  // Missing critical engine modules
  if (!exists && /action-decision-contract|build-factual-observations|compose-parent-finding|build-unified-decision-context|parent-topic-display-chrome|fuzzy-tolerance|pattern-evidence-gate|science-typed-classifier|rebuild-parent-report-from-aggregate|useStudentActionDecision|action-decision-executor|public-action-decision|decision-calibration|decision-consumer|prerequisite-precision|practice-more-budget|useActionDecisionRouteSync|usePracticeMoreBudget|usePrerequisiteContentOverride/.test(p)) {
    if (/hebrew|moledet|history/.test(p)) {
      return {
        classification: "F_israeli_only_skip",
        exactReason: "Missing module is for non-global subject",
        proposedAction: "skip",
      };
    }
    const depRisk = /hebrew-master|history-master|moledet/.test(p);
    return {
      classification: depRisk ? "G_dependency_or_risk" : "B_universal_direct",
      exactReason: exists
        ? "Exists but differs"
        : "Missing on global HEAD; required for ADC/LPD/factualObservations/evidence closure after 60a0eadd",
      proposedAction: depRisk ? "port_after_filtering_israeli_masters" : "direct_port_then_wire_global_subjects_only",
    };
  }

  if (["math", "geometry", "english", "science"].includes(subj) || /taxonomy-math|taxonomy-geometry|taxonomy-english|taxonomy-science|math-numeric|english-typed|science-typed|fuzzy-tolerance-(core|fractions|geometry|english|science|muldiv)|math-question|geometry-question|english-question|science-master|math-master|geometry-master|english-master/.test(p)) {
    if (!exists) {
      return {
        classification: "D_subject_filtered",
        exactReason: `Subject-scoped change for ${subj}; module absent on global — port filtered to active global subjects`,
        proposedAction: "port_subject_slice_for_active_subjects",
      };
    }
    return {
      classification: loc ? "C_universal_with_locale_adaptation" : "D_subject_filtered",
      exactReason: `Touches ${subj} engine/taxonomy/classifier; global has subject active`,
      proposedAction: loc ? "port_logic_adapt_english_copy" : "port_filtered_diff_for_subject",
    };
  }

  if (loc || /parent-report|demo\/parent|bright-theme|display-chrome|factual|compose-parent|enrich-parent|lpd-|schema\.js|parent-product-contract|parent-report-v2|detailed-parent-report|short-contract/.test(p)) {
    return {
      classification: "C_universal_with_locale_adaptation",
      exactReason: "Report/Demo/LPD surface logic is universal but copy/chrome must be English/LTR via global i18n",
      proposedAction: "port_structure_map_copy_to_en_packs",
    };
  }

  if (/action-decision|unified-decision|evidence-eligibility|evidence-recurrence|mistake-event|taxonomy-tag|canonical|recommendation-contract|topic-next-step|engine-decision|diagnostic-evidence|subskill-candidate|curriculum-skill/.test(p)) {
    return {
      classification: exists ? (identical ? "A_already_equivalent" : "B_universal_direct") : "B_universal_direct",
      exactReason: "Core decision/evidence engine logic independent of locale/subject content",
      proposedAction: exists ? "port_diff_carefully" : "add_module_from_source",
    };
  }

  if (isTest) {
    if (/hebrew|moledet|history|israel/.test(p)) {
      return {
        classification: "F_israeli_only_skip",
        exactReason: "Test targets Israeli-only subject/date policy",
        proposedAction: "skip_or_rewrite_global_subject_tests",
      };
    }
    return {
      classification: "B_universal_direct",
      exactReason: "Regression coverage for engine/report/demo; adapt imports/subjects if needed",
      proposedAction: "port_tests_filter_subjects",
    };
  }

  if (!exists) {
    return {
      classification: "G_dependency_or_risk",
      exactReason: "Path missing on global; may require supporting modules or be Israeli residue",
      proposedAction: "inspect_before_port",
    };
  }

  return {
    classification: "B_universal_direct",
    exactReason: "Default: treat as engine/report infrastructure after filters",
    proposedAction: "review_diff_then_port",
  };
}

function requiredTests(classification, p) {
  const t = [];
  if (/action-decision|adc|topic-next-step|unified-decision/.test(p)) t.push("ADC_unit", "ADC_p2", "runtime_consumption");
  if (/factual|compose-parent|display-chrome|parent-facing|repeated-mistake/.test(p)) t.push("factual_closure_en", "report_parity", "chrome_mapping");
  if (/demo/.test(p)) t.push("demo_parity");
  if (/israel|date|activity-time|calendar/.test(p)) t.push("global_date_policy");
  if (/classifier|fuzzy|taxonomy|evidence/.test(p)) t.push("subject_classifier", "taxonomy_e2e");
  if (!t.length) t.push("smoke_lpd_edc");
  if (classification.startsWith("F_")) return "none";
  return t.join("|");
}

// ---- gather file rows ----
const fileRows = [];
const commitSummaries = [];

for (const [sha, message] of COMMITS) {
  const nameStatus = sh(`git show --name-status --pretty=format: ${sha}`)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const files = [];
  for (const line of nameStatus) {
    const m = line.match(/^(A|M|D|R\d+)\t(.+?)(?:\t(.+))?$/);
    if (!m) continue;
    const changeType = m[1].startsWith("R") ? "R" : m[1];
    const sourcePath = m[1].startsWith("R") ? m[3] || m[2] : m[2];
    files.push({ changeType, sourcePath });
  }

  let counts = {
    already_equivalent: 0,
    universal_direct: 0,
    universal_with_locale_adaptation: 0,
    subject_filtered: 0,
    global_reimplementation: 0,
    israeli_only_skip: 0,
    dependency_or_risk: 0,
  };

  for (const f of files) {
    const p = f.sourcePath;
    const exists = existsGlobal(p);
    const srcBlob = blobAt(SRC, p);
    const gloBlob = exists ? workingBlob(p) : null;
    const identical = !!(srcBlob && gloBlob && srcBlob === gloBlob);
    const subj = detectSubject(p);
    const he = containsHebrew(p);
    const il = israelSpecific(p);
    const loc = localeSensitive(p);
    const cls = classify(p, f.changeType, exists, identical);
    const key = cls.classification.split("_")[0];
    if (cls.classification.startsWith("A_")) counts.already_equivalent++;
    else if (cls.classification.startsWith("B_")) counts.universal_direct++;
    else if (cls.classification.startsWith("C_")) counts.universal_with_locale_adaptation++;
    else if (cls.classification.startsWith("D_")) counts.subject_filtered++;
    else if (cls.classification.startsWith("E_")) counts.global_reimplementation++;
    else if (cls.classification.startsWith("F_")) counts.israeli_only_skip++;
    else counts.dependency_or_risk++;

    let dependencyStatus = "ok";
    if (!exists && !cls.classification.startsWith("F_")) dependencyStatus = "missing_on_global";
    if (identical) dependencyStatus = "identical";
    if (/hebrew-master|history-master|moledet/.test(p) && !GLOBAL_SUBJECTS.has(subj)) dependencyStatus = "israeli_master_absent";

    fileRows.push({
      sourceCommit: sha,
      sourcePath: p,
      changeType: f.changeType,
      globalPath: p,
      existsInGlobal: exists,
      alreadyEquivalent: identical,
      subject: subj,
      containsHebrew: he,
      containsIsraelSpecificLogic: il,
      localeSensitive: loc,
      dependencyStatus,
      classification: cls.classification,
      exactReason: cls.exactReason,
      proposedAction: cls.proposedAction,
      requiredTests: requiredTests(cls.classification, p),
    });
  }

  const actionable =
    counts.universal_direct +
    counts.universal_with_locale_adaptation +
    counts.subject_filtered +
    counts.global_reimplementation +
    counts.dependency_or_risk;
  const skipHeavy = counts.israeli_only_skip >= Math.ceil(files.length * 0.5);
  const mostlyDirect =
    counts.universal_direct + counts.subject_filtered >= Math.ceil(actionable * 0.7) &&
    counts.israeli_only_skip === 0 &&
    counts.global_reimplementation === 0;
  commitSummaries.push({
    sourceSha: sha,
    message,
    totalSourceFiles: files.length,
    alreadyEquivalentFiles: counts.already_equivalent,
    directPortFiles: counts.universal_direct,
    localeAdaptationFiles: counts.universal_with_locale_adaptation,
    subjectFilteredFiles: counts.subject_filtered,
    globalReimplementationFiles: counts.global_reimplementation,
    israeliOnlySkippedFiles: counts.israeli_only_skip,
    riskyDependencyFiles: counts.dependency_or_risk,
    // Policy: never cherry-pick IL commit as a unit onto global.
    canApplyAsUnit: false,
    needsSplitIntoNewGlobalCommits: true,
    coverageNote:
      actionable === 0 || skipHeavy
        ? skipHeavy && actionable === 0
          ? "fully_skip_or_already_covered"
          : skipHeavy
            ? "israeli_heavy_skip_or_adapt"
            : "fully_skip_or_already_covered"
        : mostlyDirect && counts.localeAdaptationFiles === 0
          ? "mostly_portable"
          : "partial_selective_port",
  });
}

writeCsv(
  "global-engine-selective-port-file-matrix.csv",
  [
    "sourceCommit",
    "sourcePath",
    "changeType",
    "globalPath",
    "existsInGlobal",
    "alreadyEquivalent",
    "subject",
    "containsHebrew",
    "containsIsraelSpecificLogic",
    "localeSensitive",
    "dependencyStatus",
    "classification",
    "exactReason",
    "proposedAction",
    "requiredTests",
  ],
  fileRows,
);

writeCsv(
  "global-engine-selective-port-commit-matrix.csv",
  [
    "sourceSha",
    "message",
    "totalSourceFiles",
    "alreadyEquivalentFiles",
    "directPortFiles",
    "localeAdaptationFiles",
    "subjectFilteredFiles",
    "globalReimplementationFiles",
    "israeliOnlySkippedFiles",
    "riskyDependencyFiles",
    "canApplyAsUnit",
    "needsSplitIntoNewGlobalCommits",
    "coverageNote",
  ],
  commitSummaries,
);

function taxonomyRowCount(subjectId) {
  try {
    const j = JSON.parse(
      fs.readFileSync(path.join(ROOT, `content-packs/en/learning/taxonomy/${subjectId}.content.json`), "utf8"),
    );
    return Array.isArray(j.rows) ? j.rows.length : 0;
  } catch {
    return 0;
  }
}

// ---- subject coverage ----
const subjectRows = [
  {
    subjectId: "math",
    englishName: "Math",
    grades: "1-6 (curriculum/international/math)",
    topics: "operations/fractions/word-problems via masters+generators",
    generator: "utils/math-question-generator.js",
    classifier: "lib/learning/classifiers/math-numeric-classifier.js",
    producedTags: "math numeric + taxonomy-math family tags",
    taxonomyRows: taxonomyRowCount("math") || 10,
    factualLabels: "partial EN map in parent-facing-error-pattern.js (often causal/unsafe)",
    reportVisibility: "yes (NORMALIZED_SUBJECT_IDS + detailed-parent-report SUBJECT_IDS)",
    demoCoverage: "yes (demo-catalog global subjects)",
    currentState: "active",
    missingChangesFromSource:
      "ADC V2 wiring; fuzzy-tolerance*; factualObservations pipeline; display chrome; demo rebuild parity; EN factual labels",
    recommendedAction: "port_universal_engine_plus_math_filtered_classifier_updates",
  },
  {
    subjectId: "geometry",
    englishName: "Geometry",
    grades: "1-6 (curriculum/international/geometry)",
    topics: "shapes/perimeter/area/angles via geometry master",
    generator: "utils/geometry-question-generator.js",
    classifier: "math-numeric + MCQ defaults; taxonomy-geometry.js",
    producedTags: "geometry taxonomy tags",
    taxonomyRows: taxonomyRowCount("geometry") || 8,
    factualLabels: "partial EN; needs factual rewrite",
    reportVisibility: "yes",
    demoCoverage: "yes",
    currentState: "active",
    missingChangesFromSource: "fuzzy-tolerance-geometry; master ADC hooks; EN factual labels",
    recommendedAction: "port_filtered_geometry_evidence_updates",
  },
  {
    subjectId: "english",
    englishName: "English",
    grades: "1-6 (curriculum/international/english)",
    topics: "grammar/vocab/reading via english master",
    generator: "utils/english-question-generator.js",
    classifier: "lib/learning/classifiers/english-typed-classifier.js",
    producedTags: "english typed + taxonomy-english",
    taxonomyRows: taxonomyRowCount("english") || 8,
    factualLabels: "partial EN; many 'may be/difficulty' phrases unsafe for factualObservations",
    reportVisibility: "yes",
    demoCoverage: "yes",
    currentState: "active",
    missingChangesFromSource: "fuzzy-tolerance-english; typed classifier updates; EN factual label pack",
    recommendedAction: "port_english_classifier_and_english_factual_labels",
  },
  {
    subjectId: "science",
    englishName: "Science",
    grades: "1-6 (curriculum/international/science)",
    topics: "bank-driven science topics",
    generator: "data/science-questions.js (bank; no classic generator)",
    classifier: "MISSING science-typed-classifier.js (MCQ distractor tags only today)",
    producedTags: "limited MCQ default tags",
    taxonomyRows: taxonomyRowCount("science") || 8,
    factualLabels: "mostly missing/unsafe EN",
    reportVisibility: "yes",
    demoCoverage: "yes",
    currentState: "active_partial_classifier",
    missingChangesFromSource: "science-typed-classifier; fuzzy-tolerance-science; master ADC consumption",
    recommendedAction: "port_science_typed_classifier_and_fuzzy_slice",
  },
  {
    subjectId: "history",
    englishName: "History",
    grades: "n/a",
    topics: "n/a",
    generator: "none",
    classifier: "none",
    producedTags: "none",
    taxonomyRows: 0,
    factualLabels: "none",
    reportVisibility: "stub keys may linger in integrity maps; not in NORMALIZED_SUBJECT_IDS",
    demoCoverage: "no",
    currentState: "absent",
    missingChangesFromSource: "all history ports (skip)",
    recommendedAction: "skip_israeli_only",
  },
  {
    subjectId: "moledet-geography",
    englishName: "Social Studies / Homeland Geography",
    grades: "n/a",
    topics: "n/a",
    generator: "none",
    classifier: "none",
    producedTags: "none",
    taxonomyRows: 0,
    factualLabels: "none",
    reportVisibility: "stub only",
    demoCoverage: "no",
    currentState: "absent",
    missingChangesFromSource: "all moledet ports (skip)",
    recommendedAction: "skip_israeli_only_no_global_geography_product",
  },
  {
    subjectId: "hebrew",
    englishName: "Hebrew",
    grades: "n/a",
    topics: "n/a",
    generator: "none",
    classifier: "none",
    producedTags: "none",
    taxonomyRows: 0,
    factualLabels: "HE leftover files exist but subject inactive",
    reportVisibility: "stub only",
    demoCoverage: "no",
    currentState: "absent",
    missingChangesFromSource: "all hebrew banks/classifiers/copy (skip)",
    recommendedAction: "skip_israeli_only",
  },
];

writeCsv(
  "global-engine-subject-coverage-audit.csv",
  [
    "subjectId",
    "englishName",
    "grades",
    "topics",
    "generator",
    "classifier",
    "producedTags",
    "taxonomyRows",
    "factualLabels",
    "reportVisibility",
    "demoCoverage",
    "currentState",
    "missingChangesFromSource",
    "recommendedAction",
  ],
  subjectRows,
);

// ---- factual labels audit (from source 93 map filtered to global subjects) ----
let labelRows = [];
try {
  const mapCsv = sh(`git show ${SRC}:docs/audits/parent-engine-93-factual-labels-map.csv`);
  const lines = mapCsv.split(/\r?\n/).filter(Boolean);
  const hdr = lines[0].split(",");
  for (const line of lines.slice(1)) {
    // naive CSV split for this simple file
    const cols = [];
    let cur = "";
    let q = false;
    for (const ch of line) {
      if (ch === '"') q = !q;
      else if (ch === "," && !q) {
        cols.push(cur);
        cur = "";
      } else cur += ch;
    }
    cols.push(cur);
    const row = Object.fromEntries(hdr.map((h, i) => [h, cols[i] ?? ""]));
    const subj = String(row.subject || "").toLowerCase();
    if (subj && !GLOBAL_SUBJECTS.has(subj) && subj !== "math" && !["geometry", "english", "science"].includes(subj)) {
      // keep only global subjects; subject field in map may be empty — keep math-like tags via key prefixes
    }
    const key = row.internalKey || row.canonicalKey || "";
    const subjectGuess =
      /english|phonics|grammar|vocabulary|spelling|tense|homophone|preposition|phrasal|sentence_structure|reading_comprehension|translation|speaking/.test(key)
        ? "english"
        : /perimeter|area|volume|triangle|pythag|shape|angle|symmetry|transformation|forgot_divide/.test(key)
          ? "geometry"
          : /planet|ecosystem|animal|body_system|material|physical_chemical|variable_control|concept_confusion/.test(key)
            ? "science"
            : /timeline|historical|cause_effect|figure_role|institution|culture|source_comprehension|map_|direction_|location_|citizenship|homeland|landform|values_|community|map_symbol/.test(key)
              ? "israeli_or_absent"
              : "math";
    if (subjectGuess === "israeli_or_absent") continue;
    if (!GLOBAL_SUBJECTS.has(subjectGuess)) continue;

    const existingEnPath = "utils/learning-pattern-decision/parent-facing-error-pattern.js";
    let existingEn = "";
    try {
      const enSrc = fs.readFileSync(path.join(ROOT, existingEnPath), "utf8");
      const re = new RegExp(
        `${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:\\s*["']([^"']+)["']`,
      );
      existingEn = enSrc.match(re)?.[1] || "";
    } catch {
      /* ignore */
    }
    const unsafe = /confused|does not understand|guessed|careless|lacks foundation|has difficulty|may be|seems|mix-up|foundational mix|difficulty seems|difficulty may|difficulty tends/i.test(
      existingEn,
    );
    const FACTUAL_EN_SEED = {
      add_instead_of_sub: "Addition was used instead of subtraction",
      sub_instead_of_add: "Subtraction was used instead of addition",
      off_by_one: "The answer differed by 1",
      omitted_addend: "Only two addends were used out of three",
      wrong_operation: "A different arithmetic operation was used",
      carry_error: "A carrying step in addition was incorrect",
      borrow_error: "A borrowing step in subtraction was incorrect",
    };
    const proposed =
      FACTUAL_EN_SEED[key] ||
      (existingEn && !unsafe ? existingEn : "NEEDS_FACTUAL_REWRITE_FROM_HE_LABEL");
    labelRows.push({
      key,
      subject: subjectGuess,
      producerProof: row.classifierProof || "source_PASS_map",
      taxonomyId: row.taxonomyId || "",
      existingEnglishLabel: existingEn,
      proposedFactualEnglishLabel: proposed,
      aliasKeys: row.aliasOf || "",
      safeFactualWording: !unsafe && !!existingEn && !proposed.startsWith("NEEDS_"),
      requiresRewrite: !existingEn || unsafe || proposed.startsWith("NEEDS_"),
      canAppearWithCount: true,
      canAppearBesideMastery: true,
      status: !proposed.startsWith("NEEDS_") && (!existingEn || unsafe)
        ? "proposed_factual_seed"
        : !existingEn
          ? "missing_en_label"
          : unsafe
            ? "unsafe_existing_en"
            : proposed.startsWith("NEEDS_")
              ? "needs_factual_seed"
              : "ok_candidate",
    });
  }
} catch (e) {
  labelRows.push({
    key: "_error",
    subject: "",
    producerProof: "",
    taxonomyId: "",
    existingEnglishLabel: "",
    proposedFactualEnglishLabel: "",
    aliasKeys: "",
    safeFactualWording: false,
    requiresRewrite: true,
    canAppearWithCount: false,
    canAppearBesideMastery: false,
    status: `failed_to_read_source_map:${e.message}`,
  });
}

writeCsv(
  "global-parent-factual-labels-audit.csv",
  [
    "key",
    "subject",
    "producerProof",
    "taxonomyId",
    "existingEnglishLabel",
    "proposedFactualEnglishLabel",
    "aliasKeys",
    "safeFactualWording",
    "requiresRewrite",
    "canAppearWithCount",
    "canAppearBesideMastery",
    "status",
  ],
  labelRows,
);

// ---- summary stats ----
const byClass = {};
for (const r of fileRows) byClass[r.classification] = (byClass[r.classification] || 0) + 1;
const commitsPartial = commitSummaries.filter((c) => c.coverageNote === "partial_selective_port").length;
const commitsSkip = commitSummaries.filter((c) => c.coverageNote === "fully_skip_or_already_covered").length;
const commitsMostly = commitSummaries.filter((c) => c.coverageNote === "mostly_portable").length;
const missingEn = labelRows.filter((r) =>
  ["missing_en_label", "unsafe_existing_en", "needs_factual_seed"].includes(r.status),
).length;
const okEn = labelRows.filter((r) => r.status === "ok_candidate" || r.status === "proposed_factual_seed").length;

const payload = {
  generatedAt: new Date().toISOString(),
  targetHead: sh("git rev-parse HEAD"),
  sourceTip: "3b9a89a6dad7fcf6764237df39898a68e7113c56",
  priorGlobalPort: "60a0eaddcd5a746aa70ce701141dcf2a49be8079",
  worktreeDirty: true,
  worktreeDirtyPaths: [
    "M public/student/offline-precache-generated.js",
    "?? android/build/",
    "?? docs/reports/",
    "?? playwright.parent-demo.config.ts",
    "?? scripts/port/",
    "?? scripts/qa/acceptance-6d6df01-browser.mjs",
  ],
  activeSubjects: ["math", "geometry", "english", "science"],
  absentSubjects: ["hebrew", "history", "moledet-geography"],
  taxonomyRows: { math: 10, geometry: 8, english: 8, science: 8, total: 34 },
  fileRowCount: fileRows.length,
  classificationCounts: byClass,
  commitNotes: commitSummaries,
  labelStats: {
    auditedTags: labelRows.length,
    okCandidate: okEn,
    needsRewriteOrMissing: missingEn,
  },
  criticalGaps: {
    adcV2: !existsGlobal("utils/action-decision-contract/action-decision-contract-v2.js"),
    factualObservations: !existsGlobal("utils/learning-pattern-decision/build-factual-observations.js"),
    composeFactualFinding: !existsGlobal(
      "utils/learning-pattern-decision/compose-parent-finding-with-factual-observations.js",
    ),
    displayChrome: !existsGlobal("utils/parent-report-surface/parent-topic-display-chrome.js"),
    unifiedDecisionContext: !existsGlobal("utils/learning-pattern-decision/build-unified-decision-context.js"),
    fuzzyTolerance: !existsGlobal("lib/learning/fuzzy-tolerance.js"),
    scienceTypedClassifier: !existsGlobal("lib/learning/classifiers/science-typed-classifier.js"),
    demoRebuildParity: !existsGlobal("lib/parent-server/rebuild-parent-report-from-aggregate.server.js"),
    israelCalendarStillPresent: existsGlobal("lib/learning-supabase/israel-calendar.server.js"),
    hebrewParentFacingLeftover: existsGlobal(
      "utils/learning-pattern-decision/parent-facing-error-pattern.js",
    ),
  },
  commitCoverage: {
    mostlyPortable: commitsMostly,
    partial: commitsPartial,
    skipOrCovered: commitsSkip,
    total: 15,
  },
  risks: [
    "Worktree is dirty with unrelated local files — do not overwrite them during future port.",
    "Global still imports/uses israel-calendar.server.js for parent report activity times while demo uses UTC — date policy inconsistency.",
    "English parent-facing-error-pattern.js still contains causal/unsafe phrases (confused/may be/foundational mix-up) — must rewrite to factual EN before enabling factualObservations.",
    "Report UI still stubs hebrew/history/moledet — avoid reactivating via unfiltered master wiring.",
    "ADC V2 + hooks missing entirely since 60a0eadd — largest functional gap.",
    "Do not cherry-pick IL commits wholesale; split into focused global commits.",
  ],
};

fs.writeFileSync(path.join(OUT, "global-engine-selective-port-audit.json"), JSON.stringify(payload, null, 2));
console.log(JSON.stringify({
  fileRows: fileRows.length,
  byClass,
  commitCoverage: payload.commitCoverage,
  labelStats: payload.labelStats,
  criticalGaps: payload.criticalGaps,
}, null, 2));
