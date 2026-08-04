import fs from "node:fs";
import { EXACT } from "./_de-DE-book-line.mjs";

const ens = JSON.parse(fs.readFileSync("scripts/i18n/_de-DE-book-residue-parts/part-13-en.json", "utf8"));
const map = JSON.parse(fs.readFileSync("scripts/i18n/_de-DE-book-residue-map.json", "utf8"));
const scopes = JSON.parse(fs.readFileSync("scripts/i18n/_de-DE-book-scopes-de.json", "utf8"));

const EN =
  /\b(the|and|with|that|which|because|through|their|they|these|those|would|could|should|from|have|been|does|make|help|need|what|when|where|how|why|for|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|\bis\b|like|has|not|don't|let's|this|here|use|look|try|work|out|learn|divide|subtract|take|away|means|getting|know|important|example|today|practice|questions|someone|asks|if|everyday|floor|tile|right|angles|geometry|number|line|quarter|turn|half|full|light|shadow|reflection|transparency|mixture|mixtures|climate|solar|earth|space|scientists|worldwide|impodertant|foder|Work out|Now you|Here we|Imagine|That is|If someone|Hold|Modere|left and right)\b/i;

let missing = 0;
let good = 0;
let salad = 0;
const need = [];
for (const en of ens) {
  const de = EXACT[en] || scopes[en] || map[en];
  if (!de) {
    missing++;
    need.push(en);
    continue;
  }
  if (de === en || EN.test(de)) {
    salad++;
    need.push(en);
  } else {
    good++;
  }
}
console.log({ total: ens.length, good, salad, missing, need: need.length });
fs.writeFileSync("scripts/i18n/_de-DE-book-residue-parts/part-13-need.json", JSON.stringify(need, null, 2));
console.log("sample need", need.slice(0, 30));
