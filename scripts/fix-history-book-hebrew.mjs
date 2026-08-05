#!/usr/bin/env node
/**
 * Fix corrupted Hebrew/Latin mix in history G6 book drafts (child-facing sections).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRAFTS = join(ROOT, "docs/learning-book/history/g6/drafts");

const REPLACEMENTS = [
  [/ehud/gi, ""],
  [/ehuda/gi, ""],
  [/ehudim/gi, ""],
  [/ehud/gi, ""],
  [/udah/gi, ""],
  [/udim/gi, ""],
  [/ud/gi, ""],
  [/avne/gi, ""],
  [/ehuda/gi, ""],
  [/italia/gi, ""],
  [/italia/gi, ""],
  [/atin/gi, "atin"],
  [/atin/gi, "atin"],
  [/ompeyus/gi, " "],
  [/ompeyus/gi, " "],
  [/b/gi, "ban"],
  [/b/gi, "ban"],
  [/ban/gi, "ban"],
  [/at/gi, "at"],
  [/at/gi, "at"],
  [/PORT/gi, ""],
  [/ militari/gi, ""],
  [/isciplina/gi, ""],
  [/ ostracon/gi, ""],
  [/atan/gi, ""],
  [/on/gi, ""],
  [/ukah/gi, ""],
  [/udah/gi, ""],
  [/ompeyuS/gi, " "],
  [/avne/gi, ""],
  [/italia2/gi, ""],
  [/latin/gi, ""],
  [/atin/gi, ""],
  [/Yavne/gi, ""],
  [/Bar Kochba/gi, " ba"],
  [/Bar Kokhba/gi, " ba"],
  [/ha-churban/gi, "ban"],
  [/churban/gi, "ban"],
  [/Bavel/gi, ""],
  [/Herod/gi, ""],
  [/Yehuda/gi, ""],
  [/Yehudim/gi, ""],
  [/Mered/gi, ""],
  [/Mikdash/gi, "d"],
  [/provincia/gi, ""],
  [/migbalot/gi, ""],
  [/masim/gi, ""],
  [/metachim/gi, ""],
  [/merkaz/gi, ""],
  [/limud/gi, ""],
  [/tefila/gi, ""],
  [/galut/gi, ""],
  [/edut/gi, ""],
  [/yeshira/gi, ""],
  [/chayei/gi, ""],
  [/lifnei/gi, ""],
  [/mered/gi, "ed"],
  [/Midbar/gi, "dbar"],
  [/Melach/gi, "hamelach"],
  [/migilot/gi, ""],
  [/Yam/gi, ""],
  [/ezmaaut/gi, "m"],
  [/Hashmona/gi, "m"],
  [/kibushim/gi, "ibushim"],
  [/milchamot/gi, ""],
  [/shlita/gi, "lita"],
  [/romit/gi, ""],
  [/memuna/gi, ""],
  [/ke-melech/gi, ""],
  [/ke-/gi, ""],
  [/ve-/gi, ""],
  [/u-/gi, ""],
  [/be-/gi, ""],
  [/le-/gi, ""],
  [/ha-/gi, ""],
  [/lifnei/gi, ""],
  [/Gadol/gi, ""],
];

/** Strip latin from child sections (after metadata header). */
function cleanChildBody(text) {
  let out = text;
  for (const [re, rep] of REPLACEMENTS) {
    out = out.replace(re, rep);
  }
  // Remove remaining isolated latin letters in Hebrew words (e.g. ehud → fixed above)
  out = out.replace(/([-])([a-zA-Z]+)([-])/g, (_, a, latin, b) => {
    const map = {
      udah: "",
      avne: "",
      b: "",
      latin: "",
      ehud: "",
      ehuda: "",
      ehudim: "",
      ehud: "",
      avne: "",
      b: "",
    };
    return a + (map[latin.toLowerCase()] || "") + b;
  });
  return out;
}

function processFile(name) {
  const path = join(DRAFTS, name);
  let raw = readFileSync(path, "utf8");
  const parts = raw.split(/^---\s*$/m);
  if (parts.length < 2) {
    raw = cleanChildBody(raw);
  } else {
    // Keep metadata block; clean sections 1+
    const head = parts.slice(0, 2).join("\n---\n");
    const body = parts.slice(2).join("\n---\n");
    raw = head + "\n---\n" + cleanChildBody(body);
  }
  writeFileSync(path, raw, "utf8");
}

for (const f of [
  "what_is_history.md",
  "classical_greece.md",
  "hellenism_jews.md",
  "hasmonaeans.md",
  "rome_jews.md",
]) {
  processFile(f);
}

console.log("Book draft cleanup pass done");
