import { SCIENCE_NL_NL_OVERLAY as NL } from "../../data/science-questions-nl-NL-overlay.js";
import { SCIENCE_EN_OVERLAY as EN } from "../../data/science-questions-en-overlay.js";
import fs from "node:fs";

const MIXED = /\b(Weent|eeenr|reenpport|peenge|neeneenr|leeenr|elementeenry|neentuur|geenmes)\b/;
const DRAFT = /\b(TODO|FIXME|TBD|draft|placeholder|XXX)\b/i;
const GRADE = /\bGrade\s*[1-6]\b/;
const WISK = /\bWiskunde\b/;
const EN_MARKERS =
  /\b(the|what|which|does|have|their|choose|correct|answer|because|through|following|select|explain|true|false)\b/i;
const NL_MARKERS = /\b(de|het|een|van|voor|met|zijn|wordt|worden|kunnen|waarom|welke|hoeveel|niet|ook)\b/i;

const stats = {
  total: 0,
  missing: 0,
  enStem: 0,
  enOpt: 0,
  enExpl: 0,
  draft: 0,
  mixed: 0,
  grade: 0,
  wisk: 0,
};
const samples = { enStem: [], enOpt: [], enExpl: [], draft: [], mixed: [] };
const bankHits = [];

function pushSample(bucket, item, max = 12) {
  if (samples[bucket].length < max) samples[bucket].push(item);
}

for (const id of Object.keys(EN)) {
  stats.total++;
  const n = NL[id];
  const e = EN[id];
  if (!n) {
    stats.missing++;
    continue;
  }
  const fields = ["stem", "prompt", "question", "explanation", "hint"];
  for (const f of fields) {
    const s = String(n[f] || "");
    if (!s) continue;
    if (MIXED.test(s)) {
      stats.mixed++;
      pushSample("mixed", { id, f, s: s.slice(0, 160) });
    }
    if (DRAFT.test(s)) {
      stats.draft++;
      pushSample("draft", { id, f, s: s.slice(0, 160) });
    }
    if (GRADE.test(s)) stats.grade++;
    if (WISK.test(s)) stats.wisk++;
    const looksEn = EN_MARKERS.test(s) && !NL_MARKERS.test(s);
    if (looksEn) {
      if (f === "stem" || f === "prompt" || f === "question") {
        stats.enStem++;
        pushSample("enStem", { id, f, s: s.slice(0, 160), en: String(e?.[f] || e?.stem || "").slice(0, 120) });
      }
      if (f === "explanation" || f === "hint") {
        stats.enExpl++;
        pushSample("enExpl", { id, f, s: s.slice(0, 160) });
      }
    }
  }
  for (const opt of n.options || []) {
    const s = String(opt || "");
    if (!s) continue;
    if (EN_MARKERS.test(s) && !NL_MARKERS.test(s) && /[A-Za-z]{3,}/.test(s)) {
      stats.enOpt++;
      pushSample("enOpt", { id, s: s.slice(0, 120) });
    }
  }

  const enBlob = JSON.stringify(e || {});
  const nlBlob = JSON.stringify(n || {});
  if (/\bbank\b/i.test(enBlob) || /\bbank\b/i.test(nlBlob) || /bank/i.test(id)) {
    bankHits.push({
      id,
      enStem: String(e?.stem || e?.prompt || e?.question || "").slice(0, 140),
      nlStem: String(n?.stem || n?.prompt || n?.question || "").slice(0, 140),
      nlOptions: (n?.options || []).slice(0, 6),
      enOptions: (e?.options || []).slice(0, 6),
    });
  }
}

const out = { stats, samples, bankCount: bankHits.length, bankHits };
fs.writeFileSync("scripts/i18n/_qa-science-report.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify({ stats, bankCount: bankHits.length, sampleCounts: Object.fromEntries(Object.entries(samples).map(([k, v]) => [k, v.length])) }, null, 2));
