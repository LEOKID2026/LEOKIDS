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

const ALLOWED_EXACT = new Set([
  "Leo Kids",
  "LEO KIDS",
  "Google",
  "PIN",
  "PDF",
  "PWA",
  "OK",
  "SMS",
  "QR",
  "math",
  "geometry",
  "english",
  "science",
]);

function isAllowedIdentical(key, val) {
  if (ALLOWED_EXACT.has(val)) return true;
  if (/Leo Kids|LEO KIDS/.test(val) && val === val) {
    // brand retained inside otherwise translated strings is fine when entire leaf === EN
  }
  if (/^https?:\/\//i.test(val)) return true;
  if (/^[a-z0-9_.-]+@[a-z0-9.-]+$/i.test(val)) return true;
  if (/^(math|geometry|english|science)$/i.test(val)) return true;
  if (/reportSubjects|subjectIds|locale|href|url|code$/i.test(key)) return true;
  if (/^[a-z][a-z0-9_]*$/.test(val) && val.length <= 24) return true; // machine tokens / ids
  if (val.length <= 2) return true;
  if (/^\{[a-zA-Z_][a-zA-Z0-9_]*\}$/.test(val)) return true;
  // Brand-only or brand + separator leftovers that are intentional product names
  if (/^Leo Kids/.test(val) || /· Leo Kids$/.test(val)) return true;
  return false;
}

const intentional = [];
const suspicious = [];

for (const ns of I18N_NAMESPACES) {
  const en = load("en", ns);
  const id = load("id-ID", ns);
  for (const [k, idVal] of id) {
    const enVal = en.get(k) || "";
    if (!idVal.trim()) continue;
    if (idVal !== enVal) continue;
    if (isAllowedIdentical(k, idVal)) intentional.push({ ns, k, v: idVal });
    else if (/[A-Za-z]{3,}/.test(idVal)) suspicious.push({ ns, k, v: idVal });
  }
}

console.log("INTENTIONAL_IDENTICAL", intentional.length);
for (const x of intentional) console.log("INT", x.ns, x.k, JSON.stringify(x.v));
console.log("SUSPICIOUS_IDENTICAL", suspicious.length);
for (const x of suspicious) console.log("SUS", x.ns, x.k, JSON.stringify(x.v));

// Terminology: English role/UI words that should have been translated
const termRes = [
  [/\bStudent\b/, "Student"],
  [/\bTeacher\b/, "Teacher"],
  [/\bWorksheet\b/, "Worksheet"],
  [/\bDashboard\b/, "Dashboard"],
  [/\bPassword\b/, "Password"],
  [/\bSign in\b/i, "Sign in"],
  [/\bSign out\b/i, "Sign out"],
  [/\bGrade [1-6]\b/, "Grade N"],
  [/\bReport card\b/i, "Report card"],
];

const termHits = [];
for (const ns of I18N_NAMESPACES) {
  const id = load("id-ID", ns);
  for (const [k, v] of id) {
    for (const [re, label] of termRes) {
      if (re.test(v)) {
        // Allow English-subject learning contexts
        if (/english|vocabulary|spelling|phonics|grammar/i.test(k + " " + v) && label === "Student") continue;
        termHits.push({ ns, k, label, v: v.slice(0, 120) });
      }
    }
  }
}
console.log("TERM_HITS", termHits.length);
for (const x of termHits.slice(0, 50)) console.log(JSON.stringify(x));

// Register spot-check: kamu should not dominate adult namespaces; Anda should not dominate student learning chrome excessively
const adultNs = new Set(["teacher", "school", "copilot", "legal", "emails", "auth", "reports"]);
const childNs = new Set(["learning", "games"]);
let kamuInAdult = 0;
let andaInChild = 0;
for (const ns of I18N_NAMESPACES) {
  const id = load("id-ID", ns);
  for (const [, v] of id) {
    if (adultNs.has(ns) && /\bkamu\b/i.test(v)) kamuInAdult++;
    if (childNs.has(ns) && /\bAnda\b/.test(v)) andaInChild++;
  }
}
console.log("REGISTER kamu_in_adult", kamuInAdult, "Anda_in_child", andaInChild);

// Expected terms present
const mustFind = [
  ["common", /Kelas 1|Kelas \{/, "Kelas"],
  ["auth", /Masuk|Keluar|kata sandi|Kata sandi/, "auth terms"],
  ["ui", /dasbor|Dasbor|lembar kerja|Lembar kerja|murid|guru|orang tua/i, "ui terms"],
];
for (const [ns, re, label] of mustFind) {
  const id = load("id-ID", ns);
  const hit = [...id.values()].some((v) => re.test(v));
  console.log("MUST", label, hit ? "FOUND" : "MISSING");
}
