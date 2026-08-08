/**
 * Build exact maps for all remaining need-lines using templates + phrase + word engine.
 * Writes artifacts/id-ID-phase8/maps/auto-*.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CHROME_EXACT, PREFIX_PHRASES, LONG_PHRASES, WORD_TAILS } from "./id-book-phrases.mjs";
import { applyLineTemplates } from "./id-book-templates.mjs";
import { WORD_ID } from "./id-book-words.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const exactSeed = JSON.parse(fs.readFileSync(path.join(HERE, "exact-seed.json"), "utf8"));
const { buckets } = JSON.parse(fs.readFileSync(path.join(HERE, "need-buckets.json"), "utf8"));

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function protect(s) {
  const ph = [];
  let out = String(s).replace(/`([^`]+)`/g, (_, c) => {
    ph.push("`" + c + "`");
    return `⟦C${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}
function restore(s, ph) {
  return String(s).replace(/⟦C(\d+)⟧/g, (_, i) => ph[Number(i)]);
}

function matchCase(src, rep) {
  if (!rep) return "";
  if (src === src.toUpperCase()) return rep.toUpperCase();
  if (src[0] === src[0].toUpperCase()) return rep.charAt(0).toUpperCase() + rep.slice(1);
  return rep;
}

function translateAggressive(line, { retainEnglishTargets = false } = {}) {
  const raw = String(line ?? "");
  const trimmed = raw.trim();
  if (!trimmed) return raw;
  if (exactSeed[trimmed] != null) return exactSeed[trimmed];
  if (CHROME_EXACT[trimmed] != null) return CHROME_EXACT[trimmed];

  if (retainEnglishTargets) {
    if (/^[A-Za-z][a-z' -]{0,28}$/.test(trimmed)) return trimmed;
    if (/^(I |I'm |I am |You |We |He |She |They |My |This is |That is |There are |Do you |Hello|Thank you)/i.test(trimmed) && trimmed.length < 80) {
      return trimmed;
    }
  }

  let out = applyLineTemplates(trimmed);
  if (out == null) out = trimmed;
  else out = out.trim();

  const guarded = protect(out);
  out = guarded.text;

  for (const [en, id] of Object.entries({ ...CHROME_EXACT, ...exactSeed })) {
    if (en.length < 24) continue;
    if (out.includes(en)) out = out.split(en).join(id);
  }
  for (const [en, id] of LONG_PHRASES) {
    if (out.toLowerCase().includes(en.toLowerCase())) {
      out = out.split(new RegExp(escapeRegExp(en), "gi")).join(id);
    }
  }
  for (const [en, id] of PREFIX_PHRASES) {
    const re = new RegExp(`^([\\s>*#-]*)(${escapeRegExp(en)})`, "i");
    if (re.test(out)) out = out.replace(re, (_, lead) => `${lead}${id}`);
  }
  for (const [en, id] of WORD_TAILS) {
    out = out.replace(new RegExp(`\\b${escapeRegExp(en)}\\b`, "g"), id);
  }

  // word pass
  out = out.replace(/[A-Za-z']+/g, (w) => {
    const low = w.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(WORD_ID, low)) {
      return matchCase(w, WORD_ID[low]);
    }
    return w;
  });

  out = out
    .replace(/\bGrade\s*([1-6])\b/g, "Kelas $1")
    .replace(/\bshekels?\b/gi, "rupiah")
    .replace(/\$(\d)/g, "Rp$1")
    .replace(/[\u0590-\u05FF]+/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();

  out = restore(out, guarded.ph);
  return out || trimmed;
}

function writeMap(name, entries) {
  const mapDir = path.join(HERE, "maps");
  fs.mkdirSync(mapDir, { recursive: true });
  /** @type {Record<string,string>} */
  const map = {};
  for (const en of entries) map[en] = translateAggressive(en, { retainEnglishTargets: name.startsWith("english") });
  fs.writeFileSync(path.join(mapDir, `${name}.json`), JSON.stringify(map));
  return Object.keys(map).length;
}

const n1 = writeMap("mgs-auto", buckets.contentMathGeoSci);
const n2 = writeMap("english-auto", buckets.contentEnglish);
const n3 = writeMap("readme-auto", buckets.readmeOnly);
const n4 = writeMap("shared-auto", buckets.shared);

console.log({ mgs: n1, english: n2, readme: n3, shared: n4 });
