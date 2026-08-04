import { SCIENCE_NL_NL_OVERLAY as NL } from "../../data/science-questions-nl-NL-overlay.js";
import { SCIENCE_EN_OVERLAY as EN } from "../../data/science-questions-en-overlay.js";
import fs from "node:fs";

/** Strings that still look machine-broken or heavily English-mixed. */
const BAD = [
  /\b(What|Which|When|Where|How|Why|If|True|false|true|because|quickly|well|automatically|actually|special|harmful|honest|analysis|replication|behavior|called|survive|reproduce|growth|pulse|daytime|lizards|hypothesis|observe|observation|measure|measurement|cells|organs|jobs|toward|light|food)\b/,
  /\b(je pols|Wat is true|overdag op Aarde|best links|meestal true|geleidens|materiaalen|nodig hebben special|their jobs|phototropism|carry out)\b/i,
  /\b(the|and|with|from|that|this|these|those|their|they|them|into|about)\b.*\b(de|het|een|van)\b|\b(de|het|een|van)\b.*\b(the|and|with|from|that|this)\b/i,
];

const badIds = new Set();
const samples = [];
let fieldCount = 0;

function check(id, field, s, en) {
  if (!s || typeof s !== "string") return;
  fieldCount++;
  const hit = BAD.some((re) => re.test(s));
  // Also: high ASCII English token ratio with lowercase EN verbs leftover
  const enTok = (s.match(/\b[A-Za-z]{3,}\b/g) || []).filter((w) =>
    /^(what|which|when|where|how|why|true|false|because|quickly|well|special|harmful|survive|reproduce|pulse|daytime|growth|hypothesis|behavior|called|cells|organs|jobs|toward|light|food|actually|automatically|honest|analysis|measure|observe)$/i.test(
      w,
    ),
  );
  if (hit || enTok.length >= 1) {
    badIds.add(id);
    if (samples.length < 60) {
      samples.push({ id, field, s: s.slice(0, 180), en: String(en || "").slice(0, 120), enTok });
    }
  }
}

for (const id of Object.keys(EN)) {
  const n = NL[id];
  const e = EN[id];
  if (!n) continue;
  for (const f of ["stem", "prompt", "question", "explanation", "hint"]) {
    check(id, f, n[f], e?.[f] || e?.stem);
  }
  (n.options || []).forEach((opt, i) => check(id, `options[${i}]`, opt, e?.options?.[i]));
  (n.theoryLines || []).forEach((line, i) => check(id, `theoryLines[${i}]`, line, e?.theoryLines?.[i]));
}

// Find bank (bench vs finance) in EN authority
const bankRecords = [];
for (const id of Object.keys(EN)) {
  const e = EN[id];
  const blob = JSON.stringify(e);
  if (/\bbanks?\b/i.test(blob) || /\bbanks?\b/i.test(id)) {
    bankRecords.push({
      id,
      enStem: e.stem || e.prompt || e.question,
      enOptions: e.options,
      nlStem: NL[id]?.stem || NL[id]?.prompt,
      nlOptions: NL[id]?.options,
      nlExpl: NL[id]?.explanation,
    });
  }
}

const out = {
  badIdCount: badIds.size,
  fieldCount,
  samples,
  bankRecords,
  badIds: [...badIds].sort(),
};
fs.writeFileSync("scripts/i18n/_qa-science-deep.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify({ badIdCount: badIds.size, bankRecords: bankRecords.length, sampleCount: samples.length }, null, 2));
