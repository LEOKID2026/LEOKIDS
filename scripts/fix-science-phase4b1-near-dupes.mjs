#!/usr/bin/env node
/**
 * Rewrite exact duplicate stems in science-questions-phase4b1.js (template clones).
 * Keeps canonical IDs; replaces duplicate rows with distinct science MCQs.
 */
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join(ROOT, "data/science-questions-phase4b1.js");

const REWRITES = {
  p4b1_g6_materials_003: {
    stem: "       ?",
    options: [
      "   ",
      "   ",
      "    ",
      "     ",
    ],
    correctIndex: 0,
    explanation: "    —    .",
  },
  p4b1_g6_materials_004: {
    stem: "      ?",
    options: [
      "      ",
      "     ",
      "    ",
      "    ",
    ],
    correctIndex: 0,
    explanation: "      .",
  },
  p4b1_g6_materials_005: {
    stem: "    ?",
    options: [
      "     ",
      "   ",
      "  ",
      "  ",
    ],
    correctIndex: 0,
    explanation: "        .",
  },
  p4b1_g6_materials_006: {
    stem: "        ?",
    options: [
      "      ",
      "     ",
      "     ",
      "     ",
    ],
    correctIndex: 0,
    explanation: "       .",
  },
  p4b1_g6_materials_007: {
    stem: "  —   ?",
    options: [
      "  —   ",
      "  —   ",
      "   ",
      "    ",
    ],
    correctIndex: 0,
    explanation: "         .",
  },
  p4b1_g6_materials_008: {
    stem: "       ?",
    options: [
      "       ",
      "  ",
      "    ",
      "     ",
    ],
    correctIndex: 0,
    explanation: "       .",
  },
  p4b1_g6_earth_004: {
    stem: "    ?",
    options: [
      "       ",
      "      ",
      "       ",
      "     ",
    ],
    correctIndex: 0,
    explanation: "       .",
  },
  p4b1_g6_earth_005: {
    stem: "       ?",
    options: [
      "      ",
      "    ",
      "     ",
      "    ",
    ],
    correctIndex: 0,
    explanation: "       .",
  },
  p4b1_g6_earth_006: {
    stem: "     ?",
    options: [
      "     ",
      "     ",
      "    ",
      "      ",
    ],
    correctIndex: 0,
    explanation: "         .",
  },
  p4b1_g6_earth_007: {
    stem: "     ?",
    options: [
      "      ",
      "     ",
      "      ",
      "     ",
    ],
    correctIndex: 0,
    explanation: "    —   .",
  },
  p4b1_g6_earth_008: {
    stem: "       ?",
    options: [
      "       ",
      "     ",
      "       ",
      "     ",
    ],
    correctIndex: 0,
    explanation: "       .",
  },
  p4b1_g6_env_003: {
    stem: "        ?",
    options: [
      "      ",
      "    ",
      "      ",
      "  ,   ",
    ],
    correctIndex: 0,
    explanation: "    —      .",
  },
  p4b1_g6_env_004: {
    stem: "     ?",
    options: [
      " ,   ",
      "   ",
      "     ",
      "     ",
    ],
    correctIndex: 0,
    explanation: "     .",
  },
  p4b1_g6_env_005: {
    stem: "      ?",
    options: [
      "  ,    ",
      "     ",
      "    ",
      "     ",
    ],
    correctIndex: 0,
    explanation: "     .",
  },
  p4b1_g6_env_006: {
    stem: "     -?",
    options: [
      "  ,    ",
      "   ",
      "    ",
      "  ",
    ],
    correctIndex: 0,
    explanation: "     .",
  },
  p4b1_g6_env_007: {
    stem: "     ?",
    options: [
      "        ",
      "     ",
      "    ",
      "     ",
    ],
    correctIndex: 0,
    explanation: "     —   .",
  },
  p4b1_g4_earth_space_003: {
    stem: "     ?",
    options: [
      "  ,    ",
      "    ",
      "   ",
      "    ",
    ],
    correctIndex: 0,
    explanation: "       .",
  },
  p4b1_g4_earth_space_004: {
    stem: "     ?",
    options: [
      "    ",
      "   ",
      "   ",
      "    ",
    ],
    correctIndex: 0,
    explanation: "      .",
  },
  p4b1_g4_earth_space_005: {
    stem: "         ?",
    options: [
      ",     ",
      "   ",
      "    ",
      "     ",
    ],
    correctIndex: 0,
    explanation: "    .",
  },
  p4b1_g4_earth_space_006: {
    stem: "        ?",
    options: [
      "      ",
      "  ",
      "  ",
      "   ",
    ],
    correctIndex: 0,
    explanation: "      .",
  },
  p4b1_g4_environment_003: {
    stem: "        ?",
    options: [
      "       ",
      "   ",
      "   ",
      "  ,   ",
    ],
    correctIndex: 0,
    explanation: "       .",
  },
  p4b1_g4_environment_005: {
    stem: "       ?",
    options: [
      "      ",
      "   ",
      "   ",
      "   ",
    ],
    correctIndex: 0,
    explanation: "        .",
  },
};

function patchField(block, field, value, isArray = false) {
  if (field === "stem") {
    const re = /"stem"\s*:\s*"[^"]*"/;
    return block.replace(re, `"stem": ${JSON.stringify(value)}`);
  }
  if (field === "options") {
    const re = /"options"\s*:\s*\[[\s\S]*?\]/;
    const formatted = `"options": [\n      ${value.map((o) => JSON.stringify(o)).join(",\n      ")}\n    ]`;
    return block.replace(re, formatted);
  }
  if (field === "correctIndex") {
    return block.replace(/"correctIndex"\s*:\s*\d+/, `"correctIndex": ${value}`);
  }
  if (field === "explanation") {
    const re = /"explanation"\s*:\s*"[^"]*"/;
    if (re.test(block)) {
      return block.replace(re, `"explanation": ${JSON.stringify(value)}`);
    }
  }
  return block;
}

let text = await readFile(FILE, "utf8");
let count = 0;

for (const [id, fix] of Object.entries(REWRITES)) {
  const idRe = new RegExp(`"id"\\s*:\\s*"${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`);
  const m = idRe.exec(text);
  if (!m) {
    console.warn("missing", id);
    continue;
  }
  const start = m.index;
  const nextId = text.indexOf('"id":', start + 10);
  const end = nextId > start ? nextId : text.length;
  let block = text.slice(start, end);
  block = patchField(block, "stem", fix.stem);
  block = patchField(block, "options", fix.options);
  block = patchField(block, "correctIndex", fix.correctIndex);
  if (fix.explanation) block = patchField(block, "explanation", fix.explanation);
  text = text.slice(0, start) + block + text.slice(end);
  count++;
}

await writeFile(FILE, text);
console.log(`fix-science-phase4b1-near-dupes: patched ${count} questions`);
