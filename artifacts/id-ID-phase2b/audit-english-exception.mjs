/**
 * Classify retained Latin/English leaves in id-ID Phase 2B owned namespaces.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const NS = ["learning", "worksheets", "games"];

function walkLeaves(node, prefix = [], out = []) {
  if (node === null || typeof node !== "object") {
    out.push({ path: prefix.join("."), value: node });
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => walkLeaves(v, prefix.concat(String(i)), out));
    return out;
  }
  for (const k of Object.keys(node)) walkLeaves(node[k], prefix.concat(k), out);
  return out;
}

function classify(ns, leafPath, value) {
  const full = `${ns}.${leafPath}`;
  if (typeof value !== "string") return null;
  if (!/[A-Za-z]{2,}/.test(value)) return null;

  // Pure formulas / math symbols with latin var letters
  if (/^[A-Za-z0-9 ×÷π²³\-+/=().,%√\s]+$/.test(value) && /[=×÷π²³]/.test(value)) {
    return { kind: "formula", full };
  }

  // Brand / tech tokens allowed in UI chrome
  if (
    /^(OpenCV|LEO KIDS|Leo Kids|Leo|Anime|Bingo|Ludo|Connect Four|Script|Timer|XP|AI|PNG|PDF|A4|JPG|Chrome|Edge|Safari|Pythagoras|Domino|Dam|Catur|Ular Tangga)([ ·.].*)?$/.test(
      value
    ) ||
    /\b(OpenCV|LEO KIDS|Leo Kids|Chrome|Edge|Safari|PNG|PDF|JPG|A4|AI|XP)\b/.test(value)
  ) {
    // If mostly Indonesian with brand token, not unexplained UI English
    if (!/\b(the|and|your|please|select|choose|click|try again|worksheet|student|grade [1-6])\b/i.test(value)) {
      return { kind: "brand_or_product", full };
    }
  }

  // English-subject learning content
  if (
    full === "worksheets.writingCustomWordsPlaceholder" ||
    full.startsWith("learning.english.steps.") ||
    full.startsWith("learning.english.mistakes.")
  ) {
    if (
      /\b(I|You|We|They|He|She|It|am|is|are)\b/.test(value) ||
      full === "worksheets.writingCustomWordsPlaceholder" ||
      /\"\{word\}\"|\"\{sentence\}\"|\"\{template\}\"|\"\{answer\}\"/.test(value)
    ) {
      return { kind: "english_learning_content", full };
    }
  }

  // Loanwords commonly kept in Indonesian UI (level, timer, reset, default, avatar, etc.)
  const loan =
    /\b(level|timer|reset|default|avatar|streak|maraton|demo|filter|portal|kuota|quota|mode|fokus|fokus|horisontal|horizontal|vertikal|diagonal|spiral|zigzag|komik|anime|script|digit|normal|auto|zoom|crop|openCV)\b/i;
  if (loan.test(value) && !/\b(Choose|Try again|Great job|Worksheet|Student|Grade [1-6]|Practice|Answer key)\b/.test(value)) {
    // still Indonesian sentence
    if (/[àáâäèéêëìíîïòóôöùúûüçñ]|[A-Za-z]*[aiueo][a-z]+/.test(value) || /[A-Za-z]*nya\b|[Kk]amu|[Pp]ilih|[Bb]uat/.test(value)) {
      return { kind: "indonesian_with_loanword", full };
    }
  }

  // Placeholder-only latin inside otherwise ID
  if (/\{[a-zA-Z_]+\}|\{\{[a-zA-Z_]+\}\}/.test(value) && !/\b(the|please|select|choose|try again)\b/i.test(value)) {
    const stripped = value
      .replace(/\{[^}]+\}/g, "")
      .replace(/\{\{[^}]+\}\}/g, "")
      .replace(/[0-9%✅❌😔🎉🔥⭐🌟👑⚡💎🎯🧮🏆🔬📘📚✏️🔤📝📖🧬🌍🧪▶️⏹️📷🗑️🧹🎲↔️↕️⚠️·–—…]/g, "")
      .trim();
    if (!/\b(the|and|your|please|worksheet|student|choose|try)\b/i.test(stripped)) {
      return { kind: "indonesian_with_placeholders", full };
    }
  }

  // Unexplained if still looks like English UI sentence
  if (/\b(the|and|your|please|select|choose|click|try again|great job|worksheet|student|answer key|print|download)\b/i.test(value)) {
    return { kind: "unexplained_english_ui", full, value };
  }

  return { kind: "other_latin", full, value };
}

const buckets = {
  english_learning_content: [],
  formula: [],
  brand_or_product: [],
  indonesian_with_loanword: [],
  indonesian_with_placeholders: [],
  unexplained_english_ui: [],
  other_latin: [],
};

for (const ns of NS) {
  const id = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/id-ID", `${ns}.json`), "utf8"));
  for (const leaf of walkLeaves(id)) {
    const c = classify(ns, leaf.path, leaf.value);
    if (!c) continue;
    buckets[c.kind].push(c.full + (c.value ? `: ${c.value}` : ""));
  }
}

const summary = Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.length]));
fs.writeFileSync(
  path.join(ROOT, "artifacts/id-ID-phase2b/english-exception-audit.json"),
  JSON.stringify({ summary, buckets }, null, 2),
  "utf8"
);
console.log(JSON.stringify(summary, null, 2));
if (buckets.unexplained_english_ui.length) {
  console.log("UNEXPLAINED:", buckets.unexplained_english_ui);
}
if (buckets.other_latin.length) {
  console.log("OTHER sample:", buckets.other_latin.slice(0, 40));
}
