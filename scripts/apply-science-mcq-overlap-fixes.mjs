#!/usr/bin/env node
/**
 * Hand-tuned MCQ option fixes for science overlap / weak / stubborn length-bias rows.
 */
import { readdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = join(ROOT, "data");

/** @type {Record<string, { options: string[], correctIndex: number }>} */
const OPTION_FIXES = {
  plants_18: {
    options: [
      "",
      "",
      "",
      "",
    ],
    correctIndex: 0,
  },
  exp_30: {
    options: [
      "     ",
      "    ",
      "    ",
      "   ",
    ],
    correctIndex: 0,
  },
  exp_36: {
    options: [
      "   ",
      "   ",
      "   ",
      "  ",
    ],
    correctIndex: 0,
  },
  exp_42: {
    options: [
      "    ",
      "   ",
      "  ",
      "   ",
    ],
    correctIndex: 0,
  },
  exp_46: {
    options: [
      "    ",
      "  ",
      "   ",
      "   ",
    ],
    correctIndex: 0,
  },
  earth_39: {
    options: [
      "   ",
      "  ",
      "  ",
      "  ",
    ],
    correctIndex: 0,
  },
  earth_45: {
    options: [
      "    ",
      "  ",
      "   ",
      "   ",
    ],
    correctIndex: 0,
  },
  p4b1_g6_materials_006: {
    options: [
      "  ",
      "  ",
      "  ",
      "  ",
    ],
    correctIndex: 0,
  },
  p4b1_g6_env_002: {
    options: [
      "  ",
      "    ",
      "    ",
      "    ",
    ],
    correctIndex: 0,
  },
  sci_pb1_g3_body_hard_02: {
    options: [
      "   ",
      "  ",
      "   ",
      "    ",
    ],
    correctIndex: 0,
  },
  sci_pb1_g3_environment_hard_01: {
    options: [
      "   ",
      "   ",
      "    ",
      "  ",
    ],
    correctIndex: 0,
  },
  sci_p1_g6_experiments_easy_05: {
    options: [
      "  ",
      "   ",
      "   ",
      "   ",
    ],
    correctIndex: 0,
  },
};

const FILES = [
  ...readdirSync(DATA_DIR).filter(
    (f) => f.startsWith("science-questions") && f.endsWith(".js") && f !== "science-questions.js"
  ),
  "science-questions.js",
];

async function patchFile(relPath) {
  const path = join(DATA_DIR, relPath);
  let text = await readFile(path, "utf8");
  let changed = 0;
  for (const [id, fix] of Object.entries(OPTION_FIXES)) {
    if (!text.includes(`"id": "${id}"`)) continue;
    const optsRe = new RegExp(
      `("id": "${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?"options": )\\[[\\s\\S]*?\\]`,
      "m"
    );
    const ciRe = new RegExp(
      `("id": "${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[\\s\\S]*?"correctIndex": )\\d+`,
      "m"
    );
    if (!optsRe.test(text)) continue;
    text = text.replace(
      optsRe,
      `$1${JSON.stringify(fix.options, null, 4).replace(/\n/g, "\n    ")}`
    );
    text = text.replace(ciRe, `$1${fix.correctIndex}`);
    changed++;
  }
  if (changed > 0) await writeFile(path, text, "utf8");
  return changed;
}

let total = 0;
for (const f of FILES) total += await patchFile(f);
console.log(JSON.stringify({ optionFixesApplied: total }, null, 2));
