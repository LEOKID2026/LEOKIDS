/**
 * Offline EN→ID line translator for learning-book drafts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CHROME_EXACT, PREFIX_PHRASES, LONG_PHRASES, WORD_TAILS } from "./id-book-phrases.mjs";
import { applyLineTemplates } from "./id-book-templates.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function loadJson(p, fb = {}) {
  if (!fs.existsSync(p)) return fb;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function loadMaps() {
  const exact = {
    ...CHROME_EXACT,
    ...loadJson(path.join(HERE, "exact-seed.json"), {}),
  };
  const mapDir = path.join(HERE, "maps");
  if (fs.existsSync(mapDir)) {
    for (const f of fs.readdirSync(mapDir).filter((x) => x.endsWith(".json"))) {
      Object.assign(exact, loadJson(path.join(mapDir, f), {}));
    }
  }
  return exact;
}

export const EXACT = loadMaps();

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function protect(s) {
  const ph = [];
  let out = String(s).replace(/```[\s\S]*?```/g, (b) => {
    ph.push(b);
    return `⟦B${ph.length - 1}⟧`;
  });
  out = out.replace(/`([^`]+)`/g, (_, c) => {
    ph.push("`" + c + "`");
    return `⟦C${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restore(s, ph) {
  return String(s)
    .replace(/⟦B(\d+)⟧/g, (_, i) => ph[Number(i)])
    .replace(/⟦C(\d+)⟧/g, (_, i) => ph[Number(i)]);
}

export function isEnglishLearningTargetLine(line) {
  const t = line.trim();
  if (!t) return false;
  // short lemmas / example sentences typical of English subject pages
  if (/^[A-Za-z][a-z' -]{0,28}$/.test(t)) return true;
  if (/^(I |I'm |I am |You |We |He |She |They |My |This is |That is |There are |Do you |Hello|Thank you|Hi[,!])/i.test(t) && t.length < 80) {
    return true;
  }
  if (/^"[A-Za-z]/.test(t) || /^'[A-Za-z]/.test(t)) return true;
  if (/means [a-z]/i.test(t) && t.split(/\s+/).length <= 8) return true;
  return false;
}

export function stillEnglishInstructional(s) {
  return /\b(Today |Let's |Look at|Look for|Write the|Read the|Try it|Try to|On the next page|When you |We will |Scientific explanation|What do we know|What are we asked|What do you see|Simple explanation|Common mistake|What are we learning|In practice|Now you know|How many|How much|Find the|Calculate|Before you |Always |Important:|Example:|Content scope|Source references|Grade [1-6]|because |through |which |with the|from the|into the|about the|their |they |this |these |those |the |and |with )\b/i.test(
    String(s || "")
  );
}

function stripHebrew(s) {
  return String(s)
    .replace(/[\u0590-\u05FF]+/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+\|/g, " |")
    .trim();
}

/**
 * @param {string} line
 * @param {{ englishSubject?: boolean }} opts
 */
export function translateLineId(line, opts = {}) {
  const raw = String(line ?? "");
  if (!raw.trim()) return raw;
  const trimmed = raw.trim();

  if (Object.prototype.hasOwnProperty.call(EXACT, trimmed)) {
    return raw.replace(trimmed, EXACT[trimmed]);
  }

  if (opts.englishSubject && isEnglishLearningTargetLine(trimmed)) {
    return raw;
  }

  // metadata identity rows
  if (
    /^\|/.test(trimmed) &&
    /\|\s*\*\*(learning_page_id|skill_id|grade|age_band|page_type|approval_status|title_english)\*\*/i.test(
      trimmed
    )
  ) {
    return raw;
  }

  const templated = applyLineTemplates(raw);
  if (templated != null) {
    // templates may still contain English noun tails — continue pipeline on result
    if (!stillEnglishInstructional(templated) || /[àáâäãåāèéêëēìíîïīòóôöõōùúûüūñç]/i.test(templated)) {
      // keep going if still English function words; else return when clearly Indonesian
    }
    if (
      /\b(kamu|kita|berapa|hitung|temukan|sekarang|dalam latihan|persegi|langkah|penting|keliling|luas|volume)\b/i.test(
        templated
      ) &&
      !/\b(Today |Let's |What is the|How many|Work out|Calculate|Before you|In practice you'll)\b/i.test(templated)
    ) {
      return templated;
    }
  }

  let { text: out, ph } = protect(templated != null ? templated : raw);

  // Exact long substring replacements (length-safe)
  for (const [en, id] of Object.entries(EXACT)) {
    if (en.length < 28) continue;
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

  out = out
    .replace(/\bGrade\s*([1-6])\b/g, "Kelas $1")
    .replace(/\bgrades\s*([1-6])\s*[–-]\s*([1-6])\b/gi, "kelas $1–$2")
    .replace(/\bshekels?\b/gi, "rupiah")
    .replace(/\$(\d)/g, "Rp$1")
    .replace(/`\[DRAFT — not owner-approved\]`/g, "`[DRAF — belum disetujui pemilik]`")
    .replace(/\[DRAFT — not owner-approved\]/g, "[DRAF — belum disetujui pemilik]");

  if (/[\u0590-\u05FF]/.test(out)) {
    out = stripHebrew(out);
  }

  out = restore(out, ph);

  // If partial salad remains on non-english subject, prefer exact-map miss (keep EN)
  // so residue audit can collect full lines for the next map round — UNLESS we already
  // have a clear Indonesian stem applied.
  if (!opts.englishSubject && out !== raw) {
    const hasId =
      /\b(kamu|kita|belajar|jumlah|kurang|kali|bagi|kelas|contoh|langkah|hari ini|mari|berapa|temukan|hitung)\b/i.test(
        out
      );
    if (!hasId && stillEnglishInstructional(out)) return raw;
  }

  return out;
}

export function translateMarkdown(md, { englishSubject = false } = {}) {
  return md
    .split(/(```[\s\S]*?```)/g)
    .map((part) => {
      if (part.startsWith("```")) return part;
      return part
        .split(/(\n)/)
        .map((line) => (line === "\n" ? line : translateLineId(line, { englishSubject })))
        .join("");
    })
    .join("");
}
