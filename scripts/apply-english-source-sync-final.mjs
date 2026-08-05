#!/usr/bin/env node
/**
 * English Source Sync FINAL — docs/learning-book/english only.
 * Part 1: global technical symbol cleanup
 * Part 2: G1/G2 manual-export alignment (point fixes, no full-page copy)
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ENGLISH_ROOT = path.join(ROOT, "docs/learning-book/english");

/** @type {[string, string][]} longest-first for slash patterns */
const GLOBAL_REPLACEMENTS = [
  ["the most / the best", "the most  the best"],
  ["must / have to", "must -have to"],
  [" / ", "  "],
  ["she/he/it", "she, he  it"],
  ["was/were", "was  were"],
  ["/", "  "],
  ["/", "  "],
  ["/", "  "],
  ["/", "  "],
  ["/", "  "],
  ["≈", ""],
  ["↔", "—"],
  ["→", "—"],
  ["✓", ""],
];

/** @type {[string, string][]} */
const G12_EXACT = [
  // letters_upper
  [
    '    " "  .',
    "      .       ,      .",
  ],
  [
    " 1:    —   ,  .",
    " 1: -S   ,     .",
  ],
  // letters_lower
  [
    ' **a**  —   " ".',
    " **a**  —     .",
  ],
  [
    ' 1:  ""  —    p.',
    " 1: -p     ,      .",
  ],
  [
    ' 1:  "" —   ?   .',
    " 1: -b     ,    .",
  ],
  [" 2:      — ", " 2:    b — "],
  // listening_commands
  [" — .", "  : ."],
  ["**Look. = **", "**Look. : **"],
  // first_words_cvc
  ["#     (CVC)", "#    "],
  ["| **title_hebrew** |     (CVC) |", "| **title_hebrew** |     |"],
  [
    "**Content scope:** CVC : cat, hat, sit, sun, pen, bed; audio_required: yes — blend ",
    "**Content scope:**  : cat, hat, sit, sun, pen, bed; audio_required: yes — blend ",
  ],
  [
    "   **** —  : , , .",
    "   **** —  .",
  ],
  [": c + a + t — cat.", ",  cat   ."],
  ["**cat** —  : c … a … t — cat.", "**cat** —     ,   cat."],
  ["**sit** —  : s … i … t — sit.", "**sit** —     ,   sit."],
  ["**cat** — c + a + t  ", "**cat**  "],
  ["**hat** — h + a + t  ", "**hat**  "],
  ["**sit** — s + i + t  ", "**sit**  "],
  ["**sun** — s + u + n  ", "**sun**  "],
  ["**pen** — p + e + n  ", "**pen**  "],
  ["**bed** — b + e + d  ", "**bed**  "],
  ["  — b + e + d?", "    b, e, d?"],
  ["**  — b + e + d?**", "**    b, e, d?**"],
  ["**bed = **", "**bed : **"],
  ["   CVC .", "      ."],
  ["  —      (CVC).", "  —     ."],
  // phonics_sounds
  [
    "**Content scope:**   +   a,e,i; audio_required: yes —   ",
    "**Content scope:**  a,e,i  b,m,s; audio_required: yes —   ",
  ],
  ["  ():", "  :"],
  [" :", "  :"],
  // phonics_first_sound content scope
  [
    "**Content scope:**    cat, dog, sun; audio_required: yes —  +  ",
    "**Content scope:**    cat, dog, sun; audio_required: yes —   ",
  ],
  // classroom_words / listening
  [
    "**Content scope:** book, pen, desk, chair, door, teacher, hello, bye; audio_required: yes —   +  ",
    "**Content scope:** book, pen, desk, chair, door, teacher, hello, bye; audio_required: yes —    ",
  ],
  [
    "**Content scope:** Point to the door, Show me your pen; audio_required: yes —  +  ",
    "**Content scope:** Point to the door, Show me your pen; audio_required: yes —   ",
  ],
  [" 1: open = .", " 1: Open  ."],
  [" 2: book = .", " 2: Book  ."],
  [" 1: close = .", " 1: Close  ."],
  ["**Close your book =   **", "**Close your book :   **"],
  // grammar_be g1
  [
    "**Content scope:**   I am / You are +   ;   am/is/are",
    "**Content scope:**   I am / You are   ;   am/is/are",
  ],
  // g2 first_word_reading
  [
    "**Content scope:** CVC + sight: the, I, a, is; audio_required: yes —  ",
    "**Content scope:** cat, sit, run, the, I, a, is; audio_required: yes —  ",
  ],
  [
    " ****  — CVC   .",
    " ****  —    .",
  ],
  ["CVC: **cat**, **sit**, **run**", " : **cat**, **sit**, **run**"],
  ["  (sight):", " :"],
  // g2 phonics
  [
    "**Content scope:** blend CVC: cat, hat, sit, run, big, red, hot, sun; audio_required: yes — segmented + blended",
    "**Content scope:** blend: cat, hat, sit, run, big, red, hot, sun; audio_required: yes — segmented and blended",
  ],
  [
    "**Content scope:**  A–Z ++; audio_required: yes",
    "**Content scope:**  A–Z ,  ; audio_required: yes",
  ],
  [
    "**Content scope:**  +; b/p, d/t; audio_required: yes",
    "**Content scope:**  ; b/p, d/t; audio_required: yes",
  ],
  [
    " ****    —   .",
    " ****    —   .",
  ],
  // g2 picture_audio
  [" 2:    + **pen**.", " 2:    -**pen**."],
  [": pen +  pen", ": pen  pen"],
  // g2 vocab content scopes
  [
    "**Content scope:**  +   ;  ",
    "**Content scope:**    ;  ",
  ],
  [
    "**Content scope:** apple, bread, milk, water —  + ",
    "**Content scope:** apple, bread, milk, water —  ",
  ],
  // README merge notes
  ["Merged be line + be_basic pool", "Merged be line -be_basic pool"],
  ["Merged  line + be_basic", "Merged  line -be_basic"],
  ["Merged plural line + question_frames", "Merged plural line -question_frames"],
  ["## Batch D — sentences + translation (4)", "## Batch D — sentences -translation (4)"],
  // grammar / sentence patterns
  [" = He,  = sad.", "He  . sad  ."],
  ["He is + sad.", "He is sad."],
  ["I + run.", "I run."],
  ["I am + happy.", "I am happy."],
  ["I am + twelve.", "I am twelve."],
  ["I see a + cat.", "I see a cat."],
  ["I + go to school.", "I go to school."],
  ["This is my + book —  .", "This is my book —  ."],
  ["We = .", "We  ."],
  ["The book = , is red = .", "The book  . is red  ."],
  ["I = , have =  , a book = .", "I  . have   . a book  ."],
  ["I = , have =  , a pen = .", "I  . have   . a pen  ."],
  ["seven = 7.", "seven  7."],
  [" 12 = twelve.", " 12  twelve."],
  ["go to school =   .", "go to school    ."],
  ["   = go to school.", "go to school    ."],
  ["  = Hello.", "Hello  ."],
  [" = cats.", "cats  ."],
  ["write = .", "write  ."],
];

function walkMd(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkMd(p, out);
    else if (ent.name.endsWith(".md")) out.push(p);
  }
  return out;
}

function applyOrdered(text, pairs) {
  let n = 0;
  for (const [from, to] of pairs) {
    const parts = text.split(from);
    if (parts.length > 1) {
      n += parts.length - 1;
      text = parts.join(to);
    }
  }
  return { text, n };
}

function fixG12Regex(text) {
  let n = 0;
  const applyRe = (re, repl) => {
    const next = text.replace(re, (...args) => {
      n += 1;
      return typeof repl === "function" ? repl(...args) : repl;
    });
    text = next;
  };

  applyRe(/\*\*([^*\n]+?) = ([^*\n]+?)\*\*/g, "**$1 : $2**");
  applyRe(/^([A-Za-z][^\n=]*?) = ([^\n]+?)\.$/gm, "$1 : $2.");
  applyRe(/^([-][^\n=]*?) = ([^\n]+?)\.$/gm, "$1 : $2.");

  return { text, n };
}

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join("/");
}

function isG12(file) {
  const r = rel(file);
  return r.includes("/english/g1/") || r.includes("/english/g2/");
}

const counts = {
  filesChanged: new Set(),
  global: {},
  g12Exact: 0,
  g12Regex: 0,
};

for (const [from] of GLOBAL_REPLACEMENTS) {
  counts.global[from] = 0;
}

const files = walkMd(ENGLISH_ROOT);
const changedFiles = [];

for (const file of files) {
  const original = fs.readFileSync(file, "utf8");
  let text = original;

  for (const [from, to] of GLOBAL_REPLACEMENTS) {
    const parts = text.split(from);
    if (parts.length > 1) {
      counts.global[from] += parts.length - 1;
      text = parts.join(to);
    }
  }

  if (isG12(file)) {
    const ex = applyOrdered(text, G12_EXACT);
    text = ex.text;
    counts.g12Exact += ex.n;
    const rx = fixG12Regex(text);
    text = rx.text;
    counts.g12Regex += rx.n;
  }

  if (text !== original) {
    fs.writeFileSync(file, text, "utf8");
    changedFiles.push(rel(file));
    counts.filesChanged.add(rel(file));
  }
}

const report = {
  filesChanged: changedFiles.length,
  files: changedFiles.sort(),
  replacementCounts: {
    ...counts.global,
    g12Exact: counts.g12Exact,
    g12Regex: counts.g12Regex,
  },
};

console.log(JSON.stringify(report, null, 2));
