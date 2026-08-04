/**
 * Full de-DE content-layer closure audit (content only).
 * node scripts/i18n/_audit-de-DE-closure.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stillEnglishInstructional } from "./_de-DE-book-line.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(ent.name, p)) out.push(p);
  }
  return out;
}

function flattenStrings(v, out = []) {
  if (v == null) return out;
  if (typeof v === "string") {
    out.push(v);
    return out;
  }
  if (Array.isArray(v)) {
    for (const x of v) flattenStrings(x, out);
    return out;
  }
  if (typeof v === "object") {
    for (const x of Object.values(v)) flattenStrings(x, out);
  }
  return out;
}

const EN_MARKERS =
  /\b(Today we|Let's |Look at|Look for|Try to solve|On the next page|What are we learning|Simple explanation|Common mistake|In practice|number line|the teens|Grade [1-6]|Write the|Read the|Scientific explanation|What do we know|What are we asked)\b/i;

const AT_CH = /\b(Jänner|Spital|Velo|parkieren|Billett|Velo|Trottinett|Primarschule|Oberstufe|Matura)\b/;

function scanBooks() {
  const files = walk(path.join(ROOT, "docs/learning-book/de-DE"), (n) => n.endsWith(".md"));
  const issues = [];
  let gradeHits = 0;
  let studentHits = 0;
  let enInstr = 0;
  let atCh = 0;
  for (const f of files) {
    const rel = path.relative(path.join(ROOT, "docs/learning-book/de-DE"), f).replace(/\\/g, "/");
    const englishSubject = rel.startsWith("english/");
    const t = fs.readFileSync(f, "utf8");
    if (/\bGrade\s*[1-6]\b/.test(t)) {
      gradeHits++;
      if (issues.length < 40) issues.push({ kind: "Grade", rel });
    }
    if (/\bStudents?\b/.test(t) && !englishSubject) {
      studentHits++;
      if (issues.length < 40) issues.push({ kind: "Student", rel });
    }
    if (AT_CH.test(t)) {
      atCh++;
      if (issues.length < 40) issues.push({ kind: "AT/CH", rel });
    }
    if (englishSubject) continue;
    const lines = t.split(/\r?\n/);
    for (const line of lines) {
      const s = line.trim();
      if (!s || /^\|/.test(s)) continue;
      if (stillEnglishInstructional(s) || EN_MARKERS.test(s)) {
        enInstr++;
        if (issues.length < 60) issues.push({ kind: "EN-instr", rel, line: s.slice(0, 160) });
      }
    }
  }
  return { files: files.length, gradeHits, studentHits, enInstr, atCh, issues };
}

function scanLocales() {
  const dir = path.join(ROOT, "locales/de-DE");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  const issues = [];
  let student = 0;
  let grade = 0;
  let atCh = 0;
  const enAdultNs = new Set(["school", "teacher", "reports", "copilot", "emails", "legal", "platform", "seo"]);
  const childNs = new Set(["learning", "games", "ui"]);
  for (const f of files) {
    const ns = f.replace(/\.json$/, "");
    const obj = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    const blob = JSON.stringify(obj);
    if (/\bStudents?\b/.test(blob)) {
      student++;
      issues.push({ kind: "Student", ns });
    }
    if (/\bGrade\s*[1-6]\b/.test(blob)) {
      grade++;
      issues.push({ kind: "Grade", ns });
    }
    if (AT_CH.test(blob)) {
      atCh++;
      issues.push({ kind: "AT/CH", ns });
    }
    // crude du/Sie mix in same string
    for (const s of flattenStrings(obj)) {
      const hasDu = /\b(du|dein|deine|deinen|deinem|deiner|dich|dir)\b/i.test(s);
      const hasSie = /\b(Sie|Ihr|Ihre|Ihren|Ihrem|Ihrer|Ihnen)\b/.test(s);
      if (hasDu && hasSie && !/Leo Kids/.test(s)) {
        issues.push({ kind: "duSie-mix", ns, s: s.slice(0, 140) });
      }
      // English leftovers in UI strings (short heuristic)
      if (
        !ns.includes("seo") &&
        /\b(Click|Please |Welcome back|Sign in|Log out|Settings|Save changes|Cancel|Submit|Loading|Error|Success|Try again)\b/.test(s)
      ) {
        issues.push({ kind: "EN-ui", ns, s: s.slice(0, 140) });
      }
    }
    void enAdultNs;
    void childNs;
  }
  return { namespaces: files.length, student, grade, atCh, issues: issues.slice(0, 80) };
}

async function scanScience() {
  const { SCIENCE_EN_OVERLAY } = await import(pathToFileUrl(path.join(ROOT, "data/science-questions-en-overlay.js")));
  const { SCIENCE_DE_DE_OVERLAY } = await import(pathToFileUrl(path.join(ROOT, "data/science-questions-de-DE-overlay.js")));
  const enIds = Object.keys(SCIENCE_EN_OVERLAY).sort();
  const deIds = Object.keys(SCIENCE_DE_DE_OVERLAY).sort();
  const missing = enIds.filter((id) => !SCIENCE_DE_DE_OVERLAY[id]);
  const optMismatch = [];
  const enLeak = [];
  let atCh = 0;
  for (const id of enIds) {
    const en = SCIENCE_EN_OVERLAY[id];
    const de = SCIENCE_DE_DE_OVERLAY[id];
    if (!de) continue;
    if ((en.options || []).length !== (de.options || []).length) optMismatch.push(id);
    const blob = [de.stem, ...(de.options || []), de.explanation].join("\n");
    if (AT_CH.test(blob)) atCh++;
    if (EN_MARKERS.test(blob) || stillEnglishInstructional(blob)) {
      if (enLeak.length < 40) enLeak.push({ id, sample: blob.slice(0, 120) });
    }
    // leftover English function density in stem
    const stem = String(de.stem || "");
    if (/\b(the|and|with|that|which|because|What is|Which of|How many|Choose the)\b/i.test(stem)) {
      if (enLeak.length < 40) enLeak.push({ id, sample: stem.slice(0, 120) });
    }
  }
  return {
    en: enIds.length,
    de: deIds.length,
    missing: missing.length,
    optMismatch: optMismatch.length,
    atCh,
    enLeak: enLeak.length,
    enLeakSamples: enLeak.slice(0, 15),
  };
}

function pathToFileUrl(p) {
  const u = path.resolve(p).replace(/\\/g, "/");
  return "file:///" + encodeURI(u).replace(/#/g, "%23");
}

function scanPacks() {
  const files = walk(path.join(ROOT, "content-packs/de-DE"), (n) => n.endsWith(".json"));
  const issues = [];
  let grade = 0;
  let student = 0;
  let atCh = 0;
  let parseFail = 0;
  for (const f of files) {
    const rel = path.relative(path.join(ROOT, "content-packs/de-DE"), f).replace(/\\/g, "/");
    let obj;
    try {
      obj = JSON.parse(fs.readFileSync(f, "utf8"));
    } catch {
      parseFail++;
      issues.push({ kind: "parse", rel });
      continue;
    }
    const blob = JSON.stringify(obj);
    if (/\bGrade\s*[1-6]\b/.test(blob)) {
      grade++;
      if (issues.length < 50) issues.push({ kind: "Grade", rel });
    }
    if (/\bStudents?\b/.test(blob)) {
      student++;
      if (issues.length < 50) issues.push({ kind: "Student", rel });
    }
    if (AT_CH.test(blob)) {
      atCh++;
      if (issues.length < 50) issues.push({ kind: "AT/CH", rel });
    }
  }
  return { files: files.length, grade, student, atCh, parseFail, issues: issues.slice(0, 40) };
}

async function scanHelp() {
  const mod = await import(pathToFileUrl(path.join(ROOT, "data/help-center/de-DE/index.js")));
  const arts = mod.ALL_ARTICLES_DE_DE || [];
  const issues = [];
  let student = 0;
  let grade = 0;
  let atCh = 0;
  for (const a of arts) {
    const blob = JSON.stringify(a);
    if (/\bStudents?\b/.test(blob)) student++;
    if (/\bGrade\s*[1-6]\b/.test(blob)) grade++;
    if (AT_CH.test(blob)) atCh++;
    if (/\b(Click here|Please |How to |Getting started)\b/i.test(blob)) {
      issues.push({ kind: "EN", slug: a.slug, s: String(a.title || "").slice(0, 80) });
    }
  }
  return { articles: arts.length, student, grade, atCh, issues: issues.slice(0, 20) };
}

async function main() {
  const books = scanBooks();
  const locales = scanLocales();
  const science = await scanScience();
  const packs = scanPacks();
  const help = await scanHelp();
  const report = { books, locales, science, packs, help };
  fs.writeFileSync(
    path.join(ROOT, "scripts/i18n/_de-DE-closure-audit.json"),
    JSON.stringify(report, null, 2)
  );
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
