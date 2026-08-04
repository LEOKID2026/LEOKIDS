/**
 * Targeted fr-FR content-layer closure audit.
 * Run: node scripts/i18n/audit-fr-FR-closure.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(ent.name, p)) out.push(p);
  }
  return out;
}

function deepKeys(o, p = "", a = []) {
  if (o == null || typeof o !== "object") return a;
  if (Array.isArray(o)) {
    o.forEach((x, i) => deepKeys(x, `${p}[${i}]`, a));
    return a;
  }
  for (const [k, v] of Object.entries(o)) {
    const np = p ? `${p}.${k}` : k;
    a.push(np);
    deepKeys(v, np, a);
  }
  return a;
}

function collectStrings(o, a = []) {
  if (typeof o === "string") a.push(o);
  else if (Array.isArray(o)) o.forEach((x) => collectStrings(x, a));
  else if (o && typeof o === "object") Object.values(o).forEach((v) => collectStrings(v, a));
  return a;
}

function placeholders(s) {
  return [...String(s).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
}

function walkPh(en, fr, p, bad) {
  if (typeof en === "string" && typeof fr === "string") {
    const pe = placeholders(en);
    const pf = placeholders(fr);
    if (pe !== pf) bad.push({ path: p, en: pe, fr: pf, sample: String(fr).slice(0, 80) });
  } else if (en && typeof en === "object" && !Array.isArray(en) && fr && typeof fr === "object") {
    for (const k of Object.keys(en)) walkPh(en[k], fr[k], `${p}.${k}`, bad);
  } else if (Array.isArray(en) && Array.isArray(fr)) {
    for (let i = 0; i < en.length; i++) walkPh(en[i], fr[i], `${p}[${i}]`, bad);
  }
}

/** English instructional leakage (not protected educational targets). */
function looksEnglishInstruction(s, { allowBrand = true } = {}) {
  const t = String(s || "").trim();
  if (!t) return false;
  if (allowBrand && /^(Leo Kids|OK|A4|PDF|URL|SEO|ID|I am|You are|He is|She is|We are|They are)\b/.test(t)) {
    return false;
  }
  if (!/[A-Za-z]{3,}/.test(t)) return false;
  // Has French diacritics → likely FR
  if (/[àâäéèêëïîôùûüçœæ]/i.test(t)) return false;
  // Common EN instructional starters / phrases
  if (
    /^(Today|What|Which|Where|How|Why|When|Select|Choose|Click|Try|Continue|Look|Write|Solve|Practice|Please|Loading|Answer|Worksheet|Grade|Student|Teacher|Parent|Create|Open|Close|Save|Delete|Next|Back|Start|Finish|Check|Print|Preview)\b/.test(
      t,
    )
  ) {
    return true;
  }
  if (
    /\b(the|and|with|your|please|select|choose|worksheet|loading|continue|answer key|try again|word problems|number line)\b/i.test(
      t,
    ) &&
    !/\b(CP|CE1|CE2|CM1|CM2|6e|Mathématiques|Géométrie|Anglais|Sciences)\b/.test(t)
  ) {
    // Require enough English-looking tokens
    const words = t.split(/\s+/).filter((w) => /^[A-Za-z']+$/.test(w));
    if (words.length >= 4) return true;
  }
  return false;
}

async function main() {
  const report = {
    namespaces: {},
    packs: {},
    science: {},
    help: {},
    meanings: {},
    books: {},
    stems: {},
    leakage: {},
    tuVous: {},
    grades: {},
    etudiant: {},
  };

  // Namespaces
  const enNs = fs.readdirSync(path.join(ROOT, "locales/en")).filter((f) => f.endsWith(".json")).sort();
  const frNs = fs.readdirSync(path.join(ROOT, "locales/fr-FR")).filter((f) => f.endsWith(".json")).sort();
  report.namespaces.files = { en: enNs.length, fr: frNs.length, namesMatch: JSON.stringify(enNs) === JSON.stringify(frNs) };
  const keyMismatches = [];
  const phBad = [];
  const nsLeak = [];
  for (const f of enNs) {
    const en = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en", f), "utf8"));
    const fr = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/fr-FR", f), "utf8"));
    if (deepKeys(en).sort().join("|") !== deepKeys(fr).sort().join("|")) keyMismatches.push(f);
    walkPh(en, fr, f, phBad);
    const scan = (o, p) => {
      if (typeof o === "string") {
        if (looksEnglishInstruction(o)) nsLeak.push(`${f}:${p}=${o.slice(0, 100)}`);
      } else if (Array.isArray(o)) o.forEach((x, i) => scan(x, `${p}[${i}]`));
      else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) scan(v, `${p}.${k}`);
    };
    scan(fr, "");
  }
  report.namespaces.keyMismatches = keyMismatches;
  report.namespaces.placeholderMismatches = phBad.length;
  report.namespaces.placeholderSamples = phBad.slice(0, 10);
  report.namespaces.enLeakCount = nsLeak.length;
  report.namespaces.enLeakSamples = nsLeak.slice(0, 25);

  // Packs
  const enPacks = walk(path.join(ROOT, "content-packs/en"), (n) => n.endsWith(".json"));
  const frPacks = walk(path.join(ROOT, "content-packs/fr-FR"), (n) => n.endsWith(".json"));
  report.packs.counts = { en: enPacks.length, fr: frPacks.length };
  let packKeyBad = 0;
  let packPhBad = 0;
  let packLeak = 0;
  const packLeakSamples = [];
  for (const enFile of enPacks) {
    const rel = path.relative(path.join(ROOT, "content-packs/en"), enFile);
    const frFile = path.join(ROOT, "content-packs/fr-FR", rel);
    if (!fs.existsSync(frFile)) {
      packKeyBad += 1;
      continue;
    }
    const en = JSON.parse(fs.readFileSync(enFile, "utf8"));
    const fr = JSON.parse(fs.readFileSync(frFile, "utf8"));
    if (deepKeys(en).sort().join("|") !== deepKeys(fr).sort().join("|")) packKeyBad += 1;
    const bad = [];
    walkPh(en, fr, rel, bad);
    packPhBad += bad.length;
    for (const s of collectStrings(fr)) {
      if (looksEnglishInstruction(s)) {
        packLeak += 1;
        if (packLeakSamples.length < 25) packLeakSamples.push(`${rel}: ${s.slice(0, 100)}`);
      }
    }
  }
  report.packs.keyOrMissing = packKeyBad;
  report.packs.placeholderMismatches = packPhBad;
  report.packs.enLeakCount = packLeak;
  report.packs.enLeakSamples = packLeakSamples;

  // Science
  const enSci = (
    await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href)
  ).SCIENCE_EN_OVERLAY;
  const frSci = (
    await import(pathToFileURL(path.join(ROOT, "data/science-questions-fr-FR-overlay.js")).href)
  ).SCIENCE_FR_FR_OVERLAY;
  const enIds = Object.keys(enSci).sort();
  const frIds = Object.keys(frSci).sort();
  report.science.counts = { en: enIds.length, fr: frIds.length, idParity: JSON.stringify(enIds) === JSON.stringify(frIds) };
  let optBad = 0;
  let sciLeak = 0;
  const sciLeakSamples = [];
  for (const id of enIds) {
    const a = enSci[id];
    const b = frSci[id];
    if (!b) continue;
    if ((a.options || []).length !== (b.options || []).length) optBad += 1;
    for (const field of ["stem", "explanation", ...(b.options || []).map((_, i) => `opt${i}`), ...(b.theoryLines || []).map((_, i) => `th${i}`)]) {
      let val;
      if (field.startsWith("opt")) val = b.options?.[Number(field.slice(3))];
      else if (field.startsWith("th")) val = b.theoryLines?.[Number(field.slice(2))];
      else val = b[field];
      const enVal =
        field.startsWith("opt")
          ? a.options?.[Number(field.slice(3))]
          : field.startsWith("th")
            ? a.theoryLines?.[Number(field.slice(2))]
            : a[field];
      if (val && (val === enVal || looksEnglishInstruction(val))) {
        // identical single-token cognates OK if short and no spaces
        if (val === enVal && !/\s/.test(val) && val.length <= 12) continue;
        sciLeak += 1;
        if (sciLeakSamples.length < 20) sciLeakSamples.push(`${id}.${field}=${String(val).slice(0, 90)}`);
      }
    }
  }
  report.science.optionMismatches = optBad;
  report.science.enLeakCount = sciLeak;
  report.science.enLeakSamples = sciLeakSamples;

  // Help
  const helpFr = await import(pathToFileURL(path.join(ROOT, "data/help-center/fr-FR/index.js")).href);
  const parents = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/parents.js")).href);
  const students = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/students.js")).href);
  const reportA = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/parent-report.js")).href);
  const subjects = await import(pathToFileURL(path.join(ROOT, "data/help-center/content/subjects.js")).href);
  const enHelp = [
    ...parents.PARENT_ARTICLES,
    ...students.STUDENT_ARTICLES,
    ...reportA.PARENT_REPORT_ARTICLES,
    ...subjects.SUBJECT_ARTICLES,
  ];
  report.help.count = helpFr.ALL_ARTICLES_FR_FR.length;
  report.help.slugParity = helpFr.ALL_ARTICLES_FR_FR.every((a, i) => a.slug === enHelp[i]?.slug);
  let helpLeak = 0;
  const helpLeakSamples = [];
  for (const art of helpFr.ALL_ARTICLES_FR_FR) {
    for (const s of collectStrings(art)) {
      if (looksEnglishInstruction(s)) {
        helpLeak += 1;
        if (helpLeakSamples.length < 20) helpLeakSamples.push(`${art.slug}: ${s.slice(0, 90)}`);
      }
    }
  }
  report.help.enLeakCount = helpLeak;
  report.help.enLeakSamples = helpLeakSamples;

  // Meanings
  const { WORD_LISTS } = await import(pathToFileURL(path.join(ROOT, "data/english-questions/word-lists.js")).href);
  const { WORD_MEANINGS_FR_FR } = await import(
    pathToFileURL(path.join(ROOT, "data/english-questions/word-meanings/fr-FR.js")).href
  );
  let meaningTotal = 0;
  let meaningMissing = 0;
  let meaningEn = 0;
  for (const [cat, words] of Object.entries(WORD_LISTS)) {
    for (const id of Object.keys(words || {})) {
      meaningTotal += 1;
      const m = WORD_MEANINGS_FR_FR[cat]?.[id];
      if (m == null || !String(m).trim()) meaningMissing += 1;
      else if (String(m).toLowerCase() === String(id).toLowerCase() && !/^(bus|radio|pizza|taxi|yoga|film|sport)$/i.test(id)) {
        // gloss identical to English word id may be OK for cognates; flag longer ones
        if (id.length > 6) meaningEn += 1;
      }
    }
  }
  report.meanings = { total: meaningTotal, missing: meaningMissing, identicalLongGloss: meaningEn };

  // Books
  const enBooks = walk(path.join(ROOT, "docs/learning-book/en"), (n) => n.endsWith(".md"));
  const frBooks = walk(path.join(ROOT, "docs/learning-book/fr-FR"), (n) => n.endsWith(".md"));
  const enRels = enBooks.map((f) => path.relative(path.join(ROOT, "docs/learning-book/en"), f).replace(/\\/g, "/")).sort();
  const frRels = frBooks.map((f) => path.relative(path.join(ROOT, "docs/learning-book/fr-FR"), f).replace(/\\/g, "/")).sort();
  report.books.counts = { en: enRels.length, fr: frRels.length, pathParity: JSON.stringify(enRels) === JSON.stringify(frRels) };
  let bookLeakFiles = 0;
  let bookLeakLines = 0;
  const bookSamples = [];
  let gradeHits = 0;
  for (const f of frBooks) {
    const rel = path.relative(path.join(ROOT, "docs/learning-book/fr-FR"), f).replace(/\\/g, "/");
    const isEnglish = rel.startsWith("english/");
    const text = fs.readFileSync(f, "utf8");
    if (/\bGrade\s*[1-6]\b|\b1st Grade\b|\bYear\s*[1-6]\b/.test(text)) gradeHits += 1;
    let fileHas = false;
    for (const line of text.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("|") || t.startsWith("```") || t.startsWith("- `") || t.startsWith("`")) continue;
      if (/^#{1,6}\s+/.test(t) && isEnglish && /^(I am|You are|He is|She is|We are|They are)\b/.test(t.replace(/^#{1,6}\s+/, ""))) {
        continue;
      }
      if (isEnglish && /^(I|You|He|She|It|We|They)\b/.test(t) && t.split(/\s+/).length <= 8) continue;
      // quoted English targets
      if (/^".*"$/.test(t) && isEnglish) continue;
      if (looksEnglishInstruction(t) || (/^[A-Za-z ,.'’\-?!]+$/.test(t) && t.split(/\s+/).length >= 6 && !/[àâäéèêëïîôùûüç]/i.test(t))) {
        // allow metadata english field labels already handled
        if (/\*\*learning_page_id\*\*|\*\*skill_id\*\*|title_english/.test(t)) continue;
        bookLeakLines += 1;
        fileHas = true;
        if (bookSamples.length < 40) bookSamples.push(`${rel}: ${t.slice(0, 120)}`);
      }
    }
    if (fileHas) bookLeakFiles += 1;
  }
  report.books.gradeEnglishHits = gradeHits;
  report.books.enLeakFiles = bookLeakFiles;
  report.books.enLeakLines = bookLeakLines;
  report.books.enLeakSamples = bookSamples;

  // Global forbidden
  const allTextRoots = [
    ...frNs.map((f) => path.join(ROOT, "locales/fr-FR", f)),
    ...frPacks,
    path.join(ROOT, "data/science-questions-fr-FR-overlay.js"),
    ...walk(path.join(ROOT, "data/help-center/fr-FR"), (n) => n.endsWith(".js")),
    path.join(ROOT, "data/english-questions/word-meanings/fr-FR.js"),
    ...walk(path.join(ROOT, "utils/learning-content-fr-FR"), (n) => n.endsWith(".js")),
    ...frBooks,
  ];
  let etudiant = 0;
  let feuille = 0;
  let regional = 0;
  const etudiantSamples = [];
  for (const f of allTextRoots) {
    if (!fs.existsSync(f)) continue;
    const t = fs.readFileSync(f, "utf8");
    const e = t.match(/étudiant/gi) || [];
    etudiant += e.length;
    if (e.length && etudiantSamples.length < 10) etudiantSamples.push(path.relative(ROOT, f));
    feuille += (t.match(/feuille de calcul/gi) || []).length;
    regional += (t.match(/\b(septante|nonante|huitante|magasinage|courriel|clavarder)\b/gi) || []).length;
  }
  report.etudiant = { count: etudiant, samples: etudiantSamples };
  report.grades = {
    common: JSON.parse(fs.readFileSync(path.join(ROOT, "locales/fr-FR/common.json"), "utf8")),
    bookGradeEnglishHits: gradeHits,
  };
  report.forbidden = { feuilleCalcul: feuille, regional };

  // tu/vous broken patterns
  const tuVousBroken = [];
  const brokenRes = [
    /à tu /gi,
    /pourrons tu /gi,
    /Il tu /gi,
    /nous tu /gi,
    /payez-tu/gi,
    /ajoutez-tu/gi,
    /Choisissez.*\bton\b/gi,
    /Sélectionnez.*\bton\b/gi,
    /vous .* ton /gi,
    /tu .* votre /gi,
  ];
  for (const f of allTextRoots) {
    if (!fs.existsSync(f) || f.endsWith(".md") && f.includes(`${path.sep}english${path.sep}`)) continue;
    const t = fs.readFileSync(f, "utf8");
    for (const re of brokenRes) {
      if (re.test(t)) {
        tuVousBroken.push(path.relative(ROOT, f) + " :: " + re);
        break;
      }
    }
  }
  report.tuVous.brokenFiles = tuVousBroken.length;
  report.tuVous.samples = tuVousBroken.slice(0, 30);

  // Stems export check
  const math = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-fr-FR/math.js")).href);
  const geo = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-fr-FR/geometry.js")).href);
  report.stems = {
    math: typeof math.rebuildMathStemFrFr,
    geo: typeof geo.rebuildGeometryStemFrFr,
    money: String(
      math.rebuildMathStemFrFr({ params: { kind: "wp_pocket_money", money: 10, toy: 3 } }),
    ),
    circle: String(geo.rebuildGeometryStemFrFr({ params: { kind: "circle_area", radius: 5 } })),
  };

  const out = path.join(__dirname, "_fr-FR-closure-audit.json");
  fs.writeFileSync(out, JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));
  console.log("Wrote", out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
