#!/usr/bin/env node
/**
 * One-shot science launch-blocker fixes (stages 2–5 audit).
 * Does NOT touch thin buckets, length bias, or non-blocker content.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** @param {string} stem */
export function cleanSciVolStem(stem) {
  const s = String(stem || "").trim();
  const m = s.match(
    /^\s*[-]\s*·\s*\s*(?:|)\s*—\s*(.+?)\s*·\s*\s+[a-z0-9_]+$/u
  );
  if (m) return m[1].trim();
  return s
    .replace(/^\s*[-]\s*·\s*\s\S+\s*—\s*/u, "")
    .replace(/\s*·\s*\s+[a-z0-9_]+$/iu, "")
    .trim();
}

/** @param {Record<string, unknown>} params */
function expectedErrorTypesForPhb(params) {
  const cog = String(params?.cognitiveLevel || "recall").toLowerCase();
  if (cog === "analysis" || cog === "application") {
    return ["concept_confusion", "misconception", "careless_error"];
  }
  if (cog === "understanding") {
    return ["misconception", "concept_confusion", "fact_recall_gap"];
  }
  return ["fact_recall_gap", "concept_confusion", "careless_error"];
}

/** id -> { stem?, options, correctIndex } */
const TRUE_FALSE_TO_MCQ = {
  body_4: {
    stem: "     ?",
    options: [
      "    —      ",
      "    ",
      "    ",
      "    ",
    ],
    correctIndex: 0,
  },
  animals_3: {
    stem: "   ?",
    options: [
      "    ",
      "   ",
      "    ",
      "   ",
    ],
    correctIndex: 0,
  },
  plants_4: {
    stem: "     ()?",
    options: [
      "   ,   ",
      "      ",
      "   ",
      "  ,  ",
    ],
    correctIndex: 0,
  },
  materials_3: {
    stem: "   ?",
    options: [
      "       ",
      "    ",
      "    ",
      "    ",
    ],
    correctIndex: 0,
  },
  earth_3: {
    stem: "   ?",
    options: [
      "      —     ",
      "    ",
      "      ",
      "     ",
    ],
    correctIndex: 0,
  },
  env_3: {
    stem: "    ?",
    options: [
      "        ",
      "     ",
      "    ",
      "    ",
    ],
    correctIndex: 0,
  },
  exp_3: {
    stem: "      ?",
    options: [
      "       ",
      "     -",
      "   ",
      "    ",
    ],
    correctIndex: 0,
  },
  body_11: {
    stem: "   ?",
    options: [
      ": , , ,  ",
      ": ,   ",
      ":  ",
      "      ",
    ],
    correctIndex: 0,
  },
  animals_10: {
    stem: "      ?",
    options: [
      "      ",
      "       ",
      "   ",
      "    ",
    ],
    correctIndex: 0,
  },
  plants_9: {
    stem: "    ?",
    options: [
      ", ,   ",
      "       ",
      " ,  ",
      " ,  ",
    ],
    correctIndex: 0,
  },
  materials_9: {
    stem: " ?",
    options: [
      "  ",
      "  ",
      "   ",
      " ",
    ],
    correctIndex: 0,
  },
  earth_8: {
    stem: "  ?",
    options: [
      "    —      ",
      "    ",
      "   ",
      "    ",
    ],
    correctIndex: 0,
  },
  env_7: {
    stem: "   ?",
    options: [
      "     ",
      "  ",
      "  ",
      "  ",
    ],
    correctIndex: 0,
  },
  body_19: {
    stem: "     ?",
    options: [
      "",
      "",
      "",
      "",
    ],
    correctIndex: 0,
  },
  body_25: {
    stem: "    ?",
    options: [
      "",
      "",
      "",
      "",
    ],
    correctIndex: 0,
  },
  animals_19: {
    stem: "    ?",
    options: [
      "  —     ",
      "   ",
      "   ",
      "   ",
    ],
    correctIndex: 0,
  },
  plants_18: {
    stem: "   ?",
    options: [
      "    ",
      "    ",
      "   ",
      "    ",
    ],
    correctIndex: 0,
  },
  materials_17: {
    stem: "     ?",
    options: [
      ",  ",
      " ",
      " ",
      " ",
    ],
    correctIndex: 0,
  },
  earth_16: {
    stem: " ?",
    options: [
      "   ",
      "    ",
      "   ",
      " ",
    ],
    correctIndex: 0,
  },
  body_35__v2: {
    stem: "     ?",
    options: [
      "   ",
      "   ",
      " ",
      " ",
    ],
    correctIndex: 0,
  },
  body_40: {
    stem: "      ?",
    options: [
      "  ",
      "     18",
      "   ",
      "  ,  ",
    ],
    correctIndex: 0,
  },
  plants_16__v2: {
    stem: "    ?",
    options: [
      " , ,   ",
      "   ",
      "   ",
      "     ",
    ],
    correctIndex: 0,
  },
  env_51: {
    stem: "        ?",
    options: [
      "   —    ",
      "      ",
      "      ",
      "      ",
    ],
    correctIndex: 0,
  },
};

/** @param {string} text */
function patchTrueFalseInFile(text) {
  let out = text;
  for (const [id, conv] of Object.entries(TRUE_FALSE_TO_MCQ)) {
    if (!out.includes(`"id": "${id}"`)) continue;
    const blockRe = new RegExp(
      `("id": "${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?"type": )"true_false"`,
      "m"
    );
    if (!blockRe.test(out)) continue;
    out = out.replace(blockRe, `$1"mcq"`);
    if (conv.stem) {
      const stemRe = new RegExp(
        `("id": "${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?"stem": )"[^"]*"`,
        "m"
      );
      out = out.replace(stemRe, `$1${JSON.stringify(conv.stem)}`);
    }
    const optsRe = new RegExp(
      `("id": "${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?"options": )\\[[\\s\\S]*?\\]`,
      "m"
    );
    out = out.replace(optsRe, `$1${JSON.stringify(conv.options, null, 4).replace(/\n/g, "\n    ")}`);
    const ciRe = new RegExp(
      `("id": "${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?"correctIndex": )\\d+`,
      "m"
    );
    out = out.replace(ciRe, `$1${conv.correctIndex}`);
  }
  return out;
}

async function fixNeedsMoreVolume() {
  const path = join(ROOT, "data/science-questions-needs-more-volume.js");
  const mod = await import(new URL("../data/science-questions-needs-more-volume.js", import.meta.url).href);
  const arr = mod.SCIENCE_QUESTIONS_NEEDS_MORE_VOLUME.map((q) => ({
    ...q,
    stem: cleanSciVolStem(q.stem),
  }));
  const header = `/**
 * Science NEEDS_MORE volume fill. Generated by scripts/gen-science-needs-more-volume.mjs
 * Do not hand-edit; regenerate after deficit changes.
 * Stems sanitized for student display (launch-blocker fix).
 */
`;
  await writeFile(path, `${header}export const SCIENCE_QUESTIONS_NEEDS_MORE_VOLUME = ${JSON.stringify(arr, null, 2)};\n`, "utf8");
  return arr.filter((q, i) => q.stem !== mod.SCIENCE_QUESTIONS_NEEDS_MORE_VOLUME[i].stem).length;
}

async function fixPhaseB() {
  const path = join(ROOT, "data/science-questions-phase-b.js");
  const mod = await import(new URL("../data/science-questions-phase-b.js", import.meta.url).href);
  const arr = mod.SCIENCE_QUESTIONS_PHASE_B.map((q) => {
    const params = { ...q.params };
    const types = expectedErrorTypesForPhb(params);
    params.expectedErrorTypes = types;
    params.expectedErrorTags = types;
    return { ...q, params };
  });
  const header = `/**
 * Phase B Science expansion — materials, earth_space, environment (g1–g6).
 * Generated by scripts/gen-science-phase-b.mjs
 * expectedErrorTypes added for parent-report metadata (launch-blocker fix).
 */
`;
  await writeFile(path, `${header}export const SCIENCE_QUESTIONS_PHASE_B = ${JSON.stringify(arr, null, 2)};\n`, "utf8");
  return arr.length;
}

async function fixMcqHardFailsInText(text) {
  let out = text;
  // materials_6 — replace near-duplicate 4th option
  out = out.replace(
    `",       "`,
    `"   "`
  );
  // plants_14__v2
  out = out.replace(
    `"    "`,
    `"   "`
  );
  // earth_21__v2 — fix all confusing options
  out = out.replace(
    /("id": "earth_21__v2"[\s\S]*?"options": )\[\s*"",\s*"    ",\s*" ",\s*"  "\s*\]/m,
    `$1[
      "    ",
      "         ",
      "   cury ",
      "  "
    ]`
  );
  // animals_20__v2 — remove banned phrase
  out = out.replace(
    `"stem": "     ?"`,
    `"stem": "    ?"`
  );
  out = out.replace(
    /("id": "animals_20__v2"[\s\S]*?"options": )\[\s*"",\s*"",\s*"",\s*"  "\s*\]/m,
    `$1[
      "",
      "",
      "",
      ""
    ]`
  );
  out = out.replace(
    /("id": "animals_20__v2"[\s\S]*?"correctIndex": )3/m,
    `$10`
  );
  // sci_p1_g6_experiments_easy_06 — in p1 file only usually
  out = out.replace(
    /("id": "sci_p1_g6_experiments_easy_06"[\s\S]*?"options": )\[\s*"  ",\s*"",\s*"",\s*""\s*\]/m,
    `$1[
      "    ",
      "   ",
      "   ",
      "   "
    ]`
  );
  return out;
}

async function main() {
  const volFixed = await fixNeedsMoreVolume();
  const phbFixed = await fixPhaseB();

  let sciMain = await readFile(join(ROOT, "data/science-questions.js"), "utf8");
  sciMain = patchTrueFalseInFile(sciMain);
  sciMain = await fixMcqHardFailsInText(sciMain);
  await writeFile(join(ROOT, "data/science-questions.js"), sciMain, "utf8");

  let phase3 = await readFile(join(ROOT, "data/science-questions-phase3.js"), "utf8");
  phase3 = patchTrueFalseInFile(phase3);
  await writeFile(join(ROOT, "data/science-questions-phase3.js"), phase3, "utf8");

  let p1 = await readFile(join(ROOT, "data/science-questions-p1-g456-fill.js"), "utf8");
  p1 = await fixMcqHardFailsInText(p1);
  await writeFile(join(ROOT, "data/science-questions-p1-g456-fill.js"), p1, "utf8");

  console.log(JSON.stringify({ volFixed, phbFixed, trueFalseIds: Object.keys(TRUE_FALSE_TO_MCQ).length }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
