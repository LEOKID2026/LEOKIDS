#!/usr/bin/env node
/**
 * Extract ALL EN-identical leaves for master locales and classify them.
 * Writes docs/reports/non-en-static-en-leaves-classified.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const NAMESPACES = [
  "common",
  "ui",
  "auth",
  "learning",
  "reports",
  "emails",
  "seo",
  "legal",
  "worksheets",
  "games",
  "validation",
  "teacher",
  "school",
  "platform",
  "copilot",
];
const MASTERS = ["fr-FR", "de-DE", "nl-NL", "es-419", "it-IT", "ru-RU", "pt-BR", "ar-001"];

function flatten(obj, prefix = "", out = []) {
  if (obj == null) return out;
  if (typeof obj === "string") {
    const t = obj.trim();
    if (t.length >= 3) out.push({ key: prefix, value: t });
    return out;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out));
    return out;
  }
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
  return out;
}

function load(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

/** Educational / UI cognates identical in EN and target language (allowed remaining). */
const COGNATE_VALUES = new Set([
  "Collection",
  "Missions",
  "Question",
  "Questions",
  "Addition",
  "Multiplication",
  "Division",
  "Fractions",
  "Estimation",
  "Triangles",
  "Transformations",
  "Rotation",
  "Adaptations",
  "Adaptation",
  "Nutrition",
  "Circulation",
  "Respiration",
  "Habitats",
  "Classification",
  "Marathon",
  "Messages",
  "Important",
  "Discussion",
  "Portrait",
  "Diagonal",
  "Contrast",
  "Dashboard",
  "Volume",
  "Pythagoras",
  "Percentages",
  "Prototype",
  "Password",
  "Champion",
  "🌟 Champion",
  "÷ Division",
  "➕ Addition",
  "➗ Division",
  "➗ Quotient",
  "🔢 Fractions",
  "🔢 Fraction",
  "📦 Volume",
  "📐 Diagonal",
  "↔️ Horizontal",
  "↕️ Vertical",
  "⚠️ Error:",
  "{current} / {goal} min",
  "{game} — Arcade",
  "Details — {name}",
  "Contact · Leo Kids",
  "Page {pageId}",
  "{count, plural, one {# question} other {# questions}}",
  "🔬 {topic} expert",
]);

/** @returns {"brand"|"icu"|"technical"|"english_subject"|"allowed_cognate"|"must_translate"} */
function classify(ns, key, value) {
  const k = `${ns}.${key}`.toLowerCase();
  // Brand
  if (value === "Leo Kids" || key === "brandName" || key === "home.headline") return "brand";
  // Pure ICU / placeholder-only
  if (/^\{[a-zA-Z0-9_]+\}$/.test(value)) return "icu";
  if (/^\{[^}]+\}\s*[·\-\/|]\s*\{[^}]+\}$/.test(value)) return "icu";
  if (/^\{[^}]+\}\s*\(\{[^}]+\}\)$/.test(value)) return "icu";
  if (key.includes("rawMessage") && value.includes("{message}")) return "icu";
  // English subject learning content
  if (
    k.includes("english.") ||
    k.includes("topics.english") ||
    k.includes("grammar_") ||
    key === "writingCustomWordsPlaceholder" ||
    /^(Present simple|Past simple|cat, dog)$/.test(value) ||
    value.startsWith("I = am,")
  ) {
    return "english_subject";
  }
  // Technical IDs / subject codes used as keys elsewhere
  if (
    /^(math|geometry|english|science)$/i.test(value) &&
    (k.includes("reportsubjects") || k.includes("subjectid"))
  ) {
    return "technical";
  }
  if (COGNATE_VALUES.has(value)) return "allowed_cognate";
  return "must_translate";
}

const out = {};
for (const locale of MASTERS) {
  const leaves = [];
  for (const ns of NAMESPACES) {
    const enPath = path.join(ROOT, "locales", "en", `${ns}.json`);
    const locPath = path.join(ROOT, "locales", locale, `${ns}.json`);
    if (!fs.existsSync(enPath) || !fs.existsSync(locPath)) continue;
    const enFlat = flatten(load(enPath) || {});
    const locMap = Object.fromEntries(flatten(load(locPath) || {}).map((x) => [x.key, x.value]));
    for (const { key, value } of enFlat) {
      if (!/[A-Za-z]{3,}/.test(value) || value.length < 8) continue;
      const locVal = locMap[key];
      if (locVal == null || locVal !== value) continue;
      const kind = classify(ns, key, value);
      leaves.push({ ns, key, value, kind });
    }
  }
  const byKind = {};
  for (const l of leaves) byKind[l.kind] = (byKind[l.kind] || 0) + 1;
  out[locale] = { total: leaves.length, byKind, leaves };
  console.log(locale, JSON.stringify(byKind), "total", leaves.length);
}

fs.writeFileSync(
  path.join(ROOT, "docs/reports/non-en-static-en-leaves-classified.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), locales: out }, null, 2)
);
