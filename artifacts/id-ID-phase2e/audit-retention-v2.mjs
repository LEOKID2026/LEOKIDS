import fs from "fs";
import { I18N_NAMESPACES } from "../../lib/i18n/load-messages.js";

function collect(v, prefix, out) {
  if (typeof v === "string") {
    out.set(prefix, v);
    return;
  }
  if (Array.isArray(v)) {
    v.forEach((item, i) => {
      const p = `${prefix}[${i}]`;
      if (typeof item === "string") out.set(p, item);
      else collect(item, p, out);
    });
    return;
  }
  if (v && typeof v === "object") {
    for (const [k, c] of Object.entries(v)) {
      collect(c, prefix ? `${prefix}.${k}` : k, out);
    }
  }
}

function load(locale, ns) {
  const j = JSON.parse(fs.readFileSync(`locales/${locale}/${ns}.json`, "utf8"));
  const m = new Map();
  collect(j, "", m);
  return m;
}

/**
 * Identical EN/ID leaves that are intentional:
 * - brand / tech tokens
 * - subject IDs
 * - placeholders / punctuation
 * - English-subject learning examples
 * - game proper names
 * - Indonesian loanwords with identical Latin spelling (Menu, Status, Email, Volume, …)
 */
function classifyIdentical(ns, key, val) {
  if (!val.trim()) return "empty";
  if (val === "Leo Kids" || val === "LEO KIDS" || val === "OK" || val === "-" || val === ".") return "intentional";
  if (/^\{[a-zA-Z_][a-zA-Z0-9_]*\}$/.test(val)) return "intentional";
  if (/\{[a-zA-Z_][a-zA-Z0-9_]*\}/.test(val) && /^[^A-Za-z]*(\{[^}]+\}|[^A-Za-z]|·|\s|-)+$/.test(val.replace(/\{[^}]+\}/g, "")))
    return "intentional"; // placeholder-only templates
  if (/reportSubjects|subjectIds/i.test(key)) return "intentional";
  if (/^(math|geometry|english|science)$/i.test(val)) return "intentional";
  // English-subject learning content
  if (/\.english\.|topics\.english\.|grammarAmIsAre|writingCustomWordsPlaceholder/i.test(key)) return "intentional";
  if (/Present simple|Past simple|I = am, You\/We\/They/.test(val)) return "intentional";
  // Game proper names
  if (/^(Bingo|Ludo|Connect Four)$/i.test(val)) return "intentional";
  // Identical Indonesian loanwords / international education terms (correct ID forms)
  const idLoanwords = new Set([
    "Menu",
    "Email",
    "Status",
    "Level",
    "Level {level}",
    "Timer",
    "Avatar",
    "Reset",
    "Default",
    "Diagram",
    "Volume",
    "Diagonal",
    "Pythagoras",
    "Planet",
    "Normal",
    "Minimum",
    "Script",
    "Zigzag",
    "Anime",
    "Streak",
    "↔️ Horizontal",
    "📦 Volume",
    "📐 Diagonal",
  ]);
  if (idLoanwords.has(val)) return "intentional";
  if (/^📦 Volume$|^📐 Diagonal$/.test(val)) return "intentional";
  return "unexplained";
}

const intentional = [];
const unexplained = [];

for (const ns of I18N_NAMESPACES) {
  const en = load("en", ns);
  const id = load("id-ID", ns);
  for (const [k, idVal] of id) {
    const enVal = en.get(k) || "";
    if (idVal !== enVal) continue;
    const c = classifyIdentical(ns, k, idVal);
    if (c === "intentional") intentional.push({ ns, k, v: idVal });
    else if (c === "unexplained") unexplained.push({ ns, k, v: idVal });
  }
}

console.log(JSON.stringify({ intentional: intentional.length, unexplained: unexplained.length, unexplainedList: unexplained }, null, 2));

// Phase2C per-file
const phase2c = ["reports", "emails", "legal", "teacher", "school", "copilot"];
for (const ns of phase2c) {
  console.log(ns, load("en", ns).size, load("id-ID", ns).size);
}
